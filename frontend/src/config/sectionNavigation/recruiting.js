// src/config/sectionNavigation/recruiting.js

const recruitingConfig = {
    sectionItems: [
      {
        id: 'recruitingoverview',
        label: 'Overview',
        icon: 'info-circle',
        type: 'menu',
        route: 'recruiting/overview'
      },
    {
        id: 'research',
        label: 'Launch',
        icon: 'search',
        type: 'menu',
        route: 'recruiting/loader',
        description: 'Build and save right to work reviews'
      },



      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: 'bell',
        type: 'menu',
        route: 'recruiting/dashboard',
        description: 'Track regulatory status and changes'
      },

      {
        id: 'activereviews',
        label: 'Active Reviews',
        icon: 'folder-tree',
        type: 'menu',
        route: 'recruiting/activereviews',
        description: 'Browse and manage monitored active reviews'
      },
      
     
      {
        id: 'compliancealerts',
        label: 'Compliance Alerts',
        icon: 'alert-triangle',
        type: 'menu',
        route: 'recruiting/alerts',
        description: 'View and manage compliance alerts'
      },
      {
        id: 'reportarchive',
        label: 'Review Archive',
        icon: 'archive',
        type: 'menu',
        route: 'recruiting/archive',
        description: 'Access historical regulatory reviews'
      },
     
      {
        id: 'configuration',
        label: 'Application Configuration',
        icon: 'settings',
        type: 'menu',
        route: 'recruiting/configuration',
        description: 'Configure application settings and preferences'
      }
    ]
  };
  
  export default recruitingConfig;
