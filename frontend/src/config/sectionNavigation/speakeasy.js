// src/config/sectionNavigation/speakeasy.js
const speakeasyConfig = {
  sectionItems: [
    {
      id: 'speakeasy-applications',
      label: 'Speakeasy Club Applications',
      icon: 'folder',
      type: 'menu',
      level: 'section',
      route: 'speakeasyclub'
    },
    {
      id: 'speakeasy-my',
      label: 'My Speakeasy Applications',
      icon: 'clock',
      type: 'menu',
      level: 'section',
      route: 'speakeasyclub/applicationpanel'
    },
    {
      id: 'speakeasy-builds',
      label: 'Build My Own',
      icon: 'plus-circle',
      type: 'action',
      level: 'section',
     route: 'speakeasyclub/builds'
    },
    {
      id: 'speakeasy-prototypes',
      label: 'Speakeasy Prototypes',
      icon: 'share',
      type: 'menu',
      level: 'section',
      route: 'speakeasyclub/prototypes'
    },
    {
      id: 'speakeasy-features',
      label: 'Speakeasy Feature Requests',
      icon: 'archive',
      type: 'menu',
      level: 'section',
      route: 'speakeasyclub/features'
    }
  ]
};

export default speakeasyConfig;
