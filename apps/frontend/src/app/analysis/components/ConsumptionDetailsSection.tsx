"use client";

import { motion } from "framer-motion";
import { useFeasibility } from "../context/FeasibilityContext";
import { useState, useEffect } from "react";

export default function ConsumptionDetailsSection() {
  const { input, setInput, generateReport, loading, report } = useFeasibility();
  const [autoFillFlash, setAutoFillFlash] = useState(false);
  const [scrollPending, setScrollPending] = useState(false);

  useEffect(() => {
    setAutoFillFlash(true);
    const timer = setTimeout(() => setAutoFillFlash(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // 🧭 When report becomes available, scroll to "insights"
  useEffect(() => {
    if (report && scrollPending) {
      const el = document.getElementById("insights");
      if (el) {
        const offset = -100; // adjust for header height
        const y = el.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top: y, behavior: "smooth" });
        setScrollPending(false);
      }
    }
  }, [report, scrollPending]);

  const totalUsage = input.householdSize * input.avgDailyUse_L;
  const monthlyUsage = totalUsage * 30;

  /** --- Generate and schedule scroll --- */
  const handleGenerate = async () => {
    setScrollPending(true);
    await generateReport(); // this triggers ConditionalInsights to render
  };

  return (
    <motion.section
      id="consumption"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* --- Header --- */}
      <div className="space-y-1 text-center sm:text-left">
        <h2 className="text-3xl font-semibold text-amber-400">
          2. Water Consumption & Cost Details
        </h2>
        <p className="text-gray-400 text-sm">
          Provide local and household details. RainCheck uses this data to
          simulate realistic hydrological, financial, and climate projections.
        </p>
      </div>

      {/* --- Input Grid --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <InputField
          label="Number of Dwellers"
          type="number"
          value={input.householdSize}
          onChange={(v: string) =>
            setInput((p: any) => ({ ...p, householdSize: Number(v) }))
          }
          autoFlash={autoFillFlash}
        />

        <InputField
          label="Average Daily Water Use (L/person)"
          type="number"
          value={input.avgDailyUse_L}
          onChange={(v: string) =>
            setInput((p: any) => ({ ...p, avgDailyUse_L: Number(v) }))
          }
          autoFlash={autoFillFlash}
        />

        <InputField
          label="Tank Capacity (L)"
          type="number"
          value={input.tankSize_L}
          onChange={(v: string) =>
            setInput((p: any) => ({ ...p, tankSize_L: Number(v) }))
          }
          autoFlash={autoFillFlash}
        />

        <InputField
          label="Roof Area (m²)"
          type="number"
          value={input.roofArea_m2}
          onChange={(v: string) =>
            setInput((p: any) => ({ ...p, roofArea_m2: Number(v) }))
          }
          autoFlash={autoFillFlash}
        />

        {/* Roof Type */}
        <div>
          <label className="block text-xs uppercase text-gray-400">Roof Type</label>
          <select
            value={input.roofType}
            onChange={(e) =>
              setInput((p: any) => ({ ...p, roofType: e.target.value }))
            }
            className="mt-2 w-full bg-transparent border-b-2 px-1 py-2 text-lg text-gray-100 border-amber-400/20 focus:border-amber-400"
          >
            {["Concrete", "Metal Sheet", "Tile", "Asbestos", "Other"].map((t) => (
              <option key={t} className="bg-[#0B0B0C]" value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <InputField
          label="City / Location"
          type="text"
          value={input.city || ""}
          onChange={(v: string) => setInput((p: any) => ({ ...p, city: v }))}
          autoFlash={autoFillFlash}
        />

        <InputField
          label="Annual Rainfall (mm)"
          type="number"
          value={input.annualRainfall_mm}
          onChange={(v: string) =>
            setInput((p: any) => ({
              ...p,
              annualRainfall_mm: Number(v),
            }))
          }
          autoFlash={autoFillFlash}
        />

        <InputField
          label="Water Cost (₹/L)"
          type="number"
          step="0.001"
          value={input.waterCost_INR_L}
          onChange={(v: string) =>
            setInput((p: any) => ({
              ...p,
              waterCost_INR_L: Number(v),
            }))
          }
          autoFlash={autoFillFlash}
        />

        <InputField
          label="Installation Cost (₹)"
          type="number"
          value={input.installationCost_INR}
          onChange={(v: string) =>
            setInput((p: any) => ({
              ...p,
              installationCost_INR: Number(v),
            }))
          }
          autoFlash={autoFillFlash}
        />
      </div>

      {/* --- Summary + Action --- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="pt-4 border-t border-amber-400/10 text-center"
      >
        <p className="text-gray-300 text-base">
          Estimated total use:{" "}
          <span className="text-amber-300 font-semibold">
            {totalUsage.toLocaleString()} L/day
          </span>{" "}
          (~{monthlyUsage.toLocaleString()} L/month)
        </p>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="mt-4 px-6 py-2 rounded-md border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition"
        >
          {loading ? "Analyzing..." : "Generate Feasibility Report"}
        </button>
      </motion.div>
    </motion.section>
  );
}

/* --- Generic Field Component --- */
function InputField({ label, type, value, onChange, step, autoFlash }: any) {
  return (
    <div>
      <label className="block text-xs uppercase text-gray-400">{label}</label>
      <input
        type={type}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-2 w-full bg-transparent border-b-2 px-1 py-2 text-lg text-gray-100 focus:outline-none ${
          autoFlash
            ? "border-cyan-400"
            : "border-amber-400/20 focus:border-amber-400"
        }`}
      />
    </div>
  );
}
