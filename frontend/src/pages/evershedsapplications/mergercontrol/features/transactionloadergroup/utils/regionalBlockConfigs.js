// src/features/transaction-loader/utils/regionalBlockConfigs.js

export const regionalBlockConfigs = {
  european_union: {
    display: "European Union",
    blockKey: "european_union",
    requiresParent: false,
    currency: "EUR",
    headers: {
      revenue: "Turnover (EUR)",
      assets: "Assets",
      employees: "Employees",
      marketShare: "Market Share"
    },
    member_states: [
      { display: "Germany", dataKey: "germany", requiresLocalData: true },
      { display: "France", dataKey: "france", requiresLocalData: true },
      { display: "Austria", dataKey: "austria", requiresLocalData: true },
      { display: "Italy", dataKey: "italy", requiresLocalData: true },
      { display: "Spain", dataKey: "spain", requiresLocalData: true },
      { display: "Netherlands", dataKey: "netherlands", requiresLocalData: true },
      { display: "Belgium", dataKey: "belgium", requiresLocalData: true },
      { display: "Poland", dataKey: "poland", requiresLocalData: true },
      { display: "Sweden", dataKey: "sweden", requiresLocalData: true }
    ],
    merger_control_rules: {
      block_level_filing: true,
      has_member_state_filings: true,
      revenue_threshold: 500000000,
      market_share_threshold: 0.40
    }
  },

  comesa: {
    display: "COMESA",
    blockKey: "comesa",
    requiresParent: false,
    currency: "USD",
    headers: {
      revenue: "Revenue (USD)",
      assets: "Assets",
      employees: "Employees",
      marketShare: "Market Share"
    },
    member_states: [
      { display: "Egypt", dataKey: "egypt", requiresLocalData: true },
      { display: "Kenya", dataKey: "kenya", requiresLocalData: true },
      { display: "Ethiopia", dataKey: "ethiopia", requiresLocalData: true },
      { display: "Uganda", dataKey: "uganda", requiresLocalData: true },
      { display: "Zimbabwe", dataKey: "zimbabwe", requiresLocalData: true },
      { display: "Zambia", dataKey: "zambia", requiresLocalData: true },
      { display: "Rwanda", dataKey: "rwanda", requiresLocalData: true }
    ],
    merger_control_rules: {
      block_level_filing: true,
      has_member_state_filings: true,
      revenue_threshold: 50000000,
      market_share_threshold: 0.30
    }
  },

  south_america: {
    display: "South America",
    blockKey: "south_america",
    requiresParent: false,
    currency: "USD",
    headers: {
      revenue: "Revenue (USD)",
      assets: "Assets",
      employees: "Employees",
      marketShare: "Market Share"
    },
    member_states: [
      { display: "Brazil", dataKey: "brazil", requiresLocalData: true },
      { display: "Argentina", dataKey: "argentina", requiresLocalData: true },
      { display: "Chile", dataKey: "chile", requiresLocalData: true },
      { display: "Colombia", dataKey: "colombia", requiresLocalData: true },
      { display: "Peru", dataKey: "peru", requiresLocalData: true },
      { display: "Venezuela", dataKey: "venezuela", requiresLocalData: true }
    ],
    merger_control_rules: {
      block_level_filing: true,
      has_member_state_filings: true,
      revenue_threshold: 100000000,
      market_share_threshold: 0.35
    }
  },

  united_states: {
    display: "United States",
    blockKey: "united_states",
    requiresParent: false,
    currency: "USD",
    headers: {
      revenue: "Revenue (USD)",
      assets: "Assets",
      transactionSize: "Transaction Size",
      isManufacturer: "Manufacturer?",
      annualNetSales: "Annual Net Sales",
      totalAssets: "Total Assets"
    },
    member_states: [
      {
        display: "California",
        dataKey: "california",
        requiresLocalData: false
      },

      {
        display: "Connecticut",
        dataKey: "connecticut",
        requiresLocalData: false
      },
      {
        display: "USA Total",
        dataKey: "us_total",
        requiresLocalData: true
      }

    ],
    merger_control_rules: {
      block_level_filing: true,
      has_member_state_filings: false,
      size_of_person_test: true,
      size_of_transaction_test: true
    }
  },

  united_kingdom: {
    display: "United Kingdom",
    blockKey: "united_kingdom",
    requiresParent: false,
    currency: "GBP",
    headers: {
      revenue: "Turnover (GBP)",
      marketShare: "Market Share",
      assets: "Assets",
      employees: "Employees"
    },
    member_states: [
      {
        display: "UK",
        dataKey: "uk",
        requiresLocalData: true
      }
    ],
    merger_control_rules: {
      block_level_filing: true,
      has_member_state_filings: false,
      revenue_threshold: 70000000,
      market_share_threshold: 0.25
    }
  }
};

// Helper functions for working with the config
export const getBlockDisplay = (blockKey) => {
  return regionalBlockConfigs[blockKey]?.display || 'Unknown Block';
};

export const getBlockDataKey = (blockKey) => {
  return regionalBlockConfigs[blockKey]?.dataKey || blockKey;
};

export const getBlockHeaders = (blockKey) => {
  return regionalBlockConfigs[blockKey]?.headers || {};
};

export const getMemberStates = (blockKey) => {
  return regionalBlockConfigs[blockKey]?.member_states || [];
};

// Get member state display name from data key
export const getMemberStateDisplay = (blockKey, dataKey) => {
  const memberState = getMemberStates(blockKey)
    .find(state => state.dataKey === dataKey);
  return memberState?.display || dataKey;
};

// Get member state data key from display name
export const getMemberStateDataKey = (blockKey, displayName) => {
  const memberState = getMemberStates(blockKey)
    .find(state => state.display === displayName);
  return memberState?.dataKey || displayName;
};

// Get currency for a block
export const getBlockCurrency = (blockKey) => {
  return regionalBlockConfigs[blockKey]?.currency || 'USD';
};

// Get merger control rules for a block
export const getBlockMergerControlRules = (blockKey) => {
  return regionalBlockConfigs[blockKey]?.merger_control_rules || {};
};

// Check if block requires local member state data
export const requiresLocalData = (blockKey, memberStateDisplay) => {
  const memberState = getMemberStates(blockKey)
    .find(state => state.display === memberStateDisplay);
  return memberState?.requiresLocalData || false;
};

// Add this with the other helper functions in regionalBlockConfigs.js
export const createInitialPresenceState = () => {
  const presenceState = {};
  
  Object.entries(regionalBlockConfigs).forEach(([regionKey, region]) => {
    presenceState[regionKey] = {};
    region.member_states.forEach(state => {
      presenceState[regionKey][state.dataKey] = false;
    });
  });
  
  return presenceState;
};

export default regionalBlockConfigs;
