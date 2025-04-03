"use client";

import React from "react";
import "@fontsource/press-start-2p";

const recruiterProfile = {
  name: "Alice from PixelSoft",
  riskLevel: "MEDIUM",
  creditRating: 3, // out of 5
};

export default function RiskAssessment() {
  return (
    <div className="min-h-screen bg-yellow-50 flex items-center justify-center p-6 font-['Press Start 2P'] text-gray-800">
      <div className="bg-white border-4 border-blue-900 p-6 rounded-none shadow-[6px_6px_0px_black] max-w-md w-full text-center text-[10px]">
        <h1 className="text-xl text-blue-900 mb-6 border-b-4 border-blue-900 pb-2">
          🧮 RISK & CREDIT
        </h1>

        <p className="mb-4">👤 Recruiter: {recruiterProfile.name}</p>
        <p className="mb-4">⚠️ Risk Level: {recruiterProfile.riskLevel}</p>

        <div className="mb-4">
          <p className="mb-2">⭐ Credit Rating:</p>
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={
                  star <= recruiterProfile.creditRating
                    ? "text-yellow-500"
                    : "text-gray-400"
                }
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <button className="mt-4 bg-blue-900 text-white py-2 px-4 border-4 border-black rounded-none shadow-[4px_4px_0px_black] hover:bg-blue-800">
          🔍 VIEW PROFILE
        </button>
      </div>
    </div>
  );
}
