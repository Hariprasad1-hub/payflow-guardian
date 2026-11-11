# backend/app/models/payment.py
from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from ..db import Base

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(Integer, ForeignKey("invoices.id"), nullable=False, index=True)
    amount = Column(Float, nullable=False)
    currency = Column(String(3), default="USD")
    fee = Column(Float, nullable=True)
    net_amount = Column(Float, nullable=True)
    status = Column(String, nullable=False, default="Completed")
    gateway = Column(String, nullable=True)
    transaction_id = Column(String, nullable=True, unique=True)
    paid_at = Column(DateTime, nullable=False)

    invoice = relationship("Invoice", back_populates="payments")

