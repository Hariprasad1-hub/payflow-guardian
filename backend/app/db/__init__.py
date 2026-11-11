# backend/app/db/__init__.py
import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from ..core.config import settings

# Use aiosqlite for async SQLite driver
DATABASE_URL = settings.DATABASE_URL.replace('sqlite:///', 'sqlite+aiosqlite:///')

engine = create_async_engine(
    DATABASE_URL,
    echo=False,  # set True for SQL debugging
    future=True,
)

# AsyncSession factory
AsyncSessionLocal = sessionmaker(
    bind=engine, class_=AsyncSession, expire_on_commit=False, autoflush=False, autocommit=False
)

# Base class for models
Base = declarative_base()

# Dependency for FastAPI routes
async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session

