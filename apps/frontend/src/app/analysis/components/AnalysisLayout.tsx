"use client";

import { motion } from "framer-motion";
import StepperNavigation from "./StepperNavigation";
import LocationAndMapSection from "./LocationAndMapSection";
import ConsumptionDetailsSection from "./ConsumptionDetailsSection";
import AutoInsightsSection from "./AutoInsightsSection";
import ResultsSection from "./ResultsSection";

export default function AnalysisLayout() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0A0A0C] via-[#101316] to-[#1A0F06] text-gray-100">
      {/* Soft animated gradient glow */}
      <div className="absolute inset-0">
        <div className="absolute top-[-10rem] left-[10%] w-[30rem] h-[30rem] bg-amber-500/10 blur-[140px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-12rem] right-[5%] w-[35rem] h-[35rem] bg-emerald-500/10 blur-[160px] rounded-full animate-pulse" />
      </div>

      {/* Subtle overlay grid for depth */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.05]" />

      <div className="relative z-10 max-w-6xl mx-auto py-16 px-6 space-y-20">
        {/* Header */}
        <motion.div
  initial={{ opacity: 0, y: -15 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
  className="text-center space-y-3"
>
  <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-transparent bg-gradient-to-r from-emerald-400 to-amber-300 bg-clip-text">
    RainCheck Analysis
  </h1>
  <p className="text-gray-400 text-sm md:text-base font-light max-w-lg mx-auto leading-relaxed">
    Intelligent insights for better water resource management
  </p>
</motion.div>


        {/* Sections */}
        <div className="space-y-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <StepperNavigation />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <LocationAndMapSection />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <ConsumptionDetailsSection />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <AutoInsightsSection />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <ResultsSection />
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1.2 }}
          className="text-center text-sm text-gray-500 pt-10 border-t border-white/5"
        >
          © {new Date().getFullYear()} RainCheck • Empowering smarter water insights
        </motion.footer>
      </div>
    </main>
  );
}

/* Tailwind keyframes for smooth animated gradient text */
const style = `
@keyframes gradient {
  0% { background-position: 0% 50% }
  50% { background-position: 100% 50% }
  100% { background-position: 0% 50% }
}
.animate-gradient {
  animation: gradient 8s ease infinite;
}
`;
if (typeof document !== "undefined") {
  const s = document.createElement("style");
  s.textContent = style;
  document.head.appendChild(s);
}
