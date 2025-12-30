from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    OPENAI_API_KEY: str
    OPENAI_BASE_URL: str = "https://api.deepseek.com"
    PINECONE_API_KEY: str
    PINECONE_ENVIRONMENT: Optional[str] = "us-west1-gcp" # Example default
    PINECONE_INDEX_NAME: str = "devdoc-index"
    
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
