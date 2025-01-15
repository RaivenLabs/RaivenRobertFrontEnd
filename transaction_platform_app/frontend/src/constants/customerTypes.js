
export const CUSTOMER_TYPES = {
    TANGIBLE: 'TANGIBLE',
    GLOBAL: 'GLOBAL',
    LAW_FIRM: 'LAW_FIRM',
    ENTERPRISE: 'ENTERPRISE'
  };
  

  export const CUSTOMER_CONFIGS = {
    [CUSTOMER_TYPES.GLOBAL]: {
      id: CUSTOMER_TYPES.GLOBAL,
      company_name: 'Hawkeye',
      menu_config: {
        briefing_room_text: 'Hawkeye Briefing Room',
        applications_dock_text: 'Hawkeye Applications Dock'
      }
    },

    [CUSTOMER_TYPES.TANGIBLE]: {  // Add this configuration
      id: CUSTOMER_TYPES.TANGIBLE,
      company_name: 'Tangible Intelligence',
      menu_config: {
        briefing_room_text: 'Tangible Briefing Room',
        applications_dock_text: 'Tangible Applications Dock'
      }
    },
    
    [CUSTOMER_TYPES.ENTERPRISE]: {
      id: CUSTOMER_TYPES.ENTERPRISE,
      company_name: 'Enterprise Customer',
      menu_config: {
        briefing_room_text: 'Enterprise Briefing Room',
        applications_dock_text: 'Enterprise Applications Dock'
      }
    },
    [CUSTOMER_TYPES.LAW_FIRM]: {
      id: CUSTOMER_TYPES.LAW_FIRM,
      company_name: 'Law Firm Customer',
      menu_config: {
        briefing_room_text: 'Law Firm Briefing Room',
        applications_dock_text: 'Law Firm Applications Dock'
      }
    },
    [CUSTOMER_TYPES.TANGIBLE]: {
      id: CUSTOMER_TYPES.TANGIBLE,
      company_name: 'Tangible',
      menu_config: {
        briefing_room_text: 'Tangible Briefing Room',
        applications_dock_text: 'Tangible Applications Dock'
      }
    }
  };
  
  export const getBaseCustomerConfig = (type) => {
    console.log('🔍 Getting base config for type:', type);
    
    // Direct lookup - if LAW_FIRM matches LAW_FIRM
    const config = CUSTOMER_CONFIGS[type];
    
    if (config) {
      console.log(`✅ Found exact match for ${type}`);
      return config;
    }
  
    console.warn(`⚠️ No direct match for ${type}, using GLOBAL`);
    return CUSTOMER_CONFIGS[CUSTOMER_TYPES.GLOBAL];
  };
