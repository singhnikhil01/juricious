'use client';

import React from 'react';

export function TrustStrip() {
  const items = [
    {
      title: 'Bikram Sambat first',
      description: 'Calendar to BS 2095, Saturday and judicial holiday aware.',
      devanagariTag: 'वि.सं. पात्रो',
    },
    {
      title: 'Web & Native Mobile',
      description: 'Desktop Web command center and native iOS & Android apps with live sync.',
      devanagariTag: 'वेब र मोबाइल एप',
    },
    {
      title: 'Works 100% offline',
      description: 'Court diary and hearings stay accessible in courtroom corridors without internet.',
      devanagariTag: 'अफलाइन सक्षम',
    },
    {
      title: 'Built on Nepali law',
      description: 'Muluki Codes 2074, Supreme Court rules, Court Fees Act 2049.',
      devanagariTag: 'कानुनी आधार',
    },
  ];

  return (
    <section className="w-full bg-[#1A1A1A] border-b border-[#262626] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-md bg-[#0A0A0A] border border-[#262626] flex flex-col justify-between hover:border-[#333333] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#FF9933]">
                    {item.title}
                  </span>
                  <span className="text-[11px] font-devanagari text-[#A3A3A3] px-1.5 py-0.5 rounded bg-[#1A1A1A]">
                    {item.devanagariTag}
                  </span>
                </div>
                <p className="text-sm text-[#A3A3A3] leading-relaxed mt-2">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
