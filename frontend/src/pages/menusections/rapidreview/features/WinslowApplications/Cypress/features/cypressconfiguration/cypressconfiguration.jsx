import React, { useState, useEffect } from 'react';
import AppConfiguration from './cypresscoreappconfiguration';

// Sample configuration data defined outside the component
const defaultConfig = {
  general: {
    companyName: 'ACME Corporation',
    logo: 'https://example.com/logo.png',
    theme: 'default',
    dateFormat: 'MM/DD/YYYY',
    currencyFormat: 'USD',
    timezone: 'America/New_York'
  },
  features: {
    orderDesk: true,
    orderBank: true,
    providerGovernance: true,
    reportingDashboard: true,
    automaticEmails: false,
    documentGeneration: true
  },
  orderDesk: {
    defaultSteps: ['provider', 'roles', 'scope', 'deliverables', 'review'],
    customSteps: [],
    showProgressTracker: true,
    requireApproval: true,
    maxRolesPerOrder: 10,
    allowCustomRates: true,
    allowRateVariance: true,
    maxRateVariance: 15
  },
  orderBank: {
    defaultSortField: 'createdDate',
    defaultSortOrder: 'desc',
    groupByProvider: true,
    autoArchiveAfterDays: 90,
    displayFields: [
      'orderNumber',
      'orderName',
      'providerName',
      'status',
      'createdDate',
      'totalAmount'
    ],
    filterOptions: [
      'status',
      'provider',
      'dateRange'
    ]
  },
  providerGovernance: {
    requiredDocuments: ['msa', 'rateCard'],
    optionalDocuments: ['orderTemplate', 'amendments'],
    allowProviderRating: true,
    enableProviderPortal: false,
    autoNotifyExpiringMSA: true,
    expiryNotificationDays: 30
  },
  workflow: {
    approvalRequired: true,
    approvalRoles: ['manager', 'finance'],
    notificationRecipients: ['admin@example.com', 'notifications@example.com'],
    escalationAfterHours: 48,
    escalationContact: 'escalations@example.com'
  },
  security: {
    sessionTimeout: 30,
    enforcePasswordComplexity: true,
    mfaEnabled: false,
    ipRestrictions: [],
    auditLogRetention: 90
  }
};

const CypressConfiguration = () => {
  // State management
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState(null);
  const [error, setError] = useState(null);
  
  // Fetch configuration on component mount
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, this would be a fetch call to your API endpoint
        // const response = await fetch('/api/configuration');
        // const result = await response.json();
        
        // For now, use the default configuration
        setConfig(defaultConfig);
        setError(null);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching configuration:', error);
        setError('Failed to load configuration: ' + error.message);
        setLoading(false);
      }
    };
    
    fetchConfig();
  }, []); // Empty dependency array is now fine since defaultConfig is outside
  
  // Handler for saving configuration
  const handleSaveConfig = async (configData) => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be a POST request to your API
      // const response = await fetch('/api/configuration', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(configData),
      // });
      // const result = await response.json();
      
      // For development, just update the local state
      setConfig(configData);
      setLoading(false);
      
      return { success: true };
    } catch (error) {
      console.error('Error saving configuration:', error);
      setError('Failed to save configuration: ' + error.message);
      setLoading(false);
      throw error;
    }
  };
  
  // Handler for resetting configuration
  const handleResetConfig = async () => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be a POST request to your API
      // const response = await fetch('/api/configuration/reset', {
      //   method: 'POST'
      // });
      // const result = await response.json();
      
      // For development, just reset to the default config
      setConfig(defaultConfig);
      setLoading(false);
      
      return defaultConfig;
    } catch (error) {
      console.error('Error resetting configuration:', error);
      setError('Failed to reset configuration: ' + error.message);
      setLoading(false);
      throw error;
    }
  };
  
  // Handler for refreshing configuration
  const handleRefreshConfig = async () => {
    try {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be a fetch call to your API endpoint
      // const response = await fetch('/api/configuration');
      // const result = await response.json();
      
      // For now, just reload the current configuration
      setConfig({ ...config });
      setError(null);
      setLoading(false);
    } catch (error) {
      console.error('Error refreshing configuration:', error);
      setError('Failed to refresh configuration: ' + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="p-6" style={{ maxWidth: '1780px', margin: '0 auto' }}>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-royalBlue text-white p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold">Application Configuration</h1>
          <p className="text-sm text-blue-100 mt-1">
            Configure application settings and features
          </p>
        </div>
        
        <div className="p-4">
          <AppConfiguration
            title="System Configuration"
            config={config}
            loading={loading}
            error={error}
            onSaveConfig={handleSaveConfig}
            onResetConfig={handleResetConfig}
            onRefreshConfig={handleRefreshConfig}
          />
        </div>
      </div>
      
      <div className="mt-6 text-sm text-gray-500 text-center">
        <p>Settings last updated: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};

export default CypressConfiguration;
