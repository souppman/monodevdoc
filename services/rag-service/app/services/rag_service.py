import logging
import traceback
from llama_index.core import VectorStoreIndex, StorageContext, Document, Settings
from llama_index.vector_stores.pinecone import PineconeVectorStore
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.llms.openai_like import OpenAILike
from pinecone import Pinecone
from supabase import create_client, Client
from app.config import settings
from devdoc_contracts import RAGIndexRequest, RAGIndexMetadata

logger = logging.getLogger(__name__)

class RAGService:
    def __init__(self):
        self._initialize_settings()
        self._pc = Pinecone(api_key=settings.PINECONE_API_KEY)
        self._index_name = settings.PINECONE_INDEX_NAME
        
        # Initialize Supabase Client
        # We need SUPABASE_URL and SUPABASE_SERVICE_KEY in .env
        self._supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)

    def _initialize_settings(self):
        """
        Configure LlamaIndex globally.
        - Embeddings: Local HuggingFace (BAAI/bge-small-en-v1.5).
        - LLM: Configured per-request via OpenRouter headers.
        """
        # Configure Embeddings (Local)
        Settings.embed_model = HuggingFaceEmbedding(
            model_name="BAAI/bge-small-en-v1.5"
        )
        # Note: Settings.llm is NOT set globally. It must be provided in the query context.

    def _get_vector_store(self):
        pinecone_index = self._pc.Index(self._index_name)
        return PineconeVectorStore(pinecone_index=pinecone_index)

    def get_stats(self):
        """
        Returns stats from the underlying Pinecone index.
        """
        index = self._pc.Index(self._index_name)
        return index.describe_index_stats()

    def export_document(self, content: str, filename: str) -> str:
        """
        Uploads content to Supabase Storage and returns a public URL.
        """
        bucket_name = "doc_exports"
        try:
            # Upload (or overwrite) the file
            # Encode string to bytes for upload
            res = self._supabase.storage.from_(bucket_name).upload(
                file=content.encode('utf-8'),
                path=filename,
                file_options={"upsert": "true", "content-type": "text/markdown"}
            )
            
            # Get Public URL
            public_url = self._supabase.storage.from_(bucket_name).get_public_url(filename)
            logger.info(f"Exported document to {public_url}")
            return public_url
        except Exception as e:
            logger.error(f"Failed to export document: {e}")
            raise e

    def index_request(self, request: RAGIndexRequest) -> str:
        """
        Converts the contract request into a Document and indexes it in Pinecone.
        """
        logger.info(f"Indexing document: {request.metadata.id}")
        
        # Convert dictionary metadata to flat dict for Pinecone/LlamaIndex
        # LlamaIndex expects metadata values to be primitives or lists
        # model_dump() from Pydantic handles datetime -> string/etc conversions often needed
        meta_dict = request.metadata.model_dump(mode='json')
        
        # Remove None values as Pinecone does not support null metadata values
        meta_dict = {k: v for k, v in meta_dict.items() if v is not None}
        
        # Create Document
        doc = Document(
            text=request.content,
            metadata=meta_dict,
            id_=request.metadata.id,
            excluded_llm_metadata_keys=["git_commit_hash", "author_id"], # Keep these for filtering, maybe not for prompt context
            excluded_embed_metadata_keys=["git_commit_hash", "author_id"]
        )

        # Vector Store Setup
        vector_store = self._get_vector_store()
        storage_context = StorageContext.from_defaults(vector_store=vector_store)

        # Create/Update Index
        # from_documents handles the embedding generation and upsert
        VectorStoreIndex.from_documents(
            [doc],
            storage_context=storage_context,
            show_progress=True
        )
        
        logger.info(f"Successfully indexed {request.metadata.id}")
        return request.metadata.id


    def query_request(self, query: str, project_id: str, filters: dict = None, top_k: int = 10, model: str = None, doc_type: str = "Technical", doc_style: str = "Technical (Default)", api_key: str = None):
        """
        Queries the Pinecone index with an optional model preference, doc_type prompt, and doc_style tone.
        """
        try:
            vector_store = self._get_vector_store()
            index = VectorStoreIndex.from_vector_store(vector_store=vector_store)

            # Strict Validation: API Key and Model must be provided via headers/context
            if not api_key:
                raise ValueError("Missing OpenRouter API Key. Please ensure it is set in Web App Settings.")
            
            if not model:
                raise ValueError("Missing OpenRouter Model. Please ensure it is set in Web App Settings.")

            if not project_id:
                raise ValueError("Missing project_id. Data isolation is strictly enforced.")

            # Configure LLM dynamically for this request
            llm = OpenAILike(
                api_key=api_key,
                api_base="https://openrouter.ai/api/v1", # Hardcoded OpenRouter URL as per strict requirement
                model=model,
                is_chat_model=True,
                temperature=0.1
            )
            
            # Build Metadata Filters if present
            from llama_index.core.vector_stores import MetadataFilters, ExactMatchFilter
            
            query_filters = None
            
            # Build Metadata Filters
            # STRICT ENFORCEMENT: Always filter by project_id
            from llama_index.core.vector_stores import MetadataFilters, ExactMatchFilter
            
            metadata_filters = [
                ExactMatchFilter(key="project_id", value=project_id)
            ]

            if filters:
                for k, v in filters.items():
                    metadata_filters.append(ExactMatchFilter(key=k, value=v))
            
            query_filters = MetadataFilters(filters=metadata_filters)
            
            # Create Query Engine
            query_engine = index.as_query_engine(
                llm=llm,
                filters=query_filters,
                similarity_top_k=top_k
            )

            # Prompt Engineering based on Doc Type
            templates = {
                "Architecture Documentation": (
                    "You are a Senior Software Architect. "
                    "Analyze the provided context (code snippets and journal entries) to document the system's architecture. "
                    "Focus on components, data flow, patterns, and high-level structure. "
                ),
                "Requirements": (
                    "You are a Business Analyst. "
                    "Analyze the code and comments to reverse-engineer the functional and non-functional requirements. "
                    "List them clearly as 'User Stories' or 'System Requirements'. "
                ),
                "User Guide": (
                    "You are a Technical Writer. "
                    "Write a user-friendly guide explaining how to use the features found in the context. "
                    "Avoid jargon where possible and focus on user flows. "
                ),
                "API Reference": (
                    "You are a Developer Advocate. "
                    "Document the API endpoints, request/response formats, and authentication methods found in the code. "
                    "Use OpenAPI/Swagger style descriptions. "
                ),
                "Technical": (
                    "You are a Senior Developer. "
                    "Answer the technical question based on the provided code context. "
                    "Just answer the question."
                )
            }

            # Tone/Style Modifiers
            style_modifiers = {
                "Technical (Default)": "Use precise technical terminology. Be concise and professional.",
                "Beginner Friendly": "Explain complex concepts simply. Use analogies where appropriate. Assume the reader is a junior developer.",
                "Comprehensive": "Be extremely detailed. Cover edge cases, implementation details, and rationale. Leave no stone unturned.",
                "Minimal": "Be extremely concise. Bullet points preferred. Only essential information."
            }

            base_template = templates.get(doc_type, templates["Technical"])
            style_instruction = style_modifiers.get(doc_style, style_modifiers["Technical (Default)"])

            final_template_str = (
                f"{base_template}\n"
                f"Style Constraint: {style_instruction}\n\n"
                "Context: {context_str}\n\n"
                "Question: {query_str}"
            )
            
            # LlamaIndex allows updating the prompt template
            from llama_index.core import PromptTemplate
            new_summary_tmpl = PromptTemplate(final_template_str)
            query_engine.update_prompts(
                {"response_synthesizer:text_qa_template": new_summary_tmpl}
            )

            logger.info(f"Executing query with model {model or 'default'}")
            response = query_engine.query(query)
            
            return response

        except Exception as e:
            error_msg = f"CRITICAL ERROR in query_request: {str(e)}\nTraceback: {traceback.format_exc()}\n"
            logger.error(error_msg)
            raise e

rag_service = RAGService()
