import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import coreconfig from '../coreconfig';
import { loadCustomerInstancesUtil, getCustomerInstanceUtil } from '../config/customerInstancesLogic';
import { getBaseCustomerConfig } from '../config/customerConfigs';

const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  const { isAuthenticated, userGroups } = useAuth();
  const [customerType, setCustomerType] = useState('global');
  const [customerId, setCustomerId] = useState('HAWKEYE');
  const [config, setConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const customerDisplayName = config?.company_name || 'Hawkeye';
  const [instances, setInstances] = useState({});

  // Function to determine customer ID from groups
  const getCustomerIdFromGroups = useCallback((customerInstances, groups) => {
    console.log('🔍 Matching groups to instances:', {
      availableGroups: groups,
      customerInstances: Object.keys(customerInstances)
    });
    
    if (!groups || groups.length === 0) {
      console.log('⚠️ No groups available, defaulting to HAWKEYE');
      return 'HAWKEYE';
    }
    
    for (const instance of Object.values(customerInstances)) {
      if (instance.cognito_group && groups.includes(instance.cognito_group)) {
        console.log('✅ Found matching customer:', {
          group: instance.cognito_group,
          customerId: instance.id
        });
        return instance.id;
      }
    }
    
    console.log('⚠️ No matching customer found, defaulting to HAWKEYE');
    return 'HAWKEYE';
  }, []);

  const updateCustomerConfig = useCallback(async (newCustomerId, newType) => {
    console.log('🔄 Starting config update:', { newCustomerId, newType });
    
    const baseConfig = getBaseCustomerConfig(newType);
    console.log('📦 Base config:', baseConfig);

    if (newCustomerId) {
      const customerInstance = getCustomerInstanceUtil(instances, newCustomerId);
      if (customerInstance) {
        console.log('🏢 Customer instance:', customerInstance);

        const mergedConfig = {
          ...baseConfig,
          ...customerInstance,
          datapath: customerInstance.datapath,
          menu_config: {
            ...baseConfig.menu_config,
            side_bar_text: `${customerInstance.company_name} ${baseConfig.menu_config.side_bar_text}`,
            briefing_room_text: `${customerInstance.company_name} ${baseConfig.menu_config.briefing_room_text}`,
            applications_dock_text: `${customerInstance.company_name} ${baseConfig.menu_config.applications_dock_text}`
          }
        };

        console.log('✨ Merged config with datapath:', {
          config: mergedConfig,
          datapath: mergedConfig.datapath
        });

        setConfig(mergedConfig);
      } else {
        console.log('⚠️ No customer instance found, using base config');
        setConfig(baseConfig);
      }
    } else {
      console.log('ℹ️ No customer ID provided, using base config');
      setConfig(baseConfig);
    }
  }, [instances]);

  // Initial load effect
  useEffect(() => {
    const loadInitialConfig = async () => {
      try {
        console.log('🚀 Loading initial configuration...');
        const customerInstances = await loadCustomerInstancesUtil(coreconfig.apiUrl);
        console.log('📦 Loaded customer instances:', customerInstances);
        setInstances(customerInstances);

        if (!isAuthenticated) {
          console.log('🔄 Loading default HAWKEYE configuration');
          const hawkeye = customerInstances.HAWKEYE;
          
          setCustomerId('HAWKEYE');
          setCustomerType('GLOBAL');

          const baseConfig = getBaseCustomerConfig('GLOBAL');
          const mergedConfig = {
            ...baseConfig,
            ...hawkeye,
            datapath: hawkeye.datapath,
            menu_config: {
              ...baseConfig.menu_config,
              side_bar_text: `${hawkeye.company_name} ${baseConfig.menu_config.side_bar_text}`,
              briefing_room_text: `${hawkeye.company_name} ${baseConfig.menu_config.briefing_room_text}`,
              applications_dock_text: `${hawkeye.company_name} ${baseConfig.menu_config.applications_dock_text}`
            }
          };

          setConfig(mergedConfig);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('❌ Initial config loading error:', error);
        setIsLoading(false);
      }
    };

    loadInitialConfig();
  }, [isAuthenticated]);

  // Auth change effect
  useEffect(() => {
    const updateConfigOnAuth = async () => {
      try {
        console.log('📊 Auth state:', { 
          isAuthenticated, 
          userGroupsLength: userGroups?.length, 
          hasInstances: !!Object.keys(instances).length 
        });
        
        if (!isAuthenticated) {
          console.log('⚠️ Not authenticated, skipping config update');
          return;
        }
        
        if (userGroups?.length > 0 && Object.keys(instances).length > 0) {
          const determinedCustomerId = getCustomerIdFromGroups(instances, userGroups);
          console.log('🎯 Determined customer ID:', determinedCustomerId);
          
          const customerInstance = instances[determinedCustomerId];
          if (customerInstance) {
            console.log('✨ Setting config for customer:', customerInstance);
            setCustomerId(determinedCustomerId);
            await updateCustomerConfig(
              determinedCustomerId,
              customerInstance.customer_type || 'global'
            );
          } else {
            console.log('⚠️ No customer instance found, defaulting to HAWKEYE');
            setCustomerId('HAWKEYE');
            const hawkeye = instances.HAWKEYE;
            await updateCustomerConfig('HAWKEYE', hawkeye.customer_type || 'global');
          }
        }
      } catch (error) {
        console.error('❌ Auth config update error:', error);
      }
    };
    
    updateConfigOnAuth();
  }, [isAuthenticated, userGroups, instances, updateCustomerConfig, getCustomerIdFromGroups]);

  // Logout effect
  useEffect(() => {
    const handleLogout = async () => {
      try {
        if (!isAuthenticated && Object.keys(instances).length > 0) {
          console.log('👋 Config: Detected logout, reverting to HAWKEYE');
          const hawkeye = instances.HAWKEYE;
          
          if (hawkeye) {
            setCustomerId('HAWKEYE');
            setCustomerType('GLOBAL');

            const baseConfig = getBaseCustomerConfig('GLOBAL');
            const mergedConfig = {
              ...baseConfig,
              ...hawkeye,
              datapath: hawkeye.datapath,
              menu_config: {
                ...baseConfig.menu_config,
                side_bar_text: `${hawkeye.company_name} ${baseConfig.menu_config.side_bar_text}`,
                briefing_room_text: `${hawkeye.company_name} ${baseConfig.menu_config.briefing_room_text}`,
                applications_dock_text: `${hawkeye.company_name} ${baseConfig.menu_config.applications_dock_text}`
              }
            };

            console.log('✨ Setting HAWKEYE config after logout');
            setConfig(mergedConfig);
          }
        }
      } catch (error) {
        console.error('❌ Error reverting to HAWKEYE config:', error);
      }
    };

    handleLogout();
  }, [isAuthenticated, instances]);

  // Helper to check if user has access to a specific customer
  const hasCustomerAccess = useCallback((checkCustomerId) => {
    console.log(`🔐 Checking access for: ${checkCustomerId}`, {
      userGroups,
      isHawkeye: checkCustomerId === 'HAWKEYE'
    });
    
    if (checkCustomerId === 'HAWKEYE') {
      console.log('✅ HAWKEYE access granted by default');
      return true;
    }
    
    const instance = instances[checkCustomerId];
    const hasAccess = instance && userGroups.includes(instance.cognito_group);
    console.log(`${hasAccess ? '✅' : '❌'} Access result for ${checkCustomerId}:`, {
      hasInstance: !!instance,
      matchingGroup: instance?.cognito_group
    });
    
    return hasAccess;
  }, [userGroups, instances]);

  const contextValue = {
    customerType,
    customerId,
    config,
    userGroups,
    updateCustomerConfig,
    updateCustomerType: useCallback((type) => setCustomerType(type), []),
    setCustomerId,
    hasCustomerAccess,
    isLoading,
    coreconfig,
    customerDisplayName,
    instances,
    isAuthenticated  // Added isAuthenticated to the context value
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
