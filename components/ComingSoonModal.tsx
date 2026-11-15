'use client';

import React, { useEffect } from 'react';
import { useApp } from '../lib/AppContext';
import { JuriciousLogo } from './JuriciousLogo';

export function ComingSoonModal() {
  const { comingSoonInfo, closeComingSoon, openWaitlistModal } = useApp();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeComingSoon();
    };
    if (comingSoonInfo.isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [comingSoonInfo.isOpen, closeComingSoon]);

  if (!comingSoonInfo.isOpen) return null;

  const handleJoinWaitlistForFeature = () => {
    const feat = comingSoonInfo.featureKey;
    const title = comingSoonInfo.featureTitle;
    closeComingSoon();
    openWaitlistModal(feat, `Coming soon prompt: ${title}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0" onClick={closeComingSoon} aria-hidden="true" />

      <div className="relative w-full max-w-lg bg-[#1A1A1A] border border-[#262626] rounded-xl shadow-2xl p-6 sm:p-8 text-white z-10 space-y-6">
        {/* Close Button */}
        <button
          onClick={closeComingSoon}
          className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-[#A3A3A3] hover:text-white hover:bg-[#262626] transition-colors cursor-pointer"
          aria-label="Close"
        >
          <span className="text-xl">✕</span>
        </button>

        {/* Header with Amber Status Badge */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <JuriciousLogo variant="horizontal" size="sm" />
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFF8E6] border border-[#F2C14E] text-[#8A5800] text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F2C14E] animate-pulse"></span>
              <span>Coming Soon</span>
            </div>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {comingSoonInfo.featureTitle}
          </h3>

          <p className="text-sm text-[#A3A3A3] leading-relaxed">
            {comingSoonInfo.description}
          </p>
        </div>

        {/* Statutory Context Box */}
        {comingSoonInfo.statutoryRef && (
          <div className="p-3.5 rounded-lg bg-[#0A0A0A] border border-[#262626] text-xs space-y-1">
            <span className="text-[11px] font-mono text-[#FF9933] uppercase tracking-wider block">
              Nepali Legal & Court Alignment
            </span>
            <p className="text-[#A3A3A3] font-devanagari">
              {comingSoonInfo.statutoryRef}
            </p>
          </div>
        )}

        {/* Reassurance Message */}
        <div className="p-4 rounded-lg bg-[#262626] border border-[#333333] text-xs text-[#A3A3A3] leading-relaxed">
          <span className="text-white font-semibold block mb-1">
            Why is this feature gated right now?
          </span>
          Juricious is preparing for public launch with an initial cohort of Kathmandu and High Court law chambers. We are ensuring strict offline synchronization and zero data loss before opening live filings to all practitioners.
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleJoinWaitlistForFeature}
            className="flex-1 h-12 min-h-[48px] px-6 rounded-md bg-[#FF9933] text-black font-semibold text-sm hover:bg-[#ffa94d] transition-colors flex items-center justify-center cursor-pointer shadow-md"
          >
            Join waitlist for early invite
          </button>
          <button
            onClick={closeComingSoon}
            className="h-12 min-h-[48px] px-5 rounded-md bg-[#0A0A0A] border border-[#333333] text-white text-sm hover:bg-[#262626] transition-colors cursor-pointer"
          >
            Explore other features
          </button>
        </div>
      </div>
    </div>
  );
}
