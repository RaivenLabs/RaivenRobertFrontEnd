import React from 'react';
import PropTypes from 'prop-types';

/**
 * StatusBadge component displays a colored badge for service order statuses
 */
const StatusBadge = ({ status, size = 'default' }) => {
  // Determine background color based on status
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

  // Determine size-based classes
  const getSizeClasses = (size) => {
    switch (size) {
      case 'small':
        return 'px-2 py-0.5 text-xs';
      case 'large':
        return 'px-4 py-1.5 text-sm';
      case 'default':
      default:
        return 'px-3 py-1 text-xs';
    }
  };

  const badgeColor = getStatusBadgeColor(status);
  const sizeClasses = getSizeClasses(size);

  return (
    <span 
      className={`${badgeColor} ${sizeClasses} rounded-full text-white font-medium inline-block`}
    >
      {status}
    </span>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['small', 'default', 'large'])
};

StatusBadge.defaultProps = {
  size: 'default'
};

export default StatusBadge;
