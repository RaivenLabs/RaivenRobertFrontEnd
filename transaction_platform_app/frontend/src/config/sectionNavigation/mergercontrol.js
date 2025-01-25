// src/config/sectionNavigation/buildkits.js
const mergerControlConfig = {
    sectionItems: [
      {
        id: 'mergercontroloverview',
        label: 'Overview',
        icon: 'plus-circle',
        type: 'menu',
        route: 'mergercontrol/overview'

      },
      {
        id: 'mergercontrolloader',
        label: 'Transaction Loader',
        icon: 'template',
        type: 'menu',
        route: 'mergercontrol/loader',
      },

      {
        id: 'mergercontrolanalysis',
        label: 'Transaction Analysis',
        icon: 'template',
        type: 'menu',
        route: 'mergercontrol/transactionanalysis',
      },  



      {
        id: 'mergercontrolreporting',
        label: 'Dashboard',
        icon: 'template',
        type: 'menu',
        route: 'mergercontrol/reporting',
      },
     
      {
        id: 'mergercontrolfiling',
        label: 'Filing Packages',
        icon: 'template',
        type: 'menu',
        route: 'mergercontrol/filings',
      }, 
      
      {
        id: 'mergercontrolactiveprojects',
        label: 'Active Projects',
        icon: 'template',
        type: 'menu',
        route: 'mergercontrol/activeprojects',
      },
      {
        id: 'mergercontrolaction1',
        label: 'Application Configuration',
        icon: 'template',
        type: 'menu',
        route: 'mergercontrol/configuration',
      }
    ]
  };
  export default mergerControlConfig;
