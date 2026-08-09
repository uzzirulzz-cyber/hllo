import React, { useState, useEffect } from 'react';
import { CalendarClock, AlertTriangle, CheckCircle2, Clock, Plus, PhoneCall, Mail, Users, Filter } from 'lucide-react';
import { api } from '../../services/api';
import { FollowUp } from '../../types';

interface FollowUpsViewProps {
  onNavigate: (route: string) => void;
}

export const FollowUpsView: React.FC<FollowUpsViewProps> = ({ onNavigate }) => {
  const [followups, setFollowups] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPriority, setFilterPriority] = useState('ALL');

  useEffect(() => {
    api.getFollowups()
      .then(setFollowups)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleComplete = (id: string) => {
    api.updateFollowup(id, { status: 'COMPLETED' }).then((updated) => {
      setFollowups(followups.map((f) => (f.id === updated.id ? updated : f)));
    });
  };

  const filtered = followups.filter((f) => filterPriority === 'ALL' || f.priority === filterPriority);

  const overdue = filtered.filter((f) => f.status === 'OVERDUE');
  const pending = filtered.filter((f) => f.status === 'PENDING');
  const completed = filtered.filter((f) => f.status === 'COMPLETED');

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-slate-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <CalendarClock className="w-6 h-6 text-blue-400" /> Follow-Up Command Hub ({followups.length})
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Overdue alerts, scheduled demos, discovery calls, and task completion workflow.
          </p>
        </div>

        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="bg-slate-950 text-xs text-slate-200 py-2 px-3 rounded-xl border border-slate-800"
        >
          <option value="ALL">All Priorities</option>
          <option value="HIGH">High Priority</option>
          <option value="MEDIUM">Medium Priority</option>
          <option value="LOW">Low Priority</option>
        </select>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Loading Follow-up Schedule...</div>
      ) : (
        <div className="space-y-6">
          {/* OVERDUE SECTION */}
          {overdue.length > 0 && (
            <div className="bg-rose-950/40 p-6 rounded-2xl border border-rose-800/80 shadow-2xl space-y-3">
              <h2 className="text-sm font-bold text-rose-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" /> Overdue Tasks Requiring Immediate Action ({overdue.length})
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {overdue.map((f) => (
                  <div key={f.id} className="p-4 bg-slate-950/90 rounded-xl border border-rose-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-rose-400">Due: {f.dueDate}</span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                        {f.priority}
                      </span>
                    </div>
                    <div className="font-bold text-white text-xs">{f.leadName} ({f.companyName})</div>
                    <p className="text-xs text-slate-300">{f.type}: {f.notes}</p>
                    <div className="pt-2 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Assigned: {f.assignedUserName}</span>
                      <button
                        onClick={() => handleComplete(f.id)}
                        className="px-2.5 py-1 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-300 font-bold border border-emerald-800"
                      >
                        Mark Complete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* UPCOMING PENDING SECTION */}
          <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" /> Pending & Scheduled Follow-ups ({pending.length})
            </h2>

            <div className="space-y-3">
              {pending.map((f) => (
                <div
                  key={f.id}
                  className="p-4 bg-slate-950/80 rounded-xl border border-slate-800/80 hover:border-blue-500/50 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{f.leadName}</span>
                      <span className="text-blue-400 font-semibold">• {f.companyName}</span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                        {f.type}
                      </span>
                    </div>
                    <p className="text-slate-300">{f.notes}</p>
                    <div className="text-[11px] text-slate-400">
                      📅 Due: {f.dueDate} at {f.dueTime} | Assigned: {f.assignedUserName}
                    </div>
                  </div>

                  <button
                    onClick={() => handleComplete(f.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 font-bold border border-emerald-800 shrink-0"
                  >
                    Mark Done
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* COMPLETED SECTION */}
          {completed.length > 0 && (
            <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800/60 space-y-3">
              <h2 className="text-sm font-bold text-slate-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Completed Tasks ({completed.length})
              </h2>

              <div className="space-y-2">
                {completed.map((f) => (
                  <div key={f.id} className="p-3 bg-slate-950/40 rounded-xl border border-slate-800 text-xs text-slate-400 flex justify-between">
                    <span>{f.leadName} ({f.companyName}) - {f.notes}</span>
                    <span className="text-emerald-400 font-bold">COMPLETED</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
