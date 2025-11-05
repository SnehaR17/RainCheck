"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function StepperNavigation() {
  const steps = [
    { label: "Location", id: "location" },
    { label: "Roof & Water", id: "consumption" },
    { label: "Insights", id: "insights" },
    { label: "Results", id: "results" },
  ];

  const [active, setActive] = useState<string>("location");

  // --- Track visible section ---
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + window.innerHeight / 3;
      for (const step of steps) {
        const section = document.getElementById(step.id);
        if (section) {
          const { offsetTop, offsetHeight } = section;
          if (scrollY >= offsetTop && scrollY < offsetTop + offsetHeight) {
            setActive(step.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- Smooth scroll with offset (fix header overlap) ---
  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    const headerOffset = 100; // offset so section isn’t hidden behind header
    const elementPosition = el.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });

    setActive(id);
  };

  return (
    <nav
      className="
        fixed top-5 left-1/2 -translate-x-1/2 z-50 
        flex items-center gap-2 sm:gap-4
        bg-[#0E0E10]/80 backdrop-blur-md
        border border-amber-400/10 rounded-full
        px-4 sm:px-6 py-2
        shadow-[0_0_25px_rgba(245,158,11,0.08)]
        transition-all duration-500
      "
    >
      {steps.map((step) => (
        <button
          key={step.id}
          onClick={() => handleClick(step.id)}
          className={`
            relative text-xs sm:text-sm font-medium px-2 sm:px-3 py-1
            transition-all duration-300 
            ${
              active === step.id
                ? "text-amber-300 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]"
                : "text-gray-400 hover:text-gray-200"
            }
          `}
        >
          {step.label}
          {active === step.id && (
            <motion.div
              layoutId="stepIndicator"
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-amber-400 rounded-full shadow-[0_0_6px_rgba(245,158,11,0.6)]"
              transition={{ type: "spring", stiffness: 350, damping: 22 }}
            />
          )}
        </button>
      ))}
    </nav>
  );
}
