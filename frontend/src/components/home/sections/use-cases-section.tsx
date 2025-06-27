'use client';

import { SectionHeader } from '@/components/home/section-header';
import { siteConfig } from '@/lib/home';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
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
  // Get featured use cases from siteConfig and limit to 8
  const featuredUseCases: UseCase[] = (siteConfig.useCases || []).filter(
    (useCase: UseCase) => useCase.featured,
  );

  return (
    <section
      id="use-cases"
      className="flex flex-col items-center justify-center gap-10 pb-10 w-full relative"
    >
      <SectionHeader>
        <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-center text-balance">
          See NexI in action
        </h2>
        <p className="text-muted-foreground text-center text-balance font-medium">
          Explore real-world examples of how NexI completes complex tasks
          autonomously
        </p>
      </SectionHeader>

      <div className="relative w-full h-full px-6 max-w-6xl mx-auto">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {featuredUseCases.map((useCase: UseCase) => (
            <div
              key={useCase.id}
              className="break-inside-avoid bg-accent rounded-2xl overflow-hidden shadow-lg transition-transform hover:-translate-y-1.5 hover:shadow-xl"
            >
              <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-secondary/10 p-2">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-secondary"
                    >
                      {useCase.icon}
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold truncate">{useCase.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {useCase.description}
                </p>
              </div>

              <div className="mt-auto">
                <hr className="border-border dark:border-white/20 m-0" />
                <div className="relative w-full h-[180px] bg-accent/10">
                  <img
                    src={
                      useCase.image ||
                      `https://placehold.co/800x400/f5f5f5/666666?text=NexI+${useCase.title
                        .split(' ')
                        .join('+')}`
                    }
                    alt={`NexI ${useCase.title}`}
                    className="w-full h-full object-cover"
                  />
                  <a
                    href={useCase.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end justify-start p-4 group"
                  >
                    <span className="flex items-center gap-2 text-sm text-white font-medium">
                      Watch replay
                      <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {featuredUseCases.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-muted-foreground">No use cases available yet.</p>
          </div>
        )}
      </div>

    </section>
  );
}
