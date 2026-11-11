// src/utils/api.js
export const API_BASE = 'http://127.0.0.1:8000/api';

/**
 * Generic helper for JSON requests.
 * Throws an Error with a readable message on non‑2xx responses.
 */
export async function apiRequest(path, { method = 'GET', body = null } = {}) {
  const url = `${API_BASE}${path}`;
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };
  if (body) opts.body = JSON.stringify(body);

  const resp = await fetch(url, opts);
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`API error ${resp.status}: ${text || resp.statusText}`);
  }
  // 204 No Content returns null
  return resp.status === 204 ? null : resp.json();
}

