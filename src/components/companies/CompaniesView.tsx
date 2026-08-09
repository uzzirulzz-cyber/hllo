import React, { useState, useEffect } from 'react';
import {
  Building2,
  Search,
  Globe,
  MapPin,
  Users,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { api } from '../../services/api';
import { Company } from '../../types';

interface CompaniesViewProps {
  onNavigate: (route: string) => void;
}

export const CompaniesView: React.FC<CompaniesViewProps> = ({ onNavigate }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search, setSearch] = useState('');
  const [industryFilter, setIndustryFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCompanies()
      .then(setCompanies)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = companies.filter((c) => {
    const matchesSearch = c.companyName.toLowerCase().includes(search.toLowerCase()) || c.city.toLowerCase().includes(search.toLowerCase());
    const matchesInd = industryFilter === 'ALL' || c.industry === industryFilter;
    return matchesSearch && matchesInd;
  });

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-slate-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-emerald-400" /> Account Directory ({companies.length})
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise company profiles, employee scale, and active lead metrics.
          </p>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-lg">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Company Name, Location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 text-xs text-slate-100 pl-9 pr-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={industryFilter}
          onChange={(e) => setIndustryFilter(e.target.value)}
          className="bg-slate-950 text-xs text-slate-200 py-2 px-3 rounded-xl border border-slate-800"
        >
          <option value="ALL">All Industries</option>
          <option value="Software & Tech">Software & Tech</option>
          <option value="Healthcare & Bio">Healthcare & Bio</option>
          <option value="Financial Services">Financial Services</option>
          <option value="E-Commerce & Retail">E-Commerce & Retail</option>
        </select>
      </div>

      {/* COMPANIES GRID */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Loading Company Directory...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((comp) => (
            <div
              key={comp.id}
              className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4 shadow-xl group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {comp.industry}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">{comp.employees} emp</span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {comp.companyName}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{comp.description}</p>

                <div className="mt-4 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" /> {comp.city}, {comp.country}
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-blue-400" />
                    <a href={comp.website} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">{comp.website}</a>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Revenue Tier: <strong className="text-slate-200">{comp.annualRevenue}</strong></span>
                <span className="text-emerald-400 font-bold">{comp.leadsCount} active leads</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
