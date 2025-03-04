import React, { useState, useEffect } from 'react';
import ModelDashboard from './ModelDashboard';

const CypressDashboard = () => {
  // State management
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  
  // Initial data fetch function
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/msa/dashboard-data');
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      setData(result);
      setError(null);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching MSA dashboard data:', error);
      setError('Failed to load dashboard data: ' + error.message);
      setLoading(false);
    }
  };
  
  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);
  
  // Handler for updating service orders
  const handleUpdateOrder = async (orderId, updatedData) => {
    try {
      // Optional: set a specific updating state if you want to show a different UI
      // than the main loading state
      // setUpdating(true);
      
      const response = await fetch(`/api/service-orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      // Refresh data after successful update
      await fetchData();
      
      return { success: true };
    } catch (error) {
      console.error('Error updating order:', error);
      setError('Failed to update order: ' + error.message);
      return { success: false, error: error.message };
    }
  };
  
  // Handler for deleting service orders
  const handleDeleteOrder = async (orderId) => {
    try {
      const response = await fetch(`/api/service-orders/${orderId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      // Refresh data after successful deletion
      await fetchData();
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting order:', error);
      setError('Failed to delete order: ' + error.message);
      return { success: false, error: error.message };
    }
  };
  
  // Handler for creating new service orders
  const handleCreateOrder = async (orderData) => {
    try {
      const response = await fetch('/api/service-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      // Refresh data after successful creation
      await fetchData();
      
      return { success: true, data: await response.json() };
    } catch (error) {
      console.error('Error creating order:', error);
      setError('Failed to create order: ' + error.message);
      return { success: false, error: error.message };
    }
  };
  
  // Main loading indicator for initial data load
  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-royalBlue text-xl font-semibold animate-pulse">
          Loading dashboard data...
        </div>
      </div>
    );
  }
  
  // Error state display
  if (error && !data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-50 p-6 rounded-lg shadow-md max-w-md">
          <h2 className="text-red-700 text-xl font-bold mb-3">Error Loading Dashboard</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchData} 
            className="bg-royalBlue text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6" style={{ maxWidth: '1780px', margin: '0 auto' }}>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-royalBlue text-white p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold">Order Concierge Dashboard</h1>
          <p className="text-sm text-blue-100 mt-1">
            Master Service Agreements and Service Orders Overview
          </p>
        </div>
        
        <div className="p-4">
          <ModelDashboard
            title="Order Concierge Dashboard"
            data={data}
            entityType="msa"
            loading={loading}
            error={error}
            onUpdateOrder={handleUpdateOrder}
            onDeleteOrder={handleDeleteOrder}
            onCreateOrder={handleCreateOrder}
            onRefreshData={fetchData}
          />
        </div>
      </div>
      
      <div className="mt-6 text-sm text-gray-500 text-center">
        <p>Data last updated: {data ? new Date(data.lastUpdated || Date.now()).toLocaleString() : 'Unknown'}</p>
      </div>
    </div>
  );
};

export default CypressDashboard;
