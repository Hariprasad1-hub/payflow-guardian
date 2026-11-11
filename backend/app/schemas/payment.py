# backend/app/schemas/payment.py
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field

class PaymentBase(BaseModel):
    invoice_id: int = Field(..., description="Related invoice ID")
    amount: float = Field(..., gt=0)
    currency: str = Field(default="USD", max_length=3)
    fee: Optional[float] = None
    net_amount: Optional[float] = None
    status: str = Field(default="Completed")
    gateway: Optional[str] = None
    transaction_id: Optional[str] = None
    paid_at: datetime = Field(...)

class PaymentRead(PaymentBase):
    id: int

    class Config:
        orm_mode = True

