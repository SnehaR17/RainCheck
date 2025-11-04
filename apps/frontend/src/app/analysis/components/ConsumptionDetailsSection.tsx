"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ConsumptionDetailsSection() {
  const [dwellers, setDwellers] = useState(4);
  const [waterUsage, setWaterUsage] = useState(500);
  const [roofType, setRoofType] = useState("Concrete");
  const [waterCost, setWaterCost] = useState(0.02);
  const [tankCapacity, setTankCapacity] = useState("");
  const [autoFillFlash, setAutoFillFlash] = useState(false);

  // Trigger a subtle cyan highlight when autofilled
  useEffect(() => {
    setAutoFillFlash(true);
    const timer = setTimeout(() => setAutoFillFlash(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Calculate total daily usage dynamically
  const totalUsage = dwellers * waterUsage;

  return (
    <motion.section
      id="consumption"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-3xl font-semibold text-amber-400">
          2. Water Consumption Details
        </h2>
        <p className="text-gray-400 text-sm">
          RainCheck has pre-filled typical values for your area. Adjust them if
          needed.
        </p>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {/* Number of Dwellers */}
        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-400">
            Number of Dwellers
          </label>
          <input
            type="number"
            value={dwellers}
            onChange={(e) => setDwellers(Number(e.target.value))}
            className={`mt-2 w-full bg-transparent border-b-2 px-1 py-2 text-gray-100 text-lg focus:outline-none transition-all duration-300 ${
              autoFillFlash
                ? "border-cyan-400"
                : "border-amber-400/20 focus:border-amber-400"
            }`}
          />
        </div>

        {/* Avg Daily Water Use */}
        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-400">
            Avg. Daily Water Use (L/person)
          </label>
          <input
            type="number"
            value={waterUsage}
            onChange={(e) => setWaterUsage(Number(e.target.value))}
            className={`mt-2 w-full bg-transparent border-b-2 px-1 py-2 text-gray-100 text-lg focus:outline-none transition-all duration-300 ${
              autoFillFlash
                ? "border-cyan-400"
                : "border-amber-400/20 focus:border-amber-400"
            }`}
          />
        </div>

        {/* Roof Type */}
        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-400">
            Roof Type
          </label>
          <select
            value={roofType}
            onChange={(e) => setRoofType(e.target.value)}
            className="mt-2 w-full bg-transparent border-b-2 px-1 py-2 text-gray-100 text-lg focus:outline-none focus:border-amber-400 border-amber-400/20 appearance-none"
          >
            <option className="bg-[#0B0B0C]" value="Concrete">
              Concrete
            </option>
            <option className="bg-[#0B0B0C]" value="Metal Sheet">
              Metal Sheet
            </option>
            <option className="bg-[#0B0B0C]" value="Tile">
              Tile
            </option>
            <option className="bg-[#0B0B0C]" value="Other">
              Other
            </option>
          </select>
        </div>

        {/* Local Water Cost */}
        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-400">
            Local Water Cost (₹/L)
          </label>
          <input
            type="number"
            step="0.001"
            value={waterCost}
            onChange={(e) => setWaterCost(Number(e.target.value))}
            className="mt-2 w-full bg-transparent border-b-2 px-1 py-2 text-gray-100 text-lg focus:outline-none focus:border-amber-400 border-amber-400/20"
          />
        </div>

        {/* Optional Tank Capacity */}
        <div className="sm:col-span-2">
          <label className="block text-xs uppercase tracking-wide text-gray-400">
            Optional Tank Capacity (L)
          </label>
          <input
            type="number"
            value={tankCapacity}
            onChange={(e) => setTankCapacity(e.target.value)}
            placeholder="e.g. 2000"
            className="mt-2 w-full bg-transparent border-b-2 px-1 py-2 text-gray-100 text-lg focus:outline-none focus:border-amber-400 border-amber-400/20 placeholder-gray-600"
          />
        </div>
      </div>

      {/* Dynamic Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="pt-4 border-t border-amber-400/10 text-center"
      >
        <p className="text-gray-300 text-base">
          Estimated total use:{" "}
          <span className="text-amber-300 font-semibold">
            {totalUsage.toLocaleString()} L/day
          </span>{" "}
          (~{(totalUsage * 30).toLocaleString()} L/month)
        </p>
      </motion.div>
    </motion.section>
  );
}
