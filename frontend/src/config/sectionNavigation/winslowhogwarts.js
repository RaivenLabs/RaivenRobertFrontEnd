// src/config/sectionNavigation/winslowhogwarts.js
const winslowhogwartsConfig = {
    sectionItems: [
      {
        id: 'winslowhogwartsoverview',
        label: 'Overview',
        icon: 'plus-circle',
        type: 'menu',
        route: 'winslowhogwarts/overview'

      }, 
      {
        id: 'winslowhogwartsdashboard',
        label: 'Dashboard',
        icon: 'template',
        type: 'menu',
        route: 'winslowhogwarts/dashboard',
      }, 

      {
        id: 'winslowhogwartslaunchpad',
        label: 'Order Desk',
        icon: 'template',
        type: 'menu',
        route: 'winslowhogwarts/launchpad',
      },
    
      {
        id: 'winslowhogwartsproviders',
        label: 'Provider Relationships',
        icon: 'template',
        type: 'menu',
        route: 'winslowhogwarts/providers',
      },
     
      {
        id: 'winslowhogwartsretrieval',
        label: 'Order Bank',
        icon: 'template',
        type: 'menu',
        route: 'winslowhogwarts/retrieval',
      }, 
      
     
      {
        id: 'winslowhogwartsconfiguration',
        label: 'Application Configuration',
        icon: 'template',
        type: 'menu',
        route: 'winslowhogwarts/configuration',
      }
    ]
  };
  export default winslowhogwartsConfig;
