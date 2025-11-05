"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CallToAction() {
  const [dots, setDots] = useState<{ x: number; y: number }[]>([]);

  // Generate random positions only on client
  useEffect(() => {
    const generated = Array.from({ length: 10 }, () => ({
      x: Math.random() * 1200,
      y: Math.random() * 600,
    }));
    setDots(generated);
  }, []);

  return (
    <section className="relative flex flex-col items-center justify-center py-20">
      <div className="absolute inset-0 overflow-hidden">
        {dots.map((dot, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-amber-400/20 rounded-full"
            initial={{
              x: dot.x,
              y: dot.y,
              opacity: 0.3,
            }}
            animate={{
              y: [dot.y, dot.y + 15, dot.y],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 5 + i * 0.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <h2 className="text-4xl font-semibold bg-gradient-to-r from-amber-400 to-emerald-400 bg-clip-text text-transparent text-center">
        Ready to Implement Rainwater Harvesting?
      </h2>
      <p className="text-gray-400 mt-4 text-sm max-w-lg text-center">
        Explore your personalized roadmap with cost, vendors, and subsidy insights.
      </p>
      <button className="mt-6 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-emerald-400 text-black font-medium hover:from-amber-300 hover:to-emerald-300 transition-all">
        Get Started
      </button>
    </section>
  );
}
