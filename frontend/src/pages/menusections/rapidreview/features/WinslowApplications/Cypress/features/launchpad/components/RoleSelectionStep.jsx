import React, { useState, useEffect } from 'react';

// This component handles role selection, timeframes, and budget calculations
const RoleSelectionStep = () => {
  // State for selected provider (pre-filled with Talos for this demo)
  const [selectedProvider, setSelectedProvider] = useState({
    id: "provider-2",
    name: "Talos Consulting Group LLC",
    msaReference: "K-0386573"
  });
  
  // State for the service order
  const [serviceOrder, setServiceOrder] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days from now
    totalBudget: 150000,
    resources: []
  });
  
  // State for the new resource being added
  const [newResource, setNewResource] = useState({
    id: '',
    roleTitle: '',
    roleLevel: '',
    belineCode: '',
    rate: 0,
    customRate: 0,
    useCustomRate: false,
    hours: 160,
    startDate: serviceOrder.startDate,
    endDate: serviceOrder.endDate,
    location: 'US Region 2' // Default to US Region 2
  });
  
  // Calculated metrics
  const [metrics, setMetrics] = useState({
    totalCost: 0,
    remainingBudget: serviceOrder.totalBudget,
    totalHours: 0,
    resourceCount: 0
  });
  
  // Keep metrics up-to-date when resources change
  useEffect(() => {
    const totalCost = serviceOrder.resources.reduce((sum, resource) => {
      const rate = resource.useCustomRate ? resource.customRate : resource.rate;
      return sum + (rate * resource.hours);
    }, 0);
    
    const totalHours = serviceOrder.resources.reduce((sum, resource) => sum + resource.hours, 0);
    
    setMetrics({
      totalCost,
      remainingBudget: serviceOrder.totalBudget - totalCost,
      totalHours,
      resourceCount: serviceOrder.resources.length
    });
  }, [serviceOrder]);
  
  // Rate card from the Talos amendment
  const talosRateCard = [
    { belineCode: 'B9904', roleTitle: 'Engagement Manager', level: '', region1: 205, region2: 195, region3: 175 },
    { belineCode: 'B9902', roleTitle: 'Consultant - Business', level: '', region1: 195, region2: 185, region3: null },
    { belineCode: 'B9903', roleTitle: 'Consultant - Strategy', level: '', region1: 225, region2: 205, region3: null },
    { belineCode: 'B9917', roleTitle: 'Consultant - IT', level: '', region1: null, region2: 200, region3: null },
    { belineCode: 'B9909', roleTitle: 'Consultant - Finance', level: '', region1: null, region2: 200, region3: null },
    { belineCode: 'B9911', roleTitle: 'Consultant - Marketing', level: '', region1: null, region2: 225, region3: null },
    { belineCode: 'B2191', roleTitle: 'Operations Analyst', level: '1', region1: null, region2: 120, region3: 110 },
    { belineCode: 'B2773', roleTitle: 'Operations Analyst', level: '2', region1: null, region2: 130, region3: 120 },
    { belineCode: 'B1706', roleTitle: 'Operations Analyst', level: '3', region1: null, region2: 140, region3: 130 },
    { belineCode: 'B1420', roleTitle: 'Operations Coordinator', level: '1', region1: null, region2: 85, region3: 75 },
    { belineCode: 'B1261', roleTitle: 'Operations Coordinator', level: '2', region1: null, region2: 100, region3: 90 },
    { belineCode: 'B1926', roleTitle: 'Operations Coordinator', level: '3', region1: null, region2: 110, region3: 100 },
    { belineCode: 'B9071', roleTitle: 'Agile Lead', level: '1', region1: null, region2: 90, region3: null },
    { belineCode: 'B9072', roleTitle: 'Agile Lead', level: '2', region1: null, region2: 110, region3: null },
    { belineCode: 'B9073', roleTitle: 'Agile Lead', level: '3', region1: null, region2: 125, region3: null },
    { belineCode: 'B1286', roleTitle: 'Program Coordinator - Non-IT', level: '1', region1: 95, region2: 85, region3: 75 },
    { belineCode: 'B2387', roleTitle: 'Program Coordinator - Non-IT', level: '2', region1: 110, region2: 100, region3: 90 },
    { belineCode: 'B1754', roleTitle: 'Program Coordinator - Non-IT', level: '3', region1: 120, region2: 110, region3: 100 },
    { belineCode: 'B3345', roleTitle: 'Program Manager - Non-IT', level: '4', region1: 185, region2: 175, region3: 135 },
    { belineCode: 'B3339', roleTitle: 'Program Manager - Non-IT', level: '5', region1: 205, region2: 195, region3: 175 },
  ];
  
  // Get unique role titles for the role selector
  const uniqueRoleTitles = [...new Set(talosRateCard.map(item => item.roleTitle))];
  
  // Get levels for a specific role title
  const getLevelsForRole = (roleTitle) => {
    return talosRateCard
      .filter(item => item.roleTitle === roleTitle)
      .map(item => item.level)
      .filter(level => level !== '');
  };
  
  // Get rate for a specific role, level and region
  const getRateForRole = (roleTitle, level, region) => {
    const rateItem = talosRateCard.find(item => 
      item.roleTitle === roleTitle && 
      item.level === level
    );
    
    if (!rateItem) return 0;
    
    if (region === 'US Region 1') return rateItem.region1 || 0;
    if (region === 'US Region 2') return rateItem.region2 || 0;
    if (region === 'US Region 3') return rateItem.region3 || 0;
    
    return 0;
  };
  
  // Get Beeline code for a role and level
  const getBelineCode = (roleTitle, level) => {
    const item = talosRateCard.find(item => 
      item.roleTitle === roleTitle && 
      item.level === level
    );
    
    return item ? item.belineCode : '';
  };
  
  // Handle role selection
  const handleRoleSelect = (e) => {
    const roleTitle = e.target.value;
    const levels = getLevelsForRole(roleTitle);
    const level = levels.length > 0 ? levels[0] : '';
    const belineCode = getBelineCode(roleTitle, level);
    const rate = getRateForRole(roleTitle, level, newResource.location);
    
    setNewResource({
      ...newResource,
      roleTitle,
      roleLevel: level,
      belineCode,
      rate,
      customRate: rate
    });
  };
  
  // Handle level selection
  const handleLevelSelect = (e) => {
    const level = e.target.value;
    const belineCode = getBelineCode(newResource.roleTitle, level);
    const rate = getRateForRole(newResource.roleTitle, level, newResource.location);
    
    setNewResource({
      ...newResource,
      roleLevel: level,
      belineCode,
      rate,
      customRate: rate
    });
  };
  
  // Handle location/region selection
  const handleLocationSelect = (e) => {
    const location = e.target.value;
    const rate = getRateForRole(newResource.roleTitle, newResource.roleLevel, location);
    
    setNewResource({
      ...newResource,
      location,
      rate,
      customRate: rate
    });
  };
  
  // Handle hours input
  const handleHoursChange = (e) => {
    const hours = parseInt(e.target.value) || 0;
    setNewResource({
      ...newResource,
      hours
    });
  };
  
  // Handle custom rate toggle
  const handleCustomRateToggle = (e) => {
    setNewResource({
      ...newResource,
      useCustomRate: e.target.checked
    });
  };
  
  // Handle custom rate input
  const handleCustomRateChange = (e) => {
    const customRate = parseFloat(e.target.value) || 0;
    setNewResource({
      ...newResource,
      customRate
    });
  };
  
  // Handle date changes
  const handleDateChange = (field, e) => {
    setNewResource({
      ...newResource,
      [field]: e.target.value
    });
  };
  
  // Add resource to the service order
  const handleAddResource = () => {
    if (!newResource.roleTitle) {
      alert('Please select a role');
      return;
    }
    
    const updatedResources = [
      ...serviceOrder.resources,
      {
        ...newResource,
        id: `resource-${Date.now()}` // Generate a unique ID
      }
    ];
    
    setServiceOrder({
      ...serviceOrder,
      resources: updatedResources
    });
    
    // Reset the new resource form
    setNewResource({
      id: '',
      roleTitle: '',
      roleLevel: '',
      belineCode: '',
      rate: 0,
      customRate: 0,
      useCustomRate: false,
      hours: 160,
      startDate: serviceOrder.startDate,
      endDate: serviceOrder.endDate,
      location: 'US Region 2'
    });
  };
  
  // Remove a resource
  const handleRemoveResource = (resourceId) => {
    const updatedResources = serviceOrder.resources.filter(
      resource => resource.id !== resourceId
    );
    
    setServiceOrder({
      ...serviceOrder,
      resources: updatedResources
    });
  };
  
  // Update project budget
  const handleBudgetChange = (e) => {
    const budget = parseFloat(e.target.value) || 0;
    setServiceOrder({
      ...serviceOrder,
      totalBudget: budget
    });
  };
  
  // Update project dates
  const handleProjectDateChange = (field, e) => {
    setServiceOrder({
      ...serviceOrder,
      [field]: e.target.value
    });
  };
  
  // Calculate warning level for budget
  const getBudgetWarningLevel = () => {
    const percentUsed = (metrics.totalCost / serviceOrder.totalBudget) * 100;
    
    if (percentUsed >= 100) return 'danger';
    if (percentUsed >= 85) return 'warning';
    if (percentUsed >= 70) return 'cautious';
    return 'good';
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Get rate variance message
  const getRateVariance = () => {
    if (!newResource.useCustomRate || !newResource.rate) return null;
    
    const variance = newResource.customRate - newResource.rate;
    const percentVariance = (variance / newResource.rate) * 100;
    
    if (variance === 0) return null;
    
    return {
      text: `${variance > 0 ? 'Above' : 'Below'} standard rate by ${Math.abs(percentVariance).toFixed(1)}%`,
      isNegative: variance < 0,
      isPositive: variance > 0
    };
  };
  
  const rateVariance = getRateVariance();
  const budgetWarningLevel = getBudgetWarningLevel();
  
  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Configure Service Order Team</h1>
      
      {/* Service Order Provider */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-500">Provider</span>
            <h3 className="font-bold text-lg">{selectedProvider.name}</h3>
            <p className="text-sm text-gray-600">MSA Reference: {selectedProvider.msaReference}</p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm text-gray-500">Based on rates from</span>
            <p className="font-medium">First Amendment - Exhibit B-1</p>
          </div>
        </div>
      </div>
      
      {/* Service Order Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="col-span-2 bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold mb-3">Project Timeframe</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Start Date</label>
              <input 
                type="date" 
                className="w-full p-2 border border-gray-300 rounded" 
                value={serviceOrder.startDate}
                onChange={(e) => handleProjectDateChange('startDate', e)}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">End Date</label>
              <input 
                type="date" 
                className="w-full p-2 border border-gray-300 rounded" 
                value={serviceOrder.endDate}
                onChange={(e) => handleProjectDateChange('endDate', e)}
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold mb-3">Budget</h3>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Total Budget</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
              <input 
                type="number" 
                className="w-full pl-7 p-2 border border-gray-300 rounded" 
                value={serviceOrder.totalBudget}
                onChange={handleBudgetChange}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Budget Summary */}
      <div className={`p-4 rounded-lg border mb-6 ${
        budgetWarningLevel === 'danger' ? 'bg-red-50 border-red-200' :
        budgetWarningLevel === 'warning' ? 'bg-yellow-50 border-yellow-200' :
        budgetWarningLevel === 'cautious' ? 'bg-blue-50 border-blue-200' :
        'bg-green-50 border-green-200'
      }`}>
        <div className="flex flex-wrap justify-between items-center">
          <div className="mb-2 md:mb-0">
            <h3 className="font-semibold">Budget Summary</h3>
            <p className="text-sm text-gray-600">
              {metrics.resourceCount} resources, {metrics.totalHours} total hours
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-x-6 gap-y-1">
            <div className="text-right">
              <span className="text-sm text-gray-500">Total Cost:</span>
            </div>
            <div className="font-medium">
              {formatCurrency(metrics.totalCost)}
            </div>
            
            <div className="text-right">
              <span className="text-sm text-gray-500">Budget:</span>
            </div>
            <div className="font-medium">
              {formatCurrency(serviceOrder.totalBudget)}
            </div>
            
            <div className="text-right">
              <span className="text-sm text-gray-500">Remaining:</span>
            </div>
            <div className={`font-medium ${
              metrics.remainingBudget < 0 ? 'text-red-600' : 'text-green-600'
            }`}>
              {formatCurrency(metrics.remainingBudget)}
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                budgetWarningLevel === 'danger' ? 'bg-red-600' :
                budgetWarningLevel === 'warning' ? 'bg-yellow-500' :
                budgetWarningLevel === 'cautious' ? 'bg-blue-500' :
                'bg-green-500'
              }`} 
              style={{ width: `${Math.min(100, (metrics.totalCost / serviceOrder.totalBudget) * 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">0%</span>
            <span className="text-xs text-gray-500">
              {Math.min(100, ((metrics.totalCost / serviceOrder.totalBudget) * 100).toFixed(1))}%
            </span>
            <span className="text-xs text-gray-500">100%</span>
          </div>
        </div>
      </div>
      
      {/* Team Configuration */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <h3 className="font-semibold mb-4">Team Configuration</h3>
        
        {/* Current resources */}
        {serviceOrder.resources.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Current Team Members</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {serviceOrder.resources.map(resource => (
                    <tr key={resource.id}>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="font-medium">{resource.roleTitle}</div>
                        {resource.roleLevel && (
                          <div className="text-xs text-gray-500">Level {resource.roleLevel}</div>
                        )}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm">
                        {resource.location}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm">
                        {resource.hours}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm">
                        ${resource.useCustomRate ? resource.customRate : resource.rate}/hr
                        {resource.useCustomRate && resource.customRate !== resource.rate && (
                          <div className={`text-xs ${resource.customRate > resource.rate ? 'text-red-500' : 'text-green-500'}`}>
                            {resource.customRate > resource.rate ? 'Above' : 'Below'} standard
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm">
                        ${(resource.useCustomRate ? resource.customRate : resource.rate) * resource.hours}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-right text-sm">
                        <button
                          onClick={() => handleRemoveResource(resource.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Add new resource */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Add Team Member</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Role</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded"
                value={newResource.roleTitle}
                onChange={handleRoleSelect}
              >
                <option value="">-- Select Role --</option>
                {uniqueRoleTitles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            
            {newResource.roleTitle && getLevelsForRole(newResource.roleTitle).length > 0 && (
              <div>
                <label className="block text-sm text-gray-600 mb-1">Level</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded"
                  value={newResource.roleLevel}
                  onChange={handleLevelSelect}
                >
                  {getLevelsForRole(newResource.roleTitle).map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Location</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded"
                value={newResource.location}
                onChange={handleLocationSelect}
              >
                <option value="US Region 1">US Region 1</option>
                <option value="US Region 2">US Region 2</option>
                <option value="US Region 3">US Region 3</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">Hours</label>
              <input 
                type="number" 
                className="w-full p-2 border border-gray-300 rounded" 
                value={newResource.hours}
                onChange={handleHoursChange}
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">Rate</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input 
                  type="number" 
                  className={`w-full pl-7 p-2 border rounded ${
                    newResource.useCustomRate ? 
                    'border-blue-300 bg-blue-50' : 
                    'border-gray-300 bg-gray-100'
                  }`}
                  value={newResource.useCustomRate ? newResource.customRate : newResource.rate}
                  onChange={handleCustomRateChange}
                  disabled={!newResource.useCustomRate}
                />
              </div>
              
              <div className="mt-1 flex items-center">
                <input 
                  type="checkbox" 
                  id="useCustomRate" 
                  className="mr-2"
                  checked={newResource.useCustomRate}
                  onChange={handleCustomRateToggle}
                />
                <label htmlFor="useCustomRate" className="text-xs text-gray-600">
                  Use custom rate
                </label>
                
                {rateVariance && (
                  <span className={`ml-2 text-xs ${
                    rateVariance.isPositive ? 'text-red-500' : 'text-green-500'
                  }`}>
                    {rateVariance.text}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Start Date</label>
              <input 
                type="date" 
                className="w-full p-2 border border-gray-300 rounded" 
                value={newResource.startDate}
                onChange={(e) => handleDateChange('startDate', e)}
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">End Date</label>
              <input 
                type="date" 
                className="w-full p-2 border border-gray-300 rounded" 
                value={newResource.endDate}
                onChange={(e) => handleDateChange('endDate', e)}
              />
            </div>
          </div>
          
          {newResource.roleTitle && (
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
              <div>
                <p className="font-medium">
                  {newResource.roleTitle} {newResource.roleLevel && `(Level ${newResource.roleLevel})`}
                </p>
                <p className="text-sm text-gray-600">
                  {newResource.hours} hours × ${newResource.useCustomRate ? newResource.customRate : newResource.rate}/hr
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  Total: ${(newResource.useCustomRate ? newResource.customRate : newResource.rate) * newResource.hours}
                </p>
                <p className="text-xs text-gray-500">
                  Beeline Code: {newResource.belineCode}
                </p>
              </div>
            </div>
          )}
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleAddResource}
              disabled={!newResource.roleTitle}
              className={`px-4 py-2 rounded ${
                newResource.roleTitle ? 
                'bg-blue-600 hover:bg-blue-700 text-white' : 
                'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Add Team Member
            </button>
          </div>
        </div>
      </div>
      
      {/* Next Step Button */}
      <div className="flex justify-end mt-6">
        <button 
          className={`px-6 py-2 rounded ${
            serviceOrder.resources.length > 0 ?
            'bg-green-600 hover:bg-green-700 text-white' :
            'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={serviceOrder.resources.length === 0}
        >
          Continue to Service Order Details
        </button>
      </div>
    </div>
  );
};

export default RoleSelectionStep;
