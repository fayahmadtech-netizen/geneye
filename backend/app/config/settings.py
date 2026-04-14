from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    # App Settings
    PROJECT_NAME: str = "GenEye Backend"
    API_V1_STR: str = "/api/v1"
    
    # Database Settings
    DATABASE_URL: str
    
    # CORS Settings
    ALLOWED_CORS_ORIGIN: str = "http://localhost:3000"
    
    # Client App URL
    CLIENT_URL: str = "http://localhost:3000"
    
    # Security Settings
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 days

    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
