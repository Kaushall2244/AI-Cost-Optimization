import React, { useState, useEffect } from 'react';
import { getExpensiveResources } from '../../api/costs';
import LoadingSkeleton from '../common/LoadingSkeleton';
import { Server } from 'lucide-react';

export const TopExpensiveResourcesTable = ({ onSelectResource }) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getExpensiveResources().then((res) => {
      if (isMounted) {
        setResources(res);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return <LoadingSkeleton type="card" count={3} />;
  }

  const getEfficiencyBadge = (eff) => {
    switch (eff) {
      case 'Critical':
      case 'Poor':
        return 'bg-red-50 text-red-700 border-red-200 font-bold';
      case 'Moderate':
        return 'bg-amber-50 text-amber-700 border-amber-200 font-semibold';
      case 'Good':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 font-medium';
    }
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-[#0B1320] border border-slate-200 dark:border-slate-800 p-5 lg:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">Top Expensive Resources</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Highest cost infrastructure assets evaluated by analytics engine</p>
        </div>
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
          {resources.length} Tracked Resources
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-3 px-4 rounded-l-lg">Resource Name</th>
              <th className="py-3 px-4">Provider</th>
              <th className="py-3 px-4">Service</th>
              <th className="py-3 px-4">Observed Telemetry</th>
              <th className="py-3 px-4">Monthly Cost</th>
              <th className="py-3 px-4 text-right rounded-r-lg">Efficiency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {resources.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-850/50 transition-colors">
                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Server className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span className="truncate max-w-xs">{item.name}</span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                    {item.provider}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">{item.service}</td>
                <td className="py-3.5 px-4 font-medium text-slate-500 dark:text-slate-400 text-[11px]">{item.usage}</td>
                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{item.cost}</td>
                <td className="py-3.5 px-4 text-right">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wider border ${getEfficiencyBadge(item.efficiency)}`}>
                    {item.efficiency}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopExpensiveResourcesTable;
