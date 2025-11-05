import { mockFeasibilityData } from "./mockFeasibilityData";

export interface ProjectionPoint {
  year: number;
  water: number;     // annual harvested water in liters
  recharge: number;  // groundwater recharge in liters
  co2Saved: number;  // CO₂ saved in tons
  savings: number;   // cost savings in INR
}

/**
 * Projection assumptions:
 * - Annual rainfall may fluctuate ±3%
 * - Roof maintenance affects collection efficiency: drops 1% per year
 * - Savings grow 4% per year due to rising tanker/water cost
 * - CO₂ savings proportional to harvested water
 */
export const mockProjectionData: ProjectionPoint[] = Array.from({ length: 5 }, (_, i) => {
  const { annualHarvest, environmentalImpact, savings } = mockFeasibilityData;
  const year = i + 1;

  const rainfallFactor = 1 + (Math.sin(i) * 0.03); // fluctuates slightly
  const efficiencyDecay = 1 - i * 0.01; // 1% drop per year
  const projectedHarvest = Math.round(annualHarvest * rainfallFactor * efficiencyDecay);

  const projectedRecharge = Math.round(projectedHarvest * 0.6); // 60% recharge
  const projectedCo2 = Number(((projectedHarvest / 1000) * 0.1).toFixed(2)); // 0.1 ton/kL
  const projectedSavings = Math.round(savings * (1 + 0.04 * i)); // +4% per year

  return {
    year,
    water: projectedHarvest,
    recharge: projectedRecharge,
    co2Saved: projectedCo2,
    savings: projectedSavings,
  };
});
