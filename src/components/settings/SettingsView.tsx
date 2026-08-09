import React, { useState, useEffect } from 'react';
import { Settings, ShieldCheck, Sliders, Bell, Key, History, Save, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import { SystemSettings, AuditLog } from '../../types';

export const SettingsView: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'scoring' | 'api' | 'audit'>('scoring');
  const [saveNotice, setSaveNotice] = useState(false);

  useEffect(() => {
    Promise.all([api.getSettings(), api.getAuditLogs()])
      .then(([s, logs]) => {
        setSettings(s);
        setAuditLogs(logs);
      })
      .catch((err) => console.error(err));
  }, []);

  if (!settings) {
    return <div className="p-12 text-center text-slate-400 text-xs">Loading System Settings...</div>;
  }

  const handleSaveSettings = () => {
    api.updateSettings(settings).then((updated) => {
      setSettings(updated);
      setSaveNotice(true);
      setTimeout(() => setSaveNotice(false), 3000);
    });
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-slate-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-amber-400" /> Admin System Settings & Audit
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Customize lead scoring weight rules, status options, API webhooks, and security audit logs.
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 font-extrabold text-xs text-slate-950 shadow-lg shadow-amber-500/20 transition-all"
        >
          <Save className="w-4 h-4" /> Save Preferences
        </button>
      </div>

      {saveNotice && (
        <div className="p-3 bg-emerald-950/80 rounded-xl border border-emerald-800 text-emerald-300 font-bold text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> System settings & scoring rules updated successfully!
        </div>
      )}

      {/* SETTINGS TABS */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-bold">
        {[
          { id: 'scoring', label: 'Lead Scoring Rules', icon: Sliders },
          { id: 'profile', label: 'Company Profile & Statuses', icon: Settings },
          { id: 'api', label: 'API Keys & Webhooks', icon: Key },
          { id: 'audit', label: 'Security Audit Logs', icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: LEAD SCORING RULES */}
      {activeTab === 'scoring' && (
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sliders className="w-4 h-4 text-amber-400" /> Automatic Lead Scoring Weight Rules
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Thresholds */}
            <div className="space-y-4 p-4 bg-slate-950 rounded-xl border border-slate-800">
              <h3 className="font-bold text-slate-200 text-sm">Score Tier Thresholds</h3>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  🔥 HOT Lead Threshold (Current: {settings.leadScoringRules.hotThreshold} pts)
                </label>
                <input
                  type="range"
                  min={50}
                  max={90}
                  value={settings.leadScoringRules.hotThreshold}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      leadScoringRules: {
                        ...settings.leadScoringRules,
                        hotThreshold: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  🟡 WARM Lead Threshold (Current: {settings.leadScoringRules.warmThreshold} pts)
                </label>
                <input
                  type="range"
                  min={20}
                  max={60}
                  value={settings.leadScoringRules.warmThreshold}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      leadScoringRules: {
                        ...settings.leadScoringRules,
                        warmThreshold: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full accent-amber-500"
                />
              </div>
            </div>

            {/* Title Weights */}
            <div className="space-y-3 p-4 bg-slate-950 rounded-xl border border-slate-800">
              <h3 className="font-bold text-slate-200 text-sm">Job Title Seniority Weight</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>C-Level (CEO, CTO, COO, CRO)</span>
                  <strong className="text-emerald-400">+{settings.leadScoringRules.jobTitleWeight.cLevel} pts</strong>
                </div>
                <div className="flex justify-between">
                  <span>VP / Director / Head</span>
                  <strong className="text-emerald-400">+{settings.leadScoringRules.jobTitleWeight.vpDirector} pts</strong>
                </div>
                <div className="flex justify-between">
                  <span>Senior Manager</span>
                  <strong className="text-emerald-400">+{settings.leadScoringRules.jobTitleWeight.manager} pts</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COMPANY PROFILE & STATUSES */}
      {activeTab === 'profile' && (
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-4 max-w-2xl text-xs">
          <div>
            <label className="block font-bold text-slate-300 mb-1">Company Name</label>
            <input
              type="text"
              value={settings.companyName}
              onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
              className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Support Email</label>
            <input
              type="email"
              value={settings.supportEmail}
              onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
              className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Active Lead Statuses</label>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-wrap gap-2">
              {settings.leadStatuses.map((st) => (
                <span key={st} className="text-[11px] font-bold px-2.5 py-1 rounded bg-blue-950 text-blue-300 border border-blue-800">
                  {st}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: API & WEBHOOKS */}
      {activeTab === 'api' && (
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-4 max-w-2xl text-xs">
          <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Key className="w-4 h-4 text-blue-400" /> REST API Credentials & Webhook Endpoints
          </h2>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Production Secret API Key</label>
            <input
              type="text"
              readOnly
              value={settings.apiKey}
              className="w-full bg-slate-950 text-amber-400 font-mono text-xs p-2.5 rounded-xl border border-slate-800"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Inbound Webhook Listener URL</label>
            <input
              type="text"
              value={settings.webhookUrl}
              onChange={(e) => setSettings({ ...settings, webhookUrl: e.target.value })}
              className="w-full bg-slate-950 text-slate-200 font-mono text-xs p-2.5 rounded-xl border border-slate-800"
            />
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 font-bold text-sm text-white">
            System Security Audit Stream
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950/90 border-b border-slate-800 text-slate-400 font-bold uppercase">
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">User & Role</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Resource</th>
                  <th className="p-3">Details</th>
                  <th className="p-3">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40">
                    <td className="p-3 text-slate-400 font-mono text-[11px]">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-slate-200">{log.userName}</div>
                      <div className="text-[10px] text-blue-400 font-semibold">{log.userRole}</div>
                    </td>
                    <td className="p-3 font-mono text-amber-400 font-bold">{log.action}</td>
                    <td className="p-3 text-slate-300">{log.resource}</td>
                    <td className="p-3 text-slate-300">{log.details}</td>
                    <td className="p-3 font-mono text-slate-500">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
