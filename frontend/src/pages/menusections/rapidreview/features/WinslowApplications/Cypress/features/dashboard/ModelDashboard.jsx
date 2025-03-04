import React, { useState } from 'react';
import MiniSparkline from './ui/MiniSparkline';
import SearchFilterPanel from './components/Dashboard/SearchFilterPanel';
import SummaryCard from './components/Dashboard/SummaryCard';
import RateCardVarianceCard from './components/Dashboard/RateCardVarianceCard';
import DashboardHeader from './components/Dashboard/DashboardHeader';
import TabNavigation from './components/Dashboard/TabNavigation';
import TableHeader from './components/Dashboard/TableHeader';
import OrderDetails from './components/Table/OrderDetails';
import ServiceOrderTable from './components/Table/ServiceOrderTable';
import Pagination from './components/Table/Pagination';
import SummaryCardsGrid from './components/Dashboard/SummaryCardsGrid';






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

// Sample provider variance breakdown data
const providerVarianceBreakdown = [
    { name: 'Midway Consulting', amount: '+$35,000' },
    { name: 'Apex Systems', amount: '+$22,000' },
    { name: 'Technica Solutions', amount: '-$8,000' }
  ];




  // Define tabs for the TabNavigation component
const tabs = [
    { id: 'orders', label: 'Service Orders' },
    { id: 'providers', label: 'Provider Analysis' },
    { id: 'resources', label: 'Resource Utilization' }
  ];



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
        <DashboardHeader title="Current Activity" />





















      {/* Search and Filter Panel */}
  {/* Search and Filter Panel */}
<SearchFilterPanel 
  filterValues={filterValues}
  handleFilterChange={handleFilterChange}
  applyFilters={applyFilters}
  resetFilters={resetFilters}
/>



{/* Summary Cards */}
<SummaryCardsGrid 
  totalActiveOrders={totalActiveOrders}
  totalOrdersCount={filteredOrders.length}
  totalOrderValue={totalOrderValue}
  spendByFY={spendByFY}
  rateCardVariance={calculateRateCardVariance()}
  totalBillableHours={calculateTotalBillableHours()}
  providerVarianceBreakdown={providerVarianceBreakdown}
/>


      {/* Tabs */}
   {/* Tabs */}
<TabNavigation 
  activeTab={activeTab}
  setActiveTab={setActiveTab}
  tabs={tabs}
/>

      {/* Table Header */}
 {/* Table Header */}
<TableHeader 
  totalOrders={filteredOrders.length}
  onRefreshData={onRefreshData}
  onNewOrder={handleNewOrder}
/>

      {/* Show loading indicator if refreshing with existing data */}
      {loading && serviceOrders.length > 0 && (
        <div className="bg-blue-50 p-2 text-center text-royalBlue">
          <span className="inline-block animate-pulse mr-2">⟳</span> Refreshing data...
        </div>
      )}

      {/* Table */}
  {/* Service Orders Table */}
<ServiceOrderTable 
  orders={filteredOrders}
  activeOrder={activeOrder}
  toggleOrder={toggleOrder}
  error={error}
  onRefreshData={onRefreshData}
  handleOrderModification={handleOrderModification}
  handleOrderDeletion={handleOrderDeletion}
  filterValues={filterValues}
/>  

      {/* Pagination - Only show if we have data */}
      {/* Pagination - Only show if we have data */}
{filteredOrders.length > 0 && (
  <Pagination 
    totalItems={filteredOrders.length}
    currentPage={1}
    itemsPerPage={10}
    onPageChange={(page) => console.log('Page changed to:', page)}
  />
)}
    </div>
  );
};

export default ModelDashboard;
