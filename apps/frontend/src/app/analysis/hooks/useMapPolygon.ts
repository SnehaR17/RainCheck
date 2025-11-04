"use client";
import { useState } from "react";

// Mock polygon area calculation hook
export default function useMapPolygon() {
  const [area, setArea] = useState<number | null>(null);

  // Simulate area calculation after polygon is drawn
  const handlePolygonDraw = (points: any[]) => {
    // Later replace with turf.js for accurate area calculation
    const mockArea = 80 + Math.random() * 20; // random 80–100 m²
    setArea(mockArea);
  };

  return { area, handlePolygonDraw };
}
