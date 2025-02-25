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
        id: 'winslowcypressloader',
        label: 'New Discoveries',
        icon: 'template',
        type: 'menu',
        route: 'winslowcypress/loader',
      },

      {
        id: 'winslowcypressanalysis',
        label: 'Analysis',
        icon: 'template',
        type: 'menu',
        route: 'winslowcypress/transactionanalysis',
      },  



      {
        id: 'winslowcypressreporting',
        label: 'Dashboard',
        icon: 'template',
        type: 'menu',
        route: 'winslowcypress/reporting',
      }, 
      {
        id: 'winslowcypressactiveprojects',
        label: 'Active Projects',
        icon: 'template',
        type: 'menu',
        route: 'winslowcypress/activeprojects',
      },
     
      {
        id: 'winslowcypressarchives',
        label: 'Archives',
        icon: 'template',
        type: 'menu',
        route: 'winslowcypress/archives',
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
