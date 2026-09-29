import { demoAnomalies } from '../data/demoData';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function computeLiveTimes(idx) {
  const now = new Date();
  const offsets = [14, 38, 145, 370, 1420, 2880];
  const offsetMin = offsets[idx] || (idx * 45 + 15);
  const liveDate = new Date(now.getTime() - offsetMin * 60 * 1000);

  const hours = liveDate.getHours();
  const minutes = liveDate.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  const timeStr = `${displayHours}:${minutes} ${ampm}`;

  let relativeTime = `${offsetMin}m ago`;
  let liveTimeLabel = `Today, ${timeStr}`;
  if (offsetMin < 60) {
    relativeTime = `${offsetMin}m ago`;
    liveTimeLabel = `Today, ${timeStr}`;
  } else if (offsetMin < 1440) {
    relativeTime = `${Math.floor(offsetMin / 60)}h ago`;
    liveTimeLabel = `Today, ${timeStr}`;
  } else if (offsetMin < 2880) {
    relativeTime = `Yesterday`;
    liveTimeLabel = `Yesterday, ${timeStr}`;
  } else {
    relativeTime = `${Math.floor(offsetMin / 1440)}d ago`;
    liveTimeLabel = `${Math.floor(offsetMin / 1440)} days ago, ${timeStr}`;
  }

  return {
    relativeTime,
    liveTimeLabel,
    isRecent: offsetMin < 60
  };
}

export const getAnomalies = async (filters = {}) => {
  try {
    const res = await fetch(`${API_BASE}/anomalies`, { signal: AbortSignal.timeout(2500) });
    if (res.ok) {
      const data = await res.json();
      if (data && data.anomalies && data.anomalies.length > 0) {
        const mapped = data.anomalies.map((item, idx) => {
          const inrDiff = Math.round(Number(item.cost_diff || 10) * 83);
          const demoMatch = demoAnomalies.find(
            (d) => d.id === item.id || (d.resource === item.resource && d.date?.includes(item.date?.substring(5)))
          );

          const fallbackLive = computeLiveTimes(idx);

          return {
            id: item.id || `anom-live-${idx + 1}`,
            date: item.dataset_date || item.date || "2026-08-18",
            datasetDate: item.dataset_date || item.date || "2026-08-18",
            liveTimeLabel: item.live_time_label || fallbackLive.liveTimeLabel,
            relativeTime: item.relative_time || fallbackLive.relativeTime,
            isLiveStream: item.is_live_stream !== undefined ? item.is_live_stream : fallbackLive.isRecent,
            resource: item.resource,
            costChange: `+${Number(item.increase_percent || 50).toFixed(1)}%`,
            costChangeValue: inrDiff,
            severity: (item.severity || "MEDIUM").toUpperCase(),
            reason: demoMatch?.reason || item.message || `Cost surge of +${Number(item.increase_percent).toFixed(1)}% above baseline.`,
            details: demoMatch?.details || `Baseline cost was $${Number(item.baseline_cost).toFixed(2)}, observed spend spiked to $${Number(item.current_cost).toFixed(2)}.`,
            provider: item.provider || "AWS",
            service: item.service || "Compute",
            linkedOpportunityId: demoMatch?.linkedOpportunityId || null
          };
        });

        let result = mapped;
        if (filters.severity && filters.severity !== 'ALL') {
          result = result.filter(a => a.severity === filters.severity);
        }
        if (filters.search) {
          const q = filters.search.toLowerCase();
          result = result.filter(a => 
            a.resource.toLowerCase().includes(q) || 
            a.reason.toLowerCase().includes(q)
          );
        }
        return result;
      }
    }
  } catch (err) {
    // fallback
  }

  let result = demoAnomalies.map((item, idx) => {
    const live = computeLiveTimes(idx);
    return {
      ...item,
      datasetDate: item.date,
      liveTimeLabel: live.liveTimeLabel,
      relativeTime: live.relativeTime,
      isLiveStream: live.isRecent
    };
  });

  if (filters.severity && filters.severity !== 'ALL') {
    result = result.filter(a => a.severity === filters.severity);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(a => 
      a.resource.toLowerCase().includes(q) || 
      a.reason.toLowerCase().includes(q)
    );
  }

  return result;
};
