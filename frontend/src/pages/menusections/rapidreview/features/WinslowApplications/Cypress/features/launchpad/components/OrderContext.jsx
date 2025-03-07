// OrderContext.jsx
import React, { createContext, useContext, useState } from 'react';

const OrderContext = createContext();

export function OrderProvider({
  children,
  initialData,
  onCreateOrder,
  onUpdateOrder,
  onSubmitOrder,
  onUploadAttachment,
  onRefreshData
}) {
  // Form data for new service order workflow
  const [formData, setFormData] = useState({
    // Step 1: Select Provider
    provider: {
      id: '',
      name: '',
      contractNumber: '',
      agreementType: '', // MPSA, MSA, SOW, etc.
      effectiveDate: '',
      endDate: '',
      status: '' // Active, Pending, etc.
    },
    
    // Step 2: Choose Roles
    roles: [], // Array of selected roles with rates
    selectedRates: [], // Detailed rate information for selected roles
    
    // Step 3: Define Scope
    scope: {
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      deliverables: [],
      milestones: [],
      location: '',
      workType: '', // Remote, Onsite, Hybrid
      assumptions: [],
      constraints: []
    },
    
    // Step 4: Add Deliverables
    deliverables: [], // Array of deliverables with descriptions and acceptance criteria
    
    // Step 5: Review Order
    orderDetails: {
      orderNumber: '',
      orderTitle: '',
      orderType: '', // Fixed Price, T&M, etc.
      totalValue: 0,
      currency: 'USD',
      notes: ''
    },
    
    // For tracking process status
    currentStep: 1,
    
    // For tracking attachments
    attachments: [],
    
    // For status tracking
    status: 'Draft',
    
    // For submission
    approvers: [],
    
    // For billing and cost center information
    billing: {
      costCenter: '',
      budgetCode: '',
      invoicingInstructions: '',
      paymentTerms: ''
    },

    // For extracted data (similar to supplier context)
    extractedData: {}
  });
  
  // Methods to update form data
  const updateFormData = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: typeof data === 'function' 
        ? data(prev[section]) 
        : Array.isArray(data) || typeof data !== 'object'
          ? data  // Direct assignment for arrays and primitive values
          : {...prev[section], ...data}  // Spread for objects
    }));
  };
  
  const updateField = (fieldName, value) => {
    // Support for nested fields using dot notation
    if (fieldName.includes('.')) {
      const [section, field] = fieldName.split('.');
      updateFormData(section, {
        ...formData[section],
        [field]: value
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [fieldName]: value
      }));
    }
  };
  
  // Move to next step in the workflow
  const nextStep = () => {
    if (formData.currentStep < 5) { // 5 is the max step from the screenshot
      updateField('currentStep', formData.currentStep + 1);
    }
  };
  
  // Move to previous step in the workflow
  const prevStep = () => {
    if (formData.currentStep > 1) {
      updateField('currentStep', formData.currentStep - 1);
    }
  };
  
  // Go to a specific step
  const goToStep = (step) => {
    if (step >= 1 && step <= 5) {
      updateField('currentStep', step);
    }
  };
  
  // Reset the form to initial state
  const resetForm = () => {
    setFormData({
      provider: {
        id: '',
        name: '',
        contractNumber: '',
        agreementType: '',
        effectiveDate: '',
        endDate: '',
        status: ''
      },
      roles: [],
      selectedRates: [],
      scope: {
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        deliverables: [],
        milestones: [],
        location: '',
        workType: '',
        assumptions: [],
        constraints: []
      },
      deliverables: [],
      orderDetails: {
        orderNumber: '',
        orderTitle: '',
        orderType: '',
        totalValue: 0,
        currency: 'USD',
        notes: ''
      },
      currentStep: 1,
      attachments: [],
      status: 'Draft',
      approvers: [],
      billing: {
        costCenter: '',
        budgetCode: '',
        invoicingInstructions: '',
        paymentTerms: ''
      },
      extractedData: {}
    });
  };
  
  // Select a provider from the available list
  const selectProvider = (providerData) => {
    updateFormData('provider', providerData);
  };
  
  // Add a role to the order
  const addRole = (role) => {
    updateFormData('roles', prevRoles => [...prevRoles, role]);
    // If rate information is available, add it to selectedRates
    if (role.rateInformation) {
      updateFormData('selectedRates', prevRates => [...prevRates, role.rateInformation]);
    }
  };
  
  // Remove a role from the order
  const removeRole = (roleId) => {
    updateFormData('roles', prevRoles => prevRoles.filter(role => role.id !== roleId));
    updateFormData('selectedRates', prevRates => prevRates.filter(rate => rate.roleId !== roleId));
  };
  
  // Add a deliverable to the order
  const addDeliverable = (deliverable) => {
    updateFormData('deliverables', prevDeliverables => [...prevDeliverables, deliverable]);
  };
  
  // Remove a deliverable from the order
  const removeDeliverable = (deliverableId) => {
    updateFormData('deliverables', prevDeliverables => 
      prevDeliverables.filter(deliverable => deliverable.id !== deliverableId)
    );
  };
  
  // Update a deliverable in the order
  const updateDeliverable = (deliverableId, updatedData) => {
    updateFormData('deliverables', prevDeliverables => 
      prevDeliverables.map(deliverable => 
        deliverable.id === deliverableId 
          ? { ...deliverable, ...updatedData } 
          : deliverable
      )
    );
  };
  
  // Add an attachment to the order
  const addAttachment = async (file, attachmentType) => {
    try {
      const result = await onUploadAttachment(file, attachmentType);
      if (result.success) {
        updateFormData('attachments', prevAttachments => [
          ...prevAttachments, 
          { 
            id: result.id, 
            name: file.name, 
            type: attachmentType, 
            uploadDate: new Date(),
            url: result.url 
          }
        ]);
      }
      return result;
    } catch (error) {
      console.error('Error uploading attachment:', error);
      throw error;
    }
  };
  
  // Remove an attachment from the order
  const removeAttachment = (attachmentId) => {
    updateFormData('attachments', prevAttachments => 
      prevAttachments.filter(attachment => attachment.id !== attachmentId)
    );
  };
  
  // Calculate total order value based on selected roles and timeframe
  const calculateOrderValue = () => {
    const totalValue = formData.selectedRates.reduce((total, rate) => {
      const hours = rate.hours || 0;
      const rateValue = rate.value || 0;
      return total + (hours * rateValue);
    }, 0);
    
    updateFormData('orderDetails', { ...formData.orderDetails, totalValue });
    return totalValue;
  };
  
  // Submit the order
  const submitOrder = async () => {
    try {
      // Calculate final value before submission
      calculateOrderValue();
      
      // Convert the form data to the expected format for the API
      const orderData = {
        provider: formData.provider,
        roles: formData.roles,
        scope: formData.scope,
        deliverables: formData.deliverables,
        orderDetails: formData.orderDetails,
        attachments: formData.attachments,
        billing: formData.billing,
        status: 'Submitted'
      };
      
      const result = await onSubmitOrder(orderData);
      
      if (result.success) {
        // Update the local form data with the new status
        updateField('status', 'Submitted');
        // Maybe also update with the new order number if generated by the backend
        if (result.orderNumber) {
          updateFormData('orderDetails', { ...formData.orderDetails, orderNumber: result.orderNumber });
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error submitting order:', error);
      throw error;
    }
  };
  
  // Create a new draft order
  const createDraftOrder = async () => {
    try {
      const result = await onCreateOrder({
        ...formData,
        status: 'Draft'
      });
      
      if (result.success && result.orderId) {
        // Update with the ID returned from the backend
        updateFormData('orderDetails', { 
          ...formData.orderDetails, 
          orderNumber: result.orderNumber || formData.orderDetails.orderNumber 
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error creating draft order:', error);
      throw error;
    }
  };
  
  // Update an existing order
  const updateOrder = async (orderId) => {
    try {
      const result = await onUpdateOrder(orderId, formData);
      return result;
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  };
  
  return (
    <OrderContext.Provider value={{
      // Form data
      formData,
      
      // Step navigation
      currentStep: formData.currentStep,
      nextStep,
      prevStep,
      goToStep,
      
      // General form handling
      updateFormData,
      updateField,
      resetForm,
      
      // Provider selection
      selectProvider,
      
      // Role management
      addRole,
      removeRole,
      selectedRoles: formData.roles,
      selectedRates: formData.selectedRates,
      
      // Scope management
      scope: formData.scope,
      
      // Deliverables management
      deliverables: formData.deliverables,
      addDeliverable,
      removeDeliverable,
      updateDeliverable,
      
      // Attachment handling
      attachments: formData.attachments,
      addAttachment,
      removeAttachment,
      
      // Order value calculation
      calculateOrderValue,
      orderValue: formData.orderDetails.totalValue,
      
      // Order operations
      createDraftOrder,
      updateOrder,
      submitOrder,
      
      // Data refreshing
      refreshData: onRefreshData,
      
      // Status management
      status: formData.status,
      
      // Provider data
      initialData
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  return useContext(OrderContext);
}
