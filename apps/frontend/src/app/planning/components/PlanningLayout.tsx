"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import UserPreferenceForm from "./UserPreferenceForm";
import TankRecommendationCard from "./TankRecommendationCard";
import SubsidyEligibilityChecker from "./SubsidyEligibilityChecker";
import VendorRecommendationPanel from "./VendorRecommendationPanel";
import TimelineAndTasksBoard from "./TimelineAndTasksBoard";
import DownloadPlanPDF from "./DownloadPlanPDF";
import PlanningPromptBuilder from "../services/PlanningPromptBuilder";
import ModelPlanParser from "../services/ModelPlanParser";

/**
 * PlanningLayout - orchestrates data flow & renders sections elegantly
 * Modern minimalist redesign with smooth transitions and compact layout.
 */

export default function PlanningLayout() {
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [preferences, setPreferences] = useState<any>({});
  const [plan, setPlan] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Load mock analysis for standalone testing
  useEffect(() => {
    const mock =
      (window as any).__RAINCHECK_MOCK_ANALYSIS__ || {
        roofArea: 120,
        annualRainfall: 900,
        annualHarvest: 85000,
        tankSize: 8000,
        feasibility: "High",
        economicAnalysis: { netSavings10yr: "₹42,000" },
        environmentalImpact: { groundwaterRecharge: "Moderate" },
        climateTrend: { climateResilience: "Good" },
      };

    setAnalysis(mock);
  }, []);

  // 🔹 Generate full plan from preferences + analysis
  async function handleGeneratePlan(pref: any) {
    if (!analysis) {
      setError("Analysis data missing. Please run analysis first.");
      return;
    }

    setPreferences(pref);
    setLoading(true);
    setError(null);

    try {
      const prompt = PlanningPromptBuilder.build({ analysis, preferences: pref });
      const raw = await PlanningPromptBuilder.mockCallModel(prompt);
      const parsed = ModelPlanParser.parse(raw);
      console.log("✅ Parsed Plan:", parsed); // Debug log (remove in prod)
      setPlan(parsed);
    } catch (e: any) {
      console.error("❌ Plan generation failed:", e);
      setError("Failed to generate plan. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-[Geist] text-gray-100">
      {/* HEADER */}
      <header className="text-center mb-10 space-y-2">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl font-semibold bg-gradient-to-r from-amber-400 to-emerald-400 bg-clip-text text-transparent"
        >
          Implementation Plan
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 text-base"
        >
          Personalized roadmap to implement your Rainwater Harvesting System
        </motion.p>
      </header>

      {/* MAIN GRID */}
      <section className="grid md:grid-cols-3 gap-8">
        {/* LEFT SIDEBAR */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-1 backdrop-blur-md bg-[#0D0F10]/60 border border-[#1f2a26] p-6 rounded-2xl shadow-[0_0_25px_rgba(16,185,129,0.1)]"
        >
          <UserPreferenceForm onGenerate={handleGeneratePlan} loading={loading} />
        </motion.div>

        {/* RIGHT SECTION */}
        <div className="md:col-span-2 space-y-6">
          {/* Loading State */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center p-10 bg-[#0F1412]/60 rounded-2xl border border-[#1f2a26] shadow-inner"
            >
              <div className="h-10 w-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-amber-300 text-lg">
                Generating your personalized plan...
              </p>
            </motion.div>
          )}

          {/* Error Message */}
          {!loading && error && (
            <div className="text-center text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              {error}
            </div>
          )}

          {/* Placeholder before generation */}
          {!loading && !plan && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 rounded-2xl text-center text-gray-400 border border-white/10 bg-white/5 backdrop-blur-md"
            >
              <p>
                Adjust your preferences and click{" "}
                <span className="text-amber-300 font-medium">Generate Plan</span>{" "}
                to create your personalized rainwater harvesting roadmap.
              </p>
            </motion.div>
          )}

          {/* Plan Sections */}
          <AnimatePresence>
            {plan && !loading && (
              <>
                {/* Tank Recommendation */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl p-6 backdrop-blur-md bg-[#0F1412]/60 border border-[#1f2a26] hover:border-emerald-500/30 transition-all"
                >
                  <TankRecommendationCard analysis={analysis} plan={plan} />
                </motion.div>

                {/* Subsidies */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.1 }}
                  className="rounded-2xl p-6 backdrop-blur-md bg-[#0F1412]/60 border border-[#1f2a26] hover:border-amber-500/30 transition-all"
                >
                  <SubsidyEligibilityChecker analysis={analysis} plan={plan} />
                </motion.div>

                {/* Vendors */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-2xl p-6 backdrop-blur-md bg-[#0F1412]/60 border border-[#1f2a26] hover:border-emerald-400/30 transition-all"
                >
                  <VendorRecommendationPanel analysis={analysis} plan={plan} />
                </motion.div>

                {/* Timeline */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-2xl p-6 backdrop-blur-md bg-[#0F1412]/60 border border-[#1f2a26] hover:border-sky-400/30 transition-all"
                >
                  <TimelineAndTasksBoard plan={plan} />
                </motion.div>

                {/* CTA Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-wrap gap-3 justify-end"
                >
                  <DownloadPlanPDF plan={plan} preferences={preferences} analysis={analysis} />
                  <button className="px-4 py-2 rounded-xl border border-amber-400 text-amber-300 hover:bg-amber-400 hover:text-black transition-all">
                    Save Plan
                  </button>
                  <button className="px-4 py-2 rounded-xl border border-emerald-400 text-emerald-300 hover:bg-emerald-400 hover:text-black transition-all">
                    Share
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}
