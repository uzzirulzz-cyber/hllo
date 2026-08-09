import React, { useState } from 'react';
import {
  Sparkles,
  Filter,
  Search,
  Bookmark,
  RefreshCw,
  Plus,
  FileSpreadsheet,
  Building2,
  Globe,
  MapPin,
  CheckCircle2,
  Flame,
  Zap,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { api } from '../../services/api';
import { Lead } from '../../types';

interface LeadGeneratorViewProps {
  onNavigate: (route: string) => void;
  onOpenAddLeadModal: () => void;
}

export const LeadGeneratorView: React.FC<LeadGeneratorViewProps> = ({
  onNavigate,
  onOpenAddLeadModal,
}) => {
  const [industry, setIndustry] = useState('Software & Tech');
  const [businessCategory, setBusinessCategory] = useState('SaaS & Enterprise Cloud');
  const [country, setCountry] = useState('United States');
  const [city, setCity] = useState('');
  const [companySize, setCompanySize] = useState('201-1000');
  const [targetRole, setTargetRole] = useState('C-Level / VP');

  const [savedSearches, setSavedSearches] = useState<string[]>([
    'US Tech Scaleups (500-1000)',
    'EU FinTech VP Engineering',
    'Global HealthCare Bio Directors',
  ]);

  const [isProspecting, setIsProspecting] = useState(false);
  const [prospectResults, setProspectResults] = useState<Partial<Lead>[]>([]);
  const [sourceMessage, setSourceMessage] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleProspect = async () => {
    setIsProspecting(true);
    setSourceMessage('');
    try {
      const res = await api.prospectLeads({
        industry,
        businessCategory,
        country,
        city,
        companySize,
        targetRole,
      });
      setProspectResults(res.leads);
      setSourceMessage(res.source);
    } catch (err) {
      console.error('Prospect error:', err);
    } finally {
      setIsProspecting(false);
    }
  };

  const handleSaveSearch = () => {
    const name = `${industry} in ${country} (${companySize})`;
    if (!savedSearches.includes(name)) {
      setSavedSearches([...savedSearches, name]);
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 3000);
    }
  };

  const handleAddProspectToCRM = (prospect: Partial<Lead>) => {
    api.createLead({
      companyName: prospect.companyName,
      contactName: prospect.contactName,
      jobTitle: prospect.jobTitle,
      email: prospect.email,
      phone: prospect.phone,
      website: prospect.website,
      industry: prospect.industry || industry,
      country: prospect.country || country,
      city: prospect.city || 'San Francisco',
      companySize: prospect.companySize || companySize,
      leadSource: 'AI Prospector Engine',
      leadScore: prospect.leadScore || 88,
      leadStatus: 'NEW',
    }).then(() => {
      alert(`Added ${prospect.contactName} (${prospect.companyName}) to active CRM leads!`);
    });
  };

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-[1600px] mx-auto text-slate-100">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-amber-950/40 p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/50 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Authorized AI Prospector Workspace
          </div>
          <h1 className="text-2xl font-black text-white">
            Lead Generator 007
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Target high-intent B2B decision makers across global markets. Uses compliant, authorized public metadata algorithms and AI enrichment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/import')}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Import Leads
          </button>
          <button
            onClick={onOpenAddLeadModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Lead Manually
          </button>
        </div>
      </div>

      {/* FILTER BUILDER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Filter Controls */}
        <div className="lg:col-span-2 bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-400" /> Target Criteria Parameters
            </h2>
            <button
              onClick={() => {
                setIndustry('Software & Tech');
                setCountry('United States');
                setCompanySize('201-1000');
                setCity('');
              }}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Industry */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Target Industry</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-slate-950 text-xs text-slate-200 py-2.5 px-3 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="Software & Tech">Software & Tech</option>
                <option value="Healthcare & Bio">Healthcare & BioTech</option>
                <option value="Financial Services">Financial Services & Banking</option>
                <option value="E-Commerce & Retail">E-Commerce & Retail</option>
                <option value="Manufacturing & Industrial">Manufacturing</option>
                <option value="Real Estate & Construction">Real Estate</option>
                <option value="Logistics & Supply Chain">Logistics & Supply Chain</option>
              </select>
            </div>

            {/* Business Category */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Business Category / Subsector</label>
              <input
                type="text"
                placeholder="e.g. Enterprise Cloud, AI Diagnostics"
                value={businessCategory}
                onChange={(e) => setBusinessCategory(e.target.value)}
                className="w-full bg-slate-950 text-xs text-slate-200 py-2.5 px-3 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Country / Region</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-slate-950 text-xs text-slate-200 py-2.5 px-3 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Germany">Germany</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="Singapore">Singapore</option>
                <option value="Japan">Japan</option>
                <option value="France">France</option>
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">City / Metro (Optional)</label>
              <input
                type="text"
                placeholder="e.g. San Francisco, London, Berlin"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-950 text-xs text-slate-200 py-2.5 px-3 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Company Size */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Company Headcount Size</label>
              <select
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value)}
                className="w-full bg-slate-950 text-xs text-slate-200 py-2.5 px-3 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="1-10">1-10 Employees</option>
                <option value="11-50">11-50 Employees</option>
                <option value="51-200">51-200 Employees</option>
                <option value="201-1000">201-1000 Employees</option>
                <option value="1000+">1000+ Enterprise</option>
              </select>
            </div>

            {/* Target Executive Role */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Target Decision Maker Role</label>
              <input
                type="text"
                placeholder="e.g. CEO, CTO, VP of Procurement"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-slate-950 text-xs text-slate-200 py-2.5 px-3 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Compliance notice */}
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Authorized public data sources only. Privacy, GDPR, anti-spam, and robots restrictions strictly honored.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleProspect}
              disabled={isProspecting}
              className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProspecting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Mining & Scoring Prospects...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300" /> Generate AI Leads
                </>
              )}
            </button>

            <button
              onClick={handleSaveSearch}
              className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center gap-2 transition-colors"
            >
              <Bookmark className="w-4 h-4 text-amber-400" /> Save Search Preset
            </button>
          </div>

          {savedNotice && (
            <div className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Search preset saved to your account library!
            </div>
          )}
        </div>

        {/* Right: Saved Search Presets */}
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-400" /> Saved Search Presets
            </h2>
            <div className="space-y-2">
              {savedSearches.map((preset, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 hover:border-blue-500/50 flex items-center justify-between group cursor-pointer transition-colors"
                  onClick={() => {
                    handleProspect();
                  }}
                >
                  <span className="text-xs text-slate-200 font-medium group-hover:text-blue-400">{preset}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400" />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-br from-blue-950/60 to-slate-900 rounded-xl border border-blue-800/40">
            <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-1">
              🔥 Lead Scoring Algorithm
            </div>
            <p className="text-[11px] text-slate-300">
              Score = Company Size + C-Level Title Weight + Verified Contact Info. HOT leads exceed 75 points automatically.
            </p>
          </div>
        </div>
      </div>

      {/* PROSPECTING RESULTS TABLE */}
      {prospectResults.length > 0 && (
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" /> Discovered Lead Candidates ({prospectResults.length})
              </h2>
              {sourceMessage && <span className="text-xs text-blue-400 font-semibold">{sourceMessage}</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {prospectResults.map((p, idx) => (
              <div
                key={idx}
                className="bg-slate-950/90 p-5 rounded-2xl border border-slate-800/80 hover:border-blue-500/60 transition-all flex flex-col justify-between space-y-4 shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      🔥 Score: {p.leadScore || 85}/100
                    </span>
                    <span className="text-[10px] text-slate-400">{p.companySize} emp</span>
                  </div>

                  <h3 className="text-sm font-bold text-white">{p.contactName}</h3>
                  <div className="text-xs text-blue-400 font-medium">{p.jobTitle}</div>
                  <div className="text-xs font-bold text-slate-300 mt-1">{p.companyName}</div>

                  <div className="mt-3 space-y-1 text-[11px] text-slate-400">
                    <div>📧 {p.email}</div>
                    <div>📞 {p.phone}</div>
                    <div>🌐 {p.website}</div>
                    <div>📍 {p.city}, {p.country}</div>
                  </div>
                </div>

                <button
                  onClick={() => handleAddProspectToCRM(p)}
                  className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5" /> Save To Active Leads
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
