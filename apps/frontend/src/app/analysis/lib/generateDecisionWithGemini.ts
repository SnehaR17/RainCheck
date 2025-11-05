import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export async function generateDecisionWithGemini(report: any) {
  try {
    // ✅ use a model that actually supports generateContent
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are an expert in rainwater harvesting feasibility analysis.
      Based on this data, provide:
      1. A short feasibility verdict (like "Highly Feasible", "Moderately Feasible", "Low Feasibility").
      2. A short explanation (max 3 sentences) using economic, hydrological, and climate context.

      The data:
      ${JSON.stringify(report, null, 2)}

      Respond ONLY in valid JSON, no markdown or commentary:
      {
        "verdict": "Highly Feasible",
        "message": "Strong rainfall and ROI make this a great candidate for RWH. Minor tank optimization suggested."
      }
    `;

    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();

    // 🧹 clean up Gemini’s JSON output (handles ```json ... ``` fences)
    const cleaned = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .replace(/[\u0000-\u001F]+/g, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.warn("Gemini output was not valid JSON:", cleaned);
      parsed = {
        verdict: "Analysis Incomplete",
        message: "Gemini returned unstructured text. Please re-run the analysis.",
      };
    }

    return parsed;
  } catch (err) {
    console.error("Gemini Decision Error:", err);
    return {
      verdict: "Feasibility Unknown",
      message: "AI could not generate a recommendation at this time.",
    };
  }
}
