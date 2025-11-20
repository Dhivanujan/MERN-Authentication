import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { user, updateProfilePhoto } = useAuth();
  const [success, setSuccess] = useState("");
  const [photoPreview, setPhotoPreview] = useState(user?.profilePhoto);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result;
        setPhotoPreview(base64);
        
        // Update profile photo in backend
        await updateProfilePhoto(base64);
        setSuccess("Profile photo updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError(err.message || "Failed to update profile photo");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess("Settings saved successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };

  const defaultAvatar = `https://i.pravatar.cc/100?u=${user?.email}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center py-10 px-4">
      <div className="absolute inset-0 -z-10 opacity-40 bg-[radial-gradient(circle_at_top,_#4f46e5_0,_transparent_55%),_radial-gradient(circle_at_bottom,_#22d3ee_0,_transparent_55%)]" />
      <div className="glass-card rounded-3xl p-8 w-full max-w-sm relative overflow-hidden">
        <div className="absolute -top-16 -right-10 h-32 w-32 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute -bottom-16 -left-10 h-32 w-32 rounded-full bg-cyan-400/20 blur-3xl" />

        <h2 className="relative text-2xl font-semibold text-slate-50 mb-6 text-center">
          Account settings
        </h2>

        <form onSubmit={handleSubmit} className="relative flex flex-col gap-4">
          {error && (
            <div className="mb-3 p-3 bg-red-500/10 border border-red-500/60 text-red-200 rounded-xl text-xs backdrop-blur">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-3 p-3 bg-emerald-500/10 border border-emerald-500/60 text-emerald-200 rounded-xl text-xs backdrop-blur">
              {success}
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
              Change photo
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
            defaultValue={user?.username || ""}
            placeholder="Full name"
            className="subtle-input"
          />
          <input
            type="email"
            defaultValue={user?.email || ""}
            placeholder="Email"
            className="subtle-input"
          />
          <input
            type="password"
            placeholder="New password (optional)"
            className="subtle-input"
          />

          <button
            type="submit"
            className="primary-btn w-full h-10 mt-1"
          >
            Save changes
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
    </div>
  );
}
