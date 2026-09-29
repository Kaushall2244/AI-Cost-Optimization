import React from 'react';
import StatusBadge from '../common/StatusBadge';
import { Activity } from 'lucide-react';

export const EvidenceCard = ({ evidence = [] }) => {
  return (
    <div className="rounded-2xl bg-slate-50 dark:bg-[#070D18] border border-slate-200 dark:border-slate-800 p-5">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">Analyzed Telemetry Evidence</h4>
        </div>
        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
          Verified Evidence
        </span>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
        Real system and usage metrics collected from cloud infrastructure.
      </p>

      <div className="space-y-2.5">
        {evidence.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#0E1A2B] border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">{item.label}</span>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{item.value}</span>
            </div>
            <div>
              <StatusBadge type={item.type} variant="evidence" />
            </div>
          </div>
        ))}
      </div>
    </div>

  );
};

export default EvidenceCard;
