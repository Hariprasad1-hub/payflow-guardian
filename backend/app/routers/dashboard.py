# backend/app/routers/dashboard.py
"""Dashboard aggregation endpoints.
Provides:
- GET /stats – summary metrics for the dashboard KPIs.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from ..db import get_db
from ..models import Invoice, InvoiceStatus

router = APIRouter()

@router.get("/stats", summary="Dashboard statistics")
async def get_dashboard_stats(db: AsyncSession = Depends(get_db)):
    # Total revenue (sum of paid invoices)
    total_rev_stmt = select(func.coalesce(func.sum(Invoice.amount), 0)).where(Invoice.status == InvoiceStatus.paid)
    pending_rev_stmt = select(func.coalesce(func.sum(Invoice.amount), 0)).where(Invoice.status == InvoiceStatus.pending)
    overdue_rev_stmt = select(func.coalesce(func.sum(Invoice.amount), 0)).where(Invoice.status == InvoiceStatus.overdue)
    pending_cnt_stmt = select(func.count()).where(Invoice.status == InvoiceStatus.pending)
    overdue_cnt_stmt = select(func.count()).where(Invoice.status == InvoiceStatus.overdue)

    total_rev = (await db.execute(total_rev_stmt)).scalar_one()
    pending_rev = (await db.execute(pending_rev_stmt)).scalar_one()
    overdue_rev = (await db.execute(overdue_rev_stmt)).scalar_one()
    pending_cnt = (await db.execute(pending_cnt_stmt)).scalar_one()
    overdue_cnt = (await db.execute(overdue_cnt_stmt)).scalar_one()

    return {
        "total_revenue": float(total_rev),
        "pending_payments": float(pending_rev),
        "pending_count": pending_cnt,
        "overdue_invoices": float(overdue_rev),
        "overdue_count": overdue_cnt,
    }

