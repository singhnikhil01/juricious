import { WaitlistEntry, FeedbackEntry, AuditLogEntry } from './types';

// Clean empty stores — all data is fetched directly from backend PostgreSQL
export const initialWaitlistEntries: WaitlistEntry[] = [];
export const initialFeedbackEntries: FeedbackEntry[] = [];
export const initialAuditLogs: AuditLogEntry[] = [];
