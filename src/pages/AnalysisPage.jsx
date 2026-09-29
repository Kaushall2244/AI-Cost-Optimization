import React from 'react';
import PipelineWorkflow from '../components/analysis/PipelineWorkflow';
import LiveTelemetryWidget from '../components/telemetry/LiveTelemetryWidget';

export const AnalysisPage = () => {
  return (
    <div className="space-y-6">
      <LiveTelemetryWidget />
      <PipelineWorkflow />
    </div>
  );
};

export default AnalysisPage;
