// /static/config/index.js

// Export the configuration service instance and class
export { configService, ConfigurationService } from './configuration_service.js';

// Export the active configuration and its structure
export { 
    activeConfiguration,
    configurationStructure 
} from './active_configuration.js';

// Export common configuration utilities
export const configUtils = {
    // Check if a configuration value exists
    hasValue: (obj, path) => {
        return path.split('.').every(key => {
            if (obj === null || obj === undefined) return false;
            obj = obj[key];
            return true;
        });
    },

    // Deep merge configuration objects
    mergeConfigs: (target, source) => {
        for (const key in source) {
            if (source[key] instanceof Object && !Array.isArray(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                configUtils.mergeConfigs(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
        return target;
    },

    // Format configuration paths
    formatPath: (...parts) => parts.filter(Boolean).join('.'),

    // Get customer list
    getCustomerList: () => {
        const { activeConfiguration } = require('./active_configuration.js');
        return Object.keys(activeConfiguration.settings.company_report);
    }
};

// Export common configuration types
export const ConfigTypes = {
    COMPANY_REPORT: 'company_report',
    WELCOME_SCREEN: 'welcome_screen',
    APPLICATION_DOCK: 'application_dock',
    HOUSE_APPS: 'house_apps'
};

// Export configuration events
export const ConfigEvents = {
    UPDATED: 'config:updated',
    CUSTOMER_CHANGED: 'config:customer-changed',
    INITIALIZED: 'config:initialized'
};

// Example usage:
/*
import { 
    configService,
    configUtils,
    ConfigTypes,
    ConfigEvents 
} from '/static/config/index.js';

// Initialize configuration
await configService.initialize();

// Get configuration for a customer
const customerConfig = configService.getCustomerSettings('TECH001');

// Check if a feature exists
const hasFeature = configUtils.hasValue(customerConfig, 'features.analytics.enabled');

// Listen for configuration changes
configService.subscribe((newConfig) => {
    console.log('Configuration updated:', newConfig);
});
*/