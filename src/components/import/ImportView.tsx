import React, { useState } from 'react';
import { FileSpreadsheet, Upload, CheckCircle2, AlertCircle, RefreshCw, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';
import { ImportPreviewItem } from '../../types';

interface ImportViewProps {
  onNavigate: (route: string) => void;
}

export const ImportView: React.FC<ImportViewProps> = ({ onNavigate }) => {
  const [fileSelected, setFileSelected] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewItems, setPreviewItems] = useState<ImportPreviewItem[]>([]);
  const [isImported, setIsImported] = useState(false);
  const [importedCount, setImportedCount] = useState(0);

  const handleSimulateUpload = (fileName: string) => {
    setFileSelected(fileName);
    setIsProcessing(true);
    setTimeout(() => {
      const mockPreview: ImportPreviewItem[] = [
        {
          id: 'imp-1',
          companyName: 'Quantum Dynamics Corp',
          contactName: 'Jonathan Vance',
          jobTitle: 'VP of Procurement',
          email: 'j.vance@quantumdynamics.io',
          phone: '+1 (415) 890-1200',
          website: 'https://quantumdynamics.io',
          industry: 'Software & Tech',
          country: 'United States',
          city: 'San Francisco',
          isValid: true,
        },
        {
          id: 'imp-2',
          companyName: 'Aura Biotech Systems',
          contactName: 'Clara Oswald',
          jobTitle: 'Chief Technology Officer',
          email: 'c.oswald@aurabiotech.com',
          phone: '+44 20 7946 0912',
          website: 'https://aurabiotech.com',
          industry: 'Healthcare & Bio',
          country: 'United Kingdom',
          city: 'London',
          isValid: true,
        },
        {
          id: 'imp-3',
          companyName: 'Vanguard Global Capital',
          contactName: 'Michael Chang',
          jobTitle: 'Managing Director',
          email: 'm.chang@vanguardglobal.sg',
          phone: '+65 6789 0123',
          website: 'https://vanguardglobal.sg',
          industry: 'Financial Services',
          country: 'Singapore',
          city: 'Singapore',
          isValid: true,
        },
        {
          id: 'imp-4',
          companyName: 'Apex Technologies', // Duplicate demo
          contactName: 'Marcus Vance',
          jobTitle: 'Chief Executive Officer',
          email: 'm.vance@apextechnologies.io',
          phone: '+1 (300) 100-1000',
          website: 'https://apextechnologies.io',
          industry: 'Software & Tech',
          country: 'United States',
          city: 'San Francisco',
          isValid: false,
          isDuplicate: true,
          validationError: 'Duplicate record detected in existing CRM database',
        },
      ];
      setPreviewItems(mockPreview);
      setIsProcessing(false);
    }, 1000);
  };

  const handleConfirmImport = () => {
    const validItems = previewItems.filter((i) => i.isValid);
    api.importLeads(validItems).then((res) => {
      setIsImported(true);
      setImportedCount(res.count);
    });
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-[1600px] mx-auto text-slate-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-emerald-400" /> Enterprise Import Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Drag-and-drop CSV, Excel, or JSON datasets with automatic column mapping & duplicate protection.
          </p>
        </div>
      </div>

      {/* UPLOAD ZONE */}
      {!fileSelected && (
        <div className="bg-slate-900/90 p-12 rounded-2xl border-2 border-dashed border-slate-700 hover:border-blue-500 text-center space-y-4 transition-all">
          <Upload className="w-12 h-12 text-blue-400 mx-auto" />
          <div>
            <h3 className="text-base font-bold text-white">Upload Lead File (CSV, XLSX, JSON)</h3>
            <p className="text-xs text-slate-400 mt-1">Click below or drag lead spreadsheets into this window.</p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => handleSimulateUpload('enterprise_leads_q3_import.csv')}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white shadow-lg shadow-blue-600/30 transition-all"
            >
              Simulate CSV Upload
            </button>
            <button
              onClick={() => handleSimulateUpload('prospect_list_export.json')}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-xs text-slate-200 border border-slate-700 transition-colors"
            >
              Simulate JSON Upload
            </button>
          </div>
        </div>
      )}

      {/* PROCESSING STATE */}
      {isProcessing && (
        <div className="p-12 bg-slate-900 rounded-2xl border border-slate-800 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto" />
          <div className="text-sm font-bold text-white">Validating columns & checking duplicate records...</div>
        </div>
      )}

      {/* PREVIEW & CONFIRM */}
      {previewItems.length > 0 && !isImported && !isProcessing && (
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white">Import Preview & Duplicate Scanner</h2>
              <p className="text-xs text-slate-400">File: {fileSelected}</p>
            </div>
            <button
              onClick={handleConfirmImport}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 font-extrabold text-xs text-slate-950 shadow-lg transition-all"
            >
              Confirm Import ({previewItems.filter((i) => i.isValid).length} Valid Leads)
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-950/90 border-b border-slate-800 text-slate-400 font-bold uppercase">
                  <th className="p-3">Status</th>
                  <th className="p-3">Company Name</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Industry</th>
                  <th className="p-3">Validation Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {previewItems.map((item) => (
                  <tr key={item.id} className={!item.isValid ? 'bg-rose-950/20' : ''}>
                    <td className="p-3">
                      {item.isValid ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                          VALID
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                          DUPLICATE
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-bold text-slate-200">{item.companyName}</td>
                    <td className="p-3 text-slate-300">{item.contactName} ({item.jobTitle})</td>
                    <td className="p-3 text-blue-400">{item.email}</td>
                    <td className="p-3 text-slate-400">{item.industry}</td>
                    <td className="p-3 text-slate-400">
                      {item.isValid ? 'Passed verification' : item.validationError}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUCCESS CONFIRMATION */}
      {isImported && (
        <div className="p-8 bg-slate-900 rounded-2xl border border-emerald-800 text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h3 className="text-xl font-bold text-white">Successfully Imported {importedCount} Leads!</h3>
          <p className="text-xs text-slate-400">Leads are now populated into your active CRM lead management directory.</p>
          <button
            onClick={() => onNavigate('/leads')}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs text-white shadow-lg"
          >
            View Leads Directory
          </button>
        </div>
      )}
    </div>
  );
};
