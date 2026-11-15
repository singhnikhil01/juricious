'use client';

import React from 'react';
import Image from 'next/image';
import { useApp } from '../lib/AppContext';

export function BuiltForRealChambers() {
  const { triggerComingSoon } = useApp();

  const features = [
    {
      numeral: '०१',
      title: 'Four chambers roles',
      description:
        'Chambers owner, senior advocate, junior advocate, and munshi. Strict access permissions ensure juniors and court clerks access only assigned matters while owners maintain chambers-wide billing and audit visibility.',
      badge: 'Owner · Advocate · Junior · Munshi',
      actionLabel: 'Preview Role Structure →',
      onAction: () =>
        triggerComingSoon(
          'Chambers Role-Based Access Control',
          'Fine-grained permissions separating chambers owners, senior advocates, juniors, and court munshis.',
          'Bar Council verification'
        ),
    },
    {
      numeral: '०२',
      title: 'Tamper-evident audit trail',
      description:
        'Every change to a hearing tareekh, client deposit, or uploaded order document is logged immutably with timestamp, device identifier, and actor ID. No accidental deletions or unrecorded date modifications.',
      badge: 'Immutable change history',
      actionLabel: 'Inspect Audit Engine →',
      onAction: () =>
        triggerComingSoon(
          'Tamper-Evident Audit Logging',
          'Cryptographically verifiable logs tracking who changed tareekh, which device was used at court, and exact timestamps.',
          'Tareekh Dastoor reminders'
        ),
    },
    {
      numeral: '०३',
      title: 'Secure sign-in with optional 2FA',
      description:
        'Chambers-grade privacy with passwordless email one-time authentication and optional biometric/two-factor security to safeguard privileged advocate-client correspondence.',
      badge: 'One-time code & 2FA protection',
      actionLabel: 'Preview 2FA Security →',
      onAction: () =>
        triggerComingSoon(
          'Biometric & Two-Factor Authentication',
          'Passwordless email one-time code and device biometric sign-in protecting privileged advocate-client communications.'
        ),
    },
    {
      numeral: '०४',
      title: 'Dedicated Web Suite & Native Mobile Apps',
      description:
        'Not just a PWA or basic browser shortcut. Juricious delivers an expansive Web Command Center for desktop chambers alongside native iOS and Android apps with biometric lock, instant push tareekh alerts, and offline in-court access.',
      badge: 'Native iOS · Android · Web Command Center',
      actionLabel: 'Inspect Dual Platform →',
      onAction: () => {
        const el = document.getElementById('platforms');
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      },
    },
  ];

  return (
    <section className="w-full bg-[#0A0A0A] py-20 border-b border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo centrepiece */}
        <div className="mb-12 p-6 rounded-xl bg-[#1A1A1A] border border-[#262626] flex flex-col sm:flex-row items-center gap-6">
          <Image
            src="/brand/logo-full.png"
            alt="Juricious — Plan · Prepare · Prevail"
            width={220}
            height={143}
            className="object-contain flex-shrink-0"
            style={{ width: 'auto', height: 'auto' }}
          />
          <div className="sm:border-l border-[#262626] sm:pl-6 text-center sm:text-left">
            <div className="text-xs font-mono text-[#FF9933] uppercase tracking-widest mb-2">Plan · Prepare · Prevail</div>
            <div className="text-sm text-[#A3A3A3] leading-relaxed max-w-sm">
              Designed from the ground up for Nepali chambers—not adapted from foreign software.
              Built on how courts, munshis and advocates actually work every day.
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1A1A] border border-[#262626] mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#FF9933]">
              Chambers architecture
            </span>
            <span className="text-xs font-devanagari text-[#A3A3A3]">
              (कार्यालय संरचना)
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-white tracking-tight leading-tight">
            Built for a real chambers.
          </h2>
          <p className="text-base sm:text-lg text-[#A3A3A3] mt-4 leading-relaxed">
            Legal practice in Nepal relies on hierarchy, trust, and strict accountability. Juricious enforces all three.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feat) => (
            <div
              key={feat.numeral}
              className="bg-[#1A1A1A] border border-[#262626] rounded-lg p-7 hover:border-[#333333] transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded bg-[#262626] flex items-center justify-center">
                    <span className="text-base font-bold font-devanagari text-[#FF9933]">
                      {feat.numeral}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-[#A3A3A3] px-2.5 py-1 rounded bg-[#0A0A0A] border border-[#262626]">
                    {feat.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">
                  {feat.title}
                </h3>

                <p className="text-sm text-[#A3A3A3] leading-relaxed mb-6">
                  {feat.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#262626]">
                <button
                  type="button"
                  onClick={feat.onAction}
                  className="w-full h-11 px-3 rounded bg-[#0A0A0A] hover:bg-[#262626] text-white text-xs font-medium border border-[#262626] transition-colors cursor-pointer flex items-center justify-center"
                >
                  {feat.actionLabel}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
