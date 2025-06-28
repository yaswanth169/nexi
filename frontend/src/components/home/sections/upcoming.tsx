"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { ArrowRight, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";
import ProjectCard from "./project-card";

const steps = [
  { label: "Thinking for 5 seconds" },
  { label: "Searched 4 websites" },
  { label: "Processed 1.2M tokens" },
  { label: "Fetching final data..." },
  { label: "✅ Fetch Successful" },
  { label: "Generating UI blocks..." },
  { label: "Rendering upcoming projects..." },
];

export default function UpcomingSection() {
  const [activeStep, setActiveStep] = useState(-1);
  const [showProjects, setShowProjects] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  useEffect(() => {
    if (inView && activeStep === -1) {
      let i = 0;
      const stepInterval = setInterval(() => {
        setActiveStep(i);
        i++;
        if (i === steps.length) {
          clearInterval(stepInterval);
          setTimeout(() => setShowProjects(true), 1000);
        }
      }, 1200);
    }
  }, [inView, activeStep]);

  return (
    <section id="upcoming" ref={ref} className="w-full text-white py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        {/* Left Content */}
        <div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Deep dive with future
            <span className="text-[#a18fff] underline underline-offset-4 ml-2">
              NexI Projects
            </span>
          </h2>
          <p className="text-neutral-400 mb-8 text-lg">
            Explore what our agents are building behind the scenes — smarter tools for research, talent discovery, planning, and more.
          </p>
          <Link
            href="https://www.linkedin.com/company/nexi-ai-employee/"
            target="_blank"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white hover:bg-white hover:text-black transition"
          >
            Contact Us <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Right Simulated Status Card */}
        <div className="relative w-full bg-[#0e0e0e] rounded-2xl border border-neutral-800 p-6 shadow-xl min-h-[320px] overflow-hidden">
          <div className="space-y-4 relative z-10" aria-live="polite">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-3 transition-all duration-700 ease-out ${
                  idx <= activeStep ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
                }`}
              >
                {idx < activeStep ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : idx === activeStep ? (
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                ) : (
                  <div className="w-5 h-5" />
                )}
                <span
                  className={`text-sm ${
                    idx === activeStep ? "text-white" : "text-neutral-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
          <div className="absolute inset-0 rounded-2xl pointer-events-none animate-border-glow"></div>
        </div>
      </div>

      {showProjects && <ProjectCard />}
    </section>
  );
}
