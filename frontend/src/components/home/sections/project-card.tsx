"use client";

import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

const projects = [
  {
    title: "Cost AI Optimizer",
    description: "Optimize cloud & compute costs with intelligent AI-driven analytics and recommendations.",
    link: "#",
  },
  {
    title: "AI Model Testing",
    description: "Open-source evaluation and testing for AI & LLM systems — benchmark with transparency. (Upcoming)",
    link: "#",
  },
  {
    title: "NewsGPT",
    description: "Fetch the latest news, trends, and summaries. Chat with real-time headlines using NewsGPT.",
    link: "https://news-gpt-ui.vercel.app/",
  },
];

export default function ProjectCard() {
  const [loadingStates, setLoadingStates] = useState(
    Array(projects.length).fill(true)
  );

  useEffect(() => {
    const timers = projects.map((_, idx) =>
      setTimeout(() => {
        setLoadingStates((prev) => {
          const updated = [...prev];
          updated[idx] = false;
          return updated;
        });
      }, 800 + idx * 300)
    );

    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  return (
    <div className="mt-16 max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6 sm:gap-8">
        {projects.map((project, idx) => (
          <div key={idx} className="card-tilt">
            <div className="card-tilt-inner card-glass p-6 flex flex-col justify-between text-white shadow-lg transition-all">
              {loadingStates[idx] ? (
                <div className="space-y-4">
                  <div className="h-4 w-3/4 rounded animate-shimmer" />
                  <div className="h-3 w-full rounded animate-shimmer" />
                  <div className="mt-4 flex gap-1 items-center">
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                    <span className="text-sm text-neutral-500 ml-2">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-5 animate-fade-in flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-xl font-bold text-white hover:text-[#a18fff] transition">
                      {project.title}
                    </h3>
                    <p className="text-sm text-neutral-400 mt-2">{project.description}</p>
                  </div>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center gap-2 text-sm px-4 py-2 rounded-full border ${
                      project.link === "#"
                        ? "border-neutral-700 text-neutral-500 cursor-not-allowed"
                        : "border-[#a18fff] text-[#a18fff] hover:bg-[#a18fff] hover:text-black"
                    } transition-all`}
                  >
                    {project.link === "#" ? "Coming Soon" : "Visit Site"}
                    {project.link !== "#" && <ArrowRight className="w-4 h-4" />}
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
