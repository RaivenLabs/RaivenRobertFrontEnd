// src/config/sectionNavigation/winslowconfiguration.js
const winslowApplicationConfig = {
    sectionItems: [
      {
        id: 'winslowconfigurationoverview',
        label: 'Overview',
        icon: 'plus-circle',
        type: 'menu',
        route: 'winslowconfiguration/overview'

      },
      {
        id: 'winslowconfigurationloader',
        label: 'Transaction Loader',
        icon: 'template',
        type: 'menu',
        route: 'winslowconfiguration/loader',
      },

      {
        id: 'winslowconfigurationanalysis',
        label: 'Transaction Analysis',
        icon: 'template',
        type: 'menu',
        route: 'winslowconfiguration/transactionanalysis',
      },  



      {
        id: 'winslowconfigurationreporting',
        label: 'Dashboard',
        icon: 'template',
        type: 'menu',
        route: 'winslowconfiguration/reporting',
      },
     
      {
        id: 'winslowconfigurationfiling',
        label: 'Filing Packages',
        icon: 'template',
        type: 'menu',
        route: 'winslowconfiguration/filings',
      }, 
      
      {
        id: 'winslowconfigurationactiveprojects',
        label: 'Active Projects',
        icon: 'template',
        type: 'menu',
        route: 'winslowconfiguration/activeprojects',
      },
      {
        id: 'winslowconfigurationaction1',
        label: 'Application Configuration',
        icon: 'template',
        type: 'menu',
        route: 'winslowconfiguration/configuration',
      }
    ]
  };
  export default winslowApplicationConfig;
