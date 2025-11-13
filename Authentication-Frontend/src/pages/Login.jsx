// src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, error } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError("");

    try {
      if (!formData.email || !formData.password) {
        setFormError("Email and password are required");
        setLoading(false);
        return;
      }

      await login(formData.email, formData.password);
      navigate("/dashboard");
    } catch (err) {
      setFormError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="bg-white shadow-2xl rounded-2xl px-8 py-8 w-[90%] sm:w-[350px]">
        <div className="text-center mb-5">
          <h2 className="text-2xl font-semibold text-gray-900">Sign In</h2>
          <p className="text-xs text-gray-500 mt-2">
            Welcome back! Please log in to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {formError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-xs">
              {formError}
            </div>
          )}

          {/* Email Input */}
          <div className="flex items-center border border-gray-300 rounded-full px-4 h-10 gap-2 focus-within:ring-2 focus-within:ring-indigo-400 transition">
            <svg width="15" height="10" viewBox="0 0 16 11" className="text-gray-500">
              <path
                fill="currentColor"
                d="M0 .55L.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
              />
            </svg>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm w-full"
              required
            />
          </div>

          {/* Password Input */}
          <div className="flex items-center border border-gray-300 rounded-full px-4 h-10 gap-2 focus-within:ring-2 focus-within:ring-indigo-400 transition">
            <svg width="12" height="15" viewBox="0 0 13 17" className="text-gray-500">
              <path
                fill="currentColor"
                d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
              />
            </svg>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm w-full"
              required
            />
          </div>

          {/* Remember / Forgot */}
          <div className="flex items-center justify-between text-gray-600 text-xs mt-1">
            <label className="flex items-center gap-1">
              <input
                className="w-3.5 h-3.5 accent-indigo-500"
                type="checkbox"
              />
              Remember me
            </label>
            <a href="#" className="text-indigo-500 hover:underline">
              Forgot?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-3 w-full h-10 rounded-full text-white bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-400 transition font-medium text-sm"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Sign up */}
          <p className="text-gray-500 text-xs text-center mt-3">
            Don’t have an account?{" "}
            <Link to="/register" className="text-indigo-500 hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
