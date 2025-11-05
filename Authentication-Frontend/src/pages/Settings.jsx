import React from "react";
import { Link } from "react-router-dom";

export default function Settings() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full sm:w-[400px]">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          Account Settings
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            className="border border-gray-300 rounded-full px-4 h-10 text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
          />
          <input
            type="email"
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
