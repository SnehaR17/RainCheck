"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Droplets, CheckCircle2, Info } from "lucide-react";

const filtrationOptions = [
  {
    name: "First-flush Diverter",
    desc: "Redirects initial dirty rainwater to prevent contaminants entering the tank.",
  },
  {
    name: "Sand & Gravel Filter",
    desc: "Removes suspended particles and sediments before water enters storage.",
  },
  {
    name: "Leaf Screen & Mesh",
    desc: "Filters large debris like leaves and twigs at inlet points.",
  },
  {
    name: "UV / Cartridge Filter (Optional)",
    desc: "Disinfects and purifies water for potable use.",
  },
];

export default function FiltrationSystemSelector({ plan }: { plan?: any }) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelect = (item: string) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_25px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] transition-all duration-500"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Droplets className="h-5 w-5 text-emerald-400" />
          <h4 className="text-lg font-medium bg-gradient-to-r from-emerald-400 to-amber-300 bg-clip-text text-transparent">
            Filtration & Pretreatment
          </h4>
        </div>
        <Info className="h-4 w-4 text-gray-400 hover:text-amber-300 transition-colors cursor-pointer" />
      </div>

      {/* Options */}
      <div className="space-y-3">
        {filtrationOptions.map((item, idx) => {
          const isActive = selected.includes(item.name);
          return (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.01 }}
              onClick={() => toggleSelect(item.name)}
              className={`relative cursor-pointer p-4 rounded-xl border transition-all duration-400 backdrop-blur-md ${
                isActive
                  ? "bg-emerald-500/20 border-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.25)]"
                  : "bg-white/5 border-white/10 hover:border-amber-400/40"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p
                    className={`text-[15px] font-medium ${
                      isActive ? "text-emerald-300" : "text-gray-200"
                    }`}
                  >
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-400 mt-1 leading-snug">
                    {item.desc}
                  </p>
                </div>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <p className="text-xs text-gray-500 mt-5 text-center">
        Select filtration stages based on intended use and water quality goals.
      </p>
    </motion.div>
  );
}
