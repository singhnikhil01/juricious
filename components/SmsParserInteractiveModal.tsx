'use client';

import React, { useState } from 'react';
import { useApp } from '../lib/AppContext';

export function SmsParserInteractiveModal() {
  const { demos, closeSmsDemo, triggerComingSoon } = useApp();

  const sampleSmsOptions = [
    {
      label: 'Kathmandu District Court',
      rawText: 'KTMDC: Case 081-CP-0492 vs Land Revenue Dept. Tareekh fixed for 2083-08-15 at Bench 7. Dastoor due before hearing.',
    },
    {
      label: 'Patan High Court',
      rawText: 'PATANHC: Appeal 080-AP-1082 (Himalayan Trading vs Bank) listed on 2083-08-09 Div Bench 2 for Interim Order.',
    },
    {
      label: 'Supreme Court of Nepal',
      rawText: 'SC-NEPAL: Writ 081-WO-0312 Shrestha vs Ministry of Finance set for 2083-08-04 Bench 3. Senior Adv. lead brief.',
    },
  ];

  const [inputText, setInputText] = useState(sampleSmsOptions[0].rawText);
  const [parsedResult, setParsedResult] = useState<{
    court: string;
    caseNo: string;
    tareekhBS: string;
    bench: string;
    stage: string;
  } | null>(null);

  if (!demos.isSmsDemoOpen) return null;

  const handleParse = (textToParse: string = inputText) => {
    let court = 'District Court';
    let caseNo = '081-CP-0492';
    let tareekhBS = '२०८३-०८-१५';
    let bench = 'Bench 7';
    let stage = 'Witness & Tareekh Dastoor';

    if (textToParse.includes('PATANHC')) {
      court = 'Patan High Court (पाटन उच्च अदालत)';
      caseNo = '080-AP-1082';
      tareekhBS = '२०८३-०८-०९';
      bench = 'Commercial Division Bench 2';
      stage = 'Interim Order Extension';
    } else if (textToParse.includes('SC-NEPAL') || textToParse.includes('Supreme')) {
      court = 'Supreme Court of Nepal (सर्वोच्च अदालत)';
      caseNo = '081-WO-0312';
      tareekhBS = '२०८३-०८-०४';
      bench = 'Bench 3 (Single/Div Bench)';
      stage = 'Final Argument & Brief';
    } else {
      court = 'Kathmandu District Court (काठमाडौँ जिल्ला अदालत)';
    }

    setParsedResult({ court, caseNo, tareekhBS, bench, stage });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-xs text-white"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0" onClick={closeSmsDemo} aria-hidden="true" />

      <div className="relative w-full max-w-2xl bg-[#1A1A1A] border border-[#262626] rounded-xl shadow-2xl p-6 sm:p-8 z-10 space-y-6 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
          <div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#0A0A0A] text-[#FF9933] border border-[#333333]">
              Feature Sandbox ०२
            </span>
            <h2 className="font-serif text-2xl font-bold text-white mt-1">
              Court Tareekh SMS & Date-Sheet Import
            </h2>
            <p className="text-xs text-[#A3A3A3] mt-0.5">
              Paste SMS from Nepal Telecom or district court clerks to extract hearing data automatically.
            </p>
          </div>
          <button
            onClick={closeSmsDemo}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#A3A3A3] hover:text-white hover:bg-[#262626] cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Sample Selectors */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-[#A3A3A3] uppercase tracking-wider">
            Load Sample Court SMS:
          </label>
          <div className="flex flex-wrap gap-2">
            {sampleSmsOptions.map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => {
                  setInputText(opt.rawText);
                  handleParse(opt.rawText);
                }}
                className="px-3 py-1.5 rounded text-xs bg-[#0A0A0A] border border-[#333333] hover:border-[#FF9933] text-white transition-colors cursor-pointer"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Text Input */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-white">
            Raw SMS Notice / Date-Sheet Text:
          </label>
          <textarea
            rows={3}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#0A0A0A] border border-[#333333] text-xs font-mono text-white focus:outline-none focus:border-[#FF9933]"
            placeholder="Paste raw SMS text received from court..."
          />
          <button
            type="button"
            onClick={() => handleParse()}
            className="h-11 px-6 rounded bg-[#FF9933] text-black font-semibold text-xs hover:bg-[#ffa94d] transition-colors cursor-pointer"
          >
            Parse Court SMS
          </button>
        </div>

        {/* Parsed Output */}
        {parsedResult && (
          <div className="p-4 rounded-lg bg-[#0A0A0A] border border-[#262626] space-y-3">
            <span className="text-xs font-mono text-[#2E9E5B] uppercase tracking-wider font-bold block">
              ✓ Successfully Parsed Court Structure
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded bg-[#1A1A1A] border border-[#262626]">
                <span className="text-[#A3A3A3] block text-[11px]">Court Jurisdiction</span>
                <span className="font-bold text-white font-devanagari">{parsedResult.court}</span>
              </div>

              <div className="p-2.5 rounded bg-[#1A1A1A] border border-[#262626]">
                <span className="text-[#A3A3A3] block text-[11px]">Case Number</span>
                <span className="font-bold text-white font-mono">{parsedResult.caseNo}</span>
              </div>

              <div className="p-2.5 rounded bg-[#1A1A1A] border border-[#262626]">
                <span className="text-[#A3A3A3] block text-[11px]">Next Tareekh (Bikram Sambat)</span>
                <span className="font-bold text-[#FF9933] font-devanagari text-sm">
                  {parsedResult.tareekhBS}
                </span>
              </div>

              <div className="p-2.5 rounded bg-[#1A1A1A] border border-[#262626]">
                <span className="text-[#A3A3A3] block text-[11px]">Bench / Courtroom</span>
                <span className="font-bold text-white">{parsedResult.bench}</span>
              </div>
            </div>

            <button
              onClick={() =>
                triggerComingSoon(
                  'Auto-Sync to Case Workspace',
                  'Saving parsed tareekh SMS directly into client matter workspaces and assigning junior advocate reminders.',
                  'Date-sheet photo capture'
                )
              }
              className="w-full h-11 rounded bg-[#262626] hover:bg-[#333333] text-white border border-[#333333] text-xs font-bold transition-colors cursor-pointer mt-2"
            >
              + Save Parsed Tareekh to Chambers Diary
            </button>
          </div>
        )}

        <div className="pt-2 text-right">
          <button onClick={closeSmsDemo} className="text-xs text-[#A3A3A3] hover:text-white">
            Close Sandbox
          </button>
        </div>
      </div>
    </div>
  );
}
