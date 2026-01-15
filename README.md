# DevDoc Monorepo

Unified repository for DevDoc services and shared contracts.

##  Repository Structure 

- **`apps/web`**: Next.js Frontend (UI).
- **`services/bff`**: Next.js BFF (API Gateway/Orchestration).
- **`services/journal-service`**: Node.js Express service with Prisma.
- **`services/rag-service`**: FastAPI Python service for RAG.
- **`packages/contracts`**: Shared API type definitions (TypeScript & Python).

##  Getting Started

### Prerequisites
- [pnpm](https://pnpm.io/) (v9+)
- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) (v3.11+)

### Installation
From the root directory:
```bash
pnpm install
```

### Build Everything
```bash
pnpm run build
```

##  Service Development

### Journal Service (Node.js)
```bash
# Run in development mode
pnpm --filter devdoc-journal-service dev

# Database migrations
cd services/journal-service
npx prisma migrate dev
```

### RAG Service (Python)
```bash
cd services/rag-service

# Setup virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
pip install -e ../../packages/contracts
```

### Shared Contracts
If you modify types in `packages/contracts`, rebuild them to sync with other services:
```bash
pnpm --filter devdoc-contracts build
```

##  Monorepo Commands

- `pnpm run build`: Build all packages and services.
- `pnpm run test`: Run tests across the entire workspace.
- `pnpm -r <command>`: Run a command in every package.

