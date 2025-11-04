"use client";

import { motion } from "framer-motion";
import { Droplets, MapPin, CloudRain } from "lucide-react";

interface Rainfall {
  city?: string;
  source?: string;
  annualRainfall?: number;
  lastYear?: number;
}

interface RainfallDataCardProps {
  rainfall: Rainfall | null;
  locationGranted: boolean;
}

export default function RainfallDataCard({ rainfall, locationGranted }: RainfallDataCardProps) {
  const isMock = !locationGranted;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative rounded-2xl border border-amber-400/10 bg-gradient-to-br from-[#0D0D0F] via-[#13161A] to-[#1A1F23] p-6 shadow-[0_0_20px_-5px_rgba(255,193,7,0.15)] text-gray-200 overflow-hidden"
    >
      {/* Soft glowing backdrop */}
      <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 via-transparent to-transparent rounded-2xl pointer-events-none" />

      <div className="relative z-10 space-y-5 text-center">
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="flex items-center justify-center gap-2 text-2xl font-semibold text-amber-400">
            <Droplets className="w-5 h-5 text-amber-400" /> Rainfall Insights
          </h3>
          {isMock && (
            <p className="text-xs text-gray-500 italic mt-1">
              Showing mock data — location access not granted
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-2 gap-5 pt-2">
          <InfoBlock label="City" value={rainfall?.city || "N/A"} icon={<MapPin className="w-4 h-4 text-amber-400" />} />
          <InfoBlock label="Source" value={rainfall?.source || "N/A"} icon={<CloudRain className="w-4 h-4 text-amber-400" />} />
          <InfoBlock label="Annual Avg" value={rainfall?.annualRainfall ? `${rainfall.annualRainfall} mm` : "—"} />
          <InfoBlock label="Last Month" value={rainfall?.lastYear ? `${rainfall.lastYear} mm` : "—"} />
        </div>

        <p className="text-xs text-gray-500 italic border-t border-gray-800 pt-3">
          Based on regional meteorological averages.
        </p>
      </div>
    </motion.div>
  );
}

function InfoBlock({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="rounded-lg bg-[#1A1F23]/60 p-3 border border-amber-400/5 hover:border-amber-400/20 transition-colors"
    >
      <p className="text-gray-400 text-sm flex items-center justify-center gap-1">
        {icon}
        {label}
      </p>
      <p className="font-medium text-gray-100 mt-1">{value}</p>
    </motion.div>
  );
}
