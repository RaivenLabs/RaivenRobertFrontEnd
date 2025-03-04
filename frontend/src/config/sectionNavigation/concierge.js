
  // src/config/sectionNavigation/concierge.js
  const conciergeConfig = {
    sectionItems: [
      {
        id: 'overview',
        label: 'Overview',
        icon: 'dashboard',
        type: 'view',
        route: 'concierge/overview'
      },

      {
        id: 'conciergelaunch',
        label: 'Launchpad',
        icon: 'check-square',
        type: 'view',
        route: 'concierge/launchpad'

      },

      {
        id: 'conciergedashboard',
        label: 'Dashboard',
        icon: 'dashboard',
        type: 'view',
        route: 'concierge/dashboard'
      },

      {
        id: 'conciergeregistry',
        label: 'Engagement Registry',
        icon: 'briefcase',
        type: 'menu',
       route: 'concierge/registry'
      },  
      {
        id: 'conciergetimemanagement',
        label: 'Time Management',
        icon: 'users',
        type: 'menu',
        route: 'concierge/timemanagement'
      },
      {
        id: 'conciergefinancedesk',
        label: 'Finance Desk',
        icon: 'users',
        type: 'menu',
        route: 'concierge/financedesk'
      },


      {
        id: 'conciergeconfiguration',
        label: 'Program Configuration',
        icon: 'users',
        type: 'menu',
        route: 'concierge/programconfiguration'
      },
     
      {
        id: 'conciergeoperations',
        label: 'Operations Center',
        icon: 'users',
        type: 'menu',
        route: 'concierge/operations'
      }

    
    
    ]
  };
 export default conciergeConfig

