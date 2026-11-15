'use client';

import React from 'react';
import { useApp } from '../lib/AppContext';

export function WorkingToday() {
  const { openDiaryDemo, openSmsDemo, openFeeDemo, triggerComingSoon } = useApp();

  const cards = [
    {
      numeral: '०१',
      title: 'Court diary',
      illustration: '/illustrations/court-diary.svg',
      illustrationAlt: 'Court diary calendar showing Bikram Sambat dates and hearing schedule',
      description:
        'Unified chambers calendar in Bikram Sambat. Tracks daily tareekh across District Courts, High Courts, and the Supreme Court with judge and bench assignments.',
      highlights: ['Bikram Sambat (वि.सं.) native', 'Bench & courtroom tracking', 'Conflict-free scheduling'],
      actionLabel: 'Explore Live BS Calendar →',
      onAction: () => openDiaryDemo(),
    },
    {
      numeral: '०२',
      title: 'SMS and date-sheet import',
      illustration: '/illustrations/sms-parser.svg',
      illustrationAlt: 'Phone showing court SMS being parsed into structured hearing card',
      description:
        'Copy-paste court tareekh SMS notices or import daily cause-lists. Automatically parses court codes, case numbers, and next hearing dates without manual retyping.',
      highlights: ['Automatic SMS parser', 'Daily cause-list import', 'One-click verification'],
      actionLabel: 'Test SMS Parser Sandbox →',
      onAction: () => openSmsDemo(),
    },
    {
      numeral: '०३',
      title: 'Matter workspace',
      illustration: '/illustrations/matter-workspace.svg',
      illustrationAlt: 'Case file workspace showing matter details, court history and documents',
      description:
        'Every case file organized by court level, opposing counsel, case history, order sheets, and uploaded annexures. Searchable instantly by client name or case ID.',
      highlights: ['Full case lifecycle', 'Evidence & order sheets', 'Multi-court history'],
      actionLabel: 'Preview Workspace Structure →',
      onAction: () =>
        triggerComingSoon(
          'Matter Workspace & Case Registry',
          'Organizing case files, order sheets, and opposing counsel registries across multiple courts. Ready for private chambers rollout.',
          'Date-sheet photo capture'
        ),
    },
    {
      numeral: '०४',
      title: 'Clients and consent',
      illustration: '/illustrations/client-consent.svg',
      illustrationAlt: 'Digital vakalatnama consent document with client details',
      description:
        'Structured client registry with national identification records, digital consent agreements, representation authorization, and case engagement logs.',
      highlights: ['Representation consent', 'Client communication log', 'Confidential directory'],
      actionLabel: 'Review Consent System →',
      onAction: () =>
        triggerComingSoon(
          'Client Directory & Representation Consent',
          'Digital consent agreements and representation authorization compliant with Nepal Bar Council standards.',
          'Bar Council verification'
        ),
    },
    {
      numeral: '०५',
      title: 'Fees and billing',
      illustration: '/illustrations/fee-calculator.svg',
      illustrationAlt: 'Court fee calculator showing Act 2049 schedules and FonePay QR code',
      description:
        'Statutory court fee calculator compliant with Court Fees Act 2049 schedules. Generate instant FonePay QR codes for chamber retainers and print physical receipts.',
      highlights: ['Court Fees Act 2049 schedules', 'FonePay QR generator', 'Auditable payment receipts'],
      actionLabel: 'Launch Fee Calculator →',
      onAction: () => openFeeDemo(),
    },
    {
      numeral: '०६',
      title: 'Advocate tools',
      illustration: '/illustrations/vakalatnama.svg',
      illustrationAlt: 'Vakalatnama document and limitation calendar tracker',
      description:
        'Automated Vakalatnama (वकलतनामा) generation for all court tiers, alongside a statutory limitation tracker for 15, 21, and 35-day filing deadlines under Muluki Codes.',
      highlights: ['Instant Vakalatnama generator', 'Muluki Code limitation rules', 'Judicial holiday adjustments'],
      actionLabel: 'Preview Limitation Rules →',
      onAction: () =>
        triggerComingSoon(
          'Vakalatnama & Limitation Deadline Tracker',
          'Statutory 15, 21, and 35-day limitation calendar calculator adjusting automatically for judicial court holidays (दसैं बिदा).',
          'Tareekh Dastoor reminders',
          'Muluki Civil Procedure Code 2074 Chapter 8'
        ),
    },
    {
      numeral: '०७',
      title: 'Filings studio',
      illustration: '/illustrations/filings-studio.svg',
      illustrationAlt: 'Supreme Court petition filing studio with 12-section template editor',
      description:
        'Twelve-section standardized drafting templates tailored to Supreme Court of Nepal and High Court rules: Writ petitions, appeal memos, and revision applications.',
      highlights: ['12-section Supreme Court forms', 'High Court appeal structure', 'Draft revision versioning'],
      actionLabel: 'Explore 12-Section Format →',
      onAction: () =>
        triggerComingSoon(
          'Filings Studio & Supreme Court Templates',
          'Twelve-section standardized petition and appeal memo drafting studio adhering to Supreme Court Regulations 2074.',
          'Nepal Gazette research',
          'Supreme Court Regulations 2074 Chapter 6'
        ),
    },
    {
      numeral: '०८',
      title: 'Research with citations',
      illustration: '/illustrations/citations-research.svg',
      illustrationAlt: 'Nepal Kanoon Patrika volumes with verified case citation card',
      description:
        'Built strictly to cite what exists, never inventing case law. Search official precedent volumes (नेपाल कानून पत्रिका - NKP) with exact volume, page, and bench citations.',
      highlights: ['NKP precedent references', 'Official bench composition', 'Zero AI case hallucinations'],
      actionLabel: 'View Citation Standard →',
      onAction: () =>
        triggerComingSoon(
          'Official NKP Precedent Search',
          'Searching official Nepal Kanoon Patrika (NKP) precedent volumes with verified bench citations. Zero AI hallucinations.',
          'Nepal Gazette research'
        ),
    },
  ];

  return (
    <section id="working-today" className="w-full bg-white text-[#0A0A0A] py-20 border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5F5F5] border border-[#E5E5E5] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#2E9E5B]"></span>
            <span className="text-xs font-semibold text-[#0A0A0A] uppercase tracking-wider">
              Working today
            </span>
            <span className="text-xs font-devanagari text-[#5C5C5C]">
              (चालू सुविधाहरू)
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#0A0A0A] tracking-tight leading-tight">
            Built for what an advocate actually does from morning to evening.
          </h2>
          <p className="text-base sm:text-lg text-[#5C5C5C] mt-4 leading-relaxed">
            Eight essential chambers capabilities already operational and battle-tested for Nepali practice. Click any card to explore interactive tools.
          </p>
        </div>

        {/* 8 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <div
              key={card.numeral}
              className="bg-white border border-[#E5E5E5] rounded-lg flex flex-col justify-between hover:border-[#0A0A0A] transition-all shadow-sm group overflow-hidden"
            >
              {/* Illustration Panel */}
              <div className="w-full h-36 bg-[#F5F5F5] border-b border-[#E5E5E5] overflow-hidden relative">
                <img
                  src={card.illustration}
                  alt={card.illustrationAlt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  aria-label={card.illustrationAlt}
                />
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div>
                  {/* Devanagari Numeral in Dark Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded bg-[#0A0A0A] flex items-center justify-center">
                      <span className="text-lg font-bold font-devanagari text-[#FF9933] select-none">
                        {card.numeral}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-[#2E9E5B] bg-[#EBF7F0] px-2 py-0.5 rounded font-mono">
                      Ready
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#0A0A0A] mb-2 tracking-tight">
                    {card.title}
                  </h3>

                  <p className="text-sm text-[#5C5C5C] leading-relaxed mb-6">
                    {card.description}
                  </p>
                </div>

                {/* Highlights & Interactive Trigger */}
                <div className="space-y-4 pt-4 border-t border-[#E5E5E5] mt-auto">
                  <div className="space-y-1.5">
                    {card.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-[#0A0A0A] font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2E9E5B]"></span>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={card.onAction}
                    className="w-full h-11 min-h-[44px] px-3 rounded bg-[#0A0A0A] text-white font-medium text-xs hover:bg-[#262626] transition-colors flex items-center justify-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9933]"
                  >
                    <span>{card.actionLabel}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
