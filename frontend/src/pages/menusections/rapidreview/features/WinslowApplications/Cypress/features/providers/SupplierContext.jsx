// SupplierContext.jsx
import React, { createContext, useContext, useState } from 'react';

const SupplierContext = createContext();

export function SupplierProvider({
  children,
  initialData,
  onUpdateSupplier,
  onDeleteSupplier,
  onCreateSupplier,
  onUploadArtifact,

  onExtractDocument,
  onRefreshData
}) {
  // Form data for new supplier workflow
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    agreementType: '',
    msaReference: '',
    claimNumber: '',
    effectiveDate: '',
    termEndDate: '',
    autoRenewal: false,
    website: '',
    preferredStatus: false,
    status: 'Pending',
    contacts: [],
    documents: {
      masterAgreement: null,
      rateCard: null,
      amendments: [],
      localCountryAgreements: [],
      orderTemplates: [],
      serviceOrders:[]
    },
    extractedData: {},
    // For storing extracted document info
  documentInfo: null,
  
  // For storing extracted rates
  extractedRates: [],
  
  // For tracking processing status
  processingStage: null,
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
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      agreementType: '',
      msaReference: '',
      claimNumber: '',
      effectiveDate: '',
      termEndDate: '',
      autoRenewal: false,
      website: '',
      preferredStatus: false,
      status: 'Pending',
      contacts: [],
      documents: {
        masterAgreement: null,
        rateCard: null,
        amendments: [],
        localCountryAgreements: [],
        orderTemplates: [],
        serviceOrders: []
      },
      extractedData: {}
    });
  };
  
  // Wrap the external handlers
  const handleSupplierUpdate = async (supplierId, updatedFields) => {
    return await onUpdateSupplier(supplierId, updatedFields);
  };
  
  const handleSupplierDeletion = async (supplierId) => {
    return await onDeleteSupplier(supplierId);
  };
  
  const handleNewSupplier = async (supplierData = formData) => {
    const result = await onCreateSupplier(supplierData);
    if (result.success) {
      resetForm();
    }
    return result;
  };






  // Add the document extraction function
  const extractDocumentData = async (file, documentType) => {
    try {
      // This assumes you're passing an extraction function from the parent component
      // If you're making the API call directly in the context, you'd use fetch here instead
      const result = await onExtractDocument(file, documentType);
      return result;
    } catch (error) {
      console.error('Error extracting document data:', error);
      throw error;
    }
  };

  
  const handleArtifactUpload = async (supplierId, artifactType, file) => {
    return await onUploadArtifact(supplierId, artifactType, file);
  };
  
  return (
    <SupplierContext.Provider value={{
      suppliers: initialData,
      formData,
      updateFormData,
      updateField,
      extractDocumentData,
      resetForm,
      updateSupplier: handleSupplierUpdate,
      deleteSupplier: handleSupplierDeletion,
      extractedData: formData.extractedData, 
      createSupplier: handleNewSupplier,
      uploadArtifact: handleArtifactUpload,
      refreshData: onRefreshData,
      // Include processing status
      processingStage: formData.processingStage,
          
      // Include extracted data
      documentInfo: formData.documentInfo,
      extractedRates: formData.extractedRates



    }}>
      {children}
    </SupplierContext.Provider>
  );
}

export function useSupplier() {
  return useContext(SupplierContext);
}



