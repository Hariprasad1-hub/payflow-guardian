import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  CheckCircle2, 
  FileText, 
  RefreshCw, 
  HelpCircle,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';

export const AIAssistant = ({ onAddInvoice }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      time: '11:00 AM',
      text: "Hello! I am your PayFlow Guardian AI. I can parse natural language descriptions into professional invoices, draft polite overdue collection notices, or analyze your PayPal transaction risks.",
      suggestedActions: [
        "Bill Horizon Media $3,200 for React Frontend Redesign due in 14 days",
        "Draft an overdue payment reminder for Acme Corp",
        "Summarize my pending cash flow for this month"
      ]
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState(null);
  const [copiedDraft, setCopiedDraft] = useState(false);

  const handleSendMessage = (textToSend) => {
    const query = textToSend || inputPrompt;
    if (!query.trim()) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: query
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsProcessing(true);

    // Simulate AI parsing / extraction (Gemini format)
    setTimeout(() => {
      let assistantReply = "";
      let draftObj = null;

      const lower = query.toLowerCase();
      if (lower.includes("bill") || lower.includes("invoice") || lower.includes("create")) {
        // Extract mock data based on input
        const amountMatch = query.match(/\$?(\d+[\d,]*)/);
        const amount = amountMatch ? parseFloat(amountMatch[1].replace(',', '')) : 2500;
        
        draftObj = {
          id: `INV-2026-0${Math.floor(100 + Math.random() * 900)}`,
          client: query.includes("Horizon") ? "Horizon Media Inc" : "Apex Interactive Studio",
          clientEmail: "billing@client-domain.com",
          description: query.length > 20 ? query : "Full-stack Software Consulting & API Integration",
          amount: amount,
          currency: "USD",
          issueDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
          status: "pending",
          paymentMethod: "PayPal Smart Button",
          paypalOrderId: `PAYID-${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
          paidAt: null
        };

        assistantReply = `I extracted invoice details using the Gemini prompt parser. I have prepared a draft invoice for **${draftObj.client}** totaling **$${draftObj.amount.toFixed(2)} USD**. Would you like to add this to your active invoices?`;
        setGeneratedDraft(draftObj);

      } else if (lower.includes("reminder") || lower.includes("overdue") || lower.includes("follow")) {
        assistantReply = `Here is a polite, professional follow-up draft you can email to the client:\n\n"Subject: Friendly Reminder: Outstanding Invoice INV-2026-091\n\nHi Sarah,\n\nI hope you're having a great week. This is a gentle reminder that invoice INV-2026-091 for $1,200.00 was due on Nov 3, 2026. For your convenience, you can complete payment directly via our PayPal Sandbox link: https://sandbox.paypal.com/checkout/PAYID-MQ3Z1OP44102.\n\nPlease let me know if you have any questions or require any documentation.\n\nBest regards,\nYour Operations Team"`;
      } else {
        assistantReply = `Based on your current operations:\n- Total pending authorization: $4,820.00 USD across 4 accounts.\n- Overdue risk: 2 invoices are past 7 days. I recommend triggering automated reminder notices.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'assistant',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: assistantReply,
          draftData: draftObj
        }
      ]);
      setIsProcessing(false);
    }, 900);
  };

  const handleCommitDraft = (draft) => {
    onAddInvoice(draft);
    setGeneratedDraft(null);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 2,
        sender: 'assistant',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `✅ Invoice **${draft.id}** has been registered in the system. The PayPal Sandbox order identifier **${draft.paypalOrderId}** is ready.`
      }
    ]);
  };

  return (
    <div className="space-y-6 animate-fadeIn h-[calc(100vh-140px)] flex flex-col">
      {/* Page Title */}
      <div className="pb-3 border-b border-[#1E293B] flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            AI Operations Copilot
            <span className="text-xs px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/40 font-mono">
              Gemini Flash API
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Create invoices from conversational briefs and compose client follow-ups automatically.
          </p>
        </div>
        <div className="text-[11px] font-mono text-slate-400 bg-[#0E1626] border border-[#1E293B] px-3 py-1.5 rounded-lg flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Ready for instructions
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-2xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-purple-900/60 border border-purple-700/50 text-purple-300'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div
              className={`p-4 rounded-xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-900/40 border border-indigo-700/40 text-slate-100'
                  : 'bg-[#0E1626] border border-[#1E293B] text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between gap-4 mb-1">
                <span className="font-semibold text-[11px] text-purple-300">
                  {msg.sender === 'user' ? 'You' : 'PayFlow Guardian AI'}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{msg.time}</span>
              </div>

              <div className="whitespace-pre-wrap">{msg.text}</div>

              {/* Actionable Draft Card */}
              {msg.draftData && (
                <div className="mt-3 p-3.5 rounded-lg bg-[#0B111E] border border-purple-800/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-purple-300 font-semibold">{msg.draftData.id}</span>
                    <span className="text-emerald-400 font-mono font-bold">${msg.draftData.amount.toFixed(2)} USD</span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-medium">{msg.draftData.client}</div>
                  <div className="text-[10px] text-slate-400">{msg.draftData.description}</div>
                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleCommitDraft(msg.draftData)}
                      className="px-3 py-1.5 rounded-md bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-medium flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve & Save Invoice</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Suggested prompts on initial greeting */}
              {msg.suggestedActions && (
                <div className="mt-3 pt-3 border-t border-[#1E293B] space-y-1.5">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                    Suggested prompts
                  </span>
                  {msg.suggestedActions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(action)}
                      className="text-left w-full block px-2.5 py-1.5 rounded bg-[#101827] hover:bg-[#162238] text-purple-300/90 text-[11px] border border-[#1E293B] transition-colors cursor-pointer"
                    >
                      "{action}"
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex gap-3 max-w-2xl">
            <div className="w-8 h-8 rounded-lg bg-purple-900/60 border border-purple-700/50 text-purple-300 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-xl bg-[#0E1626] border border-[#1E293B] flex items-center gap-2 text-xs text-purple-300 font-mono">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-400" />
              <span>Gemini is parsing parameters and evaluating billing logic...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input box */}
      <div className="bg-[#0E1626] p-3 rounded-xl border border-[#1E293B] flex items-center gap-3">
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="E.g., 'Bill CyberCorp $4,500 for Security Audit due in 10 days' or 'Draft overdue reminder'..."
          className="flex-1 bg-transparent border-0 text-xs text-white placeholder-slate-500 focus:outline-none"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputPrompt.trim() || isProcessing}
          className="p-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:hover:bg-purple-600 text-white transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

