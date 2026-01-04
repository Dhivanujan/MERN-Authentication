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

  const profileCompletion = Math.round(
    ([user?.username, user?.email, user?.profilePhoto].filter(Boolean).length / 3) * 100
  );

  const securityScore = 70 + (user?.profilePhoto ? 10 : 0) + (user?.lastLogin ? 5 : 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-amber-500/80 via-amber-600/60 to-slate-950 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(255,255,255,0.16),transparent_32%),radial-gradient(circle_at_82%_0%,rgba(255,255,255,0.1),transparent_32%)]" aria-hidden="true" />
        <div className="relative p-8 xl:p-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-5">
            <div className="h-16 w-16 rounded-2xl overflow-hidden border border-white/20 shadow-lg shadow-amber-500/30 ring-2 ring-white/10 flex-shrink-0">
              <img 
                src={user?.profilePhoto || defaultAvatar} 
                alt={user?.username} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-amber-50/80">Signed in</p>
              <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                Welcome back, {user?.username?.split(' ')[0] || 'User'} 👋
              </h1>
              <p className="text-slate-200 max-w-2xl">
                Keep tabs on security, profile health, and sessions in one glance. Quick links below take you straight to the essentials.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-white/10 border border-white/10 px-4 py-3 shadow-inner">
              <p className="text-xs uppercase tracking-[0.08em] text-slate-200">Profile</p>
              <p className="text-2xl font-bold text-white">{profileCompletion}%</p>
              <p className="text-xs text-slate-200/80">complete</p>
            </div>
            <div className="rounded-xl bg-white/10 border border-white/10 px-4 py-3 shadow-inner">
              <p className="text-xs uppercase tracking-[0.08em] text-slate-200">Last login</p>
              <p className="text-sm font-semibold text-white">{lastLogin}</p>
            </div>
            <div className="rounded-xl bg-white/10 border border-white/10 px-4 py-3 shadow-inner">
              <p className="text-xs uppercase tracking-[0.08em] text-slate-200">Security</p>
              <p className="text-2xl font-bold text-white">{securityScore}</p>
              <p className="text-xs text-slate-200/80">confidence</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="group rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg hover:shadow-xl hover:border-amber-300/50 transition-all">
              <div className="h-10 w-10 rounded-xl bg-amber-500/15 text-amber-100 flex items-center justify-center mb-4 group-hover:bg-amber-500/25 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Profile</h3>
              <p className="text-sm text-slate-200/90 mb-4">Update your personal information and public details.</p>
              <Link to="/profile" className="text-sm font-semibold text-amber-100 group-hover:text-white flex items-center gap-1">
                Manage profile <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </Link>
            </div>

            <div className="group rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg hover:shadow-xl hover:border-cyan-300/50 transition-all">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/15 text-cyan-100 flex items-center justify-center mb-4 group-hover:bg-cyan-500/25 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Settings</h3>
              <p className="text-sm text-slate-200/90 mb-4">Configure security preferences and account options.</p>
              <Link to="/settings" className="text-sm font-semibold text-cyan-100 group-hover:text-white flex items-center gap-1">
                View settings <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.08em] text-slate-300">Profile completion</p>
                <p className="text-lg font-semibold text-white">{profileCompletion}% complete</p>
              </div>
              <span className="text-sm text-slate-300">{user?.email}</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-cyan-400"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-200/90">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                Email verified
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-400"></span>
                Photo {user?.profilePhoto ? 'added' : 'missing'}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/15 text-emerald-200 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.08em] text-slate-300">Session</p>
                <p className="text-lg font-semibold text-white">Active now</p>
              </div>
            </div>
            <div className="space-y-3 text-sm text-slate-200/90">
              <div>
                <p className="text-xs uppercase tracking-[0.08em] text-slate-400">Last login</p>
                <p className="mt-1">{lastLogin}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                Session is secure
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-800/70 p-6 shadow-lg">
            <p className="text-sm text-slate-200 mb-3">Security quick wins</p>
            <ul className="space-y-3 text-sm text-slate-200/90">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-purple-300"></span>
                Keep your avatar square for best fit.
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-300"></span>
                Use a long passphrase; aim for 5+ words.
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-300"></span>
                Review settings monthly to stay current.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
