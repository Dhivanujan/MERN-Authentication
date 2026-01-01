import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import defaultAvatar from "../assets/default-avatar.svg";

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
    <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="h-9 w-9 rounded-lg overflow-hidden shadow-sm border border-white/10 group-hover:border-purple-300/40 transition-colors">
                <img 
                  src={user?.profilePhoto || defaultAvatar} 
                  alt={user?.username || "User"} 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-lg font-semibold text-white tracking-tight group-hover:text-purple-200 transition-colors">AuthBoard</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-1">
              <Link 
                to="/dashboard" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/dashboard') 
                    ? 'text-white bg-white/10' 
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Overview
              </Link>
              <Link 
                to="/profile" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/profile') 
                    ? 'text-white bg-white/10' 
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Profile
              </Link>
              <Link 
                to="/settings" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/settings') 
                    ? 'text-white bg-white/10' 
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                Settings
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-sm font-semibold text-white">{user.username}</span>
                <span className="text-xs text-slate-400">{user.email}</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-slate-300 hover:text-rose-300 transition-colors px-3 py-2"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
