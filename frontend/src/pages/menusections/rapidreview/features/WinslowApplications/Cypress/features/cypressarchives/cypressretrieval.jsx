import React, { useState, useEffect } from 'react';
import OrderPortfolio from './orderportfolio';

// Sample data for development
const sampleData = {
  orders: [
    {
      orderNumber: 'SO-123456-789',
      orderName: 'Cloud Migration Project',
      providerName: 'Infosys Limited',
      providerId: 'PRV-001',
      status: 'Active',
      createdDate: '2024-12-15',
      totalAmount: 156000,
      msaReference: 'MSA-2023-INF-001'
    },
    {
      orderNumber: 'SO-123457-790',
      orderName: 'DevOps Support',
      providerName: 'Infosys Limited',
      providerId: 'PRV-001',
      status: 'Active',
      createdDate: '2025-01-10',
      totalAmount: 85000,
      msaReference: 'MSA-2023-INF-001'
    },
    {
      orderNumber: 'SO-123458-791',
      orderName: 'Data Analytics Initiative',
      providerName: 'Infosys Limited',
      providerId: 'PRV-001',
      status: 'Pending Approval',
      createdDate: '2025-02-05',
      totalAmount: 120000,
      msaReference: 'MSA-2023-INF-001'
    },
    {
      orderNumber: 'SO-123459-792',
      orderName: 'Digital Transformation Strategy',
      providerName: 'Accenture',
      providerId: 'PRV-002',
      status: 'Active',
      createdDate: '2024-11-20',
      totalAmount: 245000,
      msaReference: 'MSA-2023-ACC-002'
    },
    {
      orderNumber: 'SO-123460-793',
      orderName: 'IT Process Optimization',
      providerName: 'Accenture',
      providerId: 'PRV-002',
      status: 'Completed',
      createdDate: '2024-09-12',
      totalAmount: 180000,
      msaReference: 'MSA-2023-ACC-002'
    },
    {
      orderNumber: 'SO-123461-794',
      orderName: 'UI/UX Redesign',
      providerName: 'Technica Solutions',
      providerId: 'PRV-003',
      status: 'Draft',
      createdDate: '2025-02-28',
      totalAmount: 75000,
      msaReference: 'MSA-2024-TEC-001'
    },
    {
      orderNumber: 'SO-123462-795',
      orderName: 'Mobile App Development',
      providerName: 'Technica Solutions',
      providerId: 'PRV-003',
      status: 'Pending Approval',
      createdDate: '2025-02-10',
      totalAmount: 135000,
      msaReference: 'MSA-2024-TEC-001'
    },
    {
      orderNumber: 'SO-123463-796',
      orderName: 'Network Infrastructure Upgrade',
      providerName: 'Infosys Limited',
      providerId: 'PRV-001',
      status: 'Cancelled',
      createdDate: '2024-10-05',
      totalAmount: 220000,
      msaReference: 'MSA-2023-INF-001'
    },
    {
      orderNumber: 'SO-123464-797',
      orderName: 'Business Intelligence Dashboard',
      providerName: 'Accenture',
      providerId: 'PRV-002',
      status: 'On Hold',
      createdDate: '2024-12-18',
      totalAmount: 95000,
      msaReference: 'MSA-2023-ACC-002'
    }
  ]
};

const CypressOrderPortfolio = () => {
  // State management
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  
  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, this would be a fetch call to your API endpoint
        // const response = await fetch('/api/order-portfolio');
        // const result = await response.json();
        
        // For now, use the sample data
        setData(sampleData);
        setError(null);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order portfolio data:', error);
        setError('Failed to load order portfolio data: ' + error.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Handler for viewing order details
  const handleViewOrderDetails = (orderNumber) => {
    console.log(`Viewing details for order: ${orderNumber}`);
    // In a real app, this would navigate to the order details page
    alert(`Viewing details for order: ${orderNumber}`);
  };
  
  // Handler for editing orders
  const handleEditOrder = (orderNumber) => {
    console.log(`Editing order: ${orderNumber}`);
    // In a real app, this would navigate to the order edit page
    alert(`Editing order: ${orderNumber}`);
  };
  
  // Handler for cancelling orders
  const handleCancelOrder = (orderNumber) => {
    console.log(`Cancelling order: ${orderNumber}`);
    // In a real app, this would open a confirmation dialog and then cancel the order
    if (window.confirm(`Are you sure you want to cancel order ${orderNumber}?`)) {
      // Simulate updating the order status
      const updatedOrders = data.orders.map(order => {
        if (order.orderNumber === orderNumber) {
          return { ...order, status: 'Cancelled' };
        }
        return order;
      });
      
      setData({ ...data, orders: updatedOrders });
      alert(`Order ${orderNumber} has been cancelled.`);
    }
  };
  
  // Handle refreshing data
  const handleRefreshData = async () => {
    try {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would be a fetch call to your API endpoint
      // const response = await fetch('/api/order-portfolio');
      // const result = await response.json();
      
      // For now, just refresh with the same sample data
      setData(sampleData);
      setError(null);
      setLoading(false);
    } catch (error) {
      console.error('Error refreshing order portfolio data:', error);
      setError('Failed to refresh order portfolio data: ' + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="p-6" style={{ maxWidth: '1780px', margin: '0 auto' }}>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-royalBlue text-white p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold">Order Bank</h1>
          <p className="text-sm text-blue-100 mt-1">
            View and manage all service orders across providers
          </p>
        </div>
        
        <div className="p-4">
          <OrderPortfolio
            title="Service Order Retrieval"
            data={data}
            loading={loading}
            error={error}
            onViewOrderDetails={handleViewOrderDetails}
            onEditOrder={handleEditOrder}
            onCancelOrder={handleCancelOrder}
            onRefreshData={handleRefreshData}
          />
        </div>
      </div>
      
      <div className="mt-6 text-sm text-gray-500 text-center">
        <p>Data last updated: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};

export default CypressOrderPortfolio;
