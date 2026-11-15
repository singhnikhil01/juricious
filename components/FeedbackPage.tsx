'use client';

import React from 'react';
import { FeedbackFormCore } from './FeedbackFormCore';
import { useApp } from '../lib/AppContext';

export function FeedbackPage() {
  const { setActiveTab } = useApp();

  return (
    <div className="w-full min-h-screen bg-[#0A0A0A] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveTab('public-site')}
            className="inline-flex items-center gap-2 text-sm text-[#A3A3A3] hover:text-[#FF9933] transition-colors py-2 px-3 rounded bg-[#1A1A1A] border border-[#262626] cursor-pointer"
          >
            <span>← Back to Public Showcase</span>
          </button>
          <span className="text-xs font-mono text-[#A3A3A3]">
            Dedicated Route (/ideas)
          </span>
        </div>

        {/* Card Container */}
        <FeedbackFormCore isModal={false} />
      </div>
    </div>
  );
}
