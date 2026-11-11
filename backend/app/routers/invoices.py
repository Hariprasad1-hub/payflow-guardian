# backend/app/routers/invoices.py
"""Invoice CRUD endpoints.
Provides:
- GET /invoices – list all invoices (demo data)
- POST /invoices – create a new invoice (validation via Pydantic)
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from ..db import get_db
from ..models import Invoice, Customer, InvoiceStatus
from ..schemas.invoice import InvoiceCreate, InvoiceRead

router = APIRouter()

@router.get("/invoices", response_model=list[InvoiceRead], summary="List invoices")
async def list_invoices(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Invoice).order_by(Invoice.id.desc()))
    invoices = result.scalars().all()
    return invoices

@router.post(
    "/invoices",
    response_model=InvoiceRead,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new invoice",
)
async def create_invoice(payload: InvoiceCreate, db: AsyncSession = Depends(get_db)):
    # Verify customer exists
    cust_res = await db.execute(select(Customer).where(Customer.id == payload.customer_id))
    customer = cust_res.scalar_one_or_none()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    # Create invoice instance
    invoice = Invoice(**payload.dict(), status=InvoiceStatus.draft)
    db.add(invoice)
    await db.commit()
    await db.refresh(invoice)
    return invoice

