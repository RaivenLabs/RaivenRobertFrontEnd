// src/config/sectionNavigation/houseapps.js
const houseappsConfig = {
    sectionItems: [
      {
        id: 'overview',
        label: 'Overview',
        icon: 'dashboard',
        type: 'menu',
        route: 'houseapps/overview'
      },

      

      {
        id: 'houseapplicationsdock',
        label: 'Applications Dock',
        icon: 'briefcase',
        type: 'menu',
        route: 'houseapps/applicationsdock'
       
      },
       {
      id: 'myhouseapplications',
      label: 'My House Applications',
      icon: 'folder',
      type: 'menu',
      route: 'houseapps/myhouseapplications'
    },
    

  
  ]
};
  export default houseappsConfig;
