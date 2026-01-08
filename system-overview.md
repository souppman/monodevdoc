Core Concept & Value Proposition
DevDoc automates developer documentation by intelligently merging two information streams: your **codebase** and your **development journal**. Unlike generic documentation generators, it uses structured journal notes attached to specific commits and branches as guided prompts for an AI, ensuring the generated documentation is accurate, context rich, and directly relevant to the developer's actual work and intent.

System Architecture
The system is built as a set of independent, modular services that communicate via strict API contracts. This design isolates complexity, making the system testable, scalable, and easier to maintain.

*   **Next.js Frontend (`apps/web`):** The user interface for writing journal entries and browsing documentation.
*   **Backend-for-Frontend (BFF / API Gateway) (`services/bff`):** A dedicated Next.js API layer that orchestrates all frontend requests, aggregating data from the backend services (Journal and RAG).
*   **Journal & Git Service (`services/journal-service`):** The "context weaver." It manages journal entries, captures Git metadata, and links notes to commits, branches, and tickets.
*   **RAG & AI Service (`services/rag-service`):** The "brain." It indexes code and journal text into vectors, retrieves relevant context, and uses LLMs to generate non-generic documentation.
*   **External Services:** GitHub (webhooks), Supabase (primary database & auth), Pinecone (vector storage for embeddings), OpenAI/Claude (LLMs), and S3 (for doc exports).

Critical API Contracts (The Glue)
The success of the modular design hinges on these defined data exchanges:

1.  **Journal → AI Service (Indexing):** The `Journal Service` sends a `RAGIndexRequest` to the AI service whenever new content is created. This request packages the **text content** with critical **metadata** (like `git_commit_hash`, `file_path`, `author_id`), solving the "wiring" problem at the source.
2.  **BFF → AI Service (Query/Generation):** The BFF sends a `RAGQueryRequest` with a user's question and filters. The AI service uses Retrieval-Augmented Generation (RAG) to fetch the most relevant code and journal snippets from Pinecone and instructs an LLM to synthesize an answer or document.
3.  **Frontend/BFF → Journal Service (CRUD):** The frontend creates journal entries with automatically captured `git_context`, ensuring every note is intrinsically linked to a specific state of the code.