import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="glass-card/0 bg-white/60 border-b border-lavender-200/70 backdrop-blur-xl py-4 px-6 flex justify-between items-center sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-3">
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-lavender-500 to-lavender-300 flex items-center justify-center text-xs font-bold text-white shadow-md shadow-lavender-300/50 group-hover:scale-105 transition-transform">
            AB
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800 tracking-wide group-hover:text-lavender-600 transition-colors">AuthBoard</h1>
            {user && (
              <p className="text-[11px] text-slate-500 font-medium">Hello, {user.username}</p>
            )}
          </div>
        </Link>
      </div>
      <nav className="flex items-center gap-8 text-[13px] font-medium">
        <Link 
          to="/dashboard" 
          className={`${isActive('/dashboard') ? 'text-lavender-700' : 'text-slate-500 hover:text-lavender-600'}`}
        >
          Overview
        </Link>
        <Link 
          to="/profile" 
          className={`${isActive('/profile') ? 'text-lavender-700' : 'text-slate-500 hover:text-lavender-600'}`}
        >
          Profile
        </Link>
        <Link 
          to="/settings" 
          className={`${isActive('/settings') ? 'text-lavender-700' : 'text-slate-500 hover:text-lavender-600'}`}
        >
          Settings
        </Link>
        <div className="h-5 w-px bg-slate-200 mx-1" />
        <button
          onClick={handleLogout}
          className="text-red-400 hover:text-red-500 text-[13px] font-semibold transition-colors"
        >
          Logout
        </button>
      </nav>
    </header>
  );
}
