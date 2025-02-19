// src/config/sectionNavigation/winslowsourcing.js
const winslowSourcingHubConfig = {
    sectionItems: [
      {
        id: 'winslowsourcingoverview',
        label: 'Overview',
        icon: 'plus-circle',
        type: 'menu',
        route: 'winslowsourcing/overview'

      },
      {
        id: 'winslowsourcingloader',
        label: 'Building New Agreements',
        icon: 'template',
        type: 'menu',
        route: 'winslowsourcing/loader',
      },

      {
        id: 'winslowsourcinganalysis',
        label: 'Transaction Analysis',
        icon: 'template',
        type: 'menu',
        route: 'winslowsourcing/transactionanalysis',
      },  



      {
        id: 'winslowsourcingreporting',
        label: 'Dashboard',
        icon: 'template',
        type: 'menu',
        route: 'winslowsourcing/reporting',
      },
     
      {
        id: 'winslowsourcingfiling',
        label: 'Filing Packages',
        icon: 'template',
        type: 'menu',
        route: 'winslowsourcing/filings',
      }, 
      
      {
        id: 'winslowsourcingactiveprojects',
        label: 'Active Projects',
        icon: 'template',
        type: 'menu',
        route: 'winslowsourcing/activeprojects',
      },
      {
        id: 'winslowsourcingaction1',
        label: 'Application Configuration',
        icon: 'template',
        type: 'menu',
        route: 'winslowsourcing/configuration',
      }
    ]
  };
  export default winslowSourcingHubConfig;
