// hooks/useFeasibilityCalculator.ts
"use client";

import { useMemo } from "react";

/**
 * Advanced Feasibility Hook for Rainwater Harvesting analysis
 *
 * Outputs:
 *  - monthlyHarvest: liters per month
 *  - monthlyDemand: liters per month
 *  - monthlyBalance: inflow - demand per month
 *  - cumulativeMassCurve: sorted monthly inflows (for sizing by yield)
 *  - storageReliability: array of { tankSize, reliabilityPercent, unmetVolume, monthsWithDeficit }
 *  - recommendedTankSizes: tank sizes (L) for target reliabilities e.g., 50/75/90%
 *  - costAnalysis: annual savings, capex estimate, paybackYears, npv (configurable discount)
 *  - multiYearProjection: deterministic projection for N years (rainfall trend variants)
 *  - scenarioComparisons: array of scenario outputs (varying runoffCoeff, firstFlush, rainfall)
 *
 * Notes:
 *  - All volumes are in L (liters). Tank sizes in L.
 *  - Time step is monthly (suitable for feasibility). For more accurate short-storm sizing use daily timestep.
 */

/* ---------- Types ---------- */
type Monthly = { month: string; mm: number; liters: number };
type StorageReliabilityPoint = {
  tankSize: number; // L
  reliability: number; // 0-100 %
  unmetAnnualLiters: number; // L per year unmet
  monthsWithDeficit: number; // number of months with deficit over simulation year(s)
};
type CostAnalysis = {
  annualSavingsINR: number;
  tankCapexINR: number;
  installationINR: number;
  totalCapexINR: number;
  paybackYears: number | null; // null if no payback within horizon
  npv: number; // NPV over horizon
};

type FeasibilityResult = {
  monthlyHarvest: Monthly[]; // length 12
  monthlyDemand: { month: string; liters: number }[]; // length 12
  annualHarvestLiters: number;
  annualDemandLiters: number;
  supplyCoveragePct: number;
  cumulativeMassCurve: { rank: number; liters: number }[]; // sorted descending
  storageReliabilityCurve: StorageReliabilityPoint[]; // for range of tanks
  recommendedTankSizes: { targetReliability: number; tankSizeL: number }[]; // e.g., [50,75,90]
  costAnalysis: CostAnalysis;
  multiYearProjection: { year: number; annualHarvest: number }[];
  scenarioComparisons: { name: string; supplyCoveragePct: number; annualHarvest: number }[];
  flags: { highSeasonConcentrationPct: number; monthsAboveMedian: number };
};

/* ---------- Helper utilities ---------- */
const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function sum(arr: number[]) { return arr.reduce((a,b)=>a+b,0); }
function clamp(v:number, a=0, b=1){ return Math.max(a, Math.min(b, v)); }

/* Simulate monthly storage dynamics for one year (single year repeated if needed)
   - inflows: array length 12 (L)
   - demand: array length 12 (L)
   - tankSize L
   returns { reliabilityPercent (annual), unmetAnnualLiters, monthsWithDeficit }
*/
function simulateAnnualStorage(inflows: number[], demand: number[], tankSize: number) {
  let storage = tankSize; // assume tank initially full for conservative reliability? Use 0 or full — choose full to measure drawdown reliability if desired
  // We'll simulate starting with full tank gives optimistic reliability; start at 0 gives conservative.
  // For this function we will start at 0 to represent a new tank baseline.
  storage = 0;
  let unmet = 0;
  let monthsDeficit = 0;
  const months = inflows.length;
  for (let i=0;i<months;i++){
    // add inflow
    storage += inflows[i];
    // apply demand
    if (storage >= demand[i]) {
      storage -= demand[i];
    } else {
      // unmet demand
      unmet += (demand[i] - storage);
      storage = 0;
      monthsDeficit++;
    }
    // tank overflow beyond capacity (cannot store more)
    if (storage > tankSize) storage = tankSize;
  }
  const annualDemand = sum(demand);
  const reliability = clamp(100 * (1 - (unmet / annualDemand)), 0, 100);
  return { reliability, unmetAnnualLiters: Math.round(unmet), monthsWithDeficit: monthsDeficit };
}

/* Generate array of tank sizes between min and max (L) */
function generateTankSizes(minL:number, maxL:number, steps=30){
  const arr:number[]=[];
  for(let i=0;i<steps;i++){
    const t = minL + (i/(steps-1))*(maxL-minL);
    arr.push(Math.round(t));
  }
  return arr;
}

/* Basic NPV calculation
   - cashFlows: array of annual net savings (year 0 is -capex)
*/
function npv(cashFlows:number[], discountRate=0.08){
  return cashFlows.reduce((acc,cf,i)=> acc + cf / Math.pow(1+discountRate, i), 0);
}

/* ---------- Main Hook ---------- */
export default function useMockFeasibilityCalculator(
  opts?: {
    roofArea_m2?: number; // m²
    monthlyRainfall_mm?: number[]; // length 12 in mm (if not provided uses a default monsoon-biased profile summing to annualRain_mm)
    annualRainfall_mm?: number; // if monthly not provided, this is used
    runoffCoeff?: number; // 0-1
    firstFlush_mm?: number; // mm to discard per event approximated monthly as fraction
    householdSize?: number;
    perCapitaIndoor_L_perDay?: number;
    perCapitaOutdoor_L_perDay?: number;
    waterCost_INR_per_kL?: number; // ₹ per 1000 L
    tankCostINR_per_L?: number; // ₹ per liter of storage
    installationPct?: number; // % of tank capex as installation
    analysisYears?: number; // horizon for NPV/projection
    monthlyDemandSeasonFactor?: number[]; // multipliers per month to scale demand seasonality (length 12)
  }
): { feasibility: FeasibilityResult } {

  const cfg = {
    roofArea_m2: opts?.roofArea_m2 ?? 80,
    annualRainfall_mm: opts?.annualRainfall_mm ?? 970,
    monthlyRainfall_mm: opts?.monthlyRainfall_mm ?? undefined,
    runoffCoeff: clamp(opts?.runoffCoeff ?? 0.8, 0.4, 0.95),
    firstFlush_mm: opts?.firstFlush_mm ?? 3, // first flush loss per event (approx mm) — handled as fraction
    householdSize: opts?.householdSize ?? 4,
    perCapitaIndoor_L_perDay: opts?.perCapitaIndoor_L_perDay ?? 100, // indoor focused
    perCapitaOutdoor_L_perDay: opts?.perCapitaOutdoor_L_perDay ?? 35, // gardening etc
    waterCost_INR_per_kL: opts?.waterCost_INR_per_kL ?? 50,
    tankCostINR_per_L: opts?.tankCostINR_per_L ?? 0.5, // ₹0.5 per liter (example)
    installationPct: clamp(opts?.installationPct ?? 0.25, 0, 1),
    analysisYears: opts?.analysisYears ?? 10,
    monthlyDemandSeasonFactor: opts?.monthlyDemandSeasonFactor ?? [1,1,1,1,1,1,1,1,1,1,1,1], // default flat
  };

  const result = useMemo(() => {
    // Prepare monthly rainfall mm array
    let monthly_mm: number[] = [];
    if (cfg.monthlyRainfall_mm && cfg.monthlyRainfall_mm.length === 12) {
      monthly_mm = cfg.monthlyRainfall_mm.slice();
    } else {
      // default monsoon-skewed distribution summing to annual
      const defaultShares = [2,1,2,4,9,15,25,23,10,5,3,1]; // sums to 100
      const annual = cfg.annualRainfall_mm;
      monthly_mm = defaultShares.map(s => (s/100)*annual);
    }

    // Convert monthly mm -> liters collected per month
    // liters = roofArea(m2) * mm * runoff * 1 (1 mm = 1 L/m2)
    const effectiveRunoffFactor = cfg.runoffCoeff;
    // Model first flush as fractional volume loss per rainy month:
    // approximate fraction lost = min( firstFlush_mm / month_mm, 0.4 )
    const monthlyHarvest: Monthly[] = monthly_mm.map((mm, idx) => {
      const firstFlushFraction = mm > 0 ? Math.min(cfg.firstFlush_mm / mm, 0.4) : 0;
      const effective_mm = mm * (1 - firstFlushFraction);
      const liters = Math.round(cfg.roofArea_m2 * effective_mm * effectiveRunoffFactor);
      return { month: months[idx], mm: Math.round(mm), liters };
    });

    const monthlyHarvestLiters = monthlyHarvest.map(m=>m.liters);
    const annualHarvestLiters = Math.round(sum(monthlyHarvestLiters));

    // Demand: monthly demand = daily demand * days per month
    const daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31];
    const dailyPerCapita = cfg.perCapitaIndoor_L_perDay + cfg.perCapitaOutdoor_L_perDay;
    // seasonal factor applied to per capita demand
    const monthlyDemand = monthly_mm.map((_, idx) => {
      const dailyFactor = cfg.monthlyDemandSeasonFactor[idx] ?? 1;
      const daily = dailyPerCapita * dailyFactor;
      const liters = Math.round(daily * daysInMonth[idx] * cfg.householdSize);
      return { month: months[idx], liters };
    });
    const annualDemand = Math.round(sum(monthlyDemand.map(d=>d.liters)));

    // Supply coverage
    const supplyCoveragePct = Math.round( clamp(100 * (annualHarvestLiters / annualDemand), 0, 100) );

    // Cumulative mass curve (descending monthly inflows) helpful for yield-based sizing
    const sortedInflowsDesc = monthlyHarvestLiters.slice().sort((a,b)=>b-a);
    const cumulativeMassCurve = sortedInflowsDesc.map((lit, i) => ({ rank: i+1, liters: lit }));

    // Storage vs Reliability simulation: try multiple tank sizes
    // Candidate tank sizes: from small (7 days of demand) to large (180 days)
    const dailyHouseholdDemand = Math.round(dailyPerCapita * cfg.householdSize);
    const minTank = Math.max( Math.round(dailyHouseholdDemand * 7), 500 ); // at least 500L
    const maxTank = Math.round(dailyHouseholdDemand * 180); // ~6 months
    const tankSizes = generateTankSizes(minTank, maxTank, 28);

    const storageReliabilityCurve: StorageReliabilityPoint[] = tankSizes.map((tankSize) => {
      const sim = simulateAnnualStorage(monthlyHarvestLiters, monthlyDemand.map(d=>d.liters), tankSize);
      return {
        tankSize,
        reliability: Math.round(sim.reliability),
        unmetAnnualLiters: sim.unmetAnnualLiters,
        monthsWithDeficit: sim.monthsWithDeficit
      };
    });

    // Determine recommended tank sizes for common target reliabilities: 50, 75, 90
    const targets = [50,75,90];
    const recommendedTankSizes = targets.map(t => {
      // find smallest tank that achieves reliability >= t
      const found = storageReliabilityCurve.find(pt => pt.reliability >= t);
      return { targetReliability: t, tankSizeL: found ? found.tankSize : storageReliabilityCurve[storageReliabilityCurve.length-1].tankSize };
    });

    // Cost analysis
    const annualSavingsINR = Math.round( (annualHarvestLiters/1000) * cfg.waterCost_INR_per_kL );
    const recommendedTankForPayback = recommendedTankSizes[1].tankSizeL; // pick 75% as baseline
    const tankCapexINR = Math.round(recommendedTankForPayback * cfg.tankCostINR_per_L);
    const installationINR = Math.round(tankCapexINR * cfg.installationPct);
    const totalCapexINR = tankCapexINR + installationINR;
    // Payback years = totalCapex / annualSavings (if savings>0)
    const paybackYears = annualSavingsINR > 0 ? +(totalCapexINR / annualSavingsINR).toFixed(1) : null;

    // NPV over analysisYears
    const years = cfg.analysisYears;
    const cashFlows: number[] = [];
    cashFlows.push(-totalCapexINR); // year 0
    for (let y=1;y<=years;y++){
      // assume annual savings grow slightly (e.g., 1% inflation of water price)
      const growth = Math.pow(1.01, y-1);
      cashFlows.push(annualSavingsINR * growth);
    }
    const discountRate = 0.08;
    const npvVal = Math.round( npv(cashFlows, discountRate) );

    const costAnalysis: CostAnalysis = {
      annualSavingsINR,
      tankCapexINR,
      installationINR,
      totalCapexINR,
      paybackYears,
      npv: npvVal
    };

    // Multi-year projection: apply deterministic +/- rainfall trend and show annual harvest
    const multiYearProjection = Array.from({length: years}, (_,i) => {
      // apply small trend: e.g., ±2% per year alternating for demonstration (you can feed scenarios)
      const trend = 1 + ( (i % 2 === 0) ? 0.01 * i : -0.008 * i );
      return { year: i+1, annualHarvest: Math.round(annualHarvestLiters * trend) };
    });

    // Scenario comparisons: vary runoff and firstFlush and rainfall by +/-10%
    const scenarios = [
      { name: "Base", run: cfg.runoffCoeff, ff: cfg.firstFlush_mm, rainFactor: 1 },
      { name: "Conservative Runoff", run: Math.max(0.6, cfg.runoffCoeff - 0.15), ff: cfg.firstFlush_mm, rainFactor: 1 },
      { name: "High Runoff", run: Math.min(0.95, cfg.runoffCoeff + 0.1), ff: cfg.firstFlush_mm, rainFactor: 1 },
      { name: "Dry Year -10%", run: cfg.runoffCoeff, ff: cfg.firstFlush_mm, rainFactor: 0.9 },
      { name: "Wet Year +10%", run: cfg.runoffCoeff, ff: cfg.firstFlush_mm, rainFactor: 1.1 }
    ];
    const scenarioComparisons = scenarios.map(s => {
      const mmAdj = monthly_mm.map(mm => mm * s.rainFactor);
      const monthlyLit = mmAdj.map(mm => {
        const ffFrac = mm>0 ? Math.min(cfg.firstFlush_mm / mm, 0.4) : 0;
        const eff_mm = mm * (1 - ffFrac);
        return Math.round(cfg.roofArea_m2 * eff_mm * s.run);
      });
      const annual = sum(monthlyLit);
      const supplyPct = Math.round(100 * (annual / annualDemand));
      return { name: s.name, supplyCoveragePct: supplyPct, annualHarvest: Math.round(annual) };
    });

    // Flags: season concentration
    // percentage of annual harvest that occurs in top 3 months
    const sortedDesc = monthlyHarvestLiters.slice().sort((a,b)=>b-a);
    const top3 = sortedDesc.slice(0,3);
    const top3Pct = Math.round(100 * (sum(top3) / annualHarvestLiters));
    const monthsAboveMedian = monthlyHarvestLiters.filter(l=> l > (annualHarvestLiters/12)).length;

    const flags = { highSeasonConcentrationPct: top3Pct, monthsAboveMedian };

    const res: FeasibilityResult = {
      monthlyHarvest,
      monthlyDemand,
      annualHarvestLiters,
      annualDemandLiters: annualDemand,
      supplyCoveragePct,
      cumulativeMassCurve,
      storageReliabilityCurve,
      recommendedTankSizes,
      costAnalysis,
      multiYearProjection,
      scenarioComparisons,
      flags
    };

    return res;
  }, [opts?.roofArea_m2, opts?.annualRainfall_mm, opts?.monthlyRainfall_mm, opts?.runoffCoeff, opts?.firstFlush_mm, opts?.householdSize, opts?.perCapitaIndoor_L_perDay, opts?.perCapitaOutdoor_L_perDay, opts?.waterCost_INR_per_kL, opts?.tankCostINR_per_L, opts?.installationPct, opts?.analysisYears, opts?.monthlyDemandSeasonFactor]);

  return { feasibility: result };
}
