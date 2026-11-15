'use client';

import React, { useEffect } from 'react';
import { useApp } from '../lib/AppContext';
import { FeedbackFormCore } from './FeedbackFormCore';

export function FeedbackModal() {
  const { isFeedbackModalOpen, closeFeedbackModal } = useApp();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeFeedbackModal();
      }
    };
    if (isFeedbackModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isFeedbackModalOpen, closeFeedbackModal]);

  if (!isFeedbackModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-modal-title"
    >
      {/* Backdrop click */}
      <div className="fixed inset-0" onClick={closeFeedbackModal} aria-hidden="true" />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-[#111111] rounded-xl shadow-2xl border border-[#1E1E1E] z-10 my-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={closeFeedbackModal}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full text-[#555555] hover:text-white hover:bg-[#1E1E1E] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF9933] cursor-pointer z-20"
          aria-label="Close feedback modal"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <FeedbackFormCore isModal={true} onSuccessClose={closeFeedbackModal} />
      </div>
    </div>
  );
}
