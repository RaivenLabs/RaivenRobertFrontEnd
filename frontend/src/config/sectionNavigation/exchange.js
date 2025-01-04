// src/config/sectionNavigation/buildkits.js
const exchangeConfig = {
    sectionItems: [
      {
        id: 'exchangeoverview',
        label: 'An Overview',
        icon: 'plus-circle',
        type: 'menu',
        route: 'exchange/overview'

      },
      {
        id: 'exchange',
        label: 'The Tangible Application Exchange',
        icon: 'template',
        type: 'menu',
        route: 'exchange/applciationgroups',

        hasSubmenu: true,
        submenuItems: [
          { id: 'saas', label: 'SaaS Agreements', type: 'template' },
          { id: 'consulting', label: 'Consulting Agreements', type: 'template' },
          { id: 'licensing', label: 'Licensing Agreements', type: 'template' }
        ]
      },
      {
        id: 'myapplciations',
        label: 'My Applications',
        icon: 'folder',
        type: 'menu',
        route: 'exchange/overview'
      },
      {
        id: 'shared',
        label: 'Shared With Me',
        icon: 'share',
        type: 'menu',
        route: 'exchange/shared'
      },
      {
        id: 'recent',
        label: 'Recent',
        icon: 'clock',
        type: 'menu',
        route: 'exchange/recent'
      },
      {
        id: 'archived',
        label: 'Archives',
        icon: 'archive',
        type: 'menu',
        route: 'exchange/archives'
      }
    ]
  };
  export default exchangeConfig;
