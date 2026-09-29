import React, { useState, useEffect } from 'react';
import OpportunityCard from './OpportunityCard';
import OpportunityDetailModal from '../detail/OpportunityDetailModal';
import { getOpportunities, recordOptimization, rollbackOptimization } from '../../api/opportunities';
import { demoOpportunities } from '../../data/demoData';
import LoadingSkeleton from '../common/LoadingSkeleton';
import { Search, Sparkles, CheckCircle2, Clock, Check } from 'lucide-react';

export const OpportunityList = ({ limit, title = "Optimization Opportunities", showFilters = false }) => {
  const [opportunities, setOpportunities] = useState(() => (limit ? demoOpportunities.slice(0, limit) : demoOpportunities));
  const [loading, setLoading] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'optimized'
  
  // Persistent optimized IDs
  const [optimizedIds, setOptimizedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('costiq_optimized_opps') || '[]');
    } catch (e) {
      return [];
    }
  });

  const [toastMessage, setToastMessage] = useState(null);

  const fetchOpps = () => {
    getOpportunities({
      priority: priorityFilter,
      category: categoryFilter,
      search: searchQuery
    }).then((res) => {
      if (res && res.length > 0) {
        setOpportunities(limit ? res.slice(0, limit) : res);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchOpps();
  }, [priorityFilter, categoryFilter, searchQuery, limit]);

  useEffect(() => {
    const sync = () => {
      try {
        setOptimizedIds(JSON.parse(localStorage.getItem('costiq_optimized_opps') || '[]'));
      } catch (e) {}
    };
    window.addEventListener('costiq_opportunities_updated', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('costiq_opportunities_updated', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const handleOptimize = (id, customSavings) => {
    recordOptimization(id, customSavings);
    setOptimizedIds(JSON.parse(localStorage.getItem('costiq_optimized_opps') || '[]'));
    setToastMessage("Optimization applied! Moved to the 'Optimized' tab.");
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRollback = (id) => {
    rollbackOptimization(id);
    setOptimizedIds(JSON.parse(localStorage.getItem('costiq_optimized_opps') || '[]'));
    setToastMessage("Opportunity rolled back to Active queue.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter pending vs optimized
  const pendingOpps = opportunities.filter(opp => !optimizedIds.includes(opp.id));
  const completedOpps = opportunities.filter(opp => optimizedIds.includes(opp.id));
  const displayedOpps = activeTab === 'pending' ? pendingOpps : completedOpps;

  const pendingSavings = pendingOpps.reduce((sum, o) => sum + (o.estimatedSavingsValue || 0), 0);
  const completedSavings = completedOpps.reduce((sum, o) => {
    try {
      const savingsMap = JSON.parse(localStorage.getItem('costiq_optimized_savings_map') || '{}');
      return sum + (savingsMap[o.id] !== undefined ? Number(savingsMap[o.id]) : (o.estimatedSavingsValue || 0));
    } catch (e) {
      return sum + (o.estimatedSavingsValue || 0);
    }
  }, 0);

  return (
    <div className="space-y-4">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="p-3 px-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-emerald-600 hover:text-emerald-900 text-xs font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
            {title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
            {activeTab === 'pending'
              ? `₹${pendingSavings.toLocaleString()} in pending recommendations with verified telemetry proofs`
              : `₹${completedSavings.toLocaleString()} in verified realized savings across ${completedOpps.length} workloads`}
          </p>
        </div>


        <div className="flex flex-wrap items-center gap-3">
          {/* Active vs Optimized Tab Switcher */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'pending'
                  ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>Pending</span>
              <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === 'pending' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}>
                {pendingOpps.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('optimized')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'optimized'
                  ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>Optimized</span>
              <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === 'optimized' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}>
                {completedOpps.length}
              </span>
            </button>
          </div>

          {showFilters && (
            <>
              {/* Search Input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search opportunities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-600 shadow-sm w-40 md:w-52"
                />
              </div>

              {/* Priority Filter */}
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 font-semibold focus:outline-none focus:border-blue-600 shadow-sm"
              >
                <option value="ALL">All Priorities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High Priority</option>
                <option value="MEDIUM">Medium Priority</option>
              </select>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 font-semibold focus:outline-none focus:border-blue-600 shadow-sm"
              >
                <option value="ALL">All Categories</option>
                <option value="Compute">Compute</option>
                <option value="AI / ML">AI / ML</option>
              </select>
            </>
          )}
        </div>
      </div>

      {/* Grid of Opportunities */}
      {loading ? (
        <LoadingSkeleton type="card" count={limit || 3} />
      ) : displayedOpps.length === 0 ? (
        <div className="p-10 rounded-2xl bg-white dark:bg-[#0B1320] border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          {activeTab === 'pending' ? (
            <div className="space-y-2">
              <div className="inline-flex p-3 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mb-1">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">All Opportunities Optimized!</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                There are no pending recommendations. All right-sizing actions have been executed. View the "Optimized" tab to inspect realized savings.
              </p>
              <button
                onClick={() => setActiveTab('optimized')}
                className="mt-3 px-4 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 transition-colors"
              >
                View Optimized Assets ({completedOpps.length})
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="inline-flex p-3 rounded-full bg-slate-100 text-slate-400 mb-1">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No Optimized Assets Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                When you click "View Analysis" on any pending opportunity and apply right-sizing, it moves here so you can track your realized savings and audit proofs.
              </p>
              <button
                onClick={() => setActiveTab('pending')}
                className="mt-3 px-4 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
              >
                Explore Pending Opportunities
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedOpps.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              isOptimized={optimizedIds.includes(opp.id)}
              onViewAnalysis={(item) => setSelectedOpportunity(item)}
              onRollback={handleRollback}
            />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedOpportunity && (
        <OpportunityDetailModal
          opportunity={selectedOpportunity}
          onClose={() => setSelectedOpportunity(null)}
          onOptimize={handleOptimize}
        />
      )}
    </div>
  );
};

export default OpportunityList;
