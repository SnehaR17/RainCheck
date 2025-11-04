"use client";
import SummaryReport from "../ui/SummaryReport";
import { generateReport } from "../services/PdfReportGenerator";
import { mockFeasibilityData } from "../mock/mockFeasibilityData";

export default function ResultsSection() {
  const handleDownload = () => {
    generateReport(mockFeasibilityData);
    alert("Mock report generated! (check console)");
  };

  return (
    <section id="results" className="space-y-6">
      <h2 className="text-3xl font-semibold text-amber-400">4. Your Results</h2>
      <SummaryReport data={mockFeasibilityData} />
      <button
        onClick={handleDownload}
        className="px-6 py-3 rounded-lg bg-amber-500 text-black font-semibold hover:bg-amber-400 transition"
      >
        Download My Report
      </button>
    </section>
  );
}
