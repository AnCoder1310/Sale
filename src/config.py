from functools import lru_cache
import os
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # App
    app_name: str = "VinFast Sales Coach VFO2O-20"
    app_env: Literal["development", "production", "test"] = "development"
    app_port: int = Field(default=8000, ge=1, le=65535)
    app_host: str = "0.0.0.0"
    log_level: Literal["DEBUG", "INFO", "WARNING", "ERROR"] = "INFO"
    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001"

    # 9Router Direct Settings
    #ninerouter_api_key: str = "sk-3de32802bddf729c-p3z5m1-7d22f262"
    #ninerouter_base_url: str = "http://127.0.0.1:20128/v1"
    #ninerouter_model: str = "gemini"

    # OpenRouter Compatibility Gateway
    #openrouter_api_key: str = "sk-3de32802bddf729c-p3z5m1-7d22f262"
    #openrouter_base_url: str = "http://127.0.0.1:20128/v1"
    #openrouter_model: str = "gemini"
    #llm_temperature: float = Field(default=0.3, ge=0.0, le=2.0)
    ninerouter_api_key: str = ""
    ninerouter_base_url: str = "http://127.0.0.1:20128/v1"
    ninerouter_model: str = "gemini"

    openrouter_api_key: str = ""
    openrouter_base_url: str = ""
    openrouter_model: str = "gemini"
    # OpenAI Fallback
    #openai_api_key: str = "sk-3de32802bddf729c-p3z5m1-7d22f262"
    #openai_base_url: str = "http://127.0.0.1:20128/v1"
    #model_name: str = "gemini"
    openai_api_key: str = ""
    openai_base_url: str = ""
    model_name: str = "gemini"
    # Database
    database_url: str = "sqlite:///./data/app.db"

    # Vector Store
    chroma_persist_dir: str = "./data/chroma"


@lru_cache
def get_settings() -> Settings:
    return Settings()
