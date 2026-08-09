import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  Flame,
  CheckCircle2,
  Plus,
  Clock,
  MessageSquare,
  History,
  FileText,
  UserCheck,
  Tag,
  Share2,
  Trash2,
  Edit,
  DollarSign,
  Linkedin,
} from 'lucide-react';
import { api } from '../../services/api';
import { Lead, LeadStatus, Priority, Activity, FollowUp } from '../../types';

interface LeadDetailViewProps {
  leadId: string;
  onBack: () => void;
  onNavigate: (route: string) => void;
}

export const LeadDetailView: React.FC<LeadDetailViewProps> = ({
  leadId,
  onBack,
  onNavigate,
}) => {
  const [lead, setLead] = useState<Lead | null>(null);
  const [notesList, setNotesList] = useState<Activity[]>([]);
  const [followupsList, setFollowupsList] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);

  // New Note state
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  // Schedule Follow-up state
  const [showFollowupModal, setShowFollowupModal] = useState(false);
  const [flwDate, setFlwDate] = useState(new Date().toISOString().split('T')[0]);
  const [flwTime, setFlwTime] = useState('10:00 AM');
  const [flwNotes, setFlwNotes] = useState('');
  const [flwType, setFlwType] = useState<'Call' | 'Email' | 'Meeting' | 'Demo'>('Call');

  const loadLeadDetails = () => {
    setLoading(true);
    api.getLeadById(leadId)
      .then((data) => {
        setLead(data);
        setNotesList(data.notesList || []);
        setFollowupsList(data.followupsList || []);
      })
      .catch((err) => console.error('Load lead error:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadLeadDetails();
  }, [leadId]);

  if (loading || !lead) {
    return (
      <div className="p-12 text-center text-slate-400 text-xs">
        Loading CRM Lead Profile...
      </div>
    );
  }

  const handleStatusChange = (newStatus: LeadStatus) => {
    api.updateLead(lead.id, { leadStatus: newStatus }).then((updated) => {
      setLead(updated);
      loadLeadDetails();
    });
  };

  const handlePriorityChange = (newPriority: Priority) => {
    api.updateLead(lead.id, { priority: newPriority }).then((updated) => {
      setLead(updated);
    });
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;
    setIsSubmittingNote(true);

    api.updateLead(lead.id, { notesCount: lead.notesCount + 1 })
      .then(() => {
        const newAct: Activity = {
          id: `act-${Date.now()}`,
          leadId: lead.leadId,
          leadName: lead.contactName,
          companyName: lead.companyName,
          userId: 'usr-101',
          userName: 'James Bond',
          type: 'NOTE_ADDED',
          description: newNoteContent,
          timestamp: new Date().toISOString(),
        };
        setNotesList([newAct, ...notesList]);
        setNewNoteContent('');
      })
      .finally(() => setIsSubmittingNote(false));
  };

  const handleScheduleFollowup = (e: React.FormEvent) => {
    e.preventDefault();
    api.createFollowup({
      leadId: lead.leadId,
      leadName: lead.contactName,
      companyName: lead.companyName,
      dueDate: flwDate,
      dueTime: flwTime,
      type: flwType,
      notes: flwNotes || 'Scheduled client follow-up',
      priority: 'HIGH',
    }).then((newFlw) => {
      setFollowupsList([newFlw, ...followupsList]);
      setShowFollowupModal(false);
      setFlwNotes('');
    });
  };

  const handleDeleteLead = () => {
    if (window.confirm(`Are you sure you want to delete lead ${lead.leadId}?`)) {
      api.deleteLead(lead.id).then(() => {
        onBack();
      });
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-slate-100">
      {/* BACK NAVIGATION BAR */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Leads Directory
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFollowupModal(true)}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1.5"
          >
            <Clock className="w-4 h-4" /> Schedule Follow-Up
          </button>
          <button
            onClick={handleDeleteLead}
            className="px-3 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 font-bold text-xs text-rose-300 border border-rose-800 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* LEAD PROFILE HEADER HERO */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/60 p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-amber-500 p-0.5 shadow-xl shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-xl font-black text-amber-400 uppercase">
              {lead.contactName.substring(0, 2)}
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                {lead.leadId}
              </span>
              <span className="text-xs font-bold text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-800">
                🔥 Score {lead.leadScore}/100 ({lead.scoreCategory})
              </span>
            </div>

            <h1 className="text-2xl font-black text-white">{lead.contactName}</h1>
            <div className="text-xs text-slate-300 font-semibold mt-0.5">
              {lead.jobTitle} • <span className="text-blue-400 font-bold">{lead.companyName}</span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-3 mt-2">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-500" /> {lead.city}, {lead.country}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Building2 className="w-3 h-3 text-slate-500" /> {lead.industry}</span>
            </div>
          </div>
        </div>

        {/* STATUS & PRIORITY CONTROLS */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3 shrink-0">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Lead Pipeline Status</label>
            <select
              value={lead.leadStatus}
              onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
              className="w-full bg-slate-900 text-xs font-bold text-white py-2 px-3 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option value="NEW">NEW</option>
              <option value="QUALIFIED">QUALIFIED</option>
              <option value="CONTACTED">CONTACTED</option>
              <option value="FOLLOW-UP">FOLLOW-UP</option>
              <option value="NEGOTIATION">NEGOTIATION</option>
              <option value="CONVERTED">CONVERTED (Closed Won)</option>
              <option value="LOST">LOST</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Priority</label>
            <select
              value={lead.priority}
              onChange={(e) => handlePriorityChange(e.target.value as Priority)}
              className="w-full bg-slate-900 text-xs font-bold text-slate-200 py-1.5 px-3 rounded-lg border border-slate-700"
            >
              <option value="HIGH">HIGH PRIORITY</option>
              <option value="MEDIUM">MEDIUM PRIORITY</option>
              <option value="LOW">LOW PRIORITY</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2-COLUMN PROFILE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details & Scoring Rules */}
        <div className="space-y-6">
          {/* Contact & Company Cards */}
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-3">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
              Contact & Account Info
            </h2>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a href={`mailto:${lead.email}`} className="hover:underline font-medium text-slate-100">{lead.email}</a>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{lead.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
                <a href={lead.website} target="_blank" rel="noreferrer" className="hover:underline text-blue-400 truncate">{lead.website}</a>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Linkedin className="w-4 h-4 text-blue-500 shrink-0" />
                <a href={lead.linkedinUrl} target="_blank" rel="noreferrer" className="hover:underline text-blue-400">LinkedIn Profile</a>
              </div>
            </div>
          </div>

          {/* Lead Scoring Breakdown */}
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-3">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>Scoring Rules Breakdown</span>
              <span className="text-amber-400 font-bold">{lead.leadScore}/100</span>
            </h2>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Company Size ({lead.companySize} emp)</span>
                <span className="text-emerald-400 font-bold">+30 pts</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Executive Title ({lead.jobTitle})</span>
                <span className="text-emerald-400 font-bold">+35 pts</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Verified Business Email</span>
                <span className="text-emerald-400 font-bold">+15 pts</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Domain & Phone Verified</span>
                <span className="text-emerald-400 font-bold">+12 pts</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-3">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-blue-400" /> Tags & Classifications
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {lead.tags.map((t, idx) => (
                <span key={idx} className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Timeline, Notes & Scheduled Follow-ups */}
        <div className="lg:col-span-2 space-y-6">
          {/* Scheduled Follow-ups List */}
          <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" /> Scheduled Follow-ups
              </h2>
              <button
                onClick={() => setShowFollowupModal(true)}
                className="text-xs font-bold text-blue-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> New Task
              </button>
            </div>

            {followupsList.length === 0 ? (
              <div className="p-4 text-center text-slate-500 text-xs">No pending follow-ups.</div>
            ) : (
              <div className="space-y-2">
                {followupsList.map((f) => (
                  <div key={f.id} className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-200">{f.type}: {f.notes}</div>
                      <div className="text-[11px] text-slate-400">Due: {f.dueDate} at {f.dueTime}</div>
                    </div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                      {f.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity Feed & Notes Form */}
          <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <MessageSquare className="w-4 h-4 text-blue-400" /> CRM Notes & Activity History
            </h2>

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="space-y-2">
              <textarea
                rows={3}
                placeholder="Log call outcome, meeting notes, or next action..."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                className="w-full bg-slate-950 text-xs text-slate-200 p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 placeholder:text-slate-500"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmittingNote || !newNoteContent.trim()}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white shadow-md disabled:opacity-50"
                >
                  Log Note
                </button>
              </div>
            </form>

            {/* Activity Stream */}
            <div className="space-y-3 pt-2">
              {notesList.map((act) => (
                <div key={act.id} className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-blue-400">{act.userName}</span>
                    <span className="text-slate-500">{new Date(act.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-slate-200">{act.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FOLLOW-UP SCHEDULER MODAL */}
      {showFollowupModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-base font-bold text-white">Schedule Follow-up Task</h3>

            <form onSubmit={handleScheduleFollowup} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Follow-up Type</label>
                <select
                  value={flwType}
                  onChange={(e) => setFlwType(e.target.value as any)}
                  className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800"
                >
                  <option value="Call">Phone Call</option>
                  <option value="Email">Email Outreach</option>
                  <option value="Meeting">Strategy Meeting</option>
                  <option value="Demo">Product Demo</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Due Date</label>
                <input
                  type="date"
                  value={flwDate}
                  onChange={(e) => setFlwDate(e.target.value)}
                  className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Time</label>
                <input
                  type="text"
                  value={flwTime}
                  onChange={(e) => setFlwTime(e.target.value)}
                  className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Agenda / Task Notes</label>
                <textarea
                  rows={2}
                  value={flwNotes}
                  onChange={(e) => setFlwNotes(e.target.value)}
                  placeholder="e.g. Review pricing terms with VP"
                  className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFollowupModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white shadow-lg"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
