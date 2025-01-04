// src/config/sectionNavigation/buildkits.js
const sandboxConfig = {
    sectionItems: [
      {
        id: 'overview',
        label: 'An Overview',
        icon: 'dashboard',
        type: 'menu',
        route: 'sandbox/overview'
      },

      {
        id: 'newprotypess',
        label: 'Prototyping',
        icon: 'check-square',
        type: 'menu',
        route: 'sandbox/prototypes'
      },

      {
        id: 'inflight',
        label: 'In Flight',
        icon: 'dashboard',
        type: 'menu',
        route: 'sandbox/inflight'
      },

      {
        id: 'prototypeportfolio',
        label: 'Prototype Portfolio',
        icon: 'briefcase',
        type: 'menu',
        route: 'sandbox/portfolio'
       
      },
       {
      id: 'mycomponents',
      label: 'My Components',
      icon: 'folder',
      type: 'menu',
      route: 'sandbox/components'
    },
      {
        id: 'sandboxconfiguration',
        label: 'Sandbox Configuration',
        icon: 'users',
        type: 'menu',
        route: 'sandbox/configuration'
      },

      {
        id: 'recent',
        label: 'Recent',
        icon: 'clock',
        type: 'menu',
        route: 'sandbox/recent'
      },

      {
        id: 'featurerequest',
        label: 'Feature Request',
        icon: 'book',
        type: 'menu',
        route: 'sandbox/featurerequests'
      }, 

  
    {
      id: 'shared',
      label: 'Shared With Me',
      icon: 'share',
      type: 'menu',
      route: 'sandbox/shared'
    },
  
    {
      id: 'archived',
      label: 'Archives',
      icon: 'archive',
      type: 'menu',
      route: 'sandbox/archives'
    }
  ]

    
  };
  export default sandboxConfig;
