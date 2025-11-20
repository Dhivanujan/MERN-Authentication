import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, updateProfilePhoto } = useAuth();
  const [photoPreview, setPhotoPreview] = useState(user?.profilePhoto);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
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

  const defaultAvatar = `https://i.pravatar.cc/100?u=${user?.email}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center py-10 px-4">
      <div className="absolute inset-0 -z-10 opacity-40 bg-[radial-gradient(circle_at_top,_#4f46e5_0,_transparent_55%),_radial-gradient(circle_at_bottom,_#22d3ee_0,_transparent_55%)]" />
      <div className="glass-card rounded-3xl p-8 w-full max-w-sm relative overflow-hidden">
        <div className="absolute -top-16 -right-10 h-32 w-32 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute -bottom-16 -left-10 h-32 w-32 rounded-full bg-cyan-400/20 blur-3xl" />

        <h2 className="relative text-2xl font-semibold text-slate-50 mb-6 text-center">
          My profile
        </h2>

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

        <div className="relative flex flex-col items-center gap-4 mt-2">
          <div className="relative">
            <img
              src={photoPreview || defaultAvatar}
              alt="User Avatar"
              className="w-24 h-24 rounded-full border-4 border-indigo-400 object-cover shadow-lg shadow-slate-950/70"
            />
            <label className="absolute bottom-0 right-0 bg-indigo-500 text-white rounded-full p-2 cursor-pointer hover:bg-indigo-400 transition shadow-md shadow-slate-950/70">
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                <path d="M.5 3A1.5 1.5 0 0 1 2 1.5h12A1.5 1.5 0 0 1 15.5 3v9a1.5 1.5 0 0 1-1.5 1.5H2A1.5 1.5 0 0 1 .5 12V3zm1 4a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0z"/>
              </svg>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={loading}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-lg font-medium text-slate-50">{user?.username || "User"}</p>
          <p className="text-sm text-slate-400">{user?.email || "email@example.com"}</p>
          <p className="text-[11px] text-slate-500">Click the camera to refresh your avatar</p>
        </div>

        <div className="relative mt-6 text-center">
          <Link
            to="/dashboard"
            className="primary-btn w-full justify-center h-10"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
