/**
 * Utility functions for filtering service orders based on various criteria
 */

/**
 * Main function to filter service orders based on filter values
 * @param {Array} serviceOrders - Array of service order objects
 * @param {Object} filterValues - Object containing filter criteria
 * @returns {Array} - Filtered array of service orders
 */
export const getFilteredOrders = (serviceOrders = [], filterValues = {}) => {
    if (!serviceOrders.length) return [];
    
    return serviceOrders.filter(order => {
      // Apply text search filter across order name and ID
      if (!passesSearchFilter(order, filterValues.search)) {
        return false;
      }
      
      // Apply provider filter
      if (!passesProviderFilter(order, filterValues.provider)) {
        return false;
      }
      
      // Apply status filter
      if (!passesStatusFilter(order, filterValues.status)) {
        return false;
      }
      
      // Apply fiscal year filter
      if (!passesFiscalYearFilter(order, filterValues.fiscalYear)) {
        return false;
      }
      
      // Apply resource role filter (more complex since it's nested data)
      if (!passesResourceRoleFilter(order, filterValues.resourceRole)) {
        return false;
      }
      
      // Order passed all filters
      return true;
    });
  };
  
  /**
   * Check if an order passes the text search filter
   * @param {Object} order - Service order object
   * @param {string} searchText - Text to search for
   * @returns {boolean} - True if order passes the filter
   */
  const passesSearchFilter = (order, searchText) => {
    if (!searchText) return true;
    
    const searchLower = searchText.toLowerCase().trim();
    
    // Search in order name
    if (order.orderName && order.orderName.toLowerCase().includes(searchLower)) {
      return true;
    }
    
    // Search in order ID
    if (order.id && order.id.toLowerCase().includes(searchLower)) {
      return true;
    }
    
    // Could extend to search in other fields if needed
    // For example, search in provider name:
    // if (order.provider && order.provider.toLowerCase().includes(searchLower)) {
    //   return true;
    // }
    
    return false;
  };
  
  /**
   * Check if an order passes the provider filter
   * @param {Object} order - Service order object
   * @param {string} provider - Provider to filter by
   * @returns {boolean} - True if order passes the filter
   */
  const passesProviderFilter = (order, provider) => {
    if (!provider) return true;
    return order.provider === provider;
  };
  
  /**
   * Check if an order passes the status filter
   * @param {Object} order - Service order object
   * @param {string} status - Status to filter by
   * @returns {boolean} - True if order passes the filter
   */
  const passesStatusFilter = (order, status) => {
    if (!status) return true;
    return order.status === status;
  };
  
  /**
   * Check if an order passes the fiscal year filter
   * @param {Object} order - Service order object
   * @param {string} fiscalYear - Fiscal year to filter by
   * @returns {boolean} - True if order passes the filter
   */
  const passesFiscalYearFilter = (order, fiscalYear) => {
    if (!fiscalYear) return true;
    return order.fiscalYear === fiscalYear;
  };
  
  /**
   * Check if an order passes the resource role filter
   * @param {Object} order - Service order object
   * @param {string} resourceRole - Resource role to filter by
   * @returns {boolean} - True if order passes the filter
   */
  const passesResourceRoleFilter = (order, resourceRole) => {
    if (!resourceRole) return true;
    
    // If the order doesn't have resources, it doesn't pass the filter
    if (!order.resources || !Array.isArray(order.resources) || order.resources.length === 0) {
      return false;
    }
    
    // Check if any resource has the specified role
    return order.resources.some(resource => resource.role === resourceRole);
  };
  
  /**
   * Gets unique values for filter dropdowns
   * @param {Array} serviceOrders - Array of service order objects
   * @param {string} field - Field to get unique values for
   * @returns {Array} - Array of unique values
   */
  export const getUniqueFilterValues = (serviceOrders = [], field) => {
    if (!serviceOrders.length || !field) return [];
    
    // Special handling for nested resource roles
    if (field === 'resourceRole') {
      const roles = new Set();
      
      serviceOrders.forEach(order => {
        if (order.resources && Array.isArray(order.resources)) {
          order.resources.forEach(resource => {
            if (resource.role) {
              roles.add(resource.role);
            }
          });
        }
      });
      
      return Array.from(roles).sort();
    }
    
    // Handle regular top-level fields
    const uniqueValues = new Set();
    
    serviceOrders.forEach(order => {
      if (order[field]) {
        uniqueValues.add(order[field]);
      }
    });
    
    return Array.from(uniqueValues).sort();
  };
  
  /**
   * Generates filter options for dropdown menus
   * @param {Array} serviceOrders - Array of service order objects
   * @returns {Object} - Object containing filter options for each filter type
   */
  export const generateFilterOptions = (serviceOrders = []) => {
    return {
      providers: getUniqueFilterValues(serviceOrders, 'provider'),
      statuses: getUniqueFilterValues(serviceOrders, 'status'),
      fiscalYears: getUniqueFilterValues(serviceOrders, 'fiscalYear'),
      resourceRoles: getUniqueFilterValues(serviceOrders, 'resourceRole')
    };
  };
  
  /**
   * Helper to parse numeric values from formatted strings like "$100,000"
   * @param {string} formattedValue - Formatted string value
   * @returns {number} - Parsed numeric value
   */
  export const parseNumericValue = (formattedValue) => {
    if (!formattedValue) return 0;
    if (typeof formattedValue === 'number') return formattedValue;
    
    // Remove all non-numeric characters except decimal point
    return parseFloat(formattedValue.replace(/[^0-9.-]+/g, "")) || 0;
  };
