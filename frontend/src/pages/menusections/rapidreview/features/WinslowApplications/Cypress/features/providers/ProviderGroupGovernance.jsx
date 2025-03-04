import React, { useState } from 'react';
import ProviderTable from './components/ProviderTable';
import NewProviderForm from './components/NewProviderForm';
import TabNavigation from './components/TabNavigation';

const ProviderGroupGovernance = ({
  title,
  data,
  loading,
  error,
  onUpdateProvider,
  onDeleteProvider,
  onCreateProvider,
  onRefreshData,
  onUploadArtifact
}) => {
  const [activeTab, setActiveTab] = useState('providers');
  const [filterValues, setFilterValues] = useState({
    search: '',
    status: '',
    category: '',
    agreementType: ''
  });
// Inside ProviderGroupGovernance.jsx, add this near the top
const defaultProviders = [
    {
      id: 'PRV-001',
      name: 'Infosys Limited',
      msaReference: 'MSA-2023-INF-001',
      agreementType: 'Evergreen',
      effectiveDate: '2023-01-15',
      termEndDate: null,
      status: 'Active',
      category: 'IT Services',
      // ...other properties
    },
    // Add a couple more sample providers
  ];



  // If data is not yet loaded or malformed, use empty arrays
  const providers = data?.providers || defaultProviders;

  
  // Helper function to apply filters to providers
  const getFilteredProviders = () => {
    return providers.filter(provider => {
      // Search text filter
      if (filterValues.search && 
          !provider.name.toLowerCase().includes(filterValues.search.toLowerCase()) &&
          !provider.id.toLowerCase().includes(filterValues.search.toLowerCase())) {
        return false;
      }
      
      // Status filter
      if (filterValues.status && provider.status !== filterValues.status) {
        return false;
      }
      
      // Category filter
      if (filterValues.category && provider.category !== filterValues.category) {
        return false;
      }
      
      // Agreement Type filter
      if (filterValues.agreementType && provider.agreementType !== filterValues.agreementType) {
        return false;
      }
      
      return true;
    });
  };

  const filteredProviders = getFilteredProviders();

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Apply filters button
  const applyFilters = () => {
    // The filtering happens automatically in getFilteredProviders()
  };

  // Reset filters
  const resetFilters = () => {
    setFilterValues({
      search: '',
      status: '',
      category: '',
      agreementType: ''
    });
  };

  // Handle provider update
  const handleProviderUpdate = async (providerId, updatedFields) => {
    const providerToUpdate = providers.find(provider => provider.id === providerId);
    if (!providerToUpdate) return;
    
    const updatedProvider = { ...providerToUpdate, ...updatedFields };
    const result = await onUpdateProvider(providerId, updatedProvider);
    
    if (result.success) {
      // Success handling could show a toast message or other UI feedback
      return result;
    } else {
      // Error handling could show an error message
      alert(`Failed to update provider: ${result.error}`);
      return result;
    }
  };

  // Handle provider deletion
  const handleProviderDeletion = async (providerId) => {
    if (window.confirm('Are you sure you want to delete this provider? This action cannot be undone.')) {
      const result = await onDeleteProvider(providerId);
      
      if (result.success) {
        // Success handling
        return result;
      } else {
        // Error handling
        alert(`Failed to delete provider: ${result.error}`);
        return result;
      }
    }
  };

  // Handle creating a new provider
  const handleNewProvider = async (providerData) => {
    const result = await onCreateProvider(providerData);
    
    if (result.success) {
      // Success handling, maybe switch to the providers tab
      setActiveTab('providers');
      return result;
    } else {
      // Error handling
      alert(`Failed to create provider: ${result.error}`);
      return result;
    }
  };

  // Handle artifact upload
  const handleArtifactUpload = async (providerId, artifactType, file) => {
    const result = await onUploadArtifact(providerId, artifactType, file);
    
    if (result.success) {
      // Success handling
      return result;
    } else {
      // Error handling
      alert(`Failed to upload ${artifactType}: ${result.error}`);
      return result;
    }
  };

  // Define tabs for the TabNavigation component
  const tabs = [
    { id: 'providers', label: 'Provider Management' },
    { id: 'new-provider', label: 'Add New Provider' }
  ];

  // Component loading state
  if (loading && providers.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-royalBlue"></div>
      </div>
    );
  }

  // Component error state
  if (error && providers.length === 0) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <h3 className="text-red-800 font-medium">Error loading data</h3>
        <p className="text-red-600">{error}</p>
        <div className="mt-4">
          <button 
            onClick={onRefreshData} 
            className="bg-royalBlue text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 rounded-lg shadow-md">
      {/* Component Header */}
      <div className="bg-gray-200 text-gray-800 p-4 rounded-t-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">{title || "Provider Governance"}</h1>
          <span className="text-lg">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Tabs */}
      <TabNavigation 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={tabs}
      />

      {/* Content based on active tab */}
      <div className="p-4">
        {activeTab === 'providers' && (
          <ProviderTable 
            providers={filteredProviders}
            loading={loading}
            error={error}
            filterValues={filterValues}
            handleFilterChange={handleFilterChange}
            applyFilters={applyFilters}
            resetFilters={resetFilters}
            onUpdateProvider={handleProviderUpdate}
            onDeleteProvider={handleProviderDeletion}
            onUploadArtifact={handleArtifactUpload}
            onRefreshData={onRefreshData}
          />
        )}

        {activeTab === 'new-provider' && (
          <NewProviderForm
            onCreateProvider={handleNewProvider}
            onUploadArtifact={handleArtifactUpload}
          />
        )}
      </div>
    </div>
  );
};

export default ProviderGroupGovernance;
