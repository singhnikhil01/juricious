'use client';

import React, { useCallback, useState } from 'react';
import { useApp } from '../lib/AppContext';
import { JuriciousLogo } from './JuriciousLogo';

const NAV_LINKS = [
  { id: 'platforms', label: 'Web & Mobile Apps' },
  { id: 'working-today', label: 'What works today' },
  { id: 'day-in-chambers', label: 'A day in chambers' },
  { id: 'coming-soon', label: 'Coming soon' },
] as const;

export function Navbar() {
  const { openWaitlistModal, openFeedbackModal, setActiveTab } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = useCallback(
    (id: string) => {
      setMobileMenuOpen(false);
      setActiveTab('public-site');
      // Defer until after the tab switch has painted so the section exists.
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    },
    [setActiveTab],
  );

  const handleJoinWaitlist = useCallback(
    (source: string) => {
      setMobileMenuOpen(false);
      openWaitlistModal(undefined, source);
    },
    [openWaitlistModal],
  );

  return (
    <nav
      className="sticky top-0 z-40 w-full border-b border-[#1A1A1A] bg-[#0A0A0A]"
      aria-label="Primary"
    >
      <div className="mx-auto max-w-[80vw] px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Logo */}
          <a
            href="#hero"
            aria-label="Juricious home"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('hero');
            }}
            className="group flex items-center rounded p-1 focus-visible:ring-2 focus-visible:ring-[#FF9933] focus-visible:outline-none"
          >
            <JuriciousLogo
              variant="horizontal"
              size="lg"
              priority
              className="max-w-52.5 sm:max-w-70 md:max-w-none"
            />
          </a>

          {/* Desktop nav */}
          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className="rounded px-2 py-1 text-sm font-medium text-[#A3A3A3] transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-[#FF9933] focus-visible:outline-none"
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => openFeedbackModal()}
              className="rounded px-2 py-1 text-sm font-medium text-[#A3A3A3] transition-colors hover:text-[#FF9933] focus-visible:ring-2 focus-visible:ring-[#FF9933] focus-visible:outline-none"
            >
              Share an idea
            </button>
          </div>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-3 sm:flex">
            <button
              onClick={() => handleJoinWaitlist('Navbar Join the waitlist button')}
              className="flex h-12 min-h-[48px] cursor-pointer items-center justify-center rounded-md bg-[#FF9933] px-6 text-sm font-semibold text-black shadow-sm transition-colors hover:bg-[#ffa94d] focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none active:bg-[#e68524]"
            >
              Join the waitlist
            </button>
          </div>

          {/* Mobile hamburger (48×48 touch target) */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="flex h-12 w-12 items-center justify-center rounded text-white hover:text-[#FF9933] focus-visible:ring-2 focus-visible:ring-[#FF9933] focus-visible:outline-none"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="space-y-3 border-b border-[#262626] bg-[#1A1A1A] px-4 pb-6 pt-4 md:hidden"
        >
          {NAV_LINKS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className="block w-full border-b border-[#262626] py-2.5 text-left text-base font-medium text-white hover:text-[#FF9933] focus-visible:ring-2 focus-visible:ring-[#FF9933] focus-visible:outline-none"
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              openFeedbackModal();
            }}
            className="block w-full border-b border-[#262626] py-2.5 text-left text-base font-medium text-white hover:text-[#FF9933] focus-visible:ring-2 focus-visible:ring-[#FF9933] focus-visible:outline-none"
          >
            Share an idea
          </button>

          <div className="pt-2">
            <button
              onClick={() =>
                handleJoinWaitlist('Mobile Menu Join the waitlist button')
              }
              className="flex h-12 min-h-[48px] w-full cursor-pointer items-center justify-center rounded-md bg-[#FF9933] px-6 text-base font-semibold text-black transition-colors hover:bg-[#ffa94d] focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none active:bg-[#e68524]"
            >
              Join the waitlist
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}