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
        id: 'companyapplications',
        label: 'Enterprise Applications',
        icon: 'template',
        type: 'menu',
        route:'rapidresponse/enterpriseapplications'
      },  

      {
        id: 'teamapplications',
        label: 'Team Applications',
        icon: 'template',
        type: 'menu',
        route:'rapidresponse/industryapplications'
      },  

      {
        id: 'partnerapplications',
        label: 'Engagement Applications',
        icon: 'template',
        type: 'menu',
        route:'rapidresponse/partnerapplications'
      },  
      
      {
        id: 'tangibleinside',
        
        label: ['CoreIntel', <sup style={{ fontSize: '0.7em', verticalAlign: 'super' }}>™</sup>, ' Applications'],
        icon: 'plus-circle',
        type: 'menu',
        route: 'rapidresponse/tangibleinside'
      },
 
      {
        id: 'sandbox',
        label: 'Application Design',
        icon: 'plus-circle',
        type: 'menu',
        route: 'rapidresponse/rapidprototyping'

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
