"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LatLng {
  lat: number;
  lng: number;
}

export default function MapInner({
  userLocation,
  polygon,
  setPolygon,
  drawing,
  handleUseMyLocation,
  handleReset,
  area,
}: any) {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });

  function LocationMarker({ location }: { location: LatLng | null }) {
    const map = useMap();
    useEffect(() => {
      if (location) {
        map.setView([location.lat, location.lng], 20);
      }
    }, [location]);
    return location ? <Marker position={[location.lat, location.lng]} /> : null;
  }

  function MapClickHandler() {
    useMapEvents({
      click(e) {
        if (drawing) {
          setPolygon((prev: LatLng[]) => [
            ...prev,
            { lat: e.latlng.lat, lng: e.latlng.lng },
          ]);
        }
      },
    });
    return null;
  }

  return (
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
            positions={polygon.map((p: LatLng) => [p.lat, p.lng])}
            pathOptions={{
              color: "#22d3ee",
              fillColor: "#22d3ee",
              fillOpacity: 0.2,
            }}
          />
        )}
      </MapContainer>

      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
        <button
          onClick={handleUseMyLocation}
          className="px-3 py-1.5 text-xs sm:text-sm rounded-md bg-black/60 border border-amber-400/40 text-amber-300 hover:bg-amber-400 hover:text-black transition-all"
        >
          Use My Location
        </button>
        <button
          onClick={handleReset}
          className="px-3 py-1.5 text-xs sm:text-sm rounded-md bg-black/60 border border-gray-600 text-gray-400 hover:bg-gray-600 hover:text-white transition-all"
        >
          Reset
        </button>
      </div>

      {/* Live Area */}
      {area > 0 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black/70 border border-amber-400/30 text-amber-300 text-sm px-4 py-1.5 rounded-full backdrop-blur-md z-[1000]">
          Roof Area: {area.toFixed(1)} m²
        </div>
      )}
    </div>
  );
}
