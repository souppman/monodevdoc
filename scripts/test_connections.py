import sys
import os

# Add root directory to sys.path to allow importing 'app'
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from pinecone import Pinecone
from openai import OpenAI
from app.config import settings
import logging

# Configure Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_connections():
    print("Testing Connections...")
    
    # Test OpenAI
    try:
        if not settings.OPENAI_API_KEY or settings.OPENAI_API_KEY.startswith("sk-placeholder"):
            logger.warning("OPENAI_API_KEY is not set or is a placeholder. Skipping OpenAI test.")
        else:
            client = OpenAI(
                api_key=settings.OPENAI_API_KEY,
                base_url=settings.OPENAI_BASE_URL
            )
            # Use 'deepseek-chat' or similar model for testing if using Deepseek, 
            # or just list models to verify auth.
            models = client.models.list()
            logger.info(f"✅ OpenAI/Deepseek Connection Successful. Available models: {[m.id for m in models.data][:3]}...")
    except Exception as e:
        logger.error(f"❌ OpenAI Connection Failed: {e}")

    # Test Pinecone
    try:
        if not settings.PINECONE_API_KEY or settings.PINECONE_API_KEY.startswith("pc-placeholder"):
            logger.warning("PINECONE_API_KEY is not set or is a placeholder. Skipping Pinecone test.")
        else:
            pc = Pinecone(api_key=settings.PINECONE_API_KEY)
            # List indexes to verify auth
            indexes = pc.list_indexes()
            logger.info(f"✅ Pinecone Connection Successful. Indexes: {indexes}")
    except Exception as e:
        logger.error(f"❌ Pinecone Connection Failed: {e}")

if __name__ == "__main__":
    # Ensure current directory is in path so we can import app
    sys.path.append(os.getcwd())
    test_connections()
