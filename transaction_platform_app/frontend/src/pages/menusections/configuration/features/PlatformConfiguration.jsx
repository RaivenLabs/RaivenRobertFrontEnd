// src/components/platform/PlatformConfiguration.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useConfig } from '../../../../context/ConfigContext';
import { CUSTOMER_TYPES } from '../../../../constants/customerTypes';
import { useAuth } from '../../../../context/AuthContext';
import AuthTester from './AuthTester';
import Authentication from '../../../../components/shared/Authentication';
import { 
  Settings, Shield, Database, Globe, Building2, Server, 
  FileText, AlertCircle, Cloud, Package, Link, Users,
  Briefcase, Scale, Building, Rocket, Gavel, MessageSquare,
  Key, Warehouse, GitBranch, Book, X
} from 'lucide-react';

// Banner Component
const Banner = () => (
  <div className="guide-wrapper">
    <header className="guide-header">
      <div className="guide-container">
        <h1>Platform Configuration</h1>
        <p>Configure your platform settings and manage customer access</p>
        <p>Customize integrations and control your environment</p>
      </div>
    </header>
  </div>
);

// Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative bg-white rounded-lg w-full max-w-md m-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
        {children}
      </div>
    </div>
  );
};

const CustomerSelector = () => {
  const { 
    updateCustomerConfig, 
    customerId, 
    hasCustomerAccess,
    instances 
  } = useConfig();
  const { isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [pendingCustomerSelection, setPendingCustomerSelection] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(customerId || 'HAWKEYE');
  const [currentLoggedInCustomer, setCurrentLoggedInCustomer] = useState(null);

  // Simple grouping by customer_type
  const groupedCustomers = useMemo(() => {
    const groups = {
      'GLOBAL': [],
      'LAW_FIRM': [],
      'ENTERPRISE': [],
      'API': [],
      'TANGIBLE': []
    };

    Object.values(instances).forEach(customer => {
      const type = customer.customer_type;
      if (groups[type]) {
        groups[type].push(customer);
      }
    });

    return groups;
  }, [instances]);

  // Update the current logged in customer when authentication changes
  useEffect(() => {
    if (isAuthenticated && customerId && customerId !== 'HAWKEYE') {
      setCurrentLoggedInCustomer(instances[customerId]);
    } else {
      setCurrentLoggedInCustomer(null);
    }
  }, [isAuthenticated, customerId, instances]);

  const handleCustomerChange = (customerId) => {
    const customer = Object.values(instances).find(c => c.id === customerId);
    if (!customer) return;

    // Always allow HAWKEYE
    if (customer.id === 'HAWKEYE') {
      setSelectedCustomer(customerId);
      updateCustomerConfig(customerId, customer.customer_type);
      return;
    }

    // If already logged in for a different customer, show warning
    if (isAuthenticated && currentLoggedInCustomer && 
        currentLoggedInCustomer.id !== customer.id) {
      setPendingCustomerSelection(customer);
      setShowWarningModal(true);
      return;
    }

    // Require login for others
    if (!isAuthenticated) {
      setPendingCustomerSelection(customer);
      setShowLoginModal(true);
      return;
    }

    // If authenticated, allow selection
    setSelectedCustomer(customerId);
    updateCustomerConfig(customerId, customer.customer_type);
  };

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
          <optgroup label="Platform">
            {groupedCustomers['GLOBAL'].map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.company_name}
              </option>
            ))}
          </optgroup>
          
          <optgroup label="Law Firms">
            {groupedCustomers['LAW_FIRM'].map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.company_name}
              </option>
            ))}
          </optgroup>

          <optgroup label="Enterprise Customers">
            {groupedCustomers['ENTERPRISE'].map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.company_name}
              </option>
            ))}
          </optgroup>

          <optgroup label="API Customers">
            {groupedCustomers['API'].map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.company_name}
              </option>
            ))}
          </optgroup>

          <optgroup label="Tangible Intelligence">
            {groupedCustomers['TANGIBLE'].map(customer => (
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
              Selected: <span className="font-medium">
                {instances[selectedCustomer]?.company_name}
              </span>
              {!isAuthenticated && selectedCustomer !== 'HAWKEYE' && (
                <span className="block text-xs text-red-600">
                  Login required to activate this selection
                </span>
              )}
            </span>
          </div>
        )}
      </div>

      {/* Login Modal */}
      <Modal 
        isOpen={showLoginModal} 
        onClose={() => {
          setShowLoginModal(false);
          setPendingCustomerSelection(null);
          setSelectedCustomer('HAWKEYE');
        }}
      >
        <Authentication onSuccess={() => {
          setShowLoginModal(false);
          if (pendingCustomerSelection) {
            setSelectedCustomer(pendingCustomerSelection.id);
            updateCustomerConfig(
              pendingCustomerSelection.id, 
              pendingCustomerSelection.customer_type
            );
          }
          setPendingCustomerSelection(null);
        }} />
      </Modal>

      {/* Already Logged In Warning Modal */}
      <Modal
        isOpen={showWarningModal}
        onClose={() => {
          setShowWarningModal(false);
          setPendingCustomerSelection(null);
          setSelectedCustomer(currentLoggedInCustomer?.id || 'HAWKEYE');
        }}
      >
        <div className="p-6">
          <div className="mb-4 text-lg font-semibold text-gray-900">
            Already Logged In
          </div>
          <div className="mb-6 text-gray-600">
            You are currently logged in for <span className="font-medium text-gray-900">
              {currentLoggedInCustomer?.company_name}
            </span>. 
            <br /><br />
            Please log out first if you wish to access a different customer.
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => {
                setShowWarningModal(false);
                setPendingCustomerSelection(null);
                setSelectedCustomer(currentLoggedInCustomer?.id || 'HAWKEYE');
              }}
              className="px-4 py-2 bg-royalBlue text-white rounded-md hover:bg-blue-700"
            >
              Understood
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// PlatformControls Component
const PlatformControls = ({ section }) => {
  const { customerId, hasCustomerAccess } = useConfig();
  const { isAuthenticated } = useAuth();

  const controlSections = {
    environment: {
      title: "Environment Controls",
      icon: <Settings className="w-6 h-6 text-royalBlue mr-3" />,
      controls: [
        { label: "Reset Test Environment", icon: Settings },
        { label: "Load Sample Data", icon: Database },
        { label: "Clear Test Data", icon: AlertCircle }
      ]
    },
    customerSetup: {
      title: "Customer Setup",
      icon: <Users className="w-6 h-6 text-royalBlue mr-3" />,
      controls: [
        { label: "Configure Customer Settings", icon: Settings },
        { label: "Manage User Access", icon: Key },
        { label: "Set Default Templates", icon: FileText },
        { label: "Configure Customer API Keys", icon: Key }
      ]
    },
    platformPackages: {
      title: "Platform Packages",
      icon: <Package className="w-6 h-6 text-royalBlue mr-3" />,
      controls: [
        { label: "Sourcing Package", icon: Warehouse },
        { label: "Real Estate Package", icon: Building },
        { label: "Private Equity Package", icon: Briefcase },
        { label: "Venture Capital Package", icon: Rocket },
        { label: "Mass Tort Package", icon: Gavel },
        { label: "Speakeasy Package", icon: MessageSquare }
      ]
    },
    integrations: {
      title: "API Integrations",
      icon: <Link className="w-6 h-6 text-royalBlue mr-3" />,
      controls: [
        { label: "Salesforce Integration", icon: Cloud },
        { label: "Carta Integration", icon: GitBranch },
        { label: "Apttus Integration", icon: Link },
        { label: "Ironclad Integration", icon: Shield },
        { label: "Dropbox Integration", icon: Database },
        { label: "DocuSign Integration", icon: FileText },
        { label: "OpenAI Integration", icon: Book },
        { label: "Anthropic Integration", icon: MessageSquare }
      ]
    }
  };

  const selectedSection = controlSections[section] || controlSections.environment;

  // Check if user has access to these controls
  const canAccessControls = isAuthenticated && (
    hasCustomerAccess(customerId) || customerId === 'HAWKEYE'
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center mb-4">
        {selectedSection.icon}
        <h3 className="text-xl font-semibold">{selectedSection.title}</h3>
      </div>
      <div className="space-y-3">
        {selectedSection.controls.map((control, index) => (
          <button
            key={index}
            disabled={!canAccessControls}
            className={`w-full p-3 ${
              canAccessControls 
                ? 'bg-lightGray hover:bg-gray-200' 
                : 'bg-gray-100 cursor-not-allowed'
            } rounded-md text-left flex items-center justify-between group transition-colors duration-200`}
          >
            <span className={!canAccessControls ? 'text-gray-400' : ''}>
              {control.label}
            </span>
            {control.icon && (
              <control.icon className={`w-4 h-4 ${
                canAccessControls 
                  ? 'text-gray-500 group-hover:text-royalBlue' 
                  : 'text-gray-400'
              }`} />
            )}
          </button>
        ))}
      </div>
      {!canAccessControls && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm text-gray-500">
          {isAuthenticated 
            ? "You don't have access to these controls for the selected customer."
            : "Please log in to access these controls."}
        </div>
      )}
    </div>
  );
};

// Main PlatformConfiguration Component
const PlatformConfiguration = () => {
  const [activeSection, setActiveSection] = useState('testing');
  const { customerId, hasCustomerAccess } = useConfig();
  const { isAuthenticated } = useAuth();

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
      requiresAuth: true
    },
    {
      id: 'system',
      label: 'System',
      icon: <Server className="w-5 h-5" />,
      requiresAuth: true
    },
    {
      id: 'security',
      label: 'Security',
      icon: <Shield className="w-5 h-5" />,
      requiresAuth: true
    },
    {
      id: 'templates',
      label: 'Templates',
      icon: <FileText className="w-5 h-5" />,
      requiresAuth: true
    }
  ];

  // Determine if section should be disabled
  const isSectionDisabled = (section) => {
    if (!section.requiresAuth) return false;
    if (!isAuthenticated) return true;
    return !hasCustomerAccess(customerId) && customerId !== 'HAWKEYE';
  };

  return (
    <div className="min-h-screen bg-ivory">
      <Banner />

      {/* Auth Tester for debugging */}
      <div className="guide-container py-6">
        <AuthTester />
      </div>
      
      <div className="bg-royalBlue shadow-md mt-0 w-full">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-1">
            {configSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                disabled={isSectionDisabled(section)}
                className={`px-4 py-3 flex items-center space-x-2 text-sm font-medium transition-colors
                          ${activeSection === section.id 
                            ? 'text-white border-b-2 border-white' 
                            : isSectionDisabled(section)
                              ? 'text-blue-300 cursor-not-allowed'
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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CustomerSelector />
          <div className="space-y-6">
            <PlatformControls section="environment" />
            <PlatformControls section="customerSetup" />
          </div>
          <PlatformControls section="platformPackages" />
          <PlatformControls section="integrations" />
        </div>
      </div>
    </div>
  );
};

export default PlatformConfiguration;
