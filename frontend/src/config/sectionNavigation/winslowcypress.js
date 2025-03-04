// src/config/sectionNavigation/winslowcypress.js
const winslowCypressConfig = {
    sectionItems: [
      {
        id: 'winslowcypressoverview',
        label: 'Overview',
        icon: 'plus-circle',
        type: 'menu',
        route: 'winslowcypress/overview'

      }, 
      {
        id: 'winslowcypressdashboard',
        label: 'Dashboard',
        icon: 'template',
        type: 'menu',
        route: 'winslowcypress/dashboard',
      }, 

      {
        id: 'winslowcypresslaunchpad',
        label: 'Order Desk',
        icon: 'template',
        type: 'menu',
        route: 'winslowcypress/launchpad',
      },
    
      {
        id: 'winslowcypressproviders',
        label: 'Provider Relationships',
        icon: 'template',
        type: 'menu',
        route: 'winslowcypress/providers',
      },
     
      {
        id: 'winslowcypressretrieval',
        label: 'Order Bank',
        icon: 'template',
        type: 'menu',
        route: 'winslowcypress/retrieval',
      }, 
      
     
      {
        id: 'winslowcypressconfiguration',
        label: 'Application Configuration',
        icon: 'template',
        type: 'menu',
        route: 'winslowcypress/configuration',
      }
    ]
  };
  export default winslowCypressConfig;
