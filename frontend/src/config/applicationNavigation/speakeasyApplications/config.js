// src/config/applicationNavigation/speakeasyApplications/config.js
const speakeasyApplicationsConfig = {
  applicationItems: [
    {
      id: 'groupapplications',
      label: 'Group Applications',
      icon: 'home',
      level: 'application',
      route: 'groupapplications'
    },
    {
      id: 'myapps',
      label: 'My Apps',
      icon: 'users',
      level: 'application',
      route: 'myapps'
    },
    {
      id: 'membersonly',
      label: 'Members Room',
      icon: 'calendar',
      level: 'application',
      route: 'membersonly'
    },
    {
      id: 'prototypes',
      label: 'Prototypes',
      icon: 'settings',
      level: 'application',
      route: 'prototypes'
    }
  ]
};

export default speakeasyApplicationsConfig;
