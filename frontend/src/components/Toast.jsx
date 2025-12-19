import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

const Toast = ({ msg, type }) => {
  if (!msg) return null;
  
  const bgColor = type === 'error' ? 'bg-red-500' : 'bg-emerald-600';
  
  return (
    <div className={`fixed top-6 right-6 ${bgColor} text-white px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center gap-3 border border-white/20 animate-in fade-in slide-in-from-top-4 duration-300`}>
      {type === 'error' ? <AlertCircle size={24} /> : <CheckCircle size={24} />}
      <span className="font-medium">{msg}</span>
    </div>
  );
};

export default Toast;