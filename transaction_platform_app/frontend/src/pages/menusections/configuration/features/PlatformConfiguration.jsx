import React, { useState, useEffect } from 'react';
import { useConfig } from '../../../../context/ConfigContext';
import { CUSTOMER_TYPES } from '../../../../constants/customerTypes';
import { useCustomerInstances } from '../../../../config/customerInstancesLogic';
import { 
  Settings, Shield, Database, Globe, 
  Building2, Server, BarChart3, 
  FileText, AlertCircle
} from 'lucide-react';

const CustomerSelector = () => {
  const { config, updateCustomerConfig } = useConfig();
  const { customerInstances, loadCustomerInstances } = useCustomerInstances();
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeCustomers = async () => {
      try {
        await loadCustomerInstances();
      } catch (error) {
        console.error('Error loading customer instances:', error);
      } finally {
        setIsLoading(false);
      }
    };
    initializeCustomers();
  }, [loadCustomerInstances]);

  const getAllCustomers = () => {
    // Add system customers
    const systemCustomers = [
      { 
        id: 'HAWKEYE', 
        company_name: 'Hawkeye', 
        customer_type: String(CUSTOMER_TYPES.GLOBAL)
      },
      { 
        id: 'TANGIBLE', 
        company_name: 'Tangible', 
        customer_type: String(CUSTOMER_TYPES.TANGIBLE)
      }
    ];

    const instanceValues = Object.values(customerInstances).map(customer => ({
      ...customer,
      customer_type: String(customer.customer_type)
    }));

    return [...systemCustomers, ...instanceValues];
  };

  const handleCustomerChange = (customerId) => {
    const customer = getAllCustomers().find(c => c.id === customerId);
    if (customer) {
      setSelectedCustomer(customerId);
      updateCustomerConfig(customerId, customer.customer_type);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-center">
          <span>Loading customer data...</span>
        </div>
      </div>
    );
  }

  const allCustomers = getAllCustomers();
  console.log('allCustomers before grouping:', allCustomers);
  
  const groupedCustomers = {
    [CUSTOMER_TYPES.LAW_FIRM]: allCustomers.filter(c => c.customer_type === 'LAW_FIRM'),
    [CUSTOMER_TYPES.ENTERPRISE]: allCustomers.filter(c => c.customer_type === 'ENTERPRISE'),
    'PLATFORM': allCustomers.filter(c => ['GLOBAL', 'TANGIBLE'].includes(c.customer_type))
  };
  
  console.log('groupedCustomers after filtering:', groupedCustomers);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center mb-4">
        <Building2 className="w-6 h-6 text-royalBlue mr-3" />
        <h3 className="text-xl font-semibold">Customer Selection</h3>
      </div>
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Select Customer
        </label>
        <select
          value={selectedCustomer}
          onChange={(e) => handleCustomerChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-royalBlue focus:ring-1 focus:ring-royalBlue"
        >
          <option value="">Select a customer</option>
          <optgroup label="Law Firms">
            {(groupedCustomers[CUSTOMER_TYPES.LAW_FIRM] || []).map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.company_name}
              </option>
            ))}
          </optgroup>
          <optgroup label="Enterprise Customers">
            {(groupedCustomers[CUSTOMER_TYPES.ENTERPRISE] || []).map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.company_name}
              </option>
            ))}
          </optgroup>
          <optgroup label="Platform">
            {(groupedCustomers['PLATFORM'] || []).map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.company_name}
              </option>
            ))}
          </optgroup>
        </select>
        {selectedCustomer && (
          <div className="mt-4 p-3 bg-lightGray rounded-md flex items-center">
            <AlertCircle className="w-4 h-4 text-royalBlue mr-2" />
            <span className="text-sm">
              Active Customer: <span className="font-medium">
                {allCustomers.find(c => c.id === selectedCustomer)?.company_name}
              </span>
              <br />
              <span className="text-xs text-gray-600">
                Type: {allCustomers.find(c => c.id === selectedCustomer)?.customer_type}
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const PlatformConfiguration = () => {
  const [activeSection, setActiveSection] = useState('testing');

  const configSections = [
    {
      id: 'testing',
      label: 'Testing',
      icon: <Settings className="w-5 h-5" />,
    },
    {
      id: 'customer-management',
      label: 'Customers',
      icon: <Building2 className="w-5 h-5" />,
    },
    {
      id: 'system',
      label: 'System',
      icon: <Server className="w-5 h-5" />,
    },
    {
      id: 'security',
      label: 'Security',
      icon: <Shield className="w-5 h-5" />,
    },
    {
      id: 'templates',
      label: 'Templates',
      icon: <FileText className="w-5 h-5" />,
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'testing':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CustomerSelector />

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <Settings className="w-6 h-6 text-royalBlue mr-3" />
                <h3 className="text-xl font-semibold">Environment Controls</h3>
              </div>
              <div className="space-y-3">
                <button className="w-full p-3 bg-lightGray hover:bg-gray-200 rounded-md text-left flex items-center justify-between group">
                  <span>Reset Test Environment</span>
                  <Settings className="w-4 h-4 text-gray-500 group-hover:text-royalBlue" />
                </button>
                <button className="w-full p-3 bg-lightGray hover:bg-gray-200 rounded-md text-left flex items-center justify-between group">
                  <span>Load Sample Data</span>
                  <Database className="w-4 h-4 text-gray-500 group-hover:text-royalBlue" />
                </button>
                <button className="w-full p-3 bg-lightGray hover:bg-gray-200 rounded-md text-left flex items-center justify-between group">
                  <span>Clear Test Data</span>
                  <AlertCircle className="w-4 h-4 text-gray-500 group-hover:text-royalBlue" />
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Select a configuration area</div>;
    }
  };

  return (
    <div className="h-full bg-ivory">
      <div className="bg-royalBlue shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-1">
            {configSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-3 flex items-center space-x-2 text-sm font-medium transition-colors
                          ${activeSection === section.id 
                            ? 'text-white border-b-2 border-white' 
                            : 'text-blue-100 hover:text-white'}`}
              >
                {section.icon}
                <span>{section.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            {configSections.find(s => s.id === activeSection)?.label} Settings
          </h1>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default PlatformConfiguration;
