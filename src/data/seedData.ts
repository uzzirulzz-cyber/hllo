import {
  User,
  Lead,
  Company,
  Contact,
  Campaign,
  FollowUp,
  Activity,
  Note,
  Notification,
  AuditLog,
  SystemSettings,
  OutreachTemplate,
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-000',
    name: 'crdbixx',
    email: 'crdbixx@helloworld007.io',
    role: 'SUPER ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Super Admin Executive',
    assignedLeadCount: 99,
    conversionRate: 52.4,
    createdAt: '2025-01-01T08:00:00Z',
  },
  {
    id: 'usr-007',
    name: 'Creed Bixby',
    email: 'creed.bixby@helloworld007.io',
    role: 'ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    department: 'Admin & Operations Manager',
    assignedLeadCount: 45,
    conversionRate: 42.8,
    createdAt: '2025-01-01T08:00:00Z',
  },
  {
    id: 'usr-101',
    name: 'James Bond',
    email: 'agent007@helloworld.io',
    role: 'SUPER ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Executive Sales',
    assignedLeadCount: 34,
    conversionRate: 38.5,
    createdAt: '2025-01-15T08:00:00Z',
  },
  {
    id: 'usr-102',
    name: 'Sarah Connor',
    email: 's.connor@helloworld.io',
    role: 'ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    department: 'Growth & Business Dev',
    assignedLeadCount: 28,
    conversionRate: 31.2,
    createdAt: '2025-02-01T09:30:00Z',
  },
  {
    id: 'usr-103',
    name: 'Alex Mercer',
    email: 'a.mercer@helloworld.io',
    role: 'AGENT',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'Enterprise Sales',
    assignedLeadCount: 22,
    conversionRate: 27.8,
    createdAt: '2025-03-10T10:15:00Z',
  },
  {
    id: 'usr-104',
    name: 'Elena Rostova',
    email: 'e.rostova@helloworld.io',
    role: 'AGENT',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    department: 'Inside Sales',
    assignedLeadCount: 16,
    conversionRate: 24.1,
    createdAt: '2025-04-05T11:00:00Z',
  },
];

export const INITIAL_SETTINGS: SystemSettings = {
  companyName: 'HELLO WORLD 007 Enterprise',
  supportEmail: 'support@helloworld007.io',
  currency: 'USD ($)',
  timezone: 'UTC -05:00 (EST)',
  leadScoringRules: {
    companySizeWeight: {
      '1-10': 10,
      '11-50': 20,
      '51-200': 30,
      '201-1000': 40,
      '1000+': 50,
    },
    jobTitleWeight: {
      cLevel: 35,
      vpDirector: 25,
      manager: 15,
      individualContributor: 5,
    },
    hasWebsitePoints: 10,
    hasPhonePoints: 10,
    hasLinkedinPoints: 10,
    verifiedEmailPoints: 15,
    hotThreshold: 75,
    warmThreshold: 45,
  },
  leadStatuses: [
    'NEW',
    'QUALIFIED',
    'CONTACTED',
    'FOLLOW-UP',
    'NEGOTIATION',
    'CONVERTED',
    'LOST',
  ],
  industries: [
    'Software & Tech',
    'Healthcare & Bio',
    'Financial Services',
    'E-Commerce & Retail',
    'Manufacturing & Industrial',
    'Real Estate & Construction',
    'Logistics & Supply Chain',
    'Energy & CleanTech',
    'Professional Services',
    'Media & Marketing',
  ],
  countries: [
    'United States',
    'United Kingdom',
    'Germany',
    'Canada',
    'Australia',
    'Japan',
    'Singapore',
    'France',
    'Netherlands',
    'Brazil',
  ],
  leadSources: [
    'AI Prospector Engine',
    'Inbound Web Form',
    'LinkedIn Sales Navigator',
    'Conference & Tradeshow',
    'Outreach Campaign',
    'Partner Referral',
    'Cold Call',
    'Google Search',
  ],
  apiKey: 'hw007_live_sec_89f3a9d20a11c8b72d',
  webhookUrl: 'https://api.helloworld007.io/v1/webhooks/leads',
  enableEmailAlerts: true,
  enableAuditLogging: true,
};

const INDUSTRIES = [
  'Software & Tech',
  'Healthcare & Bio',
  'Financial Services',
  'E-Commerce & Retail',
  'Manufacturing & Industrial',
  'Real Estate & Construction',
  'Logistics & Supply Chain',
  'Energy & CleanTech',
  'Professional Services',
  'Media & Marketing',
];

const CITIES_BY_COUNTRY: Record<string, string[]> = {
  'United States': ['San Francisco', 'New York', 'Austin', 'Chicago', 'Seattle', 'Boston', 'Denver', 'Miami'],
  'United Kingdom': ['London', 'Manchester', 'Edinburgh', 'Birmingham', 'Bristol'],
  Germany: ['Berlin', 'Munich', 'Frankfurt', 'Hamburg'],
  Canada: ['Toronto', 'Vancouver', 'Montreal', 'Calgary'],
  Australia: ['Sydney', 'Melbourne', 'Brisbane', 'Perth'],
  Japan: ['Tokyo', 'Osaka', 'Kyoto'],
  Singapore: ['Singapore Central', 'Marina Bay', 'Changi Tech Hub'],
  France: ['Paris', 'Lyon', 'Marseille'],
  Netherlands: ['Amsterdam', 'Rotterdam', 'Utrecht'],
  Brazil: ['São Paulo', 'Rio de Janeiro', 'Curitiba'],
};

const FIRST_NAMES = [
  'Marcus', 'Sophia', 'David', 'Emma', 'Alexander', 'Olivia', 'Ethan', 'Isabella',
  'Liam', 'Mia', 'Noah', 'Charlotte', 'Lucas', 'Amelia', 'Benjamin', 'Harper',
  'Henry', 'Evelyn', 'Daniel', 'Abigail', 'Sebastian', 'Emily', 'Jack', 'Elizabeth',
  'Samuel', 'Avery', 'Jackson', 'Ella', 'Mateo', 'Scarlett', 'Owen', 'Grace',
  'Theodore', 'Chloe', 'Wyatt', 'Camila', 'Julian', 'Penelope', 'Jayden', 'Riley',
];

const LAST_NAMES = [
  'Vance', 'Chen', 'Sterling', 'Kowalski', 'Thornton', 'Nakamura', 'O\'Connor', 'Russo',
  'Hayes', 'Gupta', 'Svensson', 'Dubois', 'Wright', 'Park', 'Alvarez', 'Mercer',
  'Fletcher', 'Kim', 'Bauer', 'Moreau', 'Gallagher', 'Zhang', 'Novak', 'Silva',
  'Sinclair', 'Abe', 'Lombardi', 'Barone', 'Sorensen', 'Rios', 'Donovan', 'Tsai',
];

const TITLES = [
  'Chief Executive Officer', 'Chief Technology Officer', 'VP of Sales', 'Head of Business Development',
  'Managing Director', 'Chief Revenue Officer', 'Director of Enterprise Tech', 'VP of Procurement',
  'Head of Supply Chain', 'Lead Infrastructure Engineer', 'VP of Digital Transformation', 'Commercial Director',
  'Chief Operations Officer', 'Global Marketing Director', 'Partner Solutions Lead',
];

const COMPANY_PREFIXES = [
  'Apex', 'Quantum', 'Nexus', 'Aura', 'Vanguard', 'Hyperion', 'Starlight', 'Omni', 'Velocity', 'Titan',
  'Cipher', 'Synergy', 'Zenith', 'Echo', 'Orbit', 'Veritas', 'Lumina', 'Stratum', 'Vector', 'Pulse',
];

const COMPANY_SUFFIXES = [
  'Technologies', 'Systems', 'Solutions', 'Global', 'Labs', 'Health', 'Capital', 'Logistics',
  'Cloud', 'Networks', 'Data', 'Dynamics', 'Group', 'Ventures', 'Interactive',
];

// Helper to calculate score
function calculateScore(
  size: string,
  title: string,
  hasPhone: boolean,
  hasWebsite: boolean
): number {
  let score = 20; // base score
  if (size === '1000+') score += 35;
  else if (size === '201-1000') score += 28;
  else if (size === '51-200') score += 20;
  else score += 10;

  if (title.includes('Chief') || title.includes('CEO') || title.includes('CTO') || title.includes('COO')) score += 30;
  else if (title.includes('VP') || title.includes('Director') || title.includes('Head')) score += 22;
  else score += 12;

  if (hasPhone) score += 10;
  if (hasWebsite) score += 10;

  return Math.min(98, Math.max(15, score));
}

// Generate 30 companies
export const INITIAL_COMPANIES: Company[] = Array.from({ length: 30 }, (_, index) => {
  const prefix = COMPANY_PREFIXES[index % COMPANY_PREFIXES.length];
  const suffix = COMPANY_SUFFIXES[(index * 3) % COMPANY_SUFFIXES.length];
  const name = `${prefix} ${suffix}`;
  const industry = INDUSTRIES[index % INDUSTRIES.length];
  const countries = Object.keys(CITIES_BY_COUNTRY);
  const country = countries[index % countries.length];
  const cities = CITIES_BY_COUNTRY[country];
  const city = cities[index % cities.length];
  const employeesOptions = ['1-10', '11-50', '51-200', '201-1000', '1000+'];
  const employees = employeesOptions[(index * 2) % employeesOptions.length];
  const domain = name.toLowerCase().replace(/[^a-z0-0]/g, '') + '.io';

  const revenues = ['$1M - $5M', '$5M - $20M', '$20M - $50M', '$50M - $200M', '$200M+'];
  const annualRevenue = revenues[index % revenues.length];

  return {
    id: `comp-${1000 + index}`,
    companyName: name,
    website: `https://www.${domain}`,
    industry,
    country,
    city,
    employees,
    annualRevenue,
    description: `Leading provider of enterprise ${industry.toLowerCase()} solutions, driving global transformation and innovation.`,
    contactsCount: Math.floor(Math.random() * 4) + 1,
    leadsCount: Math.floor(Math.random() * 5) + 1,
    createdAt: new Date(Date.now() - (index * 86400000 * 3)).toISOString(),
  };
});

// Generate 100 leads
export const INITIAL_LEADS: Lead[] = Array.from({ length: 100 }, (_, index) => {
  const compIndex = index % INITIAL_COMPANIES.length;
  const company = INITIAL_COMPANIES[compIndex];
  const firstName = FIRST_NAMES[index % FIRST_NAMES.length];
  const lastName = LAST_NAMES[(index * 2) % LAST_NAMES.length];
  const contactName = `${firstName} ${lastName}`;
  const jobTitle = TITLES[index % TITLES.length];
  const domain = company.website.replace('https://www.', '');
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;
  const phone = `+1 (${300 + (index % 600)}) ${100 + (index % 800)}-${1000 + (index * 7) % 8999}`;
  const leadSource = INITIAL_SETTINGS.leadSources[index % INITIAL_SETTINGS.leadSources.length];
  const statuses = INITIAL_SETTINGS.leadStatuses as Lead['leadStatus'][];
  const leadStatus = statuses[index % statuses.length];
  const assignedUser = INITIAL_USERS[index % INITIAL_USERS.length];

  const score = calculateScore(company.employees, jobTitle, true, true);
  let scoreCategory: Lead['scoreCategory'] = 'COLD';
  if (score >= 75) scoreCategory = 'HOT';
  else if (score >= 45) scoreCategory = 'WARM';

  const priorities: Lead['priority'][] = ['HIGH', 'MEDIUM', 'LOW'];
  const priority = priorities[index % priorities.length];

  const tagPool = ['Enterprise', 'Inbound', 'High-Intent', 'Decision Maker', 'Q3 Target', 'AI-Qualified', 'Priority Account'];
  const tagCount = (index % 3) + 1;
  const tags = tagPool.slice(index % 4, index % 4 + tagCount);

  const daysAgo = index * 2;
  const createdDate = new Date(Date.now() - (daysAgo * 86400000) - (index * 3600000)).toISOString();
  const lastContacted = index % 3 === 0 ? new Date(Date.now() - ((index % 5 + 1) * 86400000)).toISOString() : null;
  const nextFollowUp = index % 2 === 0 ? new Date(Date.now() + ((index % 7 + 1) * 86400000)).toISOString() : null;

  return {
    id: `lead-obj-${1000 + index}`,
    leadId: `HW-${1000 + index}`,
    companyName: company.companyName,
    contactName,
    jobTitle,
    email,
    phone,
    website: company.website,
    industry: company.industry,
    businessCategory: `${company.industry} SaaS & Services`,
    country: company.country,
    city: company.city,
    companySize: company.employees,
    leadSource,
    leadStatus,
    leadScore: score,
    scoreCategory,
    priority,
    tags,
    notesCount: (index % 4) + 1,
    assignedUserId: assignedUser.id,
    assignedUserName: assignedUser.name,
    createdDate,
    lastContacted,
    nextFollowUp,
    annualRevenue: company.annualRevenue,
    linkedinUrl: `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
  };
});

// Generate 50 contacts from companies
export const INITIAL_CONTACTS: Contact[] = Array.from({ length: 50 }, (_, index) => {
  const company = INITIAL_COMPANIES[index % INITIAL_COMPANIES.length];
  const firstName = FIRST_NAMES[(index + 5) % FIRST_NAMES.length];
  const lastName = LAST_NAMES[(index + 3) % LAST_NAMES.length];
  const name = `${firstName} ${lastName}`;
  const jobTitle = TITLES[(index + 2) % TITLES.length];
  const domain = company.website.replace('https://www.', '');
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;
  const phone = `+1 (555) ${123 + (index * 13) % 800}-${1000 + (index * 11) % 8999}`;
  const statuses = INITIAL_SETTINGS.leadStatuses as Contact['leadStatus'][];

  return {
    id: `cnt-${1000 + index}`,
    companyId: company.id,
    companyName: company.companyName,
    name,
    jobTitle,
    email,
    phone,
    linkedinUrl: `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
    country: company.country,
    city: company.city,
    leadStatus: statuses[index % statuses.length],
    createdAt: new Date(Date.now() - (index * 86400000 * 2)).toISOString(),
  };
});

// Initial Campaigns
export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'cmp-101',
    name: 'Q3 Enterprise Software Blast 007',
    description: 'High-volume outbound campaign targeting C-suite leaders in North American tech & finance.',
    targetIndustry: 'Software & Tech',
    targetLocation: 'United States & Canada',
    assignedUserNames: ['James Bond', 'Sarah Connor'],
    status: 'ACTIVE',
    startDate: '2025-07-01',
    endDate: '2025-09-30',
    leadsTargeted: 450,
    leadsContacted: 320,
    qualifiedLeads: 112,
    conversions: 42,
    conversionRate: 13.1,
  },
  {
    id: 'cmp-102',
    name: 'Healthcare & BioTech AI Expansion',
    description: 'Specialized outreach highlighting automated diagnostic workflow and compliance.',
    targetIndustry: 'Healthcare & Bio',
    targetLocation: 'Global / APAC & EU',
    assignedUserNames: ['Alex Mercer'],
    status: 'ACTIVE',
    startDate: '2025-06-15',
    endDate: '2025-10-15',
    leadsTargeted: 280,
    leadsContacted: 210,
    qualifiedLeads: 78,
    conversions: 29,
    conversionRate: 13.8,
  },
  {
    id: 'cmp-103',
    name: 'FinTech & Capital Scale-Up',
    description: 'Targeting mid-to-large financial institution executives for custom risk modeling tools.',
    targetIndustry: 'Financial Services',
    targetLocation: 'United Kingdom & Germany',
    assignedUserNames: ['Elena Rostova', 'James Bond'],
    status: 'ACTIVE',
    startDate: '2025-05-01',
    endDate: '2025-08-31',
    leadsTargeted: 310,
    leadsContacted: 290,
    qualifiedLeads: 95,
    conversions: 38,
    conversionRate: 13.1,
  },
  {
    id: 'cmp-104',
    name: 'E-Commerce Logistics & Supply Chain Q4',
    description: 'Preparation campaign for holiday rush optimization software.',
    targetIndustry: 'E-Commerce & Retail',
    targetLocation: 'United States & Australia',
    assignedUserNames: ['Sarah Connor'],
    status: 'DRAFT',
    startDate: '2025-09-01',
    endDate: '2025-12-01',
    leadsTargeted: 600,
    leadsContacted: 0,
    qualifiedLeads: 0,
    conversions: 0,
    conversionRate: 0.0,
  },
];

// Initial Follow-ups
export const INITIAL_FOLLOWUPS: FollowUp[] = [
  {
    id: 'flw-101',
    leadId: 'HW-1000',
    leadName: 'Marcus Vance',
    companyName: 'Apex Technologies',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '10:00 AM',
    status: 'PENDING',
    priority: 'HIGH',
    assignedUserId: 'usr-101',
    assignedUserName: 'James Bond',
    notes: 'Conduct product demonstration covering security credentials and ROI calculator.',
    type: 'Demo',
  },
  {
    id: 'flw-102',
    leadId: 'HW-1002',
    leadName: 'David Sterling',
    companyName: 'Nexus Labs',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '02:30 PM',
    status: 'PENDING',
    priority: 'HIGH',
    assignedUserId: 'usr-101',
    assignedUserName: 'James Bond',
    notes: 'Review redlines on master services agreement and confirm implementation timeline.',
    type: 'Call',
  },
  {
    id: 'flw-103',
    leadId: 'HW-1005',
    leadName: 'Alexander Nakamura',
    companyName: 'Starlight Global',
    dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Overdue!
    dueTime: '11:15 AM',
    status: 'OVERDUE',
    priority: 'HIGH',
    assignedUserId: 'usr-102',
    assignedUserName: 'Sarah Connor',
    notes: 'Follow up on Q3 pilot proposal sent last Tuesday.',
    type: 'Email',
  },
  {
    id: 'flw-104',
    leadId: 'HW-1008',
    leadName: 'Liam Hayes',
    companyName: 'Velocity Cloud',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    dueTime: '04:00 PM',
    status: 'PENDING',
    priority: 'MEDIUM',
    assignedUserId: 'usr-103',
    assignedUserName: 'Alex Mercer',
    notes: 'Introductory discovery call with VP of Engineering.',
    type: 'Call',
  },
  {
    id: 'flw-105',
    leadId: 'HW-1012',
    leadName: 'Lucas Wright',
    companyName: 'Cipher Health',
    dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    dueTime: '09:30 AM',
    status: 'PENDING',
    priority: 'LOW',
    assignedUserId: 'usr-104',
    assignedUserName: 'Elena Rostova',
    notes: 'Send updated case study whitepaper for healthcare compliance.',
    type: 'Email',
  },
];

// Initial Activities
export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act-101',
    leadId: 'HW-1000',
    leadName: 'Marcus Vance',
    companyName: 'Apex Technologies',
    userId: 'usr-101',
    userName: 'James Bond',
    type: 'CALL_MADE',
    description: 'Executive call completed. Marcus confirmed $150k budget approval for Q3 deployment.',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'act-102',
    leadId: 'HW-1002',
    leadName: 'David Sterling',
    companyName: 'Nexus Labs',
    userId: 'usr-102',
    userName: 'Sarah Connor',
    type: 'STATUS_CHANGE',
    description: 'Updated lead status from QUALIFIED to NEGOTIATION.',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'act-103',
    leadId: 'HW-1007',
    leadName: 'Ethan Russo',
    companyName: 'Hyperion Capital',
    userId: 'usr-101',
    userName: 'James Bond',
    type: 'LEAD_CREATED',
    description: 'Generated new HOT lead via AI Prospector Engine with score 92/100.',
    timestamp: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: 'act-104',
    userId: 'usr-101',
    userName: 'James Bond',
    type: 'CAMPAIGN_LAUNCHED',
    description: 'Launched active campaign: Q3 Enterprise Software Blast 007 targeting 450 accounts.',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
];

// Initial Notifications
export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'ntf-101',
    userId: 'usr-101',
    title: '🔥 Hot Lead Discovered',
    message: 'AI Prospector found a new HOT lead: Marcus Vance (Apex Technologies, Score 95/100).',
    type: 'NEW_LEAD',
    isRead: false,
    createdAt: new Date(Date.now() - 1200000).toISOString(),
    link: '/leads/lead-obj-1000',
  },
  {
    id: 'ntf-102',
    userId: 'usr-101',
    title: '⏰ Follow-up Due Today',
    message: 'Product Demonstration demo with Marcus Vance scheduled for 10:00 AM today.',
    type: 'FOLLOWUP_DUE',
    isRead: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    link: '/followups',
  },
  {
    id: 'ntf-103',
    userId: 'usr-102',
    title: '⚠️ Overdue Task Alert',
    message: 'Follow-up with Alexander Nakamura (Starlight Global) is 1 day overdue.',
    type: 'OVERDUE',
    isRead: false,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    link: '/followups',
  },
  {
    id: 'ntf-104',
    userId: 'usr-101',
    title: '📊 Campaign Benchmark Reached',
    message: 'Campaign Q3 Enterprise Software Blast 007 exceeded 100 qualified leads.',
    type: 'CAMPAIGN_UPDATE',
    isRead: true,
    createdAt: new Date(Date.now() - 18000000).toISOString(),
    link: '/campaigns/cmp-101',
  },
];

// Initial Audit Logs
export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-101',
    userId: 'usr-101',
    userName: 'James Bond',
    userRole: 'SUPER ADMIN',
    action: 'SYSTEM_CONFIG_UPDATE',
    resource: 'Scoring Rules',
    details: 'Adjusted C-Level job title weight from 30 to 35 points.',
    ipAddress: '192.168.1.107',
    timestamp: new Date(Date.now() - 43200000).toISOString(),
  },
  {
    id: 'aud-102',
    userId: 'usr-102',
    userName: 'Sarah Connor',
    userRole: 'ADMIN',
    action: 'LEAD_BULK_EXPORT',
    resource: 'Leads Directory',
    details: 'Exported 100 leads to CSV format.',
    ipAddress: '192.168.1.112',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'aud-103',
    userId: 'usr-101',
    userName: 'James Bond',
    userRole: 'SUPER ADMIN',
    action: 'USER_ROLE_CHANGED',
    resource: 'User Management',
    details: 'Granted ADMIN privileges to Sarah Connor.',
    ipAddress: '192.168.1.107',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
  },
];

// Outreach Templates
export const INITIAL_TEMPLATES: OutreachTemplate[] = [
  {
    id: 'tmpl-101',
    name: 'Executive Elevator Pitch 007',
    category: 'Cold Outreach',
    subject: 'Accelerating {industry} Growth for {company_name}',
    body: `Hi {contact_name},

I noticed your work leading {company_name}'s strategic initiatives in {city}.

At HELLO WORLD 007, we help {industry} leaders streamline lead qualification and scale enterprise pipeline by over 35%.

Would you be open to a brief 10-minute executive briefing this Thursday?

Best regards,
{your_name}
HELLO WORLD 007 Enterprise`,
    variables: ['contact_name', 'company_name', 'industry', 'city', 'your_name'],
    usageCount: 142,
  },
  {
    id: 'tmpl-102',
    name: 'Post-Demo Follow-Up & Redlines',
    category: 'Follow Up',
    subject: 'Next Steps & Summary: {company_name} x HW007',
    body: `Hi {contact_name},

Thank you for your time during our demonstration earlier today.

As discussed, I have attached the customized ROI analysis and implementation roadmap for {company_name}.

Please let me know if Friday at 2 PM works to review the master agreement with your procurement team.

Best,
{your_name}`,
    variables: ['contact_name', 'company_name', 'your_name'],
    usageCount: 98,
  },
  {
    id: 'tmpl-103',
    name: 'Re-engagement & Value Check-In',
    category: 'Re-engagement',
    subject: 'New Q3 Insights for {company_name}',
    body: `Hi {contact_name},

I wanted to touch base regarding our conversation earlier this quarter around {industry} trends.

We recently published our Q3 Benchmark Report showing how mid-to-large organizations in {country} are reducing customer acquisition costs.

Would you be interested in receiving a complimentary copy tailored for {company_name}?

Best regards,
{your_name}`,
    variables: ['contact_name', 'company_name', 'industry', 'country', 'your_name'],
    usageCount: 64,
  },
];
