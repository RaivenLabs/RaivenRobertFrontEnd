import React from 'react';

// Mock data for providers
const mockProviders = [
  {
    id: "provider-1",
    name: "The Gunter Group LLC",
    msaReference: "K-0430224",
    agreementType: "MPSA",
    effectiveDate: "10/27/2014",
    termEndDate: "12/31/2026",
    status: "Active",
    isLive: true
  },
  {
    id: "provider-2",
    name: "Talos Security Systems",
    msaReference: "K-0587631",
    agreementType: "MSA",
    effectiveDate: "03/15/2023",
    termEndDate: "03/14/2025",
    status: "Active",
    isLive: true
  },
  {
    id: "provider-3",
    name: "Hawkeye, Inc.",
    msaReference: "K-0612987",
    agreementType: "CPSA",
    effectiveDate: "06/01/2024",
    termEndDate: "",
    status: "Pending",
    isLive: false
  },
  {
    id: "provider-4",
    name: "Stark Innovations",
    msaReference: "K-0489233",
    agreementType: "SOW",
    effectiveDate: "01/15/2024",
    termEndDate: "01/14/2026",
    status: "Active",
    isLive: false
  },
  {
    id: "provider-5",
    name: "Banner Consulting Group",
    msaReference: "K-0512478",
    agreementType: "MSA",
    effectiveDate: "08/22/2023",
    termEndDate: "08/21/2025",
    status: "Active",
    isLive: false
  },
  {
    id: "provider-6",
    name: "Rogers Professional Services",
    msaReference: "K-0576321",
    agreementType: "PSA",
    effectiveDate: "05/10/2024",
    termEndDate: "05/09/2026",
    status: "Active",
    isLive: false
  },
  {
    id: "provider-7",
    name: "Romanoff Solutions",
    msaReference: "K-0594822",
    agreementType: "MPSA",
    effectiveDate: "02/28/2024",
    termEndDate: "02/27/2027",
    status: "Active",
    isLive: false
  }
];

const ProviderSelectStep = ({ selectedProviderId, onProviderSelect }) => {
  // Use the mock data instead of expecting it as a prop
  const providers = mockProviders;
  
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
                  {provider.name} - {provider.msaReference} {provider.isLive ? "(LIVE)" : ""}
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
          
          {/* Display all provider cards for the demo */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">All Available Providers</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {providers.map(provider => (
                <ProviderCardCompact 
                  key={provider.id} 
                  provider={provider}
                  onSelect={() => onProviderSelect(provider.id)}
                  isSelected={selectedProviderId === provider.id}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component to display provider details
const ProviderCard = ({ provider }) => {
  if (!provider) return null;
  
  return (
    <div className={`p-4 rounded-lg border ${provider.isLive ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
      <div className="flex justify-between">
        <div>
          <div className="flex items-center">
            <h3 className="font-bold text-gray-800">{provider.name}</h3>
            {provider.isLive && (
              <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                LIVE
              </span>
            )}
          </div>
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
          <p className="text-sm text-gray-600">
            Status: <span className={provider.status === 'Active' ? 'text-green-600' : 'text-yellow-600'}>{provider.status}</span>
          </p>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex items-center">
          {provider.isLive ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-blue-800">
                This provider has a valid MSA and is ready for service orders
              </span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-yellow-700">
                Demo use only - this provider is not available in production
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Compact version of the provider card for the grid view
const ProviderCardCompact = ({ provider, onSelect, isSelected }) => {
  return (
    <div 
      className={`p-3 rounded-lg border cursor-pointer transition-all ${
        isSelected 
          ? 'border-blue-500 shadow-md bg-blue-50' 
          : provider.isLive 
            ? 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 bg-gray-50'
      }`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center">
            <h3 className="font-semibold text-gray-800 text-sm">{provider.name}</h3>
            {provider.isLive && (
              <span className="ml-2 px-1.5 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                LIVE
              </span>
            )}
          </div>
          <p className="text-xs text-gray-600 mt-1">
            {provider.msaReference} • {provider.agreementType}
          </p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${
          provider.status === 'Active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {provider.status}
        </span>
      </div>
      
      <div className="mt-2 text-xs text-gray-600 flex justify-between">
        <span>From: {provider.effectiveDate}</span>
        <span>To: {provider.termEndDate || 'Evergreen'}</span>
      </div>
    </div>
  );
};

export default ProviderSelectStep;
