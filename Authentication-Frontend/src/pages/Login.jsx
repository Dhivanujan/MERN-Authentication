// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/Toast";
import useToast from "../hooks/useToast";
import AuthCard from "../components/AuthCard";
import Input from "../components/Input";
import Button from "../components/Button";
import googleIcon from "../assets/google.svg";
import githubIcon from "../assets/github.svg";

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

      <AuthCard 
        title="Welcome back" 
        subtitle="Please enter your details to sign in."
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {formError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/40 text-rose-100 rounded-lg text-sm font-medium flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formError}
            </div>
          )}

          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <div className="space-y-1">
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-slate-500 text-purple-400 focus:ring-purple-400/40 bg-slate-900/60 transition-colors"
              />
              <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-sm font-medium text-purple-200 hover:text-white transition-colors">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-900/80 text-slate-300">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button type="button" className="flex items-center justify-center gap-2 px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-slate-100">
              <img src={googleIcon} alt="Google" className="w-5 h-5" />
              <span className="text-sm font-medium">Google</span>
            </button>
            <button type="button" className="flex items-center justify-center gap-2 px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-slate-100">
              <img src={githubIcon} alt="GitHub" className="w-5 h-5" />
              <span className="text-sm font-medium">GitHub</span>
            </button>
          </div>

          <p className="text-center text-sm text-slate-300">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-purple-200 hover:text-white transition-colors">
              Sign up
            </Link>
          </p>
        </form>
      </AuthCard>
    </>
  );
}
