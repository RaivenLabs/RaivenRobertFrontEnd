import React from 'react';
import SummaryCard from './SummaryCard';
import RateCardVarianceCard from './RateCardVarianceCard';

const SummaryCardsGrid = ({
  totalActiveOrders,
  totalOrdersCount,
  totalOrderValue,
  spendByFY,
  rateCardVariance,
  totalBillableHours,
  providerVarianceBreakdown
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 bg-gray-50">
      {/* Row 1: Orders and Portfolio Value */}
      <SummaryCard
        title="Active Service Orders"
        value={totalActiveOrders}
        subtitle={`Out of ${totalOrdersCount} total orders`}
        footerText="+5% from last month"
        sparklineData={[35, 40, 42, 38, 45, 48, 50, 52, 48, 50, 53, 55]}
        sparklineColor="#4299e1"
        sparklineType="bar"
        footerTextColor="text-blue-600"
      />

      <SummaryCard
        title="Total Portfolio Value"
        value={`$${totalOrderValue.toLocaleString()}`}
        subtitle="Across all active and planned orders"
        footerText="+8% growth YTD"
        sparklineData={[]}
        sparklineColor="#48bb78"
        sparklineType="line"
        footerTextColor="text-green-600"
      />

      {/* Row 2: FY25 Spend and Rate Card Savings */}
      <SummaryCard
        title="FY25 Spend"
        value={`$${(spendByFY['FY25'] || 0).toLocaleString()}`}
        subtitle="Jun 2024 - May 2025"
        footerText="42% of annual budget"
        sparklineData={[]}
        sparklineColor="#ed8936"
        sparklineType="line"
        footerTextColor="text-orange-600"
      />
      
      {/* Enhanced Rate Card Calculations */}
      <RateCardVarianceCard
        varianceAmount={rateCardVariance}
        billableHours={totalBillableHours}
        providerBreakdown={providerVarianceBreakdown}
        avgRateCardDiff="$22.50"
      />
    </div>
  );
};

export default SummaryCardsGrid;
