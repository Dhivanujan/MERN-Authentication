import React from 'react';

export default function AuthCard({ children, title, subtitle }) {
  return (
    <div className="relative">
      <div className="relative glass rounded-2xl p-8 fade-in overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-white/5 to-cyan-400/10" aria-hidden="true" />
        <div className="absolute inset-x-12 -top-24 h-32 bg-gradient-to-r from-purple-400/30 via-cyan-300/20 to-transparent blur-3xl" aria-hidden="true" />
        <div className="relative text-center mb-8">
          <div className="mx-auto mb-5 flex items-center justify-center h-12 w-12 rounded-xl bg-white/10 border border-white/15 shadow-inner shadow-purple-500/10">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          {title && (
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-2 text-sm text-slate-300">
              {subtitle}
            </p>
          )}
        </div>
        <div className="relative">
          {children}
        </div>
      </div>
    </div>
  );
}
