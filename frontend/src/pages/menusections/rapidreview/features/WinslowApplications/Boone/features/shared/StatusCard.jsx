import React from 'react';

const StatusCard = ({ title, status, description, icon: Icon }) => {
  // Define status styles
  const statusStyles = {
    active: {
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      statusText: 'Active',
      iconBg: 'bg-green-500'
    },
    pending: {
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      statusText: 'Pending',
      iconBg: 'bg-yellow-500'
    },
    error: {
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      statusText: 'Error',
      iconBg: 'bg-red-500'
    },
    warning: {
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-800',
      statusText: 'Warning',
      iconBg: 'bg-orange-500'
    },
    inactive: {
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
      statusText: 'Inactive',
      iconBg: 'bg-gray-500'
    }
  };

  // Get the current status style or fallback to pending if status not found
  const currentStyle = statusStyles[status] || statusStyles.pending;

  return (
    <div className={`rounded-lg p-4 ${currentStyle.bgColor}`}>
      <div className="flex items-center">
        <div className={`p-2 rounded-full ${currentStyle.iconBg} text-white mr-4`}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-medium text-gray-900">{title}</h3>
            <span className={`text-sm font-medium px-2 py-1 rounded-full ${currentStyle.bgColor} ${currentStyle.textColor}`}>
              {currentStyle.statusText}
            </span>
          </div>
          
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default StatusCard;
