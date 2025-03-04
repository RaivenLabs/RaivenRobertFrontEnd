import React from 'react';

const ScopeDefinitionStep = ({ scopeOfServices, onScopeChange }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Define Scope of Services</h2>
        <p className="text-gray-600">
          Clearly describe the scope of services to be provided under this order. This will be included in the final service order document.
        </p>
      </div>
      
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="mb-4">
          <label htmlFor="scope-of-services" className="block text-sm font-medium text-gray-700 mb-1">
            Scope of Services <span className="text-red-500">*</span>
          </label>
          <textarea
            id="scope-of-services"
            rows={12}
            value={scopeOfServices}
            onChange={(e) => onScopeChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-royalBlue focus:border-transparent"
            placeholder="Describe the services to be provided, including objectives, responsibilities, and any specific requirements..."
          ></textarea>
        </div>
        
        <div className="text-right text-sm text-gray-500">
          {scopeOfServices.length} characters
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="font-medium text-gray-700 mb-2">Tips for Writing an Effective Scope of Services:</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
          <li>Be specific about the work to be performed</li>
          <li>Define clear deliverables and outcomes</li>
          <li>Specify any methodologies or approaches to be used</li>
          <li>Include any relevant standards or requirements</li>
          <li>Clarify roles and responsibilities</li>
          <li>Define any exclusions (what is not included in the scope)</li>
        </ul>
      </div>
      
      {scopeOfServices.length < 50 && scopeOfServices.length > 0 && (
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-yellow-700 text-sm">
            <strong>Note:</strong> Your scope description seems quite short. A more detailed description will help ensure clear expectations for all parties.
          </p>
        </div>
      )}
    </div>
  );
};

export default ScopeDefinitionStep;
