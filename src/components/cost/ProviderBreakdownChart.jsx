import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { getCostByProvider } from '../../api/costs';
import LoadingSkeleton from '../common/LoadingSkeleton';
import { FileSpreadsheet } from 'lucide-react';

export const ProviderBreakdownChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getCostByProvider().then((res) => {
      if (isMounted) {
        setData(res);
        setLoading(false);
      }
    });
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return <LoadingSkeleton type="chart" />;
  }

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: '#ffffff',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      extraCssText: 'box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.08); border-radius: 8px; padding: 10px;',
      textStyle: { color: '#0f172a', fontSize: 12, fontFamily: 'Inter' },
      formatter: (params) => {
        return `<div class="font-sans">
          <div class="text-xs text-slate-500 font-semibold">${params.name}</div>
          <div class="text-sm font-bold text-slate-900 mt-0.5">₹${params.value.toLocaleString()} <span class="text-xs text-slate-500">(${params.percent}%)</span></div>
        </div>`;
      }
    },
    series: [
      {
        name: 'Cost by Provider',
        type: 'pie',
        radius: '68%',
        center: ['50%', '50%'],
        itemStyle: {
          borderColor: '#ffffff',
          borderWidth: 2
        },
        data: data.map((item) => ({
          value: item.cost,
          name: item.name,
          itemStyle: { color: item.color }
        })),
        label: {
          color: '#334155',
          fontSize: 11,
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          formatter: '{b}\n{d}%'
        },
        labelLine: {
          lineStyle: { color: '#cbd5e1' }
        }
      }
    ]
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-[#0B1320] border border-slate-200 dark:border-slate-800 p-5 lg:p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">Cost by Provider</h2>
          <div className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-[11px] font-bold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/60">
            <span>Verified Providers</span>
          </div>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Spending across cloud infrastructure and AI models</p>
      </div>

      <div className="w-full h-64 my-2">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      </div>

      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs flex items-center justify-between">
        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Coverage: Production & Analytics Workloads</span>
        <span className="font-bold text-blue-700 dark:text-blue-400 text-[11px]">AWS & AI Platform</span>
      </div>
    </div>
  );

};

export default ProviderBreakdownChart;
