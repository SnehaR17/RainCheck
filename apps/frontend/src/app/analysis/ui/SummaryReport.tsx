"use client";

import { motion } from "framer-motion";

interface SummaryReportProps {
  data: {
    city?: string;
    roofArea: number;
    annualRainfall: number;
    annualHarvest: number;
    tankSize: number;
    score: number;
    savings: number;
  };
}

export default function SummaryReport({ data }: SummaryReportProps) {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const summaryItems = [
    { label: "City", value: data.city || "Bengaluru" },
    { label: "Roof Area", value: `${data.roofArea} m²` },
    { label: "Annual Rainfall", value: `${data.annualRainfall} mm` },
    { label: "Annual Harvest Potential", value: `${data.annualHarvest.toLocaleString()} L` },
    { label: "Recommended Tank Size", value: `${data.tankSize.toLocaleString()} L` },
    { label: "Feasibility Score", value: `${data.score}%` },
    { label: "Estimated Annual Savings", value: `₹${data.savings.toLocaleString()}` },
  ];

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.8 }}
      className=" backdrop-blur-xl p-8 rounded-2xl border border-amber-400/10 shadow-lg shadow-black/20"
    >
      <h3 className="text-2xl font-semibold text-amber-300 mb-6">
        Feasibility Summary
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {summaryItems.map((item, index) => (
          <motion.div
            key={item.label}
            variants={fadeIn}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="p-4 rounded-xl bg-gradient-to-br from-[#141416] to-[#1C1C1F] border border-amber-400/5 hover:border-amber-400/20 transition-all"
          >
            <p className="text-gray-400 text-sm">{item.label}</p>
            <p className="text-lg font-semibold text-gray-100 mt-1 tracking-tight">
              {item.value}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 border-t border-gray-800 pt-6">
        <h4 className="text-xl font-semibold text-gray-100 mb-2">Decision</h4>
        {data.score >= 60 ? (
          <p className="text-emerald-400 font-medium">
            Based on your data, installing a Rainwater Harvesting system is highly recommended.
            The feasibility score indicates a strong potential for efficiency and savings.
          </p>
        ) : (
          <p className="text-red-400 font-medium">
            Based on current parameters, a Rainwater Harvesting system may not yield optimal results.
            Consider increasing roof area or exploring better storage options.
          </p>
        )}
      </div>
    </motion.div>
  );
}
