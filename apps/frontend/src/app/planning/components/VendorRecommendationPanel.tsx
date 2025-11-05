"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Wrench, X, ArrowLeftRight } from "lucide-react";

/**
 * VendorRecommendationPanel
 * Displays vendor cards with interactive contact modal & comparison table.
 */
export default function VendorRecommendationPanel({
  analysis,
  plan,
}: {
  analysis?: any;
  plan?: any;
}) {
  const vendors = plan?.vendors || [];
  const [selectedVendor, setSelectedVendor] = useState<any | null>(null);
  const [compareMode, setCompareMode] = useState(false);

  if (!vendors || vendors.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-6 rounded-2xl bg-[#0F1412]/60 backdrop-blur-md border border-white/10 text-gray-400 text-center"
      >
        <p>No vendor recommendations available yet. Please generate a plan first.</p>
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
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg sm:text-xl font-medium bg-gradient-to-r from-emerald-400 to-amber-300 bg-clip-text text-transparent">
          Vendors & Suppliers
        </h3>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCompareMode((prev) => !prev)}
          className="flex items-center gap-1 text-sm text-amber-300 hover:text-emerald-300 transition-all"
        >
          <ArrowLeftRight className="h-4 w-4" />
          {compareMode ? "Hide Comparison" : "Compare Vendors"}
        </motion.button>
      </div>

      <p className="text-gray-400 text-sm mb-5">
        Verified local vendors specializing in rainwater harvesting setup, filtration, and maintenance.
      </p>

      {/* Vendor Comparison Mode */}
      <AnimatePresence>
        {compareMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-5"
          >
            <CompareVendors vendors={vendors} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vendor Cards */}
      <div className="grid sm:grid-cols-2 gap-5">
        {vendors.map((vendor: any, idx: number) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedVendor(vendor)}
            className="relative cursor-pointer p-5 rounded-2xl border border-white/10 
                       bg-[#0B0E0C]/60 backdrop-blur-md
                       hover:border-emerald-400/40 hover:shadow-[0_0_25px_rgba(16,185,129,0.25)] 
                       transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-lg font-medium text-emerald-300">{vendor.name}</p>
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="text-[11px] font-semibold uppercase text-gray-300 border border-white/10 rounded-md px-2 py-0.5 bg-[#0F1412]/60 backdrop-blur-sm"
              >
                {vendor.specialty || "General"}
              </motion.span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
              <MapPin className="h-4 w-4 text-amber-300" />
              <span>
                {vendor.distanceKm ? `${vendor.distanceKm} km away` : "Location not specified"}
              </span>
            </div>

            {vendor.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                <Phone className="h-4 w-4 text-amber-300" />
                <span>{vendor.phone}</span>
              </div>
            )}

            {vendor.website && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Wrench className="h-4 w-4 text-amber-300" />
                <span className="hover:text-emerald-300 transition-all">
                  {vendor.website.replace(/^https?:\/\//, "")}
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Vendor Contact Modal */}
      <VendorContactModal
        vendor={selectedVendor}
        onClose={() => setSelectedVendor(null)}
      />
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* 📞 Subcomponent: VendorContactModal                                        */
/* -------------------------------------------------------------------------- */

function VendorContactModal({
  vendor,
  onClose,
}: {
  vendor: any | null;
  onClose: () => void;
}) {
  if (!vendor) return null;

  return (
    <AnimatePresence>
      {vendor && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative bg-[#0F1412]/90 border border-white/10 p-6 rounded-2xl w-[90%] sm:w-[400px] text-gray-100 font-[Geist]"
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-amber-300 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <h4 className="text-lg font-semibold text-emerald-300 mb-2">
              {vendor.name}
            </h4>
            <p className="text-sm text-gray-400 mb-4">{vendor.specialty}</p>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-amber-300" />
                <span>{vendor.location || "Location not specified"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-amber-300" />
                <a
                  href={`tel:${vendor.phone}`}
                  className="text-emerald-300 hover:underline"
                >
                  {vendor.phone}
                </a>
              </div>
              {vendor.website && (
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-amber-300" />
                  <a
                    href={vendor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-300 hover:text-emerald-300 transition-all"
                  >
                    Visit Website
                  </a>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm rounded-xl border border-emerald-400 text-emerald-300 hover:bg-emerald-400 hover:text-black transition-all"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* -------------------------------------------------------------------------- */
/* ⚖️ Subcomponent: CompareVendors                                            */
/* -------------------------------------------------------------------------- */

function CompareVendors({ vendors }: { vendors: any[] }) {
  if (vendors.length < 2) {
    return (
      <div className="text-center text-gray-400 text-sm border border-white/10 rounded-xl p-3 bg-[#0B0E0C]/40">
        Need at least 2 vendors to compare.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-x-auto rounded-xl border border-white/10 bg-[#0B0E0C]/60 backdrop-blur-md"
    >
      <table className="min-w-full text-sm text-gray-300 border-collapse">
        <thead className="bg-[#141917]/70 text-emerald-300">
          <tr>
            <th className="py-2 px-3 text-left border-b border-white/10">Vendor</th>
            <th className="py-2 px-3 text-left border-b border-white/10">Specialty</th>
            <th className="py-2 px-3 text-left border-b border-white/10">Distance</th>
            <th className="py-2 px-3 text-left border-b border-white/10">Contact</th>
          </tr>
        </thead>
        <tbody>
          {vendors.map((v, i) => (
            <tr
              key={i}
              className="hover:bg-[#1A221F]/60 transition-colors border-b border-white/5"
            >
              <td className="py-2 px-3">{v.name}</td>
              <td className="py-2 px-3">{v.specialty || "General"}</td>
              <td className="py-2 px-3">
                {v.distanceKm ? `${v.distanceKm} km` : "N/A"}
              </td>
              <td className="py-2 px-3">
                {v.phone ? (
                  <a
                    href={`tel:${v.phone}`}
                    className="text-amber-300 hover:text-emerald-300"
                  >
                    {v.phone}
                  </a>
                ) : (
                  "N/A"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}
