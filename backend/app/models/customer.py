# backend/app/models/customer.py
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from ..db import Base

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    # Relationship to invoices
    invoices = relationship(
        "Invoice",
        back_populates="customer",
        cascade="all, delete-orphan",
    )
