import React from 'react';
import AutomateDealConstants from './AutomateDealConstants';
import AutomateDefinedTerms from './AutomateDefinedTerms';

const AutomateConstants = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 pt-0 px-6 pb-6">
      <h3 className="text-lg font-medium mb-4 text-teal"></h3>
      <div className="grid grid-cols-2 gap-4">
        {/* Left Panel - Deal Constants */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-teal text-white px-4 py-2 text-sm font-medium">
            Automate Deal Constants
          </div>
          <div className="bg-gray-50 p-4">
            <AutomateDealConstants />
          </div>
        </div>
        
        {/* Right Panel - Defined Term Adjustments */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-teal text-white px-4 py-2 text-sm font-medium">
            Automate Defined Term Adjustments
          </div>
          <div className="bg-gray-50 p-4">
            <AutomateDefinedTerms />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomateConstants;
