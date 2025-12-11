import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PasswordStrength from "../components/PasswordStrength";
import Toast from "../components/Toast";
import useToast from "../hooks/useToast";
import { fileToBase64 } from "../utils/file";
import AuthCard from "../components/AuthCard";
import Input from "../components/Input";
import Button from "../components/Button";

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
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        showError("Please upload a valid image (JPEG, PNG)");
        return;
      }

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

      if (!formData.profilePhoto) {
        setFormError("Profile photo is required");
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

      <AuthCard 
        title="Create an account" 
        subtitle="Start your journey with us today."
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

          {/* Profile Photo Upload */}
          <div className="flex justify-center">
            <div className="relative group">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm bg-slate-50 flex items-center justify-center">
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-white text-slate-600 p-1.5 rounded-full cursor-pointer shadow-md border border-slate-100 hover:text-primary-600 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input type="file" accept="image/png, image/jpeg, image/jpg" onChange={handlePhotoChange} className="hidden" />
              </label>
            </div>
          </div>

          <Input
            label="Full Name"
            type="text"
            name="username"
            placeholder="e.g. John Doe"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="name@company.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <div className="space-y-1">
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <PasswordStrength password={formData.password} />
          </div>

          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
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
            Already have an account?{" "}
            <Link to="/" className="font-medium text-primary-600 hover:text-primary-700 transition-colors">
              Sign in
            </Link>
          </p>
        </form>
      </AuthCard>
    </>
  );
}
