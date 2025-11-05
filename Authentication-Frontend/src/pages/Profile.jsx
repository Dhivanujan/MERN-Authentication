import React from "react";
import { Link } from "react-router-dom";

export default function Profile() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full sm:w-[400px]">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
          My Profile
        </h2>
        <div className="flex flex-col items-center gap-3">
          <img
            src="https://i.pravatar.cc/100"
            alt="User Avatar"
            className="w-20 h-20 rounded-full border-4 border-indigo-500"
          />
          <p className="text-lg font-medium text-gray-800">Dhivanujan Nesiah</p>
          <p className="text-sm text-gray-500">dhivanujan@example.com</p>
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
