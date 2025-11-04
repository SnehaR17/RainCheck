"use client";
export default function EnvironmentalImpactCard({ liters }: any) {
  const tankerTrips = Math.round(liters / 1000);
  const co2Saved = (tankerTrips * 0.1).toFixed(1);

  return (
    <div className="p-5 bg-[#0E0E10]/80 rounded-xl border border-amber-400/10 text-center">
      <h3 className="text-xl font-semibold text-amber-400">Environmental Impact</h3>
      <p className="text-gray-100 text-lg mt-2">{tankerTrips} tanker trips saved</p>
      <p className="text-gray-400 text-sm">≈ {co2Saved} tons CO₂ reduction</p>
    </div>
  );
}
