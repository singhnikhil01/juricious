'use client';

import React, { useState } from 'react';
import { useApp } from '../lib/AppContext';
import { JuriciousLogo } from './JuriciousLogo';
import {
  WaitlistStatus,
  RoleType,
  FeatureType,
  FeedbackStatus,
  FeedbackKind,
  WaitlistEntry,
} from '../lib/types';
import { AdminWaitlistSidePanel } from './AdminWaitlistSidePanel';

type AdminTab = 'overview' | 'waitlist' | 'feedback' | 'settings';

/* ─────────────────────────── helpers ─────────────────────────── */
function StatusBadge({ status }: { status: WaitlistStatus }) {
  const cls =
    status === 'New'
      ? 'bg-[#FF9933] text-black font-semibold'
      : status === 'Contacted'
      ? 'bg-[#2E9E5B] text-white font-semibold'
      : 'bg-[#262626] text-[#A3A3A3] border border-[#333333]';
  return <span className={`text-[11px] px-2 py-0.5 rounded ${cls}`}>{status}</span>;
}

function isWithin24Hours(dateStr: string) {
  return Date.now() - new Date(dateStr).getTime() <= 86_400_000;
}

/* ═══════════════════════════════════════════════════════════════
   ADMIN LOADING SCREEN — Shown during session verification to prevent login flash
═══════════════════════════════════════════════════════════════ */
function AdminLoadingScreen() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-4 select-none">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative flex items-center justify-center w-16 h-16">
          <JuriciousLogo variant="mark" size="md" className="relative z-10" />
          <div className="absolute inset-0 rounded-2xl border-2 border-[#FF9933]/20 border-t-[#FF9933] animate-spin" />
        </div>
        <div className="text-center space-y-1.5">
          <p className="font-serif text-lg font-bold text-white tracking-wide">Juricious Admin</p>
          <p className="text-xs text-[#737373] tracking-wider uppercase flex items-center justify-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FF9933] animate-ping" />
            Loading chamber records…
          </p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SIGN-IN SCREEN
═══════════════════════════════════════════════════════════════ */
function SignInScreen() {
  const { loginAdmin, adminError } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await loginAdmin(email, password);
    setLoading(false);
  };

  const inp =
    'w-full h-11 px-3.5 rounded-lg bg-[#0A0A0A] border border-[#2E2E2E] text-sm text-white placeholder-[#555555] focus:outline-none focus:border-[#FF9933] transition-colors';

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="text-center space-y-2">
          <JuriciousLogo variant="mark" size="md" className="mx-auto" />
          <h1 className="font-serif text-2xl font-bold text-white">Admin Portal</h1>
          <p className="text-sm text-[#555555]">Sign in to manage your chambers database</p>
        </div>

        {/* Error */}
        {adminError && (
          <div className="p-3.5 rounded-lg bg-[#1a0808] border border-[#E5484D] text-sm text-[#E5484D] flex items-start gap-2">
            <span className="mt-0.5">⚠</span>
            <span>{adminError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#A3A3A3] uppercase tracking-wider">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@juricious.com"
              required
              autoFocus
              className={inp}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#A3A3A3] uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className={`${inp} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute inset-y-0 right-3 flex items-center text-[#555555] hover:text-white transition-colors"
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-lg bg-[#FF9933] text-black font-semibold text-sm hover:bg-[#ffa94d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Signing in…
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <p className="text-center text-xs text-[#444444]">
          Default: admin@juricious.com / Admin@1234
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SETTINGS TAB — change password
═══════════════════════════════════════════════════════════════ */
function SettingsTab({ adminEmail }: { adminEmail: string }) {
  const { changeAdminPassword, logoutAdmin } = useApp();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (next !== confirm) {
      setMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    const result = await changeAdminPassword(current, next);
    if (result.success) {
      setMsg({ type: 'success', text: 'Password changed successfully.' });
      setCurrent(''); setNext(''); setConfirm('');
    } else {
      setMsg({ type: 'error', text: result.error || 'Failed to change password.' });
    }
  };

  const inp = 'w-full h-11 px-3.5 rounded-lg bg-[#0A0A0A] border border-[#2E2E2E] text-sm text-white placeholder-[#555555] focus:outline-none focus:border-[#FF9933] transition-colors';

  const PwField = ({
    label, value, onChange, show, onToggle, placeholder,
  }: { label: string; value: string; onChange: (v: string) => void; show: boolean; onToggle: () => void; placeholder: string }) => (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-[#A3A3A3] uppercase tracking-wider">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required
          className={`${inp} pr-10`}
        />
        <button type="button" onClick={onToggle}
          className="absolute inset-y-0 right-3 flex items-center text-[#555555] hover:text-white transition-colors">
          {show
            ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          }
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-xl space-y-6">
      {/* Account info */}
      <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-6 space-y-4">
        <h3 className="text-xs font-semibold text-[#A3A3A3] uppercase tracking-wider">Account Information</h3>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#FF9933] flex items-center justify-center text-black font-bold text-base shadow-sm">
            {adminEmail[0].toUpperCase()}
          </div>
          <div>
            <p className="text-base font-semibold text-white">{adminEmail}</p>
            <p className="text-xs text-[#737373] mt-0.5">Role: Primary Administrator · Full Database Privileges</p>
          </div>
        </div>
      </div>

      {/* Change password */}
      <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-6 space-y-5">
        <div>
          <h3 className="text-sm font-semibold text-white">Change Admin Password</h3>
          <p className="text-xs text-[#737373] mt-1">
            Update your authentication password. Minimum 8 characters required.
          </p>
        </div>

        {msg && (
          <div className={`p-3.5 rounded-lg text-sm flex items-start gap-2.5 ${
            msg.type === 'success'
              ? 'bg-[#0d2b1a] border border-[#2E9E5B] text-[#2E9E5B]'
              : 'bg-[#1a0808] border border-[#E5484D] text-[#E5484D]'
          }`}>
            <span>{msg.type === 'success' ? '✓' : '⚠'}</span>
            <span>{msg.text}</span>
          </div>
        )}

        <form onSubmit={handleChange} className="space-y-4">
          <PwField label="Current password" value={current} onChange={setCurrent}
            show={showCurrent} onToggle={() => setShowCurrent(v => !v)} placeholder="Enter current password" />
          <PwField label="New password" value={next} onChange={setNext}
            show={showNext} onToggle={() => setShowNext(v => !v)} placeholder="Min. 8 characters" />
          <PwField label="Confirm new password" value={confirm} onChange={setConfirm}
            show={showNext} onToggle={() => setShowNext(v => !v)} placeholder="Repeat new password" />

          <button type="submit"
            className="h-11 px-6 rounded-lg bg-[#FF9933] text-black font-semibold text-sm hover:bg-[#ffa94d] transition-colors cursor-pointer">
            Update password
          </button>
        </form>
      </div>

      {/* Session */}
      <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-6 space-y-3">
        <h3 className="text-xs font-semibold text-[#E5484D] uppercase tracking-wider">Active Session</h3>
        <p className="text-xs text-[#737373]">
          Terminates the current administrative session on this browser.
        </p>
        <button onClick={logoutAdmin}
          className="h-10 px-5 rounded-lg bg-[#1A1A1A] border border-[#2E2E2E] text-xs font-medium text-[#E5484D] hover:bg-[#E5484D] hover:text-white transition-colors cursor-pointer">
          Sign out of admin
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN ADMIN AREA WITH SIDEBAR DASHBOARD LAYOUT
═══════════════════════════════════════════════════════════════ */
export function AdminArea() {
  const {
    adminUser,
    isAuthLoading,
    logoutAdmin,
    waitlist,
    feedback,
    setSelectedWaitlistEntry,
    updateWaitlistStatus,
    deleteWaitlistEntry,
    bulkUpdateWaitlistStatus,
    bulkDeleteWaitlist,
    exportWaitlistCSV,
    updateFeedbackStatus,
    updateFeedbackTags,
    deleteFeedbackEntry,
  } = useApp();

  const [tab, setTab] = useState<AdminTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Waitlist filters
  const [wSearch, setWSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | WaitlistStatus>('All');
  const [roleFilter, setRoleFilter] = useState<'All' | RoleType>('All');
  const [featureFilter, setFeatureFilter] = useState<'All' | FeatureType>('All');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkConfirmDelete, setBulkConfirmDelete] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Feedback filters
  const [fbSearch, setFbSearch] = useState('');
  const [fbTypeFilter, setFbTypeFilter] = useState<'All' | FeedbackKind>('All');
  const [fbStatusFilter, setFbStatusFilter] = useState<'All' | FeedbackStatus>('All');
  const [newTagInput, setNewTagInput] = useState<{ [id: string]: string }>({});

  /* ── auth resolving: show loading screen so login form never flashes ── */
  if (isAuthLoading && !adminUser) {
    return <AdminLoadingScreen />;
  }

  /* ── definitively not signed in ── */
  if (!adminUser) {
    return <SignInScreen />;
  }

  /* ── computed data ── */
  const newWlCount = waitlist.filter((w) => w.status === 'New').length;
  const newFbCount = feedback.filter((f) => f.status === 'New').length;

  const filteredWl = waitlist
    .filter((item) => {
      if (wSearch.trim()) {
        const q = wSearch.toLowerCase();
        if (!item.name.toLowerCase().includes(q) && !item.email.toLowerCase().includes(q) && !(item.place?.toLowerCase().includes(q))) return false;
      }
      if (statusFilter !== 'All' && item.status !== statusFilter) return false;
      if (roleFilter !== 'All' && item.role !== roleFilter) return false;
      if (featureFilter !== 'All' && item.firstFeature !== featureFilter) return false;
      return true;
    })
    .sort((a, b) => {
      const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return sortOrder === 'newest' ? diff : -diff;
    });

  const filteredFb = feedback.filter((item) => {
    if (fbSearch.trim()) {
      const q = fbSearch.toLowerCase();
      if (!item.message.toLowerCase().includes(q) && !(item.name?.toLowerCase().includes(q)) && !(item.email?.toLowerCase().includes(q))) return false;
    }
    if (fbTypeFilter !== 'All' && item.kind !== fbTypeFilter) return false;
    if (fbStatusFilter !== 'All' && item.status !== fbStatusFilter) return false;
    return true;
  });

  /* ── two-step delete ── */
  const twoStepDelete = (id: string, onDelete: () => void) => {
    if (confirmDeleteId === id) { onDelete(); setConfirmDeleteId(null); }
    else { setConfirmDeleteId(id); setTimeout(() => setConfirmDeleteId((c) => c === id ? null : c), 4000); }
  };

  /* ── bulk handlers ── */
  const handleSelectAll = (checked: boolean) => setSelectedIds(checked ? filteredWl.map((w) => w.id) : []);
  const handleSelectRow = (id: string, checked: boolean) =>
    setSelectedIds((prev) => checked ? [...prev, id] : prev.filter((i) => i !== id));

  /* ── shared input class ── */
  const filterCls = 'h-10 px-3 rounded-lg bg-[#0A0A0A] border border-[#2E2E2E] text-xs text-white focus:border-[#FF9933] focus:outline-none cursor-pointer';

  /* ── Sidebar Nav Item ── */
  const NavItem = ({
    id,
    label,
    icon,
    badge,
  }: {
    id: AdminTab;
    label: string;
    icon: React.ReactNode;
    badge?: number;
  }) => {
    const isActive = tab === id;
    return (
      <button
        onClick={() => {
          setTab(id);
          setMobileMenuOpen(false);
        }}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
          isActive
            ? 'bg-[#FF9933] text-black font-semibold shadow-sm shadow-[#FF9933]/10'
            : 'text-[#A3A3A3] hover:text-white hover:bg-[#1A1A1A]'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className={isActive ? 'text-black' : 'text-[#737373]'}>{icon}</span>
          <span>{label}</span>
        </div>
        {badge != null && badge > 0 && (
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-bold ${
              isActive ? 'bg-black text-[#FF9933]' : 'bg-[#FF9933] text-black'
            }`}
          >
            {badge}
          </span>
        )}
      </button>
    );
  };

  // Titles for current section
  const sectionMeta: Record<AdminTab, { title: string; subtitle: string }> = {
    overview: {
      title: 'Chambers Overview',
      subtitle: `Dashboard analytics & real-time intake across Nepal's bar`,
    },
    waitlist: {
      title: 'Waitlist Directory',
      subtitle: `Manage advocates, roles, verification status, and outreach (${waitlist.length} total)`,
    },
    feedback: {
      title: 'Practitioner Feedback',
      subtitle: `Feature wishlist, bug reports, and suggestions from advocates (${feedback.length} items)`,
    },
    settings: {
      title: 'Security & Settings',
      subtitle: 'Manage administrative credentials and system configuration',
    },
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col md:flex-row font-sans selection:bg-[#FF9933] selection:text-[#0A0A0A]">
      {/* ── Mobile Header ── */}
      <div className="md:hidden bg-[#0D0D0D] border-b border-[#1E1E1E] px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <JuriciousLogo variant="mark" size="sm" />
          <span className="font-serif font-bold text-base text-white">Juricious Admin</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-[#1A1A1A] text-white border border-[#2E2E2E]"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          )}
        </button>
      </div>

      {/* ── Mobile Backdrop Overlay ── */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 md:hidden backdrop-blur-xs"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ── SIDEBAR NAVIGATION ── */}
      <aside
        className={`fixed md:sticky top-0 inset-y-0 left-0 z-50 w-72 bg-[#0D0D0D] border-r border-[#1E1E1E] flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Branding */}
        <div className="p-5 border-b border-[#1E1E1E]">
          <div className="flex items-center justify-between mb-4">
            <JuriciousLogo variant="horizontal" size="sm" theme="dark" />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden text-[#737373] hover:text-white p-1"
            >
              ✕
            </button>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] font-mono tracking-wider uppercase text-[#737373] font-semibold">
              Admin Console
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1A1A1A] border border-[#262626] text-[#2E9E5B] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E9E5B] animate-pulse" />
              Live Connected
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 px-3 py-5 space-y-6 overflow-y-auto">
          {/* Main Links */}
          <div className="space-y-1">
            <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-[#555555]">
              Core Database
            </div>
            <NavItem
              id="overview"
              label="Overview"
              badge={undefined}
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="9"/>
                  <rect x="14" y="3" width="7" height="5"/>
                  <rect x="14" y="12" width="7" height="9"/>
                  <rect x="3" y="16" width="7" height="5"/>
                </svg>
              }
            />
            <NavItem
              id="waitlist"
              label="Waitlist Directory"
              badge={newWlCount}
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              }
            />
            <NavItem
              id="feedback"
              label="Feedback & Ideas"
              badge={newFbCount}
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              }
            />
          </div>

          {/* System & Settings */}
          <div className="space-y-1">
            <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-[#555555]">
              System
            </div>
            <NavItem
              id="settings"
              label="Security & Settings"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
              }
            />
          </div>

          {/* Quick Actions / Shortcut */}
          <div className="p-3 bg-[#111111] border border-[#1E1E1E] rounded-xl space-y-2">
            <span className="text-[10px] font-semibold text-[#737373] uppercase tracking-wider block">
              Quick Export
            </span>
            <button
              onClick={() => exportWaitlistCSV()}
              className="w-full h-8 px-3 rounded bg-[#1A1A1A] hover:bg-[#262626] border border-[#2E2E2E] text-xs text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-medium"
            >
              <span>📥 Export CSV</span>
            </button>
            <a
              href="/"
              className="w-full h-8 px-3 rounded text-xs text-[#737373] hover:text-white transition-colors flex items-center justify-center gap-1.5"
            >
              <span>View Public Showcase ↗</span>
            </a>
          </div>
        </div>

        {/* User Profile Card at Bottom */}
        <div className="p-4 border-t border-[#1E1E1E] bg-[#0A0A0A]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#FF9933] flex items-center justify-center text-black font-bold text-xs shrink-0">
                {adminUser.email[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate" title={adminUser.email}>
                  {adminUser.email}
                </p>
                <p className="text-[10px] text-[#737373]">Admin</p>
              </div>
            </div>
            <button
              onClick={logoutAdmin}
              title="Sign out"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#737373] hover:text-[#E5484D] hover:bg-[#1A1A1A] transition-colors cursor-pointer shrink-0"
              aria-label="Sign out"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Top Header Bar */}
        <header className="bg-[#0A0A0A] border-b border-[#1E1E1E] px-6 sm:px-8 py-5 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
          <div>
            <h1 className="font-serif font-bold text-xl sm:text-2xl text-white">
              {sectionMeta[tab].title}
            </h1>
            <p className="text-xs text-[#737373] mt-0.5">
              {sectionMeta[tab].subtitle}
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            {tab === 'waitlist' && (
              <button
                onClick={() => exportWaitlistCSV(filteredWl)}
                className="h-9 px-3 rounded-lg bg-[#111111] border border-[#2E2E2E] text-xs text-white hover:bg-[#1A1A1A] transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
              >
                <span>📥 Export View CSV</span>
              </button>
            )}
            <div className="h-4 w-px bg-[#262626]" />
            <span className="text-xs font-mono text-[#737373]">
              Bikram Sambat 2083
            </span>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full">
          {/* ══════════ OVERVIEW ══════════ */}
          {tab === 'overview' && (
            <div className="space-y-6">
              {/* Stat tiles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    label: 'Total on waitlist',
                    value: waitlist.length,
                    sub: `${newWlCount} new in 24h`,
                    color: '#FF9933',
                  },
                  {
                    label: 'Contacted',
                    value: waitlist.filter((w) => w.status === 'Contacted').length,
                    sub: 'advocates reached',
                    color: '#2E9E5B',
                  },
                  {
                    label: 'Feedback items',
                    value: feedback.length,
                    sub: `${newFbCount} unreviewed suggestions`,
                    color: '#F2C14E',
                  },
                ].map((tile) => (
                  <div key={tile.label} className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-5 space-y-2">
                    <p className="text-xs text-[#737373] uppercase tracking-wider font-semibold">{tile.label}</p>
                    <p className="text-4xl font-bold font-serif" style={{ color: tile.color }}>{tile.value}</p>
                    <p className="text-xs text-[#555555]">{tile.sub}</p>
                  </div>
                ))}
              </div>

              {/* Recent sign-ups */}
              <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E1E1E]">
                  <h2 className="text-sm font-semibold text-white">Recent Chambers Sign-ups</h2>
                  <button onClick={() => setTab('waitlist')} className="text-xs text-[#FF9933] hover:underline font-medium">
                    View full directory →
                  </button>
                </div>
                {waitlist.length === 0 ? (
                  <div className="py-12 text-center text-[#555555] text-sm">No sign-ups yet.</div>
                ) : (
                  <div className="divide-y divide-[#1E1E1E]">
                    {waitlist.slice(0, 6).map((entry) => (
                      <div
                        key={entry.id}
                        onClick={() => setSelectedWaitlistEntry(entry)}
                        className="flex items-center justify-between px-5 py-3.5 hover:bg-[#1A1A1A] cursor-pointer transition-colors"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-white">{entry.name}</span>
                            {isWithin24Hours(entry.createdAt) && (
                              <span className="text-[10px] font-bold px-1.5 rounded bg-[#FF9933] text-black">New</span>
                            )}
                          </div>
                          <p className="text-xs text-[#737373]">{entry.email} · {entry.role}</p>
                        </div>
                        <StatusBadge status={entry.status} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══════════ WAITLIST ══════════ */}
          {tab === 'waitlist' && (
            <div className="space-y-5">
              {/* Toolbar */}
              <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-4 space-y-3">
                <div className="flex flex-col lg:flex-row gap-3">
                  <input
                    type="search"
                    value={wSearch}
                    onChange={(e) => setWSearch(e.target.value)}
                    placeholder="Search name, email or court…"
                    className="flex-1 h-10 px-3.5 rounded-lg bg-[#0A0A0A] border border-[#2E2E2E] text-sm text-white placeholder-[#555555] focus:border-[#FF9933] focus:outline-none"
                  />
                  <div className="flex flex-wrap gap-2">
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className={filterCls}>
                      <option value="All">All Statuses</option>
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Invited">Invited</option>
                    </select>
                    <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as any)} className={filterCls}>
                      <option value="All">All Roles</option>
                      <option value="Advocate">Advocate</option>
                      <option value="Junior advocate">Junior advocate</option>
                      <option value="Munshi">Munshi</option>
                      <option value="Chambers or firm owner">Chambers owner</option>
                      <option value="Other">Other</option>
                    </select>
                    <button
                      onClick={() => setSortOrder((s) => s === 'newest' ? 'oldest' : 'newest')}
                      className={`${filterCls} px-3`}
                    >
                      {sortOrder === 'newest' ? '↓ Newest' : '↑ Oldest'}
                    </button>
                    <button
                      onClick={() => exportWaitlistCSV(filteredWl)}
                      className="h-10 px-3 rounded-lg bg-[#1A1A1A] border border-[#2E2E2E] text-xs text-white hover:bg-[#262626] transition-colors flex items-center gap-1.5 cursor-pointer font-medium"
                    >
                      📥 CSV
                    </button>
                  </div>
                </div>

                {/* Bulk actions */}
                {selectedIds.length > 0 && (
                  <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <span className="text-[#FF9933] font-bold">{selectedIds.length} items selected</span>
                    <div className="flex gap-2">
                      <button onClick={() => { bulkUpdateWaitlistStatus(selectedIds, 'Contacted'); setSelectedIds([]); }}
                        className="h-8 px-3 rounded bg-[#262626] text-white hover:bg-[#333333] transition-colors cursor-pointer">
                        Mark contacted
                      </button>
                      <button onClick={() => exportWaitlistCSV(waitlist.filter((w) => selectedIds.includes(w.id)))}
                        className="h-8 px-3 rounded bg-[#262626] text-white hover:bg-[#333333] transition-colors cursor-pointer">
                        Export selected
                      </button>
                      <button
                        onClick={() => {
                          if (!bulkConfirmDelete) { setBulkConfirmDelete(true); setTimeout(() => setBulkConfirmDelete(false), 4000); }
                          else { bulkDeleteWaitlist(selectedIds); setSelectedIds([]); setBulkConfirmDelete(false); }
                        }}
                        className={`h-8 px-3 rounded font-bold transition-colors cursor-pointer ${bulkConfirmDelete ? 'bg-[#E5484D] text-white animate-pulse' : 'bg-[#262626] text-[#E5484D] hover:bg-[#333333]'}`}
                      >
                        {bulkConfirmDelete ? 'Confirm delete' : 'Delete selected'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Table */}
              <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl overflow-hidden">
                {filteredWl.length === 0 ? (
                  <div className="py-16 text-center space-y-2">
                    <p className="text-sm font-semibold text-white">{waitlist.length === 0 ? 'No sign-ups yet.' : 'Nothing matches your search.'}</p>
                    <p className="text-xs text-[#555555]">
                      {waitlist.length === 0 ? 'Entries will appear here as people join.' : (
                        <button onClick={() => { setWSearch(''); setStatusFilter('All'); setRoleFilter('All'); setFeatureFilter('All'); }}
                          className="text-[#FF9933] underline">Clear filters</button>
                      )}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto table-scrollbar">
                    <table className="w-full text-left text-xs border-collapse min-w-[900px]">
                      <thead>
                        <tr className="bg-[#0A0A0A] border-b border-[#1E1E1E] text-[#737373] uppercase tracking-wider font-semibold">
                          <th className="py-3.5 px-4 w-10">
                            <input type="checkbox"
                              checked={filteredWl.length > 0 && selectedIds.length === filteredWl.length}
                              onChange={(e) => handleSelectAll(e.target.checked)}
                              className="w-4 h-4 cursor-pointer accent-[#FF9933]" />
                          </th>
                          <th className="py-3.5 px-4">Name</th>
                          <th className="py-3.5 px-4">Email</th>
                          <th className="py-3.5 px-4">Phone</th>
                          <th className="py-3.5 px-4">Role</th>
                          <th className="py-3.5 px-4">Joined</th>
                          <th className="py-3.5 px-4">Status</th>
                          <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1E1E1E]">
                        {filteredWl.map((row) => (
                          <tr key={row.id} className={`hover:bg-[#1A1A1A] transition-colors ${selectedIds.includes(row.id) ? 'bg-[#1A1A1A]' : ''}`}>
                            <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                              <input type="checkbox" checked={selectedIds.includes(row.id)}
                                onChange={(e) => handleSelectRow(row.id, e.target.checked)}
                                className="w-4 h-4 cursor-pointer accent-[#FF9933]" />
                            </td>
                            <td className="py-3.5 px-4 font-semibold text-white cursor-pointer hover:text-[#FF9933]"
                              onClick={() => setSelectedWaitlistEntry(row)}>
                              <div className="flex items-center gap-2">
                                {row.name}
                                {isWithin24Hours(row.createdAt) && (
                                  <span className="text-[10px] font-bold px-1.5 rounded bg-[#FF9933] text-black">New</span>
                                )}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-[#A3A3A3] font-mono">{row.email}</td>
                            <td className="py-3.5 px-4 text-[#737373] font-mono">{row.phone || '—'}</td>
                            <td className="py-3.5 px-4 text-white">{row.role}</td>
                            <td className="py-3.5 px-4 text-[#737373] font-mono">{new Date(row.createdAt).toLocaleDateString()}</td>
                            <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                              <select value={row.status}
                                onChange={(e) => updateWaitlistStatus(row.id, e.target.value as WaitlistStatus)}
                                className={`text-xs font-bold px-2 py-1 rounded cursor-pointer border appearance-none ${
                                  row.status === 'New' ? 'bg-[#FF9933] text-black border-[#FF9933]'
                                  : row.status === 'Contacted' ? 'bg-[#2E9E5B] text-white border-[#2E9E5B]'
                                  : 'bg-[#0A0A0A] text-[#A3A3A3] border-[#333333]'
                                }`}>
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Invited">Invited</option>
                              </select>
                            </td>
                            <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end gap-2">
                                <button onClick={() => setSelectedWaitlistEntry(row)}
                                  className="h-7 px-2.5 rounded bg-[#1E1E1E] text-white hover:bg-[#262626] transition-colors cursor-pointer">
                                  Details
                                </button>
                                <button
                                  onClick={() => twoStepDelete(row.id, () => deleteWaitlistEntry(row.id))}
                                  className={`h-7 px-2.5 rounded font-bold transition-colors cursor-pointer ${
                                    confirmDeleteId === row.id ? 'bg-[#E5484D] text-white animate-pulse' : 'bg-[#1E1E1E] text-[#E5484D] hover:bg-[#262626]'
                                  }`}>
                                  {confirmDeleteId === row.id ? 'Confirm' : 'Delete'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══════════ FEEDBACK ══════════ */}
          {tab === 'feedback' && (
            <div className="space-y-5">
              {/* Filters */}
              <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-4 flex flex-col sm:flex-row gap-3">
                <input type="search" value={fbSearch} onChange={(e) => setFbSearch(e.target.value)}
                  placeholder="Search suggestions or keywords…"
                  className="flex-1 h-10 px-3.5 rounded-lg bg-[#0A0A0A] border border-[#2E2E2E] text-sm text-white placeholder-[#555555] focus:border-[#FF9933] focus:outline-none" />
                <div className="flex gap-2">
                  <select value={fbTypeFilter} onChange={(e) => setFbTypeFilter(e.target.value as any)} className={filterCls}>
                    <option value="All">All Types</option>
                    <option value="Idea">Idea</option>
                    <option value="Problem">Problem</option>
                    <option value="Question">Question</option>
                    <option value="Something else">Other</option>
                  </select>
                  <select value={fbStatusFilter} onChange={(e) => setFbStatusFilter(e.target.value as any)} className={filterCls}>
                    <option value="All">All Statuses</option>
                    <option value="New">New</option>
                    <option value="Reviewed">Reviewed</option>
                    <option value="Planned">Planned</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              </div>

              {/* Cards */}
              {filteredFb.length === 0 ? (
                <div className="bg-[#111111] border border-[#1E1E1E] rounded-xl py-16 text-center text-[#555555] text-sm">
                  No feedback entries found.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredFb.map((item) => (
                    <div key={item.id}
                      className="bg-[#111111] border border-[#1E1E1E] rounded-xl p-5 flex flex-col gap-4 hover:border-[#2E2E2E] transition-colors">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            item.kind === 'Problem' ? 'bg-[#E5484D]/15 text-[#E5484D] border border-[#E5484D]/30'
                            : item.kind === 'Idea' ? 'bg-[#FF9933]/15 text-[#FF9933] border border-[#FF9933]/30'
                            : item.kind === 'Question' ? 'bg-[#F2C14E]/15 text-[#F2C14E] border border-[#F2C14E]/30'
                            : 'bg-[#1E1E1E] text-white border border-[#2E2E2E]'
                          }`}>{item.kind}</span>
                          {isWithin24Hours(item.createdAt) && (
                            <span className="text-[10px] font-bold px-1.5 rounded bg-[#FF9933] text-black">New</span>
                          )}
                        </div>
                        <span className="text-[11px] text-[#555555] font-mono">{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>

                      {/* Message */}
                      <p className="text-sm text-white leading-relaxed flex-1">{item.message}</p>

                      {/* Sender */}
                      {(item.name || item.email) && (
                        <div className="text-xs text-[#555555] flex items-center gap-1.5 flex-wrap">
                          <span>From:</span>
                          <span className="text-white font-medium">{item.name || 'Anonymous'}</span>
                          {item.email && (
                            <a href={`mailto:${item.email}?subject=Re: Juricious Feedback`}
                              className="text-[#FF9933] hover:underline font-mono">
                              {item.email} ↗
                            </a>
                          )}
                        </div>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 items-center">
                        {item.tags.map((tag) => (
                          <span key={tag} className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-[#1A1A1A] border border-[#2E2E2E] text-[#A3A3A3]">
                            #{tag}
                            <button onClick={() => updateFeedbackTags(item.id, item.tags.filter((t) => t !== tag))}
                              className="text-[#555555] hover:text-[#E5484D] ml-0.5">×</button>
                        </span>
                        ))}
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          const v = newTagInput[item.id]?.trim();
                          if (v && !item.tags.includes(v)) { updateFeedbackTags(item.id, [...item.tags, v]); setNewTagInput({ ...newTagInput, [item.id]: '' }); }
                        }}>
                          <input type="text" value={newTagInput[item.id] || ''} onChange={(e) => setNewTagInput({ ...newTagInput, [item.id]: e.target.value })}
                            placeholder="+ tag" className="h-6 w-16 px-2 text-[11px] rounded bg-[#0A0A0A] border border-[#2E2E2E] text-white focus:outline-none focus:border-[#FF9933]" />
                        </form>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-[#1E1E1E]">
                        <select value={item.status} onChange={(e) => updateFeedbackStatus(item.id, e.target.value as FeedbackStatus)}
                          className="h-8 px-2 text-xs rounded bg-[#0A0A0A] border border-[#2E2E2E] text-white focus:border-[#FF9933] cursor-pointer">
                          <option value="New">New</option>
                          <option value="Reviewed">Reviewed</option>
                          <option value="Planned">Planned</option>
                          <option value="Done">Done</option>
                        </select>
                        <button
                          onClick={() => twoStepDelete(item.id, () => deleteFeedbackEntry(item.id))}
                          className={`h-8 px-3 rounded text-xs font-bold transition-colors cursor-pointer ${
                            confirmDeleteId === item.id ? 'bg-[#E5484D] text-white animate-pulse' : 'bg-[#1E1E1E] text-[#E5484D] hover:bg-[#262626]'
                          }`}>
                          {confirmDeleteId === item.id ? 'Confirm delete' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══════════ SETTINGS ══════════ */}
          {tab === 'settings' && <SettingsTab adminEmail={adminUser.email} />}
        </main>
      </div>

      {/* Slide-out drawer for row click */}
      <AdminWaitlistSidePanel />
    </div>
  );
}
