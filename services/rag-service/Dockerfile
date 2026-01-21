
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies (git is often needed for pip installing from git or some extensions)
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

# 1. Setup Dependencies
# Copy local shared packages first
COPY packages/contracts /app/packages/contracts

# Copy requirements
COPY services/rag-service/requirements.txt /app/services/rag-service/requirements.txt

# Install Python dependencies
# 1. Upgrade build tools to prevent source compilation hangs of libraries like tokenizers
RUN pip install --no-cache-dir --upgrade pip setuptools wheel

# 2. Optimize PyTorch installation (CPU only)
RUN pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu

# 3. Install requirements with --prefer-binary to ensure we use pre-built wheels
# This drastically speeds up build times and prevents compilation errors
ENV PIP_DEFAULT_TIMEOUT=100
RUN pip install --no-cache-dir --prefer-binary -r services/rag-service/requirements.txt

# Install local contracts package in editable mode or standard
RUN pip install --no-cache-dir -e ./packages/contracts

# 2. Setup Application
COPY services/rag-service /app/services/rag-service

# Set working directory to the service root
WORKDIR /app/services/rag-service

# Expose port
EXPOSE 8000

# Start Command
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
