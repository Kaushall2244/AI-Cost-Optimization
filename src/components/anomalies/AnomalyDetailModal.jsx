import React, { useState } from 'react';
import { X, AlertTriangle, Calendar, TrendingUp, ShieldAlert, Cpu, ArrowUpRight, CheckCircle2, RotateCcw } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export const AnomalyDetailModal = ({ anomaly, onClose, onOpenOpportunity, onResolve, onReopen, isResolved = false }) => {
  const [resolving, setResolving] = useState(false);

  if (!anomaly) return null;

  const handleResolveClick = () => {
    setResolving(true);
    if (onResolve) {
      onResolve(anomaly.id);
    }
    setTimeout(() => {
      setResolving(false);
      onClose();
    }, 1200);
  };

  const handleReopenClick = () => {
    if (onReopen) {
      onReopen(anomaly.id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0B1320] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">

        {/* Header */}
        <div className={`p-6 border-b flex items-start justify-between ${isResolved ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' : 'bg-amber-50/50 dark:bg-amber-950/30 border-slate-200 dark:border-slate-800'
          }`}>
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <StatusBadge type={anomaly.severity} variant="priority" />
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${isResolved
                  ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700'
                  : 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
                }`}>
                {isResolved ? "Resolved & Acknowledged" : "Statistical Billing Spike"}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Ref: {anomaly.id}</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
              <AlertTriangle className={`w-5 h-5 ${isResolved ? 'text-emerald-600' : 'text-amber-600'}`} />
              <span>Cost Anomaly: {anomaly.resource}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center space-x-2 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>
                Detected: {anomaly.liveTimeLabel || anomaly.date} ({anomaly.relativeTime || 'Recent'}) • {anomaly.provider} ({anomaly.service})
              </span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">

          {/* Resolved Success Notice if already resolved */}
          {isResolved && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>This anomaly has been acknowledged and marked as resolved. Cloud spend returned to expected baseline.</span>
            </div>
          )}

          {/* Financial Impact Metric Banner */}
          <div className="p-4 rounded-2xl bg-red-50/70 dark:bg-red-950/40 border border-red-200 dark:border-red-800/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-red-700 dark:text-red-300 tracking-wider block">
                Unplanned Expenditure Spike
              </span>
              <span className="text-2xl font-black text-red-700 dark:text-red-400 flex items-center">
                <ArrowUpRight className="w-6 h-6 mr-1" />
                {anomaly.costChange}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">Anomaly Engine Score</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-red-200 dark:border-red-800 inline-block mt-1">
                +3.42σ Outlier
              </span>
            </div>
          </div>

          {/* Reason & Root Cause */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Root Cause Telemetry Analysis
            </h4>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {anomaly.reason}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                {anomaly.details}
              </p>
            </div>
          </div>

          {/* Recommended Action */}
          <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-900 dark:text-blue-200">
              <ShieldAlert className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>FinOps Recommended Action</span>
            </div>
            <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
              {anomaly.linkedOpportunityId
                ? "This anomaly is directly linked to an actionable optimization opportunity. Review the configuration right-sizing proposal to prevent recurring overspend."
                : "Configure budget threshold alerts and enforce automated idle shutdown policies on this resource group."}
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#080E18] flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Calculated via Python z-score outlier detection.
          </span>
          <div className="flex items-center space-x-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-300 dark:border-slate-700 transition-colors shadow-sm"
            >
              Close
            </button>


            {isResolved ? (
              <button
                onClick={handleReopenClick}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-300 text-xs font-bold transition-all flex items-center space-x-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reopen Anomaly</span>
              </button>
            ) : (
              <button
                onClick={handleResolveClick}
                disabled={resolving}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center space-x-1.5 active:scale-95 disabled:opacity-75"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{resolving ? "Resolving..." : "Acknowledge & Resolve"}</span>
              </button>
            )}

            {anomaly.linkedOpportunityId && onOpenOpportunity && !isResolved && (
              <button
                onClick={() => {
                  onClose();
                  onOpenOpportunity(anomaly.linkedOpportunityId);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all flex items-center space-x-1.5"
              >
                <span>View Opportunity</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnomalyDetailModal;
