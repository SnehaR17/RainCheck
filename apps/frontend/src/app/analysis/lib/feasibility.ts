export function generateFeasibilityReport(input: {
  roofArea_m2: number;
  annualRainfall_mm: number;
  tankSize_L: number;
  householdSize: number;
  installationCost_INR: number;
}) {
  const { roofArea_m2, annualRainfall_mm, tankSize_L, householdSize, installationCost_INR } = input;

  // Hydrological Calculations
  const collectionEfficiency = 0.8;
  const annualHarvest = roofArea_m2 * annualRainfall_mm * collectionEfficiency;
  const annualDemand = householdSize * 500 * 365;
  const harvestUtilization = (annualHarvest / annualDemand) * 100;
  const rechargeEfficiency = 60;

  // Economic Analysis
  const annualSavings = (annualHarvest / 1000) * 20; // ₹20 per 1000L
  const payback = installationCost_INR / annualSavings;
  const roi = ((annualSavings * 10) / installationCost_INR) * 100;
  const netSavings10yr = annualSavings * 10 - installationCost_INR;

  // Environmental Impact
  const groundwaterRecharge = annualHarvest * (rechargeEfficiency / 100);
  const co2SavedTons = (annualHarvest / 1000) * 0.1;
  const tankerTrips = Math.round(annualHarvest / 1000);

  // Climate Projection
  const projectedRainfall = Array.from({ length: 10 }, (_, i) => annualRainfall_mm - i * 10);
  const avgDeclineRate = 10.5;
  const climateResilience = 100 - avgDeclineRate * 0.5;

  // AI Scoring Model
  const score =
    Math.min(harvestUtilization / 5, 20) +
    Math.max(0, 20 - payback / 2) +
    (rechargeEfficiency / 5) +
    Math.min(roi / 5, 20) +
    (climateResilience / 5);

  const finalScore = Math.round(Math.min(score, 100));
  const category =
    finalScore >= 75 ? "Feasible" : finalScore >= 50 ? "Marginal" : "Not Feasible";

  return {
    score: finalScore,
    category,
    roofArea: roofArea_m2,
    annualRainfall: annualRainfall_mm,
    annualHarvest,
    tankSize: tankSize_L,
    savings: annualSavings,
    waterBalance: {
      annualDemand,
      harvestUtilization,
      overflowLoss: Math.max(annualHarvest - tankSize_L, 0),
      rechargeEfficiency,
    },
    economicAnalysis: {
      installationCost: installationCost_INR,
      paybackPeriod: payback,
      roi,
      netSavings10yr,
      subsidyEligible: installationCost_INR > 30000,
    },
    environmentalImpact: {
      groundwaterRecharge,
      co2SavedTons,
      tankerTripsAvoided: tankerTrips,
      urbanFloodReduction: 2.5,
    },
    climateTrend: {
      baseRainfall: annualRainfall_mm,
      projectedRainfall,
      avgDeclineRate,
      climateResilience,
    },
    recommendations: [],
  };
}
