import React, { useState } from 'react';

const ModelDashboard = ({ projectId, projectName, projectType }) => {
  const [activeTransaction, setActiveTransaction] = useState(null);
  
  // Sample transaction data
  const transactions = [
    {
      id: 'MAT-2025-42',
      target: 'TechNova Inc.',
      acquirer: 'Global Systems Ltd.',
      industry: 'Software/SaaS',
      status: 'Due Diligence',
      timeline: 'Est. close: Q2 2025',
      dealValue: '$250M',
      ddScore: '72%',
      dimensions: [
        { name: 'Financial Due Diligence', progress: 90, color: '#48bb78' },
        { name: 'Technology & IP Due Diligence', progress: 80, color: '#48bb78' },
        { name: 'Customer/Sales Due Diligence', progress: 90, color: '#48bb78' },
        { name: 'Strategic Fit Due Diligence', progress: 85, color: '#48bb78' },
        { name: 'Cybersecurity Due Diligence', progress: 40, color: '#ed8936' },
        { name: 'Legal Due Diligence', progress: 70, color: '#4299e1' },
        { name: 'ESG Due Diligence', progress: 20, color: '#f56565' },
        { name: 'Supply Chain Due Diligence', progress: 0, color: '#718096', notStarted: true }
      ]
    },
    {
      id: 'MAT-2025-41',
      target: 'HealthCare Partners',
      acquirer: 'MedTech Global',
      industry: 'Healthcare/Biotech',
      status: 'Due Diligence',
      timeline: 'Est. close: Q3 2025',
      dealValue: '$430M',
      ddScore: '88%'
    },
    {
      id: 'MAT-2025-38',
      target: 'EnergyWorks Ltd.',
      acquirer: 'GreenPower Co.',
      industry: 'Clean Energy',
      status: 'Regulatory',
      timeline: 'Delay - ETA Q4 2025',
      dealValue: '$1.2B',
      ddScore: '45%'
    },
    {
      id: 'MAT-2025-35',
      target: 'DataSecure Inc.',
      acquirer: 'Fortress Systems',
      industry: 'Cybersecurity',
      status: 'Modeling',
      timeline: 'Est. close: Q2 2025',
      dealValue: '$85M',
      ddScore: '65%'
    },
    {
      id: 'MAT-2025-32',
      target: 'SupplyChain Pro',
      acquirer: 'Logistics Group',
      industry: 'Logistics',
      status: 'Pending',
      timeline: 'Est. close: Q1 2025',
      dealValue: '$320M',
      ddScore: '96%'
    },
    {
      id: 'MAT-2025-28',
      target: 'RetailMaster Co.',
      acquirer: 'Shopify Global',
      industry: 'Retail/E-commerce',
      status: 'Due Diligence',
      timeline: 'Est. close: Q3 2025',
      dealValue: '$175M',
      ddScore: '58%'
    }
  ];

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Due Diligence':
        return 'bg-purple-600';
      case 'Regulatory':
        return 'bg-red-600';
      case 'Modeling':
        return 'bg-blue-500';
      case 'Pending':
        return 'bg-green-600';
      default:
        return 'bg-gray-500';
    }
  };

  const getScoreBadgeColor = (score) => {
    const numericScore = parseInt(score);
    if (numericScore >= 80) return 'bg-green-500';
    if (numericScore >= 60) return 'bg-orange-500';
    if (numericScore >= 40) return 'bg-orange-600';
    return 'bg-red-500';
  };

  const toggleTransaction = (id) => {
    if (activeTransaction === id) {
      setActiveTransaction(null);
    } else {
      setActiveTransaction(id);
    }
  };

  return (
    <div className="bg-gray-100">
      {/* Dashboard Header */}
      <div className="bg-blue-800 text-white p-4 rounded-t-lg shadow">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">{projectType || 'M&A'} TRANSACTION DUE DILIGENCE DASHBOARD</h1>
          <span className="text-lg">Feb 28, 2025</span>
        </div>
      </div>

      {/* Search and Filter Panel */}
      <div className="bg-gray-50 p-4 border-b border-gray-200 flex flex-wrap gap-2 items-center">
        <div className="flex-1 min-w-64">
          <input 
            type="text" 
            placeholder="Search transactions..." 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="sm:w-40">
          <select className="w-full p-2 border border-gray-300 rounded">
            <option>Deal Size ▼</option>
            <option>Under $100M</option>
            <option>$100M - $500M</option>
            <option>$500M - $1B</option>
            <option>Over $1B</option>
          </select>
        </div>
        <div className="sm:w-40">
          <select className="w-full p-2 border border-gray-300 rounded">
            <option>Industry ▼</option>
            <option>Software/SaaS</option>
            <option>Healthcare/Biotech</option>
            <option>Clean Energy</option>
            <option>Cybersecurity</option>
            <option>Logistics</option>
            <option>Retail/E-commerce</option>
          </select>
        </div>
        <div className="sm:w-40">
          <select className="w-full p-2 border border-gray-300 rounded">
            <option>Status ▼</option>
            <option>Due Diligence</option>
            <option>Regulatory</option>
            <option>Modeling</option>
            <option>Pending</option>
          </select>
        </div>
        <button className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-700">
          Apply Filters
        </button>
      </div>

      {/* Table Header */}
      <div className="bg-gray-50 p-4">
        <h2 className="text-lg font-bold text-blue-800">
          Active M&A Transactions (Showing {transactions.length} of 24)
        </h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-blue-800 text-white">
              <th className="py-3 px-4 text-left">Project ID</th>
              <th className="py-3 px-4 text-left">Target</th>
              <th className="py-3 px-4 text-left">Acquirer</th>
              <th className="py-3 px-4 text-left">Industry</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Timeline</th>
              <th className="py-3 px-4 text-left">Deal Value</th>
              <th className="py-3 px-4 text-left">Actions</th>
              <th className="py-3 px-4 text-left">DD Score</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <React.Fragment key={transaction.id}>
                <tr 
                  className={`border-b ${activeTransaction === transaction.id ? 'bg-blue-50' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} cursor-pointer hover:bg-blue-50`}
                  onClick={() => toggleTransaction(transaction.id)}
                >
                  <td className="py-3 px-4">{transaction.id}</td>
                  <td className="py-3 px-4">{transaction.target}</td>
                  <td className="py-3 px-4">{transaction.acquirer}</td>
                  <td className="py-3 px-4">{transaction.industry}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-white text-xs ${getStatusBadgeColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{transaction.timeline}</td>
                  <td className="py-3 px-4">{transaction.dealValue}</td>
                  <td className="py-3 px-4">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded">
                      View
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-white text-xs ${getScoreBadgeColor(transaction.ddScore)}`}>
                      {transaction.ddScore}
                    </span>
                  </td>
                </tr>
                
                {/* Expanded row with dimensions */}
                {activeTransaction === transaction.id && transaction.dimensions && (
                  <tr>
                    <td colSpan="9" className="py-6 px-6 bg-blue-50 border-b">
                      <div>
                        <h3 className="font-bold text-gray-800 mb-4">Due Diligence Status by Dimension</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {transaction.dimensions.map((dimension, idx) => (
                            <div 
                              key={idx} 
                              className="bg-white p-3 rounded border border-gray-200 shadow-sm"
                            >
                              <p className="font-medium text-gray-800 mb-2">{dimension.name}</p>
                              {!dimension.notStarted ? (
                                <>
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
                                </>
                              ) : (
                                <p className="text-sm text-gray-500">Not started - Click to initiate</p>
                              )}
                            </div>
                          ))}
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
      <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-between items-center">
        <div>Showing 1-6 of 24 active transactions</div>
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
