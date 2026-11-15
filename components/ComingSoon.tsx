'use client';

import React from 'react';
import { useApp } from '../lib/AppContext';
import { FeatureType } from '../lib/types';

export function ComingSoon() {
  const { openWaitlistModal } = useApp();

  const items: {
    title: string;
    featureKey: FeatureType;
    description: string;
    statutoryRef: string;
    illustration: string;
    illustrationAlt: string;
  }[] = [
    {
      title: 'Tareekh Dastoor reminders',
      featureKey: 'Tareekh Dastoor reminders',
      illustration: '/illustrations/coming-dastoor.svg',
      illustrationAlt: 'Court fee reminder notification with Court Fees Act 2049 schedule',
      description:
        'Proactive court-fee prompts and statutory penalty calculation under the Court Fees Act 2049. Never miss an overdue deposit deadline that triggers case abeyance.',
      statutoryRef: 'Court Fees Act 2049 (दालत शुल्क ऐन, २०४९)',
    },
    {
      title: 'Date-sheet photo capture',
      featureKey: 'Date-sheet photo capture',
      illustration: '/illustrations/coming-datesheet.svg',
      illustrationAlt: 'Phone camera scanning a printed court date-sheet bulletin board',
      description:
        'On-device camera OCR tailored to printed and handwriting styles on district court bulletin boards. Snaps paper cause-sheets and extracts tareekh items directly into your diary.',
      statutoryRef: 'On-device camera OCR engine',
    },
    {
      title: 'Nepal Gazette research',
      featureKey: 'Nepal Gazette research',
      illustration: '/illustrations/coming-gazatte.svg',
      illustrationAlt: 'Nepal Rajpatra gazette book with searchable results panel',
      description:
        'Searchable repository of official Nepal Rajpatra (नेपाल राजपत्र) notifications, statutory amendments, administrative notices, and Supreme Court bench compositions.',
      statutoryRef: 'Nepal Gazette & Judicial Council notices',
    },
    {
      title: 'Bar Council verification',
      featureKey: 'Bar Council verification',
      illustration: '/illustrations/coming-bar-council.svg',
      illustrationAlt: 'Bar Council licence verification panel showing advocate status',
      description:
        'Automatic licence standing and renewal status verification directly cross-referenced with the Nepal Bar Council advocate registry and chamber certifications.',
      statutoryRef: 'Nepal Bar Council Act 2050',
    },
  ];

  return (
    <section id="coming-soon" className="w-full bg-white text-[#0A0A0A] py-20 border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF8E6] border border-[#F2C14E] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#F2C14E]"></span>
            <span className="text-xs font-semibold text-[#0A0A0A] uppercase tracking-wider">
              Roadmap &amp; Priorities
            </span>
            <span className="text-xs font-devanagari text-[#5C5C5C]">
              (चाँडै आउँदैछ)
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#0A0A0A] tracking-tight leading-tight">
            Coming soon to Juricious.
          </h2>
          <p className="text-base sm:text-lg text-[#5C5C5C] mt-4 leading-relaxed">
            These features are currently in engineering. Vote for what your chambers needs first to guide our deployment sequence.
          </p>
        </div>

        {/* 4 Dashed Border Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => (
            <div
              key={item.title}
              className="bg-white border-2 border-dashed border-[#D4D4D4] rounded-lg hover:border-[#0A0A0A] transition-colors flex flex-col justify-between overflow-hidden"
            >
              {/* Illustration */}
              <div className="w-full h-44 bg-[#F9F9F9] border-b border-dashed border-[#D4D4D4] overflow-hidden">
                <img
                  src={item.illustration}
                  alt={item.illustrationAlt}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="p-7 flex flex-col flex-1">
                <div>
                  {/* Amber Coming Soon Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFF8E6] border border-[#F2C14E] text-xs font-bold text-[#8A5800]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F2C14E]"></span>
                      <span>Coming soon</span>
                    </span>
                    <span className="text-[11px] font-mono text-[#5C5C5C]">
                      In engineering
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#0A0A0A] mb-2 tracking-tight">
                    {item.title}
                  </h3>

                  <p className="text-sm text-[#5C5C5C] leading-relaxed mb-4">
                    {item.description}
                  </p>

                  <p className="text-xs text-[#5C5C5C] font-devanagari mb-6 bg-[#F9F9F9] p-2 rounded border border-[#E5E5E5]">
                    सन्दर्भ: {item.statutoryRef}
                  </p>
                </div>

                {/* Action Link: "I want this first" */}
                <div className="pt-4 border-t border-dashed border-[#E5E5E5] flex items-center justify-between mt-auto">
                  <button
                    type="button"
                    onClick={() =>
                      openWaitlistModal(item.featureKey, `Coming soon card (${item.title})`)
                    }
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0A0A0A] hover:text-black underline underline-offset-4 decoration-2 decoration-[#0A0A0A] hover:decoration-[#FF9933] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9933] rounded px-1"
                  >
                    <span>I want this first</span>
                    <span aria-hidden="true">→</span>
                  </button>
                  <span className="text-xs text-[#5C5C5C]">
                    Pre-selects in waitlist form
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
