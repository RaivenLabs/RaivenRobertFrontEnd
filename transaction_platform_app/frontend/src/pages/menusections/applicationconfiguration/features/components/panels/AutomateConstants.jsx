import React from 'react';
import AutomateDealConstants from './AutomateDealConstants';
import AutomateDefinedTerms from './AutomateDefinedTerms';

const AutomateConstants = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <h3 className="text-lg font-medium mb-4 text-teal">Automate Constants</h3>
      <div className="grid grid-cols-2 gap-4">
        {/* Left Panel - Deal Constants */}
        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-4">Automate Deal Constants</h4>
          <AutomateDealConstants />
        </div>
        
        {/* Right Panel - Defined Term Adjustments */}
        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-4">Automate Defined Term Adjustments</h4>
          <AutomateDefinedTerms />
        </div>
      </div>
    </div>
  );
};

export default AutomateConstants;
