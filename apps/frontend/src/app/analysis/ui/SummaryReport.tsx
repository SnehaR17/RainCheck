"use client";

export default function SummaryReport({ data }: any) {
  return (
    <div className="bg-[#0E0E10]/80 p-6 rounded-xl border border-amber-400/10">
      <h3 className="text-xl font-semibold text-amber-400 mb-4">Summary</h3>
      <ul className="space-y-1 text-gray-300 text-sm">
        <li>🏙️ City: {data.city || "Bengaluru"}</li>
        <li>🏠 Roof Area: {data.roofArea} m²</li>
        <li>🌧️ Rainfall: {data.annualRainfall} mm</li>
        <li>💧 Annual Harvest: {data.annualHarvest.toLocaleString()} L</li>
        <li>🛢️ Suggested Tank: {data.tankSize} L</li>
        <li>📈 Feasibility Score: {data.score}%</li>
        <li>💸 Savings: ₹{data.savings}/year</li>
      </ul>
    </div>
  );
}
