"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { CheckCircle2, Clock, Wrench } from "lucide-react";

const defaultSteps = [
  { title: "Site Inspection & Load Check", desc: "Evaluate roof capacity and water flow feasibility." },
  { title: "Tank Procurement", desc: "Order and deliver the recommended tank based on site data." },
  { title: "Filtration & First-Flush Installation", desc: "Install pre-filtration and debris removal systems." },
  { title: "Piping & Overflow/Recharge Setup", desc: "Connect inflow, overflow, and recharge systems." },
  { title: "Testing & Commissioning", desc: "Run test flow and finalize connections for operation." },
];

// Local types for the timeline items
interface TimelineStep {
  title?: string;
  step?: string;
  desc: string;
}

export default function TimelineAndTasksBoard({ plan }: { plan?: any }) {
  const steps = plan?.timeline || defaultSteps;
  const [completed, setCompleted] = useState<number>(0);

  const handleProgress = (idx: number) => setCompleted(idx + 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 rounded-2xl bg-[#0F1412]/60 backdrop-blur-md border border-white/10 shadow-[0_0_25px_rgba(16,185,129,0.05)] hover:shadow-[0_0_25px_rgba(245,158,11,0.1)] transition-all duration-500 font-[Geist] text-gray-100"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Wrench className="h-5 w-5 text-amber-400" />
        <h3 className="text-lg sm:text-xl font-medium bg-gradient-to-r from-amber-300 to-emerald-300 bg-clip-text text-transparent">
          Installation Roadmap
        </h3>
      </div>

      {/* Timeline */}
      <div className="relative border-l border-white/10 pl-5 space-y-6">
        {steps.map((step: TimelineStep, idx: number) => {
          const isDone: boolean = idx < completed;
          const isActive: boolean = idx === completed;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => handleProgress(idx)}
              className="relative cursor-pointer group transition-all"
            >
              {/* Connector Dot */}
              <div
                className={`absolute -left-[11px] top-1.5 w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                  isDone
                    ? "bg-emerald-400 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    : isActive
                    ? "bg-amber-400 border-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.4)]"
                    : "border-gray-600 bg-[#0B0E0C]"
                }`}
              ></div>

              {/* Step Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`rounded-xl p-4 border transition-all duration-300 backdrop-blur-md ${
                  isDone
                    ? "bg-emerald-500/15 border-emerald-400/40"
                    : isActive
                    ? "bg-amber-500/10 border-amber-400/40"
                    : "bg-[#0B0E0C]/60 border-white/10 hover:border-amber-300/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p
                    className={`font-medium ${
                      isDone
                        ? "text-emerald-300 line-through"
                        : isActive
                        ? "text-amber-300"
                        : "text-gray-200"
                    }`}
                  >
                    {step.title || step.step}
                  </p>
                  {isDone ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  ) : isActive ? (
                    <Clock className="h-5 w-5 text-amber-300 animate-pulse" />
                  ) : null}
                </div>
                <p className="text-sm text-gray-400 mt-1">{step.desc}</p>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-xs text-gray-500">
        Tap on a step to mark progress and visualize your installation journey.
      </div>
    </motion.div>
  );
}
