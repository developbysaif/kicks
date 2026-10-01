import React from 'react';

const Loader = ({ fullScreen = false, message = 'Loading Kick Home Care...' }) => {
  if (fullScreen) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold text-slate-600 tracking-wide uppercase">{message}</p>
      </div>
    );
  }

  return (
    <div className="py-12 flex flex-col items-center justify-center">
      <div className="w-8 h-8 border-3 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-2" />
      <span className="text-xs text-slate-500 font-medium">{message}</span>
    </div>
  );
};

export default Loader;
