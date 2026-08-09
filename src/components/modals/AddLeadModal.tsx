import React, { useState } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';
import { api } from '../../services/api';
import { Lead, LeadStatus, Priority } from '../../types';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddLeadModal: React.FC<AddLeadModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('Software & Tech');
  const [country, setCountry] = useState('United States');
  const [city, setCity] = useState('San Francisco');
  const [companySize, setCompanySize] = useState('51-200');
  const [leadStatus, setLeadStatus] = useState<LeadStatus>('NEW');
  const [priority, setPriority] = useState<Priority>('HIGH');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    api.createLead({
      companyName,
      contactName,
      jobTitle,
      email,
      phone,
      website: website || `https://${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
      industry,
      country,
      city,
      companySize,
      leadStatus,
      priority,
      leadSource: 'Manual Entry',
      leadScore: 85,
    })
      .then(() => {
        onSuccess();
        onClose();
        // Reset form
        setCompanyName('');
        setContactName('');
        setJobTitle('');
        setEmail('');
        setPhone('');
      })
      .catch((err) => console.error(err))
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-xl space-y-4 text-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-amber-400" /> Add New Lead Record
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Company Name *</label>
              <input
                type="text"
                required
                placeholder="Apex Technologies"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">Contact Name *</label>
              <input
                type="text"
                required
                placeholder="Marcus Vance"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Job Title *</label>
              <input
                type="text"
                required
                placeholder="Chief Executive Officer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">Business Email *</label>
              <input
                type="email"
                required
                placeholder="m.vance@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="+1 (555) 019-2831"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">Industry</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800"
              >
                <option value="Software & Tech">Software & Tech</option>
                <option value="Healthcare & Bio">Healthcare & Bio</option>
                <option value="Financial Services">Financial Services</option>
                <option value="E-Commerce & Retail">E-Commerce & Retail</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Lead Status</label>
              <select
                value={leadStatus}
                onChange={(e) => setLeadStatus(e.target.value as LeadStatus)}
                className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800"
              >
                <option value="NEW">NEW</option>
                <option value="QUALIFIED">QUALIFIED</option>
                <option value="CONTACTED">CONTACTED</option>
                <option value="FOLLOW-UP">FOLLOW-UP</option>
                <option value="NEGOTIATION">NEGOTIATION</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800"
              >
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg"
            >
              Save Lead Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
