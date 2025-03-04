import React from 'react';

const OrderReviewStep = ({ orderData }) => {
  // Format currency amount
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  // Calculate the total duration of the order (for display)
  const calculateTotalDuration = () => {
    if (orderData.roles.length === 0) return '0 days';
    
    // Find earliest start date and latest end date
    const startDates = orderData.roles.map(role => new Date(role.startDate));
    const endDates = orderData.roles.map(role => new Date(role.endDate));
    
    const earliestStart = new Date(Math.min(...startDates));
    const latestEnd = new Date(Math.max(...endDates));
    
    const diffTime = Math.abs(latestEnd - earliestStart);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return `${diffDays} days`;
  };
  
  // Calculate total spend by role
  const calculateRoleTotals = () => {
    return orderData.roles.map(role => {
      const duration = calculateDuration(role.startDate, role.endDate);
      const subtotal = role.rate * duration * 8; // 8 hours/day
      const variance = role.standardRate ? (role.standardRate - role.rate) * duration * 8 : 0;
      
      return {
        ...role,
        duration,
        subtotal,
        variance
      };
    });
  };
  
  // Calculate duration in days between two dates
  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Check for missing required information
  const checkForMissingInfo = () => {
    const missingItems = [];
    
    if (!orderData.providerId) missingItems.push('Provider selection');
    if (orderData.roles.length === 0) missingItems.push('Role selection');
    if (!orderData.scopeOfServices || orderData.scopeOfServices.trim() === '') 
      missingItems.push('Scope of services');
    if (orderData.deliverables.length === 0) missingItems.push('Deliverables');
    
    return missingItems;
  };
  
  const missingInfo = checkForMissingInfo();
  const roleTotals = calculateRoleTotals();
  const totalVariance = roleTotals.reduce((sum, role) => sum + role.variance, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Review Order Details</h2>
        <p className="text-gray-600">
          Review the details of your service order before submitting. Make any necessary changes by going back to previous steps.
        </p>
      </div>
      
      {missingInfo.length > 0 ? (
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="font-medium text-yellow-800 mb-2">Missing Information</h3>
          <p className="text-yellow-700 mb-2">
            Please complete the following required information before submitting the order:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-yellow-700">
            {missingInfo.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-green-700 font-medium">
              All required information has been provided
            </span>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Summary */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-4">Order Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Provider:</span>
              <span className="font-medium">{orderData.providerName || 'Not selected'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Master Agreement:</span>
              <span className="font-medium">{orderData.masterAgreement || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-bold">{formatCurrency(orderData.totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Rate Card Variance:</span>
              <span className={`font-bold ${totalVariance > 0 ? 'text-green-600' : totalVariance < 0 ? 'text-red-600' : 'text-gray-800'}`}>
                {totalVariance > 0 ? '+' : ''}{formatCurrency(totalVariance)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Duration:</span>
              <span className="font-medium">{calculateTotalDuration()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Roles:</span>
              <span className="font-medium">{orderData.roles.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Deliverables:</span>
              <span className="font-medium">{orderData.deliverables.length}</span>
            </div>
          </div>
        </div>
        
        {/* Timeline */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-4">Timeline</h3>
          {orderData.roles.length > 0 ? (
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Project Start:</span>
                <span className="font-medium">
                  {new Date(Math.min(...orderData.roles.map(role => new Date(role.startDate)))).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Project End:</span>
                <span className="font-medium">
                  {new Date(Math.max(...orderData.roles.map(role => new Date(role.endDate)))).toLocaleDateString()}
                </span>
              </div>
              
              <div className="pt-4">
                <h4 className="font-medium text-gray-700 mb-2">Role Timeline</h4>
                <div className="relative pt-6 pb-2">
                  {roleTotals.map((role, index) => {
                    // Calculate relative position and width based on earliest and latest dates
                    const allStartDates = roleTotals.map(r => new Date(r.startDate));
                    const allEndDates = roleTotals.map(r => new Date(r.endDate));
                    const earliestDate = new Date(Math.min(...allStartDates));
                    const latestDate = new Date(Math.max(...allEndDates));
                    const totalDuration = (latestDate - earliestDate) / (1000 * 60 * 60 * 24);
                    
                    if (totalDuration === 0) return null; // Avoid division by zero
                    
                    const startOffset = (new Date(role.startDate) - earliestDate) / (1000 * 60 * 60 * 24);
                    const startPercent = (startOffset / totalDuration) * 100;
                    const widthPercent = (role.duration / totalDuration) * 100;
                    
                    return (
                      <div key={index} className="mb-2">
                        <div className="text-xs text-gray-500 mb-1">{role.roleName}</div>
                        <div className="h-6 bg-gray-200 rounded relative">
                          <div 
                            className="absolute h-6 bg-royalBlue rounded"
                            style={{ 
                              left: `${startPercent}%`, 
                              width: `${widthPercent}%`,
                              backgroundColor: getColorForIndex(index)
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Timeline labels */}
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>
                      {orderData.roles.length > 0 
                        ? new Date(Math.min(...orderData.roles.map(role => new Date(role.startDate)))).toLocaleDateString()
                        : 'N/A'}
                    </span>
                    <span>
                      {orderData.roles.length > 0
                        ? new Date(Math.max(...orderData.roles.map(role => new Date(role.endDate)))).toLocaleDateString()
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No roles have been added yet.</p>
          )}
        </div>
      </div>
      
      {/* Roles Table */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="font-bold text-gray-800 mb-4">Roles and Rates</h3>
        {orderData.roles.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                  <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                  <th className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {roleTotals.map((role, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="py-2 px-4">
                      <div className="font-medium text-gray-800">{role.roleName}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(role.startDate).toLocaleDateString()} - {new Date(role.endDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-2 px-4">${role.rate}/hour</td>
                    <td className="py-2 px-4">{role.duration} days</td>
                    <td className="py-2 px-4">{formatCurrency(role.subtotal)}</td>
                    <td className="py-2 px-4">
                      <span className={role.variance > 0 ? 'text-green-600' : role.variance < 0 ? 'text-red-600' : 'text-gray-600'}>
                        {role.variance > 0 ? '+' : ''}{formatCurrency(role.variance)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 font-medium">
                <tr>
                  <td colSpan="3" className="py-2 px-4 text-right">Total:</td>
                  <td className="py-2 px-4">{formatCurrency(orderData.totalAmount)}</td>
                  <td className="py-2 px-4">
                    <span className={totalVariance > 0 ? 'text-green-600' : totalVariance < 0 ? 'text-red-600' : 'text-gray-600'}>
                      {totalVariance > 0 ? '+' : ''}{formatCurrency(totalVariance)}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No roles have been added yet.</p>
        )}
      </div>
      
      {/* Scope and Deliverables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-4">Scope of Services</h3>
          {orderData.scopeOfServices ? (
            <div className="whitespace-pre-line text-gray-700">{orderData.scopeOfServices}</div>
          ) : (
            <p className="text-gray-500">No scope of services has been defined yet.</p>
          )}
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-4">Deliverables</h3>
          {orderData.deliverables.length > 0 ? (
            <div className="space-y-3">
              {orderData.deliverables.map((deliverable, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-800">{deliverable.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{deliverable.description}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      Due: {new Date(deliverable.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No deliverables have been added yet.</p>
          )}
        </div>
      </div>
      
      {/* Disclaimer and Notes */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-800 mb-2">Ready to Create Order</h3>
        <p className="text-blue-700 mb-2">
          Clicking "Create Order" will generate a new service order based on the information provided. You will have an opportunity to review the final document before sending it to the client.
        </p>
        <ul className="list-disc pl-5 space-y-1 text-sm text-blue-700">
          <li>The order will be created with the status "Pending Approval"</li>
          <li>You will be able to review and send the order on the next screen</li>
          <li>Once sent, the order will be emailed to selected recipients</li>
        </ul>
      </div>
    </div>
  );
};

// Helper function to generate colors for the timeline bars
const getColorForIndex = (index) => {
  const colors = [
    '#4299e1', // blue
    '#48bb78', // green
    '#ed8936', // orange
    '#9f7aea', // purple
    '#f56565', // red
    '#38b2ac', // teal
    '#ecc94b'  // yellow
  ];
  
  return colors[index % colors.length];
};

export default OrderReviewStep;
