"use client";

import { motion } from "framer-motion";
import { Wallet, Info, IndianRupee } from "lucide-react";

export default function BudgetEstimator({
  analysis,
  plan,
}: {
  analysis?: any;
  plan?: any;
}) {
  const costs = plan?.cost || analysis?.economicAnalysis || {};

  const {
    installationINR = costs.installationCost ?? null,
    materialsINR = costs.materialsCost ?? null,
    maintenanceINR = costs.maintenanceCost ?? null,
    subsidyINR = costs.subsidyINR ?? null,
    netCostINR = costs.netCostINR ?? null,
  } = costs;

  const hasBreakdown =
    installationINR || materialsINR || maintenanceINR || subsidyINR || netCostINR;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_25px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(16,185,129,0.1)] transition-all duration-500"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-emerald-400" />
          <h4 className="text-lg font-medium bg-gradient-to-r from-emerald-400 to-amber-300 bg-clip-text text-transparent">
            Budget Estimate
          </h4>
        </div>
        <Info className="h-4 w-4 text-gray-400 hover:text-amber-300 transition-colors cursor-pointer" />
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-4 rounded-xl bg-[#0B0E0C]/50 border border-white/10 mb-5 flex items-center justify-between"
      >
        <p className="text-gray-300 text-sm">Estimated Installation Cost</p>
        <p className="text-xl font-semibold text-emerald-300 flex items-center gap-1">
          <IndianRupee className="h-4 w-4" />
          {installationINR ? installationINR.toLocaleString() : "—"}
        </p>
      </motion.div>

      {/* Cost Breakdown */}
      {hasBreakdown ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {materialsINR && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="rounded-xl bg-white/5 border border-white/10 p-3 text-sm backdrop-blur-md"
            >
              <p className="text-gray-400">Materials</p>
              <p className="text-emerald-300 font-semibold mt-1">
                ₹{materialsINR.toLocaleString()}
              </p>
            </motion.div>
          )}

          {maintenanceINR && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="rounded-xl bg-white/5 border border-white/10 p-3 text-sm backdrop-blur-md"
            >
              <p className="text-gray-400">Annual Maintenance</p>
              <p className="text-emerald-300 font-semibold mt-1">
                ₹{maintenanceINR.toLocaleString()}
              </p>
            </motion.div>
          )}

          {subsidyINR && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="rounded-xl bg-white/5 border border-white/10 p-3 text-sm backdrop-blur-md"
            >
              <p className="text-gray-400">Eligible Subsidy</p>
              <p className="text-amber-300 font-semibold mt-1">
                ₹{subsidyINR.toLocaleString()}
              </p>
            </motion.div>
          )}

          {netCostINR && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="rounded-xl bg-white/5 border border-white/10 p-3 text-sm backdrop-blur-md"
            >
              <p className="text-gray-400">Net Estimated Cost</p>
              <p className="text-emerald-400 font-semibold mt-1">
                ₹{netCostINR.toLocaleString()}
              </p>
            </motion.div>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-500 text-center mt-4">
          Detailed cost breakdown will be provided by the model.
        </p>
      )}
    </motion.div>
  );
}
