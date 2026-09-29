import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { getCostTrends } from '../../api/costs';
import { demoCostTrends } from '../../data/demoData';
import LoadingSkeleton from '../common/LoadingSkeleton';
import { BarChart3, LineChart as LineIcon } from 'lucide-react';

export const CostTrendChart = ({ onPeriodChange }) => {
  const [period, setPeriod] = useState('30D');
  const [chartType, setChartType] = useState('bar'); // 'bar' or 'line'
  const [trendData, setTrendData] = useState(demoCostTrends['30D'] || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getCostTrends(period).then((data) => {
      if (isMounted && data && data.length > 0) {
        setTrendData(data);
      }
    });
    return () => { isMounted = false; };
  }, [period]);

  const handleTabChange = (p) => {
    setPeriod(p);
    if (onPeriodChange) onPeriodChange(p);
  };

  const dates = trendData.map((d) => d.date);
  const values = trendData.map((d) => d.cost);

  // Bar coloring: normal days are clean blue gradient, anomaly days are marked red
  const barData = trendData.map((d) => {
    if (d.isAnomaly) {
      return {
        value: d.cost,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#f87171' }, // Red-400
              { offset: 1, color: '#dc2626' }  // Red-600
            ]
          },
          borderRadius: [6, 6, 0, 0]
        }
      };
    }
    return {
      value: d.cost,
      itemStyle: {
        color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#3b82f6' }, // Blue-500
              { offset: 1, color: '#1d4ed8' }  // Blue-700
            ]
        },
        borderRadius: [6, 6, 0, 0]
      }
    };
  });

  const markPoints = trendData
    .filter((d) => d.isAnomaly)
    .map((d) => ({
      name: 'Unusual Surge',
      coord: [d.date, d.cost],
      value: `Surge: ₹${d.cost.toLocaleString()}`,
      itemStyle: { color: '#dc2626' }
    }));

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#ffffff',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      extraCssText: 'box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.1); border-radius: 12px; padding: 12px;',
      textStyle: { color: '#0f172a', fontSize: 12, fontFamily: 'Inter, sans-serif' },
      formatter: (params) => {
        const item = params[0];
        const dataObj = trendData[item.dataIndex];
        const val = typeof item.value === 'object' ? item.value.value : item.value;
        let html = `<div>
          <div class="text-xs text-slate-500 font-semibold mb-1">${item.name}</div>
          <div class="text-sm font-black text-slate-900">Daily Expense: <span class="text-blue-600">₹${val.toLocaleString()}</span></div>`;
        if (dataObj && dataObj.isAnomaly) {
          html += `<div class="mt-2 text-xs p-2 rounded-lg bg-red-50 border border-red-200 text-red-700 font-semibold">
            ⚠️ Spending Surge: ${dataObj.note || "Cost was higher than usual"}
          </div>`;
        }
        html += `</div>`;
        return html;
      }
    },
    grid: {
      left: '2%',
      right: '2%',
      bottom: '3%',
      top: '12%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLine: { lineStyle: { color: '#cbd5e1' } },
      axisLabel: { 
        color: '#64748b', 
        fontSize: 11, 
        fontFamily: 'Inter, sans-serif',
        interval: period === '7D' ? 0 : 'auto',
        rotate: period === '30D' ? 30 : 0
      },
      splitLine: { show: false }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisLabel: {
        color: '#64748b',
        fontSize: 11,
        fontFamily: 'Inter, sans-serif',
        formatter: (val) => `₹${val.toLocaleString()}`
      },
      splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } }
    },
    series: [
      chartType === 'bar' ? {
        name: 'Daily Expense',
        type: 'bar',
        barMaxWidth: 26,
        data: barData,
        markPoint: {
          data: markPoints,
          label: {
            color: '#ffffff',
            fontSize: 10,
            fontFamily: 'Inter, sans-serif',
            fontWeight: 'bold'
          }
        }
      } : {
        name: 'Daily Expense',
        type: 'line',
        smooth: 0.35,
        symbol: 'circle',
        symbolSize: 6,
        showSymbol: true,
        itemStyle: {
          color: '#2563eb',
          borderColor: '#1d4ed8',
          borderWidth: 2
        },
        lineStyle: {
          width: 3,
          color: '#2563eb'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(37, 99, 235, 0.20)' },
              { offset: 1, color: 'rgba(37, 99, 235, 0.00)' }
            ]
          }
        },
        data: values,
        markPoint: {
          data: markPoints,
          label: {
            color: '#ffffff',
            fontSize: 10,
            fontFamily: 'Inter, sans-serif',
            fontWeight: 'bold'
          }
        }
      }
    ]
  };

  if (loading) {
    return <LoadingSkeleton type="chart" />;
  }

  return (
    <div className="rounded-3xl bg-white dark:bg-[#0B1320] border border-slate-200 dark:border-slate-800 p-5 lg:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
            Daily Cost Trend
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
            Daily spending over time with unusual surges highlighted in red
          </p>
        </div>

        {/* Controls: Chart Type Toggle & Time Filter */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Bar / Line Switcher */}
          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setChartType('bar')}
              className={`flex items-center space-x-1.5 px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                chartType === 'bar'
                  ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Bars</span>
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`flex items-center space-x-1.5 px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                chartType === 'line'
                  ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LineIcon className="w-3.5 h-3.5" />
              <span>Line</span>
            </button>
          </div>

          {/* Time Range Filter */}
          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
            {['7D', '30D', '90D'].map((t) => (
              <button
                key={t}
                onClick={() => handleTabChange(t)}
                className={`
                  px-3 py-1 text-xs font-bold rounded-lg transition-all
                  ${period === t 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }
                `}
              >
                {t === '7D' ? '7 Days' : t === '30D' ? '30 Days' : '60 Days'}
              </button>
            ))}
          </div>
        </div>
      </div>


      {/* Chart Canvas */}
      <div className="w-full h-72 lg:h-80">
        <ReactECharts 
          option={option} 
          notMerge={true}
          lazyUpdate={true}
          style={{ height: '100%', width: '100%' }} 
        />
      </div>
    </div>
  );
};

export default CostTrendChart;
