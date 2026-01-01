import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PasswordStrength from "../components/PasswordStrength";
import Toast from "../components/Toast";
import useToast from "../hooks/useToast";
import { fileToBase64 } from "../utils/file";
import Input from "../components/Input";
import Button from "../components/Button";
import defaultAvatar from "../assets/default-avatar.svg";

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

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      showError("Please upload a valid image (JPEG, PNG)");
      return;
    }

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
    setInlineError("");
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

    if (formData.password && formData.password.length < 6) {
      const validationMessage = "Password must be at least 6 characters";
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

  return (
    <>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Account Settings</h1>
          <p className="text-slate-300">Manage your account details and security preferences.</p>
        </div>

        <div className="bg-white/5 rounded-2xl border border-white/10 shadow-xl shadow-slate-950/40 overflow-hidden">
          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {inlineError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/40 text-rose-100 rounded-lg text-sm font-medium">
                  {inlineError}
                </div>
              )}

              {/* Profile Photo Section */}
              <div className="flex items-center gap-6 pb-6 border-b border-white/10">
                <div className="relative">
                  <img
                    src={photoPreview || user?.profilePhoto || defaultAvatar}
                    alt="User Avatar"
                    className="w-16 h-16 rounded-full object-cover border border-white/20"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-slate-100">Profile Photo</h3>
                  <p className="text-xs text-slate-300 mb-3">Update your profile picture.</p>
                  <label className="inline-flex items-center px-3 py-1.5 bg-white/10 border border-white/20 rounded-md text-xs font-medium text-white hover:bg-white/20 cursor-pointer transition-colors shadow-sm">
                    {loading ? 'Uploading...' : 'Change photo'}
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={handlePhotoUpload}
                      disabled={loading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid gap-5">
                <Input
                  label="Full Name"
                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-sm font-medium text-slate-100 mb-4">Change Password</h3>
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                />
                
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@company.com"
                />

                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-medium text-slate-900 mb-4">Change Password</h3>
                  <div className="space-y-1">
                    <Input
                      label="New Password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Leave blank to keep current password"
                    />
                    {formData.password && <PasswordStrength password={formData.password} />}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <Link to="/dashboard">
                  <Button variant="ghost" type="button" className="text-slate-200 hover:text-white">Cancel</Button>
                </Link>
                <Button type="submit" disabled={saving} className="w-auto">
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
