import React from 'react';

export default function Button({ 
  children, 
  type = 'button', 
  onClick, 
  disabled = false, 
  variant = 'primary',
  className = ''
}) {
  const baseStyles = "w-full inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";
  
  const variants = {
    primary: "bg-gradient-to-r from-amber-400 via-amber-500 to-cyan-400 text-slate-950 shadow-lg shadow-amber-500/25 hover:shadow-xl hover:-translate-y-0.5 focus:ring-amber-300 border border-transparent",
    secondary: "bg-white/10 text-white border border-white/15 hover:bg-white/15 hover:border-white/25 focus:ring-amber-300",
    danger: "bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500 border border-transparent",
    ghost: "bg-transparent text-slate-200 hover:text-white hover:bg-white/10 focus:ring-amber-200"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {disabled ? (
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Processing...</span>
        </div>
      ) : children}
    </button>
  );
}
