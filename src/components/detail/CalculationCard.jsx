import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Calculator, Check } from 'lucide-react';

export const CalculationCard = ({ calculation }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!calculation) return null;

  return (
    <div className="rounded-2xl bg-white dark:bg-[#070D18] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      {/* Header Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-[#0E1A2B] hover:bg-slate-100/80 dark:hover:bg-[#13233A] text-left transition-colors border-b border-slate-200 dark:border-slate-800"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">How was this calculated?</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Transparent mathematical derivation from deterministic analytics engine</p>
          </div>
        </div>
        <div className="text-slate-500 dark:text-slate-400 p-1">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="p-5 space-y-4">
          
          {/* Base figures */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-[#0E1A2B] border border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-semibold uppercase tracking-wider">Current Cost:</span>
              <span className="text-sm font-black text-slate-800 dark:text-white">{calculation.currentCost}</span>
            </div>
            <div>
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 block font-semibold uppercase tracking-wider">Recommended Cost:</span>
              <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{calculation.recommendedCost}</span>
            </div>
          </div>

          {/* Math Step 1 */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0E1A2B] border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span className="font-bold text-slate-800 dark:text-slate-200">1. Absolute Savings Calculation</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Cost Delta</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white dark:bg-[#070D18] text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 shadow-sm font-medium">
              <div className="text-slate-600 dark:text-slate-300">{calculation.differenceFormula}</div>
              <div className="text-emerald-700 dark:text-emerald-400 font-extrabold mt-1">= {calculation.differenceResult}</div>
            </div>
          </div>

          {/* Math Step 2 */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0E1A2B] border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span className="font-bold text-slate-800 dark:text-slate-200">2. Percentage Reduction Calculation</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Percentage</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white dark:bg-[#070D18] text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 shadow-sm font-medium">
              <div className="text-slate-600 dark:text-slate-300">{calculation.percentageFormula}</div>
              <div className="text-emerald-700 dark:text-emerald-400 font-extrabold mt-1">= {calculation.percentageResult}</div>
            </div>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1.5 pt-1">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-medium">Direct deterministic calculation. Zero hallucinated or estimated figures.</span>
          </div>

        </div>
      )}
    </div>
  );
};

export default CalculationCard;

