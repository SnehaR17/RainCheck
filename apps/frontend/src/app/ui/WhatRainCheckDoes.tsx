"use client";
import { MapPin, Home, CloudRain, BarChart3 } from "lucide-react";

export default function WhatRainCheckDoes() {
  const steps = [
    {
      icon: <MapPin className="w-8 h-8 text-blue-400" />,
      title: "Detect Location",
      desc: "Fetch city, rainfall, and soil data automatically — or let users pick their location.",
    },
    {
      icon: <Home className="w-8 h-8 text-blue-400" />,
      title: "Input Your Details",
      desc: "Enter roof area, slope, family size, and water source for accurate simulation.",
    },
    {
      icon: <CloudRain className="w-8 h-8 text-blue-400" />,
      title: "Simulate Harvesting",
      desc: "Calculate feasible storage, demand coverage, recharge potential, and ROI.",
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-blue-400" />,
      title: "View Smart Insights",
      desc: "Explore savings, coverage, and impact through charts and downloadable reports.",
    },
  ];

  return (
    <section className="relative text-gray-300">
      <div className="">
        {/* Heading */}
        
        <p
          className="my-4 mb-10"
        >
            From data to insight — RainCheck simplifies rainwater harvesting into four intuitive steps.
        </p>
        

        {/* Steps */}
        <div className="grid md:grid-cols-2 gap-12">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex items-start space-x-6 border-l border-gray-800 pl-6 hover:border-blue-500 transition-colors duration-300"
            >
              <div className="mt-1">{step.icon}</div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
