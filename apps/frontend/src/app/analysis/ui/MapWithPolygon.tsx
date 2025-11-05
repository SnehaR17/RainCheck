"use client";

import { useEffect, useState, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { motion } from "framer-motion";

// --- Fix default Leaflet marker paths ---
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// --- Types ---
interface LatLng {
  lat: number;
  lng: number;
}

// --- Accurate area calculation (Web Mercator projection) ---
function calculatePolygonArea(polygon: LatLng[]): number {
  if (polygon.length < 3) return 0;
  const R = 6378137;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const points = polygon.map((p) => ({
    x: R * toRad(p.lng),
    y: R * Math.log(Math.tan(Math.PI / 4 + toRad(p.lat) / 2)),
  }));

  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y - points[j].x * points[i].y;
  }
  return Math.abs(area / 2);
}

// --- Marker for user's location ---
function LocationMarker({ location }: { location: LatLng | null }) {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.flyTo([location.lat, location.lng], 19, { duration: 1.2 });
    }
  }, [location]);
  return location ? (
    <Marker position={[location.lat, location.lng]}>
      <Tooltip direction="top" offset={[0, -8]} opacity={1}>
        You are here
      </Tooltip>
    </Marker>
  ) : null;
}

export default function MapWithPolygon() {
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [polygon, setPolygon] = useState<LatLng[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [area, setArea] = useState(0);
  const [manualArea, setManualArea] = useState("");

  // --- Handlers ---
  const handleUseMyLocation = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => alert("Unable to detect location. Please enable GPS.")
    );
  }, []);

  const handleReset = () => {
    setPolygon([]);
    setArea(0);
    setManualArea("");
    setIsDrawing(false);
  };

  const handleManualAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setManualArea(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed)) setArea(parsed);
  };

  // --- Map click handler for drawing polygon ---
  function MapClickHandler() {
    useMapEvents({
      click(e) {
        if (isDrawing) {
          setPolygon((prev) => [...prev, { lat: e.latlng.lat, lng: e.latlng.lng }]);
        }
      },
    });
    return null;
  }

  // --- Auto-update area when polygon changes ---
  useEffect(() => {
    if (polygon.length >= 3) {
      const calculated = calculatePolygonArea(polygon);
      setArea(calculated);
      setManualArea(calculated.toFixed(1));
    }
  }, [polygon]);

  // --- Derived values ---
  const formattedArea =
    area > 10000
      ? `${(area / 10000).toFixed(2)} ha`
      : `${area.toFixed(1)} m²`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative rounded-2xl overflow-hidden border border-amber-500/20 shadow-md bg-[#0B0B0C]"
    >
      {/* Map Section */}
      <div className="relative">
        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={5}
          minZoom={3}
          maxZoom={22}
          className="h-[60vh] w-full grayscale-[0.1] brightness-95 contrast-105 z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            maxZoom={22}
          />
          <MapClickHandler />
          <LocationMarker location={userLocation} />

          {polygon.length > 0 && (
            <Polygon
              positions={polygon.map((p) => [p.lat, p.lng])}
              pathOptions={{
                color: "#22d3ee",
                fillColor: "#22d3ee",
                fillOpacity: 0.25,
                weight: 2,
              }}
            >
              <Tooltip sticky>
                Polygon Points: {polygon.length} <br />
                Area: {formattedArea}
              </Tooltip>
            </Polygon>
          )}
        </MapContainer>

        {/* Floating Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
          <button
            onClick={handleUseMyLocation}
            className="px-3 py-1.5 text-xs sm:text-sm rounded-md bg-black/60 border border-amber-400/40 text-amber-300 hover:bg-amber-400 hover:text-black transition-all"
          >
            Use My Location
          </button>

          <button
            onClick={() => setIsDrawing((prev) => !prev)}
            className={`px-3 py-1.5 text-xs sm:text-sm rounded-md border ${
              isDrawing
                ? "bg-cyan-400 text-black border-cyan-400"
                : "bg-black/60 border-cyan-400/40 text-cyan-300 hover:bg-cyan-400 hover:text-black"
            } transition-all`}
          >
            {isDrawing ? "Drawing..." : "Draw Roof Area"}
          </button>

          <button
            onClick={handleReset}
            className="px-3 py-1.5 text-xs sm:text-sm rounded-md bg-black/60 border border-gray-600 text-gray-400 hover:bg-gray-600 hover:text-white transition-all"
          >
            Reset
          </button>
        </div>

        {/* Floating Area Label */}
        {area > 0 && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black/70 border border-amber-400/30 text-amber-300 text-sm px-4 py-1.5 rounded-full backdrop-blur-md z-[1000]">
            Roof Area: {formattedArea}
          </div>
        )}
      </div>

      {/* Manual Area Input */}
      <div className="px-5 py-4 border-t border-amber-500/10 flex flex-col sm:flex-row items-center justify-center gap-3">
        <label
          htmlFor="manualArea"
          className="text-sm text-gray-300 whitespace-nowrap"
        >
          Enter Roof Area (m²):
        </label>
        <input
          id="manualArea"
          type="number"
          value={manualArea}
          onChange={handleManualAreaChange}
          placeholder="e.g., 120"
          className="w-40 px-3 py-2 rounded-md border border-amber-400/40 bg-black/40 text-amber-400 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400 placeholder-gray-500"
        />
      </div>
    </motion.div>
  );
}
