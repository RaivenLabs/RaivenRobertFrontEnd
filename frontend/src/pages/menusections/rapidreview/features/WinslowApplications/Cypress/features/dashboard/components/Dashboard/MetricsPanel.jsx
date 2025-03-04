import React from 'react';
import PropTypes from 'prop-types';
import MetricCard from './MetricCard';
import RateCardPanel from './RateCardPanel';
import MiniSparkline from '../ui/MiniSparkline';
import { formatCurrency } from '../../utils/formatters';

/**
 * MetricsPanel displays the dashboard metrics in a two-row grid layout
 */
const MetricsPanel = ({ metrics }) => {
  const { 
    totalActiveOrders, 
    totalOrders, 
    totalOrderValue, 
    spendByFY, 
    rateCardVariance, 
    billableHours,
    providerVariances,
    avgRateVariance
  } = metrics;
  
  // Order trend data for sparkline - would come from real data in production
  const orderTrendData = [35, 40, 42, 38, 45, 48, 50, 52, 48, 50, 53, 55];
  
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
            data={orderTrendData} 
            color="#4299e1" 
            type="bar" 
          />
        }
      />
      
      {/* Total Portfolio Value */}
      <MetricCard
        title="Total Portfolio Value"
        value={formatCurrency(totalOrderValue)}
        description="Across all active and planned orders"
        footer="+8% growth YTD"
        footerColor="text-green-600"
        chart={<MiniSparkline data={[]} color="#48bb78" type="line" />}
      />
      
      {/* FY25 Spend */}
      <MetricCard
        title="FY25 Spend"
        value={formatCurrency(spendByFY?.FY25 || 0)}
        description="Jun 2024 - May 2025"
        footer="42% of annual budget"
        footerColor="text-orange-600"
        chart={<MiniSparkline data={[]} color="#ed8936" type="line" />}
      />
      
      {/* Rate Card Variance */}
      <RateCardPanel 
        variance={rateCardVariance} 
        billableHours={billableHours} 
        providers={providerVariances || [
          { name: "Midway Consulting", variance: 35000 },
          { name: "Apex Systems", variance: 22000 },
          { name: "Technica Solutions", variance: -8000 }
        ]}
        avgRateVariance={avgRateVariance || 22.50}
      />
    </div>
  );
};

MetricsPanel.propTypes = {
  metrics: PropTypes.shape({
    totalActiveOrders: PropTypes.number,
    totalOrders: PropTypes.number,
    totalOrderValue: PropTypes.number,
    spendByFY: PropTypes.object,
    rateCardVariance: PropTypes.number,
    billableHours: PropTypes.number,
    providerVariances: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        variance: PropTypes.number
      })
    ),
    avgRateVariance: PropTypes.number
  }).isRequired
};

MetricsPanel.defaultProps = {
  metrics: {
    totalActiveOrders: 0,
    totalOrders: 0,
    totalOrderValue: 0,
    spendByFY: {},
    rateCardVariance: 0,
    billableHours: 0,
    providerVariances: [],
    avgRateVariance: 0
  }
};

export default MetricsPanel;
