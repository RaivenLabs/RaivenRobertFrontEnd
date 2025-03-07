import React, { useState } from 'react';
import { useSupplier } from '../SupplierContext';
import SuccessModal from './SuccessModal';
import RateCardPreview from './RateCardPreview';
import DocumentUploader from './DocumentUploader';
// Import other required components...

const NewSupplierWorkflow = () => {
  // Get context data
  const { 
    formData, 
    updateFormData, 
    updateField,
    createSupplier,
    documentInfo,
    extractedRates 
  } = useSupplier();
  
  // Local state for workflow
  const [currentStep, setCurrentStep] = useState(1);
  const [processingStage, setProcessingStage] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [saveResult, setSaveResult] = useState(null);
  
  // Handle rate changes
  const handleRateChange = (index, key, value) => {
    // Create a copy of the rates array
    const updatedRates = [...extractedRates];
    // Update the specific value
    updatedRates[index] = {
      ...updatedRates[index],
      [key]: value
    };
    // Update context
    updateFormData('extractedRates', updatedRates);
  };
  
  // Handle final configuration confirmation
  const handleConfigurationConfirm = () => {
    // Show the success modal immediately
    setShowSuccessModal(true);
    
    // Set initial save result (will be updated when API responds)
    setSaveResult({
      totalProcessed: extractedRates.length,
      inProgress: true
    });
    
    // Start saving in the background
    setProcessingStage('saving');
    
    // Perform the API call in the background
    saveConfigurationInBackground();
  };
  
  // Function to handle the actual saving in the background
  const saveConfigurationInBackground = async () => {
    try {
      // Save the relationship data and rate card
      const response = await fetch('/api/process-complete-rate-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          relationship: {
            provider: documentInfo?.provider?.name || formData.name,
            masterAgreement: documentInfo?.masterAgreement,
            amendment: documentInfo?.amendment,
            rateCard: documentInfo?.rateCard
          },
          rates: extractedRates, // Use extractedRates from context
          providerId: formData.id || 'new',
          customerId: formData.customerId || '1' // Default to customer 1 if not set
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save configuration');
      }
      
      const result = await response.json();
      
      console.log('Configuration saved successfully:', result);
      
      // Update form data with the saved rate card info
      updateFormData('extractedData', {
        ...formData.extractedData,
        rateCard: {
          processed: true,
          rateCardId: result.rateCardId,
          totalProcessed: result.totalProcessed || extractedRates.length
        }
      });
      
      // Update the result for displaying in the already-visible success modal
      setSaveResult({
        ...result,
        inProgress: false
      });
      
      // If this is a new supplier (no ID yet), create the supplier record
      if (!formData.id || formData.id === 'new') {
        const supplierResponse = await createSupplier({
          ...formData,
          status: 'Active', // Automatically activate the supplier upon completion
          configuration: {
            complete: true,
            completedAt: new Date().toISOString()
          }
        });
        
        if (supplierResponse.success) {
          console.log('New supplier created:', supplierResponse.supplier);
        }
      } else {
        // If supplier already exists, just update its status
        // You could call updateSupplier here if needed
      }
      
      // Set processing as complete
      setProcessingStage('complete');
      
    } catch (error) {
      console.error('Error saving configuration:', error);
      setProcessingStage('error');
      
      // Update modal to show error
      setSaveResult(prev => ({
        ...prev,
        error: error.message,
        inProgress: false
      }));
    }
  };
  
  // Close modal and reset workflow or navigate away
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    
    // Optional: Navigate to a different page or reset workflow
    // Example: router.push('/suppliers');
    // OR
    // resetForm();
    // setCurrentStep(1);
  };
  
  // Handle navigation between steps
  const handleNextStep = () => {
    setCurrentStep(prev => prev + 1);
  };
  
  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };
  
  // Render step content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Upload Documents</h2>
            <div className="space-y-4">
              <DocumentUploader
                documentType="masterAgreement"
                title="Master Service Agreement"
                description="Upload the main agreement document"
              />
              
              <DocumentUploader
                documentType="amendments"
                title="Amendments"
                description="Upload any amendments to the MSA"
                isMultiFile={true}
              />
              
              <DocumentUploader
                documentType="rateCard"
                title="Rate Card"
                description="Upload the rate card document"
                isRateCard={true}
              />
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleNextStep}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Continue to Configuration
              </button>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Supplier Configuration</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Supplier Details Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Supplier Name</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => updateField('name', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    value={formData.category || ''}
                    onChange={(e) => updateField('category', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  >
                    <option value="">Select a category</option>
                    <option value="IT Services">IT Services</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Professional Services">Professional Services</option>
                    <option value="Staff Augmentation">Staff Augmentation</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Website</label>
                  <input
                    type="text"
                    value={formData.website || ''}
                    onChange={(e) => updateField('website', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
              </div>
              
              {/* Agreement Details Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">MSA Reference #</label>
                  <input
                    type="text"
                    value={formData.msaReference || ''}
                    onChange={(e) => updateField('msaReference', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Effective Date</label>
                  <input
                    type="date"
                    value={formData.effectiveDate || ''}
                    onChange={(e) => updateField('effectiveDate', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Term End Date</label>
                  <input
                    type="date"
                    value={formData.termEndDate || ''}
                    onChange={(e) => updateField('termEndDate', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
              </div>
            </div>
            
            {/* Rate Card Preview Section */}
            <div className="border rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold mb-3">Rate Card Preview</h3>
              
              <RateCardPreview 
                previewItems={extractedRates} 
                totalItems={extractedRates?.length || 0}
                processingStage={processingStage}
                onRateChange={handleRateChange}
              />
            </div>
            
            <div className="mt-6 flex justify-between">
              <button
                onClick={handlePrevStep}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
              >
                Back
              </button>
              
              <button
                onClick={handleConfigurationConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={processingStage === 'saving'}
              >
                Confirm Configuration
              </button>
            </div>
          </div>
        );
        
      default:
        return <div>Unknown step</div>;
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Workflow Steps */}
      <div className="mb-8">
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            1
          </div>
          <div className={`h-1 w-16 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            2
          </div>
        </div>
        <div className="flex text-sm mt-1">
          <div className="w-8 text-center">Upload</div>
          <div className="w-16"></div>
          <div className="w-24 text-center">Configure</div>
        </div>
      </div>
      
      {/* Step Content */}
      <div className="bg-white shadow rounded-lg p-6">
        {renderStepContent()}
      </div>
      
      {/* Success Modal */}
      <SuccessModal 
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        supplierName={formData.name}
        rateCardCount={extractedRates.length}
        saveResult={saveResult}
      />
    </div>
  );
};

export default NewSupplierWorkflow;
