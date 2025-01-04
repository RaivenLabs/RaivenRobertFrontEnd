// Configuration data structure
export const configurationData = {
    
    settings: {
        company_report: {
            current_customer_id: "TECH001",
            description: "Selected company profile to display",
            options: [
                { id: "TECH001", name: "Hawkeye Holdings" },
                { id: "LAW001", name: "Eversheds Sutherland" },
                { id: "LAW002", name: "Dentons" },
                { id: "IND001", name: "3M Company" },
                { id: "RET001", name: "Nike, Inc." }
            ]
        },
        welcome_screen: {
            current_template: "TECH001",
            description: "Welcome screen customization",
            options: [
                { 
                    id: "TECH001",
                    name: "Hawkeye Holdings",
                    indexFile: "indexHawkeye.html",
                    welcomeTitle: "Welcome to Hawkeye Platform",
                    welcomeSubtitle: "AI-Powered Enterprise Solutions"
                },
                { 
                    id: "LAW001",
                    name: "Eversheds Sutherland",
                    indexFile: "indexEversheds.html",
                    welcomeTitle: "Welcome to Eversheds Platform",
                    welcomeSubtitle: "Global Legal Excellence"}

                ]
            },

            application_dock: {
                current_customer_id: "TECH001",
                description: "Application dock branding",
                options: [
                    {
                        id: "TECH001",
                        name: "Hawkeye Holdings",
                        dockTitle: "Hawkeye Application Dock",
                        dockSubtitle: "Enterprise Solutions Hub",
                        theme: {
                            primaryColor: "#2C3E50",
                            accentColor: "#3498DB"
                        }
                    },
                    {
                        id: "LAW001",
                        name: "Eversheds Sutherland",
                        dockTitle: "Eversheds Application Dock",
                        dockSubtitle: "Legal Solutions Center",
                        theme: {
                            primaryColor: "#003366",
                            accentColor: "#0066CC"
                        }
                    }
                    // Add other customer dock configurations
                ]
            },
            house_apps: {
                current_customer_id: "TECH001",
                description: "House applications customization",
                options: [
                    {
                        id: "TECH001",
                        name: "Hawkeye Holdings",
                        appTitle: "Hawkeye Enterprise Apps",
                        customizations: {
                            appraisals: {
                                title: "Performance Analytics",
                                icon: "chart-bar"
                            },
                            reporting: {
                                title: "Enterprise Insights",
                                icon: "trending-up"
                            }
                        }
                    },
                    {
                        id: "LAW001",
                        name: "Eversheds Sutherland",
                        appTitle: "Eversheds Legal Apps",
                        customizations: {
                            appraisals: {
                                title: "Practice Reviews",
                                icon: "scale"
                            },
                            reporting: {
                                title: "Matter Analytics",
                                icon: "file-text"
                            }
                        }
                    }
                    // Add other customer app configurations
                ]
            },

    
    
        // Add other configuration groups as needed
        system_settings: {
            theme: "light",
            default_view: "dashboard",
            enable_analytics: true
        },
        user_preferences: {
            default_section: "company_report",
            notifications_enabled: true
        }
    }
};

// Helper Functions

// Get entire configuration
export const getFullConfiguration = () => {
    return configurationData;
};

// Get specific setting by key path (e.g., "company_report.current_customer_id")
export const getSetting = (keyPath) => {
    try {
        return keyPath.split('.').reduce((obj, key) => obj[key], configurationData.settings);
    } catch (error) {
        console.error(`Setting not found for path: ${keyPath}`);
        return null;
    }
};

// Get configuration group
export const getConfigurationGroup = (groupName) => {
    return configurationData.settings[groupName];
};

// Get all available options for a configurable item
export const getConfigurationOptions = (groupName, settingName) => {
    const group = configurationData.settings[groupName];
    return group && group[settingName]?.options || [];
};

// Get current value for a setting
export const getCurrentValue = (groupName, settingName) => {
    const group = configurationData.settings[groupName];
    return group && group[settingName];
};

// Validate setting value against available options
export const validateSettingValue = (groupName, settingName, value) => {
    const options = getConfigurationOptions(groupName, settingName);
    if (!options.length) return true; // If no options defined, assume valid
    return options.some(option => option.id === value || option === value);
};

// Save configuration changes (to be implemented with backend storage)
export const saveSetting = async (groupName, settingName, value) => {
    if (!validateSettingValue(groupName, settingName, value)) {
        throw new Error(`Invalid value for ${groupName}.${settingName}`);
    }
    
    // For now, save to localStorage
    try {
        const storageKey = `config_${groupName}_${settingName}`;
        localStorage.setItem(storageKey, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('Error saving configuration:', error);
        throw error;
    }
};

// Load saved configuration (to be implemented with backend storage)
export const loadSavedConfiguration = async () => {
    // This would typically load from backend
    // For now, return default configuration
    return configurationData;
};

// Get configuration history (for audit purposes)
export const getConfigurationHistory = async () => {
    // This would typically fetch from backend
    return [];
};

// Reset configuration to defaults
export const resetConfiguration = async (groupName = null) => {
    if (groupName) {
        // Reset specific group
        configurationData.settings[groupName] = { ...defaultSettings[groupName] };
    } else {
        // Reset all
        configurationData.settings = { ...defaultSettings };
    }
    return true;
};

// Validate entire configuration
export const validateConfiguration = () => {
    // Add validation logic here
    return true;
};

// Export helper functions
export const helpers = {
    getFullConfiguration,
    getSetting,
    getConfigurationGroup,
    getConfigurationOptions,
    getCurrentValue,
    validateSettingValue,
    saveSetting,
    loadSavedConfiguration,
    getConfigurationHistory,
    resetConfiguration,
    validateConfiguration
};

export default configurationData;