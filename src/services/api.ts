import {
  Lead,
  Company,
  Contact,
  Campaign,
  FollowUp,
  Activity,
  Notification,
  AuditLog,
  SystemSettings,
  OutreachTemplate,
  User,
} from '../types';

const API_BASE = '/api';

async function fetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('hw007_auth_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Auth
  login: (email: string) => fetchJson<{ token: string; user: User }>(`${API_BASE}/auth/login`, { method: 'POST', body: JSON.stringify({ email }) }),
  register: (data: Partial<User>) => fetchJson<{ token: string; user: User }>(`${API_BASE}/auth/register`, { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => fetchJson<{ user: User }>(`${API_BASE}/auth/me`),

  // Users
  getUsers: () => fetchJson<User[]>(`${API_BASE}/users`),
  updateUserRole: (id: string, role: string) => fetchJson<User>(`${API_BASE}/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),

  // Leads
  getLeads: (params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson<Lead[]>(`${API_BASE}/leads?${query}`);
  },
  getLeadById: (id: string) => fetchJson<Lead & { notesList: Activity[]; followupsList: FollowUp[] }>(`${API_BASE}/leads/${id}`),
  createLead: (lead: Partial<Lead>) => fetchJson<Lead>(`${API_BASE}/leads`, { method: 'POST', body: JSON.stringify(lead) }),
  updateLead: (id: string, updates: Partial<Lead>) => fetchJson<Lead>(`${API_BASE}/leads/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),
  deleteLead: (id: string) => fetchJson<{ message: string; deleted: Lead }>(`${API_BASE}/leads/${id}`, { method: 'DELETE' }),
  prospectLeads: (filters: Record<string, string>) => fetchJson<{ source: string; leads: Partial<Lead>[] }>(`${API_BASE}/leads/prospect`, { method: 'POST', body: JSON.stringify(filters) }),

  // Companies
  getCompanies: () => fetchJson<Company[]>(`${API_BASE}/companies`),
  getCompanyById: (id: string) => fetchJson<Company & { contactsList: Contact[]; leadsList: Lead[] }>(`${API_BASE}/companies/${id}`),
  createCompany: (company: Partial<Company>) => fetchJson<Company>(`${API_BASE}/companies`, { method: 'POST', body: JSON.stringify(company) }),

  // Contacts
  getContacts: () => fetchJson<Contact[]>(`${API_BASE}/contacts`),
  createContact: (contact: Partial<Contact>) => fetchJson<Contact>(`${API_BASE}/contacts`, { method: 'POST', body: JSON.stringify(contact) }),

  // Campaigns
  getCampaigns: () => fetchJson<Campaign[]>(`${API_BASE}/campaigns`),
  createCampaign: (campaign: Partial<Campaign>) => fetchJson<Campaign>(`${API_BASE}/campaigns`, { method: 'POST', body: JSON.stringify(campaign) }),
  updateCampaign: (id: string, updates: Partial<Campaign>) => fetchJson<Campaign>(`${API_BASE}/campaigns/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),

  // Follow-ups
  getFollowups: () => fetchJson<FollowUp[]>(`${API_BASE}/followups`),
  createFollowup: (followup: Partial<FollowUp>) => fetchJson<FollowUp>(`${API_BASE}/followups`, { method: 'POST', body: JSON.stringify(followup) }),
  updateFollowup: (id: string, updates: Partial<FollowUp>) => fetchJson<FollowUp>(`${API_BASE}/followups/${id}`, { method: 'PUT', body: JSON.stringify(updates) }),

  // Activities & Analytics
  getActivities: () => fetchJson<Activity[]>(`${API_BASE}/activities`),
  getAnalytics: () => fetchJson<{ summary: any; charts: any }>(`${API_BASE}/analytics`),

  // Notifications
  getNotifications: () => fetchJson<Notification[]>(`${API_BASE}/notifications`),
  markNotificationRead: (id: string) => fetchJson<Notification>(`${API_BASE}/notifications/${id}/read`, { method: 'PUT' }),
  markAllNotificationsRead: () => fetchJson<{ success: boolean }>(`${API_BASE}/notifications/read-all`, { method: 'POST' }),

  // Audit Logs & Settings
  getAuditLogs: () => fetchJson<AuditLog[]>(`${API_BASE}/audit-logs`),
  getSettings: () => fetchJson<SystemSettings>(`${API_BASE}/settings`),
  updateSettings: (settings: Partial<SystemSettings>) => fetchJson<SystemSettings>(`${API_BASE}/settings`, { method: 'PUT', body: JSON.stringify(settings) }),

  // Templates
  getTemplates: () => fetchJson<OutreachTemplate[]>(`${API_BASE}/templates`),

  // Global Search
  globalSearch: (q: string) => fetchJson<{ leads: Lead[]; companies: Company[]; contacts: Contact[]; campaigns: Campaign[] }>(`${API_BASE}/search?q=${encodeURIComponent(q)}`),

  // Import
  importLeads: (items: any[]) => fetchJson<{ success: boolean; count: number }>(`${API_BASE}/import`, { method: 'POST', body: JSON.stringify({ items }) }),
};
