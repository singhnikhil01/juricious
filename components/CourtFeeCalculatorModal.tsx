'use client';

import React, { useState } from 'react';
import { useApp } from '../lib/AppContext';

export function CourtFeeCalculatorModal() {
  const { demos, closeFeeDemo, triggerComingSoon } = useApp();

  const [claimAmount, setClaimAmount] = useState<number>(500000); // NPR 5,00,000 default
  const [caseType, setCaseType] = useState<'civil_claim' | 'partition' | 'writ'>('civil_claim');

  if (!demos.isFeeDemoOpen) return null;

  // Progressive court fee calculator according to Court Fees Act 2049 Schedule 1
  const calculateCourtFee = (amount: number, type: string) => {
    if (type === 'writ') {
      return 500; // Standard nominal fee for writ petition
    }
    if (type === 'partition') {
      // Partition suit nominal + valuation slab
      return Math.round(Math.min(50000, 1000 + amount * 0.005));
    }

    let remaining = amount;
    let fee = 0;

    // Up to 25,000: 5%
    if (remaining > 0) {
      const slab = Math.min(remaining, 25000);
      fee += slab * 0.05;
      remaining -= slab;
    }

    // 25,000 to 50,000: 3.5%
    if (remaining > 0) {
      const slab = Math.min(remaining, 25000);
      fee += slab * 0.035;
      remaining -= slab;
    }

    // 50,000 to 100,000: 2%
    if (remaining > 0) {
      const slab = Math.min(remaining, 50000);
      fee += slab * 0.02;
      remaining -= slab;
    }

    // 100,000 to 500,000: 1.5%
    if (remaining > 0) {
      const slab = Math.min(remaining, 400000);
      fee += slab * 0.015;
      remaining -= slab;
    }

    // 500,000 to 2,500,000: 1%
    if (remaining > 0) {
      const slab = Math.min(remaining, 2000000);
      fee += slab * 0.01;
      remaining -= slab;
    }

    // Above 2,500,000: 0.5%
    if (remaining > 0) {
      fee += remaining * 0.005;
    }

    return Math.max(500, Math.round(fee));
  };

  const courtFee = calculateCourtFee(claimAmount, caseType);
  const tareekhDastoor = 50; // Standard appearance dastoor
  const totalDue = courtFee + tareekhDastoor;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-xs text-white"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0" onClick={closeFeeDemo} aria-hidden="true" />

      <div className="relative w-full max-w-xl bg-[#1A1A1A] border border-[#262626] rounded-xl shadow-2xl p-6 sm:p-8 z-10 space-y-6 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
          <div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#0A0A0A] text-[#FF9933] border border-[#333333]">
              Feature Sandbox ०५
            </span>
            <h2 className="font-serif text-2xl font-bold text-white mt-1">
              Court Fee Calculator & FonePay Receipt
            </h2>
            <p className="text-xs text-[#A3A3A3] mt-0.5 font-devanagari">
              अदालत शुल्क ऐन, २०४९ अनुसार गणना
            </p>
          </div>
          <button
            onClick={closeFeeDemo}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#A3A3A3] hover:text-white hover:bg-[#262626] cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-white">
              Matter Classification
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'civil_claim', label: 'Civil Money Claim (विगो)' },
                { id: 'partition', label: 'Land Partition (अंशबण्डा)' },
                { id: 'writ', label: 'Writ Petition (रिट)' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setCaseType(t.id as any)}
                  className={`p-2.5 rounded text-xs font-medium border text-center transition-all cursor-pointer ${
                    caseType === t.id
                      ? 'bg-[#FF9933] text-black border-[#FF9933] font-bold'
                      : 'bg-[#0A0A0A] text-[#A3A3A3] border-[#333333] hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-white">
                Claim / Dispute Valuation (विगो रकम)
              </label>
              <span className="text-xs font-mono text-[#FF9933]">
                NPR {claimAmount.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={25000}
              max={10000000}
              step={25000}
              value={claimAmount}
              onChange={(e) => setClaimAmount(Number(e.target.value))}
              className="w-full accent-[#FF9933] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#737373] font-mono">
              <span>२५ हजार</span>
              <span>१० लाख</span>
              <span>५० लाख</span>
              <span>१ करोड</span>
            </div>
          </div>
        </div>

        {/* Breakdown Card */}
        <div className="p-5 rounded-lg bg-[#0A0A0A] border border-[#262626] space-y-4">
          <span className="text-xs font-mono text-[#A3A3A3] uppercase tracking-wider block">
            Statutory Fee Breakdown (Schedule 1)
          </span>

          <div className="space-y-2 text-xs divide-y divide-[#1F1F1F]">
            <div className="flex justify-between py-1 text-[#A3A3A3]">
              <span>Ad-Valorem Court Fee (अदालत शुल्क)</span>
              <span className="font-mono text-white font-bold">NPR {courtFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1 text-[#A3A3A3]">
              <span>Tareekh Appearance Dastoor (तारेख दस्तुर)</span>
              <span className="font-mono text-white">NPR {tareekhDastoor}</span>
            </div>
            <div className="flex justify-between pt-2 text-sm font-bold text-white">
              <span className="text-[#FF9933]">Total Deposit Required</span>
              <span className="font-mono text-[#FF9933]">NPR {totalDue.toLocaleString()}</span>
            </div>
          </div>

          {/* FonePay Mockup */}
          <div className="p-3.5 rounded bg-[#1A1A1A] border border-[#262626] flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] text-[#A3A3A3] block">Client Retainer QR Code</span>
              <span className="text-xs font-bold text-white block">Chambers Merchant Account</span>
              <span className="text-[11px] text-[#737373] font-mono">
                Ref: Case #081-CP-0492
              </span>
            </div>
            <div className="w-16 h-16 bg-white rounded p-1.5 flex items-center justify-center">
              <div className="w-full h-full bg-[#0A0A0A] rounded flex items-center justify-center text-[10px] text-white font-bold font-mono">
                QR
              </div>
            </div>
          </div>
        </div>

        {/* Action Trigger */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() =>
              triggerComingSoon(
                'FonePay Instant Merchant Receipts',
                'Generating instant dynamic FonePay QR codes for client litigation retainers and auto-printing signed vouchers.',
                'Tareekh Dastoor reminders',
                'Court Fees Act 2049 (Schedule 1 & Section 14)'
              )
            }
            className="flex-1 h-12 min-h-[48px] rounded bg-[#FF9933] text-black font-semibold text-xs hover:bg-[#ffa94d] transition-colors flex items-center justify-center cursor-pointer"
          >
            Generate Live QR & Print Voucher
          </button>
          <button
            onClick={closeFeeDemo}
            className="h-12 min-h-[48px] px-5 rounded bg-[#0A0A0A] border border-[#333333] text-white text-xs hover:bg-[#262626] cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
