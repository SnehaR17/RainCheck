"use client";

import { motion } from "framer-motion";

export default function StepperNavigation() {
  const steps = ["Location", "Roof & Water", "Insights", "Results"];
  const activeStep = 0; // You can change this dynamically later

  return (
    <section className="text-gray-300">
      <div className="text-center mb-8">
      </div>

      <div className="flex justify-center items-center gap-8">
        {steps.map((step, index) => {
          const isActive = index === activeStep;

          return (
            <motion.div
              key={index}
              className="flex flex-col items-center cursor-pointer "
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full border ${
                  isActive
                    ? "border-amber-400 text-amber-400"
                    : "border-gray-700 text-gray-500"
                }`}
              >
                {index + 1}
              </div>
              <span
                className={`mt-2 text-xs ${
                  isActive ? "text-amber-400" : "text-gray-500"
                }`}
              >
                {step}
              </span>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
