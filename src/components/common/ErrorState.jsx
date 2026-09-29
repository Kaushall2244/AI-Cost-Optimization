import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const ErrorState = ({ title = "Unable to load data", message = "Analysis is currently unavailable. Please check backend connection.", onRetry }) => {
  return (
    <div className="p-8 rounded-3xl bg-white border border-red-200 text-center shadow-sm">
      <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 text-red-600 mx-auto flex items-center justify-center mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-extrabold text-slate-900">{title}</h3>
      <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Connection</span>
        </button>
      )}
    </div>
  );
};

export default ErrorState;
