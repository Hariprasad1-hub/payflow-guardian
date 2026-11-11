# backend/app/schemas/invoice.py
from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, Field, validator
from enum import Enum

class InvoiceStatus(str, Enum):
    paid = "paid"
    pending = "pending"
    overdue = "overdue"
    draft = "draft"

class InvoiceBase(BaseModel):
    customer_id: int = Field(..., description="Foreign key to Customer")
    description: str = Field(..., max_length=255)
    amount: float = Field(..., gt=0)
    currency: str = Field(default="USD", max_length=3)
    issue_date: date = Field(...)
    due_date: date = Field(...)
    payment_method: Optional[str] = None
    paypal_order_id: Optional[str] = None

    @validator("due_date")
    def due_after_issue(cls, v, values):
        if "issue_date" in values and v < values["issue_date"]:
            raise ValueError("due_date must be after issue_date")
        return v

class InvoiceCreate(InvoiceBase):
    pass

class InvoiceRead(InvoiceBase):
    id: int
    status: InvoiceStatus
    paid_at: Optional[datetime] = None

    class Config:
        orm_mode = True

