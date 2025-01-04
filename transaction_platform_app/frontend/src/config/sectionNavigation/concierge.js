
  // src/config/sectionNavigation/concierge.js
  const conciergeConfig = {
    sectionItems: [
      {
        id: 'overview',
        label: 'An Overview',
        icon: 'dashboard',
        type: 'view',
        route: 'concierge/overview'
      },

      {
        id: 'conciergelaunch',
        label: 'New Matter Portal',
        icon: 'check-square',
        type: 'view',
        route: 'concierge/launch'

      },

      {
        id: 'conciergedashboard',
        label: 'Concierge Dashboard',
        icon: 'dashboard',
        type: 'view',
        route: 'concierge/dashboard'
      },

      {
        id: 'conciergeportfolio',
        label: 'Concierge Portfolio',
        icon: 'briefcase',
        type: 'menu',
       route: 'concierge/portfolio'
      },
     
      {
        id: 'conciergeoperations',
        label: 'Concierge Operations',
        icon: 'users',
        type: 'menu',
        route: 'concierge/operations'
      }
    
    ]
  };
 export default conciergeConfig
