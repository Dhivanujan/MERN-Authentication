// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, error } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError("");

    try {
      if (!formData.email || !formData.password) {
        setFormError("Email and password are required");
        setLoading(false);
        return;
      }

      await login(formData.email, formData.password);
      navigate("/dashboard");
    } catch (err) {
      setFormError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <div className="absolute inset-0 -z-10 opacity-40 bg-[radial-gradient(circle_at_top,_#4f46e5_0,_transparent_55%),_radial-gradient(circle_at_bottom,_#22d3ee_0,_transparent_55%)]" />

      <div className="glass-card rounded-3xl px-8 py-8 w-full max-w-sm relative overflow-hidden">
        <div className="absolute -top-16 -right-10 h-32 w-32 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute -bottom-16 -left-10 h-32 w-32 rounded-full bg-cyan-400/20 blur-3xl" />

        <div className="relative text-center mb-6">
          <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400 mb-2">Welcome back</p>
          <h2 className="text-2xl font-semibold text-slate-50">
            Sign in to <span className="text-indigo-400">AuthBoard</span>
          </h2>
          <p className="text-xs text-slate-400 mt-2">
            Secure access to your dashboard and profile
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative flex flex-col gap-3">
          {formError && (
            <div className="mb-2 p-3 bg-red-500/10 border border-red-500/60 text-red-200 rounded-xl text-xs backdrop-blur">
              {formError}
            </div>
          )}

          {/* Email Input */}
          <div className="flex items-center gap-2">
            <svg width="15" height="10" viewBox="0 0 16 11" className="text-gray-500">
              <path
                fill="currentColor"
                d="M0 .55L.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
              />
            </svg>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="subtle-input"
              required
            />
          </div>

          {/* Password Input */}
          <div className="flex items-center gap-2">
            <svg width="12" height="15" viewBox="0 0 13 17" className="text-gray-500">
              <path
                fill="currentColor"
                d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
              />
            </svg>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="subtle-input"
              required
            />
          </div>

          {/* Remember / Forgot */}
          <div className="flex items-center justify-between text-slate-400 text-[11px] mt-1">
            <label className="flex items-center gap-1">
              <input
                className="w-3.5 h-3.5 accent-indigo-500"
                type="checkbox"
              />
              Remember me
            </label>
            <button type="button" className="text-indigo-400 hover:text-indigo-300 hover:underline">
              Forgot?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-3 w-full primary-btn h-10"
          >
            {loading ? "Logging in..." : "Sign in"}
          </button>

          {/* Sign up */}
          <p className="text-slate-400 text-[11px] text-center mt-3">
            Don’t have an account?{" "}
            <Link to="/register" className="text-indigo-300 hover:text-indigo-200 hover:underline">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
