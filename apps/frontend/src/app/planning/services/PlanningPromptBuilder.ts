/**
 * PlanningPromptBuilder
 * ----------------------
 * Builds a clean, structured prompt for generating a Rainwater Harvesting Implementation Plan.
 *
 * Input: analysis JSON (from feasibility module) + user preferences
 * Output: prompt string (to send to model) + helper mockCallModel for testing
 */

export default class PlanningPromptBuilder {
  /**
   * Builds the model prompt from feasibility data & user preferences.
   */
  static build({
    analysis,
    preferences,
  }: {
    analysis: any;
    preferences: any;
  }): string {
    if (!analysis) throw new Error("Missing analysis data for plan generation.");

    const { budget, goal, maintenance, timeframe } = preferences;

    // Extract key analysis insights
    const roofArea = analysis?.roofArea || "unknown";
    const annualRainfall = analysis?.annualRainfall || "unknown";
    const annualHarvest = analysis?.annualHarvest || "unknown";
    const tankSize = analysis?.tankSize || "unknown";
    const feasibility = analysis?.feasibility || "not specified";
    const savings = analysis?.economicAnalysis?.netSavings10yr || "unknown";
    const rechargePotential =
      analysis?.environmentalImpact?.groundwaterRecharge || "unknown";
    const climateTrend = analysis?.climateTrend?.climateResilience || "unknown";

    // Build the structured prompt
    const prompt = `
You are an expert in sustainable water management and rainwater harvesting systems. 
Your task is to generate a clear, detailed, and actionable **Implementation Plan** 
for a household or small community based on the following data:

### Feasibility Report (Input Data)
- Roof Area: ${roofArea} sq.m
- Annual Rainfall: ${annualRainfall} mm
- Estimated Harvest: ${annualHarvest} L/year
- Recommended Tank Size: ${tankSize} L
- Feasibility Category: ${feasibility}
- Economic Savings (10 years): ${savings}
- Groundwater Recharge Potential: ${rechargePotential}
- Climate Resilience Trend: ${climateTrend}

### User Preferences
- Budget: ${budget}
- Goal: ${goal} water dependency
- Maintenance Style: ${maintenance}
- Implementation Timeframe: ${timeframe}

### Expected Output
Respond ONLY in the following JSON format:

{
  "tank": {
    "recommendedSizeL": number,
    "type": "string",
    "alternatives": ["string"],
    "justification": "string"
  },
  "filtration": {
    "firstFlush": "string",
    "filters": ["string"],
    "notes": "string"
  },
  "cost": {
    "estimatedINR": number,
    "installationINR": number,
    "subsidyINR": number,
    "netCostINR": number
  },
  "subsidies": [
    {
      "scheme": "string",
      "eligible": boolean,
      "docsRequired": ["string"],
      "applyUrl": "string"
    }
  ],
  "vendors": [
    {
      "name": "string",
      "distanceKm": number,
      "specialty": "string"
    }
  ],
  "timeline": [
    {
      "step": "string",
      "durationDays": number,
      "owner": "string"
    }
  ],
  "maintenance": {
    "tasks": ["string"],
    "frequency": "string"
  },
  "meta": {
    "confidence": number,
    "notes": "string"
  }
}

Return **only** valid JSON (no markdown, no explanations).
`;

    return prompt.trim();
  }

  /**
   * Mock function for testing (simulates a model response)
   * Used before real API integration.
   */
  static async mockCallModel(prompt: string) {
    console.log("🔍 Mock model called with prompt:\n", prompt.slice(0, 500) + "...");

    // Simulated delay to mimic LLM processing
    await new Promise((res) => setTimeout(res, 1200));

    // Mock structured output
    const mockPlan = {
      tank: {
        recommendedSizeL: 8000,
        type: "Underground Concrete",
        alternatives: ["HDPE Modular", "FRP"],
        justification:
          "An underground concrete tank offers excellent durability and thermal stability, making it ideal for long-term water storage and minimal evaporation loss in moderate climates.",
      },
      filtration: {
        firstFlush: "3 mm mesh diverter",
        filters: ["Sand filter", "Charcoal filter", "UV purifier (optional)"],
        notes:
          "These filters ensure removal of debris and organic matter before water reaches the storage tank, maintaining water quality for domestic reuse.",
      },
      cost: {
        estimatedINR: 95000,
        installationINR: 15000,
        subsidyINR: 20000,
        netCostINR: 90000,
      },
      subsidies: [
        {
          scheme: "Karnataka Urban RWH Subsidy",
          eligible: true,
          docsRequired: ["Property tax receipt", "Installation bill", "Aadhaar"],
          applyUrl: "https://urbanwaterscheme.karnataka.gov.in",
        },
        {
          scheme: "National Water Mission Incentive",
          eligible: false,
          docsRequired: [],
          applyUrl: "https://nwm.gov.in/incentives",
        },
      ],
      vendors: [
        {
          name: "EcoTank Solutions",
          distanceKm: 5,
          specialty: "RCC & modular tank fabrication and setup",
        },
        {
          name: "RainCatch Systems",
          distanceKm: 8,
          specialty: "Rainwater filtration and plumbing integration",
        },
        {
          name: "Urban Aqua Services",
          distanceKm: 4,
          specialty: "Annual maintenance & inspection service",
        },
      ],
      timeline: [
        { step: "Site survey & design", durationDays: 5, owner: "Vendor" },
        { step: "Material procurement", durationDays: 3, owner: "User" },
        { step: "Tank installation", durationDays: 4, owner: "Vendor" },
        { step: "Filtration system integration", durationDays: 3, owner: "Vendor" },
        { step: "Testing & verification", durationDays: 2, owner: "User" },
      ],
      maintenance: {
        tasks: [
          "Clean filter mesh and replace charcoal every 6 months",
          "Check and clean first-flush diverter every 3 months",
          "Inspect for cracks or blockages annually",
        ],
        frequency: "Every 3–6 months based on usage and rainfall frequency",
      },
      meta: {
        confidence: 0.94,
        notes:
          "Plan optimized for medium budget, partial water dependency goal, and high feasibility category based on local rainfall patterns.",
      },
    };

    console.log("✅ Mock model generated plan successfully.");
    return JSON.stringify(mockPlan, null, 2);
  }
}
