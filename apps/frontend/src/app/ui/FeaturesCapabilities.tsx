"use client";
import { motion } from "framer-motion";
import { Droplets, Brain, Globe2 } from "lucide-react";

export default function FeaturesCapabilities() {
  const categories = [
    {
      icon: <Droplets className="w-10 h-10 text-blue-400" />,
      title: "Core Simulation Features",
      color: "from-blue-600/20 to-transparent",
      items: [
        "Real-time rainfall & hydrology modeling",
        "Household demand estimation",
        "Groundwater recharge calculations",
        "Cost-benefit & subsidy integration",
        "AI-powered feasibility scoring",
      ],
    },
    {
      icon: <Brain className="w-10 h-10 text-purple-400" />,
      title: "Smart Tools",
      color: "from-purple-600/20 to-transparent",
      items: [
        "Auto area estimation from satellite maps",
        "Tank capacity optimization",
        "Monthly rainfall vs. demand charting",
        "Predictive 5-year financial forecasting",
      ],
    },
    {
      icon: <Globe2 className="w-10 h-10 text-green-400" />,
      title: "Sustainability Insights",
      color: "from-green-600/20 to-transparent",
      items: [
        "CO₂ savings estimation",
        "Rainwater utilization ratio",
        "Environmental impact score",
        "City-wide cumulative recharge tracker",
      ],
    },
  ];

  return (
    <section className="w-full py-28 text-gray-300 overflow-hidden">
      {/* Subtle animated gradient background */}
      <motion.div
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="w-full h-full absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black opacity-70"
      />

      {/* Content wrapper */}
      <div className="relative max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-semibold text-white mb-4">
            💡 Features & Capabilities
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
            RainCheck combines simulation, analytics, and AI to deliver precise, actionable insights.
          </p>
        </motion.div>

        {/* Feature Groups */}
        <div className="space-y-24">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              viewport={{ once: true }}
              className="relative group grid md:grid-cols-2 gap-10 items-start"
            >
              {/* Glow behind heading */}
              <motion.div
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className={`absolute -inset-10 bg-gradient-to-b ${cat.color} blur-3xl opacity-40 md:opacity-50`}
              />

              {/* Title */}
              <div className="relative z-10 flex items-center space-x-4">
                {cat.icon}
                <h3 className="text-2xl md:text-3xl font-semibold text-white">
                  {cat.title}
                </h3>
              </div>

              {/* Features */}
              <ul className="relative z-10 space-y-4">
                {cat.items.map((item, j) => (
                  <motion.li
                    key={j}
                    whileHover={{ x: 6, color: "#fff" }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="text-gray-400 flex items-start cursor-default"
                  >
                    <span className="mt-2 mr-3 h-1.5 w-1.5 rounded-full bg-gray-600 group-hover:bg-blue-400 transition-all"></span>
                    <span className="leading-relaxed">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
