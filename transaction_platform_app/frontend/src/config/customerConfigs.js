// src/config/customerConfigs.js
import { CUSTOMER_TYPES } from '../constants/customerTypes';

export const CUSTOMER_CONFIGS = {
  [CUSTOMER_TYPES.GLOBAL]: {
    id: CUSTOMER_TYPES.GLOBAL,
    company_name: 'Hawkeye',
    menu_config: {
      briefing_room_text: 'Briefing Room',
      applications_dock_text: 'Applications Dock'
    },
    templates: {
      saas_agreement: '/templates/hawkeye/saas_agreement.html',
      msa: '/templates/hawkeye/msa.html'
    },
    theme: {
      primary: 'royalBlue',
      secondary: 'cyan'
    }
  },
  
  [CUSTOMER_TYPES.LAW_FIRM]: {
    id: CUSTOMER_TYPES.LAW_FIRM,
    company_name: 'Law Firm',  // Default name for testing
    menu_config: {
      briefing_room_text: 'Briefing Room',
      applications_dock_text: 'Applications Dock'
    },
    templates: {
      saas_agreement: '/templates/law_firm/saas_agreement.html',
      msa: '/templates/law_firm/msa.html'
    },
    theme: {
      primary: 'navy',
      secondary: 'gold'
    }
  },
  
  [CUSTOMER_TYPES.ENTERPRISE]: {
    id: CUSTOMER_TYPES.ENTERPRISE,
    company_name: 'Enterprise',  // Default name for testing
    menu_config: {
      briefing_room_text: 'Briefing Room',
      applications_dock_text: 'Applications Dock'
    },
    templates: {
      saas_agreement: '/templates/enterprise/saas_agreement.html',
      msa: '/templates/enterprise/msa.html'
    },
    theme: {
      primary: 'blue',
      secondary: 'silver'
    }
  },
  
  [CUSTOMER_TYPES.TANGIBLE]: {
    id: CUSTOMER_TYPES.TANGIBLE,
    company_name: 'Tangible',
    menu_config: {
      briefing_room_text: 'Briefing Room',
      applications_dock_text: 'Applications Dock'
    },
    templates: {
      saas_agreement: '/templates/tangible/saas_agreement.html',
      msa: '/templates/tangible/msa.html'
    },
    theme: {
      primary: 'royalBlue',
      secondary: 'cyan'
    }
  }
};

export const getBaseCustomerConfig = (type) => {
  console.log('Getting base config for type:', type);
  const config = CUSTOMER_CONFIGS[type];
  console.log('Returning config:', config);
  return config || CUSTOMER_CONFIGS[CUSTOMER_TYPES.GLOBAL]; // Fallback to global if type not found
};
