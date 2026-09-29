import React, { useState, useEffect } from 'react';
import { getPipelineWorkflow } from '../../api/analysis';
import LoadingSkeleton from '../common/LoadingSkeleton';
import { Database, Cpu, Zap, Search, Calculator, CheckCircle, Sparkles, ArrowRight, ShieldCheck, Check } from 'lucide-react';

const iconMap = {
  Database,
  Cpu,
  Zap,
  Search,
  Calculator,
  CheckCircle,
  Sparkles
};

export const PipelineWorkflow = () => {
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    let isMounted = true;
    getPipelineWorkflow().then((res) => {
      if (isMounted) {
        setSteps(res);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return <LoadingSkeleton type="card" count={4} />;
  }

  const selectedStepObj = steps.find(s => (s.step || s.id) === activeStep) || steps[0];

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-50 via-white to-indigo-50 dark:from-blue-950/40 dark:via-[#0B1320] dark:to-indigo-950/40 border border-blue-200 dark:border-blue-900/60 shadow-sm">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-sm shadow-blue-600/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">How CostIQ Works</h2>
            <span className="text-xs text-blue-700 dark:text-blue-400 font-bold">End-to-End Optimization Pipeline</span>
          </div>
        </div>
        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed mt-1">
          CostIQ processes real cloud usage records, calculates underutilized capacity, uncovers spending spikes, and generates plain-language cost-saving recommendations.
        </p>
      </div>

      {/* Horizontal Flow Pipeline */}
      <div className="rounded-3xl bg-white dark:bg-[#0B1320] border border-slate-200 dark:border-slate-800 p-6 shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Pipeline Steps
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Select any step to view details
          </span>
        </div>

        <div className="flex items-center space-x-3 min-w-max pb-2">
          {steps.map((item, index) => {
            const stepNumber = item.step || item.id || (index + 1);
            const title = item.title || item.name || `Step ${stepNumber}`;
            const Icon = iconMap[item.icon] || Cpu;
            const isActive = activeStep === stepNumber;
            const isAI = stepNumber === 7;

            return (
              <React.Fragment key={stepNumber}>
                <button
                  onClick={() => setActiveStep(stepNumber)}
                  className={`
                    flex flex-col items-center p-4 rounded-2xl border text-center transition-all duration-200 w-44 shrink-0
                    ${isActive
                      ? (isAI
                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20'
                        : 'bg-navy-900 dark:bg-blue-600 text-white border-navy-900 dark:border-blue-600 shadow-md'
                      )
                      : 'bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }
                  `}
                >
                  <div className={`
                    w-9 h-9 rounded-xl flex items-center justify-center mb-2.5 text-xs font-bold shadow-sm
                    ${isActive
                      ? 'bg-white text-blue-700'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }
                  `}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-extrabold truncate w-full">{title}</span>
                  <span className={`text-[11px] font-bold mt-1 ${isActive ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                    Step 0{stepNumber}
                  </span>
                </button>

                {index < steps.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Selected Step Detail Panel */}
      {selectedStepObj && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1320] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center space-x-3">
              <span className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 flex items-center justify-center text-xs font-black border border-blue-200 dark:border-blue-800">
                0{selectedStepObj.step || selectedStepObj.id}
              </span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{selectedStepObj.title || selectedStepObj.name}</h3>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 self-start sm:self-auto">
              Result: {selectedStepObj.output}
            </span>
          </div>

          <div className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            {selectedStepObj.description}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider block mb-1">
                Process Type
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {selectedStepObj.step === 7
                  ? "Executive AI Summary Synthesis"
                  : "Automated Data & Cost Calculations"}
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider block mb-1">
                Data Validation
              </span>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center space-x-1.5">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Verified with Real Billing Records</span>
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PipelineWorkflow;
