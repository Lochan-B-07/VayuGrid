"""
VayuGrid Configuration & Environment Settings
Handles API credentials, Gemini model parameters, and service configuration.
"""

from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment or .env file."""

    # Project Metadata
    PROJECT_NAME: str = "VayuGrid Intelligence Core"
    PROJECT_VERSION: str = "2.0.0"
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "INFO"

    # Google Gemini AI & Generative AI SDK
    GEMINI_API_KEY: Optional[str] = None
    GEMINI_MODEL: str = "gemini-3.5-flash-lite"
    GEMINI_TEMPERATURE: float = 0.0  # Zero-temperature for deterministic forensic audit

    # Google Cloud & Text-to-Speech
    GCP_PROJECT_ID: Optional[str] = None
    GCP_REGION: str = "asia-south1"
    GOOGLE_APPLICATION_CREDENTIALS: Optional[str] = None

    # Server Configuration
    BACKEND_HOST: str = "0.0.0.0"
    BACKEND_PORT: int = 8000
    VITE_BACKEND_URL: str = "http://localhost:8000"

    # Meteorological & Air Quality Data Sources
    OPENWEATHER_API_KEY: Optional[str] = None
    OPENWEATHER_API_URL: str = "https://api.openweathermap.org/data/2.5/weather"
    OPEN_METEO_API_URL: str = "https://api.open-meteo.com/v1/forecast"
    OPENAQ_API_KEY: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )


# Global singleton settings instance
settings = Settings()
