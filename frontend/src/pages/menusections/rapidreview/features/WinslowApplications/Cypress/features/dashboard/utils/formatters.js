/**
 * Utility functions for formatting data in the dashboard
 */

/**
 * Formats a currency value with dollar sign and commas
 * @param {number} value - The value to format
 * @param {boolean} includeCents - Whether to include cents in the formatted value
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, includeCents = false) => {
    if (value === null || value === undefined) return '$0';
    
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: includeCents ? 2 : 0,
      maximumFractionDigits: includeCents ? 2 : 0
    });
    
    return formatter.format(value);
  };
  
  /**
   * Parses a currency string to a number
   * @param {string} currencyStr - Currency string (e.g. "$1,234.56")
   * @returns {number} The parsed number
   */
  export const parseCurrency = (currencyStr) => {
    if (!currencyStr) return 0;
    return parseFloat(currencyStr.replace(/[^0-9.-]+/g, ""));
  };
  
  /**
   * Formats a date string to a readable format
   * @param {string|Date} date - Date to format
   * @param {string} format - Format style ('short', 'medium', 'long')
   * @returns {string} Formatted date string
   */
  export const formatDate = (date, format = 'medium') => {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    const options = {
      short: { month: 'short', day: 'numeric', year: 'numeric' },
      medium: { month: 'short', day: 'numeric', year: 'numeric' },
      long: { month: 'long', day: 'numeric', year: 'numeric' }
    };
    
    return dateObj.toLocaleDateString('en-US', options[format]);
  };
  
  /**
   * Formats a percentage value
   * @param {number} value - Percentage value (e.g. 42.5)
   * @param {boolean} includeSymbol - Whether to include % symbol
   * @returns {string} Formatted percentage
   */
  export const formatPercentage = (value, includeSymbol = true) => {
    if (value === null || value === undefined) return includeSymbol ? '0%' : '0';
    
    const formatted = Math.round(value * 10) / 10; // Round to 1 decimal place
    return includeSymbol ? `${formatted}%` : formatted.toString();
  };
  
  /**
   * Parses a percentage string to a number
   * @param {string} percentStr - Percentage string (e.g. "42.5%")
   * @returns {number} The parsed number
   */
  export const parsePercentage = (percentStr) => {
    if (!percentStr) return 0;
    return parseFloat(percentStr.replace('%', ''));
  };
  
  /**
   * Formats a fiscal year based on calendar date
   * @param {Date} date - Date object 
   * @returns {string} Fiscal year in format "FY25"
   */
  export const formatFiscalYear = (date) => {
    if (!date) return '';
    
    // Fiscal year starts in June
    const fiscalYear = date.getMonth() >= 5 ? date.getFullYear() + 1 : date.getFullYear();
    return `FY${(fiscalYear % 100).toString()}`;
  };
  
  /**
   * Creates a fiscal year range for periods spanning multiple years
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {string} Fiscal year range (e.g. "FY25-26")
   */
  export const formatFiscalYearRange = (startDate, endDate) => {
    if (!startDate || !endDate) return '';
    
    const startFY = formatFiscalYear(startDate);
    const endFY = formatFiscalYear(endDate);
    
    return startFY === endFY ? startFY : `${startFY}-${endFY.replace('FY', '')}`;
  };
  
  /**
   * Format large numbers with K/M/B suffixes for readability
   * @param {number} num - Number to format
   * @returns {string} Formatted number with suffix
   */
  export const formatCompactNumber = (num) => {
    if (num === null || num === undefined) return '0';
    
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
  };
  
  /**
   * Formats a rate string (e.g. for hourly rates)
   * @param {number} rate - Hourly rate
   * @param {string} unit - Rate unit (e.g. "hr" for hour)
   * @returns {string} Formatted rate string (e.g. "$150/hr")
   */
  export const formatRate = (rate, unit = 'hr') => {
    if (rate === null || rate === undefined) return '$0/hr';
    return `$${rate.toLocaleString()}/` + unit;
  };
  
  /**
   * Format utilization as percentage
   * @param {number} utilization - Utilization rate (0-100)
   * @returns {string} Formatted utilization (e.g. "75%")
   */
  export const formatUtilization = (utilization) => {
    if (utilization === null || utilization === undefined) return '0%';
    return `${Math.round(utilization)}%`;
  };
  
  /**
   * Calculate monthly cost based on rate, quantity, and utilization
   * @param {number} rate - Hourly rate
   * @param {number} quantity - Number of resources
   * @param {number} utilization - Utilization percentage (0-100)
   * @param {number} hoursPerMonth - Standard hours per month
   * @returns {number} Monthly cost
   */
  export const calculateMonthlyCost = (rate, quantity, utilization, hoursPerMonth = 160) => {
    return rate * (utilization / 100) * quantity * hoursPerMonth;
  };
  
  /**
   * Truncate text with ellipsis if it exceeds max length
   * @param {string} text - Text to truncate
   * @param {number} maxLength - Maximum length
   * @returns {string} Truncated text
   */
  export const truncateText = (text, maxLength = 30) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  };
