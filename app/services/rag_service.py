import logging
from llama_index.core import VectorStoreIndex, StorageContext, Document, Settings
from llama_index.vector_stores.pinecone import PineconeVectorStore
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.llms.openai_like import OpenAILike
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
        - Embeddings: Local HuggingFace (BAAI/bge-small-en-v1.5) - Fast, free, high quality.
        - LLM: DeepSeek (Remote) via OpenAI compatibility.
        """
        # Configure Embeddings (Local)
        # This avoids the DeepSeek embedding compatibility issue entirely.
        Settings.embed_model = HuggingFaceEmbedding(
            model_name="BAAI/bge-small-en-v1.5"
        )

        # Configure LLM (DeepSeek)
        # Use OpenAILike to avoid strict model name validation
        Settings.llm = OpenAILike(
            api_key=settings.OPENAI_API_KEY,
            api_base=settings.OPENAI_BASE_URL,
            model="deepseek-chat",
            temperature=0.1,
            is_chat_model=True
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

    def query_request(self, query: str, filters: dict = None, top_k: int = 10):
        """
        Queries the Pinecone index using DeepSeek for synthesis.
        """
        vector_store = self._get_vector_store()
        index = VectorStoreIndex.from_vector_store(vector_store=vector_store)

        # Build Metadata Filters if present
        from llama_index.core.vector_stores import MetadataFilters, ExactMatchFilter
        
        query_filters = None
        if filters:
            metadata_filters = [
                ExactMatchFilter(key=k, value=v) for k, v in filters.items()
            ]
            query_filters = MetadataFilters(filters=metadata_filters)

        # Create Query Engine
        query_engine = index.as_query_engine(
            filters=query_filters,
            similarity_top_k=top_k
        )

        response = query_engine.query(query)
        return response

rag_service = RAGService()
