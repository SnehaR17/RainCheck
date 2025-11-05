"use client";

import { createContext, useContext, useState, useMemo } from "react";
import { generateFeasibilityReport } from "../lib/feasibility";
import { generateRecommendationsWithGemini } from "../lib/recommendations";

interface FeasibilityInput {
  roofArea_m2: number;
  annualRainfall_mm: number;
  tankSize_L: number;
  householdSize: number;
  installationCost_INR: number;
  waterCost_INR_L: number;
}

const defaultInput = {
  roofArea_m2: 120,
  annualRainfall_mm: 950,
  tankSize_L: 8000,
  householdSize: 4,
  avgDailyUse_L: 500,
  roofType: "Concrete",
  installationCost_INR: 42000,
  waterCost_INR_L: 0.02,
  city: "Bengaluru",
};


const FeasibilityContext = createContext<any>(null);

export function FeasibilityProvider({ children }: { children: React.ReactNode }) {
  const [input, setInput] = useState(defaultInput);
  const [report, setReport] = useState<any | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    try {
      setLoading(true);
      const baseReport = generateFeasibilityReport(input);
      const recs = await generateRecommendationsWithGemini(baseReport);
      setReport(baseReport);
      setRecommendations(recs);
    } catch (err) {
      console.error("Error generating report:", err);
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      input,
      setInput,
      report,
      recommendations,
      loading,
      generateReport,
    }),
    [input, report, recommendations, loading]
  );

  return (
    <FeasibilityContext.Provider value={value}>
      {children}
    </FeasibilityContext.Provider>
  );
}

export function useFeasibility() {
  return useContext(FeasibilityContext);
}
