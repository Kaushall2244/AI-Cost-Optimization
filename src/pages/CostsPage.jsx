import React from 'react';
import CostTrendChart from '../components/cost/CostTrendChart';
import ServiceBreakdownChart from '../components/cost/ServiceBreakdownChart';
import ProviderBreakdownChart from '../components/cost/ProviderBreakdownChart';
import TopExpensiveResourcesTable from '../components/cost/TopExpensiveResourcesTable';
import { DollarSign, CheckCircle2 } from 'lucide-react';

export const CostsPage = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1320] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-400 mb-1">
            <DollarSign className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Cost Overview</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Cloud & AI Cost Analysis</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl font-normal">
            Detailed breakdown of cloud infrastructure and AI workload spending across all teams and services.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-white block">Verified Data Stream</span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">720 Audited Records • AWS & AI Platform</span>
          </div>
        </div>
      </div>


      {/* Main Cost Trend (Bar Graph by default) */}
      <CostTrendChart />

      {/* Breakdown Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProviderBreakdownChart />
        <ServiceBreakdownChart />
      </div>

      {/* Expensive Resources Table */}
      <TopExpensiveResourcesTable />
    </div>
  );
};

export default CostsPage;
