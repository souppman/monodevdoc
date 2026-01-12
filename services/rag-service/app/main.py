from fastapi import FastAPI, HTTPException, Header
from typing import Optional
from pydantic import BaseModel
from devdoc_contracts import RAGIndexRequest
from app.schemas import RAGQueryRequest, RAGQueryResponse, RelevantContext
from app.config import settings
from app.services.rag_service import rag_service
import logging

# Configure Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="DevDoc RAG Service",
    description="AI-Powered Documentation Generator with Developer Journal",
    version="0.1.0"
)

@app.get("/")
async def root():
    return {"message": "DevDoc RAG Service is running"}

@app.post("/index")
async def index_document(request: RAGIndexRequest):
    """
    Accepts a RAGIndexRequest (journal entry, code file, etc.)
    Indexes it into Pinecone via LlamaIndex.
    """
    logger.info(f"Received indexing request for ID: {request.metadata.id}")
    try:
        vector_id = rag_service.index_request(request)
        return {"success": True, "vector_id": vector_id}
    except Exception as e:
        logger.error(f"Indexing failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/query", response_model=RAGQueryResponse)
async def query_documents(
    request: RAGQueryRequest,
    x_openrouter_key: Optional[str] = Header(None, alias="X-OpenRouter-Key"),
    x_openrouter_model: Optional[str] = Header(None, alias="X-OpenRouter-Model")
):
    """
    Accepts a RAGQueryRequest.
    Retrieves context and generates answer via DeepSeek.
    """
    logger.info(f"Received query: {request.query}")
    try:
        # Use header model if present, otherwise fallback to request body model
        model_to_use = x_openrouter_model if x_openrouter_model else request.model

        response = rag_service.query_request(
            query=request.query,
            project_id=request.project_id,
            filters=request.filters,
            top_k=request.top_k,
            model=model_to_use,
            doc_type=request.doc_type,
            doc_style=request.doc_style,
            api_key=x_openrouter_key
        )
        
        # Convert LlamaIndex response to our contract
        # response.source_nodes contains the retrieved chunks
        relevant_context = [
            RelevantContext(
                id=node.node.node_id,
                content=node.node.get_content(),
                score=node.score if node.score else 0.0,
                metadata=node.node.metadata
            )
            for node in response.source_nodes
        ]
        
        # Note: We might want to return the actual LLM answer too, 
        # but the current RAGQueryResponse only asks for results (context).
        # We will stick to the contract for strict compliance.
        
        return RAGQueryResponse(results=relevant_context, answer=str(response))
    except Exception as e:
        logger.error(f"Query failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

class ExportRequest(BaseModel):
    content: str
    filename: str

@app.post("/export")
async def export_document(request: ExportRequest):
    """
    Accepts content and a filename.
    Uploads to Supabase Storage (S3) and returns a public URL.
    """
    logger.info(f"Received export request for: {request.filename}")
    try:
        url = rag_service.export_document(request.content, request.filename)
        return {"success": True, "url": url}
    except Exception as e:
        logger.error(f"Export failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
