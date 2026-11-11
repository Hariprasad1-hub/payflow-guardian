# backend/app/models/ai_audit.py
from sqlalchemy import Column, Integer, String, DateTime, Text
from ..db import Base
import datetime

class AIActionLog(Base):
    """Log of AI‑generated actions (e.g., invoice drafts, reminders)."""
    __tablename__ = "ai_action_logs"

    id = Column(Integer, primary_key=True, index=True)
    action_type = Column(String, nullable=False)  # e.g., "invoice_draft", "reminder"
    payload = Column(Text, nullable=False)       # raw JSON or description
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    status = Column(String, default="pending")  # pending, completed, failed

