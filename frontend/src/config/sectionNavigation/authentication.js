// src/config/sectionNavigation/buildkits.js
const authenticationConfig = {
    sectionItems: [
      {
        id: 'authenticationoverview',
        label: 'An Overview',
        icon: 'plus-circle',
        type: 'menu',
       route: 'authentication/overview'
      },
     
   
      {
        id: 'authenticationconfiguration',
        label: 'Authentication Configuration',
        icon: 'share',
        type: 'menu',
        route: 'authentication/configuration'
      },
      {
        id: 'resetpasswords',
        label: 'Reset Passwords',
        icon: 'clock',
        type: 'menu',
        route: 'authentication/resetpassword' 
      }
    ]
  };
  export default authenticationConfig;
