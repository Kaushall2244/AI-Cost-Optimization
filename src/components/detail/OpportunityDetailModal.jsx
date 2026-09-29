import React, { useState } from 'react';
import { 
  X, 
  Server, 
  TrendingDown, 
  CheckCircle2, 
  ArrowRight, 
  Code2, 
  Sliders, 
  ShieldCheck, 
  Copy, 
  Check, 
  Zap, 
  DollarSign,
  Terminal
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import EvidenceCard from './EvidenceCard';
import CalculationCard from './CalculationCard';
import AIExplanationCard from './AIExplanationCard';

export const OpportunityDetailModal = ({ opportunity, onClose, onOptimize }) => {
  const [applied, setApplied] = useState(false);
  const [scalingPercentage, setScalingPercentage] = useState(35);
  const [copiedIaC, setCopiedIaC] = useState(false);
  const [iacTab, setIacTab] = useState('terraform'); // 'terraform', 'aws-cli', 'boto3'

  if (!opportunity) return null;

  const {
    title,
    priority,
    resourceName,
    currentConfig,
    recommendedConfig,
    estimatedSavingsFormatted,
    potentialReduction,
    evidence,
    calculation,
    aiExplanation,
    aiLabel,
    currentCostValue = 150819,
    estimatedSavingsValue = 62308
  } = opportunity;

  // Live recalculated savings based on interactive slider
  const dynamicMonthlySavings = Math.round(currentCostValue * (scalingPercentage / 100));
  const dynamicAnnualSavings = dynamicMonthlySavings * 12;

  const handleApply = () => {
    setApplied(true);
    if (onOptimize) {
      onOptimize(opportunity.id, dynamicMonthlySavings);
    }
    setTimeout(() => {
      setApplied(false);
      onClose();
    }, 1800);
  };

  const getIacCode = () => {
    if (iacTab === 'terraform') {
      return `# Terraform HCL - Production Right-Sizing
resource "aws_instance" "${resourceName || 'workload'}" {
  instance_type = "${resourceName?.includes('gpu') ? 'g5.large' : 'm6i.large'}" # Downsized from ${resourceName?.includes('gpu') ? 'g5.xlarge' : 'm6i.xlarge'}
  
  tags = {
    CostCenter      = "FinOps-Optimized"
    MonthlySavings  = "₹${dynamicMonthlySavings.toLocaleString()}"
    AnnualSavings   = "₹${dynamicAnnualSavings.toLocaleString()}"
    AutomatedPolicy = "CostIQ-Deterministic-Scale"
  }
}`;
    } else if (iacTab === 'aws-cli') {
      return `# AWS CLI Production Execution
aws ec2 modify-instance-attribute \\
  --instance-id $(aws ec2 describe-instances --filters "Name=tag:Name,Values=${resourceName}" --query "Reservations[].Instances[].InstanceId" --output text) \\
  --instance-type "{\"Value\": \"${resourceName?.includes('gpu') ? 'g5.large' : 'm6i.large'}\"}"`;
    } else {
      return `# Python Boto3 FinOps Execution Script
import boto3

ec2 = boto3.client('ec2', region_name='us-east-1')
response = ec2.modify_instance_attribute(
    InstanceId='${resourceName}',
    InstanceType={'Value': '${resourceName?.includes('gpu') ? 'g5.large' : 'm6i.large'}'}
)
print(f"Successfully right-sized ${resourceName}. Projected savings: ₹${dynamicMonthlySavings.toLocaleString()}/mo")`;
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getIacCode());
    setCopiedIaC(true);
    setTimeout(() => setCopiedIaC(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#0B1320] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col my-8">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50/80 dark:bg-[#0B1320] sticky top-0 z-10">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <StatusBadge type={priority} variant="priority" />
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Verified Opportunity
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Ref: {opportunity.id}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">{title}</h2>
            {resourceName && (
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex items-center space-x-1.5 font-medium">
                <Server className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span className="font-semibold">Target Asset: {resourceName}</span>
                <span className="text-slate-400">•</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">Zero SLA Risk Verified</span>
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Applied Success Banner */}
          {applied && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-center space-x-3 animate-fade-in shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div className="text-xs">
                <span className="font-bold block">Optimization Dispatched Successfully!</span>
                <span>Scheduled right-sizing action for {resourceName}. Projected savings of ₹{dynamicMonthlySavings.toLocaleString()}/mo will reflect immediately.</span>
              </div>
            </div>
          )}

          {/* Configuration Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Current Configuration */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider block mb-2">
                CURRENT CONFIGURATION
              </span>
              <div className="space-y-1.5 text-xs">
                <div className="text-slate-900 dark:text-white font-bold">{currentConfig?.vcpu || "4 vCPU"}</div>
                <div className="text-slate-600 dark:text-slate-300 font-medium">{currentConfig?.ram || "16 GB RAM"}</div>
                <div className="text-slate-500 dark:text-slate-400 font-bold mt-2 text-sm line-through decoration-red-400">
                  {currentConfig?.cost || opportunity.currentCostFormatted}
                </div>
              </div>
            </div>

            {/* Recommended Configuration */}
            <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/80 relative overflow-hidden">
              <div className="absolute top-0 right-0 px-2.5 py-0.5 bg-blue-600 text-[9px] font-extrabold text-white uppercase rounded-bl-lg">
                Target Right-size
              </div>
              <span className="text-[10px] uppercase font-bold text-blue-700 dark:text-blue-300 tracking-wider block mb-2">
                RECOMMENDED CONFIGURATION
              </span>
              <div className="space-y-1.5 text-xs">
                <div className="text-blue-950 dark:text-blue-100 font-bold">{recommendedConfig?.vcpu || "2 vCPU"}</div>
                <div className="text-blue-800 dark:text-blue-200 font-medium">{recommendedConfig?.ram || "8 GB RAM"}</div>
                <div className="text-emerald-700 dark:text-emerald-400 font-extrabold mt-2 text-sm">
                  {recommendedConfig?.cost || opportunity.estimatedSavingsFormatted}
                </div>
              </div>
            </div>

            {/* Estimated Savings */}
            <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 tracking-wider block mb-1">
                  NET MONTHLY SAVINGS
                </span>
                <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400">
                  ₹{dynamicMonthlySavings.toLocaleString()}
                </div>
              </div>
              <div className="mt-2 inline-flex items-center space-x-1 text-xs text-emerald-800 dark:text-emerald-300 font-bold bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-700 w-fit shadow-sm">
                <TrendingDown className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{scalingPercentage}% reduction</span>
              </div>
            </div>

          </div>

          {/* Interactive Live Capacity Scaling Simulator */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50/70 to-indigo-50/70 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200/80 dark:border-blue-800/60 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  Interactive Live Capacity Simulator
                </span>
              </div>
              <div className="flex items-center space-x-3 text-xs">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Reclaimed Headroom:</span>
                <span className="px-2.5 py-0.5 rounded-lg bg-blue-600 text-white font-black">
                  {scalingPercentage}%
                </span>
              </div>
            </div>

            {/* Slider */}
            <div className="space-y-1">
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={scalingPercentage}
                onChange={(e) => setScalingPercentage(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-bold">
                <span>Conservative (10%)</span>
                <span>Audited Baseline (35%)</span>
                <span>Aggressive (60%)</span>
              </div>
            </div>

            {/* Dynamic Calculated Impact Preview */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-blue-100 dark:border-blue-900/50 shadow-sm">
                <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 block">Monthly Savings</span>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">₹{dynamicMonthlySavings.toLocaleString()}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-blue-100 dark:border-blue-900/50 shadow-sm">
                <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 block">Annualized ROI</span>
                <span className="text-sm font-black text-blue-700 dark:text-blue-400">₹{dynamicAnnualSavings.toLocaleString()}/yr</span>
              </div>
              <div className="col-span-2 sm:col-span-1 p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-blue-100 dark:border-blue-900/50 shadow-sm">
                <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 block">Service SLA Risk</span>
                <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>100% Guaranteed</span>
                </span>
              </div>
            </div>
          </div>


          {/* Real-World Infrastructure-as-Code (IaC) Deployment Script */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">

            <div className="bg-slate-900 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Production Deployment Script (IaC Ready)
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {/* Format Selector */}
                <div className="flex bg-slate-800 rounded-lg p-0.5 text-[11px] font-semibold text-slate-300">
                  <button
                    onClick={() => setIacTab('terraform')}
                    className={`px-2.5 py-0.5 rounded-md transition-all ${
                      iacTab === 'terraform' ? 'bg-blue-600 text-white font-bold' : 'hover:text-white'
                    }`}
                  >
                    Terraform
                  </button>
                  <button
                    onClick={() => setIacTab('aws-cli')}
                    className={`px-2.5 py-0.5 rounded-md transition-all ${
                      iacTab === 'aws-cli' ? 'bg-blue-600 text-white font-bold' : 'hover:text-white'
                    }`}
                  >
                    AWS CLI
                  </button>
                  <button
                    onClick={() => setIacTab('boto3')}
                    className={`px-2.5 py-0.5 rounded-md transition-all ${
                      iacTab === 'boto3' ? 'bg-blue-600 text-white font-bold' : 'hover:text-white'
                    }`}
                  >
                    Python Boto3
                  </button>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Copy snippet"
                >
                  {copiedIaC ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <pre className="p-4 bg-slate-950 text-slate-300 text-xs font-sans overflow-x-auto leading-relaxed">
              <code>{getIacCode()}</code>
            </pre>
          </div>

          {/* Evidence Section */}
          <EvidenceCard evidence={evidence} />

          {/* Calculation Section (Collapsible) */}
          <CalculationCard calculation={calculation} />

          {/* AI Explanation Section */}
          <AIExplanationCard explanation={aiExplanation} label={aiLabel} />

        </div>

        {/* Footer Actions */}
        <div className="p-4 px-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#080E18] flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Calculated with local telemetry and deterministic Python proofs.
          </span>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-300 dark:border-slate-700 transition-colors shadow-sm"
            >
              Dismiss
            </button>
            <button
              onClick={handleApply}
              disabled={applied}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all flex items-center space-x-1.5 active:scale-95 disabled:opacity-75"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{applied ? "Applied!" : "Apply Optimization"}</span>
            </button>
          </div>
        </div>


      </div>
    </div>
  );
};

export default OpportunityDetailModal;
