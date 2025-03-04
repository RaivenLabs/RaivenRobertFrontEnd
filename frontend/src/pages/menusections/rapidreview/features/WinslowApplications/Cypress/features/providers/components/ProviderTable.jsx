import React, { useState } from 'react';
import ProviderDetails from './ProviderDetails';
import ProviderFilterPanel from './ProviderFilterPanel';

const ProviderTable = ({
  providers,
  loading,
  error,
  filterValues,
  handleFilterChange,
  applyFilters,
  resetFilters,
  onUpdateProvider,
  onDeleteProvider,
  onUploadArtifact,
  onRefreshData
}) => {
  const [activeProvider, setActiveProvider] = useState(null);

  // Toggle provider expansion
  const toggleProvider = (id) => {
    if (activeProvider === id) {
      setActiveProvider(null);
    } else {
      setActiveProvider(id);
    }
  };

  // Status badge color function
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-600';
      case 'Pending':
        return 'bg-yellow-500';
      case 'Inactive':
        return 'bg-gray-500';
      case 'Terminated':
        return 'bg-red-600';
      default:
        return 'bg-gray-500';
    }
  };

  // Agreement type badge color
  const getAgreementTypeBadgeColor = (type) => {
    switch (type) {
      case 'Evergreen':
        return 'bg-teal-600';
      case 'Fixed Term':
        return 'bg-blue-600';
      case 'Time & Materials':
        return 'bg-purple-600';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div>
      {/* Filter Panel */}
      <ProviderFilterPanel
        filterValues={filterValues}
        handleFilterChange={handleFilterChange}
        applyFilters={applyFilters}
        resetFilters={resetFilters}
      />

      {/* Table Header */}
      <div className="bg-gray-50 p-4 mt-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-royalBlue">
            Provider Count: {providers.length}
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={onRefreshData}
              className="border border-royalBlue text-royalBlue px-4 py-2 rounded hover:bg-blue-50"
            >
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Show loading indicator if refreshing with existing data */}
      {loading && providers.length > 0 && (
        <div className="bg-blue-50 p-2 text-center text-royalBlue">
          <span className="inline-block animate-pulse mr-2">⟳</span> Refreshing data...
        </div>
      )}

      {/* Provider Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-royalBlue text-white">
              <th className="py-3 px-4 text-left">Provider ID</th>
              <th className="py-3 px-4 text-left">Provider Name</th>
              <th className="py-3 px-4 text-left">MSA Reference</th>
              <th className="py-3 px-4 text-left">Agreement Type</th>
              <th className="py-3 px-4 text-left">Effective Date</th>
              <th className="py-3 px-4 text-left">Term End Date</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {providers.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-6 text-center text-gray-500">
                  {error ? (
                    <div>
                      <p>Error loading providers: {error}</p>
                      <button 
                        onClick={onRefreshData}
                        className="mt-2 text-blue-600 underline"
                      >
                        Try again
                      </button>
                    </div>
                  ) : (
                    filterValues.search || filterValues.status || filterValues.category || 
                    filterValues.agreementType ? 
                      "No providers match your filter criteria." : 
                      "No providers found."
                  )}
                </td>
              </tr>
            ) : (
              providers.map((provider, index) => (
                <React.Fragment key={provider.id}>
                  <tr 
                    className={`border-b ${activeProvider === provider.id ? 'bg-blue-50' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} cursor-pointer hover:bg-blue-50`}
                    onClick={() => toggleProvider(provider.id)}
                  >
                    <td className="py-3 px-4">{provider.id}</td>
                    <td className="py-3 px-4 font-medium">{provider.name}</td>
                    <td className="py-3 px-4">{provider.msaReference}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-white text-xs ${getAgreementTypeBadgeColor(provider.agreementType)}`}>
                        {provider.agreementType}
                      </span>
                    </td>
                    <td className="py-3 px-4">{provider.effectiveDate}</td>
                    <td className="py-3 px-4">{provider.termEndDate || 'Evergreen'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-white text-xs ${getStatusBadgeColor(provider.status)}`}>
                        {provider.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Open edit modal or navigate to edit page
                          alert(`Edit provider: ${provider.id}`);
                        }}
                        className="text-blue-600 hover:text-blue-800 mr-2"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                  
                  {/* Expanded row with provider details */}
                  {activeProvider === provider.id && (
                    <tr>
                      <td colSpan="8" className="py-6 px-6 bg-blue-50 border-b">
                        <ProviderDetails 
                          provider={provider}
                          onUpdateProvider={onUpdateProvider}
                          onDeleteProvider={onDeleteProvider}
                          onUploadArtifact={onUploadArtifact}
                        />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination - Only show if we have data */}
      {providers.length > 0 && (
        <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-between items-center rounded-b-lg">
          <div>Showing 1-{providers.length} of {providers.length} providers</div>
          <div className="flex">
            <button className="bg-gray-100 border border-gray-300 px-3 py-1 rounded-md mr-2 hover:bg-gray-200">1</button>
            <button className="bg-white border border-gray-300 px-3 py-1 rounded-md mr-2 hover:bg-gray-200">2</button>
            <button className="bg-white border border-gray-300 px-3 py-1 rounded-md mr-2 hover:bg-gray-200">3</button>
            <button className="bg-white border border-gray-300 px-3 py-1 rounded-md mr-2 hover:bg-gray-200">...</button>
            <button className="bg-white border border-gray-300 px-4 py-1 rounded-md hover:bg-gray-200">Next →</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderTable;
