// src/config/sectionNavigation/paceaida.js
const paceAidaConfig = {
    sectionItems: [
      {
        id: 'paceaidaoverview',
        label: 'Overview',
        icon: 'plus-circle',
        type: 'menu',
        route: 'paceaida/overview'

      },
      {
        id: 'paceaidadashboard',
        label: 'Dashboard',
        icon: 'template',
        type: 'menu',
        route: 'paceaida/dashboard',
      },

      {
        id: 'paceaidaactivematters',
        label: 'Client Table',
        icon: 'template',
        type: 'menu',
        route: 'paceaida/activematters',
      },  



      {
        id: 'paceaidareporting',
        label: 'Confirmation Queue',
        icon: 'template',
        type: 'menu',
        route: 'paceaida/confirmation',
      },
     
      {
        id: 'paceaidarouting',
        label: 'Full Payload',
        icon: 'template',
        type: 'menu',
        route: 'paceaida/payload',
      }, 
      
      {
        id: 'paceaidaactiveprojects',
        label: 'Archives',
        icon: 'template',
        type: 'menu',
        route: 'paceaida/archives',
      },
      {
        id: 'paceaidaaction1',
        label: 'Application Configuration',
        icon: 'template',
        type: 'menu',
        route: 'paceaida/configuration',
      }
    ]
  };
  export default paceAidaConfig;
