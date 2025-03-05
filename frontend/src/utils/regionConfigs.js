// src/features/transaction-loader/utils/regionConfigs.js

export const regionConfigs = {
  us: {
    title: "United States Region",
    dataKey: "usa",
    requiresParent: true,
    headers: {
      revenue: "Revenue (USD)",
      assets: "Assets",
      transactionSize: "Transaction Size",
      isManufacturer: "Manufacturer?",
      annualNetSales: "Annual Net Sales",
      totalAssets: "Total Assets"
    },
    jurisdictions: [
      {
        display: "United States (Total)",
        dataKey: "usa"
      },
      {
        display: "California",
        dataKey: "California"
      },
      {
        display: "Connecticut",
        dataKey: "Connecticut"
      }
    ]
  },
  
  uk: {
    title: "United Kingdom Region",
    dataKey: "uk",
    requiresParent: false,
    headers: {
      revenue: "Turnover (GBP)",
      marketShare: "Market Share",
      assets: "Assets",
      employees: "Employees"
    },
    jurisdictions: [
      {
        display: "United Kingdom",
        dataKey: "uk"
      }
    ]
  },
  
  eu: {
    title: "European Union Region",
    dataKey: "eu",
    requiresParent: false,
    headers: {
      revenue: "Turnover (EUR)",
      assets: "Assets",
      employees: "Employees",
      marketShare: "Market Share"
    },
    jurisdictions: [
      {
        display: "Germany",
        dataKey: "germany"
      },
      {
        display: "France",
        dataKey: "france"
      },
      {
        display: "Austria",
        dataKey: "austria"
      },
      {
        display: "Italy",
        dataKey: "italy"
      },
      {
        display: "Spain",
        dataKey: "spain"
      }
    ]
  },
  
  comesa: {
    title: "COMESA Region",
    dataKey: "comesa",
    requiresParent: false,
    headers: {
      revenue: "Turnover (USD)",
      marketShare: "Market Share",
      assets: "Assets"
    },
    jurisdictions: [
      {
        display: "Kenya",
        dataKey: "kenya"
      },
      {
        display: "Egypt",
        dataKey: "egypt"
      },
      {
        display: "Ethiopia",
        dataKey: "ethiopia"
      }
    ]
  },
  
  southAmerica: {
    title: "South America Region",
    dataKey: "southAmerica",
    requiresParent: false,
    headers: {
      revenue: "Revenue (USD)",
      marketShare: "Market Share",
      assets: "Assets"
    },
    jurisdictions: [
      {
        display: "Brazil",
        dataKey: "brazil"
      },
      {
        display: "Argentina",
        dataKey: "argentina"
      },
      {
        display: "Chile",
        dataKey: "chile"
      },
      {
        display: "Colombia",
        dataKey: "colombia"
      }
    ]
  }
};

// Helper functions to get data keys and display names
export const getRegionDataKey = (regionKey) => {
  return regionConfigs[regionKey]?.dataKey || regionKey;
};

export const getJurisdictionDataKey = (regionKey, jurisdictionDisplay) => {
  const jurisdiction = regionConfigs[regionKey]?.jurisdictions
    .find(j => j.display === jurisdictionDisplay);
  return jurisdiction?.dataKey || jurisdictionDisplay;
};

export const getJurisdictionDisplay = (regionKey, dataKey) => {
  const jurisdiction = regionConfigs[regionKey]?.jurisdictions
    .find(j => j.dataKey === dataKey);
  return jurisdiction?.display || dataKey;
};

// Original helper functions maintained for compatibility
export const getRegionTitle = (regionKey) => {
  return regionConfigs[regionKey]?.title || 'Unknown Region';
};

export const getRegionHeaders = (regionKey) => {
  return regionConfigs[regionKey]?.headers || {};
};

export const getRegionJurisdictions = (regionKey) => {
  return regionConfigs[regionKey]?.jurisdictions.map(j => j.display) || [];
};

export const isParentRequired = (regionKey) => {
  return regionConfigs[regionKey]?.requiresParent || false;
};

export const isJurisdictionInRegion = (regionKey, jurisdictionDisplay) => {
  return getRegionJurisdictions(regionKey).includes(jurisdictionDisplay);
};

export default regionConfigs;
