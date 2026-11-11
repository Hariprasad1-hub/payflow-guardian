// src/components/Header.jsx
import React from 'react';
import { Bell, Search, Sparkles, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Header = ({ }) => {
  const navigate = useNavigate();

  const handleOpenInvoiceGenerator = () => {
    // Navigate to Invoices page and open the creation modal if needed.
    // For simplicity, just navigate to the Invoices page where the user can click "Create New Invoice".
    navigate('/invoices');
  };

  const handleNotifications = () => {
    // Placeholder: show an alert for now.
    alert('No notifications available in demo mode.');
  };

  return (
    <header className="h-16 border-b border-[#1E293B] bg-[#0B111E]/80 backdrop-blur-md sticky top-0 z-20 px-8 flex items-center justify-between">
      {/* Search Bar */}
      <div className="relative w-80">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search invoices, clients, or payments..."
          className="w-full bg-[#101827] border border-[#1E293B] rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/60 transition-colors"
        />
      </div>

      {/* Action shortcuts */}
      <div className="flex items-center gap-3">
        {/* Environment banner */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-950/40 border border-amber-800/40 text-amber-300 text-xs font-mono">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Demo Data Mode</span>
        </div>

        {/* AI Quick Trigger */}
        <button
          onClick={handleOpenInvoiceGenerator}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-medium shadow-sm shadow-purple-600/20 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-200" />
          <span>AI Invoice Generator</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={handleNotifications}
            className="w-8 h-8 rounded-lg bg-[#101827] border border-[#1E293B] flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Bell className="w-4 h-4" />
          </button>
          <span className="w-2 h-2 rounded-full bg-purple-500 absolute -top-0.5 -right-0.5 ring-2 ring-[#0B111E]"></span>
        </div>
      </div>
    </header>
  );
};
