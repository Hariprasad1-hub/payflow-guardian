import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  ExternalLink,
  Send,
  Copy,
  Check,
  AlertCircle,
  Clock,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { InvoiceCreateModal } from '../components/InvoiceCreateModal';
import { ReminderModal } from '../components/ReminderModal';
import { apiRequest } from '../utils/api';

export const Invoices = ({ onSelectInvoice, onInvoiceCreated }) => {
  // State for invoices
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // UI interaction state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderText, setReminderText] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Filtering / search
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Fetch invoices from backend
  const fetchInvoices = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const data = await apiRequest('/invoices');
      setInvoices(data);
    } catch (e) {
      console.error(e);
      setFetchError(e.message || 'Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Wrapper callbacks for parent components (if any)
  const handleSelectInvoice = (invoice) => {
    if (onSelectInvoice) {
      onSelectInvoice(invoice);
    } else {
      console.log('Invoice selected:', invoice);
    }
  };

  const handleInvoiceCreated = async (newInvoice) => {
    // After a new invoice is created, refresh the list
    await fetchInvoices();
    if (onInvoiceCreated) {
      onInvoiceCreated(newInvoice);
    } else {
      console.log('Invoice created:', newInvoice);
    }
  };

  const handleCopyLink = (id) => {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Apply filters to the current invoice list
  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus = filterStatus === 'all' || inv.status === filterStatus;
    const matchesSearch =
      inv.client?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.id?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#1E293B]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Invoices
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono font-normal">
              {invoices.length} Total
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage billing lifecycles, PayPal Sandbox payment links and follow-up dispatches.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-medium shadow-md shadow-purple-900/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Invoice</span>
        </button>
      </div>

      {/* Loading / Error / Empty states */}
      {loading && (
        <div className="flex items-center justify-center py-8 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          Loading invoices…
        </div>
      )}
      {fetchError && (
        <div className="p-3 rounded bg-rose-900/60 text-rose-200 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {fetchError}
        </div>
      )}
      {!loading && !fetchError && invoices.length === 0 && (
        <div className="p-3 rounded bg-slate-800/60 text-slate-200 text-center">
          No invoices found. Click "Create New Invoice" to add one.
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0E1626] p-4 rounded-xl border border-[#1E293B]">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client, ID, or description..."
            className="w-full bg-[#101827] border border-[#1E293B] rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/60"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          {['all', 'paid', 'pending', 'overdue'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                filterStatus === status
                  ? 'bg-purple-900/60 text-purple-200 border border-purple-600/50'
                  : 'bg-[#101827] text-slate-400 hover:text-slate-200 border border-[#1E293B]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table of Invoices */}
      <div className="rounded-xl bg-[#0E1626] border border-[#1E293B] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1E293B] bg-[#0A0F1D] text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
                <th className="py-3 px-5">Invoice</th>
                <th className="py-3 px-5">Client & Service</th>
                <th className="py-3 px-5">Amount</th>
                <th className="py-3 px-5">Dates (Issued / Due)</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5">PayPal Sandbox Order</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B] text-xs">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-[#111A2E] transition-colors">
                  <td className="py-4 px-5">
                    <span className="font-mono text-purple-300 font-semibold block">{invoice.id}</span>
                    <span className="text-[10px] text-slate-500">Standard Net-14</span>
                  </td>
                  <td className="py-4 px-5">
                    <div className="font-semibold text-slate-200">{invoice.client}</div>
                    <div className="text-[11px] text-slate-400 max-w-xs truncate">{invoice.description}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{invoice.clientEmail}</div>
                  </td>
                  <td className="py-4 px-5 font-mono text-white font-semibold">
                    ${invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-4 px-5 font-mono text-[11px] text-slate-400">
                    <div>{invoice.issueDate}</div>
                    <div className={invoice.status === 'overdue' ? 'text-rose-400 font-medium' : 'text-slate-500'}>
                      Due: {invoice.dueDate}
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <StatusBadge status={invoice.status} />
                  </td>
                  <td className="py-4 px-5">
                    <div className="font-mono text-[11px] text-slate-300">{invoice.paypalOrderId}</div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Sandbox Ready
                    </div>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleCopyLink(invoice.id)}
                        title="Copy PayPal payment URL"
                        className="p-1.5 rounded bg-[#101827] hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-[#1E293B] transition-colors cursor-pointer"
                      >
                        {copiedId === invoice.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {invoice.status === 'overdue' && (
                        <button
                          onClick={() => { if (typeof onGenerateFollowup === 'function') { onGenerateFollowup(invoice); } }}
                          title="Generate AI Follow-up draft"
                          className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/40 text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Remind</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleSelectInvoice(invoice)}
                        className="px-2.5 py-1 text-[11px] font-medium rounded bg-[#131D2F] hover:bg-purple-950/60 hover:text-purple-300 text-slate-300 border border-[#1E293B] transition-colors cursor-pointer"
                      >
                        Inspect
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Invoice Modal */}
      <InvoiceCreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onInvoiceCreated={handleInvoiceCreated}
      />
    </div>
  );
};