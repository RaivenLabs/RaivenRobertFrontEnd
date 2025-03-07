/**
 * Utility function to combine class names
 * This is a simple version of the `clsx` or `classnames` libraries
 */
export function cn(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  
  /**
   * Format a date to a human-readable string
   */
  export function formatDate(date, options = {}) {
    if (!date) return "";
    
    const defaultOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    if (typeof date === "string") {
      // Handle different date formats
      if (date.includes("/")) {
        const [month, day, year] = date.split("/");
        date = new Date(year, month - 1, day);
      } else {
        date = new Date(date);
      }
    }
    
    return date.toLocaleDateString("en-US", mergedOptions);
  }
  
  /**
   * Format currency
   */
  export function formatCurrency(value, options = {}) {
    const defaultOptions = {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    return new Intl.NumberFormat("en-US", mergedOptions).format(value);
  }
  
  /**
   * Generate a unique ID
   */
  export function generateId() {
    return Math.random().toString(36).substring(2, 9);
  }
