import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
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
      if (!formData.username || !formData.email || !formData.password) {
        setFormError("All fields are required");
        setLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setFormError("Passwords do not match");
        setLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setFormError("Password must be at least 6 characters");
        setLoading(false);
        return;
      }

      await register(formData.username, formData.email, formData.password);
      navigate("/dashboard");
    } catch (err) {
      setFormError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="bg-white shadow-2xl rounded-2xl px-8 py-8 w-[90%] sm:w-[350px]">
        <div className="text-center mb-5">
          <h2 className="text-2xl font-semibold text-gray-900">Create Account</h2>
          <p className="text-xs text-gray-500 mt-2">
            Join us today! Fill in your details to sign up
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {formError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-xs">
              {formError}
            </div>
          )}

          {/* Full Name */}
          <div className="flex items-center border border-gray-300 rounded-full px-4 h-10 gap-2 focus-within:ring-2 focus-within:ring-indigo-400 transition">
            <svg width="16" height="16" fill="currentColor" className="text-gray-500" viewBox="0 0 16 16">
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
              <path fillRule="evenodd" d="M14 14s-1-4-6-4-6 4-6 4 2 2 6 2 6-2 6-2z"/>
            </svg>
            <input
              type="text"
              name="username"
              placeholder="Full Name"
              value={formData.username}
              onChange={handleChange}
              className="bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm w-full"
              required
            />
          </div>

          {/* Email */}
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

          {/* Password */}
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

          {/* Confirm Password */}
          <div className="flex items-center border border-gray-300 rounded-full px-4 h-10 gap-2 focus-within:ring-2 focus-within:ring-indigo-400 transition">
            <svg width="12" height="15" viewBox="0 0 13 17" className="text-gray-500">
              <path
                fill="currentColor"
                d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
              />
            </svg>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm w-full"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-3 w-full h-10 rounded-full text-white bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-400 transition font-medium text-sm"
          >
            {loading ? "Creating account..." : "Register"}
          </button>

          {/* Login Redirect */}
          <p className="text-gray-500 text-xs text-center mt-3">
            Already have an account?{" "}
            <Link to="/" className="text-indigo-500 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
