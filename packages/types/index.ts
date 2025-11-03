/**
 * 🌧️ Common Type Definitions for RainCheck
 * Used by both Frontend and Backend
 */

import type { ReactNode } from "react";
// -------- User Input Types --------
export interface SimulationInput {
  city: string;
  latitude: number;
  longitude: number;
  roofArea: number; // in m²
  roofType: "Concrete" | "Metal" | "Tile" | "Other";
  slopePercent?: number;
  members: number;
  intendedUse: "Non-potable" | "Full";
  tankOption: "Auto" | "5kL" | "10kL" | "20kL" | "50kL";
  averageBill?: number;
  rainfall?: number;
  soilType?: "Clay" | "Sandy" | "Loam";
}

// -------- Backend Result Types --------
export interface SimulationResult {
  message: ReactNode;
  feasibilityScore: number;
  optimalTankSize: string;
  coveragePercent: number;
  paybackYears: number;
  annualSavings: number;
  rechargeVolume: number;
  co2Savings: number;

  // chart data
  monthlyRainfall: number[];
  monthlyDemand: number[];
  fiveYearSavings: number[];

  aiSummary: string; // Gemini-generated text
}

// -------- Saved Simulation --------
export interface SavedSimulation {
  id: string;
  timestamp: string;
  input: SimulationInput;
  result: SimulationResult;
}

// -------- API Response Wrapper --------
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
