// src/config/customerInstances.js
import { CUSTOMER_TYPES } from '../constants/customerTypes';
import { getBaseCustomerConfig} from './customerConfigs';

export const CUSTOMER_INSTANCES = {
  // Platform/System Customers
  'HAWKEYE': {
    id: 'HAWKEYE',
    customer_type: CUSTOMER_TYPES.GLOBAL,
    company_name: 'Hawkeye',
    specific_settings: {
      region: 'Global',
      preferred_language: 'en-US',
      custom_templates: {},
      feature_overrides: {
        uses_custom_workflows: true,
        has_enterprise_integration: true
      }
    }
  },

  // Law Firms
  'LAW001EV': {
    id: 'LAW001EV',
    customer_type: CUSTOMER_TYPES.LAW_FIRM,
    company_name: 'Eversheds',
    specific_settings: {
      region: 'EMEA',
      preferred_language: 'en-GB',
      custom_templates: {
        nda: '/templates/customers/eversheds/nda.html',
        msa: '/templates/customers/eversheds/msa.html'
      },
      feature_overrides: {
        uses_custom_templates: true,
        has_advanced_analytics: true
      }
    }
  },

  'LAW002DE': {
    id: 'LAW002DE',
    customer_type: CUSTOMER_TYPES.LAW_FIRM,
    company_name: 'Dentons',
    specific_settings: {
      region: 'Global',
      preferred_language: 'en-US',
      custom_templates: {
        nda: '/templates/customers/dentons/nda.html',
        msa: '/templates/customers/dentons/msa.html'
      },
      feature_overrides: {
        uses_custom_templates: true,
        has_advanced_analytics: true
      }
    }
  },

  // Enterprises
  'ENT0073M': {
    id: 'ENT0073M',
    customer_type: CUSTOMER_TYPES.ENTERPRISE,
    company_name: '3M',
    specific_settings: {
      industry: 'Manufacturing',
      region: 'North America',
      custom_templates: {
        nda: '/templates/customers/3m/nda.html',
        msa: '/templates/customers/3m/msa.html'
      },
      feature_overrides: {
        uses_custom_workflows: true,
        has_enterprise_integration: true
      }
    }
  },

  'ENT002UPS': {
    id: 'ENT002UPS',
    customer_type: CUSTOMER_TYPES.ENTERPRISE,
    company_name: 'UPS',
    specific_settings: {
      industry: 'Logistics',
      region: 'Global',
      custom_templates: {
        nda: '/templates/customers/ups/nda.html',
        msa: '/templates/customers/ups/msa.html'
      },
      feature_overrides: {
        uses_custom_workflows: true,
        has_enterprise_integration: true
      }
    }
  }
};

// Helper functions remain unchanged...
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
      // Remove customer type, just use company name
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
