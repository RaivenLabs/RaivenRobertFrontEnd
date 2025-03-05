// src/config/sectionNavigation/nikeraiven.js
const nikeRaivenConfig = {
    sectionItems: [
      {
        id: 'nikeraivenoverview',
        label: 'Overview',
        icon: 'plus-circle',
        type: 'menu',
        route: 'nikeraiven/overview'

      },
      {
        id: 'nikeraivenloader',
        label: 'Transaction Loader',
        icon: 'template',
        type: 'menu',
        route: 'nikeraiven/loader',
      },

      {
        id: 'nikeraivenanalysis',
        label: 'Transaction Analysis',
        icon: 'template',
        type: 'menu',
        route: 'nikeraiven/transactionanalysis',
      },  



      {
        id: 'nikeraivenreporting',
        label: 'Dashboard',
        icon: 'template',
        type: 'menu',
        route: 'nikeraiven/reporting',
      },
     
      {
        id: 'nikeraivenrouting',
        label: 'Routing Packages',
        icon: 'template',
        type: 'menu',
        route: 'nikeraiven/routing',
      }, 
      
      {
        id: 'nikeraivenactiveprojects',
        label: 'Active Projects',
        icon: 'template',
        type: 'menu',
        route: 'nikeraiven/activeprojects',
      },
      {
        id: 'nikeraivenaction1',
        label: 'Application Configuration7',
        icon: 'template',
        type: 'menu',
        route: 'nikeraiven/configuration',
      }
    ]
  };
  export default nikeRaivenConfig;
