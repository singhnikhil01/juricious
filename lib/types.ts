export type RoleType = 
  | 'Advocate'
  | 'Junior advocate'
  | 'Munshi'
  | 'Chambers or firm owner'
  | 'Other';

export type FeatureType =
  | 'Tareekh Dastoor reminders'
  | 'Date-sheet photo capture'
  | 'Nepal Gazette research'
  | 'Bar Council verification'
  | 'Something else';

export type WaitlistStatus = 'New' | 'Contacted' | 'Invited';

export interface StatusHistoryItem {
  status: WaitlistStatus;
  changedAt: string;
  changedBy: string;
  note?: string;
}

export interface WaitlistEntry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: RoleType;
  place?: string;
  firstFeature?: FeatureType;
  note?: string;
  consent: boolean;
  consentTimestamp: string;
  status: WaitlistStatus;
  internalNotes: string;
  createdAt: string;
  updatedAt: string;
  source: string;
  statusHistory: StatusHistoryItem[];
}

export type FeedbackKind = 'Idea' | 'Problem' | 'Question' | 'Something else';
export type FeedbackStatus = 'New' | 'Reviewed' | 'Planned' | 'Done';

export interface FeedbackEntry {
  id: string;
  kind: FeedbackKind;
  message: string;
  name?: string;
  email?: string;
  status: FeedbackStatus;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogEntry {
  id: string;
  actorEmail: string;
  action: string;
  targetEntity: 'waitlist' | 'feedback' | 'auth';
  targetId: string;
  details: string;
  timestamp: string;
}

export type ActiveTab = 
  | 'public-site' 
  | 'waitlist-form' 
  | 'feedback-form' 
  | 'admin-portal';

export type FormSimulatedState = 
  | 'interactive'
  | 'empty'
  | 'focused'
  | 'filled'
  | 'validation-error'
  | 'submitting'
  | 'success'
  | 'duplicate-email'
  | 'network-failure'
  | 'rate-limit';
