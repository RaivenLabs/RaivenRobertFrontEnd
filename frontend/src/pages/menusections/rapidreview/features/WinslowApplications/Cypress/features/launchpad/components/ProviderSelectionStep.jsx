import React from 'react';

const ProviderSelectStep = ({ providers, selectedProviderId, onProviderSelect }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Select Provider</h2>
        <p className="text-gray-600">
          Choose a provider from the list below to create a new service order. Only providers with active Master Service Agreements are shown.
        </p>
      </div>
      
      {providers.length === 0 ? (
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-yellow-700">
            No active providers found. Please ensure there are providers with valid Master Service Agreements before creating an order.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <select
              value={selectedProviderId}
              onChange={(e) => onProviderSelect(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded appearance-none focus:outline-none focus:ring-2 focus:ring-royalBlue focus:border-transparent"
            >
              <option value="">-- Select a Provider --</option>
              {providers.map(provider => (
                <option key={provider.id} value={provider.id}>
                  {provider.name} - {provider.msaReference}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
          
          {selectedProviderId && (
            <ProviderCard 
              provider={providers.find(p => p.id === selectedProviderId)} 
            />
          )}
        </div>
      )}
    </div>
  );
};

// Helper component to display provider details
const ProviderCard = ({ provider }) => {
  if (!provider) return null;
  
  return (
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
      <div className="flex justify-between">
        <div>
          <h3 className="font-bold text-gray-800">{provider.name}</h3>
          <p className="text-sm text-gray-600 mt-1">
            MSA Reference: {provider.msaReference}
          </p>
          <p className="text-sm text-gray-600">
            Agreement Type: {provider.agreementType || 'Not specified'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">
            Effective Date: {provider.effectiveDate || 'Not specified'}
          </p>
          <p className="text-sm text-gray-600">
            End Date: {provider.termEndDate || 'Evergreen'}
          </p>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-blue-200">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-sm text-blue-800">
            This provider has a valid MSA and is ready for service orders
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProviderSelectStep;
