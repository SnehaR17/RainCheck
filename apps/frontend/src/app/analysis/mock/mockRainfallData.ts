export interface RainfallData {
  city: string;               // City name
  source: string;             // Data source (e.g., IMD, NASA, etc.)
  annualRainfall: number;     // mm/year - current year
  lastYear: number;           // mm/year - previous year
  fiveYearAvg: number;        // mm/year - 5-year rolling average
  monthly: { month: string; rainfall: number }[]; // monthly breakdown
}

export const mockRainfallData: RainfallData = {
  city: "Bengaluru",
  source: "IMD (Mock Data)",
  annualRainfall: 970, // current average
  lastYear: 890,       // previous monsoon slightly below average
  fiveYearAvg: 935,    // stable trend
  monthly: [
    { month: "Jan", rainfall: 2 },
    { month: "Feb", rainfall: 5 },
    { month: "Mar", rainfall: 18 },
    { month: "Apr", rainfall: 62 },
    { month: "May", rainfall: 110 },
    { month: "Jun", rainfall: 150 },
    { month: "Jul", rainfall: 180 },
    { month: "Aug", rainfall: 165 },
    { month: "Sep", rainfall: 155 },
    { month: "Oct", rainfall: 80 },
    { month: "Nov", rainfall: 25 },
    { month: "Dec", rainfall: 8 },
  ],
};
