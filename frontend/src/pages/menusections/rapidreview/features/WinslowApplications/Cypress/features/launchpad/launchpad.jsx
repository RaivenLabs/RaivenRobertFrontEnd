import React, { useState, useEffect } from 'react';
import OrderWizard from './components/OrderWizard';
import OrderSummary from './components/OrderSummary';
import TabNavigation from './components/TabNavigation';
import ProgressTracker from './components/ProgressTracker';

const OrderLaunchpad = ({
  title,
  data,
  loading,
  error,
  onCreateOrder,
  onSendOrderPackage,
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState('create');
  const [currentStep, setCurrentStep] = useState(1);
  const [orderData, setOrderData] = useState({
    providerId: '',
    providerName: '',
    masterAgreement: '',
    roles: [],
    totalAmount: 0,
    effectiveDate: '',
    endDate: '',
    scopeOfServices: '',
    deliverables: [],
    rateCardVariance: 0,
    orderNumber: '',
    status: 'Draft'
  });
  const [providers, setProviders] = useState([]);
  const [rateCards, setRateCards] = useState({});
  const [contacts, setContacts] = useState([]);
  
  // Total steps in the wizard
  const totalSteps = 5;

  // Fetch providers data
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/providers/active');
        // const result = await response.json();
        // setProviders(result);
        
        // For development, use sample data
        setProviders(data?.providers || []);
      } catch (error) {
        console.error('Error fetching providers:', error);
      }
    };
    
    fetchProviders();
  }, [data]);

  // Handle order data changes
  const handleOrderDataChange = (field, value) => {
    setOrderData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Special handling for provider selection to load its rate card
    if (field === 'providerId') {
      const selectedProvider = providers.find(p => p.id === value);
      if (selectedProvider) {
        setOrderData(prev => ({
          ...prev,
          providerName: selectedProvider.name,
          masterAgreement: selectedProvider.msaReference
        }));
        
        // Fetch rate card for the selected provider
        fetchRateCard(value);
      }
    }
  };
  
  // Fetch rate card for a provider
  const fetchRateCard = async (providerId) => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/providers/${providerId}/rate-card`);
      // const result = await response.json();
      // setRateCards(prev => ({ ...prev, [providerId]: result }));
      
      // For development, use sample data
      const sampleRateCard = {
        roles: [
          { 
            roleId: 'r1', 
            roleName: 'Technical Lead', 
            rate: 150, 
            unit: 'hour'
          },
          { 
            roleId: 'r2', 
            roleName: 'Senior Developer', 
            rate: 120, 
            unit: 'hour'
          },
          { 
            roleId: 'r3', 
            roleName: 'Developer', 
            rate: 90, 
            unit: 'hour'
          },
          { 
            roleId: 'r4', 
            roleName: 'Project Manager', 
            rate: 130, 
            unit: 'hour'
          },
          { 
            roleId: 'r5', 
            roleName: 'Business Analyst', 
            rate: 100, 
            unit: 'hour'
          }
        ]
      };
      
      setRateCards(prev => ({ ...prev, [providerId]: sampleRateCard }));
    } catch (error) {
      console.error('Error fetching rate card:', error);
    }
  };
  
  // Handle adding a new role to the order
  const handleAddRole = (role) => {
    setOrderData(prev => ({
      ...prev,
      roles: [...prev.roles, role],
      totalAmount: prev.totalAmount + calculateRoleCost(role)
    }));
  };
  
  // Handle removing a role from the order
  const handleRemoveRole = (roleIndex) => {
    const roleToRemove = orderData.roles[roleIndex];
    setOrderData(prev => ({
      ...prev,
      roles: prev.roles.filter((_, index) => index !== roleIndex),
      totalAmount: prev.totalAmount - calculateRoleCost(roleToRemove)
    }));
  };
  
  // Calculate the cost of a role
  const calculateRoleCost = (role) => {
    const durationInDays = calculateDuration(role.startDate, role.endDate);
    const durationInHours = durationInDays * 8; // Assuming 8 hours per day
    return role.rate * durationInHours;
  };
  
  // Calculate duration in days between two dates
  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Calculate rate card variance
  const calculateVariance = () => {
    let totalVariance = 0;
    orderData.roles.forEach(role => {
      const standardRate = getRateCardRateForRole(role.roleId);
      const variance = (standardRate - role.rate) * calculateDuration(role.startDate, role.endDate) * 8;
      totalVariance += variance;
    });
    return totalVariance;
  };
  
  // Get standard rate for a role from the rate card
  const getRateCardRateForRole = (roleId) => {
    if (!orderData.providerId || !rateCards[orderData.providerId]) return 0;
    
    const role = rateCards[orderData.providerId].roles.find(r => r.roleId === roleId);
    return role ? role.rate : 0;
  };
  
  // Handle moving to the next step
  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      // If at the last step, create the order
      handleCreateOrder();
    }
  };
  
  // Handle moving to the previous step
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  // Handle order creation
  const handleCreateOrder = async () => {
    // Calculate the variance just before creating the order
    const variance = calculateVariance();
    
    // Update order with final data
    const finalOrderData = {
      ...orderData,
      rateCardVariance: variance,
      orderNumber: generateOrderNumber(),
      status: 'Pending Approval'
    };
    
    // Update local state
    setOrderData(finalOrderData);
    
    // In a real app, this would submit to the API
    // const result = await onCreateOrder(finalOrderData);
    
    // Switch to review tab
    setActiveTab('review');
  };
  
  // Generate a unique order number
  const generateOrderNumber = () => {
    // This should be handled by the backend in a real app
    // For development, create a simple order number
    const prefix = 'SO';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 900) + 100; // 3-digit random number
    
    return `${prefix}-${timestamp}-${random}`;
  };
  
  // Handle sending the order package
  const handleSendOrderPackage = async (recipientEmails) => {
    try {
      // In a real app, this would be an API call
      // const result = await onSendOrderPackage(orderData.orderNumber, recipientEmails);
      
      // For development, simulate success
      console.log(`Order ${orderData.orderNumber} sent to: ${recipientEmails.join(', ')}`);
      
      // Update order status
      setOrderData(prev => ({
        ...prev,
        status: 'Sent'
      }));
      
      // Show success message
      alert('Order package sent successfully!');
    } catch (error) {
      console.error('Error sending order package:', error);
      alert(`Failed to send order package: ${error.message}`);
    }
  };
  
  // Define tabs for the TabNavigation component
  const tabs = [
    { id: 'create', label: 'Create New Order' },
    { id: 'review', label: 'Review & Send' }
  ];

  // Fetch Nike contacts (for email recipients)
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/contacts/nike');
        // const result = await response.json();
        // setContacts(result);
        
        // For development, use sample data
        setContacts([
          { id: 'c1', name: 'Ryan Reynolds', email: 'rreynolds@tangiblelabs.ai', role: 'Program Manager' },
          { id: 'c2', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Procurement Officer' },
          { id: 'c3', name: 'Michael Johnson', email: 'michael.johnson@example.com', role: 'Finance Director' }
        ]);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };
    
    fetchContacts();
  }, []);

  // Component loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-royalBlue"></div>
      </div>
    );
  }

  // Component error state
  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <h3 className="text-red-800 font-medium">Error loading data</h3>
        <p className="text-red-600">{error}</p>
        <div className="mt-4">
          <button 
            onClick={onRefreshData} 
            className="bg-royalBlue text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 rounded-lg shadow-md">
      {/* Component Header */}
      <div className="bg-gray-200 text-gray-800 p-4 rounded-t-lg">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">{title || "Order Launchpad"}</h1>
          <span className="text-lg">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Tabs */}
      <TabNavigation 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={tabs}
      />

      {/* Progress Tracker - Only show in create tab */}
      {activeTab === 'create' && (
        <div className="px-4 pt-4">
          <ProgressTracker 
            currentStep={currentStep}
            totalSteps={totalSteps}
            stepLabels={[
              'Select Provider',
              'Choose Roles',
              'Define Scope',
              'Add Deliverables',
              'Review Order'
            ]}
          />
        </div>
      )}

      {/* Content based on active tab */}
      <div className="p-4">
        {activeTab === 'create' && (
          <OrderWizard 
            currentStep={currentStep}
            totalSteps={totalSteps}
            orderData={orderData}
            providers={providers}
            rateCards={rateCards}
            onOrderDataChange={handleOrderDataChange}
            onAddRole={handleAddRole}
            onRemoveRole={handleRemoveRole}
            onNextStep={handleNextStep}
            onPrevStep={handlePrevStep}
          />
        )}

        {activeTab === 'review' && (
          <OrderSummary
            orderData={orderData}
            contacts={contacts}
            onSendPackage={handleSendOrderPackage}
          />
        )}
      </div>
    </div>
  );
};

export default OrderLaunchpad;
