export interface ClimateTrend {
  baseRainfall: number;        // mm (current)
  projectedRainfall: number[]; // next 10 years (mm)
  avgDeclineRate: number;      // %/decade
  climateResilience: number;   // % resilience score (0–100)
}

export interface WaterBalance {
  annualDemand: number;        // L/year
  harvestUtilization: number;  // % demand met by harvested water
  overflowLoss: number;        // L/year
  rechargeEfficiency: number;  // %
}

export interface EconomicAnalysis {
  installationCost: number;    // INR
  paybackPeriod: number;       // years
  roi: number;                 // %
  netSavings10yr: number;      // INR
  subsidyEligible: boolean;
}

export interface EnvironmentalImpact {
  groundwaterRecharge: number; // L/year
  co2SavedTons: number;        // tons/year
  tankerTripsAvoided: number;  // trips/year
  urbanFloodReduction: number; // %
}

export interface FeasibilityData {
  score: number;               // AI-driven weighted score (0–100)
  category: "Feasible" | "Marginal" | "Not Feasible";
  roofArea: number;            // m²
  annualRainfall: number;      // mm
  annualHarvest: number;       // L/year
  tankSize: number;            // L
  savings: number;             // INR/year
  waterBalance: WaterBalance;
  economicAnalysis: EconomicAnalysis;
  environmentalImpact: EnvironmentalImpact;
  climateTrend: ClimateTrend;
  recommendations: string[];
}


export const mockFeasibilityData: FeasibilityData = {
  roofArea: 120,
  annualRainfall: 950,
  annualHarvest: 120 * 950 * 0.8, // = 91,200 L/year
  tankSize: 8000,
  savings: 1824,

  waterBalance: {
    annualDemand: 150000,
    harvestUtilization: 60.8,
    overflowLoss: 18000,
    rechargeEfficiency: 60,
  },

  economicAnalysis: {
    installationCost: 42000,
    paybackPeriod: 23,
    roi: 4.3,
    netSavings10yr: 18240 - 42000, // = -23760 (break-even not reached)
    subsidyEligible: true,
  },

  environmentalImpact: {
    groundwaterRecharge: 54720,
    co2SavedTons: 9.12,
    tankerTripsAvoided: 91,
    urbanFloodReduction: 2.5,
  },

  climateTrend: {
    baseRainfall: 950,
    projectedRainfall: [960, 945, 930, 910, 900, 890, 875, 870, 860, 850],
    avgDeclineRate: 10.5, // % decline per decade
    climateResilience: 78, // still viable with minor losses
  },

  score: 0, // will be computed
  category: "Feasible",
  recommendations: [],
};
