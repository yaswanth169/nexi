'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { siteConfig } from '@/lib/home';
import { SectionHeader } from '@/components/home/section-header';
import Marquee from 'react-fast-marquee';

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
    (useCase: UseCase) => useCase.featured
  );

  const [selectedId, setSelectedId] = useState<string>('');
  const selectedUseCase = featuredUseCases.find((u) => u.id === selectedId);

  return (
    <section id="use-cases" className="relative w-full text-white py-16 overflow-hidden bg-grid">
      <div className="relative z-20 max-w-7xl mx-auto px-6">
        <SectionHeader>
          <h2 className="text-4xl sm:text-5xl font-bold text-center bg-gradient-to-r from-white via-[#a18fff] to-white bg-clip-text text-transparent">
            Try a Use Case Demo
          </h2>
          <p className="text-muted-foreground text-center font-medium max-w-2xl mx-auto mt-4">
            Choose a use case from the dropdown and see how NexI handles it
          </p>
        </SectionHeader>

        {/* Form */}
        <div className="mt-10 max-w-2xl mx-auto w-full bg-[#0e0e0e] border border-neutral-800 p-6 rounded-xl shadow-md">
          <label htmlFor="use-case" className="block text-sm font-medium mb-2 text-white">
            Select a use case
          </label>
          <select
            id="use-case"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full p-3 rounded-lg border border-neutral-700 bg-black text-white focus:ring-2 focus:ring-[#a18fff] transition shadow-inner appearance-none hover:bg-[#111] hover:border-[#a18fff]"
          >
            <option value="">-- Select a use case --</option>
            {featuredUseCases.map((useCase) => (
              <option key={useCase.id} value={useCase.id} className="bg-[#111] text-white">
                {useCase.title}
              </option>
            ))}
          </select>
        </div>

        {/* Selected Use Case Highlighted */}
        {selectedUseCase && (
          <div className="mt-12 flex flex-col md:flex-row gap-6 items-start bg-[#0e0e0e] border border-neutral-800 rounded-2xl p-6 shadow-xl transition-all duration-300 animate-fade-in">
            <div className="relative w-full md:w-[280px] h-[180px] rounded-xl overflow-hidden border border-neutral-700">
              <img
                src={selectedUseCase.image}
                alt={selectedUseCase.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f3d88] via-[#0e0e0e44] to-transparent pointer-events-none rounded-xl" />
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-3">
                <div className="rounded-full border border-[#a18fff33] bg-[#a18fff11] p-2">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-[#a18fff]"
                  >
                    {selectedUseCase.icon}
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {selectedUseCase.title}
                </h3>
              </div>
              <p className="text-sm text-neutral-400 leading-relaxed mb-6">
                {selectedUseCase.description}
              </p>
              <div className="flex justify-end">
                <a
                  href={selectedUseCase.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-2 border border-[#a18fff] text-sm font-semibold text-[#a18fff] rounded-full hover:bg-[#a18fff11] transition-all duration-200"
                >
                  <ArrowRight className="mr-2 size-4" />
                  Watch Full Video
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Marquee Carousel */}
        <div className="relative mt-20">
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#0e0e0e] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#0e0e0e] to-transparent z-10" />
          <Marquee gradient={false} speed={30} pauseOnHover className="min-h-[120px]">
            {featuredUseCases
              .filter((u) => u.id !== selectedId)
              .map((useCase) => (
                <div
                  key={useCase.id}
                  className="min-w-[320px] max-w-[320px] h-[120px] mx-3 rounded-xl border border-neutral-800 bg-[#0e0e0e] p-4 shadow-sm hover:shadow-md transition flex items-center"
                >
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
                    <div>
                      <h4 className="text-base font-semibold text-white">
                        {useCase.title}
                      </h4>
                      <p className="text-xs text-neutral-400 leading-tight mt-1 line-clamp-3">
                        {useCase.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </Marquee>
        </div>
      </div>

      <style jsx>{`
        .bg-grid {
          background-image: radial-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 30px 30px;
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}