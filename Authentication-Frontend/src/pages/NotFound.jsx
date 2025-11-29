import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NotFound() {
  const { isAuthenticated } = useAuth();
  const ctaTarget = isAuthenticated ? "/dashboard" : "/";
  const ctaLabel = isAuthenticated ? "Back to dashboard" : "Go Home";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center px-4 text-center">
      <div className="absolute inset-0 -z-10 opacity-40 bg-[radial-gradient(circle_at_center,_#4f46e5_0,_transparent_55%)]" />
      
      <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mb-4">
        404
      </h1>
      <h2 className="text-2xl font-semibold text-slate-50 mb-4">Page Not Found</h2>
      <p className="text-slate-400 mb-8 max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      
      <Link to={ctaTarget} className="primary-btn h-12 px-8 text-base">
        {ctaLabel}
      </Link>
    </div>
  );
}
