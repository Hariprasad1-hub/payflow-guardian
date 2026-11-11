# backend/app/routers/health.py
from fastapi import APIRouter

router = APIRouter()

@router.get("/health", summary="Health check endpoint")
async def health_check():
    """Simple health endpoint used by monitoring and the frontend during dev."""
    return {"status": "ok", "message": "PayFlow Guardian backend is running"}

