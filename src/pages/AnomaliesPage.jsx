import React from 'react';
import AnomalyList from '../components/anomalies/AnomalyList';

export const AnomaliesPage = () => {
  return (
    <div className="space-y-6">
      <AnomalyList showFilters={true} />
    </div>
  );
};

export default AnomaliesPage;
