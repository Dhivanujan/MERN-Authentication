import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
          {user && <p className="text-xs text-gray-500">Welcome, {user.username}!</p>}
        </div>
        <nav className="flex gap-4 text-sm">
          <Link to="/profile" className="text-gray-600 hover:text-indigo-500">Profile</Link>
          <Link to="/settings" className="text-gray-600 hover:text-indigo-500">Settings</Link>
          <button
            onClick={handleLogout}
            className="text-red-500 hover:underline bg-none border-none cursor-pointer"
          >
            Logout
          </button>
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
