import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
        <nav className="flex gap-4 text-sm text-gray-600">
          <Link to="/profile" className="hover:text-indigo-500">Profile</Link>
          <Link to="/settings" className="hover:text-indigo-500">Settings</Link>
          <Link to="/" className="text-red-500 hover:underline">Logout</Link>
        </nav>
      </header>

      {/* Content */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome Back 👋
        </h2>
        <p className="text-gray-500 mb-6">
          You’ve successfully logged in to your account.
        </p>

        <div className="grid sm:grid-cols-3 gap-5 w-full max-w-4xl">
          <div className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition">
            <h3 className="font-medium text-gray-800 mb-2">Users</h3>
            <p className="text-gray-500 text-sm">Manage or view user accounts.</p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition">
            <h3 className="font-medium text-gray-800 mb-2">Analytics</h3>
            <p className="text-gray-500 text-sm">View performance insights.</p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition">
            <h3 className="font-medium text-gray-800 mb-2">Messages</h3>
            <p className="text-gray-500 text-sm">Check your recent messages.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
