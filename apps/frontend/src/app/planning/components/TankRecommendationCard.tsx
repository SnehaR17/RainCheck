"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Droplets, Info } from "lucide-react";

interface TankStats {
  durability: string;
  maintenance: string;
  cost: string;
}

export default function TankRecommendationCard({
  analysis,
  plan,
  onSelect,
}: {
  analysis: any;
  plan: any;
  onSelect?: (tankType: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const tank = plan?.tank || {};
  const tankSize = analysis?.tankSize || tank?.recommendedSizeL || "—";
  const mainType = tank?.type || "RCC / Plastic (TBD)";
  const justification =
    tank?.justification ||
    "This tank type provides optimal cost-to-durability balance based on your rooftop and rainfall data.";

  const tankStats = {
    [mainType]: { durability: "High", maintenance: "Low", cost: "Moderate" },
    "HDPE Modular": { durability: "Medium", maintenance: "Low", cost: "Low" },
    FRP: { durability: "Medium", maintenance: "Medium", cost: "Moderate" },
    "Underground Concrete": {
      durability: "High",
      maintenance: "Medium",
      cost: "High",
    },
  };

  const alternatives =
    tank?.alternatives?.length > 0
      ? tank.alternatives
      : ["HDPE Modular", "FRP", "Underground Concrete"];

  const handleSelect = (type: string) => {
    setSelected(type);
    if (onSelect) onSelect(type);
  };

  if (!analysis) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl border border-white/10 bg-[#0F1412]/60 backdrop-blur-md text-gray-400 text-center"
      >
        <p>No analysis data available. Run analysis first.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative p-6 rounded-2xl bg-[#0F1412]/60 backdrop-blur-md border border-white/10 shadow-[0_0_20px_rgba(16,185,129,0.05)] hover:shadow-[0_0_25px_rgba(16,185,129,0.15)] transition-all duration-500 font-[Geist] text-gray-100"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <motion.div
          animate={{ rotate: [0, 3, -3, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="p-2 rounded-full bg-emerald-500/10 border border-emerald-500/20"
        >
          <Droplets className="h-5 w-5 text-emerald-400" />
        </motion.div>
        <h3 className="text-lg sm:text-xl font-medium bg-gradient-to-r from-emerald-400 to-amber-300 bg-clip-text text-transparent">
          Recommended Tank & System
        </h3>
      </div>

      {/* Recommended Tank */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        onClick={() => handleSelect(mainType)}
        className={`relative cursor-pointer p-6 rounded-2xl mb-8 border transition-all duration-500 overflow-hidden 
        ${
          selected === mainType
            ? "bg-gradient-to-br from-emerald-600/20 to-emerald-400/10 border-emerald-400/60 shadow-[0_0_25px_rgba(16,185,129,0.2)]"
            : "bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-400/40 hover:border-emerald-300/50"
        }`}
      >
        <div className="absolute top-3 right-4 text-[10px] text-emerald-300 bg-emerald-400/10 border border-emerald-400/30 px-2 py-0.5 rounded-md uppercase font-medium tracking-wide">
          Recommended
        </div>

        <div className="space-y-2">
          <p className="text-xl font-semibold text-emerald-300">{mainType}</p>
          <p className="text-sm text-gray-400">Capacity: {tankSize} L</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4 text-[15px] text-gray-300">
          {["Durability", "Maintenance", "Cost"].map((label, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="rounded-lg bg-[#0B0E0C]/60 border border-white/10 text-center py-3 backdrop-blur-sm"
            >
              <p className="text-[13px] text-gray-400 mb-1">{label}</p>
              <p
                className={`font-medium ${
                  label === "Durability"
                    ? "text-emerald-300"
                    : label === "Maintenance"
                    ? "text-amber-300"
                    : "text-gray-200"
                }`}
              >
                {
                  tankStats[mainType][
                    label.toLowerCase() as keyof (typeof tankStats)[typeof mainType]
                  ]
                }
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Viable Options */}
      <div className="space-y-4">
        <p className="text-xs text-gray-400">Other Viable Options</p>

        <div className="grid md:grid-cols-2 gap-5">
          {alternatives.map((type: string, idx: number) => {
            const stats: TankStats =
              tankStats[type as keyof typeof tankStats] || {
                durability: "Medium",
                maintenance: "Medium",
                cost: "Moderate",
              };
            const isSelected: boolean = type === selected;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + idx * 0.15 }}
                whileHover={{ scale: 1.015 }}
                onClick={() => handleSelect(type)}
                className={`cursor-pointer select-none p-6 rounded-2xl min-h-[180px] border transition-all duration-500 backdrop-blur-md 
                          ${
                            isSelected
                              ? "bg-emerald-500/20 border-emerald-400/50 shadow-[0_0_25px_rgba(16,185,129,0.25)]"
                              : "bg-[#0B0E0C]/60 border-white/10 hover:border-amber-400/40"
                          }`}
              >
                <p
                  className={`text-lg font-medium mb-3 ${
                    isSelected ? "text-emerald-300" : "text-gray-200"
                  }`}
                >
                  {type}
                </p>

                <div className="grid grid-cols-3 gap-4 text-[15px] text-gray-300">
                  {["Durability", "Maintenance", "Cost"].map(
                    (label: string, i: number) => (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="rounded-lg bg-[#0F1412]/60 border border-white/10 text-center py-2 backdrop-blur-sm"
                      >
                        <p className="text-[13px] text-gray-400 mb-1">
                          {label}
                        </p>
                        <p
                          className={`font-medium ${
                            label === "Durability"
                              ? "text-emerald-300"
                              : label === "Maintenance"
                              ? "text-amber-300"
                              : "text-gray-200"
                          }`}
                        >
                          {stats[label.toLowerCase() as keyof TankStats]}
                        </p>
                      </motion.div>
                    )
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Justification Section */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 overflow-hidden"
          >
            <div className="p-5 rounded-2xl bg-[#0F1412]/60 border border-white/10 backdrop-blur-md">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-emerald-300 mt-0.5" />
                <p className="text-gray-300 text-sm leading-relaxed">
                  {justification}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle */}
      <motion.button
        onClick={() => setExpanded((prev) => !prev)}
        whileHover={{ scale: 1.03 }}
        className="mt-6 text-sm text-emerald-300 hover:text-amber-300 transition-all"
      >
        {expanded ? "Hide Details" : "Why this Recommendation?"}
      </motion.button>
    </motion.div>
  );
}
