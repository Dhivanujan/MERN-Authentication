import React from "react";
import Header from "./Header";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      <div className="absolute inset-0 -z-10 opacity-40 bg-[radial-gradient(circle_at_top,_#4f46e5_0,_transparent_55%),_radial-gradient(circle_at_bottom,_#22d3ee_0,_transparent_55%)]" />
      
      <Header />
      
      <main className="flex-grow flex flex-col items-center px-4 py-8 animate-in fade-in duration-500">
        {children}
      </main>
    </div>
  );
}
