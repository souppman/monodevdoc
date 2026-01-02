from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    # LLM Settings
    LLM_API_KEY: str
    LLM_BASE_URL: str = "https://openrouter.ai/api/v1"
    DEFAULT_MODEL: str = "deepseek/deepseek-chat"
    
    # Infrastructure
    PINECONE_API_KEY: str
    PINECONE_ENVIRONMENT: Optional[str] = "us-west1-gcp"
    PINECONE_INDEX_NAME: str = "devdoc-index"
    
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
