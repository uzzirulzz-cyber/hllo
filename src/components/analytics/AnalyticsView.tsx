import React, { useState, useEffect } from 'react';
import { BarChart3, Download, Calendar, TrendingUp, DollarSign, Target, Award, Users } from 'lucide-react';
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

export const AnalyticsView: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [timeRange, setTimeRange] = useState('30D');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAnalytics()
      .then(setData)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [timeRange]);

  if (loading || !data) {
    return <div className="p-12 text-center text-slate-400 text-xs">Loading Advanced Analytics Engine...</div>;
  }

  const { summary, charts } = data;

  const COLORS = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  const userLeaderboard = [
    { name: 'James Bond', leads: 34, converted: 13, rate: '38.2%' },
    { name: 'Sarah Connor', leads: 28, converted: 9, rate: '32.1%' },
    { name: 'Alex Mercer', leads: 22, converted: 6, rate: '27.2%' },
    { name: 'Elena Rostova', leads: 16, converted: 4, rate: '25.0%' },
  ];

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-[1600px] mx-auto text-slate-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-400" /> Enterprise CRM Analytics & ROI
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Conversion rate trends, lead source attribution, sales velocity, and agent leaderboard.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {['7D', '30D', '90D', 'YTD'].map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  timeRange === r ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            onClick={() => alert('Exporting full analytics report PDF/CSV...')}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 font-bold text-xs text-slate-950 shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* CHARTS GRID 1: GEOGRAPHIC & SOURCE ROI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Geographic Performance */}
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white">Geographic Market Performance</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.leadsByCountry}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="country" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px' }} />
                <Bar dataKey="count" fill="#06b6d4" radius={[6, 6, 0, 0]} name="Leads Generated" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Source ROI Table */}
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white">Lead Source ROI & Conversion</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-bold">
                  <th className="pb-2">Source</th>
                  <th className="pb-2">Total Prospects</th>
                  <th className="pb-2">Converted</th>
                  <th className="pb-2 text-right">Conversion Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {charts.leadSourcePerformance?.map((src: any) => (
                  <tr key={src.source} className="hover:bg-slate-800/40">
                    <td className="py-2.5 font-bold text-slate-200">{src.source}</td>
                    <td className="py-2.5 text-slate-300">{src.total}</td>
                    <td className="py-2.5 text-amber-400 font-bold">{src.converted}</td>
                    <td className="py-2.5 text-right font-extrabold text-emerald-400">{src.rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* USER LEADERBOARD TABLE */}
      <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" /> Sales Agent Performance Leaderboard
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {userLeaderboard.map((u, i) => (
            <div key={u.name} className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200">#{i + 1} {u.name}</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {u.rate}
                </span>
              </div>
              <div className="text-xs text-slate-400">
                Assigned Leads: <strong className="text-white">{u.leads}</strong> | Closed: <strong className="text-amber-400">{u.converted}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
