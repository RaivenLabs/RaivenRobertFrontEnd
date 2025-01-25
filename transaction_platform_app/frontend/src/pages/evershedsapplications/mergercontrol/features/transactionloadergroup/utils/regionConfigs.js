// src/features/transaction-loader/utils/regionConfigs.js

export const regionConfigs = {
    us: {
      title: "United States Region",
      requiresParent: true,
      headers: {
        revenue: "Revenue (USD)",
        assets: "Assets",
        transactionSize: "Transaction Size",
        isManufacturer: "Manufacturer?",
        sizeOfPerson: {
          annual_net_sales: "Annual Net Sales",
          total_assets: "Total Assets"
        }
      },
      jurisdictions: ["California", "Connecticut"]
    },
    
    eu: {
      title: "European Union Region",
      requiresParent: false,
      headers: {
        revenue: "Turnover (EUR)",
        assets: "Assets",
        employees: "Employees",
        marketShare: "Market Share"
      },
      jurisdictions: ["Germany", "France", "Austria", "Italy", "Spain"]
    },
    
    uk: {
      title: "United Kingdom Region",
      requiresParent: false,
      headers: {
        revenue: "Turnover (GBP)",
        marketShare: "Market Share",
        assets: "Assets",
        employees: "Employees"
      },
      jurisdictions: ["United Kingdom"]
    },
    
    comesa: {
      title: "COMESA Region",
      requiresParent: false,
      headers: {
        revenue: "Turnover (USD)",
        marketShare: "Market Share",
        assets: "Assets"
      },
      jurisdictions: ["Kenya", "Egypt", "Ethiopia"]
    },
    
    southAmerica: {
      title: "South America Region",
      requiresParent: false,
      headers: {
        revenue: "Revenue (USD)",
        marketShare: "Market Share",
        assets: "Assets"
      },
      jurisdictions: ["Brazil", "Argentina", "Chile", "Colombia"]
    }
  };
  
  // Helper functions for working with region configs
  export const getRegionTitle = (regionKey) => {
    return regionConfigs[regionKey]?.title || 'Unknown Region';
  };
  
  export const getRegionHeaders = (regionKey) => {
    return regionConfigs[regionKey]?.headers || {};
  };
  
  export const getRegionJurisdictions = (regionKey) => {
    return regionConfigs[regionKey]?.jurisdictions || [];
  };
  
  export const isParentRequired = (regionKey) => {
    return regionConfigs[regionKey]?.requiresParent || false;
  };
  
  // Utility function to check if a jurisdiction belongs to a region
  export const isJurisdictionInRegion = (regionKey, jurisdiction) => {
    return getRegionJurisdictions(regionKey).includes(jurisdiction);
  };
  
  // Export default for convenience
  export default regionConfigs;
