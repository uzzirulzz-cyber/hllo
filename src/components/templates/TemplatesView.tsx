import React, { useState, useEffect } from 'react';
import { FileCode2, Copy, CheckCircle2, Sparkles } from 'lucide-react';
import { api } from '../../services/api';
import { OutreachTemplate } from '../../types';

export const TemplatesView: React.FC = () => {
  const [templates, setTemplates] = useState<OutreachTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    api.getTemplates()
      .then(setTemplates)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleCopy = (t: OutreachTemplate) => {
    navigator.clipboard.writeText(`Subject: ${t.subject}\n\n${t.body}`);
    setCopiedId(t.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-slate-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <FileCode2 className="w-6 h-6 text-cyan-400" /> Outreach Email & Message Templates
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Pre-approved high-converting outreach scripts with dynamic placeholder variables.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Loading Templates...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templates.map((tmpl) => (
            <div
              key={tmpl.id}
              className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                    {tmpl.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">{tmpl.usageCount} uses</span>
                </div>

                <h3 className="text-base font-bold text-white mb-1">{tmpl.name}</h3>
                <div className="text-xs text-amber-400 font-semibold mb-3">
                  Subject: {tmpl.subject}
                </div>

                <pre className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] text-slate-300 whitespace-pre-wrap font-sans">
                  {tmpl.body}
                </pre>

                <div className="mt-3 flex flex-wrap gap-1">
                  {tmpl.variables.map((v, i) => (
                    <span key={i} className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      {`{${v}}`}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleCopy(tmpl)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-100 border border-slate-700 transition-colors flex items-center justify-center gap-2"
              >
                {copiedId === tmpl.id ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Copied To Clipboard!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-blue-400" /> Copy Template Text
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
