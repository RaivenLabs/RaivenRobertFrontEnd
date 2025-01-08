// src/config/navigation.js
// Customer type configurations
export const CUSTOMER_CONFIGS = {
  HAWKEYE: {
    id: 'HAWKEYE',
    company_name: 'Hawkeye',
    menu_config: {
      briefing_room_text: 'Hawkeye Briefing Room',
      applications_dock_text: 'Hawkeye Applications Dock'
    },
    theme: {
      primary: 'royalBlue',
      secondary: 'cyan'
    },
    templates: {
      saas_agreement: '/templates/hawkeye/saas_agreement.html',
      msa: '/templates/hawkeye/msa.html'
    },
    features: {
      advanced_analytics: true,
      custom_templates: true,
      team_collaboration: true
    }
  },

  TANGIBLE: {
    id: 'TANGIBLE',
    company_name: 'Tangible',
    menu_config: {
      briefing_room_text: 'Tangible Briefing Room',
      applications_dock_text: 'Tangible Applications Dock'
    },
    theme: {
      primary: 'royalBlue',
      secondary: 'cyan'
    },
    templates: {
      saas_agreement: '/templates/hawkeye/saas_agreement.html',
      msa: '/templates/hawkeye/msa.html'
    },
    features: {
      advanced_analytics: true,
      custom_templates: true,
      team_collaboration: true
    }
  },

  LAW_FIRM: {
    id: 'LAW_FIRM',
    // Template for law firm configs
    templates: {
      saas_agreement: '/templates/law_firm/saas_agreement.html',
      msa: '/templates/law_firm/msa.html'
    },
    theme: {
      primary: 'navy',
      secondary: 'gold'
    }
  },
  ENTERPRISE: {
    id: 'ENTERPRISE',
    // Template for enterprise configs
    templates: {
      saas_agreement: '/templates/enterprise/saas_agreement.html',
      msa: '/templates/enterprise/msa.html'
    },
    theme: {
      primary: 'blue',
      secondary: 'silver'
    }
  }
};






export const navigationConfig = {
  mainItems: [
    {
      id: 'companyreport',
      label: 'Our Company',
      configLabel: 'briefing_room_text', // This tells the system to use the config value
      icon: 'companyreport',
      type: 'controlpanelmenu',
      level: 'main',
      route: 'companyreport',
      useConfigLabel: true // Flag to use dynamic config label

    },
    {
      id: 'rapidreview',
      label: 'Rapid Response Group',
      icon: 'rapidreview',
      type: 'applications-package',
      level: 'main',
       route: 'rapidreview'
    },
    {
      id: 'concierge',
      label: 'Tangible Concierge',
      icon: 'concierge',
      type: 'controlpanelmenu',
      level: 'main',
      route: 'concierge' 
    },
    {
      id: 'headquarters',
      label: 'Headquarters',
      icon: 'home',
      hasSubmenu: true,
      submenuItems: [
        { id: 'flightdeck', label: 'FlightDeck', type: 'controlpanelmenu',level: 'main', route: 'flightdeck'},
        { id: 'inflight', label: 'In Flight', type: 'table-reporting',level: 'main',  route: 'inflight'},
        { id: 'landed', label: 'Landed', type: 'controlpanelmenu',level: 'main',  route: 'landed'},
        { id: 'buildkits', label: 'Build Kits', type: 'controlpanelmenu',level: 'main', route: 'buildkits' },
        { id: 'r2d2', label: 'Insights', type: 'controlpanelmenu',level: 'main', route: 'r2d2' }, 
        { id: 'readyroom', label: 'Ready Room', type: 'controlpanelmenu', level: 'main', route: 'readyroom'},
        { id: 'sandbox', label: 'The Tangible Sandbox', type: 'controlpanelmenu',level: 'main', route: 'sandbox' }
      ]
    },
    {
      id: 'tangibleteams',
      label: 'Tangible CoIntelligence Service Teams',
      icon: 'tangibleteams',
      type: 'controlpanelmenu',
      level: 'main',
      route: 'tangibleteams'
    },
    {
      id: 'houseapps',
      label: 'House Applications Dock',
      configLabel: 'applications_dock_text',
      icon: 'houseapps',
      type: 'controlpanelmenu',
      level: 'main',
      route: 'houseapps',
      useConfigLabel: true
    },
    {
      id: 'exchange',
      label: 'The Application Exchange',
      icon: 'speakeasy',
      type: 'controlpanelmenu',
      level: 'main',
       route: 'exchange'
    },
    {
      id: 'speakeasy',
      label: 'The Tangible Speakeasy',
      icon: 'speakeasy',
      type: 'controlpanelmenu',
      level: 'main',
      route: 'speakeasy'
    },
    {
      id: 'platformtour',
      label: 'Platform Tour',
      icon: 'settings',
      type: 'controlpanelmenu',
      level: 'main',
       route: 'platformtour'
    },
    {
      id: 'configuration',
      label: 'Platform Configuration',
      icon: 'settings',
      type: 'controlpanelmenu',
      level: 'main',
      route: 'configuration'
    },
    {
      id: 'authentication',
      label: 'Authentication',
      icon: 'settings',
      type: 'controlpanelmenu',
      level: 'main',
      route: 'authentication'
    }
  ]
};

export const getNavigationItem = (id) => {
  const findItem = (items) => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.submenuItems) {
        const found = findItem(item.submenuItems);
        if (found) return found;
      }
    }
    return null;
  };

  return findItem(navigationConfig.mainItems);
};
