import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  ArrowRight,
  UserCheck,
  Building2,
  Flame,
  Award,
  ChevronRight,
  Eye,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { api } from '../../services/api';
import { Lead, LeadStatus } from '../../types';

interface SalesPipelineViewProps {
  onNavigate: (route: string) => void;
  onOpenAddLeadModal: () => void;
}

const STAGES: { id: LeadStatus; label: string; color: string; badgeBg: string }[] = [
  { id: 'NEW', label: 'New Inquiries', color: 'border-blue-500/40 bg-blue-950/20', badgeBg: 'bg-blue-500/20 text-blue-300' },
  { id: 'QUALIFIED', label: 'Qualified Deals', color: 'border-cyan-500/40 bg-cyan-950/20', badgeBg: 'bg-cyan-500/20 text-cyan-300' },
  { id: 'CONTACTED', label: 'Pitch / Contacted', color: 'border-purple-500/40 bg-purple-950/20', badgeBg: 'bg-purple-500/20 text-purple-300' },
  { id: 'FOLLOW-UP', label: 'Follow-up / Proposal', color: 'border-indigo-500/40 bg-indigo-950/20', badgeBg: 'bg-indigo-500/20 text-indigo-300' },
  { id: 'NEGOTIATION', label: 'In Negotiation', color: 'border-amber-500/40 bg-amber-950/20', badgeBg: 'bg-amber-500/20 text-amber-300' },
  { id: 'CONVERTED', label: 'Closed Won Sales', color: 'border-emerald-500/40 bg-emerald-950/20', badgeBg: 'bg-emerald-500/20 text-emerald-300' },
];

export const SalesPipelineView: React.FC<SalesPipelineViewProps> = ({
  onNavigate,
  onOpenAddLeadModal,
}) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState('ALL');
  const [dealModalLead, setDealModalLead] = useState<Lead | null>(null);
  const [dealAmount, setDealAmount] = useState<number>(25000);

  const loadPipeline = () => {
    setLoading(true);
    api.getLeads()
      .then((data) => {
        setLeads(data);
      })
      .catch((err) => console.error('Error loading pipeline:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPipeline();
  }, []);

  // Filtered leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.contactName.toLowerCase().includes(search.toLowerCase()) ||
      lead.companyName.toLowerCase().includes(search.toLowerCase()) ||
      lead.industry.toLowerCase().includes(search.toLowerCase());
    const matchesIndustry = industryFilter === 'ALL' || lead.industry === industryFilter;
    return matchesSearch && matchesIndustry;
  });

  // Calculate deal value for a lead
  const getDealValue = (lead: Lead): number => {
    if (lead.annualRevenue) {
      const parsed = parseInt(lead.annualRevenue.replace(/[^0-9]/g, ''), 10);
      if (!isNaN(parsed) && parsed > 0) return Math.round(parsed * 0.05); // 5% deal value
    }
    return (lead.leadScore * 350) + 15000;
  };

  // Pipeline metrics
  const totalPipelineValue = filteredLeads.reduce((sum, l) => sum + getDealValue(l), 0);
  const closedWonLeads = filteredLeads.filter((l) => l.leadStatus === 'CONVERTED');
  const closedWonValue = closedWonLeads.reduce((sum, l) => sum + getDealValue(l), 0);
  const winRate = filteredLeads.length > 0 ? Math.round((closedWonLeads.length / filteredLeads.length) * 100) : 0;
  const avgDealSize = filteredLeads.length > 0 ? Math.round(totalPipelineValue / filteredLeads.length) : 0;

  // Change lead status in pipeline
  const handleMoveStage = (leadId: string, newStatus: LeadStatus) => {
    api.updateLead(leadId, { leadStatus: newStatus })
      .then(() => {
        loadPipeline();
      })
      .catch((err) => console.error('Failed to update stage:', err));
  };

  const handleMarkClosedWon = (lead: Lead) => {
    setDealModalLead(lead);
    setDealAmount(getDealValue(lead));
  };

  const confirmClosedWonSale = () => {
    if (!dealModalLead) return;
    api.updateLead(dealModalLead.id, {
      leadStatus: 'CONVERTED',
      notesCount: dealModalLead.notesCount + 1,
    })
      .then(() => {
        setDealModalLead(null);
        loadPipeline();
      })
      .catch((err) => console.error('Error closing sale:', err));
  };

  const industries = Array.from(new Set(leads.map((l) => l.industry))).filter(Boolean);

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-[1700px] mx-auto text-slate-100">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 p-6 rounded-2xl border border-slate-800 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs tracking-widest uppercase mb-1">
            <TrendingUp className="w-4 h-4" /> Enterprise Sales & Deals Command
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            Sales Pipeline & Deal Flow
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track deal stages, manage pipeline velocity, and close high-value enterprise sales.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadPipeline}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all border border-slate-700"
            title="Refresh Pipeline"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={onOpenAddLeadModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 font-bold text-xs text-slate-950 shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Add New Deal / Sale
          </button>
        </div>
      </div>

      {/* REVENUE & DEAL METRICS KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Pipeline Value</div>
            <div className="text-xl font-black text-white">${totalPipelineValue.toLocaleString()}</div>
            <div className="text-[10px] text-blue-400 font-semibold">{filteredLeads.length} active opportunities</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Closed Won Sales</div>
            <div className="text-xl font-black text-emerald-400">${closedWonValue.toLocaleString()}</div>
            <div className="text-[10px] text-emerald-300 font-semibold">{closedWonLeads.length} deals converted</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Average Deal Size</div>
            <div className="text-xl font-black text-white">${avgDealSize.toLocaleString()}</div>
            <div className="text-[10px] text-amber-400 font-semibold">Per sales opportunity</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Pipeline Win Rate</div>
            <div className="text-xl font-black text-white">{winRate}%</div>
            <div className="text-[10px] text-purple-400 font-semibold">Lead to deal conversion</div>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search deals, company or contact..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 text-slate-100 pl-9 pr-3 py-2 rounded-xl border border-slate-800 text-xs focus:outline-none focus:border-emerald-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-bold shrink-0">
            <Filter className="w-3.5 h-3.5" /> Industry:
          </div>
          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="bg-slate-950 text-slate-200 text-xs font-bold py-2 px-3 rounded-xl border border-slate-800"
          >
            <option value="ALL">All Industries ({leads.length})</option>
            {industries.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KANBAN PIPELINE STAGES COLUMNS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageLeads = filteredLeads.filter((l) => l.leadStatus === stage.id);
          const stageValue = stageLeads.reduce((sum, l) => sum + getDealValue(l), 0);

          return (
            <div
              key={stage.id}
              className={`rounded-2xl border p-3 flex flex-col justify-between space-y-3 min-w-[260px] ${stage.color}`}
            >
              {/* STAGE HEADER */}
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                  <div className="font-extrabold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                    <span>{stage.label}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stage.badgeBg}`}>
                    {stageLeads.length}
                  </span>
                </div>
                <div className="text-[11px] font-bold text-emerald-400 text-right">
                  ${stageValue.toLocaleString()}
                </div>
              </div>

              {/* DEAL CARDS LIST */}
              <div className="space-y-3 overflow-y-auto max-h-[600px] pr-1">
                {stageLeads.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 text-[11px] font-medium border border-dashed border-slate-800 rounded-xl">
                    No active deals in this stage
                  </div>
                ) : (
                  stageLeads.map((lead) => {
                    const dealVal = getDealValue(lead);
                    return (
                      <div
                        key={lead.id}
                        className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/90 shadow-md hover:border-slate-700 transition-all space-y-2.5 group relative"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                              {lead.contactName}
                            </div>
                            <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mt-0.5">
                              <Building2 className="w-3 h-3 text-slate-500 shrink-0" />
                              <span className="truncate">{lead.companyName}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => onNavigate(`/leads/${lead.id}`)}
                            className="p-1 text-slate-500 hover:text-blue-400 transition-colors"
                            title="View Lead Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* DEAL ESTIMATE & SCORE */}
                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-900">
                          <span className="font-black text-emerald-400 flex items-center gap-0.5">
                            <DollarSign className="w-3 h-3" />${dealVal.toLocaleString()}
                          </span>
                          <span className="font-extrabold text-[10px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800">
                            Score {lead.leadScore}
                          </span>
                        </div>

                        {/* STAGE MOVEMENT CONTROLS */}
                        <div className="pt-2 flex items-center justify-between gap-1 border-t border-slate-900">
                          {stage.id !== 'CONVERTED' ? (
                            <button
                              onClick={() => handleMarkClosedWon(lead)}
                              className="w-full py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-[10px] shadow transition-all flex items-center justify-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3" /> Mark Won Sale
                            </button>
                          ) : (
                            <span className="w-full py-1 px-2 rounded-lg bg-emerald-950 text-emerald-400 font-extrabold text-[10px] text-center border border-emerald-800">
                              ✓ Closed Won
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CONFIRM CLOSED WON SALE MODAL */}
      {dealModalLead && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Confirm Closed Won Sale
              </h2>
              <button
                onClick={() => setDealModalLead(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-2 text-slate-300">
              <p>You are marking the deal for <strong className="text-white">{dealModalLead.contactName}</strong> at <strong className="text-blue-400">{dealModalLead.companyName}</strong> as a <span className="text-emerald-400 font-bold">Closed Won Sale</span>.</p>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Total Closed Deal Value ($ USD)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                  <input
                    type="number"
                    value={dealAmount}
                    onChange={(e) => setDealAmount(Number(e.target.value))}
                    className="w-full bg-slate-950 text-white pl-9 pr-3 py-2 rounded-xl border border-slate-800 font-bold text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setDealModalLead(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmClosedWonSale}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20"
              >
                Confirm Sale ($ {dealAmount.toLocaleString()})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
