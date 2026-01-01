import React from "react";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950 text-slate-100">
      <div
        className="absolute inset-0 opacity-70"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(139,92,246,0.25), transparent 30%), radial-gradient(circle at 80% 0%, rgba(34,211,238,0.2), transparent 35%), radial-gradient(circle at 50% 120%, rgba(15,23,42,0.8), rgba(10,14,25,0.95))",
        }}
      />

      <div className="relative min-h-screen grid lg:grid-cols-2 items-stretch">
        <div className="hidden lg:flex flex-col justify-between p-12 xl:p-16 text-slate-100">
          <div className="space-y-6 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              <span className="text-xs font-semibold tracking-wide uppercase text-slate-200">Secure access</span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-bold leading-tight">
              Auth flows with a crafted, confident interface.
            </h1>
            <p className="text-lg text-slate-300 max-w-xl">
              A streamlined sign-in experience with clear hierarchy, generous spacing, and focused calls to action so users can finish fast.
            </p>
            <div className="grid grid-cols-2 gap-4 max-w-md">
              {["Passkey-friendly", "Real-time feedback", "Granular controls", "Adaptive layout"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-slate-200">
                  <span className="h-5 w-5 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-emerald-300">✓</span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-300">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((item) => (
                <span
                  key={item}
                  className="h-10 w-10 rounded-full border border-white/10 bg-white/10 backdrop-blur-sm shadow-inner"
                />
              ))}
            </div>
            <div>
              <p className="font-semibold">Designed for clarity</p>
              <p className="text-slate-400">Motion, contrast, and rhythm tuned for quick tasks.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-4 py-12 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
