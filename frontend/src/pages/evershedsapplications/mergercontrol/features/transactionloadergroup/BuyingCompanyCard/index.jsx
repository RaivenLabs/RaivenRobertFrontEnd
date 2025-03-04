// src/features/transactionloadergroup/components/BuyingCompanyCard/index.jsx
import React from 'react';
import { Building2 } from 'lucide-react';

// Internal component for metric display
const MetricCard = ({ label, value }) => (
  <div className="bg-gray-50 p-3 rounded">
    <div className="text-sm text-gray-600">{label}</div>
    <div className="text-lg font-semibold text-royalBlue">
      {value || 'N/A'}
    </div>
  </div>
);

export const BuyingCompanyCard = ({ company }) => {
  if (!company) {
    return null;
  }

  const { 
    name,
    icon,
    sector,
    revenue = {},
    locations = {},
    employees = {}
  } = company;

  // Format revenue with proper currency symbol and localization
  const formatRevenue = (value) => {
    if (!value) return 'N/A';
    return value.startsWith('$') ? value : `$${value}`;
  };

  // Format employee count with commas
  const formatEmployeeCount = (count) => {
    if (!count && count !== 0) return 'N/A';
    return count.toLocaleString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {icon ? (
            <span className="text-3xl mr-3">{icon}</span>
          ) : (
            <Building2 className="w-8 h-8 mr-3 text-royalBlue" />
          )}
          <div>
            <h2 className="font-semibold text-xl text-royalBlue">
              {name || 'Company Name Not Available'}
            </h2>
            {sector && (
              <p className="text-sm text-gray-600">{sector}</p>
            )}
          </div>
        </div>
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
          Acquiring Company
        </span>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard 
          label="Global Revenue" 
          value={formatRevenue(revenue.global)} 
        />
        <MetricCard 
          label="Headquarters" 
          value={locations.headquarters} 
        />
        <MetricCard 
          label="Global Employees" 
          value={formatEmployeeCount(employees.global)} 
        />
      </div>
    </div>
  );
};

export default BuyingCompanyCard;
