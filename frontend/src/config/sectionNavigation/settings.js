// src/config/sectionNavigation/buildkits.js
const settingsConfig = {
    sectionItems: [
      {
        id: 'settingsoverview',
        label: 'An Overview',
        icon: 'plus-circle',
        type: 'menu',
        route: 'settings/overview'
      },
      {
        id: '',
        label: 'Platform Configuration',
        icon: 'template',
        type: 'menu',
         route: 'settings/hold',
        hasSubmenu: true,
        submenuItems: [
          { id: 'saas', label: 'SaaS Agreements', type: 'template' },
          { id: 'consulting', label: 'Consulting Agreements', type: 'template' },
          { id: 'licensing', label: 'Licensing Agreements', type: 'template' }
        ]
      }
     
    ]
  };
  export default settingsConfig;
