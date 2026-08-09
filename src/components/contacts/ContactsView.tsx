import React, { useState, useEffect } from 'react';
import { Users, Search, Mail, Phone, Linkedin, ExternalLink } from 'lucide-react';
import { api } from '../../services/api';
import { Contact } from '../../types';

export const ContactsView: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getContacts()
      .then(setContacts)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.companyName.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-slate-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-400" /> Executive Contacts Directory ({contacts.length})
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Direct executive phone extensions, emails, and corporate decision-maker mapping.
          </p>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-lg">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Contact Name, Title, Company or Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 text-xs text-slate-100 pl-9 pr-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* CONTACTS TABLE */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Loading Executive Contacts...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950/90 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-3">Contact Name</th>
                  <th className="p-3">Title & Company</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Social</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((cnt) => (
                  <tr key={cnt.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-3 font-bold text-slate-100">{cnt.name}</td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-200">{cnt.jobTitle}</div>
                      <div className="text-[10px] text-blue-400 font-medium">{cnt.companyName}</div>
                    </td>
                    <td className="p-3 text-slate-300 font-medium">
                      <a href={`mailto:${cnt.email}`} className="hover:underline flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" /> {cnt.email}
                      </a>
                    </td>
                    <td className="p-3 text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> {cnt.phone}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400">{cnt.city}, {cnt.country}</td>
                    <td className="p-3">
                      <a href={cnt.linkedinUrl} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline inline-flex items-center gap-1 text-[11px] font-semibold">
                        <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
