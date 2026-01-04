import React from "react";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[var(--surface)] text-slate-100">
      <div
        className="absolute inset-0 opacity-80"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 18%, rgba(245,158,11,0.18), transparent 30%), radial-gradient(circle at 82% 8%, rgba(34,211,238,0.18), transparent 32%), radial-gradient(1200px at 50% 120%, rgba(9,12,24,0.95), rgba(5,7,18,0.98))",
        }}
      />

      <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-[0.18]" aria-hidden="true">
        <div className="absolute -left-10 top-1/4 h-80 w-80 rounded-full bg-amber-400/40 blur-3xl" />
        <div className="absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-cyan-400/30 blur-3xl" />
      </div>

      <div className="relative min-h-screen grid lg:grid-cols-2 items-stretch">
        <div className="hidden lg:flex flex-col justify-between p-12 xl:p-16 text-slate-100">
          <div className="space-y-8 max-w-xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/10 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-slate-100">Encrypted by default</span>
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl xl:text-5xl font-bold leading-tight">
                Confident auth with a calmer, precise UI.
              </h1>
              <p className="text-lg text-slate-300 max-w-xl">
                Clear hierarchy, generous breathing room, and focused calls to action keep sign-ins quick and friendly.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 max-w-lg">
              {["Passkey-friendly", "Live validation", "Session insights", "Adaptive layout"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-slate-200">
                  <span className="h-5 w-5 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-amber-200">✓</span>
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
