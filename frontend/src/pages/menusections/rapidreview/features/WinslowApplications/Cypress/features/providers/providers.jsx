import React, { useState, useEffect } from 'react';
import ProviderGroupGovernance from './ProviderGroupGovernance';

// Sample provider data for development
const sampleProviders = [
  {
    id: 'PRV-001',
    name: 'Infosys Limited',
    msaReference: 'MSA-2023-INF-001',
    agreementType: 'Evergreen',
    effectiveDate: '2023-01-15',
    termEndDate: null,
    status: 'Active',
    category: 'IT Services',
    preferredStatus: true,
    website: 'https://www.infosys.com',
    autoRenewal: true,
    activeOrders: 12,
    spendYTD: 2750000,
    spendYTDDelta: 8.5,
    avgMonthlySpend: 229166,
    projectedAnnualSpend: 2750000,
    lastActivity: '2025-02-15',
    lastUpdated: '2025-02-20',
    msaDocument: {
      url: '#',
      uploadDate: '2023-01-10'
    },
    rateCardDocument: {
      url: '#',
      uploadDate: '2023-01-12'
    },
    orderTemplateDocument: {
      url: '#',
      uploadDate: '2023-01-14'
    },
    amendments: [
      { name: 'Amendment 1 - Rate Update', url: '#' },
      { name: 'Amendment 2 - Term Extension', url: '#' }
    ],
    contacts: [
      {
        name: 'Rajesh Kumar',
        role: 'Account Manager',
        email: 'rajesh.kumar@infosys.com',
        phone: '+1 (555) 123-4567'
      },
      {
        name: 'Priya Sharma',
        role: 'Contract Administrator',
        email: 'priya.sharma@infosys.com',
        phone: '+1 (555) 987-6543'
      }
    ],
    serviceOrders: [
      {
        id: 'SO-INF-001',
        name: 'Cloud Migration Project',
        status: 'Active',
        startDate: '2024-06-01',
        endDate: '2025-12-31',
        value: '$850,000'
      },
      {
        id: 'SO-INF-002',
        name: 'DevOps Support',
        status: 'Active',
        startDate: '2024-08-15',
        endDate: '2025-08-14',
        value: '$420,000'
      },
      {
        id: 'SO-INF-003',
        name: 'Data Analytics Initiative',
        status: 'On Hold',
        startDate: '2024-10-01',
        endDate: '2025-09-30',
        value: '$375,000'
      }
    ],
    spendByCategory: [
      { category: 'Software Engineers', amount: 1200000, percentage: 43.6 },
      { category: 'DevOps Engineers', amount: 650000, percentage: 23.6 },
      { category: 'Project Managers', amount: 480000, percentage: 17.5 },
      { category: 'QA Engineers', amount: 420000, percentage: 15.3 }
    ]
  },
  {
    id: 'PRV-002',
    name: 'Accenture',
    msaReference: 'MSA-2023-ACC-002',
    agreementType: 'Fixed Term',
    effectiveDate: '2023-03-10',
    termEndDate: '2026-03-09',
    status: 'Active',
    category: 'Consulting',
    preferredStatus: true,
    website: 'https://www.accenture.com',
    autoRenewal: false,
    activeOrders: 8,
    spendYTD: 1850000,
    spendYTDDelta: 5.2,
    avgMonthlySpend: 154166,
    projectedAnnualSpend: 1850000,
    lastActivity: '2025-02-10',
    lastUpdated: '2025-02-15',
    msaDocument: {
      url: '#',
      uploadDate: '2023-03-05'
    },
    rateCardDocument: {
      url: '#',
      uploadDate: '2023-03-07'
    },
    orderTemplateDocument: null,
    amendments: [],
    contacts: [
      {
        name: 'Michael Johnson',
        role: 'Engagement Manager',
        email: 'michael.johnson@accenture.com',
        phone: '+1 (555) 222-3333'
      }
    ],
    serviceOrders: [
      {
        id: 'SO-ACC-001',
        name: 'Digital Transformation Strategy',
        status: 'Active',
        startDate: '2024-07-01',
        endDate: '2025-06-30',
        value: '$750,000'
      },
      {
        id: 'SO-ACC-002',
        name: 'IT Process Optimization',
        status: 'Completed',
        startDate: '2024-04-15',
        endDate: '2024-10-15',
        value: '$325,000'
      }
    ],
    spendByCategory: [
      { category: 'Management Consultants', amount: 920000, percentage: 49.7 },
      { category: 'Technical Architects', amount: 480000, percentage: 25.9 },
      { category: 'Business Analysts', amount: 450000, percentage: 24.4 }
    ]
  },
  {
    id: 'PRV-003',
    name: 'Technica Solutions',
    msaReference: 'MSA-2024-TEC-001',
    agreementType: 'Time & Materials',
    effectiveDate: '2024-02-01',
    termEndDate: '2026-01-31',
    status: 'Pending',
    category: 'Software Development',
    preferredStatus: false,
    website: 'https://www.technicasolutions.com',
    autoRenewal: true,
    activeOrders: 0,
    spendYTD: 0,
    spendYTDDelta: null,
    avgMonthlySpend: 0,
    projectedAnnualSpend: 350000,
    lastActivity: '2025-02-01',
    lastUpdated: '2025-02-01',
    msaDocument: {
      url: '#',
      uploadDate: '2025-01-28'
    },
    rateCardDocument: null,
    orderTemplateDocument: null,
    amendments: [],
    contacts: [
      {
        name: 'Sarah Williams',
        role: 'Sales Director',
        email: 'sarah.williams@technicasolutions.com',
        phone: '+1 (555) 444-5555'
      }
    ],
    serviceOrders: [],
    spendByCategory: []
  }
];

const CypressProviders = () => {
  // State management
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  
  // Initial data fetch function - in a real app, this would call your API
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be a fetch call to your API endpoint
      // const response = await fetch('/api/providers');
      // const result = await response.json();
      
      // For now, use the sample data
      setData({ providers: sampleProviders });
      setError(null);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching provider data:', error);
      setError('Failed to load provider data: ' + error.message);
      setLoading(false);
    }
  };
  
  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);
  
  // Handler for updating providers
  const handleUpdateProvider = async (providerId, updatedData) => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, this would be a PUT request to your API
      // const response = await fetch(`/api/providers/${providerId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updatedData),
      // });
      
      // For development, update our local sample data
      const updatedProviders = data.providers.map(provider => 
        provider.id === providerId ? { ...provider, ...updatedData } : provider
      );
      
      setData({ ...data, providers: updatedProviders });
      setLoading(false);
      
      return { success: true };
    } catch (error) {
      console.error('Error updating provider:', error);
      setError('Failed to update provider: ' + error.message);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };
  
  // Handler for deleting providers
  const handleDeleteProvider = async (providerId) => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, this would be a DELETE request to your API
      // const response = await fetch(`/api/providers/${providerId}`, {
      //   method: 'DELETE'
      // });
      
      // For development, update our local sample data
      const updatedProviders = data.providers.filter(provider => provider.id !== providerId);
      
      setData({ ...data, providers: updatedProviders });
      setLoading(false);
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting provider:', error);
      setError('Failed to delete provider: ' + error.message);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };
  
  // Handler for creating new providers
  const handleCreateProvider = async (providerData) => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, this would be a POST request to your API
      // const response = await fetch('/api/providers', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(providerData),
      // });
      
      // For development, create a new provider with a unique ID
      const newProvider = {
        ...providerData,
        id: `PRV-00${data.providers.length + 1}`,
        lastUpdated: new Date().toISOString().split('T')[0],
        serviceOrders: [],
        spendByCategory: [],
        spendYTD: 0,
        avgMonthlySpend: 0,
        projectedAnnualSpend: 0,
        activeOrders: 0
      };
      
      setData({ 
        ...data, 
        providers: [...data.providers, newProvider] 
      });
      setLoading(false);
      
      return { success: true, data: newProvider };
    } catch (error) {
      console.error('Error creating provider:', error);
      setError('Failed to create provider: ' + error.message);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };
  
  // Handler for uploading artifacts
  const handleUploadArtifact = async (providerId, artifactType, file) => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // In a real app, you would upload the file to your server or storage service
      // const formData = new FormData();
      // formData.append('file', file);
      // formData.append('artifactType', artifactType);
      // const response = await fetch(`/api/providers/${providerId}/artifacts`, {
      //   method: 'POST',
      //   body: formData
      // });
      
      // For development, update our local sample data
      const updatedProviders = data.providers.map(provider => {
        if (provider.id === providerId) {
          const updatedProvider = { ...provider };
          const today = new Date().toISOString().split('T')[0];
          
          if (artifactType === 'MSA') {
            updatedProvider.msaDocument = {
              url: '#',
              uploadDate: today
            };
          } else if (artifactType === 'RateCard') {
            updatedProvider.rateCardDocument = {
              url: '#',
              uploadDate: today
            };
          } else if (artifactType === 'OrderTemplate') {
            updatedProvider.orderTemplateDocument = {
              url: '#',
              uploadDate: today
            };
          } else if (artifactType === 'Amendment') {
            if (!updatedProvider.amendments) {
              updatedProvider.amendments = [];
            }
            updatedProvider.amendments.push({
              name: `Amendment ${updatedProvider.amendments.length + 1} - ${file.name}`,
              url: '#'
            });
          }
          
          return updatedProvider;
        }
        return provider;
      });
      
      setData({ ...data, providers: updatedProviders });
      setLoading(false);
      
      return { success: true };
    } catch (error) {
      console.error('Error uploading artifact:', error);
      setError('Failed to upload artifact: ' + error.message);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };
  
  return (
    <div className="p-6" style={{ maxWidth: '1780px', margin: '0 auto' }}>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-royalBlue text-white p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold">Provider Group Governance</h1>
          <p className="text-sm text-blue-100 mt-1">
            Master Service Agreements and Supplier Relationship Management
          </p>
        </div>
        
        <div className="p-4">
          <ProviderGroupGovernance
            title="Provider Management"
            data={data}
            loading={loading}
            error={error}
            onUpdateProvider={handleUpdateProvider}
            onDeleteProvider={handleDeleteProvider}
            onCreateProvider={handleCreateProvider}
            onRefreshData={fetchData}
            onUploadArtifact={handleUploadArtifact}
          />
        </div>
      </div>
      
      <div className="mt-6 text-sm text-gray-500 text-center">
        <p>Data last updated: {data ? new Date(data.lastUpdated || Date.now()).toLocaleString() : 'Unknown'}</p>
      </div>
    </div>
  );
};

export default CypressProviders;
