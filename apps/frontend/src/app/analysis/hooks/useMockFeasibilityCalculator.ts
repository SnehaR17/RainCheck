"use client";

export default function useMockFeasibilityCalculator(
  roofArea = 80,
  rainfall = 970,
  coeff = 0.8,
  costPerLiter = 0.02
) {
  const harvestedWater = roofArea * rainfall * coeff;
  const tankSize = harvestedWater / 12;
  const score = Math.min(100, Math.round((harvestedWater / 100000) * 100));
  const savingsInr = harvestedWater * costPerLiter;

  return {
    feasibility: {
      score,
      annualLiters: harvestedWater,
      tankSize,
      savingsInr: savingsInr.toFixed(2),
      fiveYearProjection: Array.from({ length: 5 }, (_, i) => ({
        year: i + 1,
        water: Math.round(harvestedWater + i * 500),
      })),
    },
  };
}
