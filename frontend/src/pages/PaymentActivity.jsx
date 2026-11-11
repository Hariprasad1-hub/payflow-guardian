import React, { useState } from 'react';
import { 
  Receipt, 
  ArrowDownLeft, 
  Search, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  Filter,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { DEMO_TRANSACTIONS } from '../data/demoData';

export const PaymentActivity = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTxns = DEMO_TRANSACTIONS.filter((t) => 
    t.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#1E293B]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Payment Activity
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 font-mono">
              PayPal IPN Verified
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Settled transactions, fee breakdowns, and PayPal Sandbox payment event logs.
          </p>
        </div>
        <button
          onClick={() => alert("CSV Export (Demo Data): In production this streams authenticated transaction logs.")}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#131D2F] hover:bg-[#1C2A44] text-slate-200 border border-[#1E293B] text-xs font-medium transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Ledger CSV</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#0E1626] border border-[#1E293B]">
          <span className="text-xs text-slate-400 uppercase font-mono block mb-1">Gross Inflows (MTD)</span>
          <span className="text-xl font-bold font-mono text-white">$10,670.00</span>
          <span className="text-[11px] text-slate-500 block mt-1">Processed via PayPal Sandbox</span>
        </div>
        <div className="p-4 rounded-xl bg-[#0E1626] border border-[#1E293B]">
          <span className="text-xs text-slate-400 uppercase font-mono block mb-1">Estimated Fees</span>
          <span className="text-xl font-bold font-mono text-slate-300">$282.75</span>
          <span className="text-[11px] text-slate-500 block mt-1">Standard 2.9% + $0.30 tier</span>
        </div>
        <div className="p-4 rounded-xl bg-[#0E1626] border border-[#1E293B]">
          <span className="text-xs text-slate-400 uppercase font-mono block mb-1">Net Settled</span>
          <span className="text-xl font-bold font-mono text-emerald-400">$10,387.25</span>
          <span className="text-[11px] text-emerald-500/80 block mt-1">100% reconciled</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between gap-4 bg-[#0E1626] p-4 rounded-xl border border-[#1E293B]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search transaction ID or client..."
            className="w-full bg-[#101827] border border-[#1E293B] rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/60"
          />
        </div>
        <span className="text-xs font-mono text-slate-400">
          Showing {filteredTxns.length} records
        </span>
      </div>

      {/* Transactions Table */}
      <div className="rounded-xl bg-[#0E1626] border border-[#1E293B] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1E293B] bg-[#0A0F1D] text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
                <th className="py-3 px-5">Transaction & ID</th>
                <th className="py-3 px-5">Invoice Reference</th>
                <th className="py-3 px-5">Payer Details</th>
                <th className="py-3 px-5">Gross Amount</th>
                <th className="py-3 px-5">Gateway Fee</th>
                <th className="py-3 px-5">Net Payout</th>
                <th className="py-3 px-5">Timestamp</th>
                <th className="py-3 px-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B] text-xs">
              {filteredTxns.map((txn) => (
                <tr key={txn.id} className="hover:bg-[#111A2E] transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="font-mono text-purple-300 font-semibold">{txn.id}</div>
                    <div className="text-[10px] text-slate-500 font-mono">PP Ref: {txn.transactionId}</div>
                  </td>
                  <td className="py-3.5 px-5 font-mono text-slate-300">
                    {txn.invoiceId}
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="font-medium text-slate-200">{txn.client}</div>
                    <div className="text-[10px] text-slate-500">PayPal Express Checkout</div>
                  </td>
                  <td className="py-3.5 px-5 font-mono text-white font-semibold">
                    +${txn.amount.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-5 font-mono text-slate-400 text-[11px]">
                    -${txn.fee.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-5 font-mono text-emerald-400 font-semibold">
                    +${txn.net.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-5 font-mono text-slate-400 text-[11px]">
                    {txn.date}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

