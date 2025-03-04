





import React, { useState } from 'react';
import TabNavigation from './TabNavigation';

const AppConfiguration = ({
  title,
  config,
  loading,
  error,
  onSaveConfig,
  onResetConfig,
  onRefreshConfig
}) => {
  const [activeTab, setActiveTab] = useState('general');
  const [configValues, setConfigValues] = useState(config || {
    general: {
      companyName: '',
      logo: '',
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
      automaticEmails: true,
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
      maxRateVariance: 15 // percentage
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
    notificationRecipients: [],
    escalationAfterHours: 48,
    escalationContact: ''
  },
  security: {
    sessionTimeout: 30, // minutes
    enforcePasswordComplexity: true,
    mfaEnabled: false,
    ipRestrictions: [],
    auditLogRetention: 90 // days
  }
});
const [changed, setChanged] = useState(false);

// Define tabs for the tab navigation
const tabs = [
  { id: 'general', label: 'General Settings' },
  { id: 'features', label: 'Feature Management' },
  { id: 'orderDesk', label: 'Order Desk' },
  { id: 'orderBank', label: 'Order Bank' },
  { id: 'providerGovernance', label: 'Provider Governance' },
  { id: 'workflow', label: 'Workflow & Approvals' },
  { id: 'security', label: 'Security & Access' }
];













// Handle input changes
const handleInputChange = (section, field, value) => {
    setConfigValues(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setChanged(true);
  };
  
  // Handle save button click
  const handleSave = async () => {
    try {
      await onSaveConfig(configValues);
      setChanged(false);
      alert('Configuration saved successfully!');
    } catch (error) {
      alert(`Failed to save configuration: ${error.message}`);
    }
  };
  
  // Handle reset button click
  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset all configuration settings to default values? This cannot be undone.')) {
      try {
        const defaultConfig = await onResetConfig();
        setConfigValues(defaultConfig);
        setChanged(false);
        alert('Configuration has been reset to default values.');
      } catch (error) {
        alert(`Failed to reset configuration: ${error.message}`);
      }
    }
  };

  // Component loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-royalBlue"></div>
      </div>
    );
  }

  // Component error state
  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <h3 className="text-red-800 font-medium">Error loading configuration</h3>
        <p className="text-red-600">{error}</p>
        <div className="mt-4">
          <button 
            onClick={onRefreshConfig} 
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
          <h1 className="text-xl font-bold">{title || "Application Configuration"}</h1>
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
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">General Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={configValues.general.companyName}
                    onChange={(e) => handleInputChange('general', 'companyName', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logo URL
                  </label>
                  <input
                    type="text"
                    value={configValues.general.logo}
                    onChange={(e) => handleInputChange('general', 'logo', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Theme
                  </label>
                  <select
                    value={configValues.general.theme}
                    onChange={(e) => handleInputChange('general', 'theme', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="default">Default</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="brand">Brand Colors</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Format
                  </label>
                  <select
                    value={configValues.general.dateFormat}
                    onChange={(e) => handleInputChange('general', 'dateFormat', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    <option value="MMM D, YYYY">MMM D, YYYY</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency Format
                  </label>
                  <select
                    value={configValues.general.currencyFormat}
                    onChange={(e) => handleInputChange('general', 'currencyFormat', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD ($)</option>
                    <option value="AUD">AUD ($)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Timezone
                  </label>
                  <select
                    value={configValues.general.timezone}
                    onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="Europe/London">London (GMT)</option>
                  </select>
                </div>
              </div>
            </div>
          )}











{/* Feature Management */}
{activeTab === 'features' && (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Feature Management</h2>
      <p className="text-gray-600 mb-4">
        Enable or disable application features to customize the user experience.
      </p>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
          <div>
            <h3 className="font-medium text-gray-800">Order Desk</h3>
            <p className="text-sm text-gray-600">Create and submit service orders</p>
          </div>
          <div className="flex items-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={configValues.features.orderDesk}
                onChange={(e) => handleInputChange('features', 'orderDesk', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-royalBlue"></div>
            </label>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
          <div>
            <h3 className="font-medium text-gray-800">Order Bank</h3>
            <p className="text-sm text-gray-600">View and manage existing service orders</p>
          </div>
          <div className="flex items-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={configValues.features.orderBank}
                onChange={(e) => handleInputChange('features', 'orderBank', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-royalBlue"></div>
            </label>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
          <div>
            <h3 className="font-medium text-gray-800">Provider Governance</h3>
            <p className="text-sm text-gray-600">Manage provider relationships and agreements</p>
          </div>
          <div className="flex items-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={configValues.features.providerGovernance}
                onChange={(e) => handleInputChange('features', 'providerGovernance', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-royalBlue"></div>
            </label>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
          <div>
            <h3 className="font-medium text-gray-800">Reporting Dashboard</h3>
            <p className="text-sm text-gray-600">View analytics and reports on order activity</p>
          </div>
          <div className="flex items-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={configValues.features.reportingDashboard}
                onChange={(e) => handleInputChange('features', 'reportingDashboard', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-royalBlue"></div>
            </label>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
          <div>
            <h3 className="font-medium text-gray-800">Automatic Emails</h3>
            <p className="text-sm text-gray-600">Send automated email notifications</p>
          </div>
          <div className="flex items-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={configValues.features.automaticEmails}
                onChange={(e) => handleInputChange('features', 'automaticEmails', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-royalBlue"></div>
            </label>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
          <div>
            <h3 className="font-medium text-gray-800">Document Generation</h3>
            <p className="text-sm text-gray-600">Generate and export order documents</p>
          </div>
          <div className="flex items-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={configValues.features.documentGeneration}
                onChange={(e) => handleInputChange('features', 'documentGeneration', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-royalBlue"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  )}














{/* Order Desk Settings */}
{activeTab === 'orderDesk' && (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Order Desk Configuration</h2>
      <p className="text-gray-600 mb-4">
        Configure the Order Desk functionality for creating service orders.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Show Progress Tracker
          </label>
          <div className="flex items-center">
            <label className="relative inline-flex items-center cursor-pointer mr-2">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={configValues.orderDesk.showProgressTracker}
                onChange={(e) => handleInputChange('orderDesk', 'showProgressTracker', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-royalBlue"></div>
            </label>
            <span className="text-sm text-gray-600">Display step progress indicator during order creation</span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Require Approval Before Sending
          </label>
          <div className="flex items-center">
            <label className="relative inline-flex items-center cursor-pointer mr-2">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={configValues.orderDesk.requireApproval}
                onChange={(e) => handleInputChange('orderDesk', 'requireApproval', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-royalBlue"></div>
            </label>
            <span className="text-sm text-gray-600">User must check approval box before order can be sent</span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Maximum Roles Per Order
          </label>
          <input
            type="number"
            min="1"
            max="50"
            value={configValues.orderDesk.maxRolesPerOrder}
            onChange={(e) => handleInputChange('orderDesk', 'maxRolesPerOrder', parseInt(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <p className="text-xs text-gray-500 mt-1">Maximum number of roles that can be added to a single order</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Allow Custom Rates
          </label>
          <div className="flex items-center">
            <label className="relative inline-flex items-center cursor-pointer mr-2">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={configValues.orderDesk.allowCustomRates}
                onChange={(e) => handleInputChange('orderDesk', 'allowCustomRates', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-royalBlue"></div>
            </label>
            <span className="text-sm text-gray-600">Allow users to set custom rates instead of using rate card</span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Allow Rate Variance
          </label>
          <div className="flex items-center">
            <label className="relative inline-flex items-center cursor-pointer mr-2">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={configValues.orderDesk.allowRateVariance}
                onChange={(e) => handleInputChange('orderDesk', 'allowRateVariance', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-royalBlue"></div>
            </label>
            <span className="text-sm text-gray-600">Allow rates to differ from the standard rate card</span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Maximum Rate Variance (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={configValues.orderDesk.maxRateVariance}
            onChange={(e) => handleInputChange('orderDesk', 'maxRateVariance', parseInt(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded"
            disabled={!configValues.orderDesk.allowRateVariance}
          />
          <p className="text-xs text-gray-500 mt-1">Maximum percentage a rate can differ from the standard rate</p>
        </div>
      </div>
      
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Order Creation Steps
        </label>
        <p className="text-sm text-gray-600 mb-3">
          Configure which steps are shown during order creation and their order
        </p>
        
        <div className="p-4 bg-gray-50 rounded border border-gray-200">
          <div className="space-y-2">
            {configValues.orderDesk.defaultSteps.map((step, index) => (
              <div key={index} className="flex items-center justify-between bg-white p-3 rounded border border-gray-200">
                <div className="flex items-center">
                  <span className="w-6 h-6 flex items-center justify-center bg-royalBlue text-white rounded-full text-sm mr-2">
                    {index + 1}
                  </span>
                  <span className="capitalize">{step}</span>
                </div>
                <div className="flex space-x-2">
                  {index > 0 && (
                    <button 
                      onClick={() => {
                        const newSteps = [...configValues.orderDesk.defaultSteps];
                        [newSteps[index], newSteps[index - 1]] = [newSteps[index - 1], newSteps[index]];
                        handleInputChange('orderDesk', 'defaultSteps', newSteps);
                      }}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      ↑
                    </button>
                  )}
                  {index < configValues.orderDesk.defaultSteps.length - 1 && (
                    <button 
                      onClick={() => {
                        const newSteps = [...configValues.orderDesk.defaultSteps];
                        [newSteps[index], newSteps[index + 1]] = [newSteps[index + 1], newSteps[index]];
                        handleInputChange('orderDesk', 'defaultSteps', newSteps);
                      }}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      ↓
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )}
  
  {/* Order Bank Settings */}
  {activeTab === 'orderBank' && (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Order Bank Configuration</h2>
      <p className="text-gray-600 mb-4">
        Configure how orders are displayed and managed in the Order Bank.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Default Sort Field
          </label>
          <select
            value={configValues.orderBank.defaultSortField}
            onChange={(e) => handleInputChange('orderBank', 'defaultSortField', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="createdDate">Created Date</option>
            <option value="orderNumber">Order Number</option>
            <option value="orderName">Order Name</option>
            <option value="providerName">Provider Name</option>
            <option value="status">Status</option>
            <option value="totalAmount">Total Amount</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Default Sort Order
          </label>
          <select
            value={configValues.orderBank.defaultSortOrder}
            onChange={(e) => handleInputChange('orderBank', 'defaultSortOrder', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="asc">Ascending (A-Z, Oldest First)</option>
            <option value="desc">Descending (Z-A, Newest First)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Group Orders by Provider
          </label>
          <div className="flex items-center">
            <label className="relative inline-flex items-center cursor-pointer mr-2">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={configValues.orderBank.groupByProvider}
                onChange={(e) => handleInputChange('orderBank', 'groupByProvider', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-royalBlue"></div>
            </label>
            <span className="text-sm text-gray-600">Group orders by provider in the Order Bank</span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Auto-Archive After (days)
          </label>
          <input
            type="number"
            min="0"
            value={configValues.orderBank.autoArchiveAfterDays}
            onChange={(e) => handleInputChange('orderBank', 'autoArchiveAfterDays', parseInt(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <p className="text-xs text-gray-500 mt-1">Number of days after completion before orders are archived (0 = never)</p>
        </div>
      </div>






<div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Displayed Fields
                </label>
                <p className="text-sm text-gray-600 mb-3">
                  Select which fields are displayed in the Order Bank table
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="field-orderNumber"
                      checked={configValues.orderBank.displayFields.includes('orderNumber')}
                      onChange={(e) => {
                        const newFields = e.target.checked 
                          ? [...configValues.orderBank.displayFields, 'orderNumber']
                          : configValues.orderBank.displayFields.filter(f => f !== 'orderNumber');
                        handleInputChange('orderBank', 'displayFields', newFields);
                      }}
                      className="h-4 w-4 text-royalBlue border-gray-300 rounded focus:ring-royalBlue"
                    />
                    <label htmlFor="field-orderNumber" className="ml-2 block text-sm text-gray-700">
                      Order Number
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="field-orderName"
                      checked={configValues.orderBank.displayFields.includes('orderName')}
                      onChange={(e) => {
                        const newFields = e.target.checked 
                          ? [...configValues.orderBank.displayFields, 'orderName']
                          : configValues.orderBank.displayFields.filter(f => f !== 'orderName');
                        handleInputChange('orderBank', 'displayFields', newFields);
                      }}
                      className="h-4 w-4 text-royalBlue border-gray-300 rounded focus:ring-royalBlue"
                    />
                    <label htmlFor="field-orderName" className="ml-2 block text-sm text-gray-700">
                      Order Name
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="field-providerName"
                      checked={configValues.orderBank.displayFields.includes('providerName')}
                      onChange={(e) => {
                        const newFields = e.target.checked 
                          ? [...configValues.orderBank.displayFields, 'providerName']
                          : configValues.orderBank.displayFields.filter(f => f !== 'providerName');
                        handleInputChange('orderBank', 'displayFields', newFields);
                      }}
                      className="h-4 w-4 text-royalBlue border-gray-300 rounded focus:ring-royalBlue"
                    />
                    <label htmlFor="field-providerName" className="ml-2 block text-sm text-gray-700">
                      Provider Name
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="field-status"
                      checked={configValues.orderBank.displayFields.includes('status')}
                      onChange={(e) => {
                        const newFields = e.target.checked 
                          ? [...configValues.orderBank.displayFields, 'status']
                          : configValues.orderBank.displayFields.filter(f => f !== 'status');
                        handleInputChange('orderBank', 'displayFields', newFields);
                      }}
                      className="h-4 w-4 text-royalBlue border-gray-300 rounded focus:ring-royalBlue"
                    />
                    <label htmlFor="field-status" className="ml-2 block text-sm text-gray-700">
                      Status
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="field-createdDate"
                      checked={configValues.orderBank.displayFields.includes('createdDate')}
                      onChange={(e) => {
                        const newFields = e.target.checked 
                          ? [...configValues.orderBank.displayFields, 'createdDate']
                          : configValues.orderBank.displayFields.filter(f => f !== 'createdDate');
                        handleInputChange('orderBank', 'displayFields', newFields);
                      }}
                      className="h-4 w-4 text-royalBlue border-gray-300 rounded focus:ring-royalBlue"
                    />
                    <label htmlFor="field-createdDate" className="ml-2 block text-sm text-gray-700">
                      Created Date
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="field-totalAmount"
                      checked={configValues.orderBank.displayFields.includes('totalAmount')}
                      onChange={(e) => {
                        const newFields = e.target.checked 
                          ? [...configValues.orderBank.displayFields, 'totalAmount']
                          : configValues.orderBank.displayFields.filter(f => f !== 'totalAmount');
                        handleInputChange('orderBank', 'displayFields', newFields);
                      }}
                      className="h-4 w-4 text-royalBlue border-gray-300 rounded focus:ring-royalBlue"
                    />
                    <label htmlFor="field-totalAmount" className="ml-2 block text-sm text-gray-700">
                      Total Amount
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="field-effectiveDate"
                      checked={configValues.orderBank.displayFields.includes('effectiveDate')}
                      onChange={(e) => {
                        const newFields = e.target.checked 
                          ? [...configValues.orderBank.displayFields, 'effectiveDate']
                          : configValues.orderBank.displayFields.filter(f => f !== 'effectiveDate');
                        handleInputChange('orderBank', 'displayFields', newFields);
                      }}
                      className="h-4 w-4 text-royalBlue border-gray-300 rounded focus:ring-royalBlue"
                    />
                    <label htmlFor="field-effectiveDate" className="ml-2 block text-sm text-gray-700">
                      Effective Date
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="field-endDate"
                      checked={configValues.orderBank.displayFields.includes('endDate')}
                      onChange={(e) => {
                        const newFields = e.target.checked 
                          ? [...configValues.orderBank.displayFields, 'endDate']
                          : configValues.orderBank.displayFields.filter(f => f !== 'endDate');
                        handleInputChange('orderBank', 'displayFields', newFields);
                      }}
                      className="h-4 w-4 text-royalBlue border-gray-300 rounded focus:ring-royalBlue"
                    />
                    <label htmlFor="field-endDate" className="ml-2 block text-sm text-gray-700">
                      End Date
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter Options
                </label>
                <p className="text-sm text-gray-600 mb-3">
                  Select which filters are available in the Order Bank
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="filter-status"
                      checked={configValues.orderBank.filterOptions.includes('status')}
                      onChange={(e) => {
                        const newFilters = e.target.checked 
                          ? [...configValues.orderBank.filterOptions, 'status']
                          : configValues.orderBank.filterOptions.filter(f => f !== 'status');
                        handleInputChange('orderBank', 'filterOptions', newFilters);
                      }}
                      className="h-4 w-4 text-royalBlue border-gray-300 rounded focus:ring-royalBlue"
                    />
                    <label htmlFor="filter-status" className="ml-2 block text-sm text-gray-700">
                      Status
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="filter-provider"
                      checked={configValues.orderBank.filterOptions.includes('provider')}
                      onChange={(e) => {
                        const newFilters = e.target.checked 
                          ? [...configValues.orderBank.filterOptions, 'provider']
                          : configValues.orderBank.filterOptions.filter(f => f !== 'provider');
                        handleInputChange('orderBank', 'filterOptions', newFilters);
                      }}
                      className="h-4 w-4 text-royalBlue border-gray-300 rounded focus:ring-royalBlue"
                    />
                    <label htmlFor="filter-provider" className="ml-2 block text-sm text-gray-700">
                      Provider
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="filter-dateRange"
                      checked={configValues.orderBank.filterOptions.includes('dateRange')}
                      onChange={(e) => {
                        const newFilters = e.target.checked 
                          ? [...configValues.orderBank.filterOptions, 'dateRange']
                          : configValues.orderBank.filterOptions.filter(f => f !== 'dateRange');
                        handleInputChange('orderBank', 'filterOptions', newFilters);
                      }}
                      className="h-4 w-4 text-royalBlue border-gray-300 rounded focus:ring-royalBlue"
                    />
                    <label htmlFor="filter-dateRange" className="ml-2 block text-sm text-gray-700">
                      Date Range
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="filter-amount"
                      checked={configValues.orderBank.filterOptions.includes('amount')}
                      onChange={(e) => {
                        const newFilters = e.target.checked 
                          ? [...configValues.orderBank.filterOptions, 'amount']
                          : configValues.orderBank.filterOptions.filter(f => f !== 'amount');
                        handleInputChange('orderBank', 'filterOptions', newFilters);
                      }}
                      className="h-4 w-4 text-royalBlue border-gray-300 rounded focus:ring-royalBlue"
                    />
                    <label htmlFor="filter-amount" className="ml-2 block text-sm text-gray-700">
                      Amount Range
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Provider Governance Settings */}
          {activeTab === 'providerGovernance' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Provider Governance Configuration</h2>
              <p className="text-gray-600 mb-4">
                Configure how provider relationships and documents are managed.
              </p>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Documents
                </label>
                <p className="text-sm text-gray-600 mb-3">
                  Select which documents are required for a provider to be considered ready
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="doc-msa"
                      checked={configValues.providerGovernance.requiredDocuments.includes('msa')}
                      onChange={(e) => {
                        const newDocs = e.target.checked 
                          ? [...configValues.providerGovernance.requiredDocuments, 'msa']
                          : configValues.providerGovernance.requiredDocuments.filter(d => d !== 'msa');
                        handleInputChange('providerGovernance', 'requiredDocuments', newDocs);
                      }}
                      className="h-4 w-4 text-royalBlue border-gray-300 rounded focus:ring-royalBlue"
                    />
                    <label htmlFor="doc-msa" className="ml-2 block text-sm text-gray-700">
                      Master Service Agreement (MSA)
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="doc-rateCard"
                      checked={configValues.providerGovernance.requiredDocuments.includes('rateCard')}
                      onChange={(e) => {
                        const newDocs = e.target.checked 
                          ? [...configValues.providerGovernance.requiredDocuments, 'rateCard']
                          : configValues.providerGovernance.requiredDocuments.filter(d => d !== 'rateCard');
                        handleInputChange('providerGovernance', 'requiredDocuments', newDocs);
                      }}
                      className="h-4 w-4 text-royalBlue border-gray-300 rounded focus:ring-royalBlue"
                    />
                    <label htmlFor="doc-rateCard" className="ml-2 block text-sm text-gray-700">
                      Rate Card
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="doc-orderTemplate"
                      checked={configValues.providerGovernance.requiredDocuments.includes('orderTemplate')}
                      onChange={(e) => {
                        const newDocs = e.target.checked 
                          ? [...configValues.providerGovernance.requiredDocuments, 'orderTemplate']
                          : configValues.providerGovernance.requiredDocuments.filter(d => d !== 'orderTemplate');
                        handleInputChange('providerGovernance', 'requiredDocuments', newDocs);
                      }}
                      className="h-4 w-4 text-royalBlue border-gray-300 rounded focus:ring-royalBlue"
                    />
                    <label htmlFor="doc-orderTemplate" className="ml-2 block text-sm text-gray-700">
                      Order Template
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="doc-amendments"
                      checked={configValues.providerGovernance.requiredDocuments.includes('amendments')}
                      onChange={(e) => {
                        const newDocs = e.target.checked 
                          ? [...configValues.providerGovernance.requiredDocuments, 'amendments']
                          : configValues.providerGovernance.requiredDocuments.filter(d => d !== 'amendments');
                        handleInputChange('providerGovernance', 'requiredDocuments', newDocs);
                      }}
                      className="h-4 w-4 text-royalBlue border-gray-300 rounded focus:ring-royalBlue"
                    />
                    <label htmlFor="doc-amendments" className="ml-2 block text-sm text-gray-700">
                      Amendments
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
               


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Provider Rating
                  </label>
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer mr-2">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={configValues.providerGovernance.allowProviderRating}
                        onChange={(e) => handleInputChange('providerGovernance', 'allowProviderRating', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-royalBlue"></div>
                    </label>
                    <span className="text-sm text-gray-600">Enable provider rating and feedback</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Provider Portal
                  </label>
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer mr-2">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={configValues.providerGovernance.enableProviderPortal}
                        onChange={(e) => handleInputChange('providerGovernance', 'enableProviderPortal', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-royalBlue"></div>
                    </label>
                    <span className="text-sm text-gray-600">Enable provider portal for document sharing</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    MSA Expiry Notifications
                  </label>
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer mr-2">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={configValues.providerGovernance.autoNotifyExpiringMSA}
                        onChange={(e) => handleInputChange('providerGovernance', 'autoNotifyExpiringMSA', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-royalBlue"></div>
                    </label>
                    <span className="text-sm text-gray-600">Send notifications when MSAs are about to expire</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Days Before Expiry to Notify
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={configValues.providerGovernance.expiryNotificationDays}
                    onChange={(e) => handleInputChange('providerGovernance', 'expiryNotificationDays', parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded"
                    disabled={!configValues.providerGovernance.autoNotifyExpiringMSA}
                  />
                  <p className="text-xs text-gray-500 mt-1">Number of days before MSA expiry to send notifications</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Workflow & Approvals Settings */}
          {activeTab === 'workflow' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Workflow & Approval Configuration</h2>
              <p className="text-gray-600 mb-4">
                Configure approval workflows and notification settings.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order Approval Required
                  </label>
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer mr-2">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={configValues.workflow.approvalRequired}
                        onChange={(e) => handleInputChange('workflow', 'approvalRequired', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-royalBlue"></div>
                    </label>
                    <span className="text-sm text-gray-600">Require approval before orders can be sent</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Escalation After (hours)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={configValues.workflow.escalationAfterHours}
                    onChange={(e) => handleInputChange('workflow', 'escalationAfterHours', parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  <p className="text-xs text-gray-500 mt-1">Hours before escalating pending approvals (0 = never)</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Escalation Contact
                  </label>
                  <input
                    type="email"
                    value={configValues.workflow.escalationContact}
                    onChange={(e) => handleInputChange('workflow', 'escalationContact', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="escalation@example.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email to receive escalation notifications</p>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Approval Roles
                </label>
                <p className="text-sm text-gray-600 mb-3">
                  Select which roles can approve orders
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="role-manager"
                      checked={configValues.workflow.approvalRoles.includes('manager')}
                      onChange={(e) => {
                        const newRoles = e.target.checked 
                          ? [...configValues.workflow.approvalRoles, 'manager']
                          : configValues.workflow.approvalRoles.filter(r => r !== 'manager');
                        handleInputChange('workflow', 'approvalRoles', newRoles);
                      }}
                      className="h-4 w-4 text-royalBlue border-gray-300 rounded focus:ring-royalBlue"
                    />
                    <label htmlFor="role-manager" className="ml-2 block text-sm text-gray-700">
                      Manager
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="role-finance"
                      checked={configValues.workflow.approvalRoles.includes('finance')}
                      onChange={(e) => {
                        const newRoles = e.target.checked 
                          ? [...configValues.workflow.approvalRoles, 'finance']
                          : configValues.workflow.approvalRoles.filter(r => r !== 'finance');
                        handleInputChange('workflow', 'approvalRoles', newRoles);
                      }}
                      className="h-4 w-4 text-royalBlue border-gray-300 rounded focus:ring-royalBlue"
                    />
                    <label htmlFor="role-finance" className="ml-2 block text-sm text-gray-700">
                      Finance
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="role-procurement"
                      checked={configValues.workflow.approvalRoles.includes('procurement')}
                      onChange={(e) => {
                        const newRoles = e.target.checked 
                          ? [...configValues.workflow.approvalRoles, 'procurement']
                          : configValues.workflow.approvalRoles.filter(r => r !== 'procurement');
                        handleInputChange('workflow', 'approvalRoles', newRoles);
                      }}
                      className="h-4 w-4 text-royalBlue border-gray-300 rounded focus:ring-royalBlue"
                    />
                    <label htmlFor="role-procurement" className="ml-2 block text-sm text-gray-700">
                      Procurement
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="role-executive"
                      checked={configValues.workflow.approvalRoles.includes('executive')}
                      onChange={(e) => {
                        const newRoles = e.target.checked 
                          ? [...configValues.workflow.approvalRoles, 'executive']
                          : configValues.workflow.approvalRoles.filter(r => r !== 'executive');
                        handleInputChange('workflow', 'approvalRoles', newRoles);
                      }}
                      className="h-4 w-4 text-royalBlue border-gray-300 rounded focus:ring-royalBlue"
                    />
                    <label htmlFor="role-executive" className="ml-2 block text-sm text-gray-700">
                      Executive
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="role-legal"
                      checked={configValues.workflow.approvalRoles.includes('legal')}
                      onChange={(e) => {
                        const newRoles = e.target.checked 
                          ? [...configValues.workflow.approvalRoles, 'legal']
                          : configValues.workflow.approvalRoles.filter(r => r !== 'legal');
                        handleInputChange('workflow', 'approvalRoles', newRoles);
                      }}
                      className="h-4 w-4 text-royalBlue border-gray-300 rounded focus:ring-royalBlue"
                    />
                    <label htmlFor="role-legal" className="ml-2 block text-sm text-gray-700">
                      Legal
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notification Recipients
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="email"
                    value={configValues.workflow.newRecipient || ''}
                    onChange={(e) => setConfigValues(prev => ({ ...prev, workflow: { ...prev.workflow, newRecipient: e.target.value } }))}
                    placeholder="email@example.com"
                    className="flex-grow p-2 border border-gray-300 rounded"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (configValues.workflow.newRecipient && configValues.workflow.newRecipient.includes('@')) {
                        handleInputChange('workflow', 'notificationRecipients', 
                          [...configValues.workflow.notificationRecipients, configValues.workflow.newRecipient]);
                        setConfigValues(prev => ({ ...prev, workflow: { ...prev.workflow, newRecipient: '' } }));
                      }
                    }}
                    className="bg-royalBlue text-white px-3 py-2 rounded hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                
                {configValues.workflow.notificationRecipients.length > 0 ? (
                  <div className="mt-3 space-y-2">
                    {configValues.workflow.notificationRecipients.map((email, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span>{email}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newRecipients = [...configValues.workflow.notificationRecipients];
                            newRecipients.splice(index, 1);
                            handleInputChange('workflow', 'notificationRecipients', newRecipients);
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mt-2">No notification recipients added</p>
                )}
              </div>
            </div>
          )}
          
          {/* Security & Access Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Security & Access Configuration</h2>
              <p className="text-gray-600 mb-4">
                Configure security settings and access controls.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="480"
                    value={configValues.security.sessionTimeout}
                    onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  <p className="text-xs text-gray-500 mt-1">Minutes of inactivity before user is logged out</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password Requirements
                  </label>
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer mr-2">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={configValues.security.enforcePasswordComplexity}
                        onChange={(e) => handleInputChange('security', 'enforcePasswordComplexity', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-royalBlue"></div>
                    </label>
                    <span className="text-sm text-gray-600">Enforce strong password requirements</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Multi-Factor Authentication
                  </label>
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer mr-2">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={configValues.security.mfaEnabled}
                        onChange={(e) => handleInputChange('security', 'mfaEnabled', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-royalBlue"></div>
                    </label>
                    <span className="text-sm text-gray-600">Require MFA for all users</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Audit Log Retention (days)
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="365"
                    value={configValues.security.auditLogRetention}
                    onChange={(e) => handleInputChange('security', 'auditLogRetention', parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  <p className="text-xs text-gray-500 mt-1">Number of days to retain audit logs</p>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IP Restrictions
                </label>
                <p className="text-sm text-gray-600 mb-3">
                  Restrict access to specific IP addresses (leave empty for no restrictions)
                </p>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={configValues.security.newIpRestriction || ''}
                    onChange={(e) => setConfigValues(prev => ({ ...prev, security: { ...prev.security, newIpRestriction: e.target.value } }))}
                    placeholder="192.168.1.1"
                    className="flex-grow p-2 border border-gray-300 rounded"
                    pattern="^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (configValues.security.newIpRestriction && /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(configValues.security.newIpRestriction)) {
                        handleInputChange('security', 'ipRestrictions', 
                          [...configValues.security.ipRestrictions, configValues.security.newIpRestriction]);
                        setConfigValues(prev => ({ ...prev, security: { ...prev.security, newIpRestriction: '' } }));
                      }
                    }}
                    className="bg-royalBlue text-white px-3 py-2 rounded hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                
                {configValues.security.ipRestrictions.length > 0 ? (
                  <div className="mt-3 space-y-2">
                    {configValues.security.ipRestrictions.map((ip, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <span>{ip}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newRestrictions = [...configValues.security.ipRestrictions];
                            newRestrictions.splice(index, 1);
                            handleInputChange('security', 'ipRestrictions', newRestrictions);
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mt-2">No IP restrictions added (open access)</p>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-3 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
          >
            Reset to Defaults
          </button>
          
          <div className="space-x-4">
            <button
              type="button"
              onClick={onRefreshConfig}
              className="px-6 py-3 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
            >
              Cancel Changes
            </button>
            
            <button
              type="button"
              onClick={handleSave}
              disabled={!changed}
              className={`px-6 py-3 rounded font-medium ${
                changed
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppConfiguration;
