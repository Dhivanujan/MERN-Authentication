import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PasswordStrength from "../components/PasswordStrength";
import Toast from "../components/Toast";
import useToast from "../hooks/useToast";
import { fileToBase64 } from "../utils/file";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePhoto: null,
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const { toast, showSuccess, showError, hideToast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError("");
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setPhotoPreview(base64);
        setFormData((prev) => ({ ...prev, profilePhoto: base64 }));
      } catch (err) {
        showError("Failed to process image");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError("");

    try {
      if (!formData.username || !formData.email || !formData.password) {
        setFormError("All fields are required");
        setLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setFormError("Passwords do not match");
        setLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setFormError("Password must be at least 6 characters");
        setLoading(false);
        return;
      }

      await register(formData.username, formData.email, formData.password, formData.profilePhoto);
      showSuccess("Account created! Redirecting you now...");
      setTimeout(() => navigate("/dashboard"), 600);
    } catch (err) {
      setFormError(err.message || "Registration failed. Please try again.");
      showError(err.message || "Registration failed. Please try again.");
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
          <p className="text-[10px] uppercase tracking-[0.25em] text-lavender-600 font-bold mb-2">Get started</p>
          <h2 className="text-3xl font-bold text-slate-800">Create Account</h2>
          <p className="text-sm text-slate-500 mt-2">
            Join us to manage your profile professionally
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative flex flex-col gap-5">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-medium">
              {formError}
            </div>
          )}

          {/* Profile Photo Upload */}
          <div className="flex justify-center mb-2">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-lavender-100 flex items-center justify-center">
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-10 h-10 text-lavender-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-lavender-600 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-lavender-700 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 ml-1">Full Name</label>
            <input
              type="text"
              name="username"
              placeholder="John Doe"
              value={formData.username}
              onChange={handleChange}
              className="subtle-input"
              required
            />
          </div>

          {/* Email */}
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

          {/* Password */}
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
            <PasswordStrength password={formData.password} />
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 ml-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="subtle-input"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full primary-btn h-12 text-base shadow-lavender-500/20"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

          {/* Login Redirect */}
          <p className="text-slate-500 text-xs text-center mt-2">
            Already have an account?{" "}
            <Link to="/" className="text-lavender-700 font-semibold hover:text-lavender-800 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
