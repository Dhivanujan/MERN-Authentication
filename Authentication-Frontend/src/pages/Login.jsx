// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/Toast";
import useToast from "../hooks/useToast";
import AuthCard from "../components/AuthCard";
import Input from "../components/Input";
import Button from "../components/Button";

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
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm font-medium flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 transition-colors"
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button type="button" className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              <span className="text-sm font-medium text-slate-700">Google</span>
            </button>
            <button type="button" className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
              <img src="https://www.svgrepo.com/show/475647/github-color.svg" alt="GitHub" className="w-5 h-5" />
              <span className="text-sm font-medium text-slate-700">GitHub</span>
            </button>
          </div>

          <p className="text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-700 transition-colors">
              Sign up
            </Link>
          </p>
        </form>
      </AuthCard>
    </>
  );
}
