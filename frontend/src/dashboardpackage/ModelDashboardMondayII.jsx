import React, { useState } from 'react';

const ModelDashboard = ({ projectId, projectName, projectType }) => {
  const [activeOrder, setActiveOrder] = useState(null);
  const [activeTab, setActiveTab] = useState('orders');
  
  // Sample service order data for Nimitz with provider Midway
  const serviceOrders = [
    {
      id: 'SO-2025-42',
      orderName: 'Supply Chain Analytics Platform',
      provider: 'Midway Consulting',
      master: 'MSA-NIMITZ-MIDWAY-2023',
      status: 'Active',
      startDate: 'Jan 15, 2025',
      endDate: 'Jul 15, 2025',
      orderValue: '$245,000',
      fiscalYear: 'FY25',
      completionScore: '25%',
      resources: [
        { role: 'Technical Lead', quantity: 1, rate: '$175/hr', utilization: '100%' },
        { role: 'Senior Developer', quantity: 2, rate: '$150/hr', utilization: '100%' },
        { role: 'Data Scientist', quantity: 1, rate: '$165/hr', utilization: '75%' },
        { role: 'Project Manager', quantity: 1, rate: '$160/hr', utilization: '50%' }
      ],
      dimensions: [
        { name: 'Resource Allocation', progress: 90, color: '#48bb78' },
        { name: 'Budget Utilization', progress: 30, color: '#4299e1' },
        { name: 'Timeline Progress', progress: 22, color: '#f56565' },
        { name: 'Deliverables', progress: 20, color: '#f56565' }
      ]
    },
    {
      id: 'SO-2025-41',
      orderName: 'E-commerce Platform Optimization',
      provider: 'Midway Consulting',
      master: 'MSA-NIMITZ-MIDWAY-2023',
      status: 'Active',
      startDate: 'Feb 1, 2025',
      endDate: 'May 31, 2025',
      orderValue: '$178,500',
      fiscalYear: 'FY25',
      completionScore: '40%',
      resources: [
        { role: 'UX Designer', quantity: 1, rate: '$155/hr', utilization: '100%' },
        { role: 'Senior Developer', quantity: 1, rate: '$150/hr', utilization: '100%' },
        { role: 'Frontend Developer', quantity: 1, rate: '$135/hr', utilization: '100%' }
      ]
    },
    {
      id: 'SO-2025-38',
      orderName: 'Data Migration & Integration',
      provider: 'Apex Systems',
      master: 'MSA-NIMITZ-APEX-2023',
      status: 'Pending Approval',
      startDate: 'Mar 15, 2025',
      endDate: 'Jun 30, 2025',
      orderValue: '$215,000',
      fiscalYear: 'FY25',
      completionScore: '0%',
      resources: [
        { role: 'Solution Architect', quantity: 1, rate: '$185/hr', utilization: '75%' },
        { role: 'Data Engineer', quantity: 2, rate: '$160/hr', utilization: '100%' },
        { role: 'QA Specialist', quantity: 1, rate: '$125/hr', utilization: '50%' }
      ]
    },
    {
      id: 'SO-2025-35',
      orderName: 'Digital Marketing Automation',
      provider: 'Technica Solutions',
      master: 'MSA-NIMITZ-TECHNICA-2023',
      status: 'Planning',
      startDate: 'Apr 1, 2025',
      endDate: 'Sep 30, 2025',
      orderValue: '$320,000',
      fiscalYear: 'FY25-26',
      completionScore: '10%',
      resources: [
        { role: 'Marketing Tech Lead', quantity: 1, rate: '$170/hr', utilization: '100%' },
        { role: 'Developer', quantity: 2, rate: '$140/hr', utilization: '100%' },
        { role: 'Content Specialist', quantity: 1, rate: '$130/hr', utilization: '75%' },
        { role: 'Project Manager', quantity: 1, rate: '$160/hr', utilization: '50%' }
      ]
    },
    {
      id: 'SO-2025-32',
      orderName: 'Business Intelligence Dashboard',
      provider: 'Midway Consulting',
      master: 'MSA-NIMITZ-MIDWAY-2023',
      status: 'Active',
      startDate: 'Jan 10, 2025',
      endDate: 'Apr 30, 2025',
      orderValue: '$145,000',
      fiscalYear: 'FY25',
      completionScore: '65%',
      resources: [
        { role: 'BI Specialist', quantity: 1, rate: '$165/hr', utilization: '100%' },
        { role: 'Data Analyst', quantity: 1, rate: '$145/hr', utilization: '100%' }
      ]
    },
    {
      id: 'SO-2025-28',
      orderName: 'Mobile App Development',
      provider: 'Apex Systems',
      master: 'MSA-NIMITZ-APEX-2023',
      status: 'On Hold',
      startDate: 'Mar 1, 2025',
      endDate: 'Aug 31, 2025',
      orderValue: '$275,000',
      fiscalYear: 'FY25-26',
      completionScore: '15%',
      resources: [
        { role: 'Mobile Lead Developer', quantity: 1, rate: '$175/hr', utilization: '100%' },
        { role: 'iOS Developer', quantity: 1, rate: '$160/hr', utilization: '100%' },
        { role: 'Android Developer', quantity: 1, rate: '$160/hr', utilization: '100%' },
        { role: 'QA Specialist', quantity: 1, rate: '$125/hr', utilization: '75%' }
      ]
    }
  ];

  // Calculate summary metrics
  const totalActiveOrders = serviceOrders.filter(o => o.status === 'Active').length;
  const totalOrderValue = serviceOrders.reduce((sum, order) => {
    return sum + parseInt(order.orderValue.replace(/[^0-9.-]+/g, ""));
  }, 0);
  
  // Calculate spend by provider
  const spendByProvider = serviceOrders.reduce((acc, order) => {
    const provider = order.provider;
    const value = parseInt(order.orderValue.replace(/[^0-9.-]+/g, ""));
    acc[provider] = (acc[provider] || 0) + value;
    return acc;
  }, {});
  
  // Calculate spend by fiscal year
  const spendByFY = serviceOrders.reduce((acc, order) => {
    const fy = order.fiscalYear;
    const value = parseInt(order.orderValue.replace(/[^0-9.-]+/g, ""));
    acc[fy] = (acc[fy] || 0) + value;
    return acc;
  }, {});

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

  const getScoreBadgeColor = (score) => {
    const numericScore = parseInt(score);
    if (numericScore >= 80) return 'bg-green-500';
    if (numericScore >= 60) return 'bg-green-600';
    if (numericScore >= 40) return 'bg-orange-500';
    if (numericScore >= 20) return 'bg-orange-600';
    return 'bg-red-500';
  };

  const toggleOrder = (id) => {
    if (activeOrder === id) {
      setActiveOrder(null);
    } else {
      setActiveOrder(id);
    }
  };

  return (
    <div className="bg-gray-100 rounded-lg shadow-md">
      {/* Dashboard Header */}
      <div className="bg-royalBlue text-white p-4 rounded-t-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">SERVICE ORDER MANAGEMENT</h1>
          <span className="text-lg">Mar 03, 2025</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Active Service Orders</p>
          <p className="text-2xl font-bold text-royalBlue">{totalActiveOrders}</p>
          <p className="text-xs text-gray-500 mt-2">Out of {serviceOrders.length} total orders</p>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Total Portfolio Value</p>
          <p className="text-2xl font-bold text-royalBlue">${totalOrderValue.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-2">Across all active and planned orders</p>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">FY25 Spend</p>
          <p className="text-2xl font-bold text-royalBlue">${(spendByFY['FY25'] || 0).toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-2">Jun 2024 - May 2025</p>
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

      {/* Search and Filter Panel */}
      <div className="bg-gray-50 p-4 border-b border-gray-200">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="w-64">
            <input 
              type="text" 
              placeholder="Search service orders..." 
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="w-36">
            <select className="w-full p-2 border border-gray-300 rounded">
              <option>Provider ▼</option>
              <option>Midway Consulting</option>
              <option>Apex Systems</option>
              <option>Technica Solutions</option>
            </select>
          </div>
          <div className="w-36">
            <select className="w-full p-2 border border-gray-300 rounded">
              <option>Status ▼</option>
              <option>Active</option>
              <option>Pending Approval</option>
              <option>Planning</option>
              <option>On Hold</option>
              <option>Completed</option>
            </select>
          </div>
          <div className="w-36">
            <select className="w-full p-2 border border-gray-300 rounded">
              <option>Resource Role ▼</option>
              <option>Technical Lead</option>
              <option>Senior Developer</option>
              <option>Project Manager</option>
              <option>Data Scientist</option>
            </select>
          </div>
          <div className="w-36">
            <select className="w-full p-2 border border-gray-300 rounded">
              <option>Fiscal Year ▼</option>
              <option>FY25</option>
              <option>FY26</option>
              <option>Cross-FY</option>
            </select>
          </div>
          <button className="bg-royalBlue text-white px-4 py-2 rounded hover:bg-blue-700">
            Apply Filters
          </button>
        </div>
      </div>

      {/* Table Header */}
      <div className="bg-gray-50 p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-royalBlue">
            Active Service Orders
          </h2>
          <button className="bg-royalBlue text-white px-4 py-2 rounded hover:bg-blue-700">
            + New Service Order
          </button>
        </div>
      </div>

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
            {serviceOrders.map((order, index) => (
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
                        {order.resources && (
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
                          <button className="border border-gray-300 text-gray-700 px-4 py-1 rounded hover:bg-gray-100">Modify Order</button>
                          <button className="border border-gray-300 text-gray-700 px-4 py-1 rounded hover:bg-gray-100">Request Change</button>
                          <button className="bg-royalBlue text-white px-4 py-1 rounded hover:bg-blue-700">View Details</button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-between items-center rounded-b-lg">
        <div>Showing 1-6 of {serviceOrders.length} service orders</div>
        <div className="flex">
          <button className="bg-gray-100 border border-gray-300 px-3 py-1 rounded-md mr-2 hover:bg-gray-200">1</button>
          <button className="bg-white border border-gray-300 px-3 py-1 rounded-md mr-2 hover:bg-gray-200">2</button>
          <button className="bg-white border border-gray-300 px-3 py-1 rounded-md mr-2 hover:bg-gray-200">3</button>
          <button className="bg-white border border-gray-300 px-3 py-1 rounded-md mr-2 hover:bg-gray-200">...</button>
          <button className="bg-white border border-gray-300 px-4 py-1 rounded-md hover:bg-gray-200">Next →</button>
        </div>
      </div>
    </div>
  );
};

export default ModelDashboard;
