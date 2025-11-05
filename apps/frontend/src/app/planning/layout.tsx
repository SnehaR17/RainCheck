"use client";
import "./planning.css";

export default function PlanningLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="planning-root min-h-screen bg-gradient-to-br from-[#081018] to-[#0b1310] text-gray-100">
      {children}
    </main>
  );
}
