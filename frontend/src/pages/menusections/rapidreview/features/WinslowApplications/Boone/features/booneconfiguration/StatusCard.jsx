// src/components/platform/BooneConfiguration/StatusCard.jsx
import React from 'react';

/**
 * StatusCard component displays a card with status information
 * 
 * @param {string} title - The title of the status card
 * @param {string} status - Status value ('active', 'pending', 'inactive', 'error')
 * @param {string} description - Description text
 * @param {Component} icon - Lucide icon component (not a string)
 */
const StatusCard = ({ title, status, description, icon: Icon }) => {
  const statusColors = {
    active: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    inactive: "bg-gray-100 text-gray-800",
    error: "bg-red-100 text-red-800"
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center mb-2">
        <Icon className="w-6 h-6 text-royalBlue mr-3" />
        <h3 className="text-xl font-semibold">{title}</h3>
        <span className={`ml-auto px-2 py-1 text-xs rounded-full ${statusColors[status] || statusColors.inactive}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

export default StatusCard;
