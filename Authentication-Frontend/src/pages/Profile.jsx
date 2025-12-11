import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/Toast";
import useToast from "../hooks/useToast";
import { fileToBase64 } from "../utils/file";
import Button from "../components/Button";

export default function Profile() {
  const { user, updateProfilePhoto } = useAuth();
  const [photoPreview, setPhotoPreview] = useState(user?.profilePhoto);
  const [loading, setLoading] = useState(false);
  const { toast, showSuccess, showError, hideToast } = useToast();

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      showError("Please upload a valid image (JPEG, PNG)");
      return;
    }

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

  return (
    <>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Profile Settings</h1>
          <p className="text-slate-500">Manage your public profile and account appearance.</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start gap-8">
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-50 shadow-sm bg-slate-100">
                    <img
                      src={photoPreview || user?.profilePhoto}
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <label className="absolute bottom-0 right-0 bg-white text-slate-600 p-2 rounded-full cursor-pointer shadow-md border border-slate-100 hover:text-primary-600 transition-colors">
                    {loading ? (
                      <div className="h-5 w-5 border-2 border-slate-300 border-t-primary-600 rounded-full animate-spin" />
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={handlePhotoUpload}
                      disabled={loading}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-xs text-slate-500 text-center max-w-[150px]">
                  Click the camera icon to upload a new photo.
                </p>
              </div>

              {/* Info Section */}
              <div className="flex-grow w-full space-y-6">
                <div className="grid gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                    <div className="flex items-center px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600">
                      {user?.username || "User"}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                    <div className="flex items-center px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600">
                      {user?.email || "email@example.com"}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Member Since</label>
                    <div className="text-sm text-slate-600">
                      {new Date(user?.createdAt || Date.now()).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end">
            <Link to="/dashboard">
              <Button variant="secondary" className="w-auto">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
