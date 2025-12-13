import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import defaultAvatar from "../assets/default-avatar.svg";

export default function Dashboard() {
  const { user } = useAuth();
  const lastLogin = user?.lastLogin
    ? new Date(user.lastLogin).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "No activity recorded";

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10 flex items-center gap-5">
        <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-white shadow-md ring-2 ring-slate-100">
          <img 
            src={user?.profilePhoto || defaultAvatar} 
            alt={user?.username} 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">
            Welcome back, {user?.username?.split(' ')[0] || 'User'} 👋
          </h1>
          <p className="text-slate-600 text-lg">
            Here's what's happening with your account today.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Link to="/profile" className="group bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-primary-200 transition-all">
          <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Profile</h3>
          <p className="text-slate-500 text-sm mb-4">
            Update your personal information and public profile details.
          </p>
          <span className="text-sm font-medium text-primary-600 group-hover:text-primary-700 flex items-center gap-1">
            Manage profile <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </span>
        </Link>

        {/* Settings Card */}
        <Link to="/settings" className="group bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-primary-200 transition-all">
          <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Settings</h3>
          <p className="text-slate-500 text-sm mb-4">
            Configure security preferences and account options.
          </p>
          <span className="text-sm font-medium text-primary-600 group-hover:text-primary-700 flex items-center gap-1">
            View settings <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </span>
        </Link>

        {/* Session Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Session Info</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Last Login</p>
              <p className="text-sm text-slate-700 mt-1">{lastLogin}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Status</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                <span className="text-sm text-slate-700">Active now</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
