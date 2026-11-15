'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../lib/AppContext';
import { FeedbackKind } from '../lib/types';
import { JuriciousLogo } from './JuriciousLogo';

interface FeedbackFormCoreProps {
  onSuccessClose?: () => void;
  isModal?: boolean;
}

export function FeedbackFormCore({ onSuccessClose, isModal = false }: FeedbackFormCoreProps) {
  const { submitFeedback, feedbackSimulatedState } = useApp();

  const [kind, setKind] = useState<FeedbackKind>('Idea');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Spam guard

  const [errors, setErrors] = useState<{
    message?: string;
    email?: string;
    general?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [rateLimitError, setRateLimitError] = useState(false);

  // Support simulated states if triggered programmatically
  useEffect(() => {
    if (!feedbackSimulatedState || feedbackSimulatedState === 'interactive') return;

    if (feedbackSimulatedState === 'empty') {
      setKind('Idea');
      setMessage('');
      setName('');
      setEmail('');
      setErrors({});
      setIsSubmitting(false);
      setIsSuccess(false);
      setNetworkError(false);
      setRateLimitError(false);
    } else if (feedbackSimulatedState === 'focused') {
      setKind('Problem');
      setMessage('At Kathmandu District Court, tareekh SMS from NTC has different text on Saturdays.');
      setName('');
      setEmail('');
      setErrors({});
      setIsSubmitting(false);
      setIsSuccess(false);
      setNetworkError(false);
      setRateLimitError(false);
    } else if (feedbackSimulatedState === 'filled') {
      setKind('Problem');
      setMessage(
        'During Dashain vacation (दसैं बिदा), court days are frozen for limitation periods under Muluki Civil Procedure Code 2074. The limitation tracker must account for gazetted judicial holidays automatically.'
      );
      setName('Adv. Manisha Koirala');
      setEmail('manisha.koirala@jurisconsult.np');
      setErrors({});
      setIsSubmitting(false);
      setIsSuccess(false);
      setNetworkError(false);
      setRateLimitError(false);
    } else if (feedbackSimulatedState === 'validation-error') {
      setMessage('');
      setEmail('bad-email-format');
      setErrors({
        message: 'Enter your message or description.',
        email: 'Enter a valid email address if you want a reply.',
      });
      setIsSubmitting(false);
      setIsSuccess(false);
      setNetworkError(false);
      setRateLimitError(false);
    } else if (feedbackSimulatedState === 'submitting') {
      setKind('Idea');
      setMessage('Integration with Supreme Court daily cause list');
      setName('Adv. Narayan Silwal');
      setIsSubmitting(true);
      setIsSuccess(false);
      setErrors({});
      setNetworkError(false);
      setRateLimitError(false);
    } else if (feedbackSimulatedState === 'success') {
      setIsSubmitting(false);
      setIsSuccess(true);
      setErrors({});
      setNetworkError(false);
      setRateLimitError(false);
    } else if (feedbackSimulatedState === 'network-failure') {
      setKind('Question');
      setMessage('Will the offline mode support multiple phones simultaneously?');
      setIsSubmitting(false);
      setIsSuccess(false);
      setNetworkError(true);
      setRateLimitError(false);
    } else if (feedbackSimulatedState === 'rate-limit') {
      setKind('Question');
      setMessage('Can we test the calendar preview?');
      setIsSubmitting(false);
      setIsSuccess(false);
      setRateLimitError(true);
      setNetworkError(false);
    }
  }, [feedbackSimulatedState]);

  const validate = () => {
    const errs: typeof errors = {};
    if (!message.trim()) {
      errs.message = 'Enter your message or description.';
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Enter a valid email address if you want a reply.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNetworkError(false);
    setRateLimitError(false);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await new Promise((res) => setTimeout(res, 500));
      const res = await submitFeedback({
        kind,
        message,
        name: name || undefined,
        email: email || undefined,
        honeypot,
      });

      setIsSubmitting(false);
      if (res.success) {
        setIsSuccess(true);
      } else {
        setErrors({ general: res.error || 'Submission failed.' });
      }
    } catch {
      setIsSubmitting(false);
      setNetworkError(true);
    }
  };

  const handleReset = () => {
    setMessage('');
    setName('');
    setEmail('');
    setHoneypot('');
    setErrors({});
    setIsSubmitting(false);
    setIsSuccess(false);
    setNetworkError(false);
    setRateLimitError(false);
  };

  const pillKinds: FeedbackKind[] = ['Idea', 'Problem', 'Question', 'Something else'];

  /* ── shared input styles matching WaitlistFormCore ── */
  const inputBase =
    'w-full h-11 px-3.5 rounded-md bg-[#111111] border text-sm text-white placeholder-[#555555] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF9933]/60';
  const inputOk = 'border-[#2E2E2E] focus:border-[#FF9933]';
  const inputErr = 'border-[#E5484D] bg-[#1a0808]';

  return (
    <div
      className={`w-full bg-[#111111] text-white rounded-xl p-6 sm:p-8 ${
        isModal ? '' : 'border border-[#1E1E1E] shadow-2xl'
      }`}
    >
      {isSuccess ? (
        <div className="text-center py-8 space-y-5" role="status" aria-live="polite">
          <div className="w-14 h-14 rounded-full bg-[#0d2b1a] border-2 border-[#2E9E5B] flex items-center justify-center mx-auto text-[#2E9E5B] text-2xl font-bold">
            ✓
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-2xl font-bold text-white">
              Thank you, we got it.
            </h3>
            <p className="text-sm text-[#A3A3A3] max-w-md mx-auto">
              Your note has been placed into our product feedback review queue.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="h-11 px-6 rounded-md bg-[#FF9933] text-black font-semibold text-sm hover:bg-[#ffa94d] transition-colors focus-visible:ring-2 focus-visible:ring-[#FF9933] cursor-pointer"
            >
              Send another note
            </button>
            {isModal && onSuccessClose && (
              <button
                type="button"
                onClick={onSuccessClose}
                className="h-11 px-6 rounded-md bg-[#1E1E1E] text-[#A3A3A3] font-medium text-sm hover:bg-[#2E2E2E] hover:text-white transition-colors cursor-pointer"
              >
                Close
              </button>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Honeypot Spam Guard (Hidden from human users, catches automated bots) */}
          <div style={{ display: 'none' }} aria-hidden="true">
            <label htmlFor="website_url_hp">Leave this field blank</label>
            <input
              id="website_url_hp"
              type="text"
              name="website_url_hp"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {/* Form Header */}
          <div className="space-y-2 pb-4 border-b border-[#1E1E1E]">
            <div className="flex items-center justify-between">
              <JuriciousLogo variant="horizontal" size="sm" theme="dark" />
              <span className="text-[11px] font-mono text-[#737373] bg-[#1A1A1A] border border-[#2E2E2E] px-2 py-0.5 rounded">
                Product Feedback
              </span>
            </div>
            <div>
              <h2
                id="feedback-modal-title"
                className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight"
              >
                Share an idea or problem
              </h2>
              <p className="text-xs text-[#737373] mt-1">
                Help shape Juricious for your court routines and chambers workflow.
              </p>
            </div>
          </div>

          {/* Network & Rate Limit Error Banners */}
          {networkError && (
            <div
              className="p-3.5 rounded-md bg-[#1a0808] border border-[#E5484D] flex items-center justify-between gap-3"
              role="alert"
            >
              <div className="flex items-start gap-2.5">
                <span className="text-[#E5484D]">✕</span>
                <div>
                  <p className="text-sm font-semibold text-[#E5484D]">Network failure</p>
                  <p className="text-xs text-[#A3A3A3] mt-0.5">
                    Could not send your feedback. Your message has been saved in this form.
                  </p>
                </div>
              </div>
              <button
                type="submit"
                className="h-8 px-3 text-xs rounded bg-[#E5484D] text-white font-medium hover:bg-[#c93b40] transition-colors whitespace-nowrap cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          {rateLimitError && (
            <div
              className="p-3.5 rounded-md bg-[#1a1200] border border-[#F2C14E] text-sm flex items-start gap-2.5"
              role="alert"
            >
              <span className="text-[#F2C14E] text-base">⚠</span>
              <div>
                <p className="font-semibold text-[#F2C14E]">Too many requests</p>
                <p className="text-xs text-[#A3A3A3] mt-0.5">
                  Please wait a moment before sending another feedback submission.
                </p>
              </div>
            </div>
          )}

          {errors.general && (
            <div className="p-3 rounded-md bg-[#1a0808] border border-[#E5484D] text-xs text-[#E5484D] font-medium">
              {errors.general}
            </div>
          )}

          {/* Field 1: Type selector as pills */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#A3A3A3] uppercase tracking-wider">
              What kind of note is this?
            </label>
            <div className="flex flex-wrap gap-2">
              {pillKinds.map((p) => {
                const isSelected = kind === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setKind(p)}
                    className={`h-9 px-4 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#FF9933] text-black border-[#FF9933] font-semibold shadow-sm'
                        : 'bg-[#161616] text-[#A3A3A3] border-[#2E2E2E] hover:border-[#444444] hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Field 2: Message (required, 2000 chars live counter) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="fb-message" className="block text-xs font-semibold text-[#A3A3A3] uppercase tracking-wider">
                Message <span className="text-[#E5484D]">*</span>
              </label>
              <span
                className={`text-xs font-mono ${
                  message.length > 1900 ? 'text-[#E5484D] font-bold' : 'text-[#737373]'
                }`}
              >
                {message.length} / 2000
              </span>
            </div>
            <textarea
              id="fb-message"
              required
              rows={4}
              maxLength={2000}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (errors.message) setErrors({ ...errors, message: undefined });
              }}
              placeholder="What happens in your practice that Juricious should handle?"
              className={`w-full p-3.5 rounded-md bg-[#111111] border text-sm text-white placeholder-[#555555] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF9933]/60 ${
                errors.message ? inputErr : inputOk
              }`}
            />
            {errors.message && (
              <p className="text-xs text-[#E5484D] font-medium" role="alert">
                {errors.message}
              </p>
            )}
          </div>

          {/* Field 3: Name (optional) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="fb-name" className="block text-xs font-semibold text-[#A3A3A3] uppercase tracking-wider">
                Your name
              </label>
              <span className="text-[11px] text-[#555555]">Optional</span>
            </div>
            <input
              id="fb-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Adv. Narayan Silwal (or leave blank for anonymous)"
              className={`${inputBase} ${inputOk}`}
            />
          </div>

          {/* Field 4: Email (optional, if you want a reply) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="fb-email" className="block text-xs font-semibold text-[#A3A3A3] uppercase tracking-wider">
                Your email
              </label>
              <span className="text-[11px] text-[#555555]">Optional · if you want a reply</span>
            </div>
            <input
              id="fb-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              placeholder="narayan.silwal@supremelaw.np"
              className={`${inputBase} ${errors.email ? inputErr : inputOk}`}
            />
            {errors.email && (
              <p className="text-xs text-[#E5484D] font-medium" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full h-12 px-6 rounded-md font-semibold text-sm transition-colors flex items-center justify-center cursor-pointer ${
                isSubmitting
                  ? 'bg-[#2E2E2E] text-[#555555] cursor-not-allowed'
                  : 'bg-[#FF9933] text-black hover:bg-[#ffa94d] active:bg-[#e68524] shadow-lg shadow-[#FF9933]/10'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Saving…
                </span>
              ) : (
                'Send feedback →'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
