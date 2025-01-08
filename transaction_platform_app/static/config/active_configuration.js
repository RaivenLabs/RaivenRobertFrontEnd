// /static/config/active_configuration.js

export const activeConfiguration = {
    version: "1.0.0",
    lastUpdated: new Date().toISOString(),
    activeCustomerId: "TECH001", // Default to Hawkeye

    settings: {
        company_report: {
            TECH001: {
                customerId: "TECH001",
                name: "Hawkeye Holdings",
                reportTitle: "Hawkeye Enterprise Analytics",
                theme: {
                    primaryColor: "#2C3E50",
                    accentColor: "#3498DB"
                }
            },
            LAW001: {
                customerId: "LAW001",
                name: "Eversheds Sutherland",
                reportTitle: "Eversheds Practice Analytics",
                theme: {
                    primaryColor: "#003366",
                    accentColor: "#0066CC"
                }
            }
        },

        welcome_screen: {
            TECH001: {
                template: "indexHawkeye.html",
                title: "Welcome to Hawkeye Platform",
                subtitle: "AI-Powered Enterprise Solutions",
                welcomeMessage: "Access your enterprise solutions dashboard",
                theme: {
                    primaryColor: "#2C3E50",
                    backgroundColor: "#ECF0F1"
                }
            },
            LAW001: {
                template: "indexEversheds.html",
                title: "Welcome to Eversheds Platform",
                subtitle: "Global Legal Excellence",
                welcomeMessage: "Access your legal practice dashboard",
                theme: {
                    primaryColor: "#003366",
                    backgroundColor: "#F5F8FA"
                }
            }
        },

        application_dock: {
            TECH001: {
                title: "Hawkeye Application Dock",
                subtitle: "Enterprise Solutions Hub",
                theme: {
                    primaryColor: "#2C3E50",
                    secondaryColor: "#3498DB",
                    textColor: "#ECF0F1"
                },
                features: {
                    showAnalytics: true,
                    enableAIAssistant: true
                }
            },
            LAW001: {
                title: "Eversheds Application Dock",
                subtitle: "Legal Solutions Center",
                theme: {
                    primaryColor: "#003366",
                    secondaryColor: "#0066CC",
                    textColor: "#FFFFFF"
                },
                features: {
                    showAnalytics: true,
                    enableAIAssistant: false
                }
            }
        },

        house_apps: {
            TECH001: {
                title: "Hawkeye Enterprise Apps",
                customizations: {
                    appraisals: {
                        title: "Performance Analytics",
                        icon: "chart-bar",
                        enabled: true
                    },
                    reporting: {
                        title: "Enterprise Insights",
                        icon: "trending-up",
                        enabled: true
                    }
                },
                features: {
                    enableCustomReports: true,
                    enableDataExport: true
                }
            },
            LAW001: {
                title: "Eversheds Legal Apps",
                customizations: {
                    appraisals: {
                        title: "Practice Reviews",
                        icon: "scale",
                        enabled: true
                    },
                    reporting: {
                        title: "Matter Analytics",
                        icon: "file-text",
                        enabled: true
                    }
                },
                features: {
                    enableCustomReports: true,
                    enableDataExport: false
                }
            }
        },

        features: {
            analytics: {
                enabled: true,
                defaultDashboard: {
                    TECH001: "enterprise",
                    LAW001: "legal"
                }
            },
            customization: {
                enabled: true,
                allowThemeCustomization: true,
                allowLayoutCustomization: true
            }
        }
    }
};

// Export configuration structure for validation
export const configurationStructure = {
    requiredFields: ['version', 'lastUpdated', 'activeCustomerId', 'settings'],
    settingsStructure: {
        company_report: ['customerId', 'name', 'reportTitle', 'theme'],
        welcome_screen: ['template', 'title', 'subtitle', 'welcomeMessage', 'theme'],
        application_dock: ['title', 'subtitle', 'theme', 'features'],
        house_apps: ['title', 'customizations', 'features']
    }
};