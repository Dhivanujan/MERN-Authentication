import React from "react";
import Header from "./Header";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-70"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle at 0% 0%, rgba(56,189,248,0.15), transparent 35%), radial-gradient(circle at 80% 0%, rgba(139,92,246,0.2), transparent 30%), radial-gradient(circle at 50% 120%, rgba(15,23,42,0.9), rgba(10,14,25,1))",
        }}
      />
      <Header />
      <main className="relative flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </main>
    </div>
  );
}
