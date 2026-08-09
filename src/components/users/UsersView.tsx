import React, { useState } from 'react';
import {
  UserCheck,
  ShieldAlert,
  Plus,
  Mail,
  Bot,
  MessageSquare,
  Sparkles,
  Users,
  CheckCircle2,
  Volume2,
  Send,
  Zap,
} from 'lucide-react';
import { api } from '../../services/api';
import { User, UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const UsersView: React.FC = () => {
  const { usersList, refreshUsers } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAiGreeterMode, setIsAiGreeterMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('AGENT');
  const [greetingMessage, setGreetingMessage] = useState(
    "Hello! Welcome to Hello World 007 CRM. I'm your AI Customer Greeter. How can our sales concierge team assist you today?"
  );
  const [greetingTrigger, setGreetingTrigger] = useState('NEW_INBOUND_LEAD');

  // Test Customer Greeting Simulator state
  const [testLeadName, setTestLeadName] = useState('Sarah Jenkins');
  const [testLeadCompany, setTestLeadCompany] = useState('Acme Corporation');
  const [simulatedGreeting, setSimulatedGreeting] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ALL' | 'HUMAN' | 'AI_GREETER'>('ALL');

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    api
      .register({
        name,
        email,
        role: isAiGreeterMode ? 'AI GREETER' : role,
        isAiGreeter: isAiGreeterMode,
        greetingMessage: isAiGreeterMode ? greetingMessage : undefined,
        greetingTrigger: isAiGreeterMode ? greetingTrigger : undefined,
        seatType: isAiGreeterMode ? 'AI_GREETER_BOT' : 'HUMAN_AGENT',
        department: isAiGreeterMode ? 'Automated Customer Greeter' : 'Enterprise Sales',
      })
      .then(() => {
        refreshUsers();
        setShowAddModal(false);
        setName('');
        setEmail('');
        setIsAiGreeterMode(false);
      });
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    api.updateUserRole(userId, newRole).then(() => {
      refreshUsers();
    });
  };

  const handleSimulateGreeting = (user: User) => {
    const msg = (user.greetingMessage || greetingMessage)
      .replace('{name}', testLeadName)
      .replace('{company}', testLeadCompany);
    setSimulatedGreeting(`[${user.name} to ${testLeadName} @ ${testLeadCompany}]: "${msg}"`);
  };

  const humanSeats = usersList.filter((u) => !u.isAiGreeter);
  const aiSeats = usersList.filter((u) => u.isAiGreeter);

  const displayedUsers = usersList.filter((u) => {
    if (activeTab === 'HUMAN') return !u.isAiGreeter;
    if (activeTab === 'AI_GREETER') return u.isAiGreeter;
    return true;
  });

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-slate-100">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/40 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-blue-400 font-extrabold text-xs tracking-widest uppercase mb-1">
            <Users className="w-4 h-4" /> Team & AI Agent Seats Command
          </div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-blue-400" /> Agent Seats & Customer Greeter Management ({usersList.length})
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Provision human sales agent seats and automated AI seats designed to instantly greet incoming customers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsAiGreeterMode(true);
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 font-extrabold text-xs text-white shadow-lg shadow-purple-500/20 transition-all"
          >
            <Bot className="w-4 h-4" /> Create AI Customer Greeter Seat
          </button>
          <button
            onClick={() => {
              setIsAiGreeterMode(false);
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 font-extrabold text-xs text-slate-950 shadow-lg shadow-amber-500/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Human Agent Seat
          </button>
        </div>
      </div>

      {/* SEATS METRICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Seats Provisioned</div>
            <div className="text-xl font-black text-white">{usersList.length} Active Seats</div>
            <div className="text-[10px] text-blue-400 font-semibold">Ready for lead assignment</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Human Sales Agents</div>
            <div className="text-xl font-black text-amber-400">{humanSeats.length} Human Seats</div>
            <div className="text-[10px] text-slate-400 font-semibold">Super Admins & Sales Managers</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">AI Customer Greeter Seats</div>
            <div className="text-xl font-black text-purple-400">{aiSeats.length} Bot Seats</div>
            <div className="text-[10px] text-purple-300 font-semibold">24/7 Automated Greeting & Welcome</div>
          </div>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all ${
            activeTab === 'ALL' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          All Agent Seats ({usersList.length})
        </button>
        <button
          onClick={() => setActiveTab('HUMAN')}
          className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all ${
            activeTab === 'HUMAN' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          Human Sales Seats ({humanSeats.length})
        </button>
        <button
          onClick={() => setActiveTab('AI_GREETER')}
          className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all ${
            activeTab === 'AI_GREETER' ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          AI Customer Greeter Seats ({aiSeats.length})
        </button>
      </div>

      {/* SIMULATED GREETING BANNER */}
      {simulatedGreeting && (
        <div className="bg-purple-950/80 border border-purple-800 p-4 rounded-2xl shadow-xl flex items-start gap-3 animate-fade-in">
          <MessageSquare className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
          <div className="flex-1 text-xs">
            <div className="font-bold text-purple-300 mb-0.5">Live Customer Greeting Simulation Outcome:</div>
            <div className="text-white font-mono bg-slate-950 p-2.5 rounded-xl border border-purple-900 mt-1">
              {simulatedGreeting}
            </div>
          </div>
          <button
            onClick={() => setSimulatedGreeting(null)}
            className="text-slate-400 hover:text-white text-xs font-bold"
          >
            Close
          </button>
        </div>
      )}

      {/* USER & AGENT SEATS TABLE */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/90 border-b border-slate-800 text-slate-400 font-bold uppercase">
                <th className="p-3">Agent Seat</th>
                <th className="p-3">Seat Type & Email</th>
                <th className="p-3">Access Role</th>
                <th className="p-3">Department</th>
                <th className="p-3">Customer Greeting Message</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {displayedUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          u.avatarUrl ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                        }
                        alt={u.name}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/40"
                      />
                      <div>
                        <div className="font-bold text-slate-100 flex items-center gap-1.5">
                          {u.name}
                          {u.isAiGreeter && (
                            <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800">
                              BOT SEAT
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">{u.id}</div>
                      </div>
                    </div>
                  </td>

                  <td className="p-3">
                    <div className="text-slate-200 font-semibold">{u.email}</div>
                    <div className="text-[10px] text-slate-400">
                      {u.isAiGreeter ? '🤖 Automated AI Concierge' : '👤 Human Sales Representative'}
                    </div>
                  </td>

                  <td className="p-3">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded border uppercase tracking-wider ${
                        u.role === 'SUPER ADMIN'
                          ? 'bg-amber-950 text-amber-300 border-amber-800'
                          : u.role === 'ADMIN'
                          ? 'bg-blue-950 text-blue-300 border-blue-800'
                          : u.role === 'AI GREETER'
                          ? 'bg-purple-950 text-purple-300 border-purple-800'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className="p-3 text-slate-400">{u.department || 'Enterprise Sales'}</td>

                  <td className="p-3">
                    {u.isAiGreeter ? (
                      <div className="max-w-xs text-[11px] text-purple-300 italic bg-purple-950/30 p-2 rounded-xl border border-purple-900/50 line-clamp-2">
                        "{u.greetingMessage || 'Automated customer welcome message enabled.'}"
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-500 italic">Human Direct Assignment</span>
                    )}
                  </td>

                  <td className="p-3 text-right space-x-2">
                    {u.isAiGreeter && (
                      <button
                        onClick={() => handleSimulateGreeting(u)}
                        className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-[10px] shadow transition-all inline-flex items-center gap-1"
                      >
                        <Zap className="w-3 h-3" /> Test Greeting
                      </button>
                    )}
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                      className="bg-slate-950 text-xs text-slate-200 py-1 px-2 rounded-lg border border-slate-700"
                    >
                      <option value="SUPER ADMIN">SUPER ADMIN</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="AGENT">AGENT</option>
                      <option value="AI GREETER">AI GREETER</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE AGENT SEAT / GREETER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                {isAiGreeterMode ? (
                  <>
                    <Bot className="w-5 h-5 text-purple-400" /> Create AI Customer Greeter Seat
                  </>
                ) : (
                  <>
                    <UserCheck className="w-5 h-5 text-amber-400" /> Add Human Sales Agent Seat
                  </>
                )}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            {/* SEAT TYPE TOGGLE SWITCH */}
            <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
              <button
                type="button"
                onClick={() => setIsAiGreeterMode(false)}
                className={`flex-1 py-1.5 rounded-lg font-extrabold text-xs transition-all ${
                  !isAiGreeterMode ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                👤 Human Sales Agent
              </button>
              <button
                type="button"
                onClick={() => setIsAiGreeterMode(true)}
                className={`flex-1 py-1.5 rounded-lg font-extrabold text-xs transition-all ${
                  isAiGreeterMode ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                🤖 AI Customer Greeter Bot
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  {isAiGreeterMode ? 'Agent / Bot Seat Name' : 'Agent Full Name'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isAiGreeterMode ? 'e.g. VIP Concierge Greeter Bot' : 'e.g. Alex Mercer'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Agent Seat Email Address</label>
                <input
                  type="email"
                  required
                  placeholder={isAiGreeterMode ? 'greeter.bot@helloworld007.io' : 'a.mercer@helloworld.io'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              {!isAiGreeterMode ? (
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Access Role & Permissions</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800 font-medium"
                  >
                    <option value="SUPER ADMIN">SUPER ADMIN (Full system permissions)</option>
                    <option value="ADMIN">ADMIN (Leads, campaigns, assigned scope)</option>
                    <option value="AGENT">AGENT (Assigned leads & follow-ups)</option>
                  </select>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-purple-300 font-bold mb-1 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" /> Customer Greeting Message Template
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={greetingMessage}
                      onChange={(e) => setGreetingMessage(e.target.value)}
                      placeholder="e.g. Welcome to Hello World CRM! I am your AI concierge..."
                      className="w-full bg-slate-950 text-purple-200 p-2.5 rounded-xl border border-purple-800 focus:outline-none focus:border-purple-500 font-mono text-xs"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">
                      Tip: You can use variables like <code>&#123;name&#125;</code> and <code>&#123;company&#125;</code> for automatic personalization!
                    </p>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Trigger Event to Greet Customer</label>
                    <select
                      value={greetingTrigger}
                      onChange={(e) => setGreetingTrigger(e.target.value)}
                      className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800 font-medium"
                    >
                      <option value="NEW_INBOUND_LEAD">On New Inbound Lead Registration</option>
                      <option value="HOT_SCORE_LEAD">On High Score Lead (Score &gt; 80)</option>
                      <option value="FORM_SUBMISSION">On Website Contact Form Submission</option>
                      <option value="DIRECT_CHAT">On Direct Customer Web Chat Initiation</option>
                    </select>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl font-bold text-white shadow-lg ${
                    isAiGreeterMode
                      ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-500/20'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                  }`}
                >
                  {isAiGreeterMode ? 'Provision AI Greeter Seat' : 'Add Human Agent Seat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
