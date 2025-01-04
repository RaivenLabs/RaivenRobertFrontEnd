// src/config/sectionNavigation/inflight.js
const inflightConfig = {
    sectionItems: [
      {
        id: 'inflightoverview',
        label: 'An Overview',
        icon: 'plus-circle',
        type: 'action',
        route: 'inflight/overview'
      },
      {
        id: 'inflightdashboard',
        label: 'In Flight Dashboard',
        icon: 'template',
        type: 'menu',
        route: 'inflight/dashboard',

      },
     
      {
        id: 'shared',
        label: 'Shared With Me',
        icon: 'share',
        type: 'menu',
        route: 'inflight/shared'
      },
      {
        id: 'recent',
        label: 'Recent',
        icon: 'clock',
        type: 'menu',
        route: 'inflight/recent'
      },
      {
        id: 'archived',
        label: 'Archives',
        icon: 'archive',
        type: 'menu',
        route: 'inflight/archives'
      },
      {
        id: 'inflightfeaturerequest',
        label: 'Feature Request',
        icon: 'folder',
        type: 'menu',
        route: 'inflight/featurerequest'
      },


    ]
  };
  export default inflightConfig;
