import React from 'react';

const RateCardVarianceCard = ({
  varianceAmount,
  billableHours,
  providerBreakdown = [],
  avgRateCardDiff
}) => {
  // Determine if we have savings or overage
  const isPositiveVariance = varianceAmount >= 0;
  
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center">
            <p className="text-sm text-gray-500 mr-2">Rate Card Variance</p>
            <div className="relative group">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="absolute z-10 hidden group-hover:block bg-gray-800 text-white text-xs rounded p-2 w-48 -left-20 top-5">
                Difference between standard rate card prices and actual billed rates across all service orders.
              </div>
            </div>
          </div>
          
          {/* Dynamic display based on whether it's savings or overage */}
          {isPositiveVariance ? (
            <p className="text-2xl font-bold text-green-600">${varianceAmount.toLocaleString()}</p>
          ) : (
            <p className="text-2xl font-bold text-red-600">-${Math.abs(varianceAmount).toLocaleString()}</p>
          )}
          
          <p className="text-xs text-gray-500 mt-2">Across {billableHours.toLocaleString()} billable hours</p>
        </div>
        
        <div className="w-12 flex justify-center">
          {isPositiveVariance ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          )}
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between mb-1">
          <span className="text-xs text-gray-500">Provider breakdown</span>
          <span className="text-xs text-gray-500">Variance</span>
        </div>
        <div className="space-y-1 max-h-16 overflow-y-auto">
          {providerBreakdown.map((provider, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-xs">{provider.name}</span>
              <span className={`text-xs ${provider.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {provider.amount >= 0 ? '+' : ''}{provider.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between">
        <p className="text-xs text-green-600">{avgRateCardDiff}/hr avg. below rate card</p>
        <button className="text-xs text-blue-600 hover:underline">View Details</button>
      </div>
    </div>
  );
};

export default RateCardVarianceCard;
