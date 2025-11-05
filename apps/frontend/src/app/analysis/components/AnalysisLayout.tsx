"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import StepperNavigation from "./StepperNavigation";
import LocationAndMapSection from "./LocationAndMapSection";
import ConsumptionDetailsSection from "./ConsumptionDetailsSection";
import AutoInsightsSection from "./AutoInsightsSection";
import ResultsSection from "./ResultsSection";
import { FeasibilityProvider, useFeasibility } from "../context/FeasibilityContext";
import { ChevronDown } from "lucide-react";

export default function AnalysisLayout() {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes gradientMove {
        0% { background-position: 0% 50% }
        50% { background-position: 100% 50% }
        100% { background-position: 0% 50% }
      }
      .animate-gradient {
        background-size: 200% auto;
        animation: gradientMove 8s ease infinite;
      }
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(8px); }
      }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  return (
    <FeasibilityProvider>
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0A0A0C] via-[#101316] to-[#1A0F06] text-gray-100">
        {/* === Ambient Gradient Glows === */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-12rem] left-[15%] w-[40rem] h-[40rem] bg-amber-500/10 blur-[180px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-14rem] right-[10%] w-[45rem] h-[45rem] bg-emerald-500/10 blur-[200px] rounded-full animate-pulse" />
        </div>

        {/* === Background Grid === */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10" />

        {/* === Fullscreen Header === */}
        <section className="relative h-screen flex flex-col items-center justify-center text-center space-y-6 px-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-5xl md:text-6xl font-bold tracking-tight text-transparent bg-gradient-to-r from-emerald-400 via-amber-300 to-emerald-400 bg-clip-text animate-gradient drop-shadow-[0_0_15px_rgba(245,158,11,0.2)]"
          >
            RainCheck Analysis
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-gray-400 text-base md:text-lg font-light max-w-xl mx-auto leading-relaxed"
          >
            Intelligent insights for better water resource management — powered by AI,
            data, and sustainability.
          </motion.p>

          {/* Scroll Down Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-10 flex flex-col items-center text-gray-400 text-sm"
          >
            <p className="mb-1">Scroll to begin</p>
            <ChevronDown className="w-5 h-5 text-amber-400 animate-[float_2s_ease-in-out_infinite]" />
          </motion.div>
        </section>

        {/* === Stepper Navigation === */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <StepperNavigation />
        </motion.div>

        {/* === Main Content === */}
        <div className="relative z-10 max-w-6xl mx-auto py-24 px-6 space-y-24">
          <FadeIn delay={0.3}>
            <LocationAndMapSection />
          </FadeIn>

          <FadeIn delay={0.4}>
            <ConsumptionDetailsSection />
          </FadeIn>

          <ConditionalInsights />
        </div>

        {/* === Footer === */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 1 }}
          className="text-center text-sm text-gray-500 pt-10 border-t border-white/5"
        >
          © {new Date().getFullYear()} RainCheck • Empowering smarter water insights
        </motion.footer>
      </main>
    </FeasibilityProvider>
  );
}

/** --- Simple reusable fade-in wrapper --- */
function FadeIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  );
}

/** --- Conditionally show Insights + Results only after report --- */
function ConditionalInsights() {
  const { report, loading } = useFeasibility();

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-gray-400 text-sm mt-10"
      >
        Generating report... please wait ⏳
      </motion.div>
    );
  }

  if (!report) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-gray-500 text-sm italic"
      >
        Generate a feasibility report above to see detailed insights.
      </motion.div>
    );
  }

  // Once report exists, reveal the next two sections
  return (
    <>
      <FadeIn delay={0.5}>
        <AutoInsightsSection />
      </FadeIn>

      <FadeIn delay={0.6}>
        <ResultsSection />
      </FadeIn>
    </>
  );
}
