import React, { useState } from "react";

export default function PasswordStrength({ password }) {
  const calculateStrength = () => {
    if (!password) return { strength: 0, label: "", color: "" };
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    const levels = [
      { strength: 0, label: "", color: "" },
      { strength: 1, label: "Weak", color: "bg-red-400" },
      { strength: 2, label: "Fair", color: "bg-orange-400" },
      { strength: 3, label: "Good", color: "bg-yellow-400" },
      { strength: 4, label: "Strong", color: "bg-emerald-500" },
      { strength: 5, label: "Very Strong", color: "bg-emerald-600" },
    ];

    return levels[strength];
  };

  const { strength, label, color } = calculateStrength();

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full transition-all ${
              level <= strength ? color : "bg-slate-200"
            }`}
          />
        ))}
      </div>
      {label && (
        <p className="text-[10px] text-slate-500 font-medium">
          Password strength: <span className={color.replace("bg-", "text-")}>{label}</span>
        </p>
      )}
    </div>
  );
}
