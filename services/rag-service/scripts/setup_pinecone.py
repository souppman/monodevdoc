import logging
import sys
import os
import time

# Add root directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from pinecone import Pinecone, ServerlessSpec
from app.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def setup_pinecone():
    pc = Pinecone(api_key=settings.PINECONE_API_KEY)
    index_name = settings.PINECONE_INDEX_NAME
    
    # Check if index exists
    existing_indexes = [i.name for i in pc.list_indexes()]
    
    if index_name in existing_indexes:
        logger.info(f"Index '{index_name}' exists. Checking dimensions...")
        desc = pc.describe_index(index_name)
        if desc.dimension != 384:
            logger.warning(f"Dimension mismatch (Found {desc.dimension}, Expected 384). Deleting...")
            pc.delete_index(index_name)
            time.sleep(5) # Wait for deletion
        else:
            logger.info("Index verified.")
            return

    logger.info(f"Creating index '{index_name}'...")
    try:
        pc.create_index(
            name=index_name,
            dimension=384, # BGE-small-en-v1.5 dimension
            metric="cosine",
            spec=ServerlessSpec(
                cloud="aws",
                region="us-east-1"
            )
        )
        logger.info("Index verification initiated. Waiting for readiness...")
        while not pc.describe_index(index_name).status['ready']:
            time.sleep(1)
        logger.info(f"Index '{index_name}' created and ready.")
    except Exception as e:
            logger.error(f"Failed to create index: {e}")
            sys.exit(1)

if __name__ == "__main__":
    setup_pinecone()
