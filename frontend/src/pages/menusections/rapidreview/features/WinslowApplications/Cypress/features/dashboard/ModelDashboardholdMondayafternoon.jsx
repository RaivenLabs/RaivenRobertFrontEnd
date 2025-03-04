import React, { useState } from 'react';
import MiniSparkline from './ui/MiniSparkline';

const ModelDashboard = ({
  title,
  data,
  entityType,
  loading,
  error,
  onUpdateOrder,
  onDeleteOrder,
  onCreateOrder,
  onRefreshData
}) => {
  const [activeOrder, setActiveOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('orders');
  const [filterValues, setFilterValues] = useState({
    search: '',
    provider: '',
    status: '',
    resourceRole: '',
    fiscalYear: ''
  });

  // If data is not yet loaded or malformed, use empty arrays
  const serviceOrders = data?.serviceOrders || [];
  
  // Helper function to apply filters to service orders
  const getFilteredOrders = () => {
    return serviceOrders.filter(order => {
      // Search text filter
      if (filterValues.search && 
          !order.orderName.toLowerCase().includes(filterValues.search.toLowerCase()) &&
          !order.id.toLowerCase().includes(filterValues.search.toLowerCase())) {
        return false;
      }
      
      // Provider filter
      if (filterValues.provider && order.provider !== filterValues.provider) {
        return false;
      }
      
      // Status filter
      if (filterValues.status && order.status !== filterValues.status) {
        return false;
      }
      
      // Fiscal Year filter
      if (filterValues.fiscalYear && order.fiscalYear !== filterValues.fiscalYear) {
        return false;
      }
      
      // Resource Role filter (more complex since it's nested data)
      if (filterValues.resourceRole && order.resources) {
        const hasRole = order.resources.some(
          resource => resource.role === filterValues.resourceRole
        );
        if (!hasRole) return false;
      }
      
      return true;
    });
  };

  const filteredOrders = getFilteredOrders();

  // Calculate summary metrics
  const totalActiveOrders = filteredOrders.filter(o => o.status === 'Active').length;
  const totalOrderValue = filteredOrders.reduce((sum, order) => {
    return sum + parseInt(order.orderValue.replace(/[^0-9.-]+/g, ""));
  }, 0);
  
  // Calculate spend by provider
  const spendByProvider = filteredOrders.reduce((acc, order) => {
    const provider = order.provider;
    const value = parseInt(order.orderValue.replace(/[^0-9.-]+/g, ""));
    acc[provider] = (acc[provider] || 0) + value;
    return acc;
  }, {});
  
  // Calculate spend by fiscal year
  const spendByFY = filteredOrders.reduce((acc, order) => {
    const fy = order.fiscalYear;
    const value = parseInt(order.orderValue.replace(/[^0-9.-]+/g, ""));
    acc[fy] = (acc[fy] || 0) + value;
    return acc;
  }, {});

  // Calculate total variance against rate card
  const calculateRateCardVariance = () => {
    // This would ideally come from your actual data
    // For now using sample calculation
    return 49000; // $49,000 in savings (positive is good)
  };
  
  // Calculate total billable hours
  const calculateTotalBillableHours = () => {
    // This would calculate from your actual data
    return 2180; // Total billable hours
  };

  // Mini Sparkline Chart component
  
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
    // The filtering happens automatically in getFilteredOrders()
    // This function could be used to perform additional actions when Apply is clicked
  };

  // Reset filters
  const resetFilters = () => {
    setFilterValues({
      search: '',
      provider: '',
      status: '',
      resourceRole: '',
      fiscalYear: ''
    });
  };

  // Toggle order expansion
  const toggleOrder = (id) => {
    if (activeOrder === id) {
      setActiveOrder(null);
    } else {
      setActiveOrder(id);
    }
  };

  // Status badge color function
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-600';
      case 'Pending Approval':
        return 'bg-purple-600';
      case 'Planning':
        return 'bg-blue-500';
      case 'On Hold':
        return 'bg-orange-500';
      case 'Completed':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Completion score badge color function
  const getScoreBadgeColor = (score) => {
    const numericScore = parseInt(score);
    if (numericScore >= 80) return 'bg-green-500';
    if (numericScore >= 60) return 'bg-green-600';
    if (numericScore >= 40) return 'bg-orange-500';
    if (numericScore >= 20) return 'bg-orange-600';
    return 'bg-red-500';
  };

  // Handle order update
  const handleOrderModification = async (orderId, updatedFields) => {
    const orderToUpdate = serviceOrders.find(order => order.id === orderId);
    if (!orderToUpdate) return;
    
    const updatedOrder = { ...orderToUpdate, ...updatedFields };
    const result = await onUpdateOrder(orderId, updatedOrder);
    
    if (result.success) {
      // Success handling could show a toast message or other UI feedback
    } else {
      // Error handling could show an error message
      alert(`Failed to update order: ${result.error}`);
    }
  };

  // Handle order deletion
  const handleOrderDeletion = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      const result = await onDeleteOrder(orderId);
      
      if (result.success) {
        // Success handling
        setActiveOrder(null); // Close any expanded view
      } else {
        // Error handling
        alert(`Failed to delete order: ${result.error}`);
      }
    }
  };

  // Handle creating a new order
  const handleNewOrder = () => {
    // This would typically open a modal or navigate to a form
    // For demo purposes, we'll just create a simple order
    const newOrderTemplate = {
      orderName: 'New Service Order',
      provider: 'Select Provider',
      status: 'Planning',
      startDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      orderValue: '$0',
      fiscalYear: `FY${new Date().getFullYear().toString().slice(-2)}`,
      completionScore: '0%',
      resources: []
    };
    
    // In a real application, you would open a form to let the user fill in these details
    onCreateOrder(newOrderTemplate);
  };



  // Component loading state
  if (loading && serviceOrders.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-royalBlue"></div>
      </div>
    );
  }

  // Component error state
  if (error && serviceOrders.length === 0) {
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
      {/* Dashboard Header */}
      <div className="bg-gray-200 text-gray-800 p-4 rounded-t-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Current Activity</h1>
          <span className="text-lg">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Search and Filter Panel */}
      <div className="bg-gray-50 p-4 border-b border-gray-200">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="w-64">
            <input 
              type="text" 
              name="search"
              value={filterValues.search}
              onChange={handleFilterChange}
              placeholder="Search service orders..." 
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="w-36 relative">
            <select 
              name="provider"
              value={filterValues.provider}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded appearance-none"
            >
              <option value="">Provider</option>
              <option value="Midway Consulting">Midway Consulting</option>
              <option value="Apex Systems">Apex Systems</option>
              <option value="Technica Solutions">Technica Solutions</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
          <div className="w-36 relative">
            <select 
              name="status"
              value={filterValues.status}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded appearance-none"
            >
              <option value="">Status</option>
              <option value="Active">Active</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Planning">Planning</option>
              <option value="On Hold">On Hold</option>
              <option value="Completed">Completed</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
          <div className="w-36 relative">
            <select 
              name="resourceRole"
              value={filterValues.resourceRole}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded appearance-none"
            >
              <option value="">Resource Role</option>
              <option value="Technical Lead">Technical Lead</option>
              <option value="Senior Developer">Senior Developer</option>
              <option value="Project Manager">Project Manager</option>
              <option value="Data Scientist">Data Scientist</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
          <div className="w-36 relative">
            <select 
              name="fiscalYear"
              value={filterValues.fiscalYear}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded appearance-none"
            >
              <option value="">Fiscal Year</option>
              <option value="FY25">FY25</option>
              <option value="FY26">FY26</option>
              <option value="FY25-26">Cross-FY</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
          <button 
            onClick={applyFilters}
            className="bg-royalBlue text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Apply Filters
          </button>
          <button 
            onClick={resetFilters}
            className="border border-gray-300 text-gray-600 px-4 py-2 rounded hover:bg-gray-100"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Summary Cards in Two Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 bg-gray-50">
        {/* Row 1: Orders and Portfolio Value */}
        <div className="bg-white p-4 rounded shadow">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Service Orders</p>
              <p className="text-2xl font-bold text-royalBlue">{totalActiveOrders}</p>
              <p className="text-xs text-gray-500 mt-2">Out of {filteredOrders.length} total orders</p>
            </div>
            <div className="w-32 flex items-end">
              <MiniSparkline data={[35, 40, 42, 38, 45, 48, 50, 52, 48, 50, 53, 55]} color="#4299e1" type="bar" />
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-100">
            <p className="text-xs text-blue-600">+5% from last month</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Portfolio Value</p>
              <p className="text-2xl font-bold text-royalBlue">${totalOrderValue.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-2">Across all active and planned orders</p>
            </div>
            <div className="w-32 flex items-end">
              <MiniSparkline data={[]} color="#48bb78" type="line" />
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-100">
            <p className="text-xs text-green-600">+8% growth YTD</p>
          </div>
        </div>

        {/* Row 2: FY25 Spend and Rate Card Savings */}
        <div className="bg-white p-4 rounded shadow">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">FY25 Spend</p>
              <p className="text-2xl font-bold text-royalBlue">${(spendByFY['FY25'] || 0).toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-2">Jun 2024 - May 2025</p>
            </div>
            <div className="w-32 flex items-end">
              <MiniSparkline data={[]} color="#ed8936" type="line" />
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-100">
            <p className="text-xs text-orange-600">42% of annual budget</p>
          </div>
        </div>
        
        {/* Enhanced Rate Card Calculations */}
        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center">
                <p className="text-sm text-gray-500 mr-2">Rate Card Variance</p>
                <div className="relative group">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="absolute z-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded p-2 w-48 -left-20 top-5">
                    Difference between standard rate card prices and actual billed rates across all service orders.
                  </div>
                </div>
              </div>
              
              {/* Dynamic display based on whether it's savings or overage */}
              {calculateRateCardVariance() >= 0 ? (
                <p className="text-2xl font-bold text-green-600">${calculateRateCardVariance().toLocaleString()}</p>
              ) : (
                <p className="text-2xl font-bold text-red-600">-${Math.abs(calculateRateCardVariance()).toLocaleString()}</p>
              )}
              
              <p className="text-xs text-gray-500 mt-2">Across {calculateTotalBillableHours().toLocaleString()} billable hours</p>
            </div>
            
            <div className="w-12 flex justify-center">
              {calculateRateCardVariance() >= 0 ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              )}
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between mb-1">
              <span className="text-xs text-gray-500">Provider breakdown</span>
              <span className="text-xs text-gray-500">Variance</span>
            </div>
            <div className="space-y-1 max-h-16 overflow-y-auto">
              <div className="flex justify-between items-center">
                <span className="text-xs">Midway Consulting</span>
                <span className="text-xs text-green-600">+$35,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs">Apex Systems</span>
                <span className="text-xs text-green-600">+$22,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs">Technica Solutions</span>
                <span className="text-xs text-red-600">-$8,000</span>
              </div>
            </div>
          </div>
          
          <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between">
            <p className="text-xs text-green-600">$22.50/hr avg. below rate card</p>
            <button className="text-xs text-blue-600 hover:underline">View Details</button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 px-4 bg-gray-50">
        <button 
          className={`py-2 px-4 font-medium ${activeTab === 'orders' ? 'text-royalBlue border-b-2 border-royalBlue' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('orders')}
        >
          Service Orders
        </button>
        <button 
          className={`py-2 px-4 font-medium ${activeTab === 'providers' ? 'text-royalBlue border-b-2 border-royalBlue' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('providers')}
        >
          Provider Analysis
        </button>
        <button 
          className={`py-2 px-4 font-medium ${activeTab === 'resources' ? 'text-royalBlue border-b-2 border-royalBlue' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('resources')}
        >
          Resource Utilization
        </button>
      </div>

      {/* Table Header */}
      <div className="bg-gray-50 p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-royalBlue">
            Service Order Count: {filteredOrders.length}
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={onRefreshData}
              className="border border-royalBlue text-royalBlue px-4 py-2 rounded hover:bg-blue-50"
            >
              Refresh Data
            </button>
            <button 
              onClick={handleNewOrder}
              className="bg-royalBlue text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              + New Service Order
            </button>
          </div>
        </div>
      </div>

      {/* Show loading indicator if refreshing with existing data */}
      {loading && serviceOrders.length > 0 && (
        <div className="bg-blue-50 p-2 text-center text-royalBlue">
          <span className="inline-block animate-pulse mr-2">⟳</span> Refreshing data...
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-royalBlue text-white">
              <th className="py-3 px-4 text-left">Order ID</th>
              <th className="py-3 px-4 text-left">Order Name</th>
              <th className="py-3 px-4 text-left">Provider</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Timeline</th>
              <th className="py-3 px-4 text-left">Fiscal Year</th>
              <th className="py-3 px-4 text-left">Order Value</th>
              <th className="py-3 px-4 text-left">Completion</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-6 text-center text-gray-500">
                  {error ? (
                    <div>
                      <p>Error loading orders: {error}</p>
                      <button 
                        onClick={onRefreshData}
                        className="mt-2 text-blue-600 underline"
                      >
                        Try again
                      </button>
                    </div>
                  ) : (
                    filterValues.search || filterValues.provider || filterValues.status || 
                    filterValues.resourceRole || filterValues.fiscalYear ? 
                      "No orders match your filter criteria." : 
                      "No service orders found."
                  )}
                </td>
              </tr>
            ) : (
              filteredOrders.map((order, index) => (
                <React.Fragment key={order.id}>
                  <tr 
                    className={`border-b ${activeOrder === order.id ? 'bg-blue-50' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} cursor-pointer hover:bg-blue-50`}
                    onClick={() => toggleOrder(order.id)}
                  >
                    <td className="py-3 px-4">{order.id}</td>
                    <td className="py-3 px-4 font-medium">{order.orderName}</td>
                    <td className="py-3 px-4">{order.provider}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-white text-xs ${getStatusBadgeColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">{order.startDate} - {order.endDate}</td>
                    <td className="py-3 px-4">{order.fiscalYear}</td>
                    <td className="py-3 px-4">{order.orderValue}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-white text-xs ${getScoreBadgeColor(order.completionScore)}`}>
                        {order.completionScore}
                      </span>
                    </td>
                  </tr>
                  
                  {/* Expanded row with order details */}
                  {activeOrder === order.id && (
                    <tr>
                      <td colSpan="8" className="py-6 px-6 bg-blue-50 border-b">
                        <div className="space-y-6">
                          {/* Order Info */}
                          <div>
                            <h3 className="font-bold text-gray-800 mb-3">Order Details</h3>
                            <div className="grid grid-cols-3 gap-4 mb-4">
                              <div className="bg-white p-3 rounded border border-gray-200">
                                <p className="text-sm text-gray-500">Master Agreement</p>
                                <p className="font-medium">{order.master}</p>
                              </div>
                              <div className="bg-white p-3 rounded border border-gray-200">
                                <p className="text-sm text-gray-500">Provider</p>
                                <p className="font-medium">{order.provider}</p>
                              </div>
                              <div className="bg-white p-3 rounded border border-gray-200">
                                <p className="text-sm text-gray-500">Duration</p>
                                <p className="font-medium">{order.startDate} - {order.endDate}</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Resources Section */}
                          {order.resources && order.resources.length > 0 && (
                            <div>
                              <h3 className="font-bold text-gray-800 mb-3">Resource Allocation</h3>
                              <div className="overflow-x-auto bg-white border border-gray-200 rounded">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead>
                                    <tr className="bg-gray-50">
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilization</th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Cost</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200">
                                    {order.resources.map((resource, idx) => {
                                      const rate = parseInt(resource.rate.replace(/[^0-9.-]+/g, ""));
                                      const utilization = parseInt(resource.utilization.replace('%', '')) / 100;
                                      const monthlyCost = rate * 160 * resource.quantity * utilization; // Assuming 160 hours per month
                                      
                                      return (
                                        <tr key={idx}>
                                          <td className="px-4 py-2">{resource.role}</td>
                                          <td className="px-4 py-2">{resource.quantity}</td>
                                          <td className="px-4 py-2">{resource.rate}</td>
                                          <td className="px-4 py-2">{resource.utilization}</td>
                                          <td className="px-4 py-2">${monthlyCost.toLocaleString(undefined, {maximumFractionDigits: 0})}</td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                          
                          {/* Progress Dimensions */}
                          {order.dimensions && (
                            <div>
                              <h3 className="font-bold text-gray-800 mb-3">Project Progress</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {order.dimensions.map((dimension, idx) => (
                                  <div 
                                    key={idx} 
                                    className="bg-white p-3 rounded border border-gray-200 shadow-sm"
                                  >
                                    <p className="font-medium text-gray-800 mb-2">{dimension.name}</p>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                                      <div 
                                        className="h-2.5 rounded-full" 
                                        style={{
                                          width: `${dimension.progress}%`, 
                                          backgroundColor: dimension.color
                                        }}
                                      ></div>
                                    </div>
                                    <div className="text-right text-sm font-medium" style={{ color: dimension.color }}>
                                      {dimension.progress}%
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Action Buttons */}
                          <div className="flex justify-end gap-3">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOrderModification(order.id, { status: 'On Hold' });
                              }}
                              className="border border-gray-300 text-gray-700 px-4 py-1 rounded hover:bg-gray-100"
                            >
                              Set On Hold
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOrderDeletion(order.id);
                              }}
                              className="border border-red-300 text-red-700 px-4 py-1 rounded hover:bg-red-100"
                            >
                              Delete Order
                            </button>
                            <button 
                              className="bg-royalBlue text-white px-4 py-1 rounded hover:bg-blue-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Implement view details logic (e.g., navigate to dedicated page)
                                alert(`View full details for ${order.id}`);
                              }}
                            >
                              View Details
                            </button>
                          </div>
                        </div>
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
      {filteredOrders.length > 0 && (
        <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-between items-center rounded-b-lg">
          <div>Showing 1-{filteredOrders.length} of {filteredOrders.length} service orders</div>
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

export default ModelDashboard;
