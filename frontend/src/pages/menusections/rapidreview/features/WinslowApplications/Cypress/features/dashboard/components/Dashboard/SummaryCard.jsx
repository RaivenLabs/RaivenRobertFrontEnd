import React from 'react';
import MiniSparkline from '../../ui/MiniSparkline';

const SummaryCard = ({
  title,
  value,
  subtitle,
  footerText,
  sparklineData = [],
  sparklineColor = '#4299e1',
  sparklineType = 'bar',
  footerTextColor = 'text-blue-600'
}) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-royalBlue">{value}</p>
          <p className="text-xs text-gray-500 mt-2">{subtitle}</p>
        </div>
        <div className="w-32 flex items-end">
          <MiniSparkline 
            data={sparklineData} 
            color={sparklineColor} 
            type={sparklineType} 
          />
        </div>
      </div>
      <div className="mt-2 pt-2 border-t border-gray-100">
        <p className={`text-xs ${footerTextColor}`}>{footerText}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
