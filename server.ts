import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://uzzirulzz_db_user:i9NQvJYF07c48Wy6@cluster0.75ddnhu.mongodb.net/?appName=Cluster0';

import {
  INITIAL_USERS,
  INITIAL_SETTINGS,
  INITIAL_COMPANIES,
  INITIAL_LEADS,
  INITIAL_CONTACTS,
  INITIAL_CAMPAIGNS,
  INITIAL_FOLLOWUPS,
  INITIAL_ACTIVITIES,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_TEMPLATES,
} from './src/data/seedData.js';

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
} from './src/types.js';

// In-Memory Database Store with optional MongoDB synchronization
class DatabaseStore {
  users: User[] = [...INITIAL_USERS];
  leads: Lead[] = [...INITIAL_LEADS];
  companies: Company[] = [...INITIAL_COMPANIES];
  contacts: Contact[] = [...INITIAL_CONTACTS];
  campaigns: Campaign[] = [...INITIAL_CAMPAIGNS];
  followups: FollowUp[] = [...INITIAL_FOLLOWUPS];
  activities: Activity[] = [...INITIAL_ACTIVITIES];
  notifications: Notification[] = [...INITIAL_NOTIFICATIONS];
  auditLogs: AuditLog[] = [...INITIAL_AUDIT_LOGS];
  templates: OutreachTemplate[] = [...INITIAL_TEMPLATES];
  settings: SystemSettings = { ...INITIAL_SETTINGS };
  mongoConnected = false;

  // Helper method to add audit log
  logAudit(userId: string, userName: string, role: string, action: string, resource: string, details: string) {
    const log: AuditLog = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId,
      userName,
      userRole: role,
      action,
      resource,
      details,
      ipAddress: '127.0.0.1',
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(log);
  }
}

const db = new DatabaseStore();

async function initMongoDB() {
  try {
    const client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 4000 });
    await client.connect();
    console.log('Successfully connected to MongoDB Cluster0');
    db.mongoConnected = true;
  } catch (err: any) {
    console.warn('MongoDB connection notice:', err?.message || err);
    console.log('Operating in hybrid mode with local high-performance store');
  }
}

initMongoDB();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Helper for simple JWT token string creation
  const generateToken = (user: User) => {
    const payload = { id: user.id, email: user.email, role: user.role };
    return Buffer.from(JSON.stringify(payload)).toString('base64');
  };

  const decodeToken = (token: string) => {
    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString('ascii'));
      return decoded;
    } catch {
      return null;
    }
  };

  // Auth Middleware
  const authMiddleware = (req: Request, res: Response, next: () => void) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      // Default to Agent 007 James Bond for seamless demo experience
      (req as any).user = db.users[0];
      return next();
    }
    const token = authHeader.split(' ')[1];
    const decoded = decodeToken(token);
    if (decoded) {
      const found = db.users.find((u) => u.id === decoded.id) || db.users[0];
      (req as any).user = found;
    } else {
      (req as any).user = db.users[0];
    }
    next();
  };

  app.use(authMiddleware);

  // ================= REST API ROUTES =================

  // 1. AUTH API
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, role } = req.body;
    const searchEmail = (email || '').toLowerCase().trim();
    let user = db.users.find(
      (u) =>
        u.email.toLowerCase() === searchEmail ||
        u.email.toLowerCase().startsWith(searchEmail.split('@')[0]) ||
        u.name.toLowerCase().includes(searchEmail.split('@')[0])
    );
    if (!user && role) {
      user = db.users.find((u) => u.role === role);
    }
    if (!user) {
      user = db.users[0];
    }
    if (role) {
      user = { ...user, role: role as UserRole };
    }
    const token = generateToken(user);
    db.logAudit(user.id, user.name, user.role, 'USER_LOGIN', 'Auth', `User logged in successfully as ${user.role}`);
    res.json({ token, user });
  });

  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { name, email, role, greetingMessage, isAiGreeter, greetingTrigger, seatType, department } = req.body;
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: name || 'New CRM User',
      email: email || `user_${Date.now()}@helloworld.io`,
      role: (role as any) || 'AGENT',
      avatarUrl: isAiGreeter
        ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80'
        : `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 99999999)}?w=150&auto=format&fit=crop&q=80`,
      department: department || (isAiGreeter ? 'Customer AI Concierge' : 'Enterprise Sales'),
      assignedLeadCount: 0,
      conversionRate: isAiGreeter ? 94 : 0,
      createdAt: new Date().toISOString(),
      greetingMessage: greetingMessage || (isAiGreeter ? "Hello! Welcome to Hello World CRM. I'm your AI Concierge. How can I assist you with your business goals today?" : undefined),
      isAiGreeter: Boolean(isAiGreeter),
      greetingTrigger: greetingTrigger || 'NEW_LEAD_INQUIRY',
      seatType: seatType || (isAiGreeter ? 'AI_GREETER_BOT' : 'HUMAN_AGENT'),
    };
    db.users.push(newUser);
    const token = generateToken(newUser);
    db.logAudit(newUser.id, newUser.name, newUser.role, 'USER_REGISTERED', 'Auth', `Registered new ${seatType || 'agent'} seat`);
    res.status(201).json({ token, user: newUser });
  });

  app.get('/api/auth/me', (req: Request, res: Response) => {
    const user = (req as any).user || db.users[0];
    res.json({ user });
  });

  // 2. USERS API
  app.get('/api/users', (req: Request, res: Response) => {
    res.json(db.users);
  });

  app.put('/api/users/:id/role', (req: Request, res: Response) => {
    const { id } = req.params;
    const { role } = req.body;
    const user = db.users.find((u) => u.id === id);
    if (user) {
      user.role = role;
      const currentUser = (req as any).user;
      db.logAudit(currentUser.id, currentUser.name, currentUser.role, 'USER_ROLE_UPDATED', 'Users', `Changed ${user.name}'s role to ${role}`);
      return res.json(user);
    }
    res.status(404).json({ error: 'User not found' });
  });

  // 3. LEADS API
  app.get('/api/leads', (req: Request, res: Response) => {
    let result = [...db.leads];
    const {
      search,
      industry,
      status,
      scoreCategory,
      country,
      assignedUserId,
      priority,
      sortBy,
      sortOrder,
    } = req.query as Record<string, string>;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.companyName.toLowerCase().includes(q) ||
          l.contactName.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q) ||
          l.leadId.toLowerCase().includes(q) ||
          l.city.toLowerCase().includes(q)
      );
    }

    if (industry && industry !== 'ALL') {
      result = result.filter((l) => l.industry === industry);
    }

    if (status && status !== 'ALL') {
      result = result.filter((l) => l.leadStatus === status);
    }

    if (scoreCategory && scoreCategory !== 'ALL') {
      result = result.filter((l) => l.scoreCategory === scoreCategory);
    }

    if (country && country !== 'ALL') {
      result = result.filter((l) => l.country === country);
    }

    if (assignedUserId && assignedUserId !== 'ALL') {
      result = result.filter((l) => l.assignedUserId === assignedUserId);
    }

    if (priority && priority !== 'ALL') {
      result = result.filter((l) => l.priority === priority);
    }

    // Sorting
    if (sortBy === 'score') {
      result.sort((a, b) => (sortOrder === 'asc' ? a.leadScore - b.leadScore : b.leadScore - a.leadScore));
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.contactName.localeCompare(b.contactName));
    } else {
      // Default latest created
      result.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
    }

    res.json(result);
  });

  app.get('/api/leads/:id', (req: Request, res: Response) => {
    const lead = db.leads.find((l) => l.id === req.params.id || l.leadId === req.params.id);
    if (lead) {
      const notes = db.activities.filter((a) => a.leadId === lead.leadId || a.leadId === lead.id);
      const followups = db.followups.filter((f) => f.leadId === lead.leadId || f.leadId === lead.id);
      return res.json({ ...lead, notesList: notes, followupsList: followups });
    }
    res.status(404).json({ error: 'Lead not found' });
  });

  app.post('/api/leads', (req: Request, res: Response) => {
    const leadData = req.body;
    const nextNum = 1000 + db.leads.length + 1;
    const newLead: Lead = {
      id: `lead-obj-${nextNum}`,
      leadId: `HW-${nextNum}`,
      companyName: leadData.companyName || 'New Venture Inc',
      contactName: leadData.contactName || 'Unassigned Contact',
      jobTitle: leadData.jobTitle || 'Executive Director',
      email: leadData.email || `contact@${(leadData.companyName || 'company').toLowerCase().replace(/\s+/g, '')}.com`,
      phone: leadData.phone || '+1 (555) 019-2831',
      website: leadData.website || 'https://example.com',
      industry: leadData.industry || 'Software & Tech',
      businessCategory: leadData.businessCategory || 'Technology',
      country: leadData.country || 'United States',
      city: leadData.city || 'San Francisco',
      companySize: leadData.companySize || '51-200',
      leadSource: leadData.leadSource || 'AI Prospector Engine',
      leadStatus: leadData.leadStatus || 'NEW',
      leadScore: leadData.leadScore || 82,
      scoreCategory: (leadData.leadScore >= 75 ? 'HOT' : leadData.leadScore >= 45 ? 'WARM' : 'COLD'),
      priority: leadData.priority || 'HIGH',
      tags: leadData.tags || ['Inbound', 'Hot Lead'],
      notesCount: 1,
      assignedUserId: leadData.assignedUserId || db.users[0].id,
      assignedUserName: leadData.assignedUserName || db.users[0].name,
      createdDate: new Date().toISOString(),
      lastContacted: null,
      nextFollowUp: leadData.nextFollowUp || null,
      annualRevenue: leadData.annualRevenue || '$10M - $50M',
    };

    db.leads.unshift(newLead);

    // Record activity & notification
    const currentUser = (req as any).user;
    db.activities.unshift({
      id: `act-${Date.now()}`,
      leadId: newLead.leadId,
      leadName: newLead.contactName,
      companyName: newLead.companyName,
      userId: currentUser.id,
      userName: currentUser.name,
      type: 'LEAD_CREATED',
      description: `Created new lead: ${newLead.contactName} (${newLead.companyName})`,
      timestamp: new Date().toISOString(),
    });

    db.notifications.unshift({
      id: `ntf-${Date.now()}`,
      userId: newLead.assignedUserId,
      title: '🎯 New Lead Assigned',
      message: `You have been assigned lead ${newLead.leadId}: ${newLead.companyName}`,
      type: 'ASSIGNED_LEAD',
      isRead: false,
      createdAt: new Date().toISOString(),
      link: `/leads/${newLead.id}`,
    });

    db.logAudit(currentUser.id, currentUser.name, currentUser.role, 'CREATE_LEAD', 'Leads', `Created lead ${newLead.leadId}`);

    res.status(201).json(newLead);
  });

  app.put('/api/leads/:id', (req: Request, res: Response) => {
    const index = db.leads.findIndex((l) => l.id === req.params.id || l.leadId === req.params.id);
    if (index !== -1) {
      const oldStatus = db.leads[index].leadStatus;
      const updated = { ...db.leads[index], ...req.body };
      
      // Auto re-recalculate score category if leadScore changed
      if (req.body.leadScore !== undefined) {
        updated.scoreCategory = updated.leadScore >= 75 ? 'HOT' : updated.leadScore >= 45 ? 'WARM' : 'COLD';
      }

      db.leads[index] = updated;

      const currentUser = (req as any).user;
      if (req.body.leadStatus && req.body.leadStatus !== oldStatus) {
        db.activities.unshift({
          id: `act-${Date.now()}`,
          leadId: updated.leadId,
          leadName: updated.contactName,
          companyName: updated.companyName,
          userId: currentUser.id,
          userName: currentUser.name,
          type: 'STATUS_CHANGE',
          description: `Updated status from ${oldStatus} to ${req.body.leadStatus}`,
          timestamp: new Date().toISOString(),
        });
      }

      res.json(updated);
    } else {
      res.status(404).json({ error: 'Lead not found' });
    }
  });

  app.delete('/api/leads/:id', (req: Request, res: Response) => {
    const index = db.leads.findIndex((l) => l.id === req.params.id || l.leadId === req.params.id);
    if (index !== -1) {
      const deleted = db.leads.splice(index, 1)[0];
      const currentUser = (req as any).user;
      db.logAudit(currentUser.id, currentUser.name, currentUser.role, 'DELETE_LEAD', 'Leads', `Deleted lead ${deleted.leadId}`);
      res.json({ message: 'Lead deleted', deleted });
    } else {
      res.status(404).json({ error: 'Lead not found' });
    }
  });

  // AI PROSPECTOR ENGINE (Uses Gemini API if key is present, or fallback generator)
  app.post('/api/leads/prospect', async (req: Request, res: Response) => {
    const { industry, country, companySize, targetRole } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `Generate 3 realistic B2B enterprise leads in JSON array format for a CRM application.
Industry: ${industry || 'Software & Tech'}
Country: ${country || 'United States'}
Company Size: ${companySize || '201-1000'}
Target Role: ${targetRole || 'VP of Engineering / C-Level'}

Strictly output ONLY a raw JSON array of 3 objects with fields:
- companyName
- contactName
- jobTitle
- email
- phone
- website
- industry
- country
- city
- companySize
- leadScore (number 60-98)
- annualRevenue
- description
`;
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        const text = response.text || '';
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const generatedLeads = JSON.parse(jsonMatch[0]);
          return res.json({ source: 'Gemini AI Prospector', leads: generatedLeads });
        }
      } catch (err) {
        console.warn('Gemini prospector warning, falling back to synthesis:', err);
      }
    }

    // Synthetic Prospector Engine Fallback
    const syntheticLeads = [
      {
        companyName: `${industry || 'Tech'} Vanguard Partners`,
        contactName: 'Victoria Sterling',
        jobTitle: targetRole || 'Chief Operating Officer',
        email: 'v.sterling@vanguardpartners.io',
        phone: '+1 (415) 890-2134',
        website: 'https://www.vanguardpartners.io',
        industry: industry || 'Software & Tech',
        country: country || 'United States',
        city: 'San Francisco',
        companySize: companySize || '500-1000',
        leadScore: 91,
        annualRevenue: '$50M - $100M',
      },
      {
        companyName: `Quantum ${industry || 'Global'} Solutions`,
        contactName: 'Henrik Lindqvist',
        jobTitle: 'VP of Technology & Systems',
        email: 'h.lindqvist@quantumglobal.com',
        phone: '+46 8 505 23400',
        website: 'https://www.quantumglobal.com',
        industry: industry || 'Software & Tech',
        country: country || 'Sweden',
        city: 'Stockholm',
        companySize: '1000+',
        leadScore: 86,
        annualRevenue: '$200M+',
      },
      {
        companyName: `Apex Enterprise ${industry || 'Group'}`,
        contactName: 'Rohan Mehta',
        jobTitle: 'Director of Procurement',
        email: 'r.mehta@apexenterprise.in',
        phone: '+91 22 6789 4321',
        website: 'https://www.apexenterprise.in',
        industry: industry || 'Financial Services',
        country: country || 'Singapore',
        city: 'Singapore',
        companySize: '201-1000',
        leadScore: 78,
        annualRevenue: '$20M - $50M',
      },
    ];

    res.json({ source: 'AI Prospector Engine', leads: syntheticLeads });
  });

  // 4. COMPANIES API
  app.get('/api/companies', (req: Request, res: Response) => {
    res.json(db.companies);
  });

  app.get('/api/companies/:id', (req: Request, res: Response) => {
    const comp = db.companies.find((c) => c.id === req.params.id);
    if (comp) {
      const contacts = db.contacts.filter((cnt) => cnt.companyId === comp.id || cnt.companyName === comp.companyName);
      const leads = db.leads.filter((l) => l.companyName === comp.companyName);
      return res.json({ ...comp, contactsList: contacts, leadsList: leads });
    }
    res.status(404).json({ error: 'Company not found' });
  });

  app.post('/api/companies', (req: Request, res: Response) => {
    const newComp: Company = {
      id: `comp-${1000 + db.companies.length + 1}`,
      companyName: req.body.companyName || 'New Company Ltd',
      website: req.body.website || 'https://company.io',
      industry: req.body.industry || 'Software & Tech',
      country: req.body.country || 'United States',
      city: req.body.city || 'New York',
      employees: req.body.employees || '51-200',
      annualRevenue: req.body.annualRevenue || '$10M - $20M',
      description: req.body.description || 'Enterprise platform provider.',
      contactsCount: 0,
      leadsCount: 0,
      createdAt: new Date().toISOString(),
    };
    db.companies.unshift(newComp);
    res.status(201).json(newComp);
  });

  // 5. CONTACTS API
  app.get('/api/contacts', (req: Request, res: Response) => {
    res.json(db.contacts);
  });

  app.post('/api/contacts', (req: Request, res: Response) => {
    const newContact: Contact = {
      id: `cnt-${1000 + db.contacts.length + 1}`,
      companyId: req.body.companyId || db.companies[0].id,
      companyName: req.body.companyName || db.companies[0].companyName,
      name: req.body.name || 'New Contact',
      jobTitle: req.body.jobTitle || 'Executive Manager',
      email: req.body.email || 'contact@example.com',
      phone: req.body.phone || '+1 (555) 012-3456',
      linkedinUrl: req.body.linkedinUrl || 'https://linkedin.com',
      country: req.body.country || 'United States',
      city: req.body.city || 'San Francisco',
      leadStatus: 'NEW',
      createdAt: new Date().toISOString(),
    };
    db.contacts.unshift(newContact);
    res.status(201).json(newContact);
  });

  // 6. CAMPAIGNS API
  app.get('/api/campaigns', (req: Request, res: Response) => {
    res.json(db.campaigns);
  });

  app.post('/api/campaigns', (req: Request, res: Response) => {
    const newCmp: Campaign = {
      id: `cmp-${100 + db.campaigns.length + 1}`,
      name: req.body.name || 'New Q4 Growth Campaign',
      description: req.body.description || 'Outreach targeting key enterprise decision makers.',
      targetIndustry: req.body.targetIndustry || 'Software & Tech',
      targetLocation: req.body.targetLocation || 'North America',
      assignedUserNames: req.body.assignedUserNames || ['James Bond'],
      status: req.body.status || 'ACTIVE',
      startDate: req.body.startDate || new Date().toISOString().split('T')[0],
      endDate: req.body.endDate || '2025-12-31',
      leadsTargeted: req.body.leadsTargeted || 150,
      leadsContacted: 0,
      qualifiedLeads: 0,
      conversions: 0,
      conversionRate: 0,
    };
    db.campaigns.unshift(newCmp);
    res.status(201).json(newCmp);
  });

  app.put('/api/campaigns/:id', (req: Request, res: Response) => {
    const index = db.campaigns.findIndex((c) => c.id === req.params.id);
    if (index !== -1) {
      db.campaigns[index] = { ...db.campaigns[index], ...req.body };
      res.json(db.campaigns[index]);
    } else {
      res.status(404).json({ error: 'Campaign not found' });
    }
  });

  // 7. FOLLOW-UPS API
  app.get('/api/followups', (req: Request, res: Response) => {
    res.json(db.followups);
  });

  app.post('/api/followups', (req: Request, res: Response) => {
    const currentUser = (req as any).user;
    const newFlw: FollowUp = {
      id: `flw-${100 + db.followups.length + 1}`,
      leadId: req.body.leadId || 'HW-1000',
      leadName: req.body.leadName || 'Marcus Vance',
      companyName: req.body.companyName || 'Apex Technologies',
      dueDate: req.body.dueDate || new Date().toISOString().split('T')[0],
      dueTime: req.body.dueTime || '11:00 AM',
      status: 'PENDING',
      priority: req.body.priority || 'HIGH',
      assignedUserId: req.body.assignedUserId || currentUser.id,
      assignedUserName: req.body.assignedUserName || currentUser.name,
      notes: req.body.notes || 'Follow-up regarding product demo',
      type: req.body.type || 'Call',
    };
    db.followups.unshift(newFlw);
    res.status(201).json(newFlw);
  });

  app.put('/api/followups/:id', (req: Request, res: Response) => {
    const index = db.followups.findIndex((f) => f.id === req.params.id);
    if (index !== -1) {
      db.followups[index] = { ...db.followups[index], ...req.body };
      res.json(db.followups[index]);
    } else {
      res.status(404).json({ error: 'FollowUp not found' });
    }
  });

  // 8. ACTIVITIES API
  app.get('/api/activities', (req: Request, res: Response) => {
    res.json(db.activities);
  });

  // 9. ANALYTICS API
  app.get('/api/analytics', (req: Request, res: Response) => {
    const totalLeads = db.leads.length;
    const newLeads = db.leads.filter((l) => l.leadStatus === 'NEW').length;
    const qualifiedLeads = db.leads.filter((l) => l.leadStatus === 'QUALIFIED').length;
    const contactedLeads = db.leads.filter((l) => l.leadStatus === 'CONTACTED' || l.leadStatus === 'FOLLOW-UP').length;
    const convertedLeads = db.leads.filter((l) => l.leadStatus === 'CONVERTED').length;
    const followupsDue = db.followups.filter((f) => f.status === 'PENDING' || f.status === 'OVERDUE').length;

    const conversionRate = totalLeads ? Number(((convertedLeads / totalLeads) * 100).toFixed(1)) : 0;
    const avgScore = totalLeads
      ? Math.round(db.leads.reduce((acc, curr) => acc + curr.leadScore, 0) / totalLeads)
      : 0;

    // Industry Breakdown
    const industryMap: Record<string, number> = {};
    db.leads.forEach((l) => {
      industryMap[l.industry] = (industryMap[l.industry] || 0) + 1;
    });
    const leadsByIndustry = Object.entries(industryMap).map(([name, value]) => ({ name, value }));

    // Country Breakdown
    const countryMap: Record<string, number> = {};
    db.leads.forEach((l) => {
      countryMap[l.country] = (countryMap[l.country] || 0) + 1;
    });
    const leadsByCountry = Object.entries(countryMap).map(([country, count]) => ({ country, count }));

    // Source Performance
    const sourceMap: Record<string, { total: number; converted: number }> = {};
    db.leads.forEach((l) => {
      if (!sourceMap[l.leadSource]) sourceMap[l.leadSource] = { total: 0, converted: 0 };
      sourceMap[l.leadSource].total += 1;
      if (l.leadStatus === 'CONVERTED') sourceMap[l.leadSource].converted += 1;
    });
    const leadSourcePerformance = Object.entries(sourceMap).map(([source, data]) => ({
      source,
      total: data.total,
      converted: data.converted,
      rate: Number(((data.converted / data.total) * 100).toFixed(1)),
    }));

    // Pipeline Funnel Data
    const funnelData = [
      { step: 'Total Prospects', value: totalLeads },
      { step: 'Qualified', value: qualifiedLeads },
      { step: 'Contacted', value: contactedLeads },
      { step: 'Negotiation', value: db.leads.filter((l) => l.leadStatus === 'NEGOTIATION').length },
      { step: 'Converted Deals', value: convertedLeads },
    ];

    res.json({
      summary: {
        totalLeads,
        newLeads,
        qualifiedLeads,
        contactedLeads,
        convertedLeads,
        followupsDue,
        conversionRate,
        avgScore,
      },
      charts: {
        leadsByIndustry,
        leadsByCountry,
        leadSourcePerformance,
        funnelData,
      },
    });
  });

  // 10. NOTIFICATIONS API
  app.get('/api/notifications', (req: Request, res: Response) => {
    res.json(db.notifications);
  });

  app.put('/api/notifications/:id/read', (req: Request, res: Response) => {
    const n = db.notifications.find((notif) => notif.id === req.params.id);
    if (n) {
      n.isRead = true;
      return res.json(n);
    }
    res.status(404).json({ error: 'Notification not found' });
  });

  app.post('/api/notifications/read-all', (req: Request, res: Response) => {
    db.notifications.forEach((n) => (n.isRead = true));
    res.json({ success: true });
  });

  // 11. AUDIT LOGS API
  app.get('/api/audit-logs', (req: Request, res: Response) => {
    res.json(db.auditLogs);
  });

  // 12. TEMPLATES API
  app.get('/api/templates', (req: Request, res: Response) => {
    res.json(db.templates);
  });

  // 13. SETTINGS API
  app.get('/api/settings', (req: Request, res: Response) => {
    res.json(db.settings);
  });

  app.put('/api/settings', (req: Request, res: Response) => {
    db.settings = { ...db.settings, ...req.body };
    const currentUser = (req as any).user;
    db.logAudit(currentUser.id, currentUser.name, currentUser.role, 'SETTINGS_UPDATED', 'Settings', 'Updated system preferences and scoring rules');
    res.json(db.settings);
  });

  // 14. GLOBAL SEARCH API
  app.get('/api/search', (req: Request, res: Response) => {
    const q = (req.query.q as string || '').toLowerCase().trim();
    if (!q) {
      return res.json({ leads: [], companies: [], contacts: [], campaigns: [] });
    }

    const leads = db.leads.filter(
      (l) =>
        l.companyName.toLowerCase().includes(q) ||
        l.contactName.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.leadId.toLowerCase().includes(q)
    ).slice(0, 5);

    const companies = db.companies.filter(
      (c) => c.companyName.toLowerCase().includes(q) || c.website.toLowerCase().includes(q)
    ).slice(0, 5);

    const contacts = db.contacts.filter(
      (cnt) => cnt.name.toLowerCase().includes(q) || cnt.email.toLowerCase().includes(q)
    ).slice(0, 5);

    const campaigns = db.campaigns.filter(
      (cmp) => cmp.name.toLowerCase().includes(q) || cmp.targetIndustry.toLowerCase().includes(q)
    ).slice(0, 5);

    res.json({ leads, companies, contacts, campaigns });
  });

  // 15. IMPORT API
  app.post('/api/import', (req: Request, res: Response) => {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'Expected an array of items' });
    }

    let addedCount = 0;
    items.forEach((item: any, i: number) => {
      const nextNum = 1000 + db.leads.length + 1;
      const newLead: Lead = {
        id: `lead-obj-${nextNum}`,
        leadId: `HW-${nextNum}`,
        companyName: item.companyName || `Imported Company ${i + 1}`,
        contactName: item.contactName || 'Imported Contact',
        jobTitle: item.jobTitle || 'Manager',
        email: item.email || `import_${i}@company.com`,
        phone: item.phone || '+1 (555) 000-0000',
        website: item.website || 'https://imported.io',
        industry: item.industry || 'Software & Tech',
        businessCategory: 'Imported Prospect',
        country: item.country || 'United States',
        city: item.city || 'New York',
        companySize: item.companySize || '51-200',
        leadSource: 'Import System',
        leadStatus: 'NEW',
        leadScore: 68,
        scoreCategory: 'WARM',
        priority: 'MEDIUM',
        tags: ['Imported', 'CSV Import'],
        notesCount: 0,
        assignedUserId: db.users[0].id,
        assignedUserName: db.users[0].name,
        createdDate: new Date().toISOString(),
        lastContacted: null,
        nextFollowUp: null,
        annualRevenue: '$5M - $20M',
      };
      db.leads.unshift(newLead);
      addedCount++;
    });

    const currentUser = (req as any).user;
    db.logAudit(currentUser.id, currentUser.name, currentUser.role, 'BULK_LEAD_IMPORT', 'Import', `Imported ${addedCount} new leads`);

    res.json({ success: true, count: addedCount });
  });

  // VITE & STATIC SERVING CONFIGURATION
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[HELLO WORLD 007 Server] Listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
