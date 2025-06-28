'use client';

import { useEffect, useState } from 'react';
import { FooterSection } from '@/components/home/sections/footer-section';
import { HeroSection } from '@/components/home/sections/hero-section';
import { UseCasesSection } from '@/components/home/sections/use-cases-section';
import { ModalProviders } from '@/providers/modal-providers';
import CapabilitiesSection from '@/components/home/sections/capabilities';
import UpcomingSection from '@/components/home/sections/upcoming';

export default function Home() {
  return (
    <>
      <ModalProviders />
      <main className="flex flex-col items-center justify-center min-h-screen w-full">
        <div className="w-full divide-y">
          <HeroSection />
          <UseCasesSection />
          <CapabilitiesSection/>
          <UpcomingSection/>
          <FooterSection />
        </div>
      </main>
    </>
  );
}
