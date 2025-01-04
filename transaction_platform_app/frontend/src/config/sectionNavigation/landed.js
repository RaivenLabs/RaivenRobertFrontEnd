// src/config/sectionNavigation/buildkits.js
const landedConfig = {
    sectionItems: [
      {
        id: 'overview',
        label: 'An Overview',
        icon: 'dashboard',
        type: 'menu',
        route: 'landed/overview'
      },
 {
        id: 'dashboard',
        label: 'Dashboard',
        icon: 'briefcase',
        type: 'menu',
        route: 'landed/dashboard'

       
      },
      {
        id: 'landedportfolio',
        label: 'Landed Portfolio',
        icon: 'check-square',
        type: 'menu',
        route: 'landed/portfolio'

      },

     
      {
        id: 'landedlogbook',
        label: 'Logbook',
        icon: 'users',
        type: 'menu',
        route: 'landed/logbook'

      },

      {
        id: 'landedfamilytrees',
        label: 'Family Trees',
        icon: 'share',
        type: 'menu',
        route: 'landed/agreementtrees'
  
      }

     

      
   

     

  
  
 
    ]
  };
  export default landedConfig;
