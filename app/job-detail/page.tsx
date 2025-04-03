"use client";

import React from 'react';
import "@fontsource/press-start-2p";

const job = {
  title: "Frontend Developer",
  company: "PixelSoft",
  location: "Remote",
  salary: "$3000/month",
  description:
    "We're looking for a pixel-perfect frontend developer who loves retro aesthetics and clean code. You will be responsible for crafting beautiful user interfaces with React.",
};

export default function JobDetailsCard() {
  return (
    <div className="min-h-screen bg-yellow-50 flex items-center justify-center p-6 font-['Press Start 2P'] text-gray-800">
      <div className="bg-white border-4 border-blue-900 p-6 rounded-none shadow-[6px_6px_0px_black] max-w-xl w-full text-[10px]">
        <h1 className="text-xl text-blue-900 mb-4 border-b-4 border-blue-900 pb-2 text-center">
          🧱 {job.title}
        </h1>
        <p className="mb-2">🏢 Company: {job.company}</p>
        <p className="mb-2">🌍 Location: {job.location}</p>
        <p className="mb-4">💸 Salary: {job.salary}</p>
        <p className="mb-6 text-gray-700">{job.description}</p>
        <button className="w-full bg-blue-900 text-white py-3 border-4 border-black rounded-none shadow-[4px_4px_0px_black] hover:bg-blue-800">
          🎯 APPLY NOW
        </button>
      </div>
    </div>
  );
}
