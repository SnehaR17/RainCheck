"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { ApiResponse, SimulationInput, SimulationResult } from "@raincheck/types";
import Container from "./components/layout/Container";
import WaterChart from "./ui/WaterChart";
import India from "@react-map/india";
import WhatRainCheckDoes from "./ui/WhatRainCheckDoes";
import FeaturesCapabilities from "./ui/FeaturesCapabilities";

/**
 * Sample data (replace with API data later)
 */
const indiaWaterData = [
  { year: 2018, rainfall: 1180, scarcity: 0.65 },
  { year: 2019, rainfall: 1120, scarcity: 0.72 },
  { year: 2020, rainfall: 1050, scarcity: 0.75 },
];

const waterData = {
  indiaWaterData,
  Punjab: [
    { year: 2018, rainfall: 850, scarcity: 0.55 },
    { year: 2019, rainfall: 800, scarcity: 0.6 },
    { year: 2020, rainfall: 780, scarcity: 0.62 },
  ],
  Rajasthan: [
    { year: 2018, rainfall: 600, scarcity: 0.8 },
    { year: 2019, rainfall: 580, scarcity: 0.82 },
    { year: 2020, rainfall: 550, scarcity: 0.85 },
  ],
  Maharashtra: [
    { year: 2018, rainfall: 900, scarcity: 0.7 },
    { year: 2019, rainfall: 880, scarcity: 0.72 },
    { year: 2020, rainfall: 850, scarcity: 0.75 },
  ],
};

export default function HomePage() {
  const [status, setStatus] = useState("Loading...");
  const [result, setResult] = useState<SimulationResult | null>(null);
  // modalData is the dataset shown in the chart; initially India aggregate
  const [modalData, setModalData] = useState(waterData.indiaWaterData);

  // backend health check (example)
  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then((res: ApiResponse<string>) => setStatus(res.data ?? "No response"))
      .catch(() => setStatus("❌ Backend not reachable"));
  }, []);

  // Example simulation call (kept for completeness)
  const runSimulation = async () => {
    const body: SimulationInput = {
      city: "Bengaluru",
      roofArea: 700,
      members: 4,
      latitude: 0,
      longitude: 0,
      roofType: "Concrete",
      intendedUse: "Non-potable",
      tankOption: "Auto",
    };
    try {
      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data: ApiResponse<SimulationResult> = await res.json();
      setResult(data.data ?? null);
    } catch (err) {
      console.error("simulate error", err);
    }
  };

  return (
    <main className="w-full min-h-screen bg-[#0b0b0b] text-gray-200">
      {/* HERO */}
      <section className="py-20">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-b from-blue-400 to-blue-200">
              RainCheck
            </h1>
            <p className="mt-6 text-lg text-gray-400 leading-relaxed">
              Turn every rooftop into a rainwater opportunity. Powered by AI, weather data and
              hydrological models — RainCheck helps households and cities harvest, store and recharge water.
            </p>

            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={runSimulation}
                className="bg-blue-600 hover:bg-blue-500 transition py-3 px-6 rounded-lg font-medium shadow-lg shadow-blue-600/20"
              >
                Start My Analysis
              </button>
              <button className="border border-blue-600 text-blue-300 hover:bg-blue-500/10 transition py-3 px-6 rounded-lg font-medium">
                Learn More
              </button>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* MAP + CHART SECTION */}
      <section className="py-16">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white">India — Map & Water Insights</h2>
            <p className="mt-2 text-gray-400 max-w-2xl mx-auto">
              Click or tap a state to view its rainfall history and scarcity index.
            </p>
          </motion.div>

          {/* RESPONSIVE LAYOUT: map left, chart right (stack on mobile) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Map occupies 7 cols on large screens */}
            <motion.div
              className="lg:col-span-7 p-4 rounded-xl bg-gradient-to-b from-white/3 to-transparent border border-white/8 backdrop-blur-sm"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <div className="w-full h-full">
                {/* Ensure the map scales responsively; you may wrap in a fixed-height container if needed */}
                <India
                  type="select-single"
                  hints
                  strokeColor="#334155"
                  mapColor="#0f1724" // dark map tone
                  hoverColor="#2563eb"
                  selectColor="#60a5fa"
                  onSelect={(sc) => {
                    if (sc && sc in waterData) {
                      setModalData(waterData[sc as keyof typeof waterData]);
                    } else if (sc === null) {
                      // optional: reset to India aggregate
                      setModalData(waterData.indiaWaterData);
                    }
                  }}
                />
              </div>
            </motion.div>

            {/* Chart occupies 5 cols on large screens */}
            <motion.div
              className="lg:col-span-5 p-4 rounded-xl bg-gradient-to-b from-white/3 to-transparent border border-white/8 backdrop-blur-sm flex flex-col"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">Rainfall & Scarcity</h3>
                  <p className="text-sm text-gray-400">Select a region on the map to update the chart</p>
                </div>
                <div className="text-sm text-gray-400">Data: sample</div>
              </div>

              {/* Chart area (full width within card) */}
              <div className="flex-1 min-h-[240px]">
                <WaterChart data={modalData} />
              </div>
            </motion.div>
          </div>

          {/* Insight cards under the map+chart */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            {[
              {
                title: "21 Cities at Risk",
                text: "By 2030, an estimated 21 Indian cities could face severe water scarcity.",
              },
              {
                title: "Groundwater Stress",
                text: "Urban demand relies heavily on groundwater and private tankers, worsening depletion.",
              },
              {
                title: "Rain Harvest Potential",
                text: "Many cities receive enough rainfall to cover a large portion of demand with proper harvesting.",
              },
              {
                title: "Adoption Barriers",
                text: "Awareness, cost perception, and fragmented data slow adoption of solutions.",
              },
            ].map((c, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 220, damping: 20 }}
                className="p-6 rounded-xl bg-gradient-to-b from-white/3 to-transparent border border-white/8"
              >
                <h4 className="text-lg font-semibold text-blue-300 mb-1">{c.title}</h4>
                <p className="text-gray-400 text-sm">{c.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* WHAT & FEATURES */}
      <section className="py-20 border-t border-white/6 bg-[#0b0b0b]">
        <Container>
          <WhatRainCheckDoes />
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <FeaturesCapabilities />
        </Container>
      </section>
    </main>
  );
}
