# backend/app/utils/paypal.py
"""Utility functions for PayPal Sandbox integration.

All calls are async and use httpx. The client secret never leaves the backend.
"""
import os
import base64
import time
from typing import Dict, Any
import httpx
from ..core.config import settings

# Cache the access token for its lifetime (approx 9h). Simple in‑memory cache.
_token_cache: Dict[str, Any] = {}

async def get_access_token() -> str:
    """Retrieve a PayPal OAuth2 access token using client‑id/secret.

    The token is cached until it expires (expires_in seconds).
    """
    global _token_cache
    now = int(time.time())
    if _token_cache.get("expires_at", 0) > now:
        return _token_cache["access_token"]

    client_id = settings.PAYPAL_CLIENT_ID
    client_secret = settings.PAYPAL_CLIENT_SECRET
    if not client_id or not client_secret:
        raise RuntimeError("PayPal credentials not configured in environment")

    token_url = f"{settings.PAYPAL_BASE_URL}/v1/oauth2/token"
    auth = base64.b64encode(f"{client_id}:{client_secret}".encode()).decode()
    headers = {
        "Authorization": f"Basic {auth}",
        "Content-Type": "application/x-www-form-urlencoded",
    }
    async with httpx.AsyncClient() as client:
        resp = await client.post(token_url, headers=headers, data="grant_type=client_credentials")
        resp.raise_for_status()
        data = resp.json()
        _token_cache = {
            "access_token": data["access_token"],
            "expires_at": now + int(data.get("expires_in", 0)) - 60,  # buffer 1 min
        }
        return _token_cache["access_token"]

async def create_order(invoice) -> Dict[str, Any]:
    """Create a PayPal order for the given invoice object.

    Returns the raw PayPal response JSON (including id and approve link).
    """
    access_token = await get_access_token()
    order_url = f"{settings.PAYPAL_BASE_URL}/v2/checkout/orders"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
    }
    order_payload = {
        "intent": "CAPTURE",
        "purchase_units": [
            {
                "reference_id": str(invoice.id),
                "amount": {
                    "currency_code": invoice.currency,
                    "value": f"{invoice.amount:.2f}",
                },
                "description": invoice.description,
            }
        ],
        "application_context": {
            "brand_name": "PayFlow Guardian",
            "shipping_preference": "NO_SHIPPING",
            "user_action": "PAY_NOW",
        },
    }
    async with httpx.AsyncClient() as client:
        resp = await client.post(order_url, headers=headers, json=order_payload)
        resp.raise_for_status()
        return resp.json()

async def capture_order(order_id: str) -> Dict[str, Any]:
    """Capture a previously created order.
    """
    access_token = await get_access_token()
    capture_url = f"{settings.PAYPAL_BASE_URL}/v2/checkout/orders/{order_id}/capture"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
    }
    async with httpx.AsyncClient() as client:
        resp = await client.post(capture_url, headers=headers)
        resp.raise_for_status()
        return resp.json()

