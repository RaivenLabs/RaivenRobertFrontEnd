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
        label: 'Package Dashboard',
        icon: 'template',
        type: 'menu',
        route: 'paceaida/dashboard',
      },

      {
        id: 'paceaidaanalysis',
        label: 'Package Loader',
        icon: 'template',
        type: 'menu',
        route: 'paceaida/transactionanalysis',
      },  



      {
        id: 'paceaidareporting',
        label: 'Reporting',
        icon: 'template',
        type: 'menu',
        route: 'paceaida/reporting',
      },
     
      {
        id: 'paceaidarouting',
        label: 'Routing Packages',
        icon: 'template',
        type: 'menu',
        route: 'paceaida/routing',
      }, 
      
      {
        id: 'paceaidaactiveprojects',
        label: 'Active Projects',
        icon: 'template',
        type: 'menu',
        route: 'paceaida/activeprojects',
      },
      {
        id: 'paceaidaaction1',
        label: 'Application Configuration97',
        icon: 'template',
        type: 'menu',
        route: 'paceaida/configuration',
      }
    ]
  };
  export default paceAidaConfig;
