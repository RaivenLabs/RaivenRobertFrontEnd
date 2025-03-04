import React from 'react';
import MetricCard from './MetricCard';
import RateCardPanel from './RateCardPanel';
import MiniSparkline from '../ui/MiniSparkline';

const MetricsPanel = ({ metrics }) => {
  const { 
    totalActiveOrders, totalOrders, totalOrderValue, 
    spendByFY, rateCardVariance, billableHours 
  } = metrics;
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 bg-gray-50">
      {/* Active Service Orders */}
      <MetricCard
        title="Active Service Orders"
        value={totalActiveOrders}
        description={`Out of ${totalOrders} total orders`}
        footer="+5% from last month"
        footerColor="text-blue-600"
        chart={
          <MiniSparkline 
            data={[35, 40, 42, 38, 45, 48, 50, 52, 48, 50, 53, 55]} 
            color="#4299e1" 
            type="bar" 
          />
        }
      />
      
      {/* Total Portfolio Value */}
      <MetricCard
        title="Total Portfolio Value"
        value={`$${totalOrderValue.toLocaleString()}`}
        description="Across all active and planned orders"
        footer="+8% growth YTD"
        footerColor="text-green-600"
        chart={<MiniSparkline data={[]} color="#48bb78" type="line" />}
      />
      
      {/* FY25 Spend */}
      <MetricCard
        title="FY25 Spend"
        value={`$${(spendByFY['FY25'] || 0).toLocaleString()}`}
        description="Jun 2024 - May 2025"
        footer="42% of annual budget"
        footerColor="text-orange-600"
        chart={<MiniSparkline data={[]} color="#ed8936" type="line" />}
      />
      
      {/* Rate Card Variance */}
      <RateCardPanel 
        variance={rateCardVariance} 
        billableHours={billableHours} 
        providers={[
          { name: "Midway Consulting", variance: 35000 },
          { name: "Apex Systems", variance: 22000 },
          { name: "Technica Solutions", variance: -8000 }
        ]}
      />
    </div>
  );
};

export default MetricsPanel;
