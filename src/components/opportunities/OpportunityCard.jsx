import React from 'react';
import StatusBadge from '../common/StatusBadge';
import { ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';

export const OpportunityCard = ({ opportunity, onViewAnalysis, isOptimized = false, onRollback }) => {
  const {
    id,
    priority,
    title,
    resourceName,
    description,
    currentCostFormatted,
    estimatedSavingsFormatted,
    potentialReduction
  } = opportunity;

  return (
    <div className={`rounded-2xl border p-5 transition-all duration-200 flex flex-col justify-between group ${
      isOptimized
        ? 'bg-emerald-50/30 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 shadow-sm'
        : 'bg-white dark:bg-[#0B1320] border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-600/60 hover:shadow-md'
    }`}>
      <div>
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2">
            <StatusBadge type={priority} variant="priority" />
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center space-x-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isOptimized ? 'bg-emerald-500' : 'bg-blue-500 animate-pulse'}`}></span>
              <span>{resourceName}</span>
            </span>
          </div>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
            isOptimized 
              ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700' 
              : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
          }`}>
            -{potentialReduction}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
          {title}
        </h3>

        {/* Clean, concise description */}
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Clean Savings & Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-end justify-between mb-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Current Cost</span>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 line-through">
              {currentCostFormatted}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block tracking-wider">
              {isOptimized ? 'Realized Savings' : 'Est. Savings'}
            </span>
            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
              {estimatedSavingsFormatted}
            </span>
          </div>
        </div>

        {/* Action Button */}
        {isOptimized ? (
          <div className="flex items-center justify-between pt-1">
            <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-900/40 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Optimized</span>
            </span>
            {onRollback && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRollback(id);
                }}
                className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 flex items-center space-x-1 px-2.5 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                title="Restore to active recommendations"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Rollback</span>
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={() => onViewAnalysis(opportunity)}
            className="w-full py-2 px-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-600 dark:hover:bg-blue-600 text-blue-700 dark:text-blue-300 hover:text-white dark:hover:text-white border border-blue-200 dark:border-blue-700/60 hover:border-blue-600 text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow-sm"
          >
            <span>View Analysis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default OpportunityCard;

