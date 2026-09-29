import React, { useState, useEffect } from 'react';
import StatusBadge from '../common/StatusBadge';
import OpportunityDetailModal from '../detail/OpportunityDetailModal';
import AnomalyDetailModal from './AnomalyDetailModal';
import { getAnomalies } from '../../api/anomalies';
import { getOpportunityById } from '../../api/opportunities';
import LoadingSkeleton from '../common/LoadingSkeleton';
import {
  AlertTriangle,
  Calendar,
  ArrowUpRight,
  Search,
  ExternalLink,
  Clock,
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
  Check
} from 'lucide-react';
import { demoAnomalies } from '../../data/demoData';

const defaultLiveAnomalies = demoAnomalies.map((item, idx) => {
  const offsets = [14, 38, 145, 370, 1420, 2880];
  const offsetMin = offsets[idx] || (idx * 45 + 15);
  const now = new Date();
  const liveDate = new Date(now.getTime() - offsetMin * 60 * 1000);
  const timeStr = liveDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const relativeTime = offsetMin < 60 ? `${offsetMin}m ago` : offsetMin < 1440 ? `${Math.floor(offsetMin / 60)}h ago` : `Yesterday`;
  const liveTimeLabel = offsetMin < 1440 ? `Today, ${timeStr}` : `Yesterday, ${timeStr}`;
  return {
    ...item,
    datasetDate: item.date,
    liveTimeLabel,
    relativeTime,
    isLiveStream: offsetMin < 60
  };
});

export const AnomalyList = ({ showFilters = false }) => {
  const [anomalies, setAnomalies] = useState(defaultLiveAnomalies);
  const [loading, setLoading] = useState(false);
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeMode, setTimeMode] = useState('live'); // 'live' or 'dataset'
  const [alertTab, setAlertTab] = useState('active'); // 'active' or 'resolved'
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [selectedAnomaly, setSelectedAnomaly] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Persistent resolved anomaly IDs
  const [resolvedIds, setResolvedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('costiq_resolved_anomalies') || '[]');
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    let isMounted = true;
    getAnomalies({ severity: severityFilter, search: searchQuery }).then((res) => {
      if (isMounted && res && res.length > 0) {
        setAnomalies(res);
      }
    });
    return () => { isMounted = false; };
  }, [severityFilter, searchQuery]);

  const handleResolve = (id) => {
    const updated = Array.from(new Set([...resolvedIds, id]));
    setResolvedIds(updated);
    localStorage.setItem('costiq_resolved_anomalies', JSON.stringify(updated));
    window.dispatchEvent(new Event('costiq_anomalies_updated'));
    setToastMessage("Anomaly marked as resolved and moved to Resolved tab.");
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleReopen = (id) => {
    const updated = resolvedIds.filter(item => item !== id);
    setResolvedIds(updated);
    localStorage.setItem('costiq_resolved_anomalies', JSON.stringify(updated));
    window.dispatchEvent(new Event('costiq_anomalies_updated'));
    setToastMessage("Anomaly reopened into Active Alerts queue.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRowClick = (anomaly) => {
    setSelectedAnomaly(anomaly);
  };

  const handleOpenLinkedOpportunity = async (oppId) => {
    const opp = await getOpportunityById(oppId);
    if (opp) {
      setSelectedOpportunity(opp);
    }
  };

  // Filter active vs resolved
  const activeAnomalies = anomalies.filter(a => !resolvedIds.includes(a.id));
  const resolvedAnomalies = anomalies.filter(a => resolvedIds.includes(a.id));
  const displayedAnomalies = alertTab === 'active' ? activeAnomalies : resolvedAnomalies;

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

      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Detected Cost Anomalies</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
            Statistical deviation engine comparing actual billing spikes against normal spending baselines
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Active vs Resolved Switcher */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setAlertTab('active')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${alertTab === 'active'
                ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              <AlertTriangle className="w-3 h-3 text-amber-500" />
              <span>Active Alerts</span>
              <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] ${alertTab === 'active' ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}>
                {activeAnomalies.length}
              </span>
            </button>

            <button
              onClick={() => setAlertTab('resolved')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${alertTab === 'resolved'
                ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              <Check className="w-3 h-3 text-emerald-600" />
              <span>Resolved</span>
              <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] ${alertTab === 'resolved' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}>
                {resolvedAnomalies.length}
              </span>
            </button>
          </div>

          {/* Time Mode Switcher */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setTimeMode('live')}
              className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center space-x-1.5 ${timeMode === 'live'
                ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live Real-Time</span>
            </button>
            <button
              onClick={() => setTimeMode('dataset')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${timeMode === 'dataset'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              Dataset Dates
            </button>
          </div>

          {showFilters && (
            <>
              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search anomaly..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-600 shadow-sm w-40 md:w-52"
                />
              </div>

              {/* Severity Filter */}
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 font-semibold focus:outline-none focus:border-blue-600 shadow-sm"
              >
                <option value="ALL">All Severities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High Severity</option>
                <option value="MEDIUM">Medium Severity</option>
              </select>
            </>
          )}
        </div>
      </div>

      {/* Anomalies List / Table */}
      {loading ? (
        <LoadingSkeleton type="card" count={3} />
      ) : displayedAnomalies.length === 0 ? (
        <div className="p-10 rounded-2xl bg-white dark:bg-[#0B1320] border border-slate-200 dark:border-slate-800 text-center shadow-sm">
          {alertTab === 'active' ? (
            <div className="space-y-2">
              <div className="inline-flex p-3 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mb-1">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">All Cost Anomalies Resolved!</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                No active billing spikes or budget outliers detected. All infrastructure spending is operating within baseline bounds.
              </p>
              <button
                onClick={() => setAlertTab('resolved')}
                className="mt-3 px-4 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 transition-colors"
              >
                View Resolved Anomalies ({resolvedAnomalies.length})
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="inline-flex p-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mb-1">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Resolved Anomalies Yet</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                When you analyze an active anomaly and click "Acknowledge & Resolve", it will appear here with complete audit history.
              </p>
              <button
                onClick={() => setAlertTab('active')}
                className="mt-3 px-4 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
              >
                Inspect Active Alerts ({activeAnomalies.length})
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl bg-white dark:bg-[#0B1320] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">
                    {timeMode === 'live' ? 'Live Detected Time' : 'Dataset Date'}
                  </th>
                  <th className="py-3.5 px-4">Target Resource</th>
                  <th className="py-3.5 px-4">Cost Change</th>
                  <th className="py-3.5 px-4">Severity</th>
                  <th className="py-3.5 px-4">Reason / Root Cause</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">

                {displayedAnomalies.map((anom) => {
                  const isItemResolved = resolvedIds.includes(anom.id);
                  return (
                    <tr
                      key={anom.id}
                      onClick={() => handleRowClick(anom)}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-850/50 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {timeMode === 'live' ? (
                          <div>
                            <div className="flex items-center space-x-2">
                              {anom.isLiveStream && !isItemResolved ? (
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                              ) : (
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                              )}
                              <span className="font-bold text-slate-900 dark:text-white">
                                {anom.liveTimeLabel}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${anom.isLiveStream && !isItemResolved
                                ? 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800 animate-pulse'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                                }`}>
                                {anom.relativeTime}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-medium pl-4 mt-0.5">
                              Historical audit ref: {anom.datasetDate || anom.date}
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-bold text-slate-900 dark:text-white">{anom.datasetDate || anom.date}</span>
                            <span className="text-[10px] text-slate-400 font-medium">({anom.relativeTime})</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        {anom.resource}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-black text-xs border ${isItemResolved
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                          : 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
                          }`}>
                          <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                          {anom.costChange}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge type={anom.severity} variant="priority" />
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 max-w-xs md:max-w-md">
                        <p className="line-clamp-1 font-sans font-medium">{anom.reason}</p>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end space-x-2">
                          {isItemResolved ? (
                            <>
                              <span className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-xl">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Resolved</span>
                              </span>
                              <button
                                onClick={() => handleReopen(anom.id)}
                                className="px-2 py-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors flex items-center space-x-1"
                                title="Reopen anomaly"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>Reopen</span>
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleResolve(anom.id)}
                                className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 text-xs font-bold transition-all flex items-center space-x-1 shadow-sm"
                                title="Acknowledge and mark resolved"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Resolve</span>
                              </button>
                              <button
                                onClick={() => handleRowClick(anom)}
                                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-700 text-xs font-semibold transition-all"
                              >
                                <span>Analyze</span>
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Dedicated Anomaly Detail Modal */}
      {selectedAnomaly && (
        <AnomalyDetailModal
          anomaly={selectedAnomaly}
          isResolved={resolvedIds.includes(selectedAnomaly.id)}
          onResolve={handleResolve}
          onReopen={handleReopen}
          onClose={() => setSelectedAnomaly(null)}
          onOpenOpportunity={handleOpenLinkedOpportunity}
        />
      )}

      {/* Linked Opportunity Detail Modal */}
      {selectedOpportunity && (
        <OpportunityDetailModal
          opportunity={selectedOpportunity}
          onClose={() => setSelectedOpportunity(null)}
        />
      )}
    </div>
  );
};

export default AnomalyList;
