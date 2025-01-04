// In ConfigContext.jsx
import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import { getBaseCustomerConfig } from '../config/customerConfigs';
import { getCustomerInstance } from '../config/customerInstances';

const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  const [customerType, setCustomerType] = useState('global');
  const [config, setConfig] = useState(null);

  const updateCustomerConfig = async (customerId, newType) => {
    console.log('Updating customer config:', { customerId, newType });
    
    // Update customer type
    setCustomerType(newType);
    
    // Get base config for the customer type
    const baseConfig = getBaseCustomerConfig(newType);
    
    // If we have a specific customer, merge with their specific settings
    if (customerId) {
      const customerInstance = getCustomerInstance(customerId);
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
    updateCustomerConfig, // Expose the new function
    updateCustomerType: (type) => setCustomerType(type), // Keep for backward compatibility
  };

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
