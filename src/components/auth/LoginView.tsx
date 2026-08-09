import React, { useState } from 'react';
import { Lock, Mail, ShieldCheck, Zap, ArrowRight, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const LoginView: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('crdbixx@helloworld007.io');
  const [password, setPassword] = useState('playbeat123');
  const [role, setRole] = useState<UserRole>('SUPER ADMIN');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password, role);
  };

  const handleQuickDemo = (demoRole: UserRole, demoEmail: string) => {
    setEmail(demoEmail);
    setRole(demoRole);
    login(demoEmail, 'playbeat123', demoRole);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-slate-100">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        {/* LOGO BRANDING */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-amber-500 shadow-xl text-slate-950 font-black text-xl mb-1">
            007
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            HELLO WORLD <span className="text-amber-400">007</span>
          </h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
            Professional Lead Generator & CRM
          </p>
        </div>

        {/* LOGIN FORM */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 text-slate-100 pl-9 pr-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 text-slate-100 pl-9 pr-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Select Access Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full bg-slate-950 text-slate-100 py-2.5 px-3 rounded-xl border border-slate-800 font-bold"
            >
              <option value="SUPER ADMIN">SUPER ADMIN (Full system permissions)</option>
              <option value="ADMIN">ADMIN (Campaigns & team manager)</option>
              <option value="AGENT">AGENT (Assigned leads & task execution)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-black text-xs text-white shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
          >
            Access CRM Dashboard <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* DEMO ACCOUNT PRESETS */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3">
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 text-center flex items-center justify-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Instant One-Click Persona Login
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('SUPER ADMIN', 'crdbixx@helloworld007.io')}
              className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-amber-500/30 hover:border-amber-400 text-[10px] font-black text-amber-400 text-center transition-all shadow-md group"
            >
              👑 <span className="group-hover:underline">crdbixx</span>
              <div className="text-[9px] text-slate-400 font-normal">Super Admin</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('SUPER ADMIN', 'james.bond@helloworld007.io')}
              className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-amber-500/30 hover:border-amber-400 text-[10px] font-black text-amber-300 text-center transition-all shadow-md group"
            >
              🕵️ <span className="group-hover:underline">James Bond</span>
              <div className="text-[9px] text-slate-400 font-normal">007 Super Admin</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('ADMIN', 'creed.bixby@helloworld007.io')}
              className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-blue-500/30 hover:border-blue-400 text-[10px] font-black text-blue-400 text-center transition-all shadow-md group"
            >
              👔 <span className="group-hover:underline">Creed Bixby</span>
              <div className="text-[9px] text-slate-400 font-normal">Admin Manager</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('AGENT', 'a.mercer@helloworld.io')}
              className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 hover:border-slate-500 text-[10px] font-black text-slate-200 text-center transition-all shadow-md group"
            >
              💼 <span className="group-hover:underline">Alex Mercer</span>
              <div className="text-[9px] text-slate-400 font-normal">Sales Agent</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('AI GREETER', 'ai.concierge@helloworld007.io')}
              className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-purple-500/30 hover:border-purple-400 text-[10px] font-black text-purple-300 text-center transition-all shadow-md group col-span-2 sm:col-span-1"
            >
              🤖 <span className="group-hover:underline">AI Concierge</span>
              <div className="text-[9px] text-slate-400 font-normal">Automated Greeter</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
