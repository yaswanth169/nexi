"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { ArrowRight, Loader2, CheckCircle, Sparkles, Lightbulb, Bot } from "lucide-react";
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
  const [phase, setPhase] = useState<"steps" | "thinking" | "summary">("steps");
  const [thinkingTime, setThinkingTime] = useState(0);
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
          setPhase("thinking");

          // Start "Thinking" phase
          let t = 1;
          const thinkingInterval = setInterval(() => {
            setThinkingTime(t);
            t++;
            if (t > 5) {
              clearInterval(thinkingInterval);
              setPhase("summary");
              setTimeout(() => setShowProjects(true), 1000);
            }
          }, 1000);
        }
      }, 1000);
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

        {/* Right Card: Step ➜ Thinking ➜ Summary */}
        <div className="relative w-full bg-[#0e0e0e] rounded-2xl border border-neutral-800 p-6 shadow-xl min-h-[320px] overflow-hidden glow-inset-strong shine-effect-strong">
          <div className="relative z-10 space-y-4" aria-live="polite">
            {/* STEP PHASE */}
            {phase === "steps" &&
              steps.map((step, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 transition-all duration-700 ease-out ${idx <= activeStep ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
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
                    className={`text-sm ${idx === activeStep ? "text-white" : "text-neutral-400"
                      }`}
                  >
                    {step.label}
                  </span>
                </div>
              ))}

            {/* THINKING PHASE */}
            {phase === "thinking" && (
              <div className="relative w-full p-4 h-70 overflow-hidden rounded-xl border border-neutral-800 bg-black">
                <div className="flex items-center gap-2 text-white text-base font-medium mb-2 z-10 relative">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Summarizing in {thinkingTime} second{thinkingTime !== 1 ? "s" : ""}...
                </div>

                {/* Scrolling background text */}
                <div className="absolute inset-0 opacity-10 overflow-hidden text-[10px] text-white leading-4">
                  <div className="animate-scroll-text-inner space-y-1 px-2">
                    {Array.from({ length: 40 }).map((_, i) => (
                      <p key={i}>
                        One approach is to highlight the diversity of perspectives on the meaning of life. From a philosophical standpoint, existentialists might...
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SUMMARY PHASE */}
            {phase === "summary" && (
              <div className="animate-fade-in transition-opacity duration-1000">
                <div className="flex flex-col items-center text-center space-y-4 rounded-xl p-6 shadow-md max-w-xl mx-auto">
                  <Sparkles className="h-10 w-10 text-[#a18fff]" />

                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Bot className="h-5 w-5 text-white" />
                    AI Projects Are Coming Alive
                  </h3>

                  <p className="text-sm text-neutral-400">
                    Our upcoming projects focus on transforming <strong className="text-white">user research</strong>,{" "}
                    <strong className="text-white">intelligent planning</strong>, and{" "}
                    <strong className="text-white">automated talent discovery</strong> using cutting-edge AI workflows.
                    Stay tuned for smarter, faster experiences crafted by our autonomous agents.
                  </p>

                  <div className="text-[#a18fff]">
                    <Lightbulb className="h-6 w-6 inline-block animate-bounce-slow" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="absolute inset-0 rounded-2xl pointer-events-none animate-border-glow" />
        </div>
      </div>

      {/* Project cards appear after all animations */}
      {showProjects && <ProjectCard />}
    </section>
  );
}
