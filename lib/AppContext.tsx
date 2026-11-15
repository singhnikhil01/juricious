'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  WaitlistEntry,
  FeedbackEntry,
  AuditLogEntry,
  RoleType,
  FeatureType,
  FeedbackKind,
  FeedbackStatus,
  WaitlistStatus,
} from './types';
import { generateWaitlistCSV, downloadCSV } from './csvExport';

interface ComingSoonInfo {
  isOpen: boolean;
  featureTitle: string;
  description: string;
  statutoryRef?: string;
  featureKey?: FeatureType;
}

interface InteractiveDemoState {
  isDiaryDemoOpen: boolean;
  isSmsDemoOpen: boolean;
  isFeeDemoOpen: boolean;
  isVakalatnamaDemoOpen: boolean;
}

interface AppContextType {
  // Navigation & Page Mode
  currentView: 'public' | 'admin' | 'waitlist' | 'feedback';
  setCurrentView: (view: 'public' | 'admin' | 'waitlist' | 'feedback') => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  viewport: any;
  setViewport: (v: any) => void;

  // Form simulated states
  waitlistSimulatedState: string;
  setWaitlistSimulatedState: (s: any) => void;
  feedbackSimulatedState: string;
  setFeedbackSimulatedState: (s: any) => void;
  simulateAccessDenied: boolean;
  setSimulateAccessDenied: (v: boolean) => void;

  // Modal controls
  isWaitlistModalOpen: boolean;
  openWaitlistModal: (preselectedFeature?: FeatureType, source?: string) => void;
  closeWaitlistModal: () => void;
  preselectedFeature?: FeatureType;
  waitlistSource: string;

  isFeedbackModalOpen: boolean;
  openFeedbackModal: () => void;
  closeFeedbackModal: () => void;

  // Coming Soon Trigger Modal
  comingSoonInfo: ComingSoonInfo;
  triggerComingSoon: (title: string, description: string, featureKey?: FeatureType, statutoryRef?: string) => void;
  closeComingSoon: () => void;

  // Interactive Live Feature Previews
  demos: InteractiveDemoState;
  openDiaryDemo: () => void;
  closeDiaryDemo: () => void;
  openSmsDemo: () => void;
  closeSmsDemo: () => void;
  openFeeDemo: () => void;
  closeFeeDemo: () => void;
  openVakalatnamaDemo: () => void;
  closeVakalatnamaDemo: () => void;

  // Data Store
  waitlist: WaitlistEntry[];
  feedback: FeedbackEntry[];
  auditLogs: AuditLogEntry[];

  // Actions - Public
  submitWaitlist: (data: {
    name: string;
    email: string;
    phone?: string;
    role: RoleType;
    place?: string;
    firstFeature?: FeatureType;
    note?: string;
    consent: boolean;
    source?: string;
  }) => Promise<{ success: boolean; error?: string; errorType?: 'duplicate' | 'network' | 'rate-limit' | 'validation' }>;

  submitFeedback: (data: {
    kind: FeedbackKind;
    message: string;
    name?: string;
    email?: string;
    honeypot?: string;
  }) => Promise<{ success: boolean; error?: string }>;

  // Admin Auth & Access
  adminUser: { email: string; role: 'admin' | 'guest' } | null;
  isAuthLoading: boolean;
  adminOtpSent: boolean;
  adminError: string | null;
  sendAdminOtp: (email: string) => Promise<boolean>;
  verifyAdminOtp: (email: string, code: string, simulateRole?: 'admin' | 'guest') => Promise<boolean>;
  loginAdmin: (email: string, password: string) => Promise<boolean>;
  changeAdminPassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  logoutAdmin: () => void;

  // Admin Operations - Waitlist
  selectedWaitlistEntry: WaitlistEntry | null;
  setSelectedWaitlistEntry: (entry: WaitlistEntry | null) => void;
  updateWaitlistStatus: (id: string, status: WaitlistStatus, note?: string) => void;
  updateWaitlistInternalNotes: (id: string, notes: string) => void;
  deleteWaitlistEntry: (id: string) => void;
  bulkUpdateWaitlistStatus: (ids: string[], status: WaitlistStatus) => void;
  bulkDeleteWaitlist: (ids: string[]) => void;
  exportWaitlistCSV: (filterEntries?: WaitlistEntry[]) => void;

  // Admin Operations - Feedback
  updateFeedbackStatus: (id: string, status: FeedbackStatus) => void;
  updateFeedbackTags: (id: string, tags: string[]) => void;
  deleteFeedbackEntry: (id: string) => void;

  // Reset to default sample data
  resetSampleData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const WAITLIST_STORAGE_KEY = 'juricious_waitlist_data_v1';
const FEEDBACK_STORAGE_KEY = 'juricious_feedback_data_v1';
const AUDIT_STORAGE_KEY = 'juricious_audit_data_v1';
const ADMIN_TOKEN_KEY = 'juricious_admin_token';

const getAuthHeaders = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};
  try {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
  } catch { }
  return {};
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentView, setCurrentView] = useState<'public' | 'admin' | 'waitlist' | 'feedback'>('public');
  const [viewport, setViewport] = useState('responsive');
  const [waitlistSimulatedState, setWaitlistSimulatedState] = useState('interactive');
  const [feedbackSimulatedState, setFeedbackSimulatedState] = useState('interactive');
  const [simulateAccessDenied, setSimulateAccessDenied] = useState(false);

  const setActiveTab = (tab: string) => {
    if (tab === 'public-site' || tab === 'public') setCurrentView('public');
    else if (tab === 'admin-portal' || tab === 'admin') setCurrentView('admin');
    else if (tab === 'waitlist-form' || tab === 'waitlist') setCurrentView('waitlist');
    else if (tab === 'feedback-form' || tab === 'feedback') setCurrentView('feedback');
    else setCurrentView('public');
  };

  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [preselectedFeature, setPreselectedFeature] = useState<FeatureType | undefined>();
  const [waitlistSource, setWaitlistSource] = useState<string>('Public site button');

  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // Coming Soon Trigger Modal
  const [comingSoonInfo, setComingSoonInfo] = useState<ComingSoonInfo>({
    isOpen: false,
    featureTitle: '',
    description: '',
  });

  // Interactive Live Feature Demos
  const [demos, setDemos] = useState<InteractiveDemoState>({
    isDiaryDemoOpen: false,
    isSmsDemoOpen: false,
    isFeeDemoOpen: false,
    isVakalatnamaDemoOpen: false,
  });

  // Data Store — Real records fetched from backend PostgreSQL
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  // Fetch real records from PostgreSQL API
  const refreshDbData = async (tokenOverride?: string) => {
    try {
      const token = tokenOverride || (typeof window !== 'undefined' ? localStorage.getItem(ADMIN_TOKEN_KEY) : null);
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };
      const [wlRes, fbRes, auditRes] = await Promise.all([
        fetch('/api/admin/waitlist', { headers }).catch(() => null),
        fetch('/api/admin/feedback', { headers }).catch(() => null),
        fetch('/api/admin/audit', { headers }).catch(() => null),
      ]);

      if (wlRes && wlRes.ok) {
        const wlJson = await wlRes.json();
        if (wlJson.success && Array.isArray(wlJson.waitlist)) {
          setWaitlist(wlJson.waitlist);
        }
      }

      if (fbRes && fbRes.ok) {
        const fbJson = await fbRes.json();
        if (fbJson.success && Array.isArray(fbJson.feedback)) {
          setFeedback(fbJson.feedback);
        }
      }

      if (auditRes && auditRes.ok) {
        const auditJson = await auditRes.json();
        if (auditJson.success && Array.isArray(auditJson.auditLogs)) {
          setAuditLogs(auditJson.auditLogs);
        }
      }
    } catch (err) {
      console.error('[AppContext] Error fetching admin data from backend:', err);
    }
  };

  useEffect(() => {
    // Purge any legacy mock records from browser localStorage
    try {
      localStorage.removeItem(WAITLIST_STORAGE_KEY);
      localStorage.removeItem(FEEDBACK_STORAGE_KEY);
      localStorage.removeItem(AUDIT_STORAGE_KEY);
    } catch { }

    // Verify session with server
    const verifySession = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem(ADMIN_TOKEN_KEY) : null;
        if (!token) {
          setAdminUser(null);
          setIsAuthLoading(false);
          return;
        }

        const res = await fetch('/api/admin/auth', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const json = await res.json();
          if (json.success && json.user) {
            setAdminUser(json.user);
            try {
              localStorage.setItem('juricious_admin_session', JSON.stringify(json.user));
            } catch { }
            // Fetch live PostgreSQL data using valid token
            await refreshDbData(token);
          } else {
            setAdminUser(null);
            try {
              localStorage.removeItem('juricious_admin_session');
              localStorage.removeItem(ADMIN_TOKEN_KEY);
            } catch { }
          }
        } else {
          setAdminUser(null);
          try {
            localStorage.removeItem('juricious_admin_session');
            localStorage.removeItem(ADMIN_TOKEN_KEY);
          } catch { }
        }
      } catch { } finally {
        setIsAuthLoading(false);
      }
    };

    verifySession();
  }, []);

  // Admin Auth State — email + password
  const [adminUser, setAdminUser] = useState<{ email: string; role: 'admin' | 'guest' } | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [adminOtpSent, setAdminOtpSent] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  // Selected entry for side drawer
  const [selectedWaitlistEntry, setSelectedWaitlistEntry] = useState<WaitlistEntry | null>(null);

  useEffect(() => {
    if (selectedWaitlistEntry) {
      const fresh = waitlist.find((e) => e.id === selectedWaitlistEntry.id);
      if (fresh) setSelectedWaitlistEntry(fresh);
    }
  }, [waitlist, selectedWaitlistEntry]);

  const openWaitlistModal = (feature?: FeatureType, source: string = 'Navigation button') => {
    setPreselectedFeature(feature);
    setWaitlistSource(source);
    setIsWaitlistModalOpen(true);
  };

  const closeWaitlistModal = () => {
    setIsWaitlistModalOpen(false);
  };

  const openFeedbackModal = () => {
    setIsFeedbackModalOpen(true);
  };

  const closeFeedbackModal = () => {
    setIsFeedbackModalOpen(false);
  };

  const triggerComingSoon = (
    title: string,
    description: string,
    featureKey?: FeatureType,
    statutoryRef?: string
  ) => {
    setComingSoonInfo({
      isOpen: true,
      featureTitle: title,
      description,
      featureKey,
      statutoryRef,
    });
  };

  const closeComingSoon = () => {
    setComingSoonInfo((prev) => ({ ...prev, isOpen: false }));
  };

  // Demo dialog toggles
  const openDiaryDemo = () => setDemos((prev) => ({ ...prev, isDiaryDemoOpen: true }));
  const closeDiaryDemo = () => setDemos((prev) => ({ ...prev, isDiaryDemoOpen: false }));
  const openSmsDemo = () => setDemos((prev) => ({ ...prev, isSmsDemoOpen: true }));
  const closeSmsDemo = () => setDemos((prev) => ({ ...prev, isSmsDemoOpen: false }));
  const openFeeDemo = () => setDemos((prev) => ({ ...prev, isFeeDemoOpen: true }));
  const closeFeeDemo = () => setDemos((prev) => ({ ...prev, isFeeDemoOpen: false }));
  const openVakalatnamaDemo = () => setDemos((prev) => ({ ...prev, isVakalatnamaDemoOpen: true }));
  const closeVakalatnamaDemo = () => setDemos((prev) => ({ ...prev, isVakalatnamaDemoOpen: false }));

  // Submit Waitlist - Saves to PostgreSQL database
  const submitWaitlist = async (data: {
    name: string;
    email: string;
    phone?: string;
    role: RoleType;
    place?: string;
    firstFeature?: FeatureType;
    note?: string;
    consent: boolean;
    source?: string;
  }) => {
    const normalizedEmail = data.email.trim().toLowerCase();

    // Client-side quick check
    const isDuplicate = waitlist.some((w) => w.email.toLowerCase() === normalizedEmail);
    if (isDuplicate) {
      return { success: false, error: 'This email is already on the list.', errorType: 'duplicate' as const };
    }

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.success) {
        if (res.status === 409 || json?.errorType === 'duplicate') {
          return { success: false, error: 'This email is already on the list.', errorType: 'duplicate' as const };
        }
        return { success: false, error: json?.error || 'Could not save to database.' };
      }

      const newId = json.id || `wl_${Date.now().toString(36)}`;
      const nowISO = new Date().toISOString();

      const newEntry: WaitlistEntry = {
        id: newId,
        name: data.name.trim(),
        email: normalizedEmail,
        phone: data.phone?.trim() || undefined,
        role: data.role,
        place: data.place?.trim() || undefined,
        firstFeature: data.firstFeature,
        note: data.note?.trim() || undefined,
        consent: data.consent,
        consentTimestamp: nowISO,
        status: 'New',
        internalNotes: '',
        createdAt: nowISO,
        updatedAt: nowISO,
        source: data.source || 'Public site',
        statusHistory: [
          {
            status: 'New',
            changedAt: nowISO,
            changedBy: 'System (Public Form)',
          },
        ],
      };

      setWaitlist((prev) => [newEntry, ...prev]);
      return { success: true };
    } catch {
      return { success: false, error: 'Connection to database failed. Please retry.', errorType: 'network' as const };
    }
  };

  // Submit Feedback - Saves to PostgreSQL database
  const submitFeedback = async (data: {
    kind: FeedbackKind;
    message: string;
    name?: string;
    email?: string;
    honeypot?: string;
  }) => {
    if (data.honeypot && data.honeypot.trim().length > 0) {
      return { success: true };
    }

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success) {
        return { success: false, error: json?.error || 'Failed to submit feedback.' };
      }

      const newId = json.id || `fb_${Date.now().toString(36)}`;
      const nowISO = new Date().toISOString();

      const newEntry: FeedbackEntry = {
        id: newId,
        kind: data.kind,
        message: data.message.trim(),
        name: data.name?.trim() || undefined,
        email: data.email?.trim() || undefined,
        status: 'New',
        tags: [],
        createdAt: nowISO,
        updatedAt: nowISO,
      };

      setFeedback((prev) => [newEntry, ...prev]);
      return { success: true };
    } catch {
      return { success: false, error: 'Network error submitting feedback' };
    }
  };

  // Admin Auth — real email + password against PostgreSQL
  const loginAdmin = async (email: string, password: string): Promise<boolean> => {
    setAdminError(null);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.success) {
        setAdminError(json?.error || 'Authentication failed. Please check credentials.');
        return false;
      }

      const user = json.user || { email, role: 'admin' };
      setAdminUser(user);
      try {
        localStorage.setItem('juricious_admin_session', JSON.stringify(user));
        if (json.token) {
          localStorage.setItem(ADMIN_TOKEN_KEY, json.token);
        }
      } catch { }

      // Refresh data from PostgreSQL upon successful login
      await refreshDbData(json.token);
      return true;
    } catch {
      setAdminError('Could not reach authentication server. Is PostgreSQL running?');
      return false;
    }
  };

  const changeAdminPassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!adminUser?.email) {
      return { success: false, error: 'No active admin session.' };
    }
    if (newPassword.length < 8) {
      return { success: false, error: 'New password must be at least 8 characters.' };
    }

    try {
      const res = await fetch('/api/admin/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({
          email: adminUser.email,
          currentPassword,
          newPassword,
        }),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success) {
        return { success: false, error: json?.error || 'Failed to update password.' };
      }

      return { success: true };
    } catch {
      return { success: false, error: 'Network error while updating password.' };
    }
  };

  // Legacy stubs (kept for interface compatibility)
  const sendAdminOtp = async (_email: string): Promise<boolean> => false;
  const verifyAdminOtp = async (_email: string, _code: string, _role?: 'admin' | 'guest'): Promise<boolean> => false;

  const logoutAdmin = () => {
    fetch('/api/admin/auth', {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).catch(() => null);

    setAdminUser(null);
    setAdminOtpSent(false);
    setSelectedWaitlistEntry(null);
    setWaitlist([]);
    setFeedback([]);
    setAuditLogs([]);
    try {
      localStorage.removeItem('juricious_admin_session');
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem(WAITLIST_STORAGE_KEY);
      localStorage.removeItem(FEEDBACK_STORAGE_KEY);
      localStorage.removeItem(AUDIT_STORAGE_KEY);
    } catch { }
  };

  // Admin operations on Waitlist
  const updateWaitlistStatus = (id: string, newStatus: WaitlistStatus, note?: string) => {
    const nowISO = new Date().toISOString();
    const updatedHistory = [
      ...(waitlist.find((w) => w.id === id)?.statusHistory || []),
      {
        status: newStatus,
        changedAt: nowISO,
        changedBy: adminUser?.email || 'admin@juricious.com',
        note: note || undefined,
      },
    ];

    setWaitlist((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: newStatus,
            updatedAt: nowISO,
            statusHistory: updatedHistory,
          };
        }
        return item;
      })
    );

    // Sync to PostgreSQL
    fetch(`/api/admin/waitlist/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ status: newStatus, statusHistory: updatedHistory }),
    }).catch(console.error);
  };

  const updateWaitlistInternalNotes = (id: string, notes: string) => {
    const nowISO = new Date().toISOString();
    setWaitlist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, internalNotes: notes, updatedAt: nowISO } : item))
    );

    // Sync to PostgreSQL
    fetch(`/api/admin/waitlist/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ internalNotes: notes }),
    }).catch(console.error);
  };

  const deleteWaitlistEntry = (id: string) => {
    setWaitlist((prev) => prev.filter((item) => item.id !== id));
    if (selectedWaitlistEntry?.id === id) {
      setSelectedWaitlistEntry(null);
    }

    // Sync to PostgreSQL
    fetch(`/api/admin/waitlist/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).catch(console.error);
  };

  const bulkUpdateWaitlistStatus = (ids: string[], newStatus: WaitlistStatus) => {
    const nowISO = new Date().toISOString();
    setWaitlist((prev) =>
      prev.map((item) => {
        if (ids.includes(item.id)) {
          return {
            ...item,
            status: newStatus,
            updatedAt: nowISO,
          };
        }
        return item;
      })
    );

    // Sync to PostgreSQL
    fetch('/api/admin/waitlist', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ ids, status: newStatus }),
    }).catch(console.error);
  };

  const bulkDeleteWaitlist = (ids: string[]) => {
    setWaitlist((prev) => prev.filter((item) => !ids.includes(item.id)));
    if (selectedWaitlistEntry && ids.includes(selectedWaitlistEntry.id)) {
      setSelectedWaitlistEntry(null);
    }

    // Sync to PostgreSQL
    fetch('/api/admin/waitlist', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ ids }),
    }).catch(console.error);
  };

  const exportWaitlistCSV = (filterEntries?: WaitlistEntry[]) => {
    const entriesToExport = filterEntries || waitlist;
    const csvData = generateWaitlistCSV(entriesToExport);
    const dateStr = new Date().toISOString().split('T')[0];
    downloadCSV(`juricious-waitlist-${dateStr}.csv`, csvData);
  };

  // Feedback admin operations
  const updateFeedbackStatus = (id: string, newStatus: FeedbackStatus) => {
    const nowISO = new Date().toISOString();
    setFeedback((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus, updatedAt: nowISO } : item))
    );

    // Sync to PostgreSQL
    fetch(`/api/admin/feedback/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ status: newStatus }),
    }).catch(console.error);
  };

  const updateFeedbackTags = (id: string, tags: string[]) => {
    const nowISO = new Date().toISOString();
    setFeedback((prev) =>
      prev.map((item) => (item.id === id ? { ...item, tags, updatedAt: nowISO } : item))
    );

    // Sync to PostgreSQL
    fetch(`/api/admin/feedback/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ tags }),
    }).catch(console.error);
  };

  const deleteFeedbackEntry = (id: string) => {
    setFeedback((prev) => prev.filter((item) => item.id !== id));

    // Sync to PostgreSQL
    fetch(`/api/admin/feedback/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).catch(console.error);
  };

  const resetSampleData = () => {
    setSelectedWaitlistEntry(null);
    refreshDbData();
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        activeTab: currentView === 'public' ? 'public-site' : currentView === 'admin' ? 'admin-portal' : currentView,
        setActiveTab,
        viewport,
        setViewport,
        waitlistSimulatedState,
        setWaitlistSimulatedState,
        feedbackSimulatedState,
        setFeedbackSimulatedState,
        simulateAccessDenied,
        setSimulateAccessDenied,
        isWaitlistModalOpen,
        openWaitlistModal,
        closeWaitlistModal,
        preselectedFeature,
        waitlistSource,
        isFeedbackModalOpen,
        openFeedbackModal,
        closeFeedbackModal,
        comingSoonInfo,
        triggerComingSoon,
        closeComingSoon,
        demos,
        openDiaryDemo,
        closeDiaryDemo,
        openSmsDemo,
        closeSmsDemo,
        openFeeDemo,
        closeFeeDemo,
        openVakalatnamaDemo,
        closeVakalatnamaDemo,
        waitlist,
        feedback,
        auditLogs,
        submitWaitlist,
        submitFeedback,
        adminUser,
        isAuthLoading,
        adminOtpSent,
        adminError,
        sendAdminOtp,
        verifyAdminOtp,
        loginAdmin,
        changeAdminPassword,
        logoutAdmin,
        selectedWaitlistEntry,
        setSelectedWaitlistEntry,
        updateWaitlistStatus,
        updateWaitlistInternalNotes,
        deleteWaitlistEntry,
        bulkUpdateWaitlistStatus,
        bulkDeleteWaitlist,
        exportWaitlistCSV,
        updateFeedbackStatus,
        updateFeedbackTags,
        deleteFeedbackEntry,
        resetSampleData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
