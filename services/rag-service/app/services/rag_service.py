import logging
import traceback
from llama_index.core import VectorStoreIndex, StorageContext, Document, Settings
from llama_index.vector_stores.pinecone import PineconeVectorStore
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.llms.openai import OpenAI
from pinecone import Pinecone
from app.config import settings
from devdoc_contracts import RAGIndexRequest, RAGIndexMetadata

logger = logging.getLogger(__name__)

class RAGService:
    def __init__(self):
        self._initialize_settings()
        self._pc = Pinecone(api_key=settings.PINECONE_API_KEY)
        self._index_name = settings.PINECONE_INDEX_NAME

    def _initialize_settings(self):
        """
        Configure LlamaIndex globally.
        - Embeddings: Local HuggingFace (BAAI/bge-small-en-v1.5).
        - LLM: OpenRouter (Unified API for DeepSeek, GPT, etc.)
        """
        # Configure Embeddings (Local)
        Settings.embed_model = HuggingFaceEmbedding(
            model_name="BAAI/bge-small-en-v1.5"
        )

        # Configure Default LLM via OpenRouter
        # Using OpenAI client instead of OpenAILike for better stability
        Settings.llm = OpenAI(
            api_key=settings.LLM_API_KEY,
            api_base=settings.LLM_BASE_URL,
            model=settings.DEFAULT_MODEL,
            temperature=0.1
        )

    def _get_vector_store(self):
        pinecone_index = self._pc.Index(self._index_name)
        return PineconeVectorStore(pinecone_index=pinecone_index)

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

    def query_request(self, query: str, filters: dict = None, top_k: int = 10, model: str = None, doc_type: str = "Technical", doc_style: str = "Technical (Default)", api_key: str = None):
        """
        Queries the Pinecone index with an optional model preference, doc_type prompt, and doc_style tone.
        """
        try:
            with open("debug_error.log", "a") as f:
                f.write(f"Entering query_request. Params: model={model}, key_provided={'Yes' if api_key else 'No'}\n")
                f.flush()

            vector_store = self._get_vector_store()
            index = VectorStoreIndex.from_vector_store(vector_store=vector_store)

            # Apply specific model for this query if provided, otherwise use default
            # If api_key is provided in request, prioritize it over settings
            llm = Settings.llm
            if model or api_key:
                used_model = model if model else settings.DEFAULT_MODEL
                
                # Use provided key OR fallback to env var
                key_to_use = api_key if api_key else settings.LLM_API_KEY
                
                with open("debug_error.log", "a") as f:
                    f.write(f"Init LLM - Model: {used_model}, Key Length: {len(key_to_use) if key_to_use else 0}\n")
                    f.flush()
                
                if not key_to_use:
                    raise ValueError("No API Key available. Please set LLM_API_KEY in .env or provide 'settings_openrouter_key' in frontend request.")

                llm = OpenAI(
                    api_key=key_to_use,
                    api_base=settings.LLM_BASE_URL,
                    model=used_model,
                    temperature=0.1
                )
            
            with open("debug_error.log", "a") as f:
                f.write("LLM Setup Complete. Building filters...\n")
                f.flush()

            # Build Metadata Filters if present
            from llama_index.core.vector_stores import MetadataFilters, ExactMatchFilter
            
            query_filters = None
            if filters:
                metadata_filters = [
                    ExactMatchFilter(key=k, value=v) for k, v in filters.items()
                ]
                query_filters = MetadataFilters(filters=metadata_filters)
            
            with open("debug_error.log", "a") as f:
                f.write("Filters built. Creating query engine...\n")
                f.flush()

            # Create Query Engine
            query_engine = index.as_query_engine(
                llm=llm,
                filters=query_filters,
                similarity_top_k=top_k
            )

            with open("debug_error.log", "a") as f:
                f.write("Query engine created. Updating prompts...\n")
                f.flush()

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

            with open("debug_error.log", "a") as f:
                f.write(f"Prompts updated. Executing query with model {model or 'default'}...\n")
                f.flush()

            logger.info(f"Executing query with model {model or 'default'}")
            response = query_engine.query(query)
            
            with open("debug_error.log", "a") as f:
                f.write("Query executed successfully.\n")
                f.flush()

            return response

        except Exception as e:
            error_msg = f"CRITICAL ERROR in query_request: {str(e)}\nTraceback: {traceback.format_exc()}\n"
            with open("debug_error.log", "a") as f:
                f.write(error_msg)
                f.flush()
            logger.error(error_msg)
            raise e

rag_service = RAGService()
