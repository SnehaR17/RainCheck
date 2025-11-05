"use client";

export default function DownloadPlanPDF({ plan, preferences, analysis }: { plan?: any, preferences?: any, analysis?: any }) {
  function handleDownload() {
    // placeholder - integrate with your PdfReportGenerator
    alert("Download plan (mock). Integrate real PDF generator in services.");
  }

  return (
    <button onClick={handleDownload} className="px-4 py-2 rounded bg-amber-400 text-black font-semibold">
      Download Plan (PDF)
    </button>
  );
}
