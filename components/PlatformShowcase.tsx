'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useApp } from '../lib/AppContext';

type PlatformTab = 'dual' | 'web' | 'mobile';

export function PlatformShowcase() {
  const { openWaitlistModal, openDiaryDemo, openSmsDemo } = useApp();
  const [activeTab, setActiveTab] = useState<PlatformTab>('dual');

  return (
    <section id="platforms" className="w-full bg-[#080808] py-20 lg:py-28 border-b border-[#1A1A1A] relative overflow-hidden">
      {/* Subtle luxury ambient backlights */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-[#FF9933]/10 blur-[140px] rounded-full"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 w-[500px] h-[300px] bg-[#FF9933]/5 blur-[120px] rounded-full"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          {/* Exclusive Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141414] border border-[#262626] shadow-inner mb-5">
            <span className="w-2 h-2 rounded-full bg-[#FF9933] animate-pulse" />
            <span className="text-xs font-semibold tracking-wider uppercase text-[#FF9933]">
              Dual-Platform Legal OS
            </span>
            <span className="text-xs text-[#737373]">·</span>
            <span className="text-xs font-devanagari text-[#A3A3A3]">
              वेब तथा मोबाइल एप दुवै
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-white tracking-tight leading-tight">
            We provide both{' '}
            <span className="italic text-[#FF9933]">Web & Native Mobile apps</span>.
            <span className="block text-2xl sm:text-3xl lg:text-4xl text-[#D4D4D4] mt-2 font-sans font-light">
              Not just a browser shortcut or basic PWA.
            </span>
          </h2>

          <p className="mt-5 text-base sm:text-lg text-[#A3A3A3] leading-relaxed max-w-2xl mx-auto">
            Nepali chamber practice requires dual-world speed: deep case analysis and drafting in your office,
            and instant, zero-lag tareekh logging on the Supreme Court or District Court corridor floor.
            Juricious delivers purpose-built native software on both fronts.
          </p>

          {/* Interactive Platform Switcher */}
          <div className="mt-8 flex justify-center w-full px-2">
            <div className="w-full sm:w-auto max-w-full overflow-x-auto scrollbar-none flex sm:inline-flex items-center justify-start sm:justify-center p-1 sm:p-1.5 rounded-xl bg-[#141414] border border-[#262626] shadow-lg gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('dual')}
                className={`flex-1 sm:flex-initial px-2.5 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap ${activeTab === 'dual'
                  ? 'bg-[#FF9933] text-black font-semibold shadow-md'
                  : 'text-[#A3A3A3] hover:text-white hover:bg-[#1F1F1F]'
                  }`}
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>
                  <span className="inline md:hidden">Dual View</span>
                  <span className="hidden md:inline">Dual Platform View</span>
                </span>
                <span className={`hidden lg:inline-block text-[10px] px-1.5 py-0.5 rounded font-mono ${activeTab === 'dual' ? 'bg-black/20 text-black' : 'bg-[#262626] text-[#FF9933]'}`}>
                  Full Ecosystem
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('web')}
                className={`flex-1 sm:flex-initial px-2.5 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap ${activeTab === 'web'
                  ? 'bg-[#FF9933] text-black font-semibold shadow-md'
                  : 'text-[#A3A3A3] hover:text-white hover:bg-[#1F1F1F]'
                  }`}
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span>
                  <span className="inline sm:hidden">Web App</span>
                  <span className="hidden sm:inline">Web Command Center</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('mobile')}
                className={`flex-1 sm:flex-initial px-2.5 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap ${activeTab === 'mobile'
                  ? 'bg-[#FF9933] text-black font-semibold shadow-md'
                  : 'text-[#A3A3A3] hover:text-white hover:bg-[#1F1F1F]'
                  }`}
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span>
                  <span className="inline sm:hidden">Mobile App</span>
                  <span className="hidden sm:inline">Mobile Apps (iOS &amp; Android)</span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Visual Mockup Container */}
        <div className="relative mx-auto rounded-2xl bg-gradient-to-b from-[#17181C] to-[#0E0F12] border border-[#262626] p-3 sm:p-7 lg:p-10 shadow-2xl">
          {/* Top Status Bar of the Showcase Card */}
          <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 pb-4 sm:pb-6 border-b border-[#222329] mb-6 sm:mb-8 text-[11px] sm:text-xs text-[#8E8E93]">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1C1D24] border border-[#2E303B] text-white font-mono text-[10px] sm:text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2E9E5B] animate-ping" />
                <span>Real-Time Bi-Directional Sync</span>
              </span>
              <span className="hidden sm:inline text-[#555]">|</span>
              <span className="hidden md:inline font-devanagari text-[#A3A3A3]">
                वि.सं. २०८३ कार्तिक १३ (च्याम्बर प्रत्यक्ष सक्रिय)
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap text-[10px] sm:text-xs">
              <span className="px-2 py-0.5 rounded bg-[#1C1D24] text-[#A3A3A3] border border-[#2E303B]">
                <span className="sm:hidden">Web · Mobile</span>
                <span className="hidden sm:inline">Desktop · iPad · iPhone · Android</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-[#FF9933]/10 text-[#FF9933] font-medium border border-[#FF9933]/20">
                Offline-First
              </span>
            </div>
          </div>

          {/* TAB 1: DUAL VIEW (Web + Mobile Overlapping Showcase) */}
          {activeTab === 'dual' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left / Center: Desktop Web Dashboard Frame */}
              <div className="lg:col-span-8 relative">
                <div className="group rounded-xl overflow-hidden bg-[#121316] border border-[#33353F] shadow-2xl transition-all duration-300 hover:border-[#FF9933]/40">
                  {/* macOS / Web Window Header */}
                  <div className="bg-[#1A1B22] px-4 py-2.5 flex items-center justify-between border-b border-[#262833]">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-[#FF5F56]/80 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-[#FFBD2E]/80 inline-block" />
                      <span className="w-3 h-3 rounded-full bg-[#27C93F]/80 inline-block" />
                      <span className="text-[11px] font-mono text-[#737373] ml-3 hidden sm:inline">
                        https://chambers.juricious.com/dashboard
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#A3A3A3]">
                      <span className="w-2 h-2 rounded-full bg-[#2E9E5B]" />
                      <span className="font-devanagari text-[11px]">न्याय मण्डप सिंक सक्रिय</span>
                    </div>
                  </div>

                  {/* Desktop Image */}
                  <div className="relative aspect-[1024/723] w-full bg-[#0E0F12]">
                    <Image
                      src="/platforms/juricious-web-dashboard.png"
                      alt="Juricious Web Command Center — Nepal Legal OS desktop dashboard with Bikram Sambat calendar, Tareekh alerts and Chambers overview"
                      fill
                      priority
                      className="object-cover object-top"
                      sizes="(max-width: 1024px) 100vw, 850px"
                    />
                  </div>

                  {/* Desktop Frame Footer */}
                  <div className="bg-[#14151B] px-4 py-3 border-t border-[#262833] flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-[#A3A3A3]">
                      <span className="text-[#FF9933] font-bold">💻 Web Command Center:</span>
                      <span>Full Chambers Oversight · Cause-Lists · Tareekh & Finance</span>
                    </div>
                    <button
                      onClick={() => setActiveTab('web')}
                      className="text-[#FF9933] hover:underline cursor-pointer font-medium"
                    >
                      Enlarge Web View →
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: Native Mobile App Frame */}
              <div className="lg:col-span-4 flex flex-col items-center">
                <div className="w-full max-w-[290px] sm:max-w-[320px] rounded-[36px] p-2 bg-[#1C1D24] border-2 border-[#383B47] shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative transition-all duration-300 hover:border-[#FF9933]/60 group">
                  {/* Dynamic Island / Speaker Notch */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-20 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-[#111] mr-3" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0a192f]/60" />
                  </div>

                  {/* Phone Screen Container */}
                  <div className="rounded-[28px] overflow-hidden relative aspect-[341/772] w-full bg-[#0A0A0A] border border-[#222]">
                    <Image
                      src="/platforms/juricious-mobile-app.png"
                      alt="Juricious Native Mobile App — In-Court active mode, court tareekh quick entry, and SMS parser on iOS and Android"
                      fill
                      priority
                      className="object-cover object-top pt-2"
                      sizes="(max-width: 640px) 290px, 320px"
                    />
                  </div>

                  {/* Mobile Frame Footer Badge */}
                  <div className="pt-3 pb-1 text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14151B] border border-[#262833] text-[11px] text-[#A3A3A3]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF9933]" />
                      <span className="font-semibold text-white">Native iOS & Android</span>
                      <span>· In-Court Mode</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#737373] mt-3 text-center">
                  Instant biometric unlock & background SMS court parsing.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: EXPANDED WEB COMMAND CENTER */}
          {activeTab === 'web' && (
            <div className="space-y-6">
              <div className="rounded-xl overflow-hidden bg-[#121316] border border-[#33353F] shadow-2xl">
                {/* Browser bar */}
                <div className="bg-[#1A1B22] px-4 py-3 flex items-center justify-between border-b border-[#262833]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#FF5F56]/80" />
                    <span className="w-3 h-3 rounded-full bg-[#FFBD2E]/80" />
                    <span className="w-3 h-3 rounded-full bg-[#27C93F]/80" />
                    <span className="text-xs font-mono text-[#A3A3A3] ml-3">
                      https://app.juricious.law/chambers/advocate-tripathi
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-devanagari text-[#FF9933] font-medium">नेपाल लिगल OS — न्याय मण्डप</span>
                    <span className="px-2 py-0.5 rounded bg-[#2E9E5B]/20 text-[#2E9E5B] border border-[#2E9E5B]/30 font-semibold">
                      Chamber Active
                    </span>
                  </div>
                </div>

                {/* Main Web Screenshot */}
                <div className="relative aspect-1024/723 w-full bg-[#0E0F12]">
                  <Image
                    src="/platforms/juricious-web-dashboard.png"
                    alt="Juricious Desktop Web Application with full chambers management in Nepali and Bikram Sambat"
                    fill
                    priority
                    className="object-contain object-top"
                    sizes="(max-width: 1280px) 100vw, 1200px"
                  />
                </div>
              </div>

              {/* Callouts for Web Experience */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-lg bg-[#14151B] border border-[#262833]">
                  <div className="text-xs font-semibold text-[#FF9933] uppercase tracking-wider mb-1">
                    Multi-Monitor Cause-List Workspace
                  </div>
                  <p className="text-xs text-[#A3A3A3] leading-relaxed">
                    Designed for 27" and 32" desktop displays in your chamber. Review cause lists, cross-bench conflicts, and pending client invoices side-by-side without endless scrolling.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-[#14151B] border border-[#262833]">
                  <div className="text-xs font-semibold text-[#FF9933] uppercase tracking-wider mb-1">
                    Emergency Tareekh & Limitation Alerts
                  </div>
                  <p className="text-xs text-[#A3A3A3] leading-relaxed">
                    Integrated alert engine flags cases with approaching expiration dates (म्याद नाघ्न लागेका वा छुट्न लागेका) before statutory deadlines expire under Muluki Civil/Criminal Codes.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-[#14151B] border border-[#262833]">
                  <div className="text-xs font-semibold text-[#FF9933] uppercase tracking-wider mb-1">
                    AI Drafting & Precedents Integration
                  </div>
                  <p className="text-xs text-[#A3A3A3] leading-relaxed">
                    Quick-access buttons for AI कानुनी मस्यौदा (AI legal drafting) and नेकाप नजिर खोज (NKP precedent research) directly from your daily dashboard.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EXPANDED MOBILE APP */}
          {activeTab === 'mobile' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Phone Frame */}
              <div className="md:col-span-5 flex justify-center">
                <div className="w-full max-w-[320px] rounded-[38px] p-2.5 bg-[#1C1D24] border-2 border-[#383B47] shadow-2xl relative">
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-20 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-[#111] mr-3" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0a192f]/60" />
                  </div>
                  <div className="rounded-[28px] overflow-hidden relative aspect-341/772 w-full bg-[#0A0A0A] border border-[#222]">
                    <Image
                      src="/platforms/juricious-mobile-app.png"
                      alt="Juricious Mobile App on smartphone"
                      fill
                      priority
                      className="object-cover object-top pt-2"
                      sizes="320px"
                    />
                  </div>
                </div>
              </div>

              {/* Mobile Highlights */}
              <div className="md:col-span-7 space-y-6">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#FF9933] px-2.5 py-1 rounded bg-[#FF9933]/10 border border-[#FF9933]/20">
                    Native Courtroom Companion
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-normal text-white mt-3">
                    Engineered for the advocates in motion.
                  </h3>
                  <p className="text-sm text-[#A3A3A3] mt-2 leading-relaxed">
                    Court corridors have dead zones, bad connectivity, and high stakes.
                    Our native iOS and Android apps run on a local encrypted database that never leaves you stranded at the bench.
                  </p>
                </div>

                <div className="space-y-3.5">shrink-0
                  <div className="p-4 rounded-lg bg-[#14151B] border border-[#262833] flex items-start gap-3">
                    <div className="w-8 h-8 rounded-md bg-[#FF9933]/10 border border-[#FF9933]/30 flex items-center justify-center text-[#FF9933] font-bold text-sm shrink-0">
                      ०१
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">In-Court Priority Mode (अधिवक्ता सक्रिय)</h4>
                      <p className="text-xs text-[#A3A3A3] mt-0.5">
                        Shows your immediate courtroom (e.g. इजलास नं. २ बहस प्राथमिकता) with scheduled time and party names at a single glance.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-[#14151B] border border-[#262833] flex items-start gap-3">
                    <div className="w-8 h-8 rounded-md bg-[#FF9933]/10 border border-[#FF9933]/30 flex items-center justify-center text-[#FF9933] font-bold text-sm shrink-0">
                      ०२
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Court SMS Auto-Import (SMS आयात)</h4>
                      <p className="text-xs text-[#A3A3A3] mt-0.5">
                        Received an official tareekh SMS from the Supreme or District Court? Juricious automatically parses court codes, case numbers, and next dates in one tap.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-[#14151B] border border-[#262833] flex items-start gap-3">
                    <div className="w-8 h-8 rounded-md bg-[#FF9933]/10 border border-[#FF9933]/30 flex items-center justify-center text-[#FF9933] font-bold text-sm shrink-0">
                      ०३
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Devanagari Bottom Navigation & द्रुत थप</h4>
                      <p className="text-xs text-[#A3A3A3] mt-0.5">
                        Floating action button (+ द्रुत थप) lets you record new tareekh, register a client dispute, or snap a date-sheet photo in under 3 seconds.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    onClick={() => openSmsDemo()}
                    className="px-4 py-2 rounded-md bg-[#1C1D24] border border-[#2E303B] text-xs font-semibold text-white hover:border-[#FF9933] transition-colors cursor-pointer"
                  >
                    Test SMS Parser Sandbox →
                  </button>
                  <button
                    onClick={() => openDiaryDemo()}
                    className="px-4 py-2 rounded-md bg-[#FF9933] text-black text-xs font-semibold hover:bg-[#ffa94d] transition-colors cursor-pointer"
                  >
                    Launch BS Calendar Demo →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Triple Foundation Cards: Explaining the Synergy */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {/* Card 1 */}
          <div className="p-6 rounded-xl bg-[#121316] border border-[#262626] hover:border-[#383B47] transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold font-mono text-[#FF9933] tracking-widest uppercase">
                  Desktop & Web Suite
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-[#1C1D24] text-[#A3A3A3] border border-[#2E303B]">
                  Chambers Hub
                </span>
              </div>
              <h3 className="font-serif text-xl font-normal text-white mb-2">
                Chamber Command Center
              </h3>
              <p className="text-sm text-[#A3A3A3] leading-relaxed">
                Operates smoothly in modern browsers on macOS, Windows, and Linux. Built for deep multi-case research, drafting with AI, filing preparation, and junior counsel delegation.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#1F2026] text-xs text-[#737373] flex items-center justify-between">
              <span>Optimized for 4K / Ultra-wide</span>
              <span className="text-[#FF9933] font-medium">वि.सं. २०८३ समर्थित</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-xl bg-[#121316] border border-[#262626] hover:border-[#383B47] transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold font-mono text-[#FF9933] tracking-widest uppercase">
                  iOS & Android Apps
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-[#1C1D24] text-[#A3A3A3] border border-[#2E303B]">
                  Courtroom Floor
                </span>
              </div>
              <h3 className="font-serif text-xl font-normal text-white mb-2">
                Native Mobile Power
              </h3>
              <p className="text-sm text-[#A3A3A3] leading-relaxed">
                Not an ordinary web bookmark. Real native applications built for iOS and Android with biometric Face ID/fingerprint security, push notifications, and instant camera date-sheet capture.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#1F2026] text-xs text-[#737373] flex items-center justify-between">
              <span>Native iOS & Android</span>
              <span className="text-[#FF9933] font-medium">अधिवक्ता सक्रिय मोड</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-xl bg-[#121316] border border-[#262626] hover:border-[#383B47] transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold font-mono text-[#FF9933] tracking-widest uppercase">
                  Unified Cloud Mesh
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-[#1C1D24] text-[#A3A3A3] border border-[#2E303B]">
                  Local + Cloud
                </span>
              </div>
              <h3 className="font-serif text-xl font-normal text-white mb-2">
                Automatic Cross-Sync
              </h3>
              <p className="text-sm text-[#A3A3A3] leading-relaxed">
                When your munshi inputs a tareekh date from Kathmandu District Court on mobile, your senior advocate sees it on their chambers desktop monitor within seconds.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#1F2026] text-xs text-[#737373] flex items-center justify-between">
              <span>Cryptographic Audit Trail</span>
              <span className="text-[#2E9E5B] font-medium">● १००% अफलाइन सक्षम</span>
            </div>
          </div>
        </div>

        {/* CTA Bar */}
        <div className="mt-12 p-6 sm:p-8 rounded-xl bg-linear-to-r from-[#17181E] via-[#14151B] to-[#17181E] border border-[#2E303B] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF9933]">
                Private Chambers Rollout
              </span>
              <span className="text-xs text-[#737373]">·</span>
              <span className="text-xs text-[#A3A3A3]">Exclusive Kathmandu & High Court Pilot</span>
            </div>
            <h4 className="font-serif text-xl sm:text-2xl text-white font-normal">
              Experience the dual-platform advantage in your practice.
            </h4>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => openWaitlistModal(undefined, 'Platform Showcase CTA')}
              className="w-full sm:w-auto h-11 px-6 rounded-md bg-[#FF9933] text-black font-semibold text-sm hover:bg-[#ffa94d] transition-all flex items-center justify-center cursor-pointer shadow-lg whitespace-nowrap"
            >
              Get Early Chambers Access →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
