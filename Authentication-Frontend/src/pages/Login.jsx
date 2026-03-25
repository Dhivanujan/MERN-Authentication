// src/pages/Login.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/Toast";
import useToast from "../hooks/useToast";
import AuthCard from "../components/AuthCard";
import Input from "../components/Input";
import Button from "../components/Button";
import {
  FaAt,
  FaCircleExclamation,
  FaEye,
  FaEyeSlash,
  FaGithub,
  FaGoogle,
  FaLock,
} from "react-icons/fa6";

const GOOGLE_SCRIPT = "https://accounts.google.com/gsi/client";

const loadGoogleScript = () =>
  new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${GOOGLE_SCRIPT}"]`);
    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = GOOGLE_SCRIPT;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google sign-in script"));
    document.head.appendChild(script);
  });

export default function Login() {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleEnabled, setGoogleEnabled] = useState(false);
  const [googleMessage, setGoogleMessage] = useState("Loading Google sign in...");
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { toast, showSuccess, showError, hideToast } = useToast();
  const googleButtonRef = useRef(null);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setGoogleEnabled(false);
      setGoogleMessage("Set VITE_GOOGLE_CLIENT_ID in frontend .env");
      return;
    }

    let active = true;
    loadGoogleScript()
      .then(() => {
        if (!active || !window.google?.accounts?.id || !googleButtonRef.current) {
          if (active) {
            setGoogleEnabled(false);
            setGoogleMessage("Google sign in is unavailable right now");
          }
          return;
        }

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response) => {
            if (!response?.credential) {
              showError("Google sign-in did not return a credential");
              return;
            }

            setGoogleLoading(true);
            try {
              await loginWithGoogle(response.credential);
              showSuccess("Signed in with Google. Redirecting...");
              setTimeout(() => navigate("/dashboard"), 600);
            } catch (error) {
              showError(error.message || "Google login failed");
            } finally {
              setGoogleLoading(false);
            }
          },
        });

        googleButtonRef.current.innerHTML = "";
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "pill",
          width: 320,
        });

        setGoogleEnabled(true);
        setGoogleMessage("");
      })
      .catch(() => {
        if (!active) return;
        setGoogleEnabled(false);
        setGoogleMessage("Failed to load Google script");
      });

    return () => {
      active = false;
    };
  }, [loginWithGoogle, navigate, showError, showSuccess]);

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
              <FaCircleExclamation className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
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
            icon={
              <FaAt className="w-5 h-5" aria-hidden="true" />
            }
          />

          <div className="space-y-1">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              icon={
                <FaLock className="w-5 h-5" aria-hidden="true" />
              }
              rightIcon={
                showPassword ? (
                  <FaEyeSlash className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <FaEye className="w-5 h-5" aria-hidden="true" />
                )
              }
              onRightIconClick={() => setShowPassword(!showPassword)}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-slate-500 text-amber-500 focus:ring-amber-500/40 bg-slate-900/60 transition-colors"
              />
              <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors">
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

          <div className="grid grid-cols-2 gap-3 items-start">
            <div className="rounded-lg border border-white/10 bg-white/95 px-2 py-2 min-h-[44px]">
              <div ref={googleButtonRef} className={googleEnabled ? "" : "hidden"} />
              {!googleEnabled && (
                <button
                  type="button"
                  disabled
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-slate-500"
                >
                  <FaGoogle />
                  <span>{googleMessage || "Google unavailable"}</span>
                </button>
              )}
            </div>
            <button type="button" className="flex items-center justify-center gap-2 px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 hover:border-white/20 transition-all duration-200 text-slate-100 group">
              <FaGithub className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
              <span className="text-sm font-medium">GitHub</span>
            </button>
          </div>

          {googleLoading && (
            <p className="text-xs text-center text-slate-300">Completing Google sign in...</p>
          )}

          <p className="text-center text-sm text-slate-300">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-amber-400 hover:text-amber-300 transition-colors">
              Sign up
            </Link>
          </p>
        </form>
      </AuthCard>
    </>
  );
}
