// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/Toast";
import useToast from "../hooks/useToast";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const { toast, showSuccess, showError, hideToast } = useToast();

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
      showSuccess("Welcome back! Redirecting to your dashboard...");
      setTimeout(() => navigate("/dashboard"), 600);
    } catch (err) {
      setFormError(err.message || "Login failed. Please try again.");
      showError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      <div className="glass-card rounded-3xl px-8 py-8 w-full max-w-md relative overflow-hidden">
        <div className="absolute -top-24 -right-20 h-48 w-48 rounded-full bg-lavender-400/30 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 h-48 w-48 rounded-full bg-lavender-300/30 blur-3xl" />

        <div className="relative text-center mb-8">
          <p className="text-[10px] uppercase tracking-[0.25em] text-lavender-600 font-bold mb-2">Welcome back</p>
          <h2 className="text-3xl font-bold text-slate-800">
            Sign in to <span className="text-lavender-600">AuthBoard</span>
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Secure access to your dashboard and profile
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative flex flex-col gap-5">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium">
              {formError}
            </div>
          )}

          {/* Email Input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 ml-1">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              className="subtle-input"
              required
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 ml-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="subtle-input"
              required
            />
          </div>

          {/* Remember / Forgot */}
          <div className="flex items-center justify-between text-slate-500 text-xs mt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                className="w-4 h-4 accent-lavender-600 rounded border-gray-300"
                type="checkbox"
              />
              Remember me
            </label>
            <button type="button" className="text-lavender-600 font-medium hover:text-lavender-700 hover:underline">
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full primary-btn h-12 text-base shadow-lavender-500/20"
          >
            {loading ? "Logging in..." : "Sign In"}
          </button>

          {/* Sign up */}
          <p className="text-slate-500 text-xs text-center mt-2">
            Don’t have an account?{" "}
            <Link to="/register" className="text-lavender-700 font-semibold hover:text-lavender-800 hover:underline">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
