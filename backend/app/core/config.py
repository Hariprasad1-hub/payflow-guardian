# backend/app/core/config.py
import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

# Load .env if exists
load_dotenv(BASE_DIR / '.env')

class Settings:
    # Database URL, defaults to local SQLite file in backend folder
    DATABASE_URL: str = os.getenv('DATABASE_URL', f"sqlite:///./payflow.db")
    # CORS origins for development (React dev server)
    ALLOWED_ORIGINS: list[str] = [origin.strip() for origin in os.getenv('ALLOWED_ORIGINS', 'http://localhost:5173').split(',')]
    # Frontend base URL for PayPal redirects
    FRONTEND_BASE: str = os.getenv('FRONTEND_BASE', 'http://localhost:5173')
    # Application version
    VERSION: str = "0.1.0"
    # Logging level
    LOG_LEVEL: str = os.getenv('LOG_LEVEL', 'INFO')
    # Gemini API key (optional – if missing, AI routes will error gracefully)
    GEMINI_API_KEY: str | None = os.getenv('GEMINI_API_KEY')
    # Database URL, defaults to local SQLite file in backend folder
    DATABASE_URL: str = os.getenv('DATABASE_URL', f"sqlite:///./payflow.db")
    # CORS origins for development (React dev server)
    ALLOWED_ORIGINS: list[str] = [origin.strip() for origin in os.getenv('ALLOWED_ORIGINS', 'http://localhost:5173').split(',')]
    # Application version
    VERSION: str = "0.1.0"
    # Logging level
    LOG_LEVEL: str = os.getenv('LOG_LEVEL', 'INFO')
    # Gemini API key (optional – if missing, AI routes will error gracefully)
    GEMINI_API_KEY: str | None = os.getenv('GEMINI_API_KEY')

settings = Settings()
