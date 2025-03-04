import React from 'react';
import PropTypes from 'prop-types';
import StatusBadge from '../ui/StatusBadge';
import OrderDetails from './OrderDetails';
import { formatCurrency } from '../../utils/formatters';

/**
 * OrderRow component displays a service order row with expandable details
 */
const OrderRow = ({
  order,
  isExpanded,
  isEven,
  onToggle,
  onUpdate,
  onDelete
}) => {
  // Get appropriate badge color for completion score
  const getScoreBadgeColor = (score) => {
    const numericScore = parseInt(score);
    if (numericScore >= 80) return 'bg-green-500';
    if (numericScore >= 60) return 'bg-green-600';
    if (numericScore >= 40) return 'bg-orange-500';
    if (numericScore >= 20) return 'bg-orange-600';
    return 'bg-red-500';
  };

  // Handle view details click - implement navigation in a real app
  const handleViewDetails = (e) => {
    e.stopPropagation();
    alert(`View full details for ${order.id}`);
  };

  // Handle status change
  const handleStatusChange = (e, newStatus) => {
    e.stopPropagation();
    onUpdate(order.id, { status: newStatus });
  };

  // Handle delete request
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(order.id);
  };

  return (
    <React.Fragment>
      {/* Main order row */}
      <tr 
        className={`border-b ${isExpanded ? 'bg-blue-50' : isEven ? 'bg-white' : 'bg-gray-50'} cursor-pointer hover:bg-blue-50`}
        onClick={onToggle}
      >
        <td className="py-3 px-4">{order.id}</td>
        <td className="py-3 px-4 font-medium">{order.orderName}</td>
        <td className="py-3 px-4">{order.provider}</td>
        <td className="py-3 px-4">
          <StatusBadge status={order.status} />
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
      
      {/* Expanded details */}
      {isExpanded && (
        <tr>
          <td colSpan="8" className="py-6 px-6 bg-blue-50 border-b">
            <OrderDetails 
              order={order}
              onSetOnHold={(e) => handleStatusChange(e, 'On Hold')}
              onDelete={handleDelete}
              onViewDetails={handleViewDetails}
            />
          </td>
        </tr>
      )}
    </React.Fragment>
  );
};

OrderRow.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.string.isRequired,
    orderName: PropTypes.string.isRequired,
    provider: PropTypes.string.isRequired,
    master: PropTypes.string,
    status: PropTypes.string.isRequired,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    orderValue: PropTypes.string,
    fiscalYear: PropTypes.string,
    completionScore: PropTypes.string,
    resources: PropTypes.array,
    dimensions: PropTypes.array
  }).isRequired,
  isExpanded: PropTypes.bool,
  isEven: PropTypes.bool,
  onToggle: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

OrderRow.defaultProps = {
  isExpanded: false,
  isEven: false
};

export default OrderRow;
