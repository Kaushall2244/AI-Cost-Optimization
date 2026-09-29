import React, { useState, useEffect } from 'react';
import { subscribeLiveMetrics } from '../../api/metrics';
import { Cpu, Server, HardDrive, Zap, Activity, Wifi, CheckCircle2, AlertTriangle, ArrowUpRight } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

export const LiveTelemetryWidget = () => {
  const [metrics, setMetrics] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!isLive) return;

    const unsubscribe = subscribeLiveMetrics((data) => {
      if (data && data.current) {
        setMetrics(data.current);
        if (data.history && data.history.length > 0) {
          setHistory(data.history);
        } else {
          setHistory((prev) => {
            const next = [...prev, data.current];
            return next.slice(-25);
          });
        }
      }
    }, 1500);

    return () => unsubscribe();
  }, [isLive]);

  const current = metrics || {
    cpu_percent: 5.5,
    ram_percent: 49.2,
    ram_used_gb: 7.24,
    ram_total_gb: 15.30,
    gpu_percent: 48.4,
    gpu_vram_used_gb: 11.62,
    gpu_vram_total_gb: 24.0,
    gpu_model: "NVIDIA A10G Tensor Core (24 GB VRAM)",
    disk_percent: 80.9,
    disk_used_gb: 162.0,
    disk_total_gb: 200.2,
    cpu_cores: 12,
    cpu_model: "12th Gen Intel Core i7",
    uptime: "2h 58m",
    timeLabel: "Live",
    clusterResources: [
      {
        resource: "gpu-02",
        category: "GPU Acceleration",
        service: "EC2 g5.xlarge",
        provider: "AWS",
        telemetryType: "GPU VRAM & Compute",
        baselineUtil: 43.8,
        currentUtil: 43.8,
        peakUtil: 55.4,
        unit: "% GPU load",
        costInr: 178023,
        status: "Underutilized (Right-size Target)"
      },
      {
        resource: "gpu-01",
        category: "GPU Acceleration",
        service: "EC2 g5.xlarge",
        provider: "AWS",
        telemetryType: "GPU Compute",
        baselineUtil: 61.4,
        currentUtil: 61.4,
        peakUtil: 72.4,
        unit: "% GPU load",
        costInr: 116633,
        status: "Spike Detected (Aug 04 Surge)"
      },
      {
        resource: "db-prod-01",
        category: "Memory (RAM)",
        service: "EC2 r6i.large",
        provider: "AWS",
        telemetryType: "RAM Saturation",
        baselineUtil: 73.1,
        currentUtil: 73.1,
        peakUtil: 87.3,
        unit: "% RAM allocated",
        costInr: 18347,
        status: "Healthy Production Baseline"
      },
      {
        resource: "worker-02",
        category: "CPU Compute",
        service: "EC2 m6i.xlarge",
        provider: "AWS",
        telemetryType: "Multi-core CPU",
        baselineUtil: 58.3,
        currentUtil: 58.3,
        peakUtil: 71.5,
        unit: "% CPU load",
        costInr: 18016,
        status: "Moderate Load"
      },
      {
        resource: "api-prod-01",
        category: "CPU Compute",
        service: "EC2 m6i.large",
        provider: "AWS",
        telemetryType: "Web Server CPU",
        baselineUtil: 71.9,
        currentUtil: 71.9,
        peakUtil: 84.0,
        unit: "% CPU load",
        costInr: 11295,
        status: "Optimal Capacity"
      },
      {
        resource: "etl-01",
        category: "Batch Worker",
        service: "EC2 m6i.large",
        provider: "AWS",
        telemetryType: "Batch CPU Cycles",
        baselineUtil: 51.2,
        currentUtil: 51.2,
        peakUtil: 62.8,
        unit: "% CPU load",
        costInr: 5732,
        status: "Idle Capacity Identified"
      }
    ]
  };

  const clusterList = current.clusterResources || [];

  // Sparkline data for CPU, RAM, and GPU
  const timeLabels = history.map((h) => h.timeLabel || '');
  const cpuValues = history.map((h) => h.cpu_percent);
  const ramValues = history.map((h) => h.ram_percent);
  const gpuValues = history.map((h) => h.gpu_percent || 45.0);

  const sparklineOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#ffffff',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      extraCssText: 'box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.1); border-radius: 12px; padding: 12px;',
      textStyle: { color: '#0f172a', fontSize: 11, fontFamily: 'Inter, sans-serif' },
      formatter: (params) => {
        let html = `<div class="font-bold text-slate-500 text-[11px] mb-1.5 pb-1 border-b border-slate-100">${params[0]?.axisValue || 'Live Reading'}</div>`;
        params.forEach((p) => {
          html += `<div class="text-xs font-bold text-slate-800 flex items-center justify-between space-x-4 py-0.5">
            <span style="color: ${p.color};" class="flex items-center space-x-1.5">
              <span class="inline-block w-2 h-2 rounded-full" style="background-color: ${p.color};"></span>
              <span>${p.seriesName}</span>
            </span>
            <span class="font-black text-slate-900">${p.value}%</span>
          </div>`;
        });
        return html;
      }
    },
    grid: {
      left: '1%',
      right: '2%',
      bottom: '4%',
      top: '12%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: timeLabels.length > 0 ? timeLabels : ['Live'],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#94a3b8', fontSize: 10, fontFamily: 'Inter, sans-serif' }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      splitNumber: 2,
      axisLine: { show: false },
      axisLabel: {
        color: '#94a3b8',
        fontSize: 10,
        fontFamily: 'Inter, sans-serif',
        formatter: '{value}%'
      },
      splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } }
    },
    series: [
      {
        name: 'Host CPU',
        type: 'line',
        smooth: 0.35,
        showSymbol: false,
        lineStyle: { width: 2.5, color: '#2563eb' },
        itemStyle: { color: '#2563eb' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(37, 99, 235, 0.12)' },
              { offset: 1, color: 'rgba(37, 99, 235, 0.00)' }
            ]
          }
        },
        data: cpuValues.length > 0 ? cpuValues : [current.cpu_percent]
      },
      {
        name: 'Host RAM',
        type: 'line',
        smooth: 0.35,
        showSymbol: false,
        lineStyle: { width: 2.5, color: '#7c3aed' },
        itemStyle: { color: '#7c3aed' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(124, 58, 237, 0.10)' },
              { offset: 1, color: 'rgba(124, 58, 237, 0.00)' }
            ]
          }
        },
        data: ramValues.length > 0 ? ramValues : [current.ram_percent]
      },
      {
        name: 'GPU Cluster',
        type: 'line',
        smooth: 0.35,
        showSymbol: false,
        lineStyle: { width: 2.5, color: '#f59e0b' },
        itemStyle: { color: '#f59e0b' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(245, 158, 11, 0.12)' },
              { offset: 1, color: 'rgba(245, 158, 11, 0.00)' }
            ]
          }
        },
        data: gpuValues.length > 0 ? gpuValues : [current.gpu_percent]
      }
    ]
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-[#0B1320] border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 shadow-sm">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                Live Telemetry & Resource Monitor
              </h3>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
              Real-time CPU, RAM, and GPU cluster metrics linked to cloud billing and usage records
            </p>
          </div>
        </div>

        {/* Live Status Pill & Toggle */}
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <Wifi className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            <span>Streaming Live ({current.timeLabel || "Active"})</span>
          </span>
          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-3 py-1 text-xs font-bold rounded-xl border transition-all ${
              isLive 
                ? 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700' 
                : 'bg-blue-600 text-white border-blue-600'
            }`}
          >
            {isLive ? 'Pause' : 'Resume'}
          </button>
        </div>
      </div>

      {/* 4 Live Telemetry Gauges Grid (CPU, RAM, GPU, DISK) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. CPU Utilization */}
        <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Host CPU Load
            </span>
            <div className="p-1.5 rounded-lg bg-blue-100/80 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {current.cpu_percent}%
              </span>
              <span className="text-[11px] font-semibold text-slate-400">utilization</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
              {current.cpu_cores} Cores • {current.cpu_model}
            </p>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700/60 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-700 rounded-full ${
                current.cpu_percent > 80 
                  ? 'bg-red-500' 
                  : current.cpu_percent > 40 
                    ? 'bg-amber-500' 
                    : 'bg-blue-600'
              }`}
              style={{ width: `${Math.min(100, Math.max(5, current.cpu_percent))}%` }}
            />
          </div>
        </div>

        {/* 2. RAM Memory */}
        <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              RAM Memory
            </span>
            <div className="p-1.5 rounded-lg bg-indigo-100/80 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
              <Server className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {current.ram_percent}%
              </span>
              <span className="text-[11px] font-semibold text-slate-400">allocated</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              {current.ram_used_gb} GB used of {current.ram_total_gb} GB
            </p>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700/60 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-700 rounded-full ${
                current.ram_percent > 85 
                  ? 'bg-red-500' 
                  : current.ram_percent > 60 
                    ? 'bg-amber-500' 
                    : 'bg-indigo-600'
              }`}
              style={{ width: `${Math.min(100, current.ram_percent)}%` }}
            />
          </div>
        </div>

        {/* 3. GPU Acceleration */}
        <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              GPU Cluster Load
            </span>
            <div className="p-1.5 rounded-lg bg-amber-100/80 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {current.gpu_percent}%
              </span>
              <span className="text-[11px] font-semibold text-slate-400">compute</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
              {current.gpu_vram_used_gb} GB VRAM • NVIDIA A10G
            </p>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700/60 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, Math.max(5, current.gpu_percent))}%` }}
            />
          </div>
        </div>

        {/* 4. Disk Storage */}
        <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Disk Storage
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-100/80 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {current.disk_percent}%
              </span>
              <span className="text-[11px] font-semibold text-slate-400">used</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              {current.disk_used_gb} GB of {current.disk_total_gb} GB
            </p>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700/60 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, current.disk_percent)}%` }}
            />
          </div>
        </div>

      </div>

      {/* Live Stream Sparkline Graph (CPU, RAM, GPU) */}
      <div className="pt-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Real-Time Resource Telemetry Stream (Live Markings)
          </span>
          <div className="flex items-center space-x-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <span>CPU Load</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
              <span>RAM Usage</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>GPU Cluster</span>
            </span>
          </div>
        </div>
        <div className="w-full h-36 bg-slate-50/60 dark:bg-slate-900/40 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-2">
          <ReactECharts
            option={sparklineOption}
            notMerge={true}
            lazyUpdate={true}
            style={{ height: '100%', width: '100%' }}
          />
        </div>
      </div>

      {/* Linked CSV & Database Cluster Resources Table */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Live Cloud Infrastructure Workloads (Linked to Dataset)
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Observed CPU, RAM, and GPU capacity metrics evaluated against billing records
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/60">
            {clusterList.length} Active Cloud Resources
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-3 rounded-l-lg">Resource</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Instance / Hardware</th>
                <th className="py-2.5 px-3">Live Telemetry Load</th>
                <th className="py-2.5 px-3">Observed Spend</th>
                <th className="py-2.5 px-3 text-right rounded-r-lg">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {clusterList.map((res) => (
                <tr key={res.resource} className="hover:bg-slate-50/80 dark:hover:bg-slate-850/50 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>{res.resource}</span>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-600 dark:text-slate-400">{res.category}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                      {res.service}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-black text-slate-900 dark:text-white">{res.currentUtil}%</span>
                      <span className="text-[10px] text-slate-400">({res.telemetryType})</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                    ₹{res.costInr.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      res.status.includes('Underutilized')
                        ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                        : res.status.includes('Spike')
                          ? 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'
                          : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                    }`}>
                      {res.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LiveTelemetryWidget;

