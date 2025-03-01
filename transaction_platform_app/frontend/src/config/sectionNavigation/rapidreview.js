// src/config/sectionNavigation/rapidreview.js
const rapidreviewConfig = {
    sectionItems: [
      {
        id: 'overview',
        label: 'Overview',
        icon: 'folder',
        type: 'menu',
        route:'rapidresponse/overview'
      },
     
      {
        id: 'applicationsuite',
        label: 'Application Suite',
        icon: 'template',
        type: 'menu',
        route:'rapidresponse/applicationsuite'
      },  

      {
        id: 'companydashboards',
        label: 'Dashboards',
        icon: 'template',
        type: 'menu',
        route:'rapidresponse/forecastingdashboards'
      },  

     
      
      {
        id: 'tangibleinside',
        
        label: ['CoreIntel', <sup style={{ fontSize: '0.7em', verticalAlign: 'super' }}>™</sup>, ' Technologies'],
        icon: 'plus-circle',
        type: 'menu',
        route: 'rapidresponse/tangibleinside'
      },
      {
        id: 'configurableapplications',
        label: 'Configurable Applications',
        icon: 'template',
        type: 'menu',
        route:'rapidresponse/configurableapplications'
      },  

      {
        id: 'winslowapplications',
        label: 'Winslow Applications',
        icon: 'template',
        type: 'menu',
        route:'rapidresponse/winslowapplications'
      },  

 
      {
        id: 'sandbox',
        label: ['AIDA', <sup style={{ fontSize: '0.7em', verticalAlign: 'super' }}>™</sup>, ' Design Center'],
        icon: 'plus-circle',
        type: 'menu',
        route: 'rapidresponse/rapidprototyping',
        sidebarRoute: 'sandboxsidebar'

      },

     





     
    ]
  };
export const getNavigationItem = (id) => {
  const findItem = (items) => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.submenuItems) {
        const found = findItem(item.submenuItems);
        if (found) return found;
      }
    }
    return null;
  };

  return findItem(rapidreviewConfig.mainItems);
};



  export default rapidreviewConfig;
