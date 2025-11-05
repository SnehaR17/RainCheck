"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
const MapWithPolygon = dynamic(() => import("../ui/MapWithPolygon"), {
  ssr: false, 
});
import RainfallDataCard from "../ui/RainfallDataCard";
import { mockRainfallData } from "../mock/mockRainfallData";

export default function LocationAndMapSection() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(coords);
        setPermissionGranted(true);
        setLoading(false);
      },
      (err) => {
        console.error("Location error:", err);
        setError("Unable to retrieve your location. Showing mock data.");
        setPermissionGranted(false);
        setLoading(false);
      }
    );
  };

  // Automatically check if permission already granted
  useEffect(() => {
    if (navigator.geolocation && navigator.permissions) {
      navigator.permissions
        .query({ name: "geolocation" as PermissionName })
        .then((result) => {
          if (result.state === "granted") {
            setPermissionGranted(true);
            navigator.geolocation.getCurrentPosition((pos) =>
              setUserLocation({
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
              })
            );
          }
        })
        .catch(() => {
          console.warn("Permission API not available");
        });
    }
  }, []);

  return (
    <section id="location" className="space-y-8 px-6 text-gray-300">
      {/* Heading */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-semibold text-amber-400">
          1. Identify Your Location
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm">
          Pin your house or draw a polygon around your rooftop to calculate your catchment area.
          RainCheck automatically fetches rainfall data based on your location — or uses mock data if unavailable.
        </p>
      </div>

      {/* Map + Buttons */}
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex justify-center gap-3">
          <button
            onClick={handleUseMyLocation}
            className="px-4 py-2 rounded-md border border-amber-400 text-amber-400 text-sm hover:bg-amber-400 hover:text-black transition-colors"
            disabled={loading}
          >
            {loading ? "Locating..." : "Use My Current Location"}
          </button>
          <button className="px-4 py-2 rounded-md border border-cyan-400 text-cyan-400 text-sm hover:bg-cyan-400 hover:text-black transition-colors">
            Draw Roof Area
          </button>
        </div>

        {error && (
          <p className="text-center text-sm text-amber-400">
            {error}
          </p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-lg overflow-hidden border border-gray-800"
        >
          <MapWithPolygon/>
        </motion.div>

        <p className="text-center text-xs text-gray-500">
          You can pan, zoom, or redraw anytime.
        </p>
      </div>

      {/* Rainfall Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="max-w-md mx-auto"
      >
        <RainfallDataCard
          rainfall={mockRainfallData}
          locationGranted={permissionGranted && !!userLocation}
        />
      </motion.div>
    </section>
  );
}
