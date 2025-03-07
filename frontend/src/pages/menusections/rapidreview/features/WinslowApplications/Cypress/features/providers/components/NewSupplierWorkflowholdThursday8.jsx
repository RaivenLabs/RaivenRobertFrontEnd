import React, { useState, useEffect } from 'react';
import { useSupplier } from '../SupplierContext';
import DocumentUploadSection from './DocumentUploadSection';
import ConfigurationPreview from './ConfigurationPreview';

const NewSupplierWorkflow = ({ onCreateProvider }) => {
  // Access the shared supplier context
  const { formData: contextFormData, updateFormData: updateContextData } = useSupplier();
  
  // Step management state
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form data state (local copy from context)
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
  const [processingStage, setProcessingStage] = useState(null);
  const [documentInfo, setDocumentInfo] = useState(null);
  const [previewItems, setPreviewItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  
  // Keep local state in sync with context
  useEffect(() => {
    if (contextFormData) {
      setFormData(prev => ({
        ...prev,
        ...contextFormData
      }));
      
      // If we have rate card data in the context, update our preview states
      if (contextFormData.extractedData?.rateCard) {
        const rateData = contextFormData.extractedData.rateCard;
        if (rateData.previewItems) {
          setPreviewItems(rateData.previewItems);
        }
        if (rateData.estimatedTotal) {
          setTotalItems(rateData.estimatedTotal);
        }
      }
      
      // Update document info from extracted data
      updateDocumentInfoFromContext(contextFormData);
    }
  }, [contextFormData]);
  
  // Helper function to build document info from context data
  const updateDocumentInfoFromContext = (data) => {
    const newDocInfo = {};
    
    // Extract MSA info
    if (data.extractedData?.masterAgreement) {
      const msaData = data.extractedData.masterAgreement;
      newDocInfo.masterAgreement = {
        name: msaData.name || 'Master Services Agreement',
        effectiveDate: msaData.effectiveDate || '',
        referenceNumber: msaData.msaReference || ''
      };
      newDocInfo.provider = {
        name: msaData.name || "Unknown Provider",
        address: msaData.address || ''
      };
    }
    
    // Extract amendment info
    if (data.extractedData?.amendments && data.extractedData.amendments.length > 0) {
      const amendData = data.extractedData.amendments[0];
      newDocInfo.amendment = {
        name: amendData.documentTitle || 'Amendment',
        effectiveDate: amendData.effectiveDate || '',
        referenceNumber: amendData.referenceNumber || ''
      };
      
      // Update provider info if it exists in amendment
      if (amendData.contractor) {
        newDocInfo.provider = newDocInfo.provider || {};
        newDocInfo.provider.name = amendData.contractor;
        if (amendData.contractorAddress) {
          newDocInfo.provider.address = amendData.contractorAddress;
        }
      }
    }
    
    // Extract rate card info
    if (data.extractedData?.rateCard) {
      const rateData = data.extractedData.rateCard;
      newDocInfo.rateCard = {
        name: 'Exhibit B-1 Rate Card',
        effectiveDate: rateData.effectiveDate || 
                      (newDocInfo.amendment?.effectiveDate) || 
                      (newDocInfo.masterAgreement?.effectiveDate) || '',
        expirationDate: rateData.expirationDate || ''
      };
    }
    
    // Only update if we have new info
    if (Object.keys(newDocInfo).length > 0) {
      setDocumentInfo(newDocInfo);
    }
  };
  
  // Handle form field changes
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Also update the context
    updateContextData(name, value);
  };
  
  // Update specific form data field
  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Also update the context
    updateContextData(field, value);
  };
  
  // Check if user can proceed to next step
  const canProceedToNextStep = () => {
    if (currentStep === 1) {
      // Validation for document upload - require at least one document
      return (formData.documents?.masterAgreement || 
              formData.documents?.rateCard || 
              (formData.documents?.amendments && formData.documents.amendments.length > 0));
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
  
  // Process data from extracted documents - now just prepares data for display
  const prepareExtractedData = () => {
    // Just use existing data from context
    // No need to re-extract from API since DocumentUploader does that
    setProcessingStage('processing');
    
    // Update the preview items from rate card data if available
    if (formData.extractedData?.rateCard) {
      const rateData = formData.extractedData.rateCard;
      if (rateData.previewItems) {
        setPreviewItems(rateData.previewItems);
      }
      if (rateData.estimatedTotal) {
        setTotalItems(rateData.estimatedTotal);
      }
    }
    
    // Update document info
    updateDocumentInfoFromContext(formData);
    
    // All done
    setProcessingStage(null);
  };
  
  // Handle final configuration confirmation
  const handleConfigurationConfirm = async () => {
    setProcessingStage('saving');
    try {
      // Save the relationship data and rate card
      const response = await fetch('/api/process-complete-rate-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          relationship: {
            provider: documentInfo?.provider?.name,
            masterAgreement: documentInfo?.masterAgreement,
            amendment: documentInfo?.amendment,
            rateCard: documentInfo?.rateCard
          },
          rates: previewItems,
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
        
        // Move to the final review step
        setCurrentStep(3);
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
          <div className="flex-1">Update Express Configuration</div>
          <div className="flex-1">Final Review & Submit</div>
        </div>
      </div>
      
      {/* Step 1: Document Upload */}
      {currentStep === 1 && (
        <DocumentUploadSection />
      )}
      
      {/* Step 2: Review & Enhance Configuration */}
      {currentStep === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column - Relationship Details & Rate Card */}
          <div>
            {/* Relationship Details Panel */}
            <div className="bg-gray-50 p-4 rounded mb-4">
              <h3 className="font-medium text-lg mb-3">Relationship Details</h3>
              
              {processingStage === 'processing' ? (
                <div className="flex items-center space-x-2 text-blue-700">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Preparing relationship details...</span>
                </div>
              ) : documentInfo ? (
                <div className="space-y-3">
                  {/* Provider Information */}
                  <div>
                    <p className="text-sm font-medium text-gray-700">Provider</p>
                    <p className="text-base">{documentInfo.provider?.name || "Unknown Provider"}</p>
                    {documentInfo.provider?.address && (
                      <p className="text-sm text-gray-600">{documentInfo.provider.address}</p>
                    )}
                  </div>
                  
                  {/* Agreement Information */}
                  {documentInfo.masterAgreement && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Master Agreement</p>
                      <p className="text-base">{documentInfo.masterAgreement.name}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        {documentInfo.masterAgreement.effectiveDate && (
                          <p>Effective: {documentInfo.masterAgreement.effectiveDate}</p>
                        )}
                        {documentInfo.masterAgreement.referenceNumber && (
                          <p>Ref #: {documentInfo.masterAgreement.referenceNumber}</p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Amendment Information (if available) */}
                  {documentInfo.amendment && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Amendment</p>
                      <p className="text-base">{documentInfo.amendment.name}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        {documentInfo.amendment.effectiveDate && (
                          <p>Effective: {documentInfo.amendment.effectiveDate}</p>
                        )}
                        {documentInfo.amendment.referenceNumber && (
                          <p>Ref #: {documentInfo.amendment.referenceNumber}</p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Rate Card Information (if available) */}
                  {documentInfo.rateCard && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Rate Card</p>
                      <p className="text-base">{documentInfo.rateCard.name}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        {documentInfo.rateCard.effectiveDate && (
                          <p>Effective: {documentInfo.rateCard.effectiveDate}</p>
                        )}
                        {documentInfo.rateCard.expirationDate && (
                          <p>Expires: {documentInfo.rateCard.expirationDate}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-500 italic">No relationship details extracted yet.</div>
              )}
            </div>
            
            {/* Rate Card Preview Panel */}
            <div className="bg-gray-50 p-4 rounded mb-4">
              <h3 className="font-medium text-lg mb-3">Rate Card Preview</h3>
              
              {processingStage === 'processing' ? (
                <div className="flex items-center space-x-2 text-blue-700">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Preparing rate card data...</span>
                </div>
              ) : previewItems.length > 0 ? (
                <div>
                  <p className="text-sm mb-2">Found {totalItems} rates. Showing first {Math.min(5, previewItems.length)} items:</p>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="p-2 text-left">Title</th>
                          <th className="p-2 text-right">Rate</th>
                          <th className="p-2 text-left">Unit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewItems.slice(0, 5).map((item, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-2">{item.title || item.description || "Unnamed Rate"}</td>
                            <td className="p-2 text-right">
                              <input
                                type="text"
                                value={item.rate != null ? item.rate : ''}
                                onChange={(e) => handleRateChange(index, 'rate', e.target.value)}
                                className="w-20 p-1 text-right border rounded"
                              />
                            </td>
                            <td className="p-2">{item.unit || "Hour"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {totalItems > 5 && (
                    <p className="text-sm text-gray-500 mt-2">
                      + {totalItems - 5} more rates will be saved with the configuration.
                    </p>
                  )}
                </div>
              ) : formData.documents.rateCard ? (
                <div className="text-gray-500 italic">Processing rate card...</div>
              ) : (
                <div className="text-gray-500 italic">No rate card uploaded.</div>
              )}
            </div>
          </div>
          
          {/* Right Column - Additional Information */}
          <div>
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-medium text-lg mb-3">Additional Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Supplier Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleFieldChange}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category || ''}
                      onChange={handleFieldChange}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
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
                      value={formData.contactName || ''}
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
                      value={formData.contactEmail || ''}
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
                      value={formData.contactPhone || ''}
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
                      value={formData.website || ''}
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
                      value={formData.msaReference || ''}
                      onChange={handleFieldChange}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Agreement Type
                    </label>
                    <select
                      name="agreementType"
                      value={formData.agreementType || 'Fixed Term'}
                      onChange={handleFieldChange}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
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
                      value={formData.effectiveDate || ''}
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
                      value={formData.termEndDate || ''}
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
                      value={formData.status || 'Pending'}
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
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Final Review & Submit */}
      {currentStep === 3 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Final Review</h2>
          <div className="bg-blue-50 p-4 rounded mb-4 border border-blue-200">
            <div className="flex">
              <svg className="w-6 h-6 text-blue-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm text-blue-800 font-medium">Configuration Ready!</p>
                <p className="text-sm text-blue-700 mt-1">
                  Your supplier configuration has been created successfully. Please review the details below and click "Submit" to finalize.
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="bg-gray-50 p-4 rounded mb-4">
              <h3 className="font-medium text-lg mb-2">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Supplier Name</p>
                  <p className="font-medium">{formData.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium">{formData.category || "Not specified"}</p>
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
              
              {/* Contact Information */}
              {(formData.contactName || formData.contactEmail || formData.contactPhone) && (
                <div className="mt-4">
                  <h4 className="font-medium text-md mb-2">Contact Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {formData.contactName && (
                      <div>
                        <p className="text-sm text-gray-500">Contact Name</p>
                        <p className="font-medium">{formData.contactName}</p>
                      </div>
                    )}
                    {formData.contactEmail && (
                      <div>
                        <p className="text-sm text-gray-500">Contact Email</p>
                        <p className="font-medium">{formData.contactEmail}</p>
                      </div>
                    )}
                    {formData.contactPhone && (
                      <div>
                        <p className="text-sm text-gray-500">Contact Phone</p>
                        <p className="font-medium">{formData.contactPhone}</p>
                      </div>
                    )}
                    {formData.website && (
                      <div>
                        <p className="text-sm text-gray-500">Website</p>
                        <p className="font-medium">{formData.website}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Documents */}
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
                
                {formData.extractedData.rateCard?.processed && (
                  <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
                    <p className="text-green-700">
                      Successfully processed rate card with {formData.extractedData.rateCard.totalProcessed} items.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Rate Card Summary */}
          {previewItems.length > 0 && (
            <div className="bg-gray-50 p-4 rounded mb-4">
              <h3 className="font-medium text-lg mb-2">Rate Card Summary</h3>
              <p className="text-sm mb-3">Total of {totalItems} rates have been extracted. Below are some sample rates:</p>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rate
                      </th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {previewItems.slice(0, 5).map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {item.title || item.description || "Unnamed Rate"}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                          {item.rate != null ? `$${item.rate.toFixed(2)}` : 'N/A'}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {item.unit || "Hour"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {totalItems > 5 && (
                <p className="text-sm text-gray-500 mt-2">
                  + {totalItems - 5} more rates will be configured.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-6 flex justify-between">
        {/* Back button (hidden on first step) */}
        {currentStep > 1 && (
          <button
            type="button"
            onClick={() => setCurrentStep(prev => prev - 1)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back
          </button>
        )}
        
        {/* Spacer div when back button is hidden */}
        {currentStep === 1 && <div></div>}
        
        {/* Next/Submit buttons */}
        <div className="flex space-x-3">
          {/* Skip to final button (only on step 2) */}
          {currentStep === 2 && (
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="text-royalBlue hover:underline flex items-center"
            >
              <span>Skip to final review</span>
              <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
          
          {/* Process Documents button (Step 1) */}
          {currentStep === 1 && (
            <button
              type="button"
              onClick={() => {
                setCurrentStep(2);
                prepareExtractedData(); // Now just prepares data, doesn't re-extract
              }}
              disabled={!canProceedToNextStep()}
              className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white ${
                canProceedToNextStep() 
                  ? 'bg-royalBlue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Process Documents
            </button>
          )}
          
          {/* Confirm Configuration button (Step 2) */}
          {currentStep === 2 && (
            <button
              type="button"
              onClick={handleConfigurationConfirm}
              disabled={processingStage !== null}
              className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white ${
                processingStage === null
                  ? 'bg-royalBlue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {processingStage !== null ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Confirm Configuration"
              )}
            </button>
          )}
          
          {/* Submit button (Step 3) */}
          {currentStep === 3 && (
            <button
              type="button"
              onClick={() => onCreateProvider(formData)}
              className="px-4 py-2 bg-green-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewSupplierWorkflow;               
