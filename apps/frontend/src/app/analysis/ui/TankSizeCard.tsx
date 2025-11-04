"use client";
export default function TankSizeCard({ size }: any) {
  return (
    <div className="p-5 bg-[#0E0E10]/80 rounded-xl border border-amber-400/10 text-center">
      <h3 className="text-xl font-semibold text-amber-400">Suggested Tank Size</h3>
      <p className="text-5xl font-bold text-gray-100 my-3">{Math.round(size)} L</p>
      <p className="text-sm text-gray-400">Optimal capacity for monthly yield</p>
    </div>
  );
}
