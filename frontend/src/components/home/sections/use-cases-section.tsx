'use client';

import { SectionHeader } from '@/components/home/section-header';
import { siteConfig } from '@/lib/home';
import { ArrowRight } from 'lucide-react';

interface UseCase {
  id: string;
  title: string;
  description: string;
  category: string;
  featured: boolean;
  icon: React.ReactNode;
  image: string;
  url: string;
}

export function UseCasesSection() {
  const featuredUseCases: UseCase[] = (siteConfig.useCases || []).filter(
    (useCase: UseCase) => useCase.featured,
  );

  return (
    <section id="use-cases" className="relative w-full text-white py-16 overflow-hidden bg-grid">
      <div className="relative z-20 max-w-7xl mx-auto px-6">
        <SectionHeader>
          <h2 className="text-4xl sm:text-5xl font-bold text-center bg-gradient-to-r from-white via-[#a18fff] to-white bg-clip-text text-transparent">
            See NexI in action
          </h2>
          <p className="text-muted-foreground text-center text-balance font-medium max-w-2xl mx-auto mt-4">
            Explore real-world examples of how NexI completes complex tasks autonomously
          </p>
        </SectionHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-16">
          {featuredUseCases.map((useCase) => (
            <div
              key={useCase.id}
              className="group relative rounded-2xl overflow-hidden border border-neutral-800 bg-black/40 backdrop-blur-md shadow-[0_0_12px_#00000033] hover:shadow-[0_0_24px_#a18fff55] hover:border-[#a18fff] transition-all"
            >
              {/* Image Top */}
              <div className="relative rounded-t-xl overflow-hidden border-b border-white/5 shadow-inner">
                <img
                  src={
                    useCase.image ||
                    `https://placehold.co/800x400/f5f5f5/666666?text=NexI+${useCase.title.split(' ').join('+')}`
                  }
                  alt={`NexI ${useCase.title}`}
                  className="w-full h-[180px] object-cover"
                />
                <a
                  href={useCase.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-start p-4"
                >
                  <span className="flex items-center gap-2 text-sm text-white font-medium">
                    Watch replay
                    <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </a>
              </div>

              {/* Card Content */}
              <div className="flex flex-col gap-4 p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-full border border-[#a18fff33] bg-[#a18fff11] p-2">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-[#a18fff]"
                    >
                      {useCase.icon}
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-[#a18fff] transition truncate">
                    {useCase.title}
                  </h3>
                </div>

                <p className="text-sm text-neutral-400 leading-relaxed">
                  {useCase.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {featuredUseCases.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center">
            <p className="text-muted-foreground">No use cases available yet.</p>
          </div>
        )}
      </div>

      {/* Optional purple grid background */}
      <style jsx>{`
        .bg-grid {
          background-image: radial-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 30px 30px;
        }
      `}</style>
    </section>
  );
}
