"use client";
import { useEffect, useState } from "react";
import { mockRainfallData } from "../mock/mockRainfallData";

export default function useMockRainfallData(lat?: number, lon?: number) {
  const [rainfall, setRainfall] = useState(mockRainfallData);

  useEffect(() => {
    // Simulate rainfall data fetching delay
    const timer = setTimeout(() => {
      setRainfall({
        ...mockRainfallData,
        city: lat ? "Detected Location (Mock)" : "Bengaluru",
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [lat, lon]);

  return rainfall;
}
