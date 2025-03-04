// src/config/sectionNavigation/eucsdd.js
const eucsddConfig = {
    sectionItems: [
      {
        id: 'eucsddoverview',
        label: 'Overview',
        icon: 'plus-circle',
        type: 'menu',
        route: 'eucsdd/overview'

      },
      {
        id: 'eucsddloader',
        label: 'Transaction Loader',
        icon: 'template',
        type: 'menu',
        route: 'eucsdd/loader',
      },

     
      {
        id: 'eucsddreporting',
        label: 'Dashboard',
        icon: 'template',
        type: 'menu',
        route: 'eucsdd/dashboard',
      },
     
     
      
      
      {
        id: 'eucsddaction1',
        label: 'Application Configuration',
        icon: 'template',
        type: 'menu',
        route: 'eucsdd/configuration',
      }
    ]
  };
  export default eucsddConfig;
