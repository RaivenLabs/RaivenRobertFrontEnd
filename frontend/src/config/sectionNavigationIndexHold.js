// src/config/sectionNavigation.js

export const authenticationConfig = {
  id: 'authentication',
  label: 'Authentication',
  menuItems: []  // Add menu items as needed
};

export const buildkitsConfig = {
  id: 'buildkits',
  label: 'Builds',
  menuItems: []
};

export const companyreportConfig = {
  id: 'companyreport',
  label: 'Our Firm',
  menuItems: []
};

export const conciergeConfig = {
  id: 'concierge',
  label: 'Concierge',
  menuItems: []
};

export const configurationConfig = {
  id: 'configuration',
  label: 'Platform Configuration',
  menuItems: []
};

export const exchangeConfig = {
  id: 'exchange',
  label: 'The Application Exchange',
  menuItems: []
};

export const flightdeckConfig = {
  id: 'flightdeck',
  label: 'FlightDeck',
  menuItems: []
};

export const houseappsConfig = {
  id: 'houseapps',
  label: 'House Applications Dock',
  menuItems: []
};

export const inflightConfig = {
  id: 'inflight',
  label: 'In Flight',
  menuItems: []
};

export const landedConfig = {
  id: 'landed',
  label: 'Landings',
  menuItems: []
};

export const platformtourConfig = {
  id: 'platformtour',
  label: 'Platform Tour',
  menuItems: []
};

export const r2d2Config = {
  id: 'r2d2',
  label: 'Insights',
  menuItems: []
};

export const readyroomConfig = {
  id: 'readyroom',
  label: 'Ready Room',
  menuItems: []
};

export const sandboxConfig = {
  id: 'sandbox',
  label: 'The Tangible Sandbox',
  menuItems: []
};

export const settingsConfig = {
  id: 'settings',
  label: 'Settings',
  menuItems: []
};

export const speakeasyConfig = {
  id: 'speakeasy',
  label: 'The Tangible Speakeasy',
  menuItems: [
    {
      id: 'speakeasy-home',
      label: 'Speakeasy Home',
      route: '',
      type: 'page'
    },
    {
      id: 'speakeasy-club-applications',
      label: 'Club Applications',
      route: 'applications',
      type: 'program',
      programId: 'club-applications'
    }
  ]
};

export const tangibleteamsConfig = {
  id: 'tangibleteams',
  label: 'Tangible CoIntelligence Service Teams',
  menuItems: []
};

// Helper function to get config for any section
export const getSectionConfig = (sectionId) => {
  const configs = {
    authentication: authenticationConfig,
    buildkits: buildkitsConfig,
    companyreport: companyreportConfig,
    concierge: conciergeConfig,
    configuration: configurationConfig,
    exchange: exchangeConfig,
    flightdeck: flightdeckConfig,
    houseapps: houseappsConfig,
    inflight: inflightConfig,
    landed: landedConfig,
    platformtour: platformtourConfig,
    r2d2: r2d2Config,
    readyroom: readyroomConfig,
    sandbox: sandboxConfig,
    settings: settingsConfig,
    speakeasy: speakeasyConfig,
    tangibleteams: tangibleteamsConfig
  };
  
  return configs[sectionId];
};
