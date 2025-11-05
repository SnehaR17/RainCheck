export async function generateRecommendationsWithGemini(data: any): Promise<string[]> {
  const prompt = `
  Analyze this rainwater harvesting feasibility report and provide
  5–7 concise, actionable recommendations:

  Roof Area: ${data.roofArea} m²
  Annual Rainfall: ${data.annualRainfall} mm
  Harvest Potential: ${Math.round(data.annualHarvest)} L/year
  Score: ${data.score} (${data.category})
  Payback Period: ${data.economicAnalysis.paybackPeriod.toFixed(1)} years
  ROI: ${data.economicAnalysis.roi.toFixed(1)}%
  Climate Resilience: ${data.climateTrend.climateResilience.toFixed(1)}%
  CO₂ Saved: ${data.environmentalImpact.co2SavedTons.toFixed(2)} tons/year
  Subsidy Eligible: ${data.economicAnalysis.subsidyEligible ? "Yes" : "No"}

  Output plain bullet points.
  `;

  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-pro:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY!,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  const result = await response.json();
  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  return text
    .split("\n")
    .map((r: string) => r.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean);
}
