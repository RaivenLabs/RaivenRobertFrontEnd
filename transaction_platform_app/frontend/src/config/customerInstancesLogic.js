import { fetchFromAPI } from '../utils/api/api';
import { CUSTOMER_TYPES } from '../constants/customerTypes';
import { getBaseCustomerConfig } from './customerConfigs';

let CUSTOMER_INSTANCES = {};

export const loadCustomerInstances = async () => {
  try {
    console.log('🔍 Starting to fetch customer instances...');
    const response = await fetchFromAPI('/api/config/customer-instances');
    console.log('📦 Received data:', response);
    
    // Extract the CUSTOMER_INSTANCES object from the response
    CUSTOMER_INSTANCES = response.CUSTOMER_INSTANCES;
    console.log('✅ Loaded customer instances:', CUSTOMER_INSTANCES);
  } catch (error) {
    console.error('❌ Error loading customer instances:', error);
    throw error;
  }
};

export const getCustomerInstance = (customerId) => {
  const customerInstance = CUSTOMER_INSTANCES[customerId];
  if (!customerInstance) {
    console.warn(`No configuration found for customer ID: ${customerId}`);
    return null;
  }
  return customerInstance;
};

export const getFullCustomerConfig = (customerId) => {
  const instance = getCustomerInstance(customerId);
  if (!instance) return null;
  
  const baseConfig = getBaseCustomerConfig(instance.customer_type);
  
  return {
    ...baseConfig,
    ...instance,
    menu_config: {
      ...baseConfig.menu_config,
      briefing_room_text: `${instance.company_name} Briefing Room`,
      applications_dock_text: `${instance.company_name} Applications Dock`
    },
    features: {
      ...baseConfig.features,
      ...instance.specific_settings.feature_overrides
    }
  };
};

export const createCustomerInstance = (
  customerId,
  customerType,
  companyName,
  specificSettings
) => {
  const newInstance = {
    id: customerId,
    customer_type: customerType,
    company_name: companyName,
    specific_settings: {
      ...specificSettings,
      custom_templates: specificSettings.custom_templates || {},
      feature_overrides: specificSettings.feature_overrides || {}
    }
  };

  CUSTOMER_INSTANCES[customerId] = newInstance;
  return newInstance;
};

// Export CUSTOMER_INSTANCES for use in components
export { CUSTOMER_INSTANCES };
