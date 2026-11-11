// src/components/ReminderModal.jsx
import React from 'react';
import { X, Clipboard } from 'lucide-react';

export const ReminderModal = ({ isOpen, onClose, reminderText }) => {
  if (!isOpen) return null;

  const copy = async () => {
    await navigator.clipboard.writeText(reminderText);
    // could show toast; omitted for brevity
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-[#0E1626] rounded-xl w-full max-w-lg p-6 border border-[#1E293B] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-semibold text-white mb-3">Overdue Reminder Draft</h3>
        <pre className="whitespace-pre-wrap text-sm text-slate-200 bg-[#101827] rounded p-3 mb-4">
          {reminderText}
        </pre>
        <button
          onClick={copy}
          className="flex items-center gap-1 px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded"
        >
          <Clipboard className="w-4 h-4" />
          Copy to clipboard
        </button>
      </div>
    </div>
  );
};

