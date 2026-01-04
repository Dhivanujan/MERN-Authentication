import React from "react";
import Header from "./Header";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[var(--surface)] text-slate-100 flex flex-col font-sans relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-80"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle at 8% 14%, rgba(245,158,11,0.14), transparent 32%), radial-gradient(circle at 82% 6%, rgba(34,211,238,0.16), transparent 32%), radial-gradient(circle at 50% 120%, rgba(5,7,18,0.92), rgba(4,6,14,0.98))",
        }}
      />
      <Header />
      <main className="relative flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </main>
    </div>
  );
}
