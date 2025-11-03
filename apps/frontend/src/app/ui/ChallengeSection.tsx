"use client";
import { useState } from "react";
import Particles from "@tsparticles/react";
import { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useEffect } from "react";

export default function ChallengeSection() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [engineReady, setEngineReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setEngineReady(true));
  }, []);

  const challenges = [
    {
      title: "Growing Urban Water Crisis",
      text: "21 Indian cities are projected to face severe water scarcity by 2030, threatening millions of urban lives.",
    },
    {
      title: "Dependence on Groundwater",
      text: "Urban households depend heavily on groundwater and costly private tankers, putting unsustainable pressure on aquifers.",
    },
    {
      title: "Untapped Rainfall Potential",
      text: "Cities like Bengaluru receive enough rainfall to meet up to 70% of annual demand — yet most of it goes unharvested.",
    },
    {
      title: "Barriers to Adoption",
      text: "Lack of awareness, fragmented regulation, and limited feasibility studies prevent widespread implementation of rainwater harvesting.",
    },
  ];

  return (
    <section className="relative py-20 bg-[#0a0f1f] text-gray-200 overflow-hidden">
      <div className="relative max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8">
        {challenges.map((item, i) => (
          <div
            key={i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className="relative p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md hover:bg-white/10 transition overflow-hidden"
          >
            {hovered === i && engineReady && (
              <div className="absolute inset-0 z-0">
                <Particles
                  id={`rain-${i}`}
                  options={{
                    fullScreen: { enable: false },
                    background: { color: "transparent" },
                    particles: {
                      number: { value: 100 },
                      color: { value: "#60a5fa" },
                      shape: { type: "line" },
                      opacity: { value: 0.4 },
                      size: { value: { min: 1, max: 2 } },
                      move: {
                        enable: true,
                        speed: 50,
                        direction: "bottom-right",
                        straight: true,
                        outModes: "out",
                      },
                    },
                  }}
                />
              </div>
            )}
            <div className="relative z-10">
              <h3 className="text-xl font-semibold text-blue-300 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-300 leading-relaxed">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
