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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full sm:w-[400px]">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          Account Settings
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

          {/* Profile Photo Section */}
          <div className="flex flex-col items-center gap-3 pb-4 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-700">Profile Photo</p>
            <img
              src={photoPreview || defaultAvatar}
              alt="User Avatar"
              className="w-20 h-20 rounded-full border-4 border-indigo-500 object-cover"
            />
            <label className="bg-indigo-500 text-white px-4 py-2 rounded-full hover:bg-indigo-600 transition text-xs font-medium cursor-pointer">
              Change Photo
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
            placeholder="Full Name"
            className="border border-gray-300 rounded-full px-4 h-10 text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
          />
          <input
            type="email"
            defaultValue={user?.email || ""}
            placeholder="Email"
            className="border border-gray-300 rounded-full px-4 h-10 text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
          />
          <input
            type="password"
            placeholder="New Password"
            className="border border-gray-300 rounded-full px-4 h-10 text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
          />

          <button
            type="submit"
            className="bg-indigo-500 text-white rounded-full h-10 hover:bg-indigo-600 transition text-sm font-medium"
          >
            Save Changes
          </button>
        </form>

        <div className="text-center mt-5">
          <Link
            to="/dashboard"
            className="text-indigo-500 text-sm hover:underline"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
