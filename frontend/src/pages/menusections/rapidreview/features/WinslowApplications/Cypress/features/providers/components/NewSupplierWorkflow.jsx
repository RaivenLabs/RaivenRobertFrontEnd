import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from './CardTitle';
import DocumentUploadSection from './DocumentUploadSection97';
import RateCardSection from './RateCardSection';
import SupplierInfoForm from './SupplierInformationForm';
import ReviewSection from './ReviewSection';
import ProgressIndicator from './ProgressIndicator';
import NavigationButtons from './NavigationButtons';
import { useSupplier } from '../SupplierContext';

const NewSupplierWorkflow = ({ onSaveSupplier, onExtractDocumentData, onUploadArtifact }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  
  const steps = ["Document Upload", "Supplier Info", "Rate Card", "Review & Confirm"];
  const totalSteps = steps.length;
  
  // State for uploaded documents with their types
  const [documents, setDocuments] = useState({
    masterAgreement: null,
    rateCard: null,
    amendments: [],
    localCountryAgreements: [],
    orderTemplates: []
  });
  
  // State for supplier data combined from extractions and manual input
  const [supplierData, setSupplierData] = useState({
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
    contacts: []
  });
  
  // Handle document upload and categorization
  const handleDocumentUpload = async (e, documentType) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Update documents state
    if (documentType === 'amendments' || documentType === 'localCountryAgreements' || documentType === 'orderTemplates') {
      setDocuments(prev => ({
        ...prev,
        [documentType]: [...prev[documentType], file]
      }));
    } else {
      setDocuments(prev => ({
        ...prev,
        [documentType]: file
      }));
    }
    
    // If it's the master agreement, try to extract data immediately
    if (documentType === 'masterAgreement') {
      await extractDataFromDocument(file, 'masterAgreement');
    } else if (documentType === 'rateCard') {
      await extractDataFromDocument(file, 'rateCard');
    }
  };
  
  // Function to extract data from uploaded document
  const extractDataFromDocument = async (file, documentType) => {
    setIsProcessing(true);
    try {
      // Call API to extract data
      const extractionResult = await onExtractDocumentData(file, documentType);
      
      // Update the supplier data with the extracted information
      if (extractionResult.success) {
        setExtractedData(extractionResult.data);
        
        // Merge extracted data with existing supplier data
        setSupplierData(prev => ({
          ...prev,
          ...extractionResult.data
        }));
      }
    } catch (error) {
      console.error('Error extracting data:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle manual data entry and updates
  const handleDataChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSupplierData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Validate if we can proceed to the next step
  const canProceed = () => {
    if (currentStep === 1) {
      // Require at least a master agreement upload
      return documents.masterAgreement !== null;
    } else if (currentStep === 2) {
      // Require basic supplier information
      return (
        supplierData.name && 
        supplierData.effectiveDate && 
        supplierData.msaReference
      );
    }
    
    return true;
  };
  
  // Handle step navigation
  const goToNextStep = () => {
    if (canProceed()) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const goToPreviousStep = () => {
    setCurrentStep(prev => prev - 1);
  };
  
  // Go to upload step (for rate card upload from rate card section)
  const goToUploadStep = () => {
    setCurrentStep(1);
  };
  
  // Save the supplier with all gathered information
  const saveSupplier = async () => {
    setIsProcessing(true);
    try {
      // First save the supplier data
      const result = await onSaveSupplier(supplierData);
      
      if (result.success && result.data && result.data.id) {
        const supplierId = result.data.id;
        
        // Then upload all documents as artifacts
        if (documents.masterAgreement) {
          await onUploadArtifact(supplierId, 'MSA', documents.masterAgreement);
        }
        
        if (documents.rateCard) {
          await onUploadArtifact(supplierId, 'RateCard', documents.rateCard);
        }
        
        // Upload all amendments
        for (const amendment of documents.amendments) {
          await onUploadArtifact(supplierId, 'Amendment', amendment);
        }
        
        // Upload all LCAs
        for (const lca of documents.localCountryAgreements) {
          await onUploadArtifact(supplierId, 'LCA', lca);
        }
        
        // Upload all order templates
        for (const template of documents.orderTemplates) {
          await onUploadArtifact(supplierId, 'OrderTemplate', template);
        }
        
        alert('Supplier configuration completed successfully!');
        
        // Reset form
        setCurrentStep(1);
        setDocuments({
          masterAgreement: null,
          rateCard: null,
          amendments: [],
          localCountryAgreements: [],
          orderTemplates: []
        });
        setSupplierData({
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
          contacts: []
        });
      } else {
        alert('Failed to create supplier');
      }
    } catch (error) {
      console.error('Error saving supplier:', error);
      alert(`Error saving supplier: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <DocumentUploadSection 
            documents={documents}
            handleDocumentUpload={handleDocumentUpload}
            isProcessing={isProcessing}
            extractedData={extractedData}
          />
        );
      case 2:
        return (
          <SupplierInfoForm
            supplierData={supplierData}
            handleDataChange={handleDataChange}
            extractedData={extractedData}
          />
        );
      case 3:
        return (
          <RateCardSection 
            documents={documents}
            goToUploadStep={goToUploadStep}
          />
        );
      case 4:
        return (
          <ReviewSection
            supplierData={supplierData}
            documents={documents}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Configuration Stages</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Progress Indicator */}
        <ProgressIndicator currentStep={currentStep} steps={steps} />
        
        {/* Step Content */}
        {renderStepContent()}
        
        {/* Navigation Buttons */}
        <NavigationButtons
          currentStep={currentStep}
          totalSteps={totalSteps}
          canProceed={canProceed()}
          isProcessing={isProcessing}
          onPrevious={goToPreviousStep}
          onNext={goToNextStep}
          onSubmit={saveSupplier}
        />
      </CardContent>
    </Card>
  );
};

export default NewSupplierWorkflow;
