import React from "react";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <div className="absolute inset-0 -z-10 opacity-40 bg-[radial-gradient(circle_at_top,_#4f46e5_0,_transparent_55%),_radial-gradient(circle_at_bottom,_#22d3ee_0,_transparent_55%)]" />
      
      <div className="w-full max-w-sm animate-in fade-in zoom-in-95 duration-500">
        {children}
      </div>
    </div>
  );
}
