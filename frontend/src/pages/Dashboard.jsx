import React from 'react';
import { 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  ArrowUpRight, 
  Sparkles, 
  ShieldCheck, 
  Send, 
  ExternalLink,
  ChevronRight,
  Receipt
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { DEMO_METRICS, DEMO_REVENUE_CHART, DEMO_INVOICES, DEMO_AI_ACTIVITIES } from '../data/demoData';
import { StatusBadge } from '../components/StatusBadge';

import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1E293B]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Payment Operations
            <span className="text-xs px-2 py-0.5 rounded bg-purple-950/70 text-purple-300 border border-purple-800/50 font-normal">
              Live Overview
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time cash flow monitoring, invoice automation and PayPal order reconciliation.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/invoices')}
            className="px-3.5 py-2 text-xs font-medium rounded-lg bg-[#131D2F] hover:bg-[#1A263D] text-slate-200 border border-[#1E293B] transition-colors"
          >
            Manage Invoices
          </button>
          <button
            onClick={() => navigate('/ai-assistant')}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-900/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-200" />
            <span>Generate with AI</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="p-5 rounded-xl bg-[#0E1626] border border-[#1E293B] hover:border-slate-700/60 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white mb-1">
            ${DEMO_METRICS.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{DEMO_METRICS.revenueGrowth}</span>
          </div>
        </div>

        {/* Pending Payments */}
        <div className="p-5 rounded-xl bg-[#0E1626] border border-[#1E293B] hover:border-slate-700/60 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Pending Orders</span>
            <div className="w-8 h-8 rounded-lg bg-amber-950/60 border border-amber-800/40 flex items-center justify-center text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white mb-1">
            ${DEMO_METRICS.pendingPayments.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-slate-400">
            {DEMO_METRICS.pendingCount} invoices awaiting buyer authorization
          </p>
        </div>

        {/* Overdue Invoices */}
        <div className="p-5 rounded-xl bg-[#0E1626] border border-[#1E293B] hover:border-slate-700/60 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Overdue Invoices</span>
            <div className="w-8 h-8 rounded-lg bg-rose-950/60 border border-rose-800/40 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white mb-1">
            ${DEMO_METRICS.overdueInvoices.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-rose-400 font-medium">
              {DEMO_METRICS.overdueCount} require immediate follow-up
            </span>
          </div>
        </div>

        {/* PayPal Status */}
        <div className="p-5 rounded-xl bg-[#0E1626] border border-[#1E293B] hover:border-slate-700/60 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Gateway Status</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-950/60 border border-indigo-800/40 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-base font-semibold text-white mb-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            PayPal Sandbox
          </div>
          <p className="text-xs text-slate-400">
            Avg payment velocity: <span className="font-mono text-slate-200">{DEMO_METRICS.avgCollectionDays} days</span>
          </p>
        </div>
      </div>

      {/* Main Grid: Chart & AI Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Flow Chart */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-[#0E1626] border border-[#1E293B]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-white">Cash Flow Trajectory</h2>
              <p className="text-xs text-slate-400">Collected vs pending payments over the last 6 months</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-purple-500"></span>
                <span className="text-slate-300">Received</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-indigo-400/40"></span>
                <span className="text-slate-400">Pending</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DEMO_REVENUE_CHART} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.35}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: '#0B111E', 
                    borderColor: '#1E293B', 
                    borderRadius: '8px', 
                    color: '#fff',
                    fontSize: '12px',
                    fontFamily: 'monospace'
                  }} 
                />
                <Area type="monotone" dataKey="received" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorReceived)" />
                <Area type="monotone" dataKey="pending" stroke="#6366f1" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorPending)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Assistant Activity Feed */}
        <div className="p-6 rounded-xl bg-[#0E1626] border border-[#1E293B] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-400">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-base font-semibold text-white">AI Operations Feed</h2>
              </div>
              <span className="text-[10px] font-mono text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800/40">
                Gemini Pro
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Automated actions taken by PayFlow Guardian background copilot.
            </p>

            <div className="space-y-3">
              {DEMO_AI_ACTIVITIES.map((act) => (
                <div key={act.id} className="p-3 rounded-lg bg-[#0B111E] border border-[#1E293B] hover:border-purple-900/40 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-purple-300">{act.action}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{act.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {act.detail}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[11px]">
                    <span className="text-purple-400/90 font-mono text-[10px]">{act.status}</span>
                    <button 
                      onClick={() => setActiveTab('ai-assistant')} 
                      className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <span>Review</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('ai-assistant')}
            className="w-full mt-4 py-2 text-xs font-medium text-center text-purple-300 bg-purple-950/40 hover:bg-purple-950/80 rounded-lg border border-purple-800/50 transition-colors"
          >
            Open Interactive AI Copilot
          </button>
        </div>
      </div>

      {/* Recent Invoices Table */}
      <div className="rounded-xl bg-[#0E1626] border border-[#1E293B] overflow-hidden">
        <div className="p-5 border-b border-[#1E293B] flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">Recent Invoices</h2>
            <p className="text-xs text-slate-400">Latest active billing records and payment statuses</p>
          </div>
          <button
            onClick={() => setActiveTab('invoices')}
            className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium transition-colors"
          >
            <span>View All Invoices</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1E293B] bg-[#0A0F1D] text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
                <th className="py-3 px-5">Invoice ID</th>
                <th className="py-3 px-5">Client</th>
                <th className="py-3 px-5">Amount</th>
                <th className="py-3 px-5">Due Date</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5">Gateway Reference</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B] text-xs">
              {DEMO_INVOICES.slice(0, 4).map((invoice) => (
                <tr key={invoice.id} className="hover:bg-[#111A2E] transition-colors">
                  <td className="py-3.5 px-5 font-mono text-purple-300 font-medium">
                    {invoice.id}
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="font-medium text-slate-200">{invoice.client}</div>
                    <div className="text-[11px] text-slate-500">{invoice.description}</div>
                  </td>
                  <td className="py-3.5 px-5 font-mono text-white font-semibold">
                    ${invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-5 text-slate-400 font-mono text-[11px]">
                    {invoice.dueDate}
                  </td>
                  <td className="py-3.5 px-5">
                    <StatusBadge status={invoice.status} />
                  </td>
                  <td className="py-3.5 px-5 font-mono text-slate-400 text-[11px]">
                    {invoice.paypalOrderId}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => onSelectInvoice(invoice)}
                      className="px-2.5 py-1 text-[11px] font-medium rounded bg-[#131D2F] hover:bg-purple-950/60 hover:text-purple-300 text-slate-300 border border-[#1E293B] transition-colors cursor-pointer"
                    >
                      View Details
                    </button>
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

