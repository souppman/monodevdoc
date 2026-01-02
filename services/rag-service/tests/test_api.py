from fastapi.testclient import TestClient
from unittest.mock import MagicMock, patch
from app.main import app
from devdoc_contracts import RAGIndexRequest
from datetime import datetime

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "DevDoc RAG Service is running"}

@patch("app.services.rag_service.rag_service.index_request")
def test_index_endpoint(mock_index):
    # Setup Mock
    mock_index.return_value = "test_entry_1"

    payload = {
        "content": "def hello_world(): print('hello')",
        "metadata": {
            "id": "test_entry_1",
            "source": "journal",
            "project_id": "proj_1",
            "author_id": "user_1",
            "created_at": datetime.now().isoformat(),
            "git_commit_hash": "abc1234",
            "file_path": "/src/main.py",
            "git_branch": "main",
            "repo_url": "https://github.com/my-org/my-repo"
        }
    }
    
    response = client.post("/index", json=payload)
    
    assert response.status_code == 200
    assert response.json() == {"success": True, "vector_id": "test_entry_1"}
    mock_index.assert_called_once()

@patch("app.services.rag_service.rag_service.query_request")
def test_query_endpoint(mock_query):
    # Setup Mock Response
    mock_response = MagicMock()
    # Simulate LlamaIndex Response object structure
    mock_node = MagicMock()
    # Pydantic needs actual strings/dicts, not Mocks
    mock_node.node.node_id = "auth_doc_1" 
    mock_node.node.get_content.return_value = "Authentication logic..."
    mock_node.node.metadata = {"id": "auth_doc_1", "file_path": "/auth.py"}
    mock_node.score = 0.95
    
    # The real service returns a Response object
    mock_response.response = "Here is the answer."
    mock_response.source_nodes = [mock_node]
    mock_query.return_value = mock_response

    payload = {
        "query": "how does auth work?",
        "project_id": "proj_1",
        "top_k": 5,
        "model": "openai/gpt-4o" # Test that model param is accepted
    }
    
    response = client.post("/query", json=payload)
    
    assert response.status_code == 200
    data = response.json()
    # Contract RAGQueryResponse only returns results, not the top-level answer.
    # assert "answer" in data
    assert len(data["results"]) == 1
    assert data["results"][0]["metadata"]["id"] == "auth_doc_1"
    
    # Verify model param was passed to service
    mock_query.assert_called_with(
        query="how does auth work?",
        filters=None, # The API does not automatically construct filters from top-level fields yet
        top_k=5,
        model="openai/gpt-4o"
    )
