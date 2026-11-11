# backend/app/schemas/ai.py
from pydantic import BaseModel, Field, validator
from datetime import date, datetime
from typing import Optional, Literal

class ParseInvoiceRequest(BaseModel):
    raw_text: str = Field(..., description="Natural language invoice description")

class ParsedInvoice(BaseModel):
    customer_name: str
    customer_email: Optional[str] = None
    description: str
    amount: Optional[float] = None
    currency: str = Field(default="INR")
    currency: str = Field(default="INR")
    issue_date: date
    due_date: date
    payment_terms: Optional[str] = None

    @validator('amount')
    def amount_positive(cls, v):
        # Allow null (None) for optional amounts; otherwise ensure positive
        if v is None:
            return v
        if v <= 0:
            raise ValueError('Amount must be positive')
        return v

    @validator('currency')
    def currency_supported(cls, v):
        # For now only accept common ISO codes
        if len(v) not in (3,):
            raise ValueError('Currency must be a 3‑letter ISO code')
        return v.upper()

class GenerateReminderRequest(BaseModel):
    invoice_id: int = Field(..., description="ID of the overdue invoice")

class ReminderResponse(BaseModel):
    reminder_text: str
    invoice_id: int

class AssistantRequest(BaseModel):
    question: str = Field(..., description="User question for the AI assistant")

class AssistantResponse(BaseModel):
    answer: str
    data: Optional[dict] = None
    # data can contain raw DB rows when relevant

class AIActionLogCreate(BaseModel):
    action_type: str
    payload: str
    status: Literal['pending','completed','failed'] = 'pending'

