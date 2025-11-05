"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Wand2, Settings, Clock, Droplets, ChevronDown } from "lucide-react";

export default function UserPreferenceForm({
  onGenerate,
  loading,
}: {
  onGenerate: (p: any) => void;
  loading?: boolean;
}) {
  const [budget, setBudget] = useState("medium");
  const [goal, setGoal] = useState("partial");
  const [maintenance, setMaintenance] = useState("professional");
  const [timeframe, setTimeframe] = useState("3 months");

  const handleSubmit = () => onGenerate({ budget, goal, maintenance, timeframe });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6 font-[Geist] text-gray-100"
    >
      {/* Header */}
      <div className="text-center space-y-1">
        <h3 className="text-xl font-semibold bg-gradient-to-r from-amber-400 to-emerald-400 bg-clip-text text-transparent">
          Project Preferences
        </h3>
        <p className="text-xs text-gray-400 tracking-wide">
          Help us tailor your rainwater harvesting plan 🌧️
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-5">
        {/* ===== Budget ===== */}
        <div className="flex flex-col">
          <label className="flex items-center gap-2 text-sm text-gray-300 mb-1">
            <Settings className="h-4 w-4 text-amber-400" /> Budget
          </label>
          <div className="relative group">
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full appearance-none bg-[#0B0E0C]/60 backdrop-blur-md border border-white/10 text-gray-100 rounded-xl px-3 py-2 pr-10 focus:ring-2 focus:ring-amber-400/80 focus:shadow-[0_0_15px_rgba(245,158,11,0.25)] transition-all outline-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none group-hover:text-amber-300 transition-all" />
          </div>
        </div>

        {/* ===== Goal ===== */}
        <div className="flex flex-col">
          <label className="flex items-center gap-2 text-sm text-gray-300 mb-1">
            <Droplets className="h-4 w-4 text-emerald-400" /> Water dependency goal
          </label>
          <div className="relative group">
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full appearance-none bg-[#0B0E0C]/60 backdrop-blur-md border border-white/10 text-gray-100 rounded-xl px-3 py-2 pr-10 focus:ring-2 focus:ring-emerald-400/80 focus:shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-all outline-none"
            >
              <option value="partial">Partial (supplement)</option>
              <option value="full">Full (primary)</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none group-hover:text-emerald-300 transition-all" />
          </div>
        </div>

        {/* ===== Maintenance ===== */}
        <div className="flex flex-col">
          <label className="flex items-center gap-2 text-sm text-gray-300 mb-1">
            <Wand2 className="h-4 w-4 text-sky-400" /> Maintenance preference
          </label>
          <div className="relative group">
            <select
              value={maintenance}
              onChange={(e) => setMaintenance(e.target.value)}
              className="w-full appearance-none bg-[#0B0E0C]/60 backdrop-blur-md border border-white/10 text-gray-100 rounded-xl px-3 py-2 pr-10 focus:ring-2 focus:ring-sky-400/80 focus:shadow-[0_0_15px_rgba(56,189,248,0.25)] transition-all outline-none"
            >
              <option value="professional">Professional</option>
              <option value="diy">DIY</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none group-hover:text-sky-300 transition-all" />
          </div>
        </div>

        {/* ===== Timeframe ===== */}
        <div className="flex flex-col">
          <label className="flex items-center gap-2 text-sm text-gray-300 mb-1">
            <Clock className="h-4 w-4 text-amber-400" /> Implementation timeframe
          </label>
          <input
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            placeholder="e.g., 3 months"
            className="bg-[#0B0E0C]/60 backdrop-blur-md border border-white/10 text-gray-100 rounded-xl px-3 py-2 placeholder-gray-500 focus:ring-2 focus:ring-amber-400/80 focus:shadow-[0_0_15px_rgba(245,158,11,0.25)] focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* ===== Submit Button (hydration-safe) ===== */}
      <div className="mt-6">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold tracking-wide transition-transform duration-200 ${
            loading
              ? "bg-emerald-700/40 text-gray-300 cursor-wait"
              : "bg-gradient-to-r from-amber-400 to-emerald-400 text-black hover:scale-[1.03] active:scale-[0.97] hover:from-amber-300 hover:to-emerald-300"
          }`}
        >
          {loading ? "Generating..." : "Generate Plan"}
        </button>

        <p className="text-xs text-gray-500 text-center mt-2">
          Takes less than 10 seconds ✨
        </p>
      </div>
    </motion.div>
  );
}
