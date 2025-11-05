"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from "recharts";
import {
  Droplets, Gauge, Wallet, Leaf, Truck,
  Sparkles, Loader2,
} from "lucide-react";
import { useFeasibility } from "../context/FeasibilityContext";
import { generateDecisionWithGemini } from "../lib/generateDecisionWithGemini";

export default function AutoInsightsSection() {
  const { report } = useFeasibility();
  const [aiDecision, setAiDecision] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  if (!report) return null;

  const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  const totalHarvest = (report.annualHarvest / 1000).toLocaleString();
  const supplyCoverage = report.metrics?.harvestUtilization ?? report.score ?? 0;
  const savings = report.savings?.toLocaleString() ?? 0;
  const co2 = report.environmentalImpact?.co2SavedTons ?? 0;
  const tankerTrips = report.environmentalImpact?.tankerTrips ?? 0;
  const recharge = report.environmentalImpact?.groundwaterRecharge ?? 0;
  const reliability = report.metrics?.reliability ?? 70;
  const roi = report.metrics?.roi ?? 0;

  // --- ask Gemini for feasibility verdict ---
  useEffect(() => {
    if (report) {
      setLoading(true);
      generateDecisionWithGemini(report)
        .then((res) => setAiDecision(res))
        .catch(() =>
          setAiDecision({
            verdict: "Feasibility Unknown",
            message: "Gemini could not generate insights right now.",
          }),
        )
        .finally(() => setLoading(false));
    }
  }, [report]);

  const rainfallTrend = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(0, i).toLocaleString("default", { month: "short" }),
    rainfall: (report.annualRainfall_mm / 12) * (0.8 + Math.random() * 0.4),
  }));

  const tankReliability = [
    { size: 2000, reliability: 45 },
    { size: 4000, reliability: 65 },
    { size: 6000, reliability: 78 },
    { size: 8000, reliability: 86 },
    { size: 10000, reliability: 92 },
  ];

  const costBenefit = [
    { year: "Year 1", cost: 100, benefit: 105 },
    { year: "Year 2", cost: 110, benefit: 130 },
    { year: "Year 3", cost: 120, benefit: 155 },
    { year: "Year 4", cost: 130, benefit: 185 },
    { year: "Year 5", cost: 140, benefit: 210 },
  ];

  const waterBalance = [
    { label: "Rainfall", volume: report.annualRainfall_mm },
    { label: "Harvestable", volume: report.annualHarvest / 1000 },
    { label: "Utilized", volume: (report.annualHarvest * (supplyCoverage / 100)) / 1000 },
    { label: "Recharge", volume: recharge / 1000 },
  ];

  const sustainability = [
    { metric: "ROI", value: roi },
    { metric: "CO₂ Reduction", value: co2 * 10 },
    { metric: "Reliability", value: reliability },
    { metric: "Recharge", value: recharge / 1000 },
    { metric: "Harvest Utilization", value: supplyCoverage },
  ];

  return (
    <section id="insights" className="min-h-screen text-gray-200 py-12 px-4 sm:px-6 space-y-12">
      {/* Title */}
      <h2 className="text-2xl font-semibold text-center text-amber-400">3. Auto Insights</h2>

      {/* Summary Stats */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4"
      >
        {[
          { icon: <Droplets className="text-amber-400 w-6 h-6" />, label: "Harvestable", value: `${totalHarvest} kL` },
          { icon: <Gauge className="text-emerald-400 w-6 h-6" />, label: "Coverage", value: `${supplyCoverage}%` },
          { icon: <Wallet className="text-blue-400 w-6 h-6" />, label: "Savings", value: `₹${savings}` }, {
            icon: <Leaf className="text-green-400 w-6 h-6" />,
            label: "CO₂ Saved",
            value: `${parseFloat(co2.toFixed(2))} t`,
          },

          { icon: <Truck className="text-red-400 w-6 h-6" />, label: "Tanker Trips", value: `${tankerTrips}` },
        ].map((s, i) => (
          <motion.div
            key={i}
            variants={fadeIn}
            whileHover={{ scale: 1.03 }}
            className="bg-[#161616]/70 rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center text-center transition-all"
          >
            {s.icon}
            <p className="mt-2 text-xs text-gray-400">{s.label}</p>
            <p className="text-lg font-semibold text-amber-300">{s.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts grid */}
      <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
        <ChartCard title="Monthly Rainfall Trend">
          <AreaChart data={rainfallTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="month" stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip />
            <Area type="monotone" dataKey="rainfall" stroke="#F59E0B" fill="#F59E0B40" />
          </AreaChart>
        </ChartCard>

        <ChartCard title="Tank Size vs Reliability">
          <LineChart data={tankReliability}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="size" stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip />
            <Line type="monotone" dataKey="reliability" stroke="#10B981" strokeWidth={2} />
          </LineChart>
        </ChartCard>

        <ChartCard title="Cost vs Benefit Trend">
          <LineChart data={costBenefit}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="year" stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip />
            <Legend />
            <Line dataKey="cost" stroke="#F59E0B" />
            <Line dataKey="benefit" stroke="#10B981" />
          </LineChart>
        </ChartCard>

        <ChartCard title="Water Balance Overview">
          <BarChart data={waterBalance}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="label" stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip />
            <Bar dataKey="volume" fill="#F59E0B" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartCard>

        <ChartCard title="Sustainability Metrics">
          <RadarChart data={sustainability}>
            <PolarGrid stroke="#333" />
            <PolarAngleAxis dataKey="metric" stroke="#999" />
            <PolarRadiusAxis stroke="#999" />
            <Radar dataKey="value" stroke="#10B981" fill="#10B981" fillOpacity={0.5} />
          </RadarChart>
        </ChartCard>
      </div>

      {/* 🌟 Gemini-Generated Decision */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0D0D0E] via-[#141416] to-[#1A1A1D] border border-amber-400/10 shadow-[0_0_25px_rgba(245,158,11,0.05)] p-6 sm:p-10 text-center"
      >
        {/* Gradient Accent Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(245,158,11,0.08),transparent_60%),radial-gradient(circle_at_80%_90%,rgba(16,185,129,0.08),transparent_70%)] pointer-events-none" />

        {loading ? (
          // --- Loading Animation ---
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center space-y-3 py-10"
          >
            <motion.div
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-400 bg-[length:200%_200%] animate-pulse"
            />
            <p className="text-gray-400 text-sm sm:text-base font-light">
              Gemini is analyzing your site...
            </p>
          </motion.div>
        ) : aiDecision ? (
          // --- AI Decision Content ---
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 space-y-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex justify-center"
            >
              <div className="p-3 rounded-full bg-amber-400/10 ring-1 ring-amber-400/20">
                <Sparkles className="w-6 h-6 text-amber-400" />
              </div>
            </motion.div>

            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-300 bg-clip-text text-transparent drop-shadow-[0_0_6px_rgba(245,158,11,0.2)]">
              {aiDecision.verdict}
            </h3>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              {aiDecision.message}
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 1 }}
              className="text-[11px] text-gray-500 italic"
            >
              ✦ AI-generated insights powered by Gemini
            </motion.div>
          </motion.div>
        ) : (
          // --- Awaiting State ---
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-500 italic py-6"
          >
            Awaiting AI recommendation...
          </motion.p>
        )}
      </motion.div>

    </section>
  );
}

/* Chart wrapper for consistency */
function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div
      className="bg-[#161616]/80 rounded-xl border border-amber-400/10 p-4 sm:p-6"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-base sm:text-lg font-medium mb-3 text-amber-300 text-center">
        {title}
      </h2>
      <ResponsiveContainer width="100%" height={220}>
        {children}
      </ResponsiveContainer>
    </motion.div>
  );
}
