// src/config/sectionNavigation/buildkits.js
const sandboxConfig = {
    sectionItems: [
      {
        id: 'overview',
        label: 'Overview',
        icon: 'dashboard',
        type: 'menu',
        route: 'sandbox/overview'
      },

      {
        id: 'sandboxlab',
        label: 'The Prototyping Lab',
        icon: 'check-square',
        type: 'menu',
        route: 'sandbox/thelab'
      },

      
      {
        id: 'sandboxprototypes',
        label: 'My Prototypes',
        icon: 'dashboard',
        type: 'menu',
        route: 'sandbox/prototypes'
      },

     
       
      {
        id: 'sandboxconfiguration',
        label: 'Sandbox Configuration',
        icon: 'users',
        type: 'menu',
        route: 'sandbox/configuration'
      }

  ]

    
  };
  export default sandboxConfig;
