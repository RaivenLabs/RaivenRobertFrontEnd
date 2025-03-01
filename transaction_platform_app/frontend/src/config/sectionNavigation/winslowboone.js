// src/config/sectionNavigation/winslowboone.js
const winslowBooneConfig = {
    sectionItems: [
      {
        id: 'winslowbooneoverview',
        label: 'Overview',
        icon: 'plus-circle',
        type: 'menu',
        route: 'winslowboone/overview'

      },
      {
        id: 'winslowbooneloader',
        label: 'Launch',
        icon: 'template',
        type: 'menu',
        route: 'winslowboone/loader',
      },

      {
        id: 'winslowbooneanalysis',
        label: 'Analysis',
        icon: 'template',
        type: 'menu',
        route: 'winslowboone/transactionanalysis',
      },  



      {
        id: 'winslowboonereporting',
        label: 'Dashboard',
        icon: 'template',
        type: 'menu',
        route: 'winslowboone/dashboard',
      }, 
      {
        id: 'winslowbooneactiveprojects',
        label: 'Active Projects',
        icon: 'template',
        type: 'menu',
        route: 'winslowboone/activeprojects',
      },
     
      {
        id: 'winslowboonepayloads',
        label: 'Payloads',
        icon: 'template',
        type: 'menu',
        route: 'winslowboone/payloads',
      }, 
      
     
      {
        id: 'winslowbooneconfiguration',
        label: 'Application Configuration',
        icon: 'template',
        type: 'menu',
        route: 'winslowboone/configuration',
      }
    ]
  };
  export default winslowBooneConfig;
