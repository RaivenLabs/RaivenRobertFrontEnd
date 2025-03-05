// utils/numberFormatters.js

export function normalizeDecimal(value) {
  if (typeof value === 'string') {
    return parseFloat(value.replace('%', '')) / 100;
  }
  return value;
}

export function toPercentageString(decimal) {
  const percentage = (normalizeDecimal(decimal) * 100).toFixed(1);
  return `${percentage}%`;
}

export function toDecimal(percentageStr) {
  if (typeof percentageStr === 'number') {
    return percentageStr;  // Already a decimal
  }
  
  // Remove any spaces and % symbol, then parse
  const cleaned = percentageStr.replace(/\s+/g, '').replace('%', '');
  
  // Convert to decimal
  return parseFloat(cleaned) / 100;
}

// Example usage:
// toPercentageString(0.255) -> "25.5%"            // Market share
// toPercentageString(0.333) -> "33.3%"            // Success rate
// toDecimal("25.5%") -> 0.255                     // Market share
// toDecimal("33.3%") -> 0.333                     // Percentage of giraffes who like carrots
// toDecimal("75%") -> 0.75                        // Portion of cake eaten
