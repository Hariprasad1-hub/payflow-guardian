# backend/app/models/invoice.py
from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, Enum, DateTime
from sqlalchemy.orm import relationship
from ..db import Base
import enum

class InvoiceStatus(str, enum.Enum):
    paid = "paid"
    pending = "pending"
    overdue = "overdue"
    draft = "draft"

class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False, index=True)
    description = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String(3), default="USD")
    issue_date = Column(Date, nullable=False)
    due_date = Column(Date, nullable=False)
    status = Column(Enum(InvoiceStatus), default=InvoiceStatus.draft, nullable=False)
    payment_method = Column(String, nullable=True)
    paypal_order_id = Column(String, nullable=True, unique=True)
    paid_at = Column(DateTime, nullable=True)

    # Relationships
    customer = relationship("Customer", back_populates="invoices")
    payments = relationship("Payment", back_populates="invoice", cascade="all, delete-orphan")

