import { useState } from 'react';
import { useConfig } from '../context/ConfigContext';
import { fetchFromAPI } from '../utils/api/api';

// Pure utilities for ConfigProvider
export const loadCustomerInstancesUtil = async (apiUrl) => {
  try {
    console.log('🔍 Starting to fetch customer instances...');
    const response = await fetchFromAPI('/api/config/customer-instances', apiUrl);
    console.log('📦 Received data:', response);
    return response.CUSTOMER_INSTANCES;
  } catch (error) {
    console.error('❌ Error loading customer instances:', error);
    throw error;
  }
};

export const getCustomerInstanceUtil = (instances, customerId) => {
  const customerInstance = instances[customerId];
  if (!customerInstance) {
    console.warn(`No configuration found for customer ID: ${customerId}`);
    return null;
  }
  return customerInstance;
};

// Hook version for components
export const useCustomerInstances = () => {
  const { coreconfig } = useConfig();
  const [customerInstances, setCustomerInstances] = useState({});

  const loadInstances = async () => {
    const data = await loadCustomerInstancesUtil(coreconfig.apiUrl);
    setCustomerInstances(data);
  };

  const getInstance = (customerId) => {
    return getCustomerInstanceUtil(customerInstances, customerId);
  };

  return {
    customerInstances,
    loadCustomerInstances: loadInstances,
    getCustomerInstance: getInstance
  };
};
