import React, { useState, useEffect } from 'react';
import { UserCheck, ShieldAlert, Plus, Mail, Building2 } from 'lucide-react';
import { api } from '../../services/api';
import { User, UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';

export const UsersView: React.FC = () => {
  const { usersList, refreshUsers } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('AGENT');

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    api.register({ name, email, role }).then(() => {
      refreshUsers();
      setShowAddModal(false);
      setName('');
      setEmail('');
    });
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    api.updateUserRole(userId, newRole).then(() => {
      refreshUsers();
    });
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-slate-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-blue-400" /> User & Access Management ({usersList.length})
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Role-Based Access Control (SUPER ADMIN, ADMIN, AGENT) & Team Workload Distribution.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 font-bold text-xs text-slate-950 shadow-lg shadow-amber-500/20 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Team Member
        </button>
      </div>

      {/* USER LIST TABLE */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/90 border-b border-slate-800 text-slate-400 font-bold uppercase">
                <th className="p-3">User</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role & Permissions</th>
                <th className="p-3">Department</th>
                <th className="p-3">Active Leads</th>
                <th className="p-3 text-right">Change Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {usersList.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                        alt={u.name}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-blue-500"
                      />
                      <span className="font-bold text-slate-100">{u.name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-slate-300">{u.email}</td>
                  <td className="p-3">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded border uppercase tracking-wider ${
                        u.role === 'SUPER ADMIN'
                          ? 'bg-amber-950 text-amber-300 border-amber-800'
                          : u.role === 'ADMIN'
                          ? 'bg-blue-950 text-blue-300 border-blue-800'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400">{u.department || 'Enterprise Sales'}</td>
                  <td className="p-3 font-bold text-blue-400">{u.assignedLeadCount || 20}</td>
                  <td className="p-3 text-right">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                      className="bg-slate-950 text-xs text-slate-200 py-1 px-2 rounded-lg border border-slate-700"
                    >
                      <option value="SUPER ADMIN">SUPER ADMIN</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="AGENT">AGENT</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD USER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-base font-bold text-white">Add New Team Member</h3>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Mercer"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Business Email</label>
                <input
                  type="email"
                  required
                  placeholder="a.mercer@helloworld.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Access Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800"
                >
                  <option value="SUPER ADMIN">SUPER ADMIN (Full system access)</option>
                  <option value="ADMIN">ADMIN (Leads, campaigns, assigned scope)</option>
                  <option value="AGENT">AGENT (Assigned leads & follow-ups)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white shadow-lg"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
