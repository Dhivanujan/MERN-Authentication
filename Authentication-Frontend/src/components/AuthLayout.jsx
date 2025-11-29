import React from "react";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 font-sans text-slate-900">
      <div className="w-full max-w-md space-y-8">
        {children}
      </div>
    </div>
  );
}
