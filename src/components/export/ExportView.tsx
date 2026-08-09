import React, { useState } from 'react';
import { Download, FileText, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';

export const ExportView: React.FC = () => {
  const [format, setFormat] = useState<'CSV' | 'JSON' | 'EXCEL'>('CSV');
  const [dataset, setDataset] = useState<'LEADS' | 'COMPANIES' | 'CONTACTS' | 'CAMPAIGNS'>('LEADS');
  const [isExporting, setIsExporting] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);

  const handleStartExport = () => {
    setIsExporting(true);
    setDownloadReady(false);

    // Fetch data and generate client-side downloadable file Blob
    const fetchCall =
      dataset === 'LEADS'
        ? api.getLeads()
        : dataset === 'COMPANIES'
        ? api.getCompanies()
        : dataset === 'CONTACTS'
        ? api.getContacts()
        : api.getCampaigns();

    fetchCall
      .then((records: any) => {
        let content = '';
        let mimeType = 'text/plain';
        let fileExt = 'txt';

        if (format === 'JSON') {
          content = JSON.stringify(records, null, 2);
          mimeType = 'application/json';
          fileExt = 'json';
        } else {
          // CSV representation
          if (records.length > 0) {
            const keys = Object.keys(records[0]).filter((k) => typeof records[0][k] !== 'object');
            const header = keys.join(',');
            const rows = records.map((r: any) =>
              keys.map((k) => `"${String(r[k] || '').replace(/"/g, '""')}"`).join(',')
            );
            content = [header, ...rows].join('\n');
            mimeType = 'text/csv';
            fileExt = format === 'EXCEL' ? 'xlsx' : 'csv';
          }
        }

        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `helloworld007_${dataset.toLowerCase()}_export.${fileExt}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setDownloadReady(true);
      })
      .finally(() => setIsExporting(false));
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-slate-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Download className="w-6 h-6 text-amber-400" /> Export Data Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Export filtered CRM records to CSV, Excel, or JSON format.
          </p>
        </div>
      </div>

      <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-6 max-w-xl">
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-2">Select Dataset</label>
          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            {(['LEADS', 'COMPANIES', 'CONTACTS', 'CAMPAIGNS'] as const).map((ds) => (
              <button
                key={ds}
                onClick={() => setDataset(ds)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  dataset === ds
                    ? 'bg-blue-600 text-white border-blue-500 shadow-lg'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {ds}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-2">Select Output Format</label>
          <div className="grid grid-cols-3 gap-2 text-xs font-bold">
            {(['CSV', 'EXCEL', 'JSON'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFormat(fmt)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  format === fmt
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleStartExport}
          disabled={isExporting}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-extrabold text-xs text-white shadow-xl transition-all flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" /> Download {dataset} Export ({format})
        </button>

        {downloadReady && (
          <div className="text-xs text-emerald-400 font-bold flex items-center justify-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Export file downloaded successfully!
          </div>
        )}
      </div>
    </div>
  );
};
