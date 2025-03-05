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
      orderTemplates: []
    },
    extractedData: null
  });
  
  // Methods to update form data
  const updateFormData = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: typeof data === 'function' 
        ? data(prev[section]) 
        : {...prev[section], ...data}
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
        orderTemplates: []
      },
      extractedData: null
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
      createSupplier: handleNewSupplier,
      uploadArtifact: handleArtifactUpload,
      refreshData: onRefreshData
    }}>
      {children}
    </SupplierContext.Provider>
  );
}

export function useSupplier() {
  return useContext(SupplierContext);
}
