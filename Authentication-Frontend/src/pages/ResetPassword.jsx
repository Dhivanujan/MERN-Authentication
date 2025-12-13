import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import Input from "../components/Input";
import Button from "../components/Button";
import useToast from "../hooks/useToast";
import Toast from "../components/Toast";
import { authAPI } from "../services/api";
import PasswordStrength from "../components/PasswordStrength";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { resetToken } = useParams();
  const navigate = useNavigate();
  const { toast, showSuccess, showError, hideToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await authAPI.resetPassword(resetToken, password);
      showSuccess("Password reset successful! Redirecting...");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      showError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
      <AuthCard title="Reset Password" subtitle="Create a new strong password">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <Input
              label="New Password"
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <PasswordStrength password={password} />
          </div>
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </AuthCard>
    </>
  );
}
