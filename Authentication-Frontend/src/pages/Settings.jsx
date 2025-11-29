import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PasswordStrength from "../components/PasswordStrength";
import Toast from "../components/Toast";
import useToast from "../hooks/useToast";
import { fileToBase64 } from "../utils/file";

export default function Settings() {
  const { user, updateProfilePhoto, updateAccount } = useAuth();
  const [photoPreview, setPhotoPreview] = useState(user?.profilePhoto);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [inlineError, setInlineError] = useState("");
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    password: "",
  });
  const { toast, showSuccess, showError, hideToast } = useToast();

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      username: user?.username || "",
      email: user?.email || "",
    }));
  }, [user]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setInlineError("");

    try {
      const base64 = await fileToBase64(file);
      setPhotoPreview(base64);
      await updateProfilePhoto(base64);
      showSuccess("Profile photo updated successfully");
    } catch (err) {
      showError(err.message || "Failed to update profile photo");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setInlineError("");

    const trimmedUsername = formData.username.trim();
    const trimmedEmail = formData.email.trim();

    if (!trimmedUsername || !trimmedEmail) {
      const validationMessage = "Name and email cannot be empty";
      setInlineError(validationMessage);
      showError(validationMessage);
      setSaving(false);
      return;
    }

    try {
      const payload = {
        username: trimmedUsername,
        email: trimmedEmail,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      await updateAccount(payload);
      showSuccess("Settings saved successfully");
      setFormData((prev) => ({ ...prev, password: "" }));
    } catch (err) {
      showError(err.message || "Unable to save settings");
    } finally {
      setSaving(false);
    }
  };

  const defaultAvatar = `https://i.pravatar.cc/100?u=${user?.email}`;

  return (
    <>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      <div className="glass-card rounded-3xl p-8 w-full max-w-sm relative overflow-hidden">
        <div className="absolute -top-16 -right-10 h-32 w-32 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute -bottom-16 -left-10 h-32 w-32 rounded-full bg-cyan-400/20 blur-3xl" />

        <h2 className="relative text-2xl font-semibold text-slate-50 mb-6 text-center">
          Account settings
        </h2>

        <form onSubmit={handleSubmit} className="relative flex flex-col gap-4">
          {inlineError && (
            <div className="mb-3 p-3 bg-red-500/10 border border-red-500/60 text-red-200 rounded-xl text-xs backdrop-blur">
              {inlineError}
            </div>
          )}

          {/* Profile Photo Section */}
          <div className="flex flex-col items-center gap-3 pb-4 border-b border-slate-800/70">
            <p className="text-sm font-medium text-slate-200">Profile photo</p>
            <img
              src={photoPreview || defaultAvatar}
              alt="User Avatar"
              className="w-20 h-20 rounded-full border-4 border-indigo-400 object-cover shadow-lg shadow-slate-950/70"
            />
            <label className="primary-btn px-4 py-2 text-xs font-medium cursor-pointer h-auto">
              {loading ? 'Uploading …' : 'Change photo'}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={loading}
                className="hidden"
              />
            </label>
          </div>

          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Full name"
            className="subtle-input"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="subtle-input"
          />
          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="New password (optional)"
              className="subtle-input"
            />
            <PasswordStrength password={formData.password} />
          </div>

          <button
            type="submit"
            className="primary-btn w-full h-10 mt-1"
            disabled={saving}
          >
            {saving ? "Saving changes..." : "Save changes"}
          </button>
        </form>

        <div className="relative text-center mt-5">
          <Link
            to="/dashboard"
            className="text-indigo-300 text-sm hover:text-indigo-200 hover:underline"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </>
  );
}
