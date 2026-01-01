import React from 'react';

export default function Input({ 
  label, 
  type = 'text', 
  name, 
  value, 
  onChange, 
  placeholder, 
  error, 
  icon,
  required = false,
  className = ''
}) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-200 mb-1.5 ml-0.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`
            w-full 
            ${icon ? 'pl-10' : 'pl-3'} 
            pr-3 
            py-2.5 
            glass-input
            border 
            ${error ? 'border-red-400 focus:ring-red-300 focus:border-red-400' : 'border-slate-700 focus:ring-purple-300/30 focus:border-purple-300'}
            rounded-lg 
            text-slate-100 
            placeholder:text-slate-400 
            text-sm 
            shadow-sm 
            focus:outline-none 
            focus:ring-4 
            transition-all 
            duration-200
          `}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 3.5V6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 8.5H6.005" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
