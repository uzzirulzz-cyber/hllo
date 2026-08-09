import React, { useState, useEffect } from 'react';
import { Megaphone, Plus, CheckCircle2, PauseCircle, PlayCircle, Users, BarChart3, Calendar } from 'lucide-react';
import { api } from '../../services/api';
import { Campaign, CampaignStatus } from '../../types';

export const CampaignsView: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetIndustry, setTargetIndustry] = useState('Software & Tech');
  const [targetLocation, setTargetLocation] = useState('North America');
  const [leadsTargeted, setLeadsTargeted] = useState(250);

  useEffect(() => {
    api.getCampaigns()
      .then(setCampaigns)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    api.createCampaign({
      name,
      description,
      targetIndustry,
      targetLocation,
      leadsTargeted,
      status: 'ACTIVE',
      assignedUserNames: ['James Bond', 'Sarah Connor'],
    }).then((created) => {
      setCampaigns([created, ...campaigns]);
      setShowModal(false);
      setName('');
      setDescription('');
    });
  };

  const handleToggleStatus = (cmp: Campaign) => {
    const nextStatus: CampaignStatus =
      cmp.status === 'ACTIVE' ? 'PAUSED' : cmp.status === 'PAUSED' ? 'ACTIVE' : 'COMPLETED';
    api.updateCampaign(cmp.id, { status: nextStatus }).then((updated) => {
      setCampaigns(campaigns.map((c) => (c.id === updated.id ? updated : c)));
    });
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-slate-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-amber-400" /> Outbound Campaigns ({campaigns.length})
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automated multi-channel outreach, conversion benchmarks, and lead list tracking.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 font-bold text-xs text-slate-950 shadow-lg shadow-amber-500/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Create New Campaign
        </button>
      </div>

      {/* CAMPAIGNS CARDS */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Loading Outbound Campaigns...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {campaigns.map((cmp) => (
            <div
              key={cmp.id}
              className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col justify-between space-y-6 hover:border-blue-500/50 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded border uppercase tracking-wider ${
                      cmp.status === 'ACTIVE'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        : cmp.status === 'PAUSED'
                        ? 'bg-amber-950 text-amber-300 border-amber-800'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {cmp.status}
                  </span>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" /> {cmp.startDate} to {cmp.endDate}
                  </div>
                </div>

                <h3 className="text-base font-bold text-white">{cmp.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{cmp.description}</p>

                <div className="text-xs text-slate-300 space-y-1">
                  <div>🎯 Target Sector: <strong className="text-blue-400">{cmp.targetIndustry}</strong></div>
                  <div>📍 Target Geography: <strong className="text-slate-100">{cmp.targetLocation}</strong></div>
                  <div>👥 Assigned Team: <strong className="text-slate-100">{cmp.assignedUserNames.join(', ')}</strong></div>
                </div>
              </div>

              {/* STATS BAR */}
              <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800/80 grid grid-cols-5 gap-2 text-center">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Targeted</div>
                  <div className="text-sm font-extrabold text-white mt-0.5">{cmp.leadsTargeted}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Contacted</div>
                  <div className="text-sm font-extrabold text-blue-400 mt-0.5">{cmp.leadsContacted}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Qualified</div>
                  <div className="text-sm font-extrabold text-cyan-400 mt-0.5">{cmp.qualifiedLeads}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Converted</div>
                  <div className="text-sm font-extrabold text-amber-400 mt-0.5">{cmp.conversions}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Rate</div>
                  <div className="text-sm font-extrabold text-emerald-400 mt-0.5">{cmp.conversionRate}%</div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => handleToggleStatus(cmp)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-bold border border-slate-700 transition-colors"
                >
                  Toggle Status ({cmp.status === 'ACTIVE' ? 'Pause' : 'Activate'})
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-lg space-y-4">
            <h3 className="text-base font-bold text-white">Create New Outbound Campaign</h3>

            <form onSubmit={handleCreateCampaign} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Campaign Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q4 FinTech Enterprise Outreach"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Campaign objective and target segment..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Target Industry</label>
                  <input
                    type="text"
                    value={targetIndustry}
                    onChange={(e) => setTargetIndustry(e.target.value)}
                    className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Location</label>
                  <input
                    type="text"
                    value={targetLocation}
                    onChange={(e) => setTargetLocation(e.target.value)}
                    className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Target Prospect Count</label>
                <input
                  type="number"
                  value={leadsTargeted}
                  onChange={(e) => setLeadsTargeted(Number(e.target.value))}
                  className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white shadow-lg"
                >
                  Launch Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
