import React from 'react';
import OpportunityList from '../components/opportunities/OpportunityList';

export const OpportunitiesPage = () => {
  return (
    <div className="space-y-6">
      <OpportunityList
        title="All Optimization Opportunities"
        showFilters={true}
      />
    </div>
  );
};

export default OpportunitiesPage;
