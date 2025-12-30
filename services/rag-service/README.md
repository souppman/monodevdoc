# DevDoc RAG & AI Service

The **RAG & AI Service** is the "brain" of the DevDoc platform. It provides a standalone API for indexing developer journals with Git context and retrieving them to generate intelligent, context-aware documentation.

Part of the **DevDoc** ecosystem, it strictly adheres to the API contracts defined in `devdoc-contracts`.

## 🏗 Architecture

*   **Framework**: FastAPI (Python 3.11+)
*   **Orchestration**: LlamaIndex
*   **Vector Database**: Pinecone (Serverless)
*   **LLM**: DeepSeek (via OpenAI-compatible API)
*   **Embeddings**: Local HuggingFace (`BAAI/bge-small-en-v1.5`)
*   **Contracts**: `devdoc-contracts` (Shared Types)

## 🚀 Getting Started

### Prerequisites

*   Python 3.10+
*   Pinecone API Key
*   DeepSeek API Key

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/souppman/devdoc-rag-service.git
    cd devdoc-rag-service
    ```

2.  Create and activate a virtual environment:
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

### Configuration

Copy the example environment file and configure your keys:

```bash
cp .env.example .env
```

Edit `.env`:
```ini
OPENAI_API_KEY=sk-...         # Your DeepSeek API Key
OPENAI_BASE_URL=https://api.deepseek.com
PINECONE_API_KEY=pc-...       # Your Pinecone API Key
PINECONE_INDEX_NAME=devdoc-dev
PINECONE_ENVIRONMENT=us-east-1
```

### Initialization

Initialize the Pinecone index (creates `devdoc-dev` with dimension 384 for BGE-small):

```bash
python scripts/setup_pinecone.py
```

## 🏃‍♂️ Running the Service

Start the development server:

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`.
Interactive documentation is available at `http://localhost:8000/docs`.

## 🧪 Testing

Run the test suite (includes connectivity and contract validation):

```bash
pytest
```

## 🔌 API Endpoints

### `POST /index`
Indexes a journal entry or code file.
*   **Input**: `RAGIndexRequest` (Contracts)
*   **Process**: Generates local embeddings + Upserts to Pinecone.

### `POST /query`
Retrieves context and generates an answer.
*   **Input**: `RAGQueryRequest`
*   **Process**: Vector Search (Pinecone) -> RAG Synthesis (DeepSeek).

## 📜 DevDoc Constitution Compliance
This service complies with **Architecture Ver 2.0**:
*   Modularity: Logic isolated in `app/services/rag_service.py`.
*   Contracts: Imports strict types from `devdoc-contracts`.
*   Zero-Mock: Uses live LlamaIndex pipelines (Phase 2).
