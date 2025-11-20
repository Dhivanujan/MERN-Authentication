import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      <div className="absolute inset-0 -z-10 opacity-40 bg-[radial-gradient(circle_at_top,_#4f46e5_0,_transparent_55%),_radial-gradient(circle_at_bottom,_#22d3ee_0,_transparent_55%)]" />

      {/* Header */}
      <header className="glass-card/0 bg-slate-950/60 border-b border-slate-800/70 backdrop-blur-xl py-4 px-6 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-[10px] font-semibold text-slate-950">
            AB
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-50 tracking-wide">AuthBoard</h1>
            {user && (
              <p className="text-[11px] text-slate-400">Signed in as {user.username}</p>
            )}
          </div>
        </div>
        <nav className="flex items-center gap-4 text-[13px]">
          <Link to="/profile" className="text-slate-300 hover:text-indigo-300">
            Profile
          </Link>
          <Link to="/settings" className="text-slate-300 hover:text-indigo-300">
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="text-red-300 hover:text-red-200 text-[13px]"
          >
            Logout
          </button>
        </nav>
      </header>

      {/* Content */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 py-8">
        <div className="max-w-4xl w-full">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400 mb-2">
              Overview
            </p>
            <h2 className="text-2xl font-bold text-slate-50 mb-2 flex items-center justify-center gap-2">
              Welcome back
              <span className="text-xl">👋</span>
            </h2>
            <p className="text-slate-400 text-sm">
              You’re signed in and ready to manage your account, profile and
              preferences.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 w-full">
            <div className="glass-card rounded-2xl p-5 hover:translate-y-0.5 hover:shadow-2xl transition-transform">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 mb-3">
                Account
              </p>
              <h3 className="font-medium text-slate-50 mb-1">Profile</h3>
              <p className="text-slate-400 text-xs">
                View and update your avatar, name and contact details.
              </p>
              <Link
                to="/profile"
                className="mt-4 inline-flex text-[12px] text-indigo-300 hover:text-indigo-200"
              >
                Open profile →
              </Link>
            </div>
            <div className="glass-card rounded-2xl p-5 hover:translate-y-0.5 hover:shadow-2xl transition-transform">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 mb-3">
                Security
              </p>
              <h3 className="font-medium text-slate-50 mb-1">Settings</h3>
              <p className="text-slate-400 text-xs">
                Manage login, password and personal preferences for your account.
              </p>
              <Link
                to="/settings"
                className="mt-4 inline-flex text-[12px] text-indigo-300 hover:text-indigo-200"
              >
                Open settings →
              </Link>
            </div>
            <div className="glass-card rounded-2xl p-5 hover:translate-y-0.5 hover:shadow-2xl transition-transform">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 mb-3">
                Session
              </p>
              <h3 className="font-medium text-slate-50 mb-1">Activity</h3>
              <p className="text-slate-400 text-xs">
                Track when you last logged in and quickly sign out.
              </p>
              <button
                onClick={handleLogout}
                className="mt-4 inline-flex text-[12px] text-red-300 hover:text-red-200"
              >
                Sign out of this session →
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
