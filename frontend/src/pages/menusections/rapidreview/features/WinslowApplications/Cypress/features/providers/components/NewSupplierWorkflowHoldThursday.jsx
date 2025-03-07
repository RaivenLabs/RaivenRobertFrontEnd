import React, { useState } from 'react';
import DocumentUploadSection from './DocumentUploadSection';
import NavigationButtons from './NavigationButtons';
import ConfigurationPreview from './ConfigurationPreview';

const NewSupplierWorkflow = ({ onCreateProvider, onUploadArtifact }) => {
  // Step management state
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form data state
  const [formData, setFormData] = useState({
    // Basic info fields
    name: '',
    category: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    msaReference: '',
    agreementType: 'Fixed Term',
    effectiveDate: '',
    termEndDate: '',
    status: 'Pending',
    
    // Documents
    documents: {
      masterAgreement: null,
      rateCard: null,
      amendments: [],
      localCountryAgreements: [],
      orderTemplates: [],
      serviceOrders: []
    },
    
    // Extracted data
    extractedData: {}
  });
  
  // Configuration preview states
  const [showConfigPreview, setShowConfigPreview] = useState(false);
  const [processingStage, setProcessingStage] = useState(null);
  const [documentInfo, setDocumentInfo] = useState(null);
  const [previewItems, setPreviewItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  
  // Handle form field changes
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Update specific form data field
  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Check if user can proceed to next step
  const canProceedToNextStep = () => {
    if (currentStep === 1) {
      // Validation for document upload - require at least one document
      return formData.documents?.masterAgreement || 
            formData.documents?.rateCard || 
            (formData.documents?.amendments && formData.documents.amendments.length > 0);
    }
    
    return true; // Other steps can always proceed
  };

  // Handle rate changes in the configuration preview
  const handleRateChange = (rowIndex, key, value) => {
    const updatedItems = [...previewItems];
    try {
      // Clean the value and convert to number if applicable
      const cleanValue = value.replace(/[^0-9.]/g, '');
      const numValue = cleanValue === '' ? null : parseFloat(cleanValue);
      updatedItems[rowIndex][key] = numValue;
    } catch (e) {
      updatedItems[rowIndex][key] = value;
    }
    setPreviewItems(updatedItems);
  };
  
  // Process uploaded documents to extract data
  const processUploadedDocuments = async () => {
    try {
      // Check if any documents have been uploaded
      if (formData.documents.masterAgreement || 
          formData.documents.rateCard || 
          formData.documents.amendments.length > 0) {
        
        // Start document processing
        setProcessingStage('document');
        
        // Process master agreement first if available
        if (formData.documents.masterAgreement) {
          setProcessingStage('ocr');
          const msaFormData = new FormData();
          msaFormData.append('file', formData.documents.masterAgreement);
          msaFormData.append('documentType', 'masterAgreement');
          
          const msaResponse = await fetch('/api/extract-document-data', {
            method: 'POST',
            body: msaFormData
          });
          
          if (msaResponse.ok) {
            const data = await msaResponse.json();
            
            // Update document info for the relationship panel
            setDocumentInfo({
              masterAgreement: {
                name: data.name || 'Master Services Agreement',
                effectiveDate: data.effectiveDate || '',
                referenceNumber: data.msaReference || ''
              },
              provider: {
                name: data.name || "Unknown Provider",
                address: data.address || ''
              }
            });
            
            // Also update form data with extracted info
            updateFormData('name', data.name || formData.name);
            updateFormData('msaReference', data.msaReference || formData.msaReference);
            updateFormData('effectiveDate', data.effectiveDate || formData.effectiveDate);
            updateFormData('termEndDate', data.termEndDate || formData.termEndDate);
          }
        }
        
        // Process amendments if available
        else if (formData.documents.amendments.length > 0) {
          setProcessingStage('ocr');
          const amendmentFormData = new FormData();
          amendmentFormData.append('file', formData.documents.amendments[0]);
          amendmentFormData.append('documentType', 'amendments');
          
          const amendmentResponse = await fetch('/api/extract-document-data', {
            method: 'POST',
            body: amendmentFormData
          });
          
          if (amendmentResponse.ok) {
            const data = await amendmentResponse.json();
            
            // Update document info for the relationship panel
            setDocumentInfo(prev => ({
              ...prev,
              amendment: {
                name: data.documentTitle || 'Amendment',
                effectiveDate: data.effectiveDate || '',
                referenceNumber: data.referenceNumber || ''
              },
              provider: {
                name: data.contractor || prev?.provider?.name || "Unknown Provider",
                address: data.contractorAddress || prev?.provider?.address || ''
              },
              masterAgreement: {
                name: data.msaName || prev?.masterAgreement?.name || 'Master Services Agreement',
                effectiveDate: data.msaEffectiveDate || prev?.masterAgreement?.effectiveDate || '',
                referenceNumber: data.msaReference || prev?.masterAgreement?.referenceNumber || ''
              }
            }));
          }
        }
        
        setProcessingStage('extract');
        
        // Process rate card if available
        if (formData.documents.rateCard) {
          setProcessingStage('rates');
          const rateCardFormData = new FormData();
          rateCardFormData.append('file', formData.documents.rateCard);
          rateCardFormData.append('cardType', 'standalone');
          
          // Add provider ID if available
          if (formData.id) {
            rateCardFormData.append('providerId', formData.id);
          }
          
          // Add customer ID if available
          if (formData.customerId) {
            rateCardFormData.append('customerId', formData.customerId);
          }
          
          const rateResponse = await fetch('/api/extract-rate-card', {
            method: 'POST',
            body: rateCardFormData
          });
          
          if (rateResponse.ok) {
            const data = await rateResponse.json();
            
            // Update preview items and total count
            setPreviewItems(data.previewItems || []);
            setTotalItems(data.estimatedTotal || 0);
            
            // Update document info for rate card section if not already set
            setDocumentInfo(prev => ({
              ...prev,
              rateCard: {
                name: 'Exhibit B-1 Rate Card',
                effectiveDate: data.effectiveDate || prev?.amendment?.effectiveDate || prev?.masterAgreement?.effectiveDate || '',
                expirationDate: data.expirationDate || ''
              }
            }));
          }
        }
        
        // Processing complete
        setProcessingStage(null);
      }
    } catch (error) {
      console.error('Error processing documents:', error);
      setProcessingStage(null);
    }
  };
  
  // Handle final configuration confirmation
  const handleConfigurationConfirm = async (configData) => {
    setProcessingStage('saving');
    try {
      // Save the relationship data and rate card
      const response = await fetch('/api/process-complete-rate-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          relationship: configData.relationship,
          rates: configData.rates,
          providerId: formData.id || 'new',
          customerId: formData.customerId || '1' // Default to customer 1 if not set
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        
        // Update form data with the saved rate card info
        updateFormData('extractedData', {
          ...formData.extractedData,
          rateCard: {
            processed: true,
            rateCardId: result.rateCardId,
            totalProcessed: result.totalProcessed
          }
        });
        
        // Close the preview and move to the next step
        setShowConfigPreview(false);
        setCurrentStep(currentStep + 1);
      } else {
        throw new Error('Failed to save configuration');
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
      // Handle error
    } finally {
      setProcessingStage(null);
    }
  };

  // Render the component
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      {/* Step indicator */}
      <div className="mb-6">
        <div className="flex items-center">
          {[1, 2, 3].map((step) => (
            <React.Fragment key={step}>
              <div 
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step === currentStep 
                    ? 'bg-royalBlue text-white' 
                    : step < currentStep 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-700'
                }`}
              >
                {step < currentStep ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  step
                )}
              </div>
              
              {step < 3 && (
                <div className={`w-10 h-1 ${step < currentStep ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
        
        <div className="flex text-sm mt-2">
          
          <div className="flex-1">Express Configuration Upload</div>
          <div className="flex-1">Submit Express Configuration Package</div>
          <div className="flex-1 text-gray-500">Additional Information (Optional)</div>
        </div>
      </div>
      
    
      
      {/* Step 1: Express Configuration Upload */}
      {currentStep === 1 && (
        <DocumentUploadSection 
          formData={formData}
          updateFormData={updateFormData}
        />
      )}
      
      {/* Step 2: Review Express Configuration Package & Submit */}
      {currentStep === 2 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Submit Express Configuration Package</h2>
          <div className="bg-blue-50 p-4 rounded mb-4 border border-blue-200">
  <div className="flex">
    <svg className="w-6 h-6 text-blue-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
    <div>
      <p className="text-sm text-blue-800 font-medium">Configuration Ready!</p>
      <p className="text-sm text-blue-700 mt-1">
        Your supplier configuration has been extracted from the documents. You can create the supplier now, 
        or add more details on the next screen to make future operations easier.
      </p>
    </div>
  </div>
</div>



          
          <div className="bg-gray-50 p-4 rounded mb-4">
            <h3 className="font-medium text-lg mb-2">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Supplier Name</p>
                <p className="font-medium">{formData.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium">{formData.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Agreement Type</p>
                <p className="font-medium">{formData.agreementType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">{formData.status}</p>
              </div>
              {formData.msaReference && (
                <div>
                  <p className="text-sm text-gray-500">MSA Reference</p>
                  <p className="font-medium">{formData.msaReference}</p>
                </div>
              )}
              {formData.effectiveDate && (
                <div>
                  <p className="text-sm text-gray-500">Effective Date</p>
                  <p className="font-medium">{formData.effectiveDate}</p>
                </div>
              )}
              {formData.termEndDate && (
                <div>
                  <p className="text-sm text-gray-500">Term End Date</p>
                  <p className="font-medium">{formData.termEndDate}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded mb-4">
            <h3 className="font-medium text-lg mb-2">Documents</h3>
            <div className="space-y-2">
              {formData.documents.masterAgreement && (
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Master Agreement: {formData.documents.masterAgreement.name}</span>
                </div>
              )}
              
              {formData.documents.rateCard && (
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Rate Card: {formData.documents.rateCard.name}</span>
                </div>
              )}
              
              {formData.documents.amendments.length > 0 && (
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Amendments: {formData.documents.amendments.length} file(s)</span>
                </div>
              )}
              
              {formData.extractedData.rateCard && (
  <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
    <p className="text-green-700">
      Successfully processed rate card with {formData.extractedData.rateCard.totalProcessed} items.
    </p>
  </div>
)}

<div className="mt-6 flex justify-end">
  <button
    onClick={() => onCreateProvider(formData)}
    className="text-royalBlue flex items-center hover:underline"
  >
    <span>Skip additional information</span>
    <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  </button>
</div>




            </div>
          </div>
        </div>
      )}

        {/* Step 3: Additional Information */}
        {currentStep === 3 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supplier Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFieldChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleFieldChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a category</option>
                <option value="IT Services">IT Services</option>
                <option value="Consulting">Consulting</option>
                <option value="Software">Software</option>
                <option value="Hardware">Hardware</option>
                <option value="Legal">Legal</option>
                <option value="Marketing">Marketing</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Name
              </label>
              <input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleFieldChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleFieldChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleFieldChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleFieldChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                MSA Reference #
              </label>
              <input
                type="text"
                name="msaReference"
                value={formData.msaReference}
                onChange={handleFieldChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Agreement Type <span className="text-red-500">*</span>
              </label>
              <select
                name="agreementType"
                value={formData.agreementType}
                onChange={handleFieldChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="Fixed Term">Fixed Term</option>
                <option value="Evergreen">Evergreen</option>
                <option value="Time & Materials">Time & Materials</option>
                <option value="Statement of Work">Statement of Work</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Effective Date
              </label>
              <input
                type="date"
                name="effectiveDate"
                value={formData.effectiveDate}
                onChange={handleFieldChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Term End Date
              </label>
              <input
                type="date"
                name="termEndDate"
                value={formData.termEndDate}
                onChange={handleFieldChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleFieldChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Inactive">Inactive</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
          </div>
        </div>
      )}
      
      {/* Navigation Buttons */}
      <NavigationButtons
  currentStep={currentStep}
  totalSteps={3}
  canProceed={canProceedToNextStep()}
  isProcessing={false} // Change this from processingStage !== null to always enable the button
  onPrevious={() => setCurrentStep(prev => prev - 1)}
  onNext={() => {
    // If we're on the document upload step and documents have been uploaded
  // In your onNext handler
if (
    currentStep === 1 && 
    (formData.documents?.masterAgreement || 
     formData.documents?.rateCard || 
     (formData.documents?.amendments && formData.documents.amendments.length > 0))
  ) {
    // First navigate to the next step
    setCurrentStep(prev => prev + 1);
    
    // Then show the preview and start processing
    setShowConfigPreview(true);
    processUploadedDocuments();
  } else {
    // Normal navigation for other steps
    setCurrentStep(prev => prev + 1);
  }
  }}
  onSubmit={() => {
    // Handle final submission
    onCreateProvider(formData);
  }}
  nextLabel={
    currentStep === 1 ? "Extract Configuration" : 
    currentStep === 2 ? "Add More Details" : 
    "Next"
  }
  submitLabel={currentStep === 2 ? "Complete Setup" : "Save Supplier"}
/>
      
      {/* Configuration Preview Modal */}
      {showConfigPreview && (
        <ConfigurationPreview
          documentInfo={documentInfo}
          previewItems={previewItems}
          totalItems={totalItems}
          handleRateChange={handleRateChange}
          handleConfirm={handleConfigurationConfirm}
          isProcessing={processingStage !== null}
          processingStage={processingStage}
          setShowConfigPreview={setShowConfigPreview}
        />
      )}
    </div>
  );
};

export default NewSupplierWorkflow;
