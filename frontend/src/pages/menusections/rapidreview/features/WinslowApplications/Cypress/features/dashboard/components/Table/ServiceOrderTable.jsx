import React from 'react';
import OrderDetails from './OrderDetails';

const ServiceOrderTable = ({
  orders,
  activeOrder,
  toggleOrder,
  error,
  onRefreshData,
  handleOrderModification,
  handleOrderDeletion,
  filterValues
}) => {
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

  return (
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
          {orders.length === 0 ? (
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
            orders.map((order, index) => (
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
                      <OrderDetails 
                        order={order}
                        handleOrderModification={handleOrderModification}
                        handleOrderDeletion={handleOrderDeletion}
                      />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceOrderTable;
