"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Components
import UserPreferenceForm from "./UserPreferenceForm";
import TankRecommendationCard from "./TankRecommendationCard";
import SubsidyEligibilityChecker from "./SubsidyEligibilityChecker";
import VendorRecommendationPanel from "./VendorRecommendationPanel";
import TimelineAndTasksBoard from "./TimelineAndTasksBoard";
import DownloadPlanPDF from "./DownloadPlanPDF";
import BudgetEstimator from "./BudgetEstimator";

// Services
import PlanningPromptBuilder from "../services/PlanningPromptBuilder";
import ModelPlanParser from "../services/ModelPlanParser";

/**
 * PlanningLayout
 * Orchestrates the flow between user preferences, analysis, and AI-generated planning output.
 * Includes hydration-safe patch and modern glass UI layout.
 */

// 🧼 Hydration-safe cleanup patch
if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", () => {
    // Remove unwanted injected attributes (by Grammarly, MS Editor, etc.)
    document
      .querySelectorAll("[fdprocessedid],[data-gramm],[data-ms-editor]")
      .forEach((el) => {
        el.removeAttribute("fdprocessedid");
        el.removeAttribute("data-gramm");
        el.removeAttribute("data-ms-editor");
      });
  });
}

export default function PlanningLayout() {
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [preferences, setPreferences] = useState<any>({});
  const [plan, setPlan] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Load sample analysis
  useEffect(() => {
    const mock =
      (window as any).__RAINCHECK_MOCK_ANALYSIS__ || {
        roofArea: 120,
        annualRainfall: 950,
        annualHarvest: 91200,
        tankSize: 8000,
        feasibility: "High",
        economicAnalysis: {
          installationCost: 42000,
          paybackPeriod: 23,
          roi: 4.3,
          netSavings10yr: -23760,
          subsidyEligible: true,
        },
        environmentalImpact: {
          groundwaterRecharge: 54720,
          co2SavedTons: 9.12,
        },
        climateTrend: {
          climateResilience: "Good",
        },
      };
    setAnalysis(mock);
  }, []);

  // 🔹 Generate complete plan
  async function handleGeneratePlan(pref: any) {
    if (!analysis) {
      setError("Analysis data missing. Please run analysis first.");
      return;
    }

    setPreferences(pref);
    setLoading(true);
    setError(null);
    setPlan(null);

    try {
      console.log("⚙️ Building prompt with:", { analysis, preferences: pref });
      const prompt = PlanningPromptBuilder.build({ analysis, preferences: pref });

      const raw = await PlanningPromptBuilder.mockCallModel(prompt);
      console.log("📥 Raw model output:", raw);

      const parsed = ModelPlanParser.parse(raw);
      console.log("✅ Parsed plan:", parsed);

      const safePlan = {
        cost: parsed?.cost || {},
        subsidies: parsed?.subsidies || [],
        vendors: parsed?.vendors || [],
        timeline: parsed?.timeline || [],
        tank: parsed?.tank || {},
      };

      setPlan(safePlan);
    } catch (err: any) {
      console.error("❌ Plan generation failed:", err);
      setError("Failed to generate plan. Please try again.");
    } finally {
      setTimeout(() => setLoading(false), 400);
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
          {/* 🌀 Loading State */}
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

          {/* 🚨 Error State */}
          {!loading && error && (
            <div className="text-center text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              {error}
            </div>
          )}

          {/* 💡 Before Generation */}
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

          {/* 🌧️ Plan Sections */}
          <AnimatePresence>
            {plan && !loading && (
              <>
                {/* Tank Recommendation */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl p-6 backdrop-blur-md bg-[#0F1412]/60 border border-[#1f2a26] hover:border-emerald-500/30 transition-all"
                >
                  <TankRecommendationCard analysis={analysis} plan={plan} />
                </motion.div>

                {/* Budget Estimator */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="rounded-2xl p-6 backdrop-blur-md bg-[#0F1412]/60 border border-[#1f2a26] hover:border-amber-400/30 transition-all"
                >
                  <BudgetEstimator analysis={analysis} plan={plan} />
                </motion.div>

                {/* Subsidy Checker */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-2xl p-6 backdrop-blur-md bg-[#0F1412]/60 border border-[#1f2a26] hover:border-amber-500/30 transition-all"
                >
                  <SubsidyEligibilityChecker analysis={analysis} plan={plan} />
                </motion.div>

                {/* Vendor Recommendations */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="rounded-2xl p-6 backdrop-blur-md bg-[#0F1412]/60 border border-[#1f2a26] hover:border-emerald-400/30 transition-all"
                >
                  <VendorRecommendationPanel analysis={analysis} plan={plan} />
                </motion.div>

                {/* Timeline */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="rounded-2xl p-6 backdrop-blur-md bg-[#0F1412]/60 border border-[#1f2a26] hover:border-sky-400/30 transition-all"
                >
                  <TimelineAndTasksBoard plan={plan} />
                </motion.div>

                {/* CTA Footer */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap gap-3 justify-end"
                >
                  <DownloadPlanPDF
                    plan={plan}
                    preferences={preferences}
                    analysis={analysis}
                  />
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
