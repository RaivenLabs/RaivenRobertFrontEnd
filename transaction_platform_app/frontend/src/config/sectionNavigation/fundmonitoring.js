// src/config/sectionNavigation/fundmonitoring.js

const fundMonitoringConfig = {
    sectionItems: [
      {
        id: 'fundmonitoringoverview',
        label: 'Overview',
        icon: 'info-circle',
        type: 'menu',
        route: 'fundmonitoring/overview'
      },




      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: 'bell',
        type: 'menu',
        route: 'fundmonitoring/dashboard',
        description: 'Track regulatory status and changes'
      },

      {
        id: 'fundfamilies',
        label: 'Fund Families',
        icon: 'folder-tree',
        type: 'menu',
        route: 'fundmonitoring/families',
        description: 'Browse and manage monitored fund families'
      },
      {
        id: 'research',
        label: 'Fund Finder',
        icon: 'search',
        type: 'menu',
        route: 'fundmonitoring/research',
        description: 'Build and save common FCA queries'
      },
     
      {
        id: 'compliancealerts',
        label: 'Compliance Alerts',
        icon: 'alert-triangle',
        type: 'menu',
        route: 'fundmonitoring/alerts',
        description: 'View and manage compliance alerts'
      },
      {
        id: 'reportarchive',
        label: 'Report Archive',
        icon: 'archive',
        type: 'menu',
        route: 'fundmonitoring/archive',
        description: 'Access historical regulatory reports'
      },
      {
        id: 'batchoperations',
        label: 'Batch Operations',
        icon: 'layers',
        type: 'menu',
        route: 'fundmonitoring/batch',
        description: 'Run bulk queries and updates'
      },
      {
        id: 'configuration',
        label: 'Application Configuration',
        icon: 'settings',
        type: 'menu',
        route: 'fundmonitoring/configuration',
        description: 'Configure application settings and preferences'
      }
    ]
  };
  
  export default fundMonitoringConfig;
