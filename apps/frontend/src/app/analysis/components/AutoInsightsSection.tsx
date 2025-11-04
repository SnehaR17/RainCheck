"use client";
import useMockFeasibilityCalculator from "../hooks/useMockFeasibilityCalculator";
import FeasibilityScoreCard from "../ui/FeasibilityScoreCard";
import TankSizeCard from "../ui/TankSizeCard";
import EnvironmentalImpactCard from "../ui/EnvironmentalImpactCard";

export default function AutoInsightsSection() {
  const { feasibility } = useMockFeasibilityCalculator();

  return (
    <section id="insights" className="space-y-6">
      <h2 className="text-3xl font-semibold text-amber-400">3. Automated Insights</h2>
      <p className="text-gray-400">Based on your data, RainCheck has generated mock analysis insights.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <FeasibilityScoreCard score={feasibility.score} liters={feasibility.annualLiters} />
        <TankSizeCard size={feasibility.tankSize} />
        <EnvironmentalImpactCard liters={feasibility.annualLiters} />
      </div>
    </section>
  );
}
