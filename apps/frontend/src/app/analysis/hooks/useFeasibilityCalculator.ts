// /hooks/useFeasibilityCalculator.ts
"use client";

import { useMemo } from "react";

/**
 * Fully-mocked, advanced feasibility hook for RainCheck.
 * - No external APIs. Deterministic mock data ready for UI and chart development.
 * - Time-step: monthly for hydrologic calculations. Units: liters (L), INR, kg CO2.
 *
 * Returns:
 *  { feasibility: FeasibilityResult }
 *
 * Use: const { feasibility } = useFeasibilityCalculator(opts?)
 *
 * Accepts optional overrides via opts to simulate different sites.
 */

/* ----------------------- Types ----------------------- */
type Monthly = { month: string; mm: number; liters: number };
type MonthlyDemand = { month: string; liters: number };
type MassPoint = { rank: number; liters: number };

type StorageReliabilityPoint = {
  tankSize: number; // L
  reliability: number; // 0-100 %
  unmetAnnualLiters: number;
  monthsWithDeficit: number;
};

type CostAnalysis = {
  annualSavingsINR: number;
  tankCapexINR: number;
  installationINR: number;
  totalCapexINR: number;
  paybackYears: number | null;
  npv: number;
};

type FeasibilityResult = {
  // monthly arrays (length 12)
  monthlyHarvest: Monthly[];       // rainfall->harvest
  monthlyDemand: MonthlyDemand[];  // household demand per month
  monthlyBalance: { month: string; balanceLiters: number }[];

  // annual totals & percentages
  annualHarvestLiters: number;
  annualDemandLiters: number;
  supplyCoveragePct: number; // harvest / demand * 100

  // mass curve & reliability
  cumulativeMassCurve: MassPoint[]; // descending monthly inflows
  storageReliabilityCurve: StorageReliabilityPoint[]; // many tank sizes
  recommendedTankSizes: { targetReliability: number; tankSizeL: number }[]; // e.g. 50/75/90

  // financial & environmental
  costAnalysis: CostAnalysis;
  co2SavedKg: number;
  tankerTripsAvoided: number;

  // multi-year & scenarios
  multiYearProjection: { year: number; annualHarvest: number }[];
  scenarioComparisons: { name: string; supplyCoveragePct: number; annualHarvest: number }[];

  // flags & meta
  flags: { highSeasonConcentrationPct: number; monthsAboveMedian: number };
};

/* ----------------------- Helpers ----------------------- */
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const sum = (arr: number[]) => arr.reduce((a,b)=>a+b, 0);
const clamp = (v:number, a=0,b=1) => Math.max(a, Math.min(b, v));

function generateTankSizes(minL:number, maxL:number, steps=28){
  const a:number[] = [];
  for (let i=0;i<steps;i++){
    const t = Math.round(minL + (i/(steps-1))*(maxL-minL));
    a.push(t);
  }
  return a;
}

/* Simple monthly storage simulation (monthly timestep)
   - inflows (L), demand (L), tankSize (L)
   - returns reliability %, unmet liters, months with deficit
   - starts with empty tank (conservative)
*/
function simulateAnnualStorage(inflows:number[], demand:number[], tankSize:number){
  let storage = 0;
  let unmet = 0;
  let monthsDeficit = 0;
  const months = inflows.length;
  for (let i=0;i<months;i++){
    storage += inflows[i];
    if (storage >= demand[i]) {
      storage -= demand[i];
    } else {
      unmet += (demand[i] - storage);
      storage = 0;
      monthsDeficit++;
    }
    if (storage > tankSize) storage = tankSize;
  }
  const annualDemand = sum(demand);
  const reliability = clamp(100 * (1 - (unmet / Math.max(1, annualDemand))), 0, 100);
  return { reliability: Math.round(reliability), unmetAnnualLiters: Math.round(unmet), monthsWithDeficit: monthsDeficit };
}

/* NPV */
function npv(cashFlows:number[], discountRate=0.08){
  return Math.round(cashFlows.reduce((acc,cf,i)=> acc + cf / Math.pow(1+discountRate, i), 0));
}

/* ----------------------- Hook ----------------------- */
export default function useFeasibilityCalculator(opts?: {
  roofArea_m2?: number;            // default 100 m²
  annualRainfall_mm?: number;      // default 1000 mm/year
  runoffCoeff?: number;            // default 0.82
  firstFlush_mm?: number;          // default 3 mm
  householdSize?: number;          // default 4
  perCapitaIndoor_L_day?: number;  // default 100 L/day
  perCapitaOutdoor_L_day?: number; // default 30 L/day
  waterCostINR_per_kL?: number;    // default ₹50 per 1000 L
  tankCostINR_per_L?: number;      // default ₹0.6 per L
  installationPct?: number;        // default 0.25
  analysisYears?: number;          // default 10y
}): { feasibility: FeasibilityResult } {

  const cfg = {
    roofArea_m2: opts?.roofArea_m2 ?? 100,
    annualRainfall_mm: opts?.annualRainfall_mm ?? 1000,
    runoffCoeff: clamp(opts?.runoffCoeff ?? 0.82, 0.4, 0.98),
    firstFlush_mm: opts?.firstFlush_mm ?? 3,
    householdSize: opts?.householdSize ?? 4,
    perCapitaIndoor_L_day: opts?.perCapitaIndoor_L_day ?? 100,
    perCapitaOutdoor_L_day: opts?.perCapitaOutdoor_L_day ?? 30,
    waterCostINR_per_kL: opts?.waterCostINR_per_kL ?? 50,
    tankCostINR_per_L: opts?.tankCostINR_per_L ?? 0.6,
    installationPct: clamp(opts?.installationPct ?? 0.25, 0, 1),
    analysisYears: opts?.analysisYears ?? 10,
  };

  const result = useMemo(() => {
    // ---------- 1) Mock monthly rainfall distribution (monsoon-biased)
    // shares sum to 100
    const shares = [2,2,3,5,10,18,22,18,12,5,3,0]; // example distribution
    const totalShares = sum(shares);
    const monthly_mm = shares.map(s => (s / totalShares) * cfg.annualRainfall_mm);

    // ---------- 2) Monthly harvest calculation (L)
    // 1 mm over 1 m² = 1 L. So liters = mm * area * runoff
    const monthlyHarvest: Monthly[] = monthly_mm.map((mm, i) => {
      const firstFlushFraction = mm > 0 ? Math.min(cfg.firstFlush_mm / mm, 0.4) : 0;
      const eff_mm = mm * (1 - firstFlushFraction);
      const liters = Math.round(cfg.roofArea_m2 * eff_mm * cfg.runoffCoeff);
      return { month: MONTHS[i], mm: Math.round(mm), liters };
    });
    const monthlyHarvestLiters = monthlyHarvest.map(m=>m.liters);
    const annualHarvestLiters = Math.round(sum(monthlyHarvestLiters));

    // ---------- 3) Monthly demand (L)
    const daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31];
    const perCapitaDaily = cfg.perCapitaIndoor_L_day + cfg.perCapitaOutdoor_L_day;
    const monthlyDemand: MonthlyDemand[] = daysInMonth.map((days, i) => {
      // mock small seasonality for outdoor use (more in some months)
      const outdoorSeasonFactor = [0.9,0.9,1,1,1.1,1.2,1.3,1.2,1.05,0.95,0.9,0.85][i];
      const daily = (cfg.perCapitaIndoor_L_day + cfg.perCapitaOutdoor_L_day * outdoorSeasonFactor);
      const liters = Math.round(daily * cfg.householdSize * days);
      return { month: MONTHS[i], liters };
    });
    const annualDemand = Math.round(sum(monthlyDemand.map(m=>m.liters)));

    // ---------- 4) Monthly balance = harvest - demand
    const monthlyBalance = MONTHS.map((m, idx) => ({ month: m, balanceLiters: monthlyHarvestLiters[idx] - monthlyDemand[idx].liters }));

    // ---------- 5) supply coverage %
    const supplyCoveragePct = Math.round(clamp(100 * (annualHarvestLiters / Math.max(1, annualDemand)), 0, 100));

    // ---------- 6) cumulative mass curve (descending months)
    const sortedDesc = monthlyHarvestLiters.slice().sort((a,b)=>b-a);
    const cumulativeMassCurve: MassPoint[] = sortedDesc.map((lit, i)=> ({ rank: i+1, liters: lit }));

    // ---------- 7) storage vs reliability (simulate many tank sizes)
    const dailyHouseholdDemand = Math.round(perCapitaDaily * cfg.householdSize);
    const minTank = Math.max(500, Math.round(dailyHouseholdDemand * 7));       // 7 days
    const maxTank = Math.round(dailyHouseholdDemand * 180);                     // ~6 months
    const tankSizes = generateTankSizes(minTank, maxTank, 28);

    const storageReliabilityCurve: StorageReliabilityPoint[] = tankSizes.map(tank => {
      const sim = simulateAnnualStorage(monthlyHarvestLiters, monthlyDemand.map(d=>d.liters), tank);
      return {
        tankSize: tank,
        reliability: sim.reliability,
        unmetAnnualLiters: sim.unmetAnnualLiters,
        monthsWithDeficit: sim.monthsWithDeficit
      };
    });

    // recommended tank sizes for target reliabilities 50,75,90
    const targets = [50,75,90];
    const recommendedTankSizes = targets.map(target => {
      const found = storageReliabilityCurve.find(pt => pt.reliability >= target);
      return { targetReliability: target, tankSizeL: found ? found.tankSize : storageReliabilityCurve[storageReliabilityCurve.length-1].tankSize };
    });

    // ---------- 8) cost & environment
    const annualSavingsINR = Math.round((annualHarvestLiters / 1000) * cfg.waterCostINR_per_kL);
    // pick 75% tank recommendation for capex baseline
    const baselineTank = recommendedTankSizes[1].tankSizeL;
    const tankCapexINR = Math.round(baselineTank * cfg.tankCostINR_per_L);
    const installationINR = Math.round(tankCapexINR * cfg.installationPct);
    const totalCapexINR = tankCapexINR + installationINR;
    const paybackYears = annualSavingsINR > 0 ? +(totalCapexINR / annualSavingsINR).toFixed(1) : null;

    const cashFlows:number[] = [];
    cashFlows.push(-totalCapexINR);
    for (let y=1;y<=cfg.analysisYears;y++){
      // small nominal growth in water price/savings
      const growth = Math.pow(1.01, y-1);
      cashFlows.push(Math.round(annualSavingsINR * growth));
    }
    const npvVal = npv(cashFlows, 0.08);

    const costAnalysis: CostAnalysis = {
      annualSavingsINR,
      tankCapexINR,
      installationINR,
      totalCapexINR,
      paybackYears,
      npv: npvVal
    };

    // environmental equivalents
    // simple model: pumping energy avoided -> CO2 approx factor, plus tanker avoidance
    const electricity_kWh_per_L = 0.0003; // mock: 0.0003 kWh per L pumped
    const co2_kg_per_kWh = 0.82; // grid emission factor placeholder
    const co2SavedKg = Math.round((annualHarvestLiters * electricity_kWh_per_L) * co2_kg_per_kWh);

    const tankerTripsAvoided = Math.round(annualHarvestLiters / 10000); // assume 10k L per tanker trip

    // ---------- 9) multi-year projection (simple deterministic trend)
    const multiYearProjection = Array.from({length: cfg.analysisYears}, (_,i) => {
      const trendFactor = 1 + ((i%2===0) ? 0.01 * i : -0.008 * i); // small up/down pattern
      return { year: i+1, annualHarvest: Math.round(annualHarvestLiters * trendFactor) };
    });

    // ---------- 10) scenario comparisons (mock)
    const scenarios = [
      { name: "Base", run: cfg.runoffCoeff, rainFactor: 1 },
      { name: "Dry Year -10%", run: cfg.runoffCoeff, rainFactor: 0.9 },
      { name: "Wet Year +10%", run: cfg.runoffCoeff, rainFactor: 1.1 },
      { name: "Low Runoff", run: Math.max(0.5, cfg.runoffCoeff - 0.2), rainFactor: 1 },
      { name: "High Runoff", run: Math.min(0.98, cfg.runoffCoeff + 0.1), rainFactor: 1 },
    ];
    const scenarioComparisons = scenarios.map(s => {
      const mmAdj = monthly_mm.map(mm => mm * s.rainFactor);
      const monthlyLit = mmAdj.map(mm => {
        const ffFrac = mm > 0 ? Math.min(cfg.firstFlush_mm / mm, 0.4) : 0;
        const eff_mm = mm * (1 - ffFrac);
        return Math.round(cfg.roofArea_m2 * eff_mm * s.run);
      });
      const annual = sum(monthlyLit);
      const coverage = Math.round(100 * (annual / Math.max(1, annualDemand)));
      return { name: s.name, supplyCoveragePct: coverage, annualHarvest: Math.round(annual) };
    });

    // ---------- 11) flags
    const sorted = monthlyHarvestLiters.slice().sort((a,b)=>b-a);
    const top3 = sorted.slice(0,3);
    const top3Pct = Math.round(100 * (sum(top3) / Math.max(1, annualHarvestLiters)));
    const monthsAboveMedian = monthlyHarvestLiters.filter(l => l > (annualHarvestLiters/12)).length;

    const flags = { highSeasonConcentrationPct: top3Pct, monthsAboveMedian };

    // ---------- Assemble result
    const res: FeasibilityResult = {
      monthlyHarvest,
      monthlyDemand,
      monthlyBalance,
      annualHarvestLiters,
      annualDemandLiters: annualDemand,
      supplyCoveragePct,
      cumulativeMassCurve,
      storageReliabilityCurve,
      recommendedTankSizes,
      costAnalysis,
      co2SavedKg,
      tankerTripsAvoided,
      multiYearProjection,
      scenarioComparisons,
      flags
    };

    return res;
  }, [
    cfg.roofArea_m2, cfg.annualRainfall_mm, cfg.runoffCoeff, cfg.firstFlush_mm,
    cfg.householdSize, cfg.perCapitaIndoor_L_day, cfg.perCapitaOutdoor_L_day,
    cfg.waterCostINR_per_kL, cfg.tankCostINR_per_L, cfg.installationPct, cfg.analysisYears
  ]);

  return { feasibility: result };
}
