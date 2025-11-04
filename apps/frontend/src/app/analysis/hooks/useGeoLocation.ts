"use client";
import { useEffect, useState } from "react";

export interface LocationData {
  lat: number;
  lon: number;
  city?: string;
  error?: string;
}

export default function useGeoLocation() {
  const [location, setLocation] = useState<LocationData | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation({ lat: 0, lon: 0, error: "Geolocation not supported" });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Geolocation error:", error.message);
        // Mock fallback: Bengaluru
        setLocation({
          lat: 12.9716,
          lon: 77.5946,
          city: "Bengaluru (Mock)",
          error: error.message,
        });
      }
    );
  }, []);

  return location;
}
