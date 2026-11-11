import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core import config
from .db import engine, Base, get_db
from .routers import health, invoices, payments, dashboard, ai

# Configure logging
logging.basicConfig(level=config.settings.LOG_LEVEL)
logger = logging.getLogger(__name__)

app = FastAPI(title="PayFlow Guardian Backend", version=config.settings.VERSION)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix="/api")
app.include_router(invoices.router, prefix="/api")
app.include_router(payments.router, prefix="/api")
app.include_router(ai.router, prefix="/api/ai")


# Create database tables on startup
@app.on_event("startup")
async def on_startup():
    logger.info("Creating database tables if not exist")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# Shutdown event
@app.on_event("shutdown")
async def on_shutdown():
    await engine.dispose()

