"use client";
import { useState } from "react";

export default function ConsumptionDetailsSection() {
  const [dwellers, setDwellers] = useState(4);
  const [waterUsage, setWaterUsage] = useState(500);

  return (
    <section id="consumption" className="space-y-6">
      <h2 className="text-3xl font-semibold text-amber-400">2. Water Consumption Details</h2>
      <p className="text-gray-400">Enter your household details to estimate your rainwater harvesting potential.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-[#0E0E10]/80 p-5 rounded-xl border border-amber-400/10">
          <label className="text-sm text-gray-400">👨‍👩‍👧 Number of Dwellers</label>
          <input
            type="number"
            value={dwellers}
            onChange={(e) => setDwellers(Number(e.target.value))}
            className="mt-2 w-full bg-[#1A1A1C] p-2 rounded-md text-gray-200 border border-gray-700 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="bg-[#0E0E10]/80 p-5 rounded-xl border border-amber-400/10">
          <label className="text-sm text-gray-400">💧 Avg. Daily Water Use (Liters)</label>
          <input
            type="number"
            value={waterUsage}
            onChange={(e) => setWaterUsage(Number(e.target.value))}
            className="mt-2 w-full bg-[#1A1A1C] p-2 rounded-md text-gray-200 border border-gray-700 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>
    </section>
  );
}
