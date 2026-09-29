import { demoPipelineSteps } from '../data/demoData';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getPipelineWorkflow = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(demoPipelineSteps);
    }, 150);
  });
};

export const getAnalysisData = async () => {
  try {
    const res = await fetch(`${API_BASE}/analysis`, { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // fallback
  }
  return null;
};
