"use client";

import { motion } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from "recharts";
import { Droplets, Gauge, Wallet, Leaf, Truck, FileText, CheckCircle2, AlertTriangle } from "lucide-react";
import useFeasibilityCalculator from "../hooks/useFeasibilityCalculator";

export default function AutoInsightsSection() {
  const { feasibility } = useFeasibilityCalculator({
    roofArea_m2: 120,
    annualRainfall_mm: 1100,
    householdSize: 5,
  });

  const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  // --- Computed metrics ---
  const totalHarvest = (feasibility.annualHarvestLiters / 1000).toLocaleString();
  const supplyCoverage = feasibility.supplyCoveragePct;
  const savings = feasibility.costAnalysis.annualSavingsINR.toLocaleString();
  const co2 = feasibility.co2SavedKg.toLocaleString();
  const reliability =
    feasibility.storageReliabilityCurve.find(r => r.tankSize === 5000)?.reliability || 70;

  // --- Decision Logic ---
  let decision = {
    verdict: "",
    message: "",
    icon: null as React.ReactNode,
    color: "",
  };

  if (supplyCoverage >= 70 && reliability >= 70) {
    decision = {
      verdict: "Highly Feasible",
      message:
        "Installing a Rainwater Harvesting (RWH) system is strongly recommended. Your site has excellent rainfall capture potential, high supply reliability, and strong economic and environmental returns.",
      icon: <CheckCircle2 className="w-7 h-7 text-emerald-400" />,
      color: "text-emerald-400",
    };
  } else if (supplyCoverage >= 40 && reliability >= 50) {
    decision = {
      verdict: "Moderately Feasible",
      message:
        "Installing an RWH system is reasonably feasible. It will provide partial coverage of your water needs and meaningful cost savings, but additional storage or roof optimization could enhance performance.",
      icon: <AlertTriangle className="w-7 h-7 text-amber-400" />,
      color: "text-amber-400",
    };
  } else {
    decision = {
      verdict: "Low Feasibility",
      message:
        "The current parameters suggest that an RWH system may not yield sufficient benefits. Consider increasing roof catchment, improving filtration efficiency, or supplementing with other water-saving systems.",
      icon: <AlertTriangle className="w-7 h-7 text-red-400" />,
      color: "text-red-400",
    };
  }

  // --- Mock Data for Advanced Charts ---
  const rainfallTrend = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(0, i).toLocaleString("default", { month: "short" }),
    rainfall: 80 + Math.random() * 100,
  }));

  const storageEfficiency = [
    { size: 1000, reliability: 45 },
    { size: 3000, reliability: 60 },
    { size: 5000, reliability: 75 },
    { size: 7000, reliability: 82 },
    { size: 10000, reliability: 90 },
  ];

  const costBenefit = [
    { year: "2021", cost: 50, benefit: 55 },
    { year: "2022", cost: 55, benefit: 65 },
    { year: "2023", cost: 60, benefit: 80 },
    { year: "2024", cost: 65, benefit: 95 },
  ];

  const waterBalance = [
    { label: "Rainfall Received", volume: 1100 },
    { label: "Harvestable", volume: 850 },
    { label: "Utilized", volume: 600 },
    { label: "Overflow", volume: 250 },
  ];

  const sustainability = [
    { metric: "Cost Savings", value: 85 },
    { metric: "CO₂ Reduction", value: 80 },
    { metric: "Reliability", value: 70 },
    { metric: "Storage Efficiency", value: 75 },
    { metric: "Rainfall Utilization", value: 90 },
  ];

  return (
    <section className="min-h-screen text-gray-200 py-16 px-6 space-y-20">
      {/* --- Title --- */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-300 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(245,158,11,0.15)]"
      >
        Rainwater Harvesting Feasibility Insights
      </motion.h1>

      {/* --- Summary Stats --- */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.15 }}
        className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6"
      >
        {[
          {
            icon: <Droplets className="text-amber-400 w-7 h-7" />,
            label: "Harvestable Water",
            value: `${totalHarvest} kL`,
          },
          {
            icon: <Gauge className="text-emerald-400 w-7 h-7" />,
            label: "Supply Coverage",
            value: `${supplyCoverage}%`,
          },
          {
            icon: <Wallet className="text-blue-400 w-7 h-7" />,
            label: "Annual Savings",
            value: `₹${savings}`,
          },
          {
            icon: <Leaf className="text-green-400 w-7 h-7" />,
            label: "CO₂ Saved",
            value: `${co2} kg`,
          },
          {
            icon: <Truck className="text-red-400 w-7 h-7" />,
            label: "Tanker Trips Avoided",
            value: `${feasibility.tankerTripsAvoided}`,
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            variants={fadeIn}
            whileHover={{ scale: 1.05 }}
            className="bg-[#1A1A1D]/70 backdrop-blur-sm rounded-2xl p-6 border border-amber-400/10 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all duration-300"
          >
            {stat.icon}
            <p className="mt-2 text-sm tracking-wide text-gray-400">{stat.label}</p>
            <p className="text-2xl font-semibold text-amber-300 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* --- Advanced Charts --- */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="space-y-20"
      >
        {/* Rainfall Trend */}
        <div className="bg-[#1A1A1D]/60 rounded-2xl p-6 border border-amber-400/10">
          <h2 className="text-2xl font-semibold mb-4 text-amber-300">Monthly Rainfall Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={rainfallTrend}>
              <defs>
                <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip />
              <Area type="monotone" dataKey="rainfall" stroke="#F59E0B" fill="url(#rainGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Tank Size vs Reliability */}
        <div className="bg-[#1A1A1D]/60 rounded-2xl p-6 border border-amber-400/10">
          <h2 className="text-2xl font-semibold mb-4 text-amber-300">Tank Size vs Reliability</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={storageEfficiency}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="size" stroke="#999" label={{ value: "Tank Size (L)", dy: 10 }} />
              <YAxis stroke="#999" />
              <Tooltip />
              <Line type="monotone" dataKey="reliability" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Cost vs Benefit */}
        <div className="bg-[#1A1A1D]/60 rounded-2xl p-6 border border-amber-400/10">
          <h2 className="text-2xl font-semibold mb-4 text-amber-300">Cost vs Benefit Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={costBenefit}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="year" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip />
              <Legend />
              <Line dataKey="cost" stroke="#F59E0B" name="Cost (₹k)" />
              <Line dataKey="benefit" stroke="#10B981" name="Benefit (₹k)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Water Balance */}
        <div className="bg-[#1A1A1D]/60 rounded-2xl p-6 border border-amber-400/10">
          <h2 className="text-2xl font-semibold mb-4 text-amber-300">Water Balance Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={waterBalance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="label" stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip />
              <Bar dataKey="volume" fill="#F59E0B" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sustainability Radar */}
        <div className="bg-[#1A1A1D]/60 rounded-2xl p-6 border border-amber-400/10">
          <h2 className="text-2xl font-semibold mb-4 text-amber-300">Sustainability Performance</h2>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={sustainability}>
              <PolarGrid stroke="#333" />
              <PolarAngleAxis dataKey="metric" stroke="#999" />
              <PolarRadiusAxis stroke="#999" />
              <Radar
                dataKey="value"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.5}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* --- Summary Report --- */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="bg-[#1A1A1D]/80 backdrop-blur-lg border border-amber-400/10 rounded-3xl p-10 mt-10 shadow-[0_0_25px_rgba(245,158,11,0.1)]"
      >
        <div className="flex items-center gap-3 mb-5">
          <FileText className="w-6 h-6 text-amber-400" />
          <h3 className="text-3xl font-bold text-amber-300">Summary Report</h3>
        </div>

        <p className="text-gray-300 leading-relaxed text-lg">
          Based on your input parameters, the site demonstrates a strong potential for rainwater harvesting. 
          An estimated <span className="text-amber-400 font-semibold">{totalHarvest} kiloliters</span> of water can be harvested annually, 
          covering approximately <span className="text-emerald-400 font-semibold">{supplyCoverage}%</span> of total household demand.
          This could result in yearly cost savings of about <span className="text-blue-400 font-semibold">₹{savings}</span>, 
          while preventing <span className="text-green-400 font-semibold">{co2} kg</span> of CO₂ emissions and eliminating the need 
          for <span className="text-red-400 font-semibold">{feasibility.tankerTripsAvoided}</span> tanker trips.
        </p>

        <p className="text-gray-400 mt-4 leading-relaxed text-lg">
          A tank of 5000L provides approximately <span className="text-amber-300 font-semibold">{reliability}%</span> supply reliability, 
          suggesting that an optimal design balancing capacity and cost would ensure dependable water availability year-round. 
          The rainfall distribution pattern indicates moderate seasonality, implying that additional storage during peak months 
          could further enhance system efficiency.
        </p>

        <p className="text-gray-500 mt-6 italic text-sm text-center">
          *This analysis is based on deterministic mock data for visualization. Real-world results may vary with location, rainfall intensity, and system efficiency.*
        </p>
      </motion.div>

      {/* --- Decision Summary --- */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-[#121213] to-[#1A1A1D] border border-amber-400/10 rounded-3xl p-10 shadow-[0_0_25px_rgba(0,0,0,0.3)] text-center space-y-4"
      >
        <div className="flex justify-center">{decision.icon}</div>
        <h3 className={`text-3xl font-bold ${decision.color}`}>{decision.verdict}</h3>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
          {decision.message}
        </p>
      </motion.div>
    </section>
  );
}
