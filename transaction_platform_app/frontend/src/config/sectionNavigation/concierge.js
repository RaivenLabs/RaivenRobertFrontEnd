
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
        label: 'Start New Matter',
        icon: 'check-square',
        type: 'view',
        route: 'concierge/launch'

      },

      {
        id: 'conciergedashboard',
        label: 'My Dashboard',
        icon: 'dashboard',
        type: 'view',
        route: 'concierge/dashboard'
      },

      {
        id: 'conciergeportfolio',
        label: 'Active Portfolio',
        icon: 'briefcase',
        type: 'menu',
       route: 'concierge/portfolio'
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
