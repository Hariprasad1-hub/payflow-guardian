import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, FileCode } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  switch (status?.toLowerCase()) {
    case 'paid':
    case 'completed':
    case 'settled':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 font-mono">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          Paid
        </span>
      );
    case 'pending':
    case 'awaiting approval':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-950/60 text-amber-300 border border-amber-800/40 font-mono">
          <Clock className="w-3 h-3 text-amber-400" />
          Pending
        </span>
      );
    case 'overdue':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-950/60 text-rose-300 border border-rose-800/40 font-mono">
          <AlertTriangle className="w-3 h-3 text-rose-400" />
          Overdue
        </span>
      );
    case 'draft':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700/50 font-mono">
          <FileCode className="w-3 h-3 text-slate-400" />
          Draft
        </span>
      );
  }
};

