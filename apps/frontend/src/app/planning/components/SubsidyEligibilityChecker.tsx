"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BadgeCheck,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileCheck,
  FileText,
  ClipboardCheck,
} from "lucide-react";

/**
 * SubsidyEligibilityChecker
 * Unified component showing eligibility summary, detailed accordion,
 * apply links, and required document checklist.
 */

export default function SubsidyEligibilityChecker({
  analysis,
  plan,
}: {
  analysis?: any;
  plan?: any;
}) {
  const subsidies = plan?.subsidies || [];
  const eligible = subsidies.some((s: any) => s.eligible);
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative p-6 rounded-2xl bg-[#0F1412]/60 backdrop-blur-md border border-white/10 shadow-[0_0_20px_rgba(245,158,11,0.05)] hover:shadow-[0_0_25px_rgba(245,158,11,0.15)] transition-all duration-500 font-[Geist] text-gray-100"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg sm:text-xl font-medium bg-gradient-to-r from-amber-400 to-emerald-400 bg-clip-text text-transparent">
          Subsidies & Incentives
        </h3>

        <motion.span
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border ${
            eligible
              ? "text-emerald-300 border-emerald-400/40 bg-emerald-400/10"
              : "text-red-300 border-red-400/30 bg-red-400/10"
          }`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          {eligible ? (
            <>
              <BadgeCheck className="h-3.5 w-3.5" /> Likely Eligible
            </>
          ) : (
            <>
              <AlertCircle className="h-3.5 w-3.5" /> Not Eligible
            </>
          )}
        </motion.span>
      </div>

      {/* Summary */}
      {analysis ? (
        <p className="text-gray-300 text-sm leading-relaxed">
          Based on your feasibility and economic profile, your project is{" "}
          <span
            className={`font-semibold ${
              eligible ? "text-emerald-300" : "text-red-300"
            }`}
          >
            {eligible ? "likely eligible" : "not eligible"}
          </span>{" "}
          for one or more government rebate schemes.
        </p>
      ) : (
        <p className="text-gray-400 text-sm">
          Feasibility report required to determine subsidy eligibility.
        </p>
      )}

      {/* Expand/Collapse Button */}
      {subsidies.length > 0 && (
        <div className="mt-5">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setExpanded((p) => !p)}
            className="flex items-center gap-2 text-sm text-amber-300 hover:text-emerald-300 transition-all"
          >
            {expanded ? (
              <>
                <ChevronUp className="h-4 w-4" /> Hide Details
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" /> View Details
              </>
            )}
          </motion.button>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35 }}
                className="mt-4 space-y-4"
              >
                {subsidies.map((s: any, idx: number) => (
                  <SubsidyDetailsAccordion key={idx} subsidy={s} index={idx} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* 🧱 Sub-Component 1: SubsidyDetailsAccordion                                */
/* -------------------------------------------------------------------------- */

function SubsidyDetailsAccordion({
  subsidy,
  index,
}: {
  subsidy: any;
  index: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-xl bg-[#0B0E0C]/60 backdrop-blur-md border border-white/10 hover:border-amber-400/40 transition-all duration-300"
    >
      {/* Header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <FileCheck className="h-5 w-5 text-amber-400" />
          <p className="font-medium text-gray-100">{subsidy.scheme}</p>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${
            open ? "rotate-180 text-amber-300" : ""
          }`}
        />
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="px-5 pb-4 text-sm text-gray-300 space-y-2 border-t border-white/10"
          >
            <p>
              <span className="text-gray-500">Description:</span>{" "}
              {subsidy.description || "No description available."}
            </p>

            {/* Eligibility */}
            <p>
              <span className="text-gray-500">Eligibility:</span>{" "}
              {subsidy.eligible
                ? "You qualify based on current data."
                : "You do not meet the eligibility criteria."}
            </p>

            {/* Document Checklist */}
            <DocumentChecklist docs={subsidy.docsRequired} />

            {/* Apply Links */}
            {subsidy.applyUrl && (
              <ApplyNowLinks url={subsidy.applyUrl} name={subsidy.scheme} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* 🗂️ Sub-Component 2: DocumentChecklist                                     */
/* -------------------------------------------------------------------------- */

function DocumentChecklist({ docs }: { docs: string[] }) {
  if (!docs || docs.length === 0) {
    return (
      <div className="flex items-center gap-2 text-gray-500 text-sm">
        <FileText className="h-4 w-4" />
        No documentation required
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <ClipboardCheck className="h-4 w-4 text-emerald-400" />
        <span className="text-gray-400 text-sm">Required Documents:</span>
      </div>
      <ul className="list-disc list-inside text-gray-300 text-sm pl-4 space-y-0.5">
        {docs.map((doc, i) => (
          <li key={i}>{doc}</li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 🌐 Sub-Component 3: ApplyNowLinks                                          */
/* -------------------------------------------------------------------------- */

function ApplyNowLinks({ url, name }: { url: string; name: string }) {
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="inline-flex items-center gap-1 text-amber-300 hover:text-emerald-300 transition-all text-sm mt-1"
    >
      Apply Now for {name} <ExternalLink className="h-3.5 w-3.5" />
    </motion.a>
  );
}
