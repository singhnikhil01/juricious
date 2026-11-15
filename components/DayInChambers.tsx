'use client';

import React from 'react';
import { useApp } from '../lib/AppContext';

export function DayInChambers() {
  const { openSmsDemo, triggerComingSoon } = useApp();

  const steps = [
    {
      numeral: '०१',
      time: '08:30 AM · Morning Filing & Intake',
      title: 'The notice arrives',
      subtitle: 'Munshi pastes the court SMS or imports the date-sheet',
      description:
        'When morning notices drop or the court clerk brings the physical date-sheet, the munshi pastes the raw text or uploads the listing. Juricious automatically maps the case number, opposing counsel, and bench number.',
      detailBox: {
        label: 'Raw Court SMS parsed',
        content: 'Kathmandu DC: Case 081-CP-0492 set for Tareekh on 2083-08-15 Bench 7 (Dastoor Due)',
      },
      actionBtn: {
        label: 'Test SMS Parser →',
        onClick: () => openSmsDemo(),
      },
    },
    {
      numeral: '०२',
      time: '07:00 AM · Hearing Morning',
      title: 'The right person is told',
      subtitle: 'Assign it, reminder at 07:00 on hearing day',
      description:
        'Chambers owner assigns primary advocate and assisting junior. Automatic morning alert delivers today’s cause-list summary to everyone’s phone before leaving for court, with offline brief notes.',
      detailBox: {
        label: 'Chambers Alert Engine',
        content: 'Assigned to Adv. Anjali Shrestha · Bench 3 at Patan High Court · 11:30 AM',
      },
      actionBtn: {
        label: 'Preview 07:00 AM Alert →',
        onClick: () =>
          triggerComingSoon(
            '07:00 AM Hearing Morning Alerts',
            'Automatic morning push reminders and SMS dispatch to assigned advocates and juniors with offline case brief summaries.',
            'Tareekh Dastoor reminders'
          ),
      },
    },
    {
      numeral: '०३',
      time: '02:15 PM · Court Premises',
      title: 'The outcome is recorded at the court',
      subtitle: 'Next tareekh in seconds, syncs when back online',
      description:
        'At the court clerk counter with spotty 3G/4G, the advocate or munshi logs the order summary and enters the next tareekh slip in three taps. It saves locally immediately and syncs to all chambers devices upon reconnecting.',
      detailBox: {
        label: 'Offline-First Sync Status',
        content: 'Saved to device storage · Next Tareekh: 2083-09-04 · Background sync pending',
      },
      actionBtn: {
        label: 'Test Offline Tareekh Slip →',
        onClick: () =>
          triggerComingSoon(
            'Offline Court Counter Tareekh Logger',
            'Three-tap next tareekh logger designed for court clerk counters with unreliable connectivity. Syncs automatically when back online.',
            'Tareekh Dastoor reminders',
            'Muluki Civil Procedure Code 2074 Chapter 12'
          ),
      },
    },
  ];

  return (
    <section id="day-in-chambers" className="w-full bg-[#0A0A0A] py-20 border-b border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1A1A] border border-[#262626] mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#FF9933]">
              A day in chambers
            </span>
            <span className="text-xs font-devanagari text-[#A3A3A3]">
              (दैनिक कार्यप्रणाली)
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-white tracking-tight leading-tight">
            How a hearing actually moves through your team.
          </h2>
          <p className="text-base sm:text-lg text-[#A3A3A3] mt-4 leading-relaxed">
            From the minute the munshi collects the cause-list to the second the next tareekh is entered at the court counter.
          </p>
        </div>

        {/* 3 Step Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div
              key={step.numeral}
              className="bg-[#1A1A1A] border border-[#262626] rounded-lg flex flex-col justify-between hover:border-[#333333] transition-colors overflow-hidden"
            >
              {/* Illustration */}
              <div className="w-full h-40 bg-[#0A0A0A] overflow-hidden border-b border-[#262626]">
                <img
                  src={`/illustrations/day-step-${idx + 1}.svg`}
                  alt={step.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="p-7 flex flex-col flex-1">
                <div>
                  {/* Step Marker & Numeral */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded bg-[#262626] border border-[#333333] flex items-center justify-center">
                      <span className="text-lg font-bold font-devanagari text-[#FF9933]">
                        {step.numeral}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-[#A3A3A3]">
                      {step.time}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1">
                    {step.title}
                  </h3>
                  <h4 className="text-sm font-medium text-[#FF9933] mb-3">
                    {step.subtitle}
                  </h4>

                  <p className="text-sm text-[#A3A3A3] leading-relaxed mb-6">
                    {step.description}
                  </p>
                </div>

                {/* Sample Workflow Detail Box & Action Button */}
                <div className="space-y-3 mt-auto">
                  <div className="p-3.5 rounded bg-[#0A0A0A] border border-[#262626]">
                    <div className="text-[11px] font-mono text-[#737373] uppercase tracking-wider mb-1">
                      {step.detailBox.label}
                    </div>
                    <div className="text-xs text-white font-mono leading-relaxed">
                      {step.detailBox.content}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={step.actionBtn.onClick}
                    className="w-full h-11 px-3 rounded bg-[#262626] hover:bg-[#333333] text-white text-xs font-medium border border-[#333333] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9933]"
                  >
                    {step.actionBtn.label}
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
