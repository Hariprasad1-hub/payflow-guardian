import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Shield, 
  CreditCard, 
  Sparkles, 
  Key, 
  Database, 
  Check, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export const Settings = () => {
  const [clientId, setClientId] = useState('AbCdEfGhIjKlMnOpQrStUvWxYz_SANDBOX_SAMPLE');
  const [webhookUrl, setWebhookUrl] = useState('http://localhost:8000/api/webhooks/paypal');
  const [modelName, setModelName] = useState('gemini-1.5-flash');
  const [autoReminderDays, setAutoReminderDays] = useState('3');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      {/* Title */}
      <div className="pb-2 border-b border-[#1E293B]">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          Environment & System Settings
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Configure PayPal Sandbox endpoints, Google Gemini model configurations, and automation parameters.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* PayPal Sandbox Settings */}
        <div className="p-6 rounded-xl bg-[#0E1626] border border-[#1E293B] space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[#1E293B]">
            <CreditCard className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-semibold text-white">PayPal Sandbox Integration</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Sandbox Client ID
              </label>
              <input
                type="text"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full bg-[#101827] border border-[#1E293B] rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500/60"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Client secrets are never exposed on the client side; configure them in backend <code className="text-purple-400 font-mono">.env</code>.
              </p>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                IPN / Webhook Listener URL
              </label>
              <input
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full bg-[#101827] border border-[#1E293B] rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500/60"
              />
            </div>
          </div>
        </div>

        {/* Gemini AI Settings */}
        <div className="p-6 rounded-xl bg-[#0E1626] border border-[#1E293B] space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[#1E293B]">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-semibold text-white">Google Gemini Engine</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Target Model
              </label>
              <select
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className="w-full bg-[#101827] border border-[#1E293B] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500/60"
              >
                <option value="gemini-1.5-flash">Gemini 1.5 Flash (Optimized for low-latency invoices)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (Complex financial analysis)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Automated Overdue Escalation
              </label>
              <select
                value={autoReminderDays}
                onChange={(e) => setAutoReminderDays(e.target.value)}
                className="w-full bg-[#101827] border border-[#1E293B] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500/60"
              >
                <option value="1">1 Day after due date</option>
                <option value="3">3 Days after due date (Recommended)</option>
                <option value="7">7 Days after due date</option>
              </select>
            </div>
          </div>
        </div>

        {/* Backend & Database status */}
        <div className="p-6 rounded-xl bg-[#0E1626] border border-[#1E293B] space-y-3">
          <div className="flex items-center gap-2.5 pb-2 border-b border-[#1E293B]">
            <Database className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-semibold text-white">Target Architecture Verification</h2>
          </div>
          <div className="text-xs text-slate-400 space-y-2">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0A0F1D] border border-[#1E293B]">
              <span>FastAPI Backend Services:</span>
              <span className="font-mono text-amber-400">Milestone 2 (Ready for Python integration)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0A0F1D] border border-[#1E293B]">
              <span>Database Engine:</span>
              <span className="font-mono text-slate-300">SQLite (Local persistent store)</span>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Settings saved in local application state</span>
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-purple-900/20 transition-all cursor-pointer"
          >
            {saved ? <Check className="w-4 h-4" /> : null}
            <span>{saved ? "Configuration Saved!" : "Save Configuration"}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

