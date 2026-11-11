import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  Receipt,
  Settings,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Lock
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null, path: '/' },
    { id: 'invoices', label: 'Invoices', icon: FileText, badge: '6', path: '/invoices' },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Sparkles, badge: 'Gemini', path: '/ai-assistant' },
    { id: 'payments', label: 'Payment Activity', icon: Receipt, badge: null, path: '/payments' },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null, path: '/settings' },
  ];

  return (
    <aside className="w-64 bg-[#0B111E] border-r border-[#1E293B] flex flex-col h-screen fixed left-0 top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center gap-3 border-b border-[#1E293B]">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="font-semibold text-white tracking-tight text-base block">PayFlow</span>
          <span className="text-[10px] tracking-wider font-mono text-purple-400 font-medium uppercase -mt-1 block">Guardian</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 px-3 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">Operations</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gradient-to-r from-purple-900/40 to-indigo-900/30 text-purple-200 border border-purple-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#131D2F]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-medium ${
                    item.badge === 'Gemini'
                      ? 'bg-purple-950 text-purple-300 border border-purple-700/50'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sandbox Integration Pill */}
      <div className="p-4 mx-3 mb-4 rounded-xl bg-[#0E1626] border border-[#1E293B]">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-medium text-slate-300">PayPal Sandbox</span>
        </div>
        <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">
          Running on test credentials. Real payments are disabled.
        </p>
        <div className="flex items-center gap-1 text-[11px] font-medium text-purple-400">
          <Lock className="w-3 h-3" />
          <span>Orders API v2</span>
        </div>
      </div>

      {/* User profile footer */}
      <div className="p-3 border-t border-[#1E293B] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-xs font-semibold text-purple-300">
            FD
          </div>
          <div className="text-left">
            <p className="text-xs font-medium text-slate-200 leading-tight">Freelance Dev</p>
            <p className="text-[11px] text-slate-500">Tier: Professional</p>
          </div>
        </div>
        <span className="text-[10px] font-mono bg-slate-800/80 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700/50">
          DEMO
        </span>
      </div>
    </aside>
  );
};