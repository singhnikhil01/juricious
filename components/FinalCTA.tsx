'use client';

import React, { useState } from 'react';
import { useApp } from '../lib/AppContext';

export function FinalCTA() {
  const { openWaitlistModal } = useApp();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Enter your email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Enter a valid email address.');
      return;
    }
    setError('');
    openWaitlistModal(undefined, 'Bottom large saffron CTA section');
  };

  return (
    <section className="w-full bg-[#FF9933] text-[#0A0A0A] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        {/* Label */}
        <span className="text-xs font-bold uppercase tracking-widest text-black/80 px-3 py-1 rounded bg-black/10 inline-block">
          Early Chambers Access
        </span>

        {/* Headline */}
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#0A0A0A] tracking-tight leading-tight">
          Be first in when we open the doors.
        </h2>

        {/* Description */}
        <p className="text-base sm:text-lg text-black/85 max-w-2xl mx-auto leading-relaxed">
          We are onboarding a limited cohort of Kathmandu, High Court, and District Court chambers
          for private testing. Enter your email to secure early access.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-md mx-auto pt-4 space-y-2">
          <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              placeholder="advocate@chambers.com.np"
              aria-label="Email address for early chambers access"
              className="flex-1 h-12 min-h-[48px] px-4 rounded-md bg-white border-2 border-black text-black placeholder-neutral-500 text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all"
            />
            <button
              type="submit"
              className="h-12 min-h-[48px] px-7 rounded-md bg-[#0A0A0A] text-white font-semibold text-sm hover:bg-[#262626] active:bg-[#1A1A1A] transition-colors whitespace-nowrap cursor-pointer flex items-center justify-center shadow-md"
            >
              Join the waitlist
            </button>
          </div>
          {error && (
            <p className="text-xs text-[#0A0A0A] font-bold text-left pl-1 bg-white/70 py-1 px-2 rounded">
              ⚠️ {error}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
