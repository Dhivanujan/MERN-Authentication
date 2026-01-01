import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";

export default function NotFound() {
  const { isAuthenticated } = useAuth();
  const ctaTarget = isAuthenticated ? "/dashboard" : "/";
  const ctaLabel = isAuthenticated ? "Back to dashboard" : "Go Home";

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md w-full bg-white/5 p-8 rounded-2xl shadow-xl border border-white/10">
        <h1 className="text-6xl font-bold text-purple-300 mb-4">
          404
        </h1>
        <h2 className="text-2xl font-bold text-white mb-3">Page Not Found</h2>
        <p className="text-slate-300 mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <Link to={ctaTarget}>
          <Button className="w-full">
            {ctaLabel}
          </Button>
        </Link>
      </div>
    </div>
  );
}
