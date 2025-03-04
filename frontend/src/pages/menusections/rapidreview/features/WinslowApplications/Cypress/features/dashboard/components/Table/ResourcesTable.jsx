import React from 'react';
import PropTypes from 'prop-types';
import { formatCurrency } from '../../utils/formatters';

/**
 * ResourcesTable displays the resources allocated to a service order
 */
const ResourcesTable = ({ resources }) => {
  // Calculate monthly cost based on rate, quantity, and utilization
  const calculateMonthlyCost = (resource) => {
    const rate = parseInt(resource.rate.replace(/[^0-9.-]+/g, ""));
    const utilization = parseInt(resource.utilization.replace('%', '')) / 100;
    // Assuming 160 hours per month (40 hours/week × 4 weeks)
    const monthlyCost = rate * 160 * resource.quantity * utilization;
    return monthlyCost;
  };

  return (
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
            {resources.map((resource, idx) => {
              const monthlyCost = calculateMonthlyCost(resource);
              
              return (
                <tr key={idx}>
                  <td className="px-4 py-2">{resource.role}</td>
                  <td className="px-4 py-2">{resource.quantity}</td>
                  <td className="px-4 py-2">{resource.rate}</td>
                  <td className="px-4 py-2">{resource.utilization}</td>
                  <td className="px-4 py-2">{formatCurrency(monthlyCost, false)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

ResourcesTable.propTypes = {
  resources: PropTypes.arrayOf(
    PropTypes.shape({
      role: PropTypes.string.isRequired,
      quantity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      rate: PropTypes.string.isRequired,
      utilization: PropTypes.string.isRequired
    })
  ).isRequired
};

export default ResourcesTable;
