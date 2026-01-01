import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import Input from "../components/Input";
import Button from "../components/Button";
import useToast from "../hooks/useToast";
import Toast from "../components/Toast";
import { authAPI } from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [resetLink, setResetLink] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast, showSuccess, showError, hideToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResetLink("");
    try {
      const response = await authAPI.forgotPassword(email);
      const link = response?.data?.resetUrl;
      if (link) setResetLink(link);
      showSuccess("Password reset link sent to your email (check console)");
    } catch (err) {
      showError(err.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
      <AuthCard title="Forgot Password" subtitle="Enter your email to reset your password">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email Address"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
          {resetLink && (
            <p className="text-sm text-slate-300 text-center">
              Dev shortcut: <a className="text-purple-200 font-medium hover:text-white" href={resetLink}>Open reset link</a>
            </p>
          )}
          <div className="text-center">
            <Link to="/" className="text-sm text-purple-200 hover:text-white font-medium">
              Back to Login
            </Link>
          </div>
        </form>
      </AuthCard>
    </>
  );
}
