import React, { useState, useEffect } from 'react';
import {
  Users,
  Sparkles,
  CheckCircle2,
  PhoneCall,
  Flame,
  CalendarClock,
  TrendingUp,
  Award,
  ArrowUpRight,
  Plus,
  BarChart3,
  Filter,
  Megaphone,
  ArrowRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';
import { api } from '../../services/api';
import { Lead } from '../../types';

interface DashboardViewProps {
  onNavigate: (route: string) => void;
  onOpenAddLeadModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenAddLeadModal,
}) => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getAnalytics(), api.getLeads({ limit: '6' })])
      .then(([analyticsData, leadsData]) => {
        setAnalytics(analyticsData);
        setRecentLeads(leadsData.slice(0, 6));
      })
      .catch((err) => console.error('Dashboard load error:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !analytics) {
    return (
      <div className="p-8 text-center text-slate-400">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading Enterprise CRM Intelligence...
      </div>
    );
  }

  const { summary, charts } = analytics;

  // Sample time series data
  const timeSeriesData = [
    { month: 'Jan', leads: 42, qualified: 18, converted: 8 },
    { month: 'Feb', leads: 58, qualified: 24, converted: 12 },
    { month: 'Mar', leads: 74, qualified: 31, converted: 15 },
    { month: 'Apr', leads: 82, qualified: 39, converted: 19 },
    { month: 'May', leads: 95, qualified: 48, converted: 24 },
    { month: 'Jun', leads: 112, qualified: 59, converted: 31 },
    { month: 'Jul', leads: 130, qualified: 72, converted: 38 },
  ];

  const COLORS = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-[1600px] mx-auto text-slate-100">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900/90 to-blue-950/40 p-6 rounded-2xl border border-slate-800 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs tracking-widest uppercase mb-1">
            <Sparkles className="w-4 h-4" /> Enterprise Lead Command Center
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            HELLO WORLD 007 Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time pipeline analytics, AI lead scoring & active conversion metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/generator')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white shadow-lg shadow-blue-600/30 transition-all"
          >
            <Sparkles className="w-4 h-4" /> AI Lead Generator
          </button>
          <button
            onClick={onOpenAddLeadModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 font-bold text-xs text-slate-950 shadow-lg shadow-amber-500/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Lead
          </button>
        </div>
      </div>

      {/* METRIC CARDS GRID (8 Metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* Total Leads */}
        <div className="bg-slate-900/90 border border-slate-800/80 p-4 rounded-2xl shadow-xl hover:border-blue-500/50 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">Total Leads</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">{summary.totalLeads}</div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-0.5 font-bold mt-1">
            <ArrowUpRight className="w-3 h-3" /> +14% vs last mo
          </div>
        </div>

        {/* New Leads */}
        <div className="bg-slate-900/90 border border-slate-800/80 p-4 rounded-2xl shadow-xl hover:border-cyan-500/50 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">New Leads</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">{summary.newLeads}</div>
          <div className="text-[10px] text-cyan-400 font-semibold mt-1">Uncontacted</div>
        </div>

        {/* Qualified Leads */}
        <div className="bg-slate-900/90 border border-slate-800/80 p-4 rounded-2xl shadow-xl hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">Qualified</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{summary.qualifiedLeads}</div>
          <div className="text-[10px] text-emerald-400 font-semibold mt-1">Ready for Pitch</div>
        </div>

        {/* Contacted */}
        <div className="bg-slate-900/90 border border-slate-800/80 p-4 rounded-2xl shadow-xl hover:border-purple-500/50 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">Contacted</span>
            <PhoneCall className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">{summary.contactedLeads}</div>
          <div className="text-[10px] text-purple-400 font-semibold mt-1">Active Touchpoints</div>
        </div>

        {/* Converted */}
        <div className="bg-slate-900/90 border border-slate-800/80 p-4 rounded-2xl shadow-xl hover:border-amber-500/50 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">Converted</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">{summary.convertedLeads}</div>
          <div className="text-[10px] text-amber-400 font-semibold mt-1">Closed Won</div>
        </div>

        {/* Follow-ups Due */}
        <div className="bg-slate-900/90 border border-slate-800/80 p-4 rounded-2xl shadow-xl hover:border-rose-500/50 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">Follow-ups</span>
            <CalendarClock className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-white">{summary.followupsDue}</div>
          <div className="text-[10px] text-rose-400 font-semibold mt-1">Pending/Overdue</div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-slate-900/90 border border-slate-800/80 p-4 rounded-2xl shadow-xl hover:border-blue-400/50 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">Conv. Rate</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">{summary.conversionRate}%</div>
          <div className="text-[10px] text-emerald-400 font-bold mt-1">+3.2% vs benchmark</div>
        </div>

        {/* Avg Lead Score */}
        <div className="bg-slate-900/90 border border-slate-800/80 p-4 rounded-2xl shadow-xl hover:border-yellow-400/50 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider">Avg Score</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">{summary.avgScore} <span className="text-xs font-normal text-slate-400">/100</span></div>
          <div className="text-[10px] text-amber-400 font-bold mt-1">🔥 WARM/HOT Tier</div>
        </div>
      </div>

      {/* MAIN CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Leads Generated & Converted Over Time */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-400" /> Lead Pipeline & Growth Trend
              </h2>
              <p className="text-xs text-slate-400">Monthly breakdown of incoming vs qualified vs converted leads</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="flex items-center gap-1 text-blue-400"><span className="w-2.5 h-2.5 bg-blue-500 rounded-full"/> Total</span>
              <span className="flex items-center gap-1 text-cyan-400"><span className="w-2.5 h-2.5 bg-cyan-400 rounded-full"/> Qualified</span>
              <span className="flex items-center gap-1 text-emerald-400"><span className="w-2.5 h-2.5 bg-emerald-400 rounded-full"/> Converted</span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeSeriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorConverted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
                <Area type="monotone" dataKey="converted" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorConverted)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Conversion Funnel */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2 mb-1">
              <Filter className="w-4 h-4 text-amber-400" /> Conversion Funnel
            </h2>
            <p className="text-xs text-slate-400 mb-6">Stage progression efficiency</p>

            <div className="space-y-4">
              {charts.funnelData?.map((step: any, idx: number) => {
                const maxVal = charts.funnelData[0]?.value || 1;
                const percentage = Math.round((step.value / maxVal) * 100);

                return (
                  <div key={step.step} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-slate-300">
                      <span>{step.step}</span>
                      <span className="text-blue-400 font-extrabold">{step.value} <span className="text-[10px] text-slate-500 font-normal">({percentage}%)</span></span>
                    </div>
                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-amber-400 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => onNavigate('/analytics')}
            className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-blue-300 font-bold flex items-center justify-center gap-2 border border-slate-700/60 transition-colors"
          >
            Full Funnel Report <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SECONDARY CHARTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Chart 3: Leads by Industry */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <h2 className="text-sm font-bold text-white mb-4">Leads by Industry</h2>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.leadsByIndustry}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {charts.leadsByIndustry?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {charts.leadsByIndustry?.slice(0, 4).map((ind: any, i: number) => (
              <div key={ind.name} className="flex items-center gap-2 text-xs text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="truncate">{ind.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 4: Lead Source ROI Performance */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <h2 className="text-sm font-bold text-white mb-4">Lead Source Performance</h2>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.leadSourcePerformance?.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="source" stroke="#64748b" fontSize={10} tick={{ fill: '#94a3b8' }} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px' }} />
                <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Total Leads" />
                <Bar dataKey="converted" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Converted" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Hot Leads Widget */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" /> Hot Prospect Feed
              </h2>
              <button onClick={() => onNavigate('/leads')} className="text-xs text-blue-400 hover:underline">
                View All
              </button>
            </div>

            <div className="space-y-3">
              {recentLeads.slice(0, 4).map((l) => (
                <div
                  key={l.id}
                  onClick={() => onNavigate(`/leads/${l.id}`)}
                  className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 hover:border-blue-500/50 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
                      {l.contactName}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {l.companyName} • {l.industry}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      🔥 {l.leadScore} pts
                    </span>
                    <span className="block text-[9px] text-slate-500 mt-0.5">{l.leadStatus}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate('/generator')}
            className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" /> Prospect New Hot Accounts
          </button>
        </div>
      </div>
    </div>
  );
};
