import React from 'react';

const RegionSelector = ({ activeRun }) => {
  console.log('🎯 RegionSelector rendered with run:', activeRun?.runId);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="text-xl font-semibold text-royalBlue mb-4">
        Hooray, we got to RegionSelector! 🎉
      </div>
      <div className="text-gray-600">
        Active Run ID: {activeRun?.runId || 'No run ID'}
      </div>
    </div>
  );
};

export default RegionSelector;
