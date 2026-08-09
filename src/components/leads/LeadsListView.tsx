import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  Download,
  Trash2,
  UserCheck,
  Flame,
  CheckCircle2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  X,
  SlidersHorizontal,
  Building2,
  Mail,
  Phone,
  Tag,
  Calendar,
} from 'lucide-react';
import { api } from '../../services/api';
import { Lead, LeadStatus, Priority, User } from '../../types';

interface LeadsListViewProps {
  onNavigate: (route: string) => void;
  onOpenAddLeadModal: () => void;
}

export const LeadsListView: React.FC<LeadsListViewProps> = ({
  onNavigate,
  onOpenAddLeadModal,
}) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  // Filter States
  const [search, setSearch] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedScoreCat, setSelectedScoreCat] = useState('ALL');
  const [selectedCountry, setSelectedCountry] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');

  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const loadLeads = () => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (selectedIndustry !== 'ALL') params.industry = selectedIndustry;
    if (selectedStatus !== 'ALL') params.status = selectedStatus;
    if (selectedScoreCat !== 'ALL') params.scoreCategory = selectedScoreCat;
    if (selectedCountry !== 'ALL') params.country = selectedCountry;
    if (selectedPriority !== 'ALL') params.priority = selectedPriority;

    api.getLeads(params)
      .then((data) => {
        setLeads(data);
      })
      .catch((err) => console.error('Load leads error:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadLeads();
  }, [search, selectedIndustry, selectedStatus, selectedScoreCat, selectedCountry, selectedPriority]);

  useEffect(() => {
    api.getUsers().then(setUsers).catch(() => {});
  }, []);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(leads.map((l) => l.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selectedIds.length} selected leads?`)) {
      Promise.all(selectedIds.map((id) => api.deleteLead(id)))
        .then(() => {
          setSelectedIds([]);
          loadLeads();
        })
        .catch(() => {});
    }
  };

  const handleBulkStatusChange = (newStatus: LeadStatus) => {
    Promise.all(selectedIds.map((id) => api.updateLead(id, { leadStatus: newStatus })))
      .then(() => {
        setSelectedIds([]);
        loadLeads();
      })
      .catch(() => {});
  };

  // Pagination
  const totalPages = Math.ceil(leads.length / pageSize) || 1;
  const paginatedLeads = leads.slice((page - 1) * pageSize, page * pageSize);

  const getScoreBadge = (score: number, cat: string) => {
    if (cat === 'HOT' || score >= 75) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800/80">
          🔥 HOT {score}
        </span>
      );
    } else if (cat === 'WARM' || score >= 45) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/80">
          🟡 WARM {score}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800/80">
        🔵 COLD {score}
      </span>
    );
  };

  const getStatusBadge = (status: LeadStatus) => {
    const styles: Record<LeadStatus, string> = {
      NEW: 'bg-cyan-950/80 text-cyan-300 border-cyan-800/80',
      QUALIFIED: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80',
      CONTACTED: 'bg-blue-950/80 text-blue-300 border-blue-800/80',
      'FOLLOW-UP': 'bg-amber-950/80 text-amber-300 border-amber-800/80',
      NEGOTIATION: 'bg-purple-950/80 text-purple-300 border-purple-800/80',
      CONVERTED: 'bg-green-900/90 text-green-200 border-green-700/80 font-bold',
      LOST: 'bg-slate-800 text-slate-400 border-slate-700',
    };
    return (
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${styles[status] || 'bg-slate-800'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-slate-100">
      {/* TOP HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            Lead Management Directory <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-950 text-blue-400 border border-blue-800">{leads.length} Records</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Search, qualify, filter, assign, and manage enterprise prospects.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/export')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700/80 transition-colors"
          >
            <Download className="w-4 h-4 text-blue-400" /> Export CSV
          </button>
          <button
            onClick={onOpenAddLeadModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 font-bold text-xs text-slate-950 shadow-lg shadow-amber-500/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Lead
          </button>
        </div>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-lg space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Search */}
          <div className="relative col-span-1 sm:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search Lead ID, Contact, Company, City..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 text-xs text-slate-100 pl-9 pr-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 placeholder:text-slate-500"
            />
          </div>

          {/* Industry Filter */}
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="bg-slate-950 text-xs text-slate-200 py-2 px-3 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Industries</option>
            <option value="Software & Tech">Software & Tech</option>
            <option value="Healthcare & Bio">Healthcare & Bio</option>
            <option value="Financial Services">Financial Services</option>
            <option value="E-Commerce & Retail">E-Commerce & Retail</option>
            <option value="Manufacturing & Industrial">Manufacturing</option>
            <option value="Real Estate & Construction">Real Estate</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-950 text-xs text-slate-200 py-2 px-3 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">NEW</option>
            <option value="QUALIFIED">QUALIFIED</option>
            <option value="CONTACTED">CONTACTED</option>
            <option value="FOLLOW-UP">FOLLOW-UP</option>
            <option value="NEGOTIATION">NEGOTIATION</option>
            <option value="CONVERTED">CONVERTED</option>
            <option value="LOST">LOST</option>
          </select>

          {/* Score Tier */}
          <select
            value={selectedScoreCat}
            onChange={(e) => setSelectedScoreCat(e.target.value)}
            className="bg-slate-950 text-xs text-slate-200 py-2 px-3 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Lead Scores</option>
            <option value="HOT">🔥 HOT Tier (&ge;75)</option>
            <option value="WARM">🟡 WARM Tier (45-74)</option>
            <option value="COLD">🔵 COLD Tier (&lt;45)</option>
          </select>

          {/* Reset Filters */}
          <button
            onClick={() => {
              setSearch('');
              setSelectedIndustry('ALL');
              setSelectedStatus('ALL');
              setSelectedScoreCat('ALL');
              setSelectedCountry('ALL');
              setSelectedPriority('ALL');
            }}
            className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium transition-colors"
          >
            Reset Filters
          </button>
        </div>

        {/* BULK ACTION BAR */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between p-3 rounded-xl bg-blue-950/80 border border-blue-800/80 animate-fadeIn">
            <span className="text-xs font-bold text-blue-300">
              {selectedIds.length} lead(s) selected
            </span>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold">Change Status:</span>
              <select
                onChange={(e) => handleBulkStatusChange(e.target.value as LeadStatus)}
                defaultValue=""
                className="bg-slate-900 text-xs text-slate-200 py-1 px-2 rounded-lg border border-slate-700"
              >
                <option value="" disabled>Select Status...</option>
                <option value="NEW">NEW</option>
                <option value="QUALIFIED">QUALIFIED</option>
                <option value="CONTACTED">CONTACTED</option>
                <option value="NEGOTIATION">NEGOTIATION</option>
                <option value="CONVERTED">CONVERTED</option>
              </select>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 rounded-lg bg-rose-900/80 hover:bg-rose-800 text-rose-200 font-bold flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DATA TABLE */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Loading Leads Table...</div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            No leads match the specified filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/90 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === leads.length && leads.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-slate-700 bg-slate-900 accent-blue-600 cursor-pointer"
                    />
                  </th>
                  <th className="p-3">ID & Contact</th>
                  <th className="p-3">Company & Title</th>
                  <th className="p-3">Score</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Industry & Country</th>
                  <th className="p-3">Assigned Agent</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {paginatedLeads.map((l) => (
                  <tr
                    key={l.id}
                    className="hover:bg-slate-800/50 transition-colors group"
                  >
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(l.id)}
                        onChange={() => handleSelectOne(l.id)}
                        className="rounded border-slate-700 bg-slate-900 accent-blue-600 cursor-pointer"
                      />
                    </td>
                    <td className="p-3">
                      <div
                        onClick={() => onNavigate(`/leads/${l.id}`)}
                        className="font-bold text-slate-100 hover:text-blue-400 cursor-pointer transition-colors"
                      >
                        {l.contactName}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-2">
                        <span className="text-blue-400 font-mono font-bold">{l.leadId}</span>
                        <span>•</span>
                        <span>{l.email}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-200">{l.companyName}</div>
                      <div className="text-[10px] text-slate-400">{l.jobTitle}</div>
                    </td>
                    <td className="p-3">
                      {getScoreBadge(l.leadScore, l.scoreCategory)}
                    </td>
                    <td className="p-3">
                      {getStatusBadge(l.leadStatus)}
                    </td>
                    <td className="p-3">
                      <div className="text-slate-300 font-medium">{l.industry}</div>
                      <div className="text-[10px] text-slate-400">{l.city}, {l.country}</div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                        <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                        <span>{l.assignedUserName}</span>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onNavigate(`/leads/${l.id}`)}
                        className="px-3 py-1 rounded-lg bg-blue-950/80 hover:bg-blue-900 text-blue-300 font-bold text-[11px] border border-blue-800/80 transition-all inline-flex items-center gap-1"
                      >
                        Profile <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing <span className="text-slate-200 font-bold">{(page - 1) * pageSize + 1}</span> to{' '}
            <span className="text-slate-200 font-bold">{Math.min(page * pageSize, leads.length)}</span> of{' '}
            <span className="text-slate-200 font-bold">{leads.length}</span> records
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-slate-200 px-2">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
