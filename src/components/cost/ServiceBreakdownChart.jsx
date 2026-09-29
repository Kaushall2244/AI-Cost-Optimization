import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { getCostByService } from '../../api/costs';
import { demoCostByService } from '../../data/demoData';
import LoadingSkeleton from '../common/LoadingSkeleton';

export const ServiceBreakdownChart = () => {
  const [data, setData] = useState(demoCostByService || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getCostByService().then((res) => {
      if (isMounted && res && res.length > 0) {
        setData(res);
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
    legend: {
      orient: 'horizontal',
      bottom: '0',
      textStyle: { color: '#475569', fontSize: 11, fontFamily: 'Inter' },
      icon: 'circle'
    },
    series: [
      {
        name: 'Cost by Service',
        type: 'pie',
        radius: ['45%', '72%'],
        center: ['50%', '42%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 6,
          borderColor: '#ffffff',
          borderWidth: 3
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 13,
            fontWeight: 'bold',
            color: '#0f172a',
            formatter: '{b}\n₹{c}'
          }
        },
        labelLine: {
          show: false
        },
        data: data.map((item) => ({
          value: item.cost,
          name: item.name,
          itemStyle: { color: item.color }
        }))
      }
    ]
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-[#0B1320] border border-slate-200 dark:border-slate-800 p-5 lg:p-6 shadow-sm flex flex-col justify-between">
      <div>
        <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">Cost by Service</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Expenditure distribution across core services</p>
      </div>

      <div className="w-full h-64 my-2">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      </div>

      {/* Summary grid */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
        {data.map((service) => (
          <div key={service.name} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: service.color }}></span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{service.name}</span>
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white">{service.formatted}</span>
          </div>
        ))}
      </div>
    </div>
  );

};

export default ServiceBreakdownChart;
