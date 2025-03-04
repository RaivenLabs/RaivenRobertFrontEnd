// src/config/sectionNavigation/companyreport.js
const companyreportConfig = {
  sectionItems: [
   {
      id: 'inflightoverview',
      label: 'Overview',
      icon: 'plus-circle',
      type: 'action',
      route: 'flightdeck/overview'
    },


    {
      id: 'flightdeckdashboard',
      label: 'Dashboard',  // Changed to emphasize program-level view
      icon: 'layout-grid',  // Changed to grid to indicate dashboard view
      type: 'menu',
      route: 'flightdeck/dashboard',
      hasSubmenu: true,
      submenuItems: [
        { id: 'program-health', label: 'Program Health', type: 'template' },
        { id: 'resource-metrics', label: 'Resource Metrics', type: 'template' },
        { id: 'system-status', label: 'System Status', type: 'template' }
      ]
    },

    
    {
      id: 'inflightdashboard',
      label: 'Active Projects',
      icon: 'template',
      type: 'menu',
      route: 'inflight/dashboard',

    },

 {
      id: 'companyoverview',
      label: 'Organization',
      icon: 'plus-circle',
      type: 'menu',
      level: 'section',
      route: 'companyreport/overview'
    },
    {
      id: 'companypolicies',
      label: 'Resources',
      icon: 'template',
      type: 'menu',
      level: 'section',
      route: 'companyreport/resources'
    },
   
   
   
    
  ]
};

export default companyreportConfig;
