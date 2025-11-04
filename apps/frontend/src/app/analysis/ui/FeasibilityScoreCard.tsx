"use client";
import { motion } from "framer-motion";

export default function FeasibilityScoreCard({ score, liters }: any) {
  return (
    <motion.div
      className="p-5 bg-[#0E0E10]/80 rounded-xl border border-amber-400/10 text-center"
      whileHover={{ scale: 1.03 }}
    >
      <h3 className="text-xl font-semibold text-amber-400">Feasibility Score</h3>
      <p className="text-5xl font-bold text-gray-100 my-3">{score}%</p>
      <p className="text-sm text-gray-400">Potential: {Math.round(liters).toLocaleString()} L/year</p>
    </motion.div>
  );
}
