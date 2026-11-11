// src/components/InvoiceCreateModal.jsx
import React, { useState, useEffect } from 'react';
import { X, Loader2, Check, AlertCircle } from 'lucide-react';
import { apiRequest } from '../utils/api';

/**
 * Modal that handles AI driven invoice creation.
 * Workflow:
 *   1. User types a free‑form request (e.g. "Create an invoice for Rahul …").
 *   2. The request is sent to POST /api/ai/parse-invoice.
 *   3. The parsed payload is merged with a real customer record:
 *        - Look up existing customers via GET /customers.
 *        - Match by email (preferred) or by name.
 *        - If no match, optionally create a new customer via POST /customers.
 *   4. The user can edit all invoice fields before confirming.
 *   5. On confirmation the final payload (including `customer_id`) is POSTed to /invoices.
 *   6. Successful creation triggers `onInvoiceCreated` callback and closes the modal.
 */
export const InvoiceCreateModal = ({ isOpen, onClose, onInvoiceCreated }) => {
  // UI steps
  const [step, setStep] = useState('input'); // 'input' | 'edit' | 'loading'
  const [nlInput, setNlInput] = useState('');
  const [parsed, setParsed] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [form, setForm] = useState({ description: '', amount: '', currency: '', issue_date: '', due_date: '' });
  const [error, setError] = useState(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep('input');
      setNlInput('');
      setParsed(null);
      setCustomerId(null);
      setForm({ description: '', amount: '', currency: '', issue_date: '', due_date: '' });
      setError(null);
    }
  }, [isOpen]);


  const handleParse = async () => {
    if (!nlInput.trim()) return;

    setError(null);
    setStep('loading');

    try {
      // 1. Parse the natural-language invoice request
      const requestBody = { raw_text: nlInput };

      console.log('Sending parse request body:', requestBody);

      const parsedRes = await apiRequest('/ai/parse-invoice', {
        method: 'POST',
        body: requestBody,
      });

      // 2. Extract the parsed invoice fields
      const {
        customer_name,
        customer_email,
        description,
        amount,
        currency,
        issue_date,
        due_date,
      } = parsedRes;

      // Do not create a customer if the AI could not identify one.
      if (!customer_name) {
        throw new Error('Customer name could not be identified. Please provide it clearly.');
      }

      // 3. Look up existing customers
      const customers = await apiRequest('/customers');

      const existing = customers.find((c) => {
        if (customer_email && c.email) {
          return c.email.toLowerCase() === customer_email.toLowerCase();
        }

        return c.name?.toLowerCase() === customer_name.toLowerCase();
      });

      let custId = existing?.id;

      // 4. Create a customer if one does not exist
      if (!custId) {
        const create = window.confirm(
          `Customer "${customer_name}" (${customer_email || 'no email'}) does not exist. Create a new customer?`
        );

        if (!create) {
          throw new Error('Customer creation cancelled by user.');
        }

        const newCust = await apiRequest('/customers', {
          method: 'POST',
          body: {
            name: customer_name,
            email: customer_email,
          },
        });

        custId = newCust.id;
      }

      // 5. Populate the editable invoice form
      setCustomerId(custId);

      setForm({
        description: description || '',
        amount: amount ?? '',
        currency: currency || '',
        issue_date: issue_date || '',
        due_date: due_date || '',
      });

      setParsed(parsedRes);
      setStep('edit');

    } catch (e) {
      console.error('Invoice parsing failed:', e);
      setError(e.message || 'Failed to parse input.');
      setStep('input');
    }
  };


  const handleSave = async () => {
    setError(null);
    setStep('loading');
    try {
      const payload = {
        customer_id: customerId,
        description: form.description,
        amount: Number(form.amount),
        currency: form.currency,
        issue_date: form.issue_date,
        due_date: form.due_date,
      };
      await apiRequest('/invoices', { method: 'POST', body: payload });
      if (onInvoiceCreated) onInvoiceCreated();
      onClose();
    } catch (e) {
      console.error(e);
      setError(e.message || 'Failed to create invoice.');
      setStep('edit');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-[#0E1626] rounded-xl w-full max-w-2xl p-6 border border-[#1E293B] relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-200">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-semibold text-white mb-4">
          {step === 'input' && 'Create Invoice – Natural Language'}
          {step === 'edit' && 'Review Extracted Invoice'}
        </h3>
        {error && (
          <div className="mb-3 p-3 rounded bg-rose-900/60 text-rose-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
        {step === 'input' && (
          <>
            <textarea
              placeholder="e.g. Create an invoice for Rahul for ₹8,000 for website development, due in 5 days."
              className="w-full h-32 bg-[#101827] border border-[#1E293B] rounded p-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/60"
              value={nlInput}
              onChange={(e) => setNlInput(e.target.value)}
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-slate-300 bg-[#101827] hover:bg-[#1A263D] rounded border border-[#1E293B]"
              >
                Cancel
              </button>
              <button
                onClick={handleParse}
                disabled={!nlInput.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded shadow"
              >
                Parse
              </button>
            </div>
          </>
        )}

        {step === 'loading' && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
            <span className="ml-2 text-slate-300">Processing…</span>
          </div>
        )}

        {step === 'edit' && (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Customer (ID)</label>
                <input
                  type="text"
                  readOnly
                  className="w-full bg-[#101827] border border-[#1E293B] rounded p-1.5 text-sm text-slate-300"
                  value={customerId}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Currency</label>
                <input
                  type="text"
                  value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value })}
                  className="w-full bg-[#101827] border border-[#1E293B] rounded p-1.5 text-sm text-slate-200"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-slate-400 mb-1">Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-[#101827] border border-[#1E293B] rounded p-1.5 text-sm text-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full bg-[#101827] border border-[#1E293B] rounded p-1.5 text-sm text-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Issue Date</label>
                <input
                  type="date"
                  value={form.issue_date}
                  onChange={(e) => setForm({ ...form, issue_date: e.target.value })}
                  className="w-full bg-[#101827] border border-[#1E293B] rounded p-1.5 text-sm text-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Due Date</label>
                <input
                  type="date"
                  value={form.due_date}
                  onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                  className="w-full bg-[#101827] border border-[#1E293B] rounded p-1.5 text-sm text-slate-200"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setStep('input')}
                className="px-4 py-2 text-sm text-slate-300 bg-[#101827] hover:bg-[#1A263D] rounded border border-[#1E293B]"
              >
                Back
              </button>
              <button
                onClick={handleSave}
                disabled={!customerId}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 rounded shadow"
              >
                <Check className="inline w-4 h-4 mr-1" /> Create Invoice
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

