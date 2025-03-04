/**
 * Utility functions for calculating metrics and summaries from service order data
 */
import { parseNumericValue } from './filterUtils';

/**
 * Calculate summary metrics from service orders
 * @param {Array} orders - Array of service order objects
 * @returns {Object} - Object containing calculated metrics
 */
export const calculateSummaryMetrics = (orders = []) => {
  // Basic metrics
  const totalOrders = orders.length;
  const totalActiveOrders = orders.filter(o => o.status === 'Active').length;
  
  // Calculate total order value
  const totalOrderValue = orders.reduce((sum, order) => {
    return sum + parseNumericValue(order.orderValue);
  }, 0);
  
  // Calculate spend by provider
  const spendByProvider = orders.reduce((acc, order) => {
    const provider = order.provider;
    const value = parseNumericValue(order.orderValue);
    acc[provider] = (acc[provider] || 0) + value;
    return acc;
  }, {});
  
  // Calculate spend by fiscal year
  const spendByFY = orders.reduce((acc, order) => {
    const fy = order.fiscalYear;
    const value = parseNumericValue(order.orderValue);
    acc[fy] = (acc[fy] || 0) + value;
    return acc;
  }, {});
  
  // Calculate average order value
  const avgOrderValue = totalOrders > 0 ? totalOrderValue / totalOrders : 0;
  
  // Rate card calculations - in a real implementation, these would come from actual data
  const rateCardVariance = calculateRateCardVariance(orders);
  const billableHours = calculateTotalBillableHours(orders);
  const averageRateVariance = billableHours > 0 ? rateCardVariance / billableHours : 0;
  
  // Calculate average completion rate
  const avgCompletionRate = calculateAverageCompletion(orders);
  
  // Return comprehensive metrics object
  return {
    totalOrders,
    totalActiveOrders,
    totalOrderValue,
    avgOrderValue,
    spendByProvider,
    spendByFY,
    rateCardVariance,
    billableHours,
    averageRateVariance,
    avgCompletionRate,
    providerRateVariance: calculateProviderRateVariance(orders)
  };
};

/**
 * Calculate the total variance against rate card
 * @param {Array} orders - Array of service order objects
 * @returns {number} - Total variance amount (positive is savings)
 */
export const calculateRateCardVariance = (orders = []) => {
  // In a real implementation, this would calculate based on 
  // standard rates vs. actual rates for each resource
  
  // For demo purposes, using a fixed value
  return 49000;
};

/**
 * Calculate total billable hours across all service orders
 * @param {Array} orders - Array of service order objects
 * @returns {number} - Total billable hours
 */
export const calculateTotalBillableHours = (orders = []) => {
  // In a real implementation, this would calculate based on
  // resources, utilization, and time periods
  
  // This would add up all allocated hours based on resources
  let totalHours = 0;
  
  orders.forEach(order => {
    if (order.resources && Array.isArray(order.resources)) {
      order.resources.forEach(resource => {
        const quantity = resource.quantity || 1;
        const utilization = parseUtilization(resource.utilization);
        
        // Assuming a standard allocation of 160 hours per month per resource
        // and average duration of 3 months per service order
        const resourceHours = 160 * 3 * quantity * utilization;
        totalHours += resourceHours;
      });
    }
  });
  
  return totalHours || 2180; // Fallback to sample value if calculation yields 0
};

/**
 * Parse utilization percentage from string like "75%"
 * @param {string} utilization - Utilization string
 * @returns {number} - Utilization as decimal (0.75)
 */
const parseUtilization = (utilization) => {
  if (!utilization) return 1; // Default to 100%
  if (typeof utilization === 'number') return utilization / 100;
  
  // Parse percentage string
  const match = utilization.match(/(\d+)/);
  if (match && match[1]) {
    return parseInt(match[1]) / 100;
  }
  
  return 1; // Default to 100% if parsing fails
};

/**
 * Calculate average completion percentage across orders
 * @param {Array} orders - Array of service order objects
 * @returns {number} - Average completion percentage
 */
const calculateAverageCompletion = (orders = []) => {
  if (!orders.length) return 0;
  
  const completionSum = orders.reduce((sum, order) => {
    if (!order.completionScore) return sum;
    
    // Parse percentage string like "65%"
    const match = order.completionScore.match(/(\d+)/);
    if (match && match[1]) {
      return sum + parseInt(match[1]);
    }
    return sum;
  }, 0);
  
  return completionSum / orders.length;
};

/**
 * Calculate rate variance by provider
 * @param {Array} orders - Array of service order objects
 * @returns {Array} - Array of provider variance objects
 */
export const calculateProviderRateVariance = (orders = []) => {
  // In a production environment, this would calculate actual variances
  // based on provider rates vs. standard rates
  
  // For demo purposes, return sample data
  return [
    { name: "Midway Consulting", variance: 35000 },
    { name: "Apex Systems", variance: 22000 },
    { name: "Technica Solutions", variance: -8000 }
  ];
};

/**
 * Calculate month-over-month change in metrics
 * @param {number} currentValue - Current metric value
 * @param {number} previousValue - Previous month's value
 * @returns {Object} - Object with percentage change and direction
 */
export const calculateMonthlyChange = (currentValue, previousValue) => {
  if (!previousValue) return { percentage: 0, direction: 'neutral' };
  
  const change = currentValue - previousValue;
  const percentage = (change / previousValue) * 100;
  
  return {
    percentage: Math.abs(Math.round(percentage * 10) / 10), // Round to 1 decimal
    direction: change >= 0 ? 'increase' : 'decrease'
  };
};

/**
 * Calculate year-to-date metrics
 * @param {Array} orders - Array of service order objects
 * @returns {Object} - YTD metrics
 */
export const calculateYTDMetrics = (orders = []) => {
  // Current date info for YTD calculations
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  
  // Filter orders for current year
  const ytdOrders = orders.filter(order => {
    if (!order.startDate) return false;
    
    // Parse start date (assuming format like "Jan 15, 2025")
    const startDate = new Date(order.startDate);
    return startDate.getFullYear() === currentYear;
  });
  
  // Calculate YTD spend
  const ytdSpend = ytdOrders.reduce((sum, order) => {
    return sum + parseNumericValue(order.orderValue);
  }, 0);
  
  // For demonstration, using sample budget
  const annualBudget = 1200000;
  const budgetUtilization = (ytdSpend / annualBudget) * 100;
  
  return {
    ytdSpend,
    budgetUtilization,
    orderCount: ytdOrders.length
  };
};
