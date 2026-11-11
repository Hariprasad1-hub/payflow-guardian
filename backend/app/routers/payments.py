# backend/app/routers/payments.py
"""Payment endpoints.
Provides:
- GET /payments – list all payments
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from ..db import get_db
from ..models import Payment
from ..schemas.payment import PaymentRead

router = APIRouter()

from decimal import Decimal
from datetime import datetime

from ..models import Invoice, Payment, InvoiceStatus
from ..schemas.payment import PaymentRead
from ..utils import paypal
from sqlalchemy import select, update
from sqlalchemy.exc import IntegrityError

@router.get("/payments", response_model=list[PaymentRead], summary="List payments")
async def list_payments(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Payment).order_by(Payment.id.desc()))
    payments = result.scalars().all()
    return payments

# Capture PayPal order and record payment
@router.post("/payments/capture/{order_id}", response_model=PaymentRead, summary="Capture PayPal order", status_code=status.HTTP_201_CREATED)
async def capture_payment(order_id: str, db: AsyncSession = Depends(get_db)):
    # Retrieve PayPal capture response
    capture = await paypal.capture_order(order_id)
    # Validate capture status
    if capture.get("status") != "COMPLETED":
        raise HTTPException(status_code=400, detail="PayPal capture not completed")

    # Extract purchase unit info (assumes single unit)
    purchase_units = capture.get("purchase_units", [])
    if not purchase_units:
        raise HTTPException(status_code=400, detail="Missing purchase_units in capture response")
    pu = purchase_units[0]
    reference_id = pu.get("reference_id")
    if not reference_id:
        raise HTTPException(status_code=400, detail="Missing reference_id in purchase unit")

    # Find invoice by ID (reference_id) and ensure order ID matches
    result = await db.execute(select(Invoice).where(Invoice.id == int(reference_id)))
    invoice: Invoice = result.scalar_one_or_none()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    if invoice.paypal_order_id != order_id:
        raise HTTPException(status_code=400, detail="Order ID does not match invoice record")
    if invoice.status == InvoiceStatus.paid:
        raise HTTPException(status_code=400, detail="Invoice already paid")

    # Amount validation using Decimal
    amount_info = pu.get("payments", [{}])[0].get("amount", {})
    captured_value = Decimal(str(amount_info.get("value", "0")))
    captured_currency = amount_info.get("currency_code")
    if captured_currency != invoice.currency:
        raise HTTPException(status_code=400, detail="Currency mismatch")
    if captured_value != Decimal(str(invoice.amount)):
        raise HTTPException(status_code=400, detail="Amount mismatch")

    # Optional fee / net amount
    breakdown = pu.get("payments", [{}])[0].get("seller_receivable_breakdown", {})
    fee = breakdown.get("paypal_fee", {}).get("value")
    net = breakdown.get("net_amount", {}).get("value")
    fee_decimal = Decimal(str(fee)) if fee is not None else None
    net_decimal = Decimal(str(net)) if net is not None else None

    # Transaction ID (capture ID)
    capture_id = capture.get("id")
    if not capture_id:
        raise HTTPException(status_code=400, detail="Missing capture ID")

    # Idempotency: ensure no existing payment with this transaction_id
    existing = await db.execute(select(Payment).where(Payment.transaction_id == capture_id))
    if existing.scalar_one_or_none():
        # Return existing payment record
        existing_payment = existing.scalar_one()
        return existing_payment

    # Record payment within transaction
    new_payment = Payment(
        invoice_id=invoice.id,
        amount=float(captured_value),
        currency=captured_currency,
        fee=float(fee_decimal) if fee_decimal is not None else None,
        net_amount=float(net_decimal) if net_decimal is not None else None,
        status="Completed",
        gateway="PayPal",
        transaction_id=capture_id,
        paid_at=datetime.fromisoformat(capture.get("update_time").replace('Z','+00:00')) if capture.get("update_time") else datetime.utcnow(),
    )
    try:
        db.add(new_payment)
        # Update invoice status
        invoice.status = InvoiceStatus.paid
        invoice.paid_at = new_payment.paid_at
        await db.commit()
        await db.refresh(new_payment)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=400, detail="Payment already recorded")
    return new_payment

async def list_payments(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Payment).order_by(Payment.id.desc()))
    payments = result.scalars().all()
    return payments

