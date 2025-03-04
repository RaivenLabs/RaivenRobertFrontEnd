import React, { useState } from 'react';

const ProviderDetails = ({
  provider,
  onUpdateProvider,
  onDeleteProvider,
  onUploadArtifact
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [uploading, setUploading] = useState(false);
  
  // Handle file upload
  const handleFileUpload = async (artifactType, e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      setUploading(true);
      const result = await onUploadArtifact(provider.id, artifactType, file);
      if (result.success) {
        alert(`${artifactType} uploaded successfully`);
      }
    } catch (error) {
      console.error(`Error uploading ${artifactType}:`, error);
      alert(`Failed to upload ${artifactType}: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  // Handle provider status change
  const handleStatusChange = async (newStatus) => {
    if (window.confirm(`Are you sure you want to change the status to ${newStatus}?`)) {
      await onUpdateProvider(provider.id, { status: newStatus });
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs for different sections */}
      <div className="flex border-b border-gray-200">
        <button 
          className={`py-2 px-4 font-medium ${activeTab === 'overview' ? 'text-royalBlue border-b-2 border-royalBlue' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`py-2 px-4 font-medium ${activeTab === 'agreements' ? 'text-royalBlue border-b-2 border-royalBlue' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('agreements')}
        >
          Agreements & Artifacts
        </button>
        <button 
          className={`py-2 px-4 font-medium ${activeTab === 'orders' ? 'text-royalBlue border-b-2 border-royalBlue' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('orders')}
        >
          Service Orders
        </button>
        <button 
          className={`py-2 px-4 font-medium ${activeTab === 'analytics' ? 'text-royalBlue border-b-2 border-royalBlue' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('analytics')}
        >
          Spend Analytics
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Provider Info */}
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-bold text-gray-800 mb-3">Provider Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Provider Name:</span>
                  <span className="font-medium">{provider.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Provider ID:</span>
                  <span className="font-medium">{provider.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Category:</span>
                  <span className="font-medium">{provider.category || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Preferred Status:</span>
                  <span className="font-medium">{provider.preferredStatus ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Website:</span>
                  <a href={provider.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {provider.website || 'N/A'}
                  </a>
                </div>
              </div>
            </div>

            {/* Contract Info */}
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-bold text-gray-800 mb-3">Contract Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">MSA Reference:</span>
                  <span className="font-medium">{provider.msaReference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Agreement Type:</span>
                  <span className="font-medium">{provider.agreementType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Effective Date:</span>
                  <span className="font-medium">{provider.effectiveDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Term End Date:</span>
                  <span className="font-medium">{provider.termEndDate || 'Evergreen'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Auto-Renewal:</span>
                  <span className="font-medium">{provider.autoRenewal ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>

            {/* Activity Summary */}
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-bold text-gray-800 mb-3">Activity Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className={`px-2 py-1 rounded text-white text-xs ${provider.status === 'Active' ? 'bg-green-600' : provider.status === 'Pending' ? 'bg-yellow-500' : 'bg-gray-500'}`}>
                    {provider.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Active Orders:</span>
                  <span className="font-medium">{provider.activeOrders || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Spend YTD:</span>
                  <span className="font-medium">${provider.spendYTD ? provider.spendYTD.toLocaleString() : '0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Activity:</span>
                  <span className="font-medium">{provider.lastActivity || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Updated:</span>
                  <span className="font-medium">{provider.lastUpdated || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-6 bg-white p-4 rounded shadow">
            <h3 className="font-bold text-gray-800 mb-3">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {provider.contacts ? (
                provider.contacts.map((contact, index) => (
                  <div key={index} className="p-3 border border-gray-200 rounded">
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-gray-600">{contact.role}</p>
                    <p className="text-sm text-gray-600">{contact.email}</p>
                    <p className="text-sm text-gray-600">{contact.phone}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No contacts available</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Agreements & Artifacts Tab */}
      {activeTab === 'agreements' && (
        <div>
          <div className="bg-white p-4 rounded shadow mb-6">
            <h3 className="font-bold text-gray-800 mb-3">Agreement Documents & Artifacts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* MSA Document */}
              <div className="p-3 border border-gray-200 rounded">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Master Service Agreement</p>
                    <p className="text-sm text-gray-600">
                      {provider.msaDocument ? `Uploaded on ${provider.msaDocument.uploadDate}` : 'Not uploaded'}
                    </p>
                  </div>
                  {provider.msaDocument ? (
                    <div className="flex space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => window.open(provider.msaDocument.url, '_blank')}
                      >
                        View
                      </button>
                      <label className="text-green-600 hover:text-green-800 cursor-pointer">
                        Update
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={(e) => handleFileUpload('MSA', e)}
                          accept=".pdf,.docx"
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="bg-royalBlue text-white px-3 py-1 rounded text-sm hover:bg-blue-700 cursor-pointer">
                      Upload MSA
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => handleFileUpload('MSA', e)}
                        accept=".pdf,.docx"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Rate Card */}
              <div className="p-3 border border-gray-200 rounded">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Rate Card</p>
                    <p className="text-sm text-gray-600">
                      {provider.rateCardDocument ? `Uploaded on ${provider.rateCardDocument.uploadDate}` : 'Not uploaded'}
                    </p>
                  </div>
                  {provider.rateCardDocument ? (
                    <div className="flex space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => window.open(provider.rateCardDocument.url, '_blank')}
                      >
                        View
                      </button>
                      <label className="text-green-600 hover:text-green-800 cursor-pointer">
                        Update
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={(e) => handleFileUpload('RateCard', e)}
                          accept=".pdf,.xlsx,.csv"
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="bg-royalBlue text-white px-3 py-1 rounded text-sm hover:bg-blue-700 cursor-pointer">
                      Upload Rate Card
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => handleFileUpload('RateCard', e)}
                        accept=".pdf,.xlsx,.csv"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Order Template */}
              <div className="p-3 border border-gray-200 rounded">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Order Template</p>
                    <p className="text-sm text-gray-600">
                      {provider.orderTemplateDocument ? `Uploaded on ${provider.orderTemplateDocument.uploadDate}` : 'Not uploaded'}
                    </p>
                  </div>
                  {provider.orderTemplateDocument ? (
                    <div className="flex space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => window.open(provider.orderTemplateDocument.url, '_blank')}
                      >
                        View
                      </button>
                      <label className="text-green-600 hover:text-green-800 cursor-pointer">
                        Update
                        <input 
                          type="file" 
                          className="hidden" 
                          onChange={(e) => handleFileUpload('OrderTemplate', e)}
                          accept=".pdf,.docx"
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="bg-royalBlue text-white px-3 py-1 rounded text-sm hover:bg-blue-700 cursor-pointer">
                      Upload Template
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => handleFileUpload('OrderTemplate', e)}
                        accept=".pdf,.docx"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Amendments */}
              <div className="p-3 border border-gray-200 rounded">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Amendments</p>
                    <p className="text-sm text-gray-600">
                      {provider.amendments && provider.amendments.length > 0 
                        ? `${provider.amendments.length} amendment(s) uploaded` 
                        : 'No amendments uploaded'}
                    </p>
                  </div>
                  <label className="bg-royalBlue text-white px-3 py-1 rounded text-sm hover:bg-blue-700 cursor-pointer">
                    Add Amendment
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={(e) => handleFileUpload('Amendment', e)}
                      accept=".pdf,.docx"
                    />
                  </label>
                </div>
                {provider.amendments && provider.amendments.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium mb-1">Uploaded Amendments:</p>
                    <ul className="text-sm">
                      {provider.amendments.map((amendment, idx) => (
                        <li key={idx} className="flex justify-between mt-1">
                          <span>{amendment.name}</span>
                          <button 
                            className="text-blue-600 hover:text-blue-800 text-xs"
                            onClick={() => window.open(amendment.url, '_blank')}
                          >
                            View
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Artifact Verification Status */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold text-gray-800 mb-3">Provider Documentation Status</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full mr-2 ${provider.msaDocument ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="flex-grow">Master Service Agreement</span>
                <span className="text-sm font-medium">{provider.msaDocument ? 'Verified' : 'Missing'}</span>
              </div>
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full mr-2 ${provider.rateCardDocument ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="flex-grow">Rate Card</span>
                <span className="text-sm font-medium">{provider.rateCardDocument ? 'Verified' : 'Missing'}</span>
              </div>
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full mr-2 ${provider.orderTemplateDocument ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <span className="flex-grow">Order Template</span>
                <span className="text-sm font-medium">{provider.orderTemplateDocument ? 'Verified' : 'Optional'}</span>
              </div>
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full mr-2 ${provider.amendments && provider.amendments.length > 0 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <span className="flex-grow">Amendments</span>
                <span className="text-sm font-medium">{provider.amendments && provider.amendments.length > 0 ? 'Available' : 'Optional'}</span>
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-200">
                <p className="font-medium text-gray-700">Provider Readiness Status:</p>
                {provider.msaDocument && provider.rateCardDocument ? (
                  <div className="mt-2 flex items-center">
                    <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-green-700 font-medium">Complete - Ready for use</span>
                  </div>
                ) : (
                  <div className="mt-2 flex items-center">
                    <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                    <span className="text-yellow-700 font-medium">Incomplete - Missing required documents</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Service Orders Tab */}
      {activeTab === 'orders' && (
        <div>
          <div className="bg-white p-4 rounded shadow mb-6">
            <h3 className="font-bold text-gray-800 mb-3">Service Orders</h3>
            {provider.serviceOrders && provider.serviceOrders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {provider.serviceOrders.map((order, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-2">{order.id}</td>
                        <td className="px-4 py-2 font-medium">{order.name}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded-full text-white text-xs ${
                            order.status === 'Active' ? 'bg-green-600' : 
                            order.status === 'Completed' ? 'bg-gray-500' : 
                            order.status === 'On Hold' ? 'bg-orange-500' : 'bg-blue-500'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-2">{order.startDate}</td>
                        <td className="px-4 py-2">{order.endDate}</td>
                        <td className="px-4 py-2">{order.value}</td>
                        <td className="px-4 py-2">
                          <button className="text-blue-600 hover:text-blue-800">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No service orders available for this provider</p>
            )}
          </div>

          {/* Order Summary Analytics */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold text-gray-800 mb-3">Order Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 border border-gray-200 rounded">
                <p className="text-sm text-gray-500">Total Active Orders</p>
                <p className="text-2xl font-bold text-royalBlue">
                  {provider.serviceOrders ? provider.serviceOrders.filter(o => o.status === 'Active').length : 0}
                </p>
              </div>
              <div className="p-3 border border-gray-200 rounded">
                <p className="text-sm text-gray-500">Total Order Value</p>
                <p className="text-2xl font-bold text-royalBlue">
                  ${provider.serviceOrders ? 
                    provider.serviceOrders.reduce((sum, order) => sum + parseInt(order.value.replace(/[^0-9.-]+/g, ""), 10), 0).toLocaleString() : 
                    '0'}
                </p>
              </div>
              <div className="p-3 border border-gray-200 rounded">
                <p className="text-sm text-gray-500">Average Order Duration</p>
                <p className="text-2xl font-bold text-royalBlue">
                  {provider.averageOrderDuration || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spend Analytics Tab */}
      {activeTab === 'analytics' && (
        <div>
          <div className="bg-white p-4 rounded shadow mb-6">
            <h3 className="font-bold text-gray-800 mb-3">Spend Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 border border-gray-200 rounded">
                <p className="text-sm text-gray-500">Total Spend YTD</p>
                <p className="text-2xl font-bold text-royalBlue">
                  ${provider.spendYTD ? provider.spendYTD.toLocaleString() : '0'}
                </p>
                <p className="text-xs text-green-600 mt-2">
                  {provider.spendYTDDelta && provider.spendYTDDelta > 0 ? 
                    `+${provider.spendYTDDelta}% from previous year` : 
                    provider.spendYTDDelta ? 
                      `${provider.spendYTDDelta}% from previous year` : 
                      'No historical data'}
                </p>
              </div>
              <div className="p-3 border border-gray-200 rounded">
                <p className="text-sm text-gray-500">Average Monthly Spend</p>
                <p className="text-2xl font-bold text-royalBlue">
                  ${provider.avgMonthlySpend ? provider.avgMonthlySpend.toLocaleString() : '0'}
                </p>
              </div>
              <div className="p-3 border border-gray-200 rounded">
                <p className="text-sm text-gray-500">Projected Annual Spend</p>
                <p className="text-2xl font-bold text-royalBlue">
                  ${provider.projectedAnnualSpend ? provider.projectedAnnualSpend.toLocaleString() : '0'}
                </p>
              </div>
            </div>
          </div>

          {/* Spend Charts placeholder */}
          <div className="bg-white p-4 rounded shadow mb-6">
            <h3 className="font-bold text-gray-800 mb-3">Spend Trend</h3>
            <div className="bg-gray-100 rounded h-64 flex items-center justify-center">
              <p className="text-gray-500">Spend trend visualization would appear here</p>
            </div>
          </div>

          {/* Spend by Category */}
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold text-gray-800 mb-3">Spend by Resource Category</h3>
            {provider.spendByCategory ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource Category</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spend Amount</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% of Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {provider.spendByCategory.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium">{item.category}</td>
                        <td className="px-4 py-2">${item.amount.toLocaleString()}</td>
                        <td className="px-4 py-2">{item.percentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No category data available</p>
            )}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex justify-end gap-3 mt-6">
        <div className="dropdown inline-block relative">
          <button 
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-100 inline-flex items-center"
          >
            <span className="mr-1">Change Status</span>
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </button>
          <ul className="dropdown-menu absolute hidden text-gray-700 pt-1 right-0 w-48 z-10">
            {provider.status !== 'Active' && (
              <li>
                <button 
                  className="bg-white hover:bg-gray-100 py-2 px-4 block whitespace-no-wrap w-full text-left"
                  onClick={() => handleStatusChange('Active')}
                >
                  Set Active
                </button>
              </li>
            )}
            {provider.status !== 'Pending' && (
              <li>
                <button 
                  className="bg-white hover:bg-gray-100 py-2 px-4 block whitespace-no-wrap w-full text-left"
                  onClick={() => handleStatusChange('Pending')}
                >
                  Set Pending
                </button>
              </li>
            )}
            {provider.status !== 'Inactive' && (
              <li>
                <button 
                  className="bg-white hover:bg-gray-100 py-2 px-4 block whitespace-no-wrap w-full text-left"
                  onClick={() => handleStatusChange('Inactive')}
                >
                  Set Inactive
                </button>
              </li>
            )}
          </ul>
        </div>
        <button 
          onClick={() => onDeleteProvider(provider.id)}
          className="border border-red-300 text-red-700 px-4 py-2 rounded hover:bg-red-100"
        >
          Delete Provider
        </button>
        <button 
          className="bg-royalBlue text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => {
            // Navigate to full provider details page or open edit modal
            alert(`View full details for ${provider.id}`);
          }}
        >
          Edit Provider
        </button>
      </div>

      {/* CSS for dropdown menu */}
      <style jsx>{`
        .dropdown:hover .dropdown-menu {
          display: block;
        }
        .dropdown-menu {
          background-color: white;
          border: 1px solid #e2e8f0;
          border-radius: 0.25rem;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default ProviderDetails;
