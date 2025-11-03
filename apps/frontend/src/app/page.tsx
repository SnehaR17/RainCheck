"use client";
import { useEffect, useState } from "react";
import type { ApiResponse, SimulationInput, SimulationResult } from "@raincheck/types";

export default function HomePage() {
  const [status, setStatus] = useState("Loading...");
  const [result, setResult] = useState<SimulationResult | null>(null);

  // Fetch backend health
  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then((res: ApiResponse<string>) => {
        setStatus(res.data ?? "No response");
      })
      .catch(() => setStatus("❌ Backend not reachable"));
  }, []);

  // Example simulation request
  const runSimulation = async () => {
    const body: SimulationInput = {
      city: "Bengaluru", roofArea: 700, members: 4,
      latitude: 0,
      longitude: 0,
      roofType: "Concrete",
      intendedUse: "Non-potable",
      tankOption: "Auto"
    };
    const res = await fetch("/api/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data: ApiResponse<SimulationResult> = await res.json();
    setResult(data.data ?? null);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-4 p-6">
      <h1 className="text-3xl font-bold text-emerald-600">🌧️ RainCheck</h1>
      <p className="text-gray-700">Backend Status: {status}</p>

      <button
        onClick={runSimulation}
        className="px-4 py-2 mt-4 text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
      >
        Run Simulation
      </button>

      {result && (
        <div className="p-4 mt-4 border rounded-lg shadow">
          <p>Score: {result.feasibilityScore}</p>
          <p>{result.message}</p>
        </div>
      )}
    </main>
  );
}
