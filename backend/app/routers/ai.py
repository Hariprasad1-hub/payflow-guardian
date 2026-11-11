# backend/app/routers/ai.py
"""AI integration routes.
Provides:
- POST /api/ai/parse-invoice – turn free‑form text into a structured invoice payload.
- POST /api/ai/generate-reminder – create a polite overdue‑payment reminder for an invoice.
- POST /api/ai/assistant – answer simple finance‑related queries using the SQLite data.
All actions are logged in the `ai_action_logs` table.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
import re
from datetime import date, timedelta, datetime

from ..db import get_db
from ..models import Invoice, InvoiceStatus, Payment, Customer, AIActionLog
from ..schemas.ai import (
    ParseInvoiceRequest,
    ParsedInvoice,
    GenerateReminderRequest,
    ReminderResponse,
    AssistantRequest,
    AssistantResponse,
    AIActionLogCreate,
)
from ..core.config import settings

router = APIRouter()

def _log_action(db: AsyncSession, action_type: str, payload: str, status_str: str = "pending"):
    log = AIActionLog(action_type=action_type, payload=payload, status=status_str)
    db.add(log)
    return log

# ---------------------------------------------------------------------------
# A. Natural‑language invoice parsing
# ---------------------------------------------------------------------------
@router.post(
    "/parse-invoice",
    response_model=ParsedInvoice,
    summary="Parse free‑form invoice description using Gemini (or fallback)",
)
async def parse_invoice(req: ParseInvoiceRequest, db: AsyncSession = Depends(get_db)):
    raw = req.raw_text.strip()
    # Log the request first (pending)
    action_log = _log_action(db, "parse_invoice", raw, "pending")
    await db.flush()  # obtain a row id for the log if needed

    # -------------------------------------------------------------------
    # 1️⃣ Try real Gemini call if API key is present
    # -------------------------------------------------------------------
    if settings.GEMINI_API_KEY:
        try:
            import google.generativeai as genai
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel('gemini-1.5-flash')
            prompt = (
                "Extract the following fields from the given text and return a JSON object with exactly these keys: "
                "customer_name, customer_email, description, amount, currency, issue_date, due_date, payment_terms. "
                "If a field cannot be determined, set it to null. Dates should be ISO (YYYY‑MM‑DD). "
                "Text: " + raw
            )
            response = model.generate_content(prompt)
            data = response.text
            # Gemini returns a JSON‑like string – attempt a safe eval
            import json
            parsed = json.loads(data)
        except Exception as exc:
            # Mark log as failed and raise a user‑friendly error
            action_log.status = "failed"
            await db.commit()
            raise HTTPException(status_code=502, detail=f"Gemini API error: {exc}")
    else:
        # -------------------------------------------------------------------
        # 2️⃣ Fallback simple heuristic parser (demo mode)
        # -------------------------------------------------------------------
        # Example: "Create an invoice for Rahul for ₹8,000 for website development, due in 5 days."
        # Extract amount (₹ sign optional) and numeric value
        amount_match = re.search(r"[₹$]?\s*([0-9,]+(?:\.[0-9]+)?)", raw)
        amount = float(amount_match.group(1).replace(",", "")) if amount_match else 0.0
        # Currency – default to INR if ₹ present, else USD
        currency = "INR" if "₹" in raw else "USD"
        # Customer name – assume the word after "for" before the next "for" or "to"
        name_match = re.search(r"invoice for ([A-Za-z ]+?) for", raw, re.IGNORECASE)
        if not name_match:
            name_match = re.search(r"invoice for ([A-Za-z ]+?)(,|$)", raw, re.IGNORECASE)
        customer_name = name_match.group(1).strip() if name_match else "Unknown"
        # Description – take text after the second "for" up to a comma or "due"
        desc_match = re.search(r"for [A-Za-z ]+ for (.+?)(,| due|\.|$)", raw, re.IGNORECASE)
        description = desc_match.group(1).strip() if desc_match else "Service"
        # Due date – look for "due in X days"
        days_match = re.search(r"due in (\d+) days", raw, re.IGNORECASE)
        due_in_days = int(days_match.group(1)) if days_match else 30
        issue_date = date.today()
        due_date = issue_date + timedelta(days=due_in_days)
        payment_terms = f"Net {due_in_days}"
        parsed = {
            "customer_name": customer_name,
            "customer_email": None,
            "description": description,
            "amount": amount,
            "currency": currency,
            "issue_date": issue_date.isoformat(),
            "due_date": due_date.isoformat(),
            "payment_terms": payment_terms,
        }

    # Validate via Pydantic model (will raise if something is wrong)
    try:
        parsed_invoice = ParsedInvoice(**parsed)
    except Exception as exc:
        action_log.status = "failed"
        await db.commit()
        raise HTTPException(status_code=422, detail=str(exc))

    # Mark log as completed
    action_log.status = "completed"
    await db.commit()
    return parsed_invoice

# ---------------------------------------------------------------------------
# B. Generate overdue reminder
# ---------------------------------------------------------------------------
@router.post(
    "/generate-reminder",
    response_model=ReminderResponse,
    summary="Create a polite reminder text for an overdue invoice",
)
async def generate_reminder(req: GenerateReminderRequest, db: AsyncSession = Depends(get_db)):
    # Log request
    action_log = _log_action(db, "generate_reminder", f"invoice_id={req.invoice_id}", "pending")
    await db.flush()

    inv_res = await db.execute(select(Invoice).where(Invoice.id == req.invoice_id))
    invoice = inv_res.scalar_one_or_none()
    if not invoice:
        action_log.status = "failed"
        await db.commit()
        raise HTTPException(status_code=404, detail="Invoice not found")
    if invoice.status != InvoiceStatus.overdue:
        action_log.status = "failed"
        await db.commit()
        raise HTTPException(status_code=400, detail="Invoice is not overdue")

    # Fetch customer
    cust_res = await db.execute(select(Customer).where(Customer.id == invoice.customer_id))
    customer = cust_res.scalar_one()

    # Simple reminder template (no real AI needed)
    reminder = (
        f"Subject: Overdue Invoice Reminder – {invoice.id}\n\n"
        f"Dear {customer.name},\n\n"
        f"Our records show that invoice #{invoice.id} for {invoice.description} "
        f"(amount {invoice.currency} {invoice.amount:,.2f}) was due on {invoice.due_date}. "
        "Please arrange payment at your earliest convenience. If you have already paid, kindly disregard this notice.\n\n"
        "Thank you,\nPayFlow Guardian Team"
    )

    # Log success
    action_log.status = "completed"
    await db.commit()
    return ReminderResponse(reminder_text=reminder, invoice_id=invoice.id)

# ---------------------------------------------------------------------------
# C. Simple assistant endpoint
# ---------------------------------------------------------------------------
@router.post(
    "/assistant",
    response_model=AssistantResponse,
    summary="Answer finance‑related questions using real DB data",
)
async def assistant(req: AssistantRequest, db: AsyncSession = Depends(get_db)):
    q = req.question.lower()
    action_log = _log_action(db, "assistant", req.question, "pending")
    await db.flush()

    answer = "I couldn't understand the request. Please ask about overdue invoices, pending payments, unpaid customers, or received payments."
    data = None

    if "overdue" in q and "invoice" in q:
        # List overdue invoices
        stmt = select(Invoice).where(Invoice.status == InvoiceStatus.overdue)
        res = await db.execute(stmt)
        overdue = res.scalars().all()
        answer = f"There are {len(overdue)} overdue invoice(s)."
        data = {"overdue_invoices": [
            {"id": inv.id, "customer_id": inv.customer_id, "amount": inv.amount, "due_date": str(inv.due_date)}
            for inv in overdue
        ]}
    elif "pending" in q and "payment" in q:
        stmt = select(func.coalesce(func.sum(Invoice.amount), 0)).where(Invoice.status == InvoiceStatus.pending)
        total = (await db.execute(stmt)).scalar_one()
        answer = f"Total pending amount is {total:.2f} (currency based on each invoice)."
    elif "unpaid" in q and "customer" in q:
        sub = select(Invoice.customer_id).where(Invoice.status != InvoiceStatus.paid)
        stmt = select(Customer).where(Customer.id.in_(sub))
        res = await db.execute(stmt)
        customers = res.scalars().all()
        answer = f"{len(customers)} customer(s) have unpaid invoices."
        data = {"customers": [{"id": c.id, "name": c.name, "email": c.email} for c in customers]}
    elif "payment" in q and "received" in q:
        stmt = select(Payment)
        res = await db.execute(stmt)
        payments = res.scalars().all()
        answer = f"{len(payments)} payment(s) have been recorded."
        data = {"payments": [
            {"id": p.id, "invoice_id": p.invoice_id, "amount": p.amount, "gateway": p.gateway, "paid_at": str(p.paid_at)}
            for p in payments
        ]}
    # else fallback answer stays generic

    action_log.status = "completed"
    await db.commit()
    return AssistantResponse(answer=answer, data=data)

