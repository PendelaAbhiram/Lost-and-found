import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'error' | 'info';
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success' }) => {
  if (!message) return null;

  return (
    <div
      id="appToastNotification"
      className="fixed bottom-6 right-6 z-[10005] bg-[#1c2b1f] text-[#efe9d9] px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border border-white/10 animate-slideUp text-sm max-w-md"
    >
      {type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#b8945a] flex-shrink-0" />}
      {type === 'error' && <AlertCircle className="w-5 h-5 text-[#e9c9c2] flex-shrink-0" />}
      {type === 'info' && <Info className="w-5 h-5 text-[#c8d3bd] flex-shrink-0" />}
      <span className="font-medium leading-snug">{message}</span>
    </div>
  );
};
