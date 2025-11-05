"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, FileText, ExternalLink } from "lucide-react";

export default function SubsidyDetailsAccordion({
  details = [],
}: {
  details?: any[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const hasData = details && details.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(245,158,11,0.15)] transition-all duration-500"
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg sm:text-xl font-medium bg-gradient-to-r from-amber-400 to-emerald-400 bg-clip-text text-transparent">
          Available Subsidy Schemes
        </h4>
      </div>

      {!hasData ? (
        <p className="text-gray-400 text-sm">
          (No data available — this section will auto-populate from verified
          government sources.)
        </p>
      ) : (
        <div className="space-y-4">
          {details.map((scheme, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`rounded-xl overflow-hidden border transition-all duration-300 ${
                openIndex === idx
                  ? "border-amber-400/40 bg-gradient-to-br from-[#0B0E0C]/80 to-[#141917]/60"
                  : "border-white/10 bg-gradient-to-br from-[#0B0E0C]/50 to-transparent hover:border-amber-400/30"
              }`}
            >
              {/* Header */}
              <motion.button
                onClick={() => toggleAccordion(idx)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-between px-5 py-4"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-amber-300" />
                  <div className="text-left">
                    <p className="text-gray-100 font-medium">{scheme.scheme}</p>
                    <p className="text-xs text-gray-400">
                      {scheme.eligible ? (
                        <span className="text-emerald-300">Eligible</span>
                      ) : (
                        <span className="text-red-300">Not eligible</span>
                      )}
                    </p>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: openIndex === idx ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {openIndex === idx ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </motion.div>
              </motion.button>

              {/* Content */}
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35 }}
                    className="px-5 pb-5 pt-2 border-t border-white/10"
                  >
                    <div className="text-sm text-gray-300 space-y-2">
                      <p>
                        <span className="text-gray-400">Description:</span>{" "}
                        {scheme.description ||
                          "Provides partial rebate for residential RWH installation."}
                      </p>

                      <p>
                        <span className="text-gray-400">Documents Required:</span>{" "}
                        {scheme.docsRequired?.length
                          ? scheme.docsRequired.join(", ")
                          : "Standard ID & invoice copies"}
                      </p>

                      {scheme.applyUrl && (
                        <a
                          href={scheme.applyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-amber-300 hover:text-emerald-300 transition-all text-sm mt-1"
                        >
                          Apply Online <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
