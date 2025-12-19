// src/components/Toast.jsx
import React from 'react';

const Toast = ({ msg, type }) => {
  if (!msg) return null;
  
  // Define colors based on type
  const bgColor = type === 'error' ? 'bg-red-500' : 'bg-emerald-600';
  const iconClass = type === 'error' ? "ph-bold ph-warning-circle" : "ph-bold ph-check-circle";

  return (
    <div className={`fixed top-6 right-6 ${bgColor} text-white px-6 py-4 rounded-xl shadow-2xl z-[70] animate-bounce-in flex items-center gap-3 border border-white/20`}>
      <i className={`${iconClass} text-xl`}></i>
      <span className="font-medium">{msg}</span>
    </div>
  );
};

export default Toast;