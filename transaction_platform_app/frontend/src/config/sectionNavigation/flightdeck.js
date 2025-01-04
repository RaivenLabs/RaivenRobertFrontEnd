// src/config/sectionNavigation/flightdeck.js
const flightdeckConfig = {
  sectionItems: [
    {
      id: 'flightdeckoverview',
      label: 'An Overview',
      icon: 'compass',  // Changed to compass to indicate program overview
      type: 'menu',
      route: 'flightdeck/overview'
    },
    {
      id: 'flightdeckdashboard',
      label: 'Command Dashboard',  // Changed to emphasize program-level view
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
      id: 'flightdeckportfolio',
      label: 'Program Portfolio',  // Changed to emphasize program-level view
      icon: 'briefcase',  // Changed to briefcase for portfolio
      type: 'menu',
      route: 'flightdeck/projecttable'
    },
    {
      id: 'shared',
      label: 'Collaboration Hub',  // Changed to emphasize program collaboration
      icon: 'share',
      type: 'menu',
      route: 'flightdeck/shared'
    },
    {
      id: 'recent',
      label: 'Recent Activity',  // Made more descriptive
      icon: 'clock',
      type: 'menu',
      route: 'flightdeck/recent'
    },
    {
      id: 'archived',
      label: 'Program Archives',  // Changed to emphasize program context
      icon: 'archive',
      type: 'menu',
      route: 'flightdeck/archives'
    },
    {
      id: 'featurerequests',
      label: 'Feature Requests',  // Changed to emphasize program context
      icon: 'archive',
      type: 'menu',
      route: 'flightdeck/featurerequests'
    }

  ]
};

export default flightdeckConfig;
