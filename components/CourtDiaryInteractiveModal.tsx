'use client';

import React, { useState } from 'react';
import { useApp } from '../lib/AppContext';

export function CourtDiaryInteractiveModal() {
  const { demos, closeDiaryDemo, triggerComingSoon } = useApp();

  const [selectedDay, setSelectedDay] = useState<number>(4);
  const [courtFilter, setCourtFilter] = useState<'All' | 'Supreme' | 'High' | 'District'>('All');

  if (!demos.isDiaryDemoOpen) return null;

  // Sample hearings for Mangsir 2083
  const hearingsData: { [day: number]: Array<{ court: string; tier: 'Supreme' | 'High' | 'District'; bench: string; caseName: string; time: string; purpose: string }> } = {
    4: [
      {
        court: 'Supreme Court of Nepal',
        tier: 'Supreme',
        bench: 'Bench 3 (Hon. Justice K.C. / Hon. Justice Thapa)',
        caseName: '079-CR-0129 · Shrestha v. Dept. of Internal Revenue',
        time: '11:30 AM',
        purpose: 'Final hearing tareekh · Senior Advocate lead argument',
      },
    ],
    9: [
      {
        court: 'Patan High Court',
        tier: 'High',
        bench: 'Commercial Division Bench 2',
        caseName: '080-CP-0412 · Himalayan Trading v. Kumari Bank',
        time: '01:15 PM',
        purpose: 'Interim injunction continuation & Vakalatnama submission',
      },
    ],
    15: [
      {
        court: 'Kathmandu District Court (Babar Mahal)',
        tier: 'District',
        bench: 'Bench 7 (Judge Sharma)',
        caseName: '081-CP-0492 · Land Partition & Title Claim',
        time: '10:45 AM',
        purpose: 'Witness examination (साक्षी बकपत्र) & Tareekh Dastoor deposit',
      },
    ],
    21: [
      {
        court: 'Patan High Court',
        tier: 'High',
        bench: 'Bench 4 (Writ Jurisdiction)',
        caseName: '081-WO-0891 · Labour Union v. Manufacturing Corp',
        time: '02:00 PM',
        purpose: 'Show cause notice & preliminary hearing',
      },
    ],
    28: [
      {
        court: 'Supreme Court of Nepal',
        tier: 'Supreme',
        bench: 'Constitutional Bench',
        caseName: '080-SC-0022 · Public Interest Litigation (PIL)',
        time: '11:00 AM',
        purpose: 'Constitutional interpretation on Local Governance Act',
      },
    ],
  };

  const daysInMonth = 30; // Mangsir 2083
  const nepaliDays = ['आइत', 'सोम', 'मंग', 'बुध', 'बिही', 'शुक्र', 'शनि'];

  const selectedHearings = (hearingsData[selectedDay] || []).filter((h) => {
    if (courtFilter === 'All') return true;
    return h.tier === courtFilter;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-xs text-white"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0" onClick={closeDiaryDemo} aria-hidden="true" />

      <div className="relative w-full max-w-4xl bg-[#1A1A1A] border border-[#262626] rounded-xl shadow-2xl p-6 sm:p-8 z-10 space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#262626] gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#0A0A0A] text-[#FF9933] border border-[#333333]">
                Interactive Chambers Sandbox
              </span>
              <span className="text-xs text-[#2E9E5B] font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#2E9E5B] animate-pulse"></span>
                Works offline
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
              Court Diary: मंसिर २०८३ (Bikram Sambat)
            </h2>
            <p className="text-xs text-[#A3A3A3] mt-0.5">
              Click any calendar day to inspect tareekh schedule and bench assignments.
            </p>
          </div>

          <button
            onClick={closeDiaryDemo}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#A3A3A3] hover:text-white hover:bg-[#262626] transition-colors self-end sm:self-auto cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Court Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0A0A0A] p-3 rounded-lg border border-[#262626]">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#A3A3A3] font-medium">Filter Court:</span>
            {(['All', 'Supreme', 'High', 'District'] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => setCourtFilter(tier)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  courtFilter === tier
                    ? 'bg-[#FF9933] text-black font-bold'
                    : 'bg-[#1A1A1A] text-[#A3A3A3] hover:text-white'
                }`}
              >
                {tier === 'All' ? 'All Courts' : `${tier} Court`}
              </button>
            ))}
          </div>

          <span className="text-xs text-[#A3A3A3] font-mono">
            Calendar Engine BS 2095
          </span>
        </div>

        {/* Interactive Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 text-center">
          {nepaliDays.map((d, i) => (
            <div
              key={d}
              className={`py-2 text-xs font-semibold ${
                i === 6 ? 'text-[#E5484D]' : 'text-[#A3A3A3]'
              }`}
            >
              {d} {i === 6 && '(शनिबार)'}
            </div>
          ))}

          {Array.from({ length: daysInMonth }, (_, idx) => {
            const dayNum = idx + 1;
            const hasHearings = !!hearingsData[dayNum];
            const isSelected = selectedDay === dayNum;
            const isSaturday = (dayNum + 2) % 7 === 0;

            return (
              <button
                key={dayNum}
                onClick={() => setSelectedDay(dayNum)}
                className={`h-14 sm:h-16 rounded-lg p-1.5 flex flex-col justify-between items-center transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-[#FF9933] text-black border-[#FF9933] font-bold shadow-md'
                    : hasHearings
                    ? 'bg-[#0A0A0A] border-[#333333] hover:border-[#FF9933]'
                    : isSaturday
                    ? 'bg-[#141414] border-[#222222] text-[#737373]'
                    : 'bg-[#1A1A1A] border-[#262626] text-white hover:bg-[#222222]'
                }`}
              >
                <div className="flex items-center justify-between w-full px-1">
                  <span className="text-xs font-devanagari font-bold">
                    {dayNum < 10 ? `०${dayNum}` : dayNum}
                  </span>
                  {hasHearings && (
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isSelected ? 'bg-black' : 'bg-[#FF9933]'
                      }`}
                    />
                  )}
                </div>
                {hasHearings && (
                  <span
                    className={`text-[10px] truncate max-w-full px-1 rounded ${
                      isSelected ? 'bg-black/20 text-black' : 'text-[#FF9933]'
                    }`}
                  >
                    {hearingsData[dayNum].length} tareekh
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Day Hearing List */}
        <div className="p-5 rounded-lg bg-[#0A0A0A] border border-[#262626] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base font-serif text-white">
              Hearings for मंसिर {selectedDay} (BS 2083)
            </h3>
            <span className="text-xs text-[#A3A3A3]">
              {selectedHearings.length} court matters scheduled
            </span>
          </div>

          {selectedHearings.length === 0 ? (
            <div className="py-6 text-center text-[#737373] text-xs">
              No hearings scheduled on this date for the selected court filter.
            </div>
          ) : (
            <div className="space-y-3">
              {selectedHearings.map((h, i) => (
                <div
                  key={i}
                  className="p-4 rounded-md bg-[#1A1A1A] border border-[#262626] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#333333] transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#FF9933] uppercase tracking-wider">
                        {h.court}
                      </span>
                      <span className="text-xs text-[#A3A3A3]">· {h.bench}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{h.caseName}</h4>
                    <p className="text-xs text-[#A3A3A3]">{h.purpose}</p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span className="text-xs font-mono bg-[#0A0A0A] px-2.5 py-1 rounded text-white border border-[#262626]">
                      {h.time}
                    </span>
                    <button
                      onClick={() =>
                        triggerComingSoon(
                          'Next Tareekh Recording',
                          'Recording tareekh outcomes and assigning follow-up dates directly from the court clerk counter.',
                          'Tareekh Dastoor reminders',
                          'Muluki Civil Procedure Code 2074 Chapter 12'
                        )
                      }
                      className="text-xs font-medium px-3 py-1.5 rounded bg-[#262626] hover:bg-[#333333] text-white border border-[#333333] transition-colors cursor-pointer"
                    >
                      Update Tareekh
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Triggers */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-3 border-t border-[#262626]">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() =>
                triggerComingSoon(
                  'Add New Hearing to Diary',
                  'Chambers diary creation and conflict-checking across advocate calendars is currently in closed testing.',
                  'Date-sheet photo capture',
                  'Supreme Court Rules 2074 Chapter 4'
                )
              }
              className="flex-1 sm:flex-none h-11 px-4 rounded bg-[#FF9933] text-black font-semibold text-xs hover:bg-[#ffa94d] transition-colors cursor-pointer"
            >
              + Schedule New Tareekh
            </button>

            <button
              onClick={() =>
                triggerComingSoon(
                  'Offline Device Synchronization',
                  'Full local 2-week diary cache sync with phone background push alerts.',
                  'Date-sheet photo capture'
                )
              }
              className="flex-1 sm:flex-none h-11 px-4 rounded bg-[#262626] text-white font-medium text-xs hover:bg-[#333333] transition-colors cursor-pointer"
            >
              📲 Test Offline Sync
            </button>
          </div>

          <button
            onClick={closeDiaryDemo}
            className="text-xs text-[#A3A3A3] hover:text-white"
          >
            Close Sandbox
          </button>
        </div>
      </div>
    </div>
  );
}
