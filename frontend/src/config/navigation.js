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

  API: {
    id: 'API',
    // Template for law firm configs
    templates: {
      saas_agreement: '/templates/api/saas_agreement.html',
      msa: '/templates/api/msa.html'
    },
    theme: {
      primary: 'navy',
      secondary: 'gold'
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
      label: 'Mission Control',
     
      icon: 'companyreport',
      type: 'controlpanelmenu',
      level: 'main',
      route: 'flightdeck',
    

    },
    {
      id: 'rapidreview',
      label: 'Applications',
      icon: 'rapidreview',
      type: 'applications-package',
      level: 'main',
       route: 'rapidreview'
    },
    
    



  

    {
      id: 'tangibleteams',
      label: 'Transaction Strike Teams',
      icon: 'tangibleteams',
      type: 'controlpanelmenu',
      level: 'main',
      route: 'tangibleteams'
    },

    {
      id: 'concierge',
      label: 'Concierge',
      icon: 'concierge',
      type: 'controlpanelmenu',
      level: 'main',
      route: 'concierge' 
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
