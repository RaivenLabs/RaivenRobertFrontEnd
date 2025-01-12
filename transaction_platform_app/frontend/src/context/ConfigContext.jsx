import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import coreconfig from '../coreconfig';
import { loadCustomerInstancesUtil, getCustomerInstanceUtil } from '../config/customerInstancesLogic';
import { getBaseCustomerConfig } from '../config/customerConfigs';

const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  const [customerType, setCustomerType] = useState('global');
  const [config, setConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [instances, setInstances] = useState({});

  useEffect(() => {
    const initializeConfig = async () => {
      try {
        const customerInstances = await loadCustomerInstancesUtil(coreconfig.apiUrl);
        setInstances(customerInstances);
        console.log('CoreConfig in ConfigProvider:', coreconfig);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading customer configurations:', error);
        setIsLoading(false);
      }
    };
    initializeConfig();
  }, []);

  const updateCustomerConfig = async (customerId, newType) => {
    console.log('Updating customer config:', { customerId, newType });
    
    // Update customer type
    setCustomerType(newType);
    
    // Get base config for the customer type
    const baseConfig = getBaseCustomerConfig(newType);
    
    // If we have a specific customer, merge with their specific settings
    if (customerId) {
      const customerInstance = getCustomerInstanceUtil(instances, customerId);
      if (customerInstance) {
        const mergedConfig = {
          ...baseConfig,
          ...customerInstance,
          menu_config: {
            ...baseConfig.menu_config,
            briefing_room_text: `${customerInstance.company_name} ${baseConfig.menu_config.briefing_room_text}`,
            applications_dock_text: `${customerInstance.company_name} ${baseConfig.menu_config.applications_dock_text}`
          }
        };
        setConfig(mergedConfig);
      } else {
        setConfig(baseConfig);
      }
    } else {
      setConfig(baseConfig);
    }
  };

  const contextValue = {
    customerType,
    config,
    updateCustomerConfig,
    updateCustomerType: (type) => setCustomerType(type),
    isLoading,
    coreconfig,
    instances  // Make instances available to consumers if needed
  };

  if (isLoading) {
    return <div>Loading configurations...</div>;
  }

  return (
    <ConfigContext.Provider value={contextValue}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

export default ConfigProvider;
