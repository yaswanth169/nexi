"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
    Brain,
    Eye,
    PenTool,
    FileText,
    Image,
    Search,
} from "lucide-react";

const capabilities = [
    {
        icon: Brain,
        title: "Strategic Analysis",
        description:
            "Assess brand sentiment, investor landscapes, and competitor trends to support smarter business decisions."
    },
    {
        icon: Eye,
        title: "Smart Prospecting",
        description:
            "Discover high-value leads, speakers, or candidates by scraping and filtering data across platforms like LinkedIn and forums."
    },
    {
        icon: PenTool,
        title: "Automated Planning",
        description:
            "Design end-to-end itineraries, corporate retreats, or event schedules based on user input and real-world constraints."
    },
    {
        icon: FileText,
        title: "Data Compilation",
        description:
            "Aggregate complex datasets (e.g., lotteries, SEO, startups) into structured, downloadable spreadsheets or reports."
    },
    {
        icon: Image,
        title: "Research Summarization",
        description:
            "Digest academic papers, perform cross-referenced meta-analyses, and extract key insights with citations."
    },
    {
        icon: Search,
        title: "Web-Scale Intelligence",
        description:
            "Tap into real-time web and social data to inform strategy, sentiment tracking, or market research at scale."
    }
];


export default function CapabilitiesSection() {
    const spotlightRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const spotlight = spotlightRef.current;
            if (!spotlight) return;

            const x = e.clientX;
            const y = e.clientY;
            spotlight.style.background = `radial-gradient(400px at ${x}px ${y}px, rgba(1, 1, 100, 0.3), transparent 60%)`;
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <section id="capabilities" className="relative w-full text-white py-24 overflow-hidden">
            {/* Mouse-follow spotlight */}
            <div
                ref={spotlightRef}
                className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
                style={{ mixBlendMode: "screen" }}
            />

            {/* Giant outlined background heading */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <h1
                    className="text-[20vw] sm:text-[18vw] font-extrabold text-transparent select-none leading-none stroke-text opacity-10"
                    style={{
                        WebkitMaskImage:
                            "linear-gradient(to top, transparent 0%, rgba(0,0,0) 30%, black 70%)",
                        WebkitMaskSize: "100% 100%",
                        WebkitMaskRepeat: "no-repeat",
                    }}
                >
                    CAPABILITIES
                </h1>
            </div>

            <div className="relative z-20 max-w-7xl mx-auto px-6">
                <h2 className="text-4xl sm:text-5xl font-extrabold mb-16 text-center tracking-tight">
                    What NexI Can Do
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {capabilities.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={index}
                                className={cn(
                                    "cursor-pointer group bg-black/50 border border-neutral-800 rounded-2xl p-6 min-h-[220px] shadow-md transition-all duration-300 ease-in-out",
                                    "hover:border-[#a18fff] hover:shadow-[0_0_20px_#a18fff44]"
                                )}
                            >
                                <div className="mb-4">
                                    <Icon className="w-8 h-8 text-white group-hover:text-[#a18fff] group-hover:scale-110 transition-all duration-300" />
                                </div>
                                <div className="text-xl font-semibold mb-2">{item.title}</div>
                                <p className="text-sm text-neutral-400 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Scoped styles */}
            <style jsx>{`
        .stroke-text {
          -webkit-text-stroke: 2px rgba(255, 255, 255, 0.3);
          color: transparent;
        }
      `}</style>
        </section>
    );
}
