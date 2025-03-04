import React, { useState } from 'react';
import TabNavigation from './TabNavigation';

const OrderPortfolio = ({
  title,
  data,
  loading,
  error,
  onViewOrderDetails,
  onEditOrder,
  onCancelOrder,
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState('all');
  const [activeProvider, setActiveProvider] = useState(null);
  const [filterValues, setFilterValues] = useState({
    search: '',
    status: '',
    provider: '',
    dateRange: ''
  });
  
  // Get all orders from data
  const orders = data?.orders || [];

  // Get all unique providers from orders
  const providers = [...new Set(orders.map(order => order.providerName))];
  
  // Get all unique statuses from orders
  const statuses = [...new Set(orders.map(order => order.status))];
  
  // Filter orders based on active tab and filter values
  const getFilteredOrders = () => {
    return orders.filter(order => {
      // Filter by active tab
      if (activeTab !== 'all' && order.status.toLowerCase() !== activeTab) {
        return false;
      }
      
      // Filter by active provider
      if (activeProvider && order.providerName !== activeProvider) {
        return false;
      }
      
      // Filter by search text
      if (filterValues.search && 
          !order.orderNumber.toLowerCase().includes(filterValues.search.toLowerCase()) &&
          !order.orderName.toLowerCase().includes(filterValues.search.toLowerCase())) {
        return false;
      }
      
      // Filter by status
      if (filterValues.status && order.status !== filterValues.status) {
        return false;
      }
      
      // Filter by provider
      if (filterValues.provider && order.providerName !== filterValues.provider) {
        return false;
      }
      
      // Filter by date range
      if (filterValues.dateRange) {
        const today = new Date();
        const orderDate = new Date(order.createdDate);
        
        switch (filterValues.dateRange) {
          case 'last30':
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(today.getDate() - 30);
            if (orderDate < thirtyDaysAgo) return false;
            break;
          case 'last90':
            const ninetyDaysAgo = new Date();
            ninetyDaysAgo.setDate(today.getDate() - 90);
            if (orderDate < ninetyDaysAgo) return false;
            break;
          case 'thisYear':
            const startOfYear = new Date(today.getFullYear(), 0, 1);
            if (orderDate < startOfYear) return false;
            break;
          case 'lastYear':
            const startOfLastYear = new Date(today.getFullYear() - 1, 0, 1);
            const endOfLastYear = new Date(today.getFullYear() - 1, 11, 31);
            if (orderDate < startOfLastYear || orderDate > endOfLastYear) return false;
            break;
          default:
            break;
        }
      }
      
      return true;
    });
  };

  const filteredOrders = getFilteredOrders();
  
  // Group orders by provider
  const ordersByProvider = filteredOrders.reduce((acc, order) => {
    if (!acc[order.providerName]) {
      acc[order.providerName] = [];
    }
    acc[order.providerName].push(order);
    return acc;
  }, {});
  
  // Handler for filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterValues(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilterValues({
      search: '',
      status: '',
      provider: '',
      dateRange: ''
    });
    setActiveProvider(null);
  };
  
  // Calculate total numbers for summary cards
  const totalOrders = orders.length;
  const activeOrders = orders.filter(order => order.status === 'Active').length;
  const pendingOrders = orders.filter(order => order.status === 'Pending Approval').length;
  const completedOrders = orders.filter(order => order.status === 'Completed').length;
  
  // Calculate total value of all orders
  const totalOrderValue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  
  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-600';
      case 'Pending Approval':
        return 'bg-yellow-500';
      case 'Draft':
        return 'bg-gray-400';
      case 'Completed':
        return 'bg-blue-500';
      case 'Cancelled':
        return 'bg-red-500';
      case 'On Hold':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  // Define tabs for the tab navigation
  const tabs = [
    { id: 'all', label: 'All Orders' },
    { id: 'active', label: `Active (${activeOrders})` },
    { id: 'pending approval', label: `Pending (${pendingOrders})` },
    { id: 'completed', label: `Completed (${completedOrders})` }
  ];

  // Component loading state
  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-royalBlue"></div>
      </div>
    );
  }

  // Component error state
  if (error && orders.length === 0) {
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
          <h1 className="text-xl font-bold">{title || "Order Bank"}</h1>
          <span className="text-lg">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Tabs */}
      <TabNavigation 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={tabs}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500 text-sm">Total Orders</h3>
          <p className="text-2xl font-bold text-royalBlue">{totalOrders}</p>
          <div className="mt-2 pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-600">Across all providers and statuses</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500 text-sm">Active Orders</h3>
          <p className="text-2xl font-bold text-green-600">{activeOrders}</p>
          <div className="mt-2 pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-600">{((activeOrders / totalOrders) * 100).toFixed(1)}% of total</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500 text-sm">Pending Approval</h3>
          <p className="text-2xl font-bold text-yellow-500">{pendingOrders}</p>
          <div className="mt-2 pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-600">Requires review and approval</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500 text-sm">Total Portfolio Value</h3>
          <p className="text-2xl font-bold text-royalBlue">{formatCurrency(totalOrderValue)}</p>
          <div className="mt-2 pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-600">Combined value of all orders</p>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white p-4 border-t border-b border-gray-200">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="w-64">
            <input 
              type="text" 
              name="search"
              value={filterValues.search}
              onChange={handleFilterChange}
              placeholder="Search orders..." 
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          
          <div className="w-40 relative">
            <select 
              name="status"
              value={filterValues.status}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded appearance-none"
            >
              <option value="">Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
          
          <div className="w-40 relative">
            <select 
              name="provider"
              value={filterValues.provider}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded appearance-none"
            >
              <option value="">Provider</option>
              {providers.map(provider => (
                <option key={provider} value={provider}>{provider}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
          
          <div className="w-40 relative">
            <select 
              name="dateRange"
              value={filterValues.dateRange}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded appearance-none"
            >
              <option value="">Time Period</option>
              <option value="last30">Last 30 Days</option>
              <option value="last90">Last 90 Days</option>
              <option value="thisYear">This Year</option>
              <option value="lastYear">Last Year</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
          
          <button 
            onClick={resetFilters}
            className="border border-gray-300 text-gray-600 px-4 py-2 rounded hover:bg-gray-100"
          >
            Reset Filters
          </button>
          
          <div className="ml-auto">
            <button 
              onClick={onRefreshData}
              className="bg-royalBlue text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Show loading indicator if refreshing with existing data */}
      {loading && orders.length > 0 && (
        <div className="bg-blue-50 p-2 text-center text-royalBlue">
          <span className="inline-block animate-pulse mr-2">⟳</span> Refreshing data...
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {Object.keys(ordersByProvider).length === 0 ? (
          <div className="bg-white p-8 rounded-lg text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Orders Found</h3>
            <p className="text-gray-500 mb-4">
              {filterValues.search || filterValues.status || filterValues.provider || filterValues.dateRange || activeTab !== 'all' || activeProvider
                ? "No orders match your current filters. Try adjusting your search criteria."
                : "There are no orders in the system yet. Create your first order to get started."}
            </p>
            {(filterValues.search || filterValues.status || filterValues.provider || filterValues.dateRange || activeTab !== 'all' || activeProvider) && (
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(ordersByProvider).map(([providerName, providerOrders]) => (
              <div key={providerName} className="bg-white rounded-lg shadow">
                {/* Provider Header */}
                <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <h2 className="text-lg font-bold text-gray-800">{providerName}</h2>
                      <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                        {providerOrders.length} order{providerOrders.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <button
                      onClick={() => setActiveProvider(activeProvider === providerName ? null : providerName)}
                      className="text-sm text-royalBlue hover:underline"
                    >
                      {activeProvider === providerName ? 'Show All Providers' : 'Filter to This Provider'}
                    </button>
                  </div>
                </div>
                
                {/* Provider Orders Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <th className="py-3 px-4">Order Number</th>
                        <th className="py-3 px-4">Order Name</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Created Date</th>
                        <th className="py-3 px-4">Total Value</th>
                        <th className="py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {providerOrders.map((order) => (
                        <tr key={order.orderNumber} className="hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{order.orderNumber}</td>
                          <td className="py-3 px-4">{order.orderName}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-white text-xs ${getStatusBadgeColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">{new Date(order.createdDate).toLocaleDateString()}</td>
                          <td className="py-3 px-4 font-medium">{formatCurrency(order.totalAmount)}</td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => onViewOrderDetails(order.orderNumber)}
                                className="text-blue-600 hover:text-blue-800"
                                title="View Details"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                </svg>
                              </button>
                              
                              {['Draft', 'Pending Approval'].includes(order.status) && (
                                <button
                                  onClick={() => onEditOrder(order.orderNumber)}
                                  className="text-green-600 hover:text-green-800"
                                  title="Edit Order"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                  </svg>
                                </button>
                              )}
                              
                              {['Draft', 'Pending Approval', 'Active'].includes(order.status) && (
                                <button
                                  onClick={() => onCancelOrder(order.orderNumber)}
                                  className="text-red-600 hover:text-red-800"
                                  title="Cancel Order"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Provider Summary */}
                <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Total Value: <span className="font-bold">{formatCurrency(providerOrders.reduce((sum, order) => sum + order.totalAmount, 0))}</span>
                    </span>
                    <button
                      onClick={() => onViewOrderDetails(providerName, 'all')} 
                      className="text-sm text-royalBlue hover:underline"
                    >
                      View All {providerName} Orders
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPortfolio;
