import React, { useState, useEffect } from 'react';
import KpiCard from '../components/common/KpiCard';
import CostTrendChart from '../components/cost/CostTrendChart';
import ServiceBreakdownChart from '../components/cost/ServiceBreakdownChart';
import OpportunityList from '../components/opportunities/OpportunityList';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import LiveTelemetryWidget from '../components/telemetry/LiveTelemetryWidget';
import { getKpiMetrics } from '../api/metrics';
import { getOptimizationMetrics } from '../api/opportunities';
import { demoKpis } from '../data/demoData';
import { TrendingDown, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export const DashboardPage = () => {
  const [kpi, setKpi] = useState(demoKpis);
  const [optMetrics, setOptMetrics] = useState(() => getOptimizationMetrics());

  const [resolvedAnomaliesCount, setResolvedAnomaliesCount] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('costiq_resolved_anomalies') || '[]').length;
    } catch (e) {
      return 0;
    }
  });

  useEffect(() => {
    let isMounted = true;
    getKpiMetrics().then((res) => {
      if (isMounted && res) {
        setKpi(res);
      }
    });

    const syncOpps = () => {
      setOptMetrics(getOptimizationMetrics());
    };

    const syncAnomalies = () => {
      try {
        const count = JSON.parse(localStorage.getItem('costiq_resolved_anomalies') || '[]').length;
        setResolvedAnomaliesCount(count);
      } catch (e) {
        setResolvedAnomaliesCount(0);
      }
    };

    window.addEventListener('costiq_opportunities_updated', syncOpps);
    window.addEventListener('costiq_anomalies_updated', syncAnomalies);
    window.addEventListener('storage', syncOpps);
    window.addEventListener('storage', syncAnomalies);

    return () => { 
      isMounted = false; 
      window.removeEventListener('costiq_opportunities_updated', syncOpps);
      window.removeEventListener('costiq_anomalies_updated', syncAnomalies);
      window.removeEventListener('storage', syncOpps);
      window.removeEventListener('storage', syncAnomalies);
    };
  }, []);

  if (!kpi) {
    return <LoadingSkeleton type="kpi" count={4} />;
  }

  const baseTotalCost = kpi.totalCost?.amount || 376784;
  const currentTotalCost = Math.max(0, baseTotalCost - optMetrics.realized);
  const costReductionPercent = baseTotalCost > 0 ? ((optMetrics.realized / baseTotalCost) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-6">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TOTAL COST */}
        <KpiCard
          type="totalCost"
          title="TOTAL COST"
          value={
            optMetrics.realized > 0
              ? `₹${currentTotalCost.toLocaleString()}`
              : kpi.totalCost?.formatted || "₹3,76,784"
          }
          change={
            optMetrics.realized > 0
              ? `-${costReductionPercent}%`
              : kpi.totalCost?.change || "+14.2%"
          }
          period={
            optMetrics.realized > 0
              ? `Reduced by ₹${optMetrics.realized.toLocaleString()} (${optMetrics.optimizedCount} right-sized)`
              : kpi.totalCost?.period || "60-day billing cycle ($4,539.57)"
          }
          isPositive={optMetrics.realized > 0}
        />

        {/* POTENTIAL SAVINGS */}
        <KpiCard
          type="savings"
          title={optMetrics.realized > 0 ? "POTENTIAL SAVINGS (PENDING)" : "POTENTIAL SAVINGS"}
          value={
            optMetrics.realized > 0
              ? `₹${optMetrics.remaining.toLocaleString()}`
              : kpi.potentialSavings?.formatted || "₹1,10,704"
          }
          change={
            optMetrics.realized > 0
              ? `₹${optMetrics.realized.toLocaleString()} Saved`
              : kpi.potentialSavings?.percentage || "29.4%"
          }
          subtitle={
            optMetrics.realized > 0
              ? `${Math.round((optMetrics.realized / optMetrics.totalPotential) * 100)}% captured • ${optMetrics.optimizedCount} applied`
              : kpi.potentialSavings?.subtitle || "deterministic savings ($1,333.78)"
          }
          isPositive={true}
          highlight="savings"
        />

        {/* OPTIMIZATION OPPORTUNITIES */}
        <KpiCard
          type="opportunities"
          title="OPTIMIZATION OPPORTUNITIES"
          value={optMetrics.pendingCount}
          subtitle={
            optMetrics.optimizedCount > 0
              ? `${optMetrics.optimizedCount} applied • ${optMetrics.pendingCount} pending`
              : kpi.opportunities?.subtitle || "2 high priority (GPU & Compute)"
          }
          isPositive={true}
        />

        {/* ANOMALIES */}
        <KpiCard
          type="anomalies"
          title="ANOMALIES"
          value={Math.max(0, (kpi.anomalies?.total || 6) - resolvedAnomaliesCount)}
          subtitle={
            resolvedAnomaliesCount > 0
              ? `${resolvedAnomaliesCount} resolved • ${Math.max(0, (kpi.anomalies?.total || 6) - resolvedAnomaliesCount)} active surges`
              : kpi.anomalies?.subtitle || "4 critical surges detected"
          }
          isPositive={resolvedAnomaliesCount >= (kpi.anomalies?.total || 6)}
          highlight={Math.max(0, (kpi.anomalies?.total || 6) - resolvedAnomaliesCount) > 0 ? "anomalies" : undefined}
        />
      </div>

      {/* Realized Savings Achievement Banner */}
      {optMetrics.realized > 0 && (
        <div className="p-4 px-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-blue-950/30 border border-emerald-200 dark:border-emerald-800/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 shrink-0">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                  Realized FinOps Impact
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60">
                  {Math.round((optMetrics.realized / optMetrics.totalPotential) * 100)}% Potential Captured
                </span>
              </div>
              <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                ₹{optMetrics.realized.toLocaleString()} / month permanently saved across {optMetrics.optimizedCount} right-sized workload{optMetrics.optimizedCount > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4 self-end md:self-auto">
            <div className="text-right">
              <span className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                New Projected Spend
              </span>
              <span className="text-sm font-black text-slate-900 dark:text-white">
                ₹{currentTotalCost.toLocaleString()} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">/mo</span>
              </span>
            </div>
          </div>
        </div>
      )}


      {/* Live Infrastructure Telemetry Stream */}
      <LiveTelemetryWidget />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CostTrendChart />
        </div>
        <div className="lg:col-span-1">
          <ServiceBreakdownChart />
        </div>
      </div>

      {/* Top Optimization Opportunities */}
      <div className="pt-2">
        <OpportunityList limit={3} title="Top Optimization Opportunities" showFilters={false} />
      </div>
    </div>
  );
};

export default DashboardPage;

