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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full sm:w-[400px]">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          My Profile
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-xs">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-xs">
            {success}
          </div>
        )}

        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <img
              src={photoPreview || defaultAvatar}
              alt="User Avatar"
              className="w-24 h-24 rounded-full border-4 border-indigo-500 object-cover"
            />
            <label className="absolute bottom-0 right-0 bg-indigo-500 text-white rounded-full p-2 cursor-pointer hover:bg-indigo-600 transition">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
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
          <p className="text-lg font-medium text-gray-800">{user?.username || "User"}</p>
          <p className="text-sm text-gray-500">{user?.email || "email@example.com"}</p>
          <p className="text-xs text-gray-400">Click camera icon to change photo</p>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/dashboard"
            className="inline-block bg-indigo-500 text-white px-5 py-2 rounded-full hover:bg-indigo-600 transition text-sm"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
