from pydantic import BaseModel, Field
from typing import Optional, List, Literal
from datetime import datetime

# RAGIndexRequest and RAGIndexMetadata are imported from devdoc_contracts
# see app/main.py for usage.

class RAGQueryRequest(BaseModel):
    query: str
    project_id: str
    filters: Optional[dict] = None
    top_k: int = 10
    model: Optional[str] = None

class RelevantContext(BaseModel):
    id: str
    content: str
    score: float
    metadata: dict

class RAGQueryResponse(BaseModel):
    results: List[RelevantContext]
