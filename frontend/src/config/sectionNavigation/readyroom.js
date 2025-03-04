// src/config/sectionNavigation/buildkits.js
const readyroomConfig = {
    sectionItems: [
      {
        id: 'readyroomoverview',
        label: 'Overview',
        icon: 'plus-circle',
        type: 'menu',
        route:'readyroom/overview'

      },
      {
        id: 'readyroomlearn',
        label: 'Learn',
        icon: 'template',
        type: 'menu',
        route:'readyroom/learn',
        hasSubmenu: true,
        submenuItems: [
          { id: 'saas', label: 'SaaS Agreements', type: 'template' },
          { id: 'consulting', label: 'Consulting Agreements', type: 'template' },
          { id: 'licensing', label: 'Licensing Agreements', type: 'template' }
        ]
      },
      {
        id: 'readyroomresearch',
        label: 'Research',
        icon: 'folder',
        type: 'menu',
        route:'readyroom/research'
      },
      {
        id: 'readyroomteach',
        label: 'Teach',
        icon: 'share',
        type: 'menu'
      },
      {
        id: 'readyroomgather',
        label: 'Gather',
        icon: 'clock',
        type: 'menu'
      },
      {
        id: 'readyroomlibrary',
        label: 'Ready Room Library',
        icon: 'archive',
        type: 'menu',
        route:'readyroom/library'
      },

      





    ]
  };
  export default readyroomConfig;
