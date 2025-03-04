import React from 'react';

const OrderDetails = ({ 
  order, 
  handleOrderModification, 
  handleOrderDeletion 
}) => {
  return (
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
  );
};

export default OrderDetails;
