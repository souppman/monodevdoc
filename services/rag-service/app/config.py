from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    # LLM Settings
    # All LLM configuration is now dynamic via request headers (OpenRouter)
    # LLM_API_KEY, LLM_BASE_URL, and DEFAULT_MODEL are removed to enforce this.

    
    # Infrastructure
    PINECONE_API_KEY: str
    PINECONE_ENVIRONMENT: Optional[str] = "us-west1-gcp"
    PINECONE_INDEX_NAME: str = "devdoc-index"

    # Supabase (Storage)
    SUPABASE_URL: str
    SUPABASE_SERVICE_KEY: str
    
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
