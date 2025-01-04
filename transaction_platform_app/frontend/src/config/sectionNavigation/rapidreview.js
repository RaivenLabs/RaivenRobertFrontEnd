// src/config/sectionNavigation/rapidreview.js
const rapidreviewConfig = {
    sectionItems: [
      {
        id: 'overview',
        label: 'An Overview',
        icon: 'folder',
        type: 'menu',
        route:'rapidresponse/overview'
      },
      
      
      
      {
        id: 'fastlane',
        label: 'Fast Lane Builds',
        icon: 'plus-circle',
        type: 'action',
        route: 'rapidresponse/fastlane'

      },
      {
        id: 'quickread',
        label: 'Quick Read',
        icon: 'template',
        type: 'menu',
        route:'rapidresponse/quickread'

       
      }
     
    ]
  };
  export default rapidreviewConfig;
