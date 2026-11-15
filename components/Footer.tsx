'use client';

import React from 'react';
import { useApp } from '../lib/AppContext';
import { JuriciousLogo } from './JuriciousLogo';
import { SocialLinks } from './SocialLinks';

export function Footer() {
  const { openFeedbackModal, setCurrentView } = useApp();

  const scrollToSection = (id: string) => {
    setCurrentView('public');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <footer className="w-full bg-[#0A0A0A] border-t border-[#1A1A1A] py-12 text-[#A3A3A3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#1A1A1A]">
          {/* Brand & Social */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <JuriciousLogo variant="horizontal" size="sm" theme="dark" />
            <div className="flex items-center gap-2 sm:border-l sm:border-[#262626] sm:pl-6">
              <span className="text-xs text-[#737373] font-mono mr-1 hidden sm:inline">Connect:</span>
              <SocialLinks size="sm" variant="pill" />
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <button
              onClick={() => scrollToSection('working-today')}
              className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9933] rounded px-1"
            >
              What works today
            </button>
            <button
              onClick={() => scrollToSection('day-in-chambers')}
              className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9933] rounded px-1"
            >
              A day in chambers
            </button>
            <button
              onClick={() => scrollToSection('coming-soon')}
              className="hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9933] rounded px-1"
            >
              Coming soon
            </button>
            <button
              onClick={() => openFeedbackModal()}
              className="text-[#FF9933] hover:text-[#ffa94d] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9933] rounded px-1"
            >
              Share an idea or feedback
            </button>
            <button
              onClick={() => setCurrentView('admin')}
              className="text-xs font-mono text-[#737373] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9933] rounded px-2.5 py-1 bg-[#1A1A1A] border border-[#262626]"
              title="Private chambers team portal to view waitlist entries and feedback"
            >
              Chambers Team Sign-in 🔒
            </button>
          </div>
        </div>

        {/* Legal notice & Disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#737373] gap-4">
          <p>© 2026 Juricious. Software for legal professionals, not legal advice.</p>
          <div className="flex items-center gap-4">
            <span>Supreme Court & High Court Rules Compliant</span>
            <span>·</span>
            <span className="font-devanagari">नेपालका अधिवक्ताका लागि</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
