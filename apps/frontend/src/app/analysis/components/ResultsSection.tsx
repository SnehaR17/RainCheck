"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Download, FileText } from "lucide-react";
import SummaryReport from "../ui/SummaryReport";
import { generateReport } from "../services/PdfReportGenerator";
import { mockFeasibilityData } from "../mock/mockFeasibilityData";

export default function ResultsSection() {
  const handleDownload = () => {
    generateReport(mockFeasibilityData);
    alert("Mock report generated! (check console)");
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const rainfallData = [
    { month: "Jan", rainfall: 30, harvested: 20 },
    { month: "Feb", rainfall: 40, harvested: 30 },
    { month: "Mar", rainfall: 60, harvested: 50 },
    { month: "Apr", rainfall: 90, harvested: 70 },
    { month: "May", rainfall: 150, harvested: 120 },
    { month: "Jun", rainfall: 200, harvested: 180 },
    { month: "Jul", rainfall: 250, harvested: 230 },
    { month: "Aug", rainfall: 220, harvested: 200 },
    { month: "Sep", rainfall: 180, harvested: 150 },
    { month: "Oct", rainfall: 100, harvested: 80 },
    { month: "Nov", rainfall: 60, harvested: 40 },
    { month: "Dec", rainfall: 40, harvested: 20 },
  ];

  const savingsData = [
    { year: 1, savings: 7000 },
    { year: 2, savings: 14500 },
    { year: 3, savings: 22500 },
    { year: 4, savings: 31500 },
    { year: 5, savings: 41000 },
  ];

  return (
    <section
      id="results"
      className="min-h-screen py-20 px-6 text-gray-200 space-y-16"
    >
      {/* Header */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.6 }}
        className="text-center space-y-3"
      >
        <h2 className="text-5xl font-extrabold bg-gradient-to-r from-amber-400 via-emerald-400 to-amber-300 bg-clip-text text-transparent tracking-tight">
          Results Overview
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          A complete overview of your rainwater harvesting potential, economic viability, and sustainability benefits.
        </p>
      </motion.div>

      {/* Summary Section */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <SummaryReport data={mockFeasibilityData} />
      </motion.div>

      {/* Charts Section */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="grid md:grid-cols-2 gap-10"
      >
        {/* Rainfall vs Harvested */}
        <div className="bg-[#1A1A1D]/80 p-6 rounded-2xl border border-amber-400/10 shadow-lg shadow-amber-400/5">
          <h3 className="text-xl font-semibold text-amber-300 mb-4">
            Monthly Rainfall vs Harvested Water
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={rainfallData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" />
              <XAxis dataKey="month" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1E1E20", border: "none", borderRadius: "6px" }}
              />
              <Legend />
              <Bar dataKey="rainfall" fill="#60a5fa" name="Rainfall (mm)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="harvested" fill="#fbbf24" name="Harvested (L)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Savings Over Time */}
        <div className="bg-[#1A1A1D]/80 p-6 rounded-2xl border border-emerald-400/10 shadow-lg shadow-emerald-400/5">
          <h3 className="text-xl font-semibold text-emerald-300 mb-4">
            Projected Savings (5-Year Outlook)
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={savingsData}>
              <defs>
                <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" />
              <XAxis dataKey="year" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1E1E20", border: "none", borderRadius: "6px" }}
              />
              <Area
                type="monotone"
                dataKey="savings"
                stroke="#34d399"
                fillOpacity={1}
                fill="url(#colorSavings)"
                name="Savings (₹)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Download Report */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="flex flex-col items-center text-center space-y-6 pt-10"
      >
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-amber-400" />
          <h3 className="text-2xl font-semibold text-amber-300">Download Full Report</h3>
        </div>
        <p className="text-gray-400 max-w-lg">
          Download a detailed report summarizing your RWH feasibility, cost analysis, and environmental insights.
        </p>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-8 py-3 rounded-lg bg-amber-400 text-black font-semibold hover:bg-amber-300 transition-transform transform hover:scale-105"
        >
          <Download className="w-5 h-5" />
          Download Report
        </button>
      </motion.div>
    </section>
  );
}
