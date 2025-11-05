/**
 * ModelPlanParser
 * ----------------------
 * Safely parses and validates the model's response from the Planning module.
 * Handles partial or malformed JSON gracefully.
 *
 * Input: raw text from LLM (string)
 * Output: structured plan object (parsed + normalized)
 */

export default class ModelPlanParser {
  /**
   * Parse the raw model output into a usable JS object.
   */
  static parse(raw: string): any {
    if (!raw || typeof raw !== "string") {
      console.warn("⚠️ Empty or invalid model response");
      return this.emptyPlan();
    }

    try {
      // 🧹 Step 1: Clean potential wrappers (like ```json ... ``` or markdown)
      let cleaned = raw
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .replace(/\\n/g, "\n")
        .trim();

      // 🧠 Step 2: Try parsing as JSON
      const parsed = JSON.parse(cleaned);

      // ✅ Step 3: Validate critical fields
      const safe = this.normalize(parsed);
      return safe;
    } catch (err) {
      console.error("❌ Failed to parse plan JSON:", err);

      // 🧩 Try fallback cleanup (in case JSON is partial)
      try {
        const start = raw.indexOf("{");
        const end = raw.lastIndexOf("}");
        if (start !== -1 && end !== -1) {
          const maybeJSON = raw.slice(start, end + 1);
          const parsed = JSON.parse(maybeJSON);
          return this.normalize(parsed);
        }
      } catch {
        console.warn("⚠️ Fallback parsing failed, returning empty plan");
      }

      return this.emptyPlan();
    }
  }

  /**
   * Normalizes structure to ensure all expected keys exist,
   * even if the model output was incomplete.
   */
  static normalize(data: any) {
  const defaultTimeline = [
    { title: "Site Inspection & Load Check", desc: "Evaluate roof capacity and water flow feasibility." },
    { title: "Tank Procurement", desc: "Order and deliver the recommended tank based on site data." },
    { title: "Filtration & First-Flush Installation", desc: "Install pre-filtration and debris removal systems." },
    { title: "Piping & Overflow/Recharge Setup", desc: "Connect inflow, overflow, and recharge systems." },
    { title: "Testing & Commissioning", desc: "Run test flow and finalize connections for operation." },
  ];

  return {
    tank: {
      recommendedSizeL: data?.tank?.recommendedSizeL ?? 0,
      type: data?.tank?.type ?? "Not specified",
      alternatives: data?.tank?.alternatives ?? [],
      justification: data?.tank?.justification ?? "No justification provided.",
    },
    filtration: {
      firstFlush: data?.filtration?.firstFlush ?? "Not provided",
      filters: data?.filtration?.filters ?? [],
      notes: data?.filtration?.notes ?? "",
    },
    cost: {
      estimatedINR: data?.cost?.estimatedINR ?? 0,
      installationINR: data?.cost?.installationINR ?? 0,
      subsidyINR: data?.cost?.subsidyINR ?? 0,
      netCostINR: data?.cost?.netCostINR ?? 0,
    },
    subsidies: Array.isArray(data?.subsidies) ? data.subsidies : [],
    vendors: Array.isArray(data?.vendors) ? data.vendors : [],
    
    // 🧩 FIX: Always return a timeline — fallback if missing
    timeline:
      Array.isArray(data?.timeline) && data.timeline.length > 0
        ? data.timeline
        : defaultTimeline,

    maintenance: {
      tasks: data?.maintenance?.tasks ?? [],
      frequency: data?.maintenance?.frequency ?? "Not specified",
    },
    meta: {
      confidence: data?.meta?.confidence ?? 0,
      notes: data?.meta?.notes ?? "No notes available.",
    },
  };
}


  /**
   * Returns a fully empty plan structure (used as fallback).
   */
  static emptyPlan() {
    return {
      tank: {
        recommendedSizeL: 0,
        type: "Unknown",
        alternatives: [],
        justification: "No data available.",
      },
      filtration: {
        firstFlush: "",
        filters: [],
        notes: "",
      },
      cost: {
        estimatedINR: 0,
        installationINR: 0,
        subsidyINR: 0,
        netCostINR: 0,
      },
      subsidies: [],
      vendors: [],
      timeline: [],
      maintenance: {
        tasks: [],
        frequency: "Not specified",
      },
      meta: {
        confidence: 0,
        notes: "Plan could not be generated.",
      },
    };
  }
}
