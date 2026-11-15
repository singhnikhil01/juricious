'use client';

import React, { useState } from 'react';
import { useApp } from '../lib/AppContext';
import { RoleType } from '../lib/types';
import { JuriciousLogo } from './JuriciousLogo';

interface WaitlistFormCoreProps {
  preselectedFeature?: string;
  source?: string;
  onSuccessClose?: () => void;
  isModal?: boolean;
}

export function WaitlistFormCore({
  source = 'Waitlist form',
  onSuccessClose,
  isModal = false,
}: WaitlistFormCoreProps) {
  const { submitWaitlist } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<RoleType | ''>('');

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    role?: string;
    general?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [duplicateError, setDuplicateError] = useState(false);

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = 'Enter your full name.';
    }

    if (!email.trim()) {
      newErrors.email = 'Enter a valid email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Enter a valid email address.';
    }

    if (phone.trim()) {
      const cleanPhone = phone.replace(/[\s-]/g, '');
      const nepaliPhoneRegex = /^(\+977)?[9][78]\d{8}$/;
      if (!nepaliPhoneRegex.test(cleanPhone)) {
        newErrors.phone = 'Enter a valid Nepali mobile number (e.g. +977 98XXXXXXXX).';
      }
    }

    if (!role) {
      newErrors.role = 'Select your role in chambers.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNetworkError(false);
    setDuplicateError(false);

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await new Promise((res) => setTimeout(res, 500));

      const res = await submitWaitlist({
        name,
        email,
        phone: phone || undefined,
        role: role as RoleType,
        consent: true,
        source,
      });

      setIsSubmitting(false);

      if (!res.success) {
        if (res.errorType === 'duplicate') {
          setDuplicateError(true);
        } else if (res.errorType === 'network') {
          setNetworkError(true);
        } else {
          setErrors({ general: res.error || 'Could not save your entry.' });
        }
      } else {
        setIsSuccess(true);
      }
    } catch {
      setIsSubmitting(false);
      setNetworkError(true);
    }
  };

  const handleResetForAnother = () => {
    setName('');
    setEmail('');
    setPhone('');
    setRole('');
    setErrors({});
    setIsSubmitting(false);
    setIsSuccess(false);
    setNetworkError(false);
    setDuplicateError(false);
  };

  /* ── shared input styles ── */
  const inputBase =
    'w-full h-11 px-3.5 rounded-md bg-[#111111] border text-sm text-white placeholder-[#555555] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF9933]/60';
  const inputOk = 'border-[#2E2E2E] focus:border-[#FF9933]';
  const inputErr = 'border-[#E5484D] bg-[#1a0808]';

  return (
    <div className="w-full bg-[#111111] text-white rounded-xl p-6 sm:p-8 border border-[#1E1E1E] shadow-2xl">
      {/* SUCCESS STATE */}
      {isSuccess ? (
        <div className="text-center py-8 space-y-5" role="status" aria-live="polite">
          <div className="w-14 h-14 rounded-full bg-[#0d2b1a] border-2 border-[#2E9E5B] flex items-center justify-center mx-auto text-[#2E9E5B] text-2xl font-bold">
            ✓
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-2xl font-bold text-white">You are on the list.</h3>
            <p className="text-sm text-[#A3A3A3]">We will email you when your invite is ready.</p>
          </div>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleResetForAnother}
              className="h-11 px-6 rounded-md bg-[#FF9933] text-black font-semibold text-sm hover:bg-[#ffa94d] transition-colors focus-visible:ring-2 focus-visible:ring-[#FF9933] cursor-pointer"
            >
              Add another person
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
          {/* Form Header */}
          <div className="space-y-2 pb-4 border-b border-[#1E1E1E]">
            <div className="flex items-center justify-between">
              <JuriciousLogo variant="horizontal" size="sm" theme="dark" />
              <span className="text-[11px] font-mono text-[#737373] bg-[#1A1A1A] border border-[#2E2E2E] px-2 py-0.5 rounded">
                Early Access
              </span>
            </div>
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Join the chambers waitlist
              </h2>
              <p className="text-xs text-[#737373] mt-1">
                Built for Nepali advocates, junior lawyers, and court munshis.
              </p>
            </div>
          </div>

          {/* Error banners */}
          {duplicateError && (
            <div className="p-3.5 rounded-md bg-[#1a1200] border border-[#F2C14E] text-sm flex items-start gap-2.5" role="alert">
              <span className="text-[#F2C14E] text-base">⚠</span>
              <div>
                <p className="font-semibold text-[#F2C14E]">Already on the list</p>
                <p className="text-xs text-[#A3A3A3] mt-0.5">We already have your email registered. We will reach out when invites open.</p>
              </div>
            </div>
          )}

          {networkError && (
            <div className="p-3.5 rounded-md bg-[#1a0808] border border-[#E5484D] flex items-center justify-between gap-3" role="alert">
              <div className="flex items-start gap-2.5">
                <span className="text-[#E5484D]">✕</span>
                <div>
                  <p className="text-sm font-semibold text-[#E5484D]">Connection failed</p>
                  <p className="text-xs text-[#A3A3A3] mt-0.5">Your details are preserved — please try again.</p>
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

          {errors.general && (
            <div className="p-3 rounded-md bg-[#1a0808] border border-[#E5484D] text-xs text-[#E5484D] font-medium">
              {errors.general}
            </div>
          )}

          {/* Full name */}
          <div className="space-y-1.5">
            <label htmlFor="wl-name" className="block text-xs font-semibold text-[#A3A3A3] uppercase tracking-wider">
              Full name <span className="text-[#E5484D]">*</span>
            </label>
            <input
              id="wl-name"
              type="text"
              required
              value={name}
              onChange={(e) => { setName(e.target.value); if (errors.name) setErrors({ ...errors, name: undefined }); }}
              placeholder="Adv. Rameshwar Prasad Sharma"
              className={`${inputBase} ${errors.name ? inputErr : inputOk}`}
            />
            {errors.name && <p className="text-xs text-[#E5484D] font-medium" role="alert">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="wl-email" className="block text-xs font-semibold text-[#A3A3A3] uppercase tracking-wider">
              Email address <span className="text-[#E5484D]">*</span>
            </label>
            <input
              id="wl-email"
              type="email"
              required
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: undefined }); }}
              placeholder="rameshwar.legal@gmail.com"
              className={`${inputBase} ${errors.email ? inputErr : inputOk}`}
            />
            {errors.email && <p className="text-xs text-[#E5484D] font-medium" role="alert">{errors.email}</p>}
          </div>

          {/* Phone (optional) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="wl-phone" className="block text-xs font-semibold text-[#A3A3A3] uppercase tracking-wider">
                Phone number
              </label>
              <span className="text-[11px] text-[#555555]">Optional</span>
            </div>
            <input
              id="wl-phone"
              type="tel"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); if (errors.phone) setErrors({ ...errors, phone: undefined }); }}
              placeholder="+977 98XXXXXXXX"
              className={`${inputBase} ${errors.phone ? inputErr : inputOk}`}
            />
            {errors.phone && <p className="text-xs text-[#E5484D] font-medium" role="alert">{errors.phone}</p>}
          </div>

          {/* Role (custom styled select) */}
          <div className="space-y-1.5">
            <label htmlFor="wl-role" className="block text-xs font-semibold text-[#A3A3A3] uppercase tracking-wider">
              Role in chambers <span className="text-[#E5484D]">*</span>
            </label>
            <div className="relative">
              <select
                id="wl-role"
                required
                value={role}
                onChange={(e) => { setRole(e.target.value as RoleType); if (errors.role) setErrors({ ...errors, role: undefined }); }}
                className={`w-full h-11 pl-3.5 pr-9 rounded-md bg-[#111111] border text-sm appearance-none transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF9933]/60 cursor-pointer ${
                  errors.role
                    ? 'border-[#E5484D] text-white'
                    : 'border-[#2E2E2E] focus:border-[#FF9933] ' + (role ? 'text-white' : 'text-[#555555]')
                }`}
              >
                <option value="" disabled className="text-[#555555] bg-[#111111]">Select your role</option>
                <option value="Advocate" className="bg-[#111111] text-white">Advocate</option>
                <option value="Junior advocate" className="bg-[#111111] text-white">Junior advocate</option>
                <option value="Munshi" className="bg-[#111111] text-white">Munshi</option>
                <option value="Chambers or firm owner" className="bg-[#111111] text-white">Chambers or firm owner</option>
                <option value="Other" className="bg-[#111111] text-white">Other</option>
              </select>
              {/* Custom chevron */}
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#555555]">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            {errors.role && <p className="text-xs text-[#E5484D] font-medium" role="alert">{errors.role}</p>}
          </div>

          {/* Submit */}
          <div className="pt-1">
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
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Saving…
                </span>
              ) : (
                'Join the waitlist →'
              )}
            </button>
            <p className="text-center text-[11px] text-[#555555] mt-2.5">
              By joining, you agree to be contacted about Juricious. No spam, ever.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
