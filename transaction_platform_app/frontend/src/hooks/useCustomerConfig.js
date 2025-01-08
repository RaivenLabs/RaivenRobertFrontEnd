import { fetchFromAPI } from '../utils/api/api';
import { useState, useEffect } from 'react';

const useCustomerConfig = () => {
  const [customerConfig, setCustomerConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const determineCustomerType = async () => {
      try {
        // Get subdomain from current hostname
        const hostname = window.location.hostname;
        const subdomain = hostname.split('.')[0].toLowerCase();

       // Fetch customer configuration
const response = await fetchFromAPI('/api/config/customer-type', {
  method: 'POST',
  body: JSON.stringify({ subdomain })
});

        const config = await response.json();
        setCustomerConfig(config);
      } catch (error) {
        console.error('Error determining customer type:', error);
        // Fall back to standard configuration
        setCustomerConfig({ type: 'standard' });
      } finally {
        setLoading(false);
      }
    };

    determineCustomerType();
  }, []);

  return { customerConfig, loading };
};

export default useCustomerConfig;
