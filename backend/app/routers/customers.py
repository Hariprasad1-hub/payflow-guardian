# backend/app/routers/customers.py
"""Customer CRUD endpoints.
Provides:
- GET /customers – list all customers
- POST /customers – create a new customer (email must be unique)
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, insert
from sqlalchemy.exc import IntegrityError

from ..db import get_db
from ..models import Customer
from pydantic import BaseModel, EmailStr, Field

router = APIRouter()

class CustomerCreate(BaseModel):
    name: str = Field(..., max_length=100)
    email: EmailStr

class CustomerRead(BaseModel):
    id: int
    name: str
    email: EmailStr

    class Config:
        orm_mode = True

@router.get("/customers", response_model=list[CustomerRead], summary="List customers")
async def list_customers(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Customer).order_by(Customer.id))
    return result.scalars().all()

@router.post(
    "/customers",
    response_model=CustomerRead,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new customer",
)
async def create_customer(payload: CustomerCreate, db: AsyncSession = Depends(get_db)):
    new_customer = Customer(name=payload.name, email=payload.email)
    db.add(new_customer)
    try:
        await db.commit()
        await db.refresh(new_customer)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=400, detail="Email already exists")
    return new_customer

