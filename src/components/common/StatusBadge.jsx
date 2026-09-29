import React from 'react';

export const StatusBadge = ({ type, variant = 'priority' }) => {
  if (variant === 'evidence') {
    const evidenceStyles = {
      Measured: 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      Calculated: 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      Estimated: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    };

    const style = evidenceStyles[type] || 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${style}`}>
        <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-80"></span>
        {type}
      </span>
    );
  }

  // Priority or Severity badges
  const priorityStyles = {
    HIGH: 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
    MEDIUM: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    LOW: 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  };

  const style = priorityStyles[type?.toUpperCase()] || 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${style}`}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-80"></span>
      {type}
    </span>
  );
};


export default StatusBadge;
