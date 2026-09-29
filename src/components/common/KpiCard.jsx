import React from 'react';
import { DollarSign, TrendingDown, Sparkles, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const iconMap = {
  totalCost: DollarSign,
  savings: TrendingDown,
  opportunities: Sparkles,
  anomalies: AlertTriangle,
};

export const KpiCard = ({ title, value, change, period, subtitle, type, isPositive, highlight }) => {
  const Icon = iconMap[type] || DollarSign;

  return (
    <div className={`
      relative overflow-hidden rounded-2xl bg-white dark:bg-[#0B1320] border border-slate-200 dark:border-slate-800 p-5 lg:p-6
      transition-all duration-200 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700
      ${highlight === 'savings' ? 'border-emerald-200 dark:border-emerald-800/80 bg-gradient-to-b from-white dark:from-[#0B1320] via-white dark:via-[#0B1320] to-emerald-50/40 dark:to-emerald-950/20 shadow-sm' : ''}
      ${highlight === 'anomalies' ? 'border-amber-200 dark:border-amber-800/80 bg-gradient-to-b from-white dark:from-[#0B1320] via-white dark:via-[#0B1320] to-amber-50/40 dark:to-amber-950/20 shadow-sm' : ''}
    `}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className={`
          p-2.5 rounded-xl border
          ${type === 'savings' ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400' : ''}
          ${type === 'anomalies' ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-600 dark:text-amber-400' : ''}
          ${type === 'opportunities' ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/60 text-blue-600 dark:text-blue-400' : ''}
          ${type === 'totalCost' ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300' : ''}
        `}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-4">
        <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans">
          {value}
        </div>

        <div className="mt-2.5 flex items-center text-xs font-medium space-x-2">
          {change && (
            <span className={`
              inline-flex items-center px-2 py-0.5 rounded-md font-sans text-[11px] font-bold border
              ${isPositive 
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' 
                : 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
              }
            `}>
              {isPositive ? <ArrowDownRight className="w-3 h-3 mr-0.5" /> : <ArrowUpRight className="w-3 h-3 mr-0.5" />}
              {change}
            </span>
          )}
          
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            {period || subtitle}
          </span>
        </div>
      </div>
    </div>
  );
};

export default KpiCard;

