'use client';

import React, { useState } from 'react';
import { useApp } from '../lib/AppContext';
import { JuriciousLogo } from './JuriciousLogo';

export function Hero() {
  const { openWaitlistModal, openDiaryDemo } = useApp();
  const [inlineEmail, setInlineEmail] = useState('');
  const [inlineError, setInlineError] = useState('');

  const handleInlineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inlineEmail.trim()) {
      setInlineError('Enter your email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inlineEmail.trim())) {
      setInlineError('Enter a valid email address.');
      return;
    }
    setInlineError('');
    openWaitlistModal(undefined, 'Hero inline email input');
  };

  return (
    <section id="hero" className="w-full bg-[#0A0A0A] py-16 lg:py-24 border-b border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline and Pitch */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            {/* Full Logo — real brand image */}
            <div className="mb-2">
              {/* <JuriciousLogo variant="full" theme="dark" size="lg" /> */}
            </div>

            {/* Pill & Nepali Tagline */}
            <div className="inline-flex flex-wrap items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#1A1A1A] border border-[#262626]">
              <span className="text-xs font-medium text-[#A3A3A3]">
                Web & Mobile Legal OS · Dedicated Apps
              </span>
              <span className="text-xs font-semibold text-[#FF9933] font-devanagari px-2 py-0.5 rounded bg-[#262626]">
                तारेख नछुटोस्
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white font-normal tracking-tight leading-[1.12]">
              Your chambers, on one calendar.{' '}
              <span className="italic block mt-1 text-[#FF9933]">In Bikram Sambat.</span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-[#A3A3A3] max-w-2xl leading-relaxed">
              Juricious brings your court diary, client files, tareekh alerts and fees onto both a
              high-performance <strong className="text-white font-medium">Desktop Web Command Center</strong> and <strong className="text-white font-medium">Native Mobile Apps (iOS & Android)</strong>.
              Not just a browser bookmark or basic PWA—purpose-engineered for Nepali chambers, in-court speed, and zero connectivity.
            </p>

            {/* Inline waitlist form */}
            <form onSubmit={handleInlineSubmit} className="w-full max-w-md space-y-2 pt-2">
              <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                <div className="relative flex-1">
                  <input
                    type="email"
                    value={inlineEmail}
                    onChange={(e) => {
                      setInlineEmail(e.target.value);
                      if (inlineError) setInlineError('');
                    }}
                    placeholder="Enter your email address"
                    aria-label="Email address for waitlist"
                    className="w-full h-12 min-h-[48px] px-4 rounded-md bg-[#1A1A1A] border border-[#333333] text-white placeholder-[#737373] text-sm focus:outline-none focus:border-[#FF9933] transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="h-12 min-h-[48px] px-6 rounded-md bg-[#FF9933] text-black font-semibold text-sm hover:bg-[#ffa94d] active:bg-[#e68524] transition-colors whitespace-nowrap cursor-pointer flex items-center justify-center shadow-sm"
                >
                  Join the waitlist
                </button>
              </div>
              {inlineError && (
                <p className="text-xs text-[#E5484D] font-medium pl-1 flex items-center gap-1">
                  <span>●</span> {inlineError}
                </p>
              )}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-[#737373] pl-1">
                <span>Opens full chambers waitlist form. No spam, ever.</span>
                <a
                  href="#platforms"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('platforms')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-[#FF9933] hover:underline flex items-center gap-1 font-medium"
                >
                  <span>See Web & Mobile Apps</span>
                  <span>↓</span>
                </a>
              </div>
            </form>
          </div>

          {/* Right Column: White "Court Diary" Card */}
          <div className="lg:col-span-5 w-full">
            <div
              onClick={openDiaryDemo}
              className="bg-white rounded-lg p-6 sm:p-7 shadow-2xl border border-[#E5E5E5] text-[#0A0A0A] hover:border-[#0A0A0A] transition-all cursor-pointer group"
              title="Click to open interactive Court Diary demo"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5]">
                <div className="flex items-center gap-3">
                  {/* <JuriciousLogo variant="mark" theme="light" size="sm" /> */}
                  <div>
                    <span className="text-xs font-semibold text-[#5C5C5C] uppercase tracking-wider block">
                      Court diary
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <h2 className="text-2xl font-bold font-devanagari text-[#0A0A0A]">
                        मंसिर २०८३
                      </h2>
                      <span className="text-[11px] font-semibold text-[#0A0A0A] bg-[#F0F0F0] px-2 py-0.5 rounded group-hover:bg-[#FF9933] group-hover:text-black transition-colors">
                        Try Interactive →
                      </span>
                    </div>
                  </div>
                </div>

                {/* Green Synced Pill */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EBF7F0] border border-[#BCE8CD] text-[#2E9E5B] text-xs font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#2E9E5B] animate-pulse"></span>
                  <span>Synced · works offline</span>
                </div>
              </div>

              {/* Three Sample Hearings with large Devanagari dates */}
              <div className="divide-y divide-[#E5E5E5] my-2">
                {/* Hearing 1 */}
                <div className="py-4 flex items-start gap-4">
                  <div className="w-16 flex-shrink-0 text-center bg-[#F7F7F7] border border-[#E5E5E5] rounded p-2">
                    <span className="text-2xl font-bold font-devanagari text-[#0A0A0A] block leading-none">
                      ०४
                    </span>
                    <span className="text-[11px] font-devanagari text-[#5C5C5C] mt-1 block">
                      बिहीबार
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-[#5C5C5C] tracking-wide uppercase">
                        Supreme Court · Bench 3
                      </span>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#F0F0F0] text-[#0A0A0A]">
                        11:30 AM
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-[#0A0A0A] mt-1 truncate">
                      Shrestha v. Dept. of Internal Revenue
                    </h3>
                    <p className="text-xs text-[#5C5C5C] mt-0.5">
                      Final hearing tareekh · Senior Advocate lead argument
                    </p>
                  </div>
                </div>

                {/* Hearing 2 */}
                <div className="py-4 flex items-start gap-4">
                  <div className="w-16 flex-shrink-0 text-center bg-[#F7F7F7] border border-[#E5E5E5] rounded p-2">
                    <span className="text-2xl font-bold font-devanagari text-[#0A0A0A] block leading-none">
                      ०९
                    </span>
                    <span className="text-[11px] font-devanagari text-[#5C5C5C] mt-1 block">
                      मंगलबार
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-[#5C5C5C] tracking-wide uppercase">
                        Patan High Court · Comm. Bench
                      </span>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#F0F0F0] text-[#0A0A0A]">
                        01:15 PM
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-[#0A0A0A] mt-1 truncate">
                      Himalayan Trading Ltd. v. Kumari Bank
                    </h3>
                    <p className="text-xs text-[#5C5C5C] mt-0.5">
                      Interim order extension & Vakalatnama submission
                    </p>
                  </div>
                </div>

                {/* Hearing 3 */}
                <div className="py-4 flex items-start gap-4">
                  <div className="w-16 flex-shrink-0 text-center bg-[#F7F7F7] border border-[#E5E5E5] rounded p-2">
                    <span className="text-2xl font-bold font-devanagari text-[#0A0A0A] block leading-none">
                      १५
                    </span>
                    <span className="text-[11px] font-devanagari text-[#5C5C5C] mt-1 block">
                      आइतबार
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-[#5C5C5C] tracking-wide uppercase">
                        Kathmandu Dist. Court · Bench 7
                      </span>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-[#F0F0F0] text-[#0A0A0A]">
                        10:45 AM
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-[#0A0A0A] mt-1 truncate">
                      Land Partition Suit #2081-CP-0492
                    </h3>
                    <p className="text-xs text-[#5C5C5C] mt-0.5">
                      Witness examination & Tareekh Dastoor deposit
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Footer / Caption */}
              <div className="pt-3 border-t border-[#E5E5E5] flex items-center justify-between text-xs text-[#5C5C5C]">
                <span className="italic">Click to open interactive BS calendar</span>
                <span className="font-mono text-[11px] font-bold text-[#0A0A0A]">
                  Click to Test →
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
