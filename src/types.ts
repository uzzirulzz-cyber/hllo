export type UserRole = 'SUPER ADMIN' | 'ADMIN' | 'AGENT' | 'AI GREETER';

export type LeadStatus =
  | 'NEW'
  | 'QUALIFIED'
  | 'CONTACTED'
  | 'FOLLOW-UP'
  | 'NEGOTIATION'
  | 'CONVERTED'
  | 'LOST';

export type LeadScoreCategory = 'HOT' | 'WARM' | 'COLD';

export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

export type CampaignStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';

export type FollowUpStatus = 'PENDING' | 'COMPLETED' | 'OVERDUE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  department?: string;
  assignedLeadCount?: number;
  conversionRate?: number;
  createdAt: string;
  greetingMessage?: string;
  isAiGreeter?: boolean;
  greetingTrigger?: string;
  seatType?: 'HUMAN_AGENT' | 'AI_GREETER_BOT' | 'VIP_CONCIERGE';
}

export interface Lead {
  id: string;
  leadId: string; // e.g., HW-1001
  companyName: string;
  contactName: string;
  jobTitle: string;
  email: string;
  phone: string;
  website: string;
  industry: string;
  businessCategory?: string;
  country: string;
  city: string;
  companySize: string; // e.g. "50-200", "500-1000", "10000+"
  leadSource: string;
  leadStatus: LeadStatus;
  leadScore: number;
  scoreCategory: LeadScoreCategory;
  priority: Priority;
  tags: string[];
  notesCount: number;
  assignedUserId: string;
  assignedUserName: string;
  createdDate: string;
  lastContacted: string | null;
  nextFollowUp: string | null;
  annualRevenue?: string;
  linkedinUrl?: string;
}

export interface Company {
  id: string;
  companyName: string;
  website: string;
  industry: string;
  country: string;
  city: string;
  employees: string;
  annualRevenue: string;
  description: string;
  contactsCount: number;
  leadsCount: number;
  createdAt: string;
}

export interface Contact {
  id: string;
  companyId: string;
  companyName: string;
  name: string;
  jobTitle: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  country: string;
  city: string;
  leadStatus: LeadStatus;
  createdAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  targetIndustry: string;
  targetLocation: string;
  assignedUserNames: string[];
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  leadsTargeted: number;
  leadsContacted: number;
  qualifiedLeads: number;
  conversions: number;
  conversionRate: number;
}

export interface FollowUp {
  id: string;
  leadId: string;
  leadName: string;
  companyName: string;
  dueDate: string;
  dueTime?: string;
  status: FollowUpStatus;
  priority: Priority;
  assignedUserId: string;
  assignedUserName: string;
  notes: string;
  type: 'Call' | 'Email' | 'Meeting' | 'Demo' | 'Task';
}

export interface Activity {
  id: string;
  leadId?: string;
  leadName?: string;
  companyName?: string;
  userId: string;
  userName: string;
  type: 'LEAD_CREATED' | 'STATUS_CHANGE' | 'NOTE_ADDED' | 'EMAIL_SENT' | 'CALL_MADE' | 'FOLLOWUP_SCHEDULED' | 'CAMPAIGN_LAUNCHED';
  description: string;
  timestamp: string;
}

export interface Note {
  id: string;
  leadId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'NEW_LEAD' | 'ASSIGNED_LEAD' | 'FOLLOWUP_DUE' | 'OVERDUE' | 'CAMPAIGN_UPDATE' | 'SYSTEM';
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface LeadScoringRules {
  companySizeWeight: {
    '1-10': number;
    '11-50': number;
    '51-200': number;
    '201-1000': number;
    '1000+': number;
  };
  jobTitleWeight: {
    cLevel: number;
    vpDirector: number;
    manager: number;
    individualContributor: number;
  };
  hasWebsitePoints: number;
  hasPhonePoints: number;
  hasLinkedinPoints: number;
  verifiedEmailPoints: number;
  hotThreshold: number;
  warmThreshold: number;
}

export interface SystemSettings {
  companyName: string;
  supportEmail: string;
  currency: string;
  timezone: string;
  leadScoringRules: LeadScoringRules;
  leadStatuses: string[];
  industries: string[];
  countries: string[];
  leadSources: string[];
  apiKey: string;
  webhookUrl: string;
  enableEmailAlerts: boolean;
  enableAuditLogging: boolean;
}

export interface OutreachTemplate {
  id: string;
  name: string;
  subject: string;
  category: 'Cold Outreach' | 'Follow Up' | 'Demo Pitch' | 'Closing' | 'Re-engagement';
  body: string;
  variables: string[];
  usageCount: number;
}

export interface LeadFilterState {
  searchQuery: string;
  industry: string;
  businessCategory: string;
  country: string;
  city: string;
  companySize: string;
  leadSource: string;
  leadStatus: string;
  scoreCategory: string;
  minScore: number;
  maxScore: number;
  priority: string;
  assignedUserId: string;
}

export interface ImportPreviewItem {
  id: string;
  companyName: string;
  contactName: string;
  jobTitle: string;
  email: string;
  phone: string;
  website: string;
  industry: string;
  country: string;
  city: string;
  isValid: boolean;
  validationError?: string;
  isDuplicate?: boolean;
}
