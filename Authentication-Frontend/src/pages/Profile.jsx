import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/Toast";
import useToast from "../hooks/useToast";
import { fileToBase64 } from "../utils/file";

export default function Profile() {
  const { user, updateProfilePhoto } = useAuth();
  const [photoPreview, setPhotoPreview] = useState(user?.profilePhoto);
  const [loading, setLoading] = useState(false);
  const { toast, showSuccess, showError, hideToast } = useToast();

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
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

  const defaultAvatar = `https://i.pravatar.cc/100?u=${user?.email}`;

  return (
    <>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      <div className="glass-card rounded-3xl p-8 w-full max-w-sm relative overflow-hidden">
        <div className="absolute -top-24 -right-20 h-48 w-48 rounded-full bg-lavender-400/30 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 h-48 w-48 rounded-full bg-lavender-300/30 blur-3xl" />

        <h2 className="relative text-2xl font-bold text-slate-800 mb-8 text-center">
          My Profile
        </h2>

        <div className="relative flex flex-col items-center gap-5 mt-2">
          <div className="relative group">
            <div className="w-28 h-28 rounded-full p-1 bg-white shadow-xl shadow-lavender-200">
              <img
                src={photoPreview || defaultAvatar}
                alt="User Avatar"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <label className="absolute bottom-1 right-1 bg-lavender-600 text-white rounded-full p-2.5 cursor-pointer hover:bg-lavender-700 hover:scale-110 transition-all shadow-lg shadow-lavender-500/40 disabled:opacity-50">
              {loading ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M.5 3A1.5 1.5 0 0 1 2 1.5h12A1.5 1.5 0 0 1 15.5 3v9a1.5 1.5 0 0 1-1.5 1.5H2A1.5 1.5 0 0 1 .5 12V3zm1 4a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0z"/>
                </svg>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={loading}
                className="hidden"
              />
            </label>
          </div>
          
          <div className="text-center space-y-1">
            <p className="text-xl font-bold text-slate-800">{user?.username || "User"}</p>
            <p className="text-sm font-medium text-slate-500">{user?.email || "email@example.com"}</p>
          </div>
          
          <div className="w-full pt-4 border-t border-lavender-100">
            <p className="text-xs text-center text-slate-400">
              Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="relative mt-8 text-center">
          <Link
            to="/dashboard"
            className="primary-btn w-full justify-center h-11 shadow-lavender-500/20"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </>
  );
}
