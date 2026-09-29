import React from 'react';
import { Sparkles, Brain, Info } from 'lucide-react';

export const AIExplanationCard = ({ explanation, label }) => {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-blue-50/90 via-white to-indigo-50/60 dark:from-[#0E1A2B] dark:via-[#070D18] dark:to-[#0B1728] border border-blue-200 dark:border-blue-900/60 p-5 lg:p-6 shadow-sm relative">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-600/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">AI Explanation</h4>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Executive Narrative Synthesis</span>
          </div>
        </div>

        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100/80 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
          <Brain className="w-3.5 h-3.5 mr-1 text-blue-600 dark:text-blue-400" />
          {label || "Generated from analyzed evidence"}
        </span>
      </div>

      {/* AI Text Body */}
      <div className="bg-white dark:bg-[#070D18] p-4 rounded-xl border border-blue-100 dark:border-slate-800 shadow-sm">
        <p className="text-xs md:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-normal italic">
          "{explanation}"
        </p>
      </div>

      {/* Role Clarity Footer */}
      <div className="mt-3.5 flex items-start space-x-2 text-[11px] text-slate-600 dark:text-slate-400 bg-white/70 dark:bg-[#0E1A2B]/70 p-2.5 rounded-lg border border-blue-100 dark:border-slate-800">
        <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <span>
          <strong className="text-slate-800 dark:text-slate-200 font-semibold">Architecture Note:</strong> Gemini synthesizes natural language executive explanations based strictly on deterministic telemetry metrics and savings calculations computed by the Python analytics pipeline.
        </span>
      </div>

    </div>
  );

};

export default AIExplanationCard;
