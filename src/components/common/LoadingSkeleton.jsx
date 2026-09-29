import React from 'react';

export const LoadingSkeleton = ({ type = 'card', count = 1 }) => {
  const items = Array.from({ length: count });

  if (type === 'kpi') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {items.map((_, i) => (
          <div key={i} className="h-32 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="h-4 bg-slate-200 rounded-md w-1/2 mb-4"></div>
            <div className="h-8 bg-slate-200 rounded-lg w-3/4 mb-3"></div>
            <div className="h-3 bg-slate-100 rounded-md w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className="h-80 bg-white rounded-2xl border border-slate-200 p-6 animate-pulse flex flex-col justify-between shadow-sm">
        <div className="flex justify-between items-center">
          <div className="h-5 bg-slate-200 rounded-md w-1/4"></div>
          <div className="h-8 bg-slate-100 rounded-xl w-32"></div>
        </div>
        <div className="h-48 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 text-xs font-medium">
          Loading chart...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-pulse">
      {items.map((_, i) => (
        <div key={i} className="h-28 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="h-4 bg-slate-200 rounded-md w-1/3 mb-3"></div>
          <div className="h-3 bg-slate-100 rounded-md w-2/3 mb-2"></div>
          <div className="h-3 bg-slate-100 rounded-md w-1/2"></div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
