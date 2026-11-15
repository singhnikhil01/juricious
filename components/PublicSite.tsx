'use client';

import React from 'react';
import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { TrustStrip } from './TrustStrip';
import { PlatformShowcase } from './PlatformShowcase';
import { WorkingToday } from './WorkingToday';
import { DayInChambers } from './DayInChambers';
import { BuiltForRealChambers } from './BuiltForRealChambers';
import { ComingSoon } from './ComingSoon';
import { FinalCTA } from './FinalCTA';
import { Footer } from './Footer';

export function PublicSite() {
  return (
    <div className="w-full bg-[#0A0A0A] text-white">
      <Navbar />
      <Hero />
      <TrustStrip />
      <PlatformShowcase />
      <WorkingToday />
      <DayInChambers />
      <BuiltForRealChambers />
      <ComingSoon />
      <FinalCTA />
      <Footer />
    </div>
  );
}
