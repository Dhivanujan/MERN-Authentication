import React from 'react';

export default function AuthCard({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-card border border-slate-100 p-8 fade-in">
        <div className="text-center mb-8">
          {title && (
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-2 text-sm text-slate-500">
              {subtitle}
            </p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
