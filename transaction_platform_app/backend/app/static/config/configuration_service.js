// /static/config/configuration_service.js

class ConfigurationService {
    constructor() {
        this.config = null;
        this.initialized = false;
        this.subscribers = new Set(); // For notifying components of changes
    }

    async initialize() {
        if (this.initialized) return;

        try {
            // Initially load configuration
            await this.loadConfiguration();
            this.initialized = true;
            console.log('✅ Configuration service initialized');
        } catch (error) {
            console.error('❌ Error initializing configuration service:', error);
            throw error;
        }
    }

    async loadConfiguration() {
        try {
            // For now, we'll load from a static configuration file
            // Later this will be replaced with S3 or RDS fetch
            const { activeConfiguration } = await import('./active_configuration.js');
            this.config = activeConfiguration;
            
            // Notify subscribers of configuration update
            this.notifySubscribers();
            
            return this.config;
        } catch (error) {
            console.error('Error loading configuration:', error);
            throw error;
        }
    }

    async saveConfiguration(newConfig) {
        try {
            // Validate new configuration
            this.validateConfiguration(newConfig);

            // For now, store in localStorage as temporary solution
            // Later this will be replaced with S3 or RDS save
            localStorage.setItem('platformConfig', JSON.stringify({
                ...newConfig,
                lastUpdated: new Date().toISOString()
            }));

            // Update current configuration
            this.config = newConfig;
            
            // Notify subscribers of configuration update
            this.notifySubscribers();
            
            return true;
        } catch (error) {
            console.error('Error saving configuration:', error);
            throw error;
        }
    }

    // Get configuration value by path (e.g., 'settings.company_report.customerId')
    getValue(path) {
        if (!this.config) {
            throw new Error('Configuration not loaded');
        }
        return path.split('.').reduce((obj, key) => obj?.[key], this.config);
    }

    // Get all settings for a specific customer
    getCustomerSettings(customerId) {
        if (!this.config) {
            throw new Error('Configuration not loaded');
        }
        
        return {
            companyReport: this.getValue(`settings.company_report.${customerId}`),
            welcomeScreen: this.getValue(`settings.welcome_screen.${customerId}`),
            applicationDock: this.getValue(`settings.application_dock.${customerId}`),
            houseApps: this.getValue(`settings.house_apps.${customerId}`)
        };
    }

    // Update settings for a specific customer
    async updateCustomerSettings(customerId, newSettings) {
        if (!this.config) {
            throw new Error('Configuration not loaded');
        }

        const updatedConfig = {
            ...this.config,
            activeCustomerId: customerId,
            settings: {
                ...this.config.settings,
                ...newSettings
            }
        };

        await this.saveConfiguration(updatedConfig);
    }

    // Subscribe to configuration changes
    subscribe(callback) {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback); // Return unsubscribe function
    }

    // Notify all subscribers of configuration changes
    notifySubscribers() {
        this.subscribers.forEach(callback => callback(this.config));
    }

    // Validate configuration object
    validateConfiguration(config) {
        const requiredFields = ['version', 'activeCustomerId', 'settings'];
        const requiredSettings = ['company_report', 'welcome_screen', 'application_dock', 'house_apps'];

        // Check required top-level fields
        requiredFields.forEach(field => {
            if (!(field in config)) {
                throw new Error(`Missing required field: ${field}`);
            }
        });

        // Check required settings
        requiredSettings.forEach(setting => {
            if (!(setting in config.settings)) {
                throw new Error(`Missing required setting: ${setting}`);
            }
        });

        // Additional validation can be added here
        return true;
    }

    // Get current active customer ID
    getActiveCustomerId() {
        return this.config?.activeCustomerId;
    }

    // Check if a feature is enabled
    isFeatureEnabled(featurePath) {
        try {
            return this.getValue(`settings.features.${featurePath}`) === true;
        } catch {
            return false;
        }
    }
}

// Create and export a singleton instance
export const configService = new ConfigurationService();

// Additionally export the class if needed for testing or specialized instances
export const ConfigurationService = ConfigurationService;