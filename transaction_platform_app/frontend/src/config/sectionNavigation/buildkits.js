// src/config/sectionNavigation/buildkits.js
const buildkitsConfig = {
    sectionItems: [
     
        {
          id: 'overview',
          label: 'An Overview',
          icon: 'dashboard',
          type: 'view',
          route: 'buildkits/overview'
        },
  
        {
          id: 'buildkitprograms',
          label: 'Build Kit Programs',
          icon: 'check-square',
          type: 'view',
          route: 'buildkits/buildkitprograms'
        },
   {
          id: 'mybuildkits',
          label: 'My Build Kits',
          icon: 'briefcase',
          type: 'menu',
          route: 'buildkits/mybuildkits'
         
        },
        {
          id: 'inflight',
          label: 'In Flight',
          icon: 'dashboard',
          type: 'view',
          route: 'buildkits/inflight'
        },
  
       
       
    ]
  };
  export default buildkitsConfig;
