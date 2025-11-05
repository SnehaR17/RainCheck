"use client";
import { motion } from "framer-motion";
import { Wallet, Coins, FileText, ChevronDown } from "lucide-react";
import { useState } from "react";

type CostItem = {
  label: string;
  amountINR: number;
  description?: string;
};

type BudgetEstimatorProps = {
  analysis?: any;
  plan?: {
    cost?: {
      installationCost?: number;
      subsidyINR?: number;
      netCostINR?: number;
      items?: CostItem[];
    };
  };
};

export default function BudgetEstimator({ analysis, plan }: BudgetEstimatorProps) {
  const [open, setOpen] = useState(false);

  // ✅ Proper net cost calculation
  const estimatedCost =
    plan?.cost?.installationCost ??
    analysis?.economicAnalysis?.installationCost ??
    0;
  const subsidy =
    plan?.cost?.subsidyINR ??
    (analysis?.economicAnalysis?.subsidyEligible ? 10000 : 0);

  const netCost =
    plan?.cost?.netCostINR ??
    Math.max(estimatedCost - subsidy, 0); // ensure it never goes negative

  const items: CostItem[] =
    plan?.cost?.items || [
      { label: "RCC / HDPE Tank", amountINR: Math.round(estimatedCost * 0.6) },
      { label: "Filtration Unit", amountINR: Math.round(estimatedCost * 0.15) },
      { label: "Piping & Plumbing", amountINR: Math.round(estimatedCost * 0.15) },
      { label: "Labor & Misc.", amountINR: Math.round(estimatedCost * 0.1) },
    ];

  const total = items.reduce((acc, item) => acc + item.amountINR, 0);

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
          Budget Estimator
        </h3>
        <p className="text-xs text-gray-400 tracking-wide">
          Estimated cost breakdown and subsidies 💰
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col items-center justify-center bg-[#0F1412]/60 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
          <Wallet className="h-5 w-5 text-amber-400 mb-1" />
          <p className="text-xs text-gray-400">Installation Cost</p>
          <p className="text-lg font-semibold text-amber-300">
            ₹{estimatedCost.toLocaleString()}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center bg-[#0F1412]/60 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
          <Coins className="h-5 w-5 text-emerald-400 mb-1" />
          <p className="text-xs text-gray-400">Estimated Subsidy</p>
          <p className="text-lg font-semibold text-emerald-300">
            ₹{subsidy.toLocaleString()}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center bg-[#0F1412]/60 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-[0_0_15px_rgba(56,189,248,0.15)]">
          <FileText className="h-5 w-5 text-sky-400 mb-1" />
          <p className="text-xs text-gray-400">Net Cost (after subsidy)</p>
          <p className="text-lg font-semibold text-sky-300">
            ₹{netCost.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Accordion for Detailed Breakdown */}
      <div className="mt-2 border border-white/10 rounded-xl overflow-hidden">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex justify-between items-center px-4 py-3 bg-[#0F1412]/60 hover:bg-[#141a17]/70 transition-all"
        >
          <span className="font-medium text-gray-200 text-sm">
            View Detailed Cost Breakdown
          </span>
          <ChevronDown
            className={`h-4 w-4 text-amber-300 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {open && (
          <div className="p-4 bg-[#0B0E0C]/60 backdrop-blur-md text-sm">
            <table className="w-full text-left text-gray-300">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400">
                  <th className="pb-1">Item</th>
                  <th className="pb-1 text-right">Cost (₹)</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-800">
                    <td className="py-1">{item.label}</td>
                    <td className="py-1 text-right">
                      ₹{item.amountINR.toLocaleString()}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="py-2 font-semibold text-amber-300">Total</td>
                  <td className="py-2 text-right font-semibold text-amber-300">
                    ₹{total.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="text-xs text-gray-500 mt-3 italic">
              *Values are indicative and may vary based on vendor quotes and
              regional subsidies.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
