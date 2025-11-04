"use client";

/**
 * Placeholder service for rainfall data API.
 * Replace with IMD, Bhuvan, or OpenWeather API later.
 */

export async function fetchRainfallData(lat: number, lon: number) {
  console.log(`Fetching rainfall data for: ${lat}, ${lon}`);
  // Mock response
  return {
    city: "Mock City",
    annualRainfall: 950 + Math.random() * 100,
    source: "Mock Rainfall API",
  };
}
