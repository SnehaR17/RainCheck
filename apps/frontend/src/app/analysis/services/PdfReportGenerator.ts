"use client";

/**
 * Mock PDF generator.
 * Replace later with jsPDF or server-side PDF rendering.
 */
export async function generateReport(data: any) {
  console.log("Generating mock PDF report for:", data);

  // Mock delay
  await new Promise((r) => setTimeout(r, 1500));

  // Create a mock download
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "RainCheck_Report_Mock.json";
  link.click();
}
