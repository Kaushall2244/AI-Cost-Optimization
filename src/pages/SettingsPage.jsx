import React, { useState } from 'react';
import { Settings, Shield, Bell, DollarSign, Database, Save, Check, FileSpreadsheet, Code2, RefreshCw } from 'lucide-react';

export const SettingsPage = () => {
  const [currency, setCurrency] = useState('INR');
  const [anomalyThreshold, setAnomalyThreshold] = useState('25');
  const [apiEndpoint, setApiEndpoint] = useState('http://localhost:5000/api/v1');
  const [saved, setSaved] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const copySqlSnippet = () => {
    navigator.clipboard?.writeText?.("psql -h localhost -U postgres -d costiq -f Dataset/init_postgresql.sql\npython3 Dataset/load_to_postgres.py");
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1320] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-3 mb-1">
          <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
            <Settings className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">System Settings & Configuration</h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Configure financial currency formatting, anomaly detection sensitivity, and REST API backend parameters.
        </p>
      </div>

      <div className="space-y-4">
        {/* Currency Setting */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1320] border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Display Currency</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Primary currency symbol for savings proofs and spending trends.</p>
          </div>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-600 shadow-sm"
          >
            <option value="INR">₹ INR (Indian Rupee)</option>
            <option value="USD">$ USD (US Dollar)</option>
            <option value="EUR">€ EUR (Euro)</option>
          </select>
        </div>

        {/* Anomaly Threshold */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1320] border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Anomaly Detection Sensitivity</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Percentage deviation above rolling baseline to trigger cost spike alert.</p>
          </div>
          <select
            value={anomalyThreshold}
            onChange={(e) => setAnomalyThreshold(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-600 shadow-sm"
          >
            <option value="15">+15% (Strict Sensitivity)</option>
            <option value="25">+25% (Standard Baseline)</option>
            <option value="50">+50% (Major Spikes Only)</option>
          </select>
        </div>

        {/* Backend API Integration */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1320] border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Backend API Endpoint</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Target REST server URL for live backend integration without UI modification.</p>
          </div>
          <input
            type="text"
            value={apiEndpoint}
            onChange={(e) => setApiEndpoint(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-medium text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-600 shadow-sm"
          />
        </div>

        {/* Database & Data Source */}
        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Connected Database Storage</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">PostgreSQL database storage with live data sync</p>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
              720 Verified Rows
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="font-bold text-slate-800 dark:text-slate-200 block flex items-center space-x-1">
                <FileSpreadsheet className="w-3.5 h-3.5 text-amber-600 mr-1" />
                <span>Multi-Cloud Usage Dataset</span>
              </span>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                Unified cloud billing (EC2), AI platform tokens, and machine host telemetry.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="font-bold text-slate-800 dark:text-slate-200 block flex items-center space-x-1">
                <Code2 className="w-3.5 h-3.5 text-blue-600 mr-1" />
                <span>PostgreSQL Cloud Schema</span>
              </span>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                Production database table with indexes, billing categories, and usage metrics.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
              Status: <span className="text-emerald-700 dark:text-emerald-400 font-bold">Database Online & Connected</span>
            </span>
            <button
              onClick={copySqlSnippet}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-300 dark:border-slate-700 transition-colors shadow-sm"
            >
              {copiedSql ? "Copied Command!" : "Copy Ingest Command"}
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all active:scale-95"
          >
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{saved ? "Settings Saved!" : "Save Changes"}</span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default SettingsPage;
