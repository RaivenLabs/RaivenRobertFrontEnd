import React, { useState, useEffect } from 'react';
import { useSupplier } from '../SupplierContext';
import RateCardPreview from './RateCardPreview';

const SupplierConfigurationStep = ({ 
  currentStep,
  processingStage = null // 'document', 'relationship', 'details', 'rates', 'complete', 'error'
}) => {
  const { 
    formData, 
    updateFormData, 
    updateField, 
 
    extractedRates = [],
    totalRates = 0
  } = useSupplier();

  const extractedData = formData.extractedData || {};

  // Debug logging on mount and when extractedData changes
  useEffect(() => {
    console.log('SupplierConfigurationStep - Component Mounted or Updated');
    console.log('extractedData:', extractedData);
    console.log('extractedData type:', typeof extractedData);
    console.log('extractedData keys:', extractedData ? Object.keys(extractedData) : 'N/A');
    console.log('rateCardEffectiveDate:', extractedData?.rateCardEffectiveDate);
    console.log('formData:', formData);
    console.log('processingStage:', processingStage);
  }, [extractedData, formData, processingStage]);
  
  // Local state for rate card values
  const [rateItems, setRateItems] = useState(extractedRates);
  
  // Update rateItems when extractedRates changes from context
  useEffect(() => {
    if (extractedRates && extractedRates.length > 0) {
      setRateItems(extractedRates);
    }
  }, [extractedRates]);

  // Handle field changes for supplier details
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    updateField(name, value);
  };

  // Handle rate value changes
  const handleRateChange = (index, field, value) => {
    const updatedItems = [...rateItems];
    updatedItems[index][field] = value;
    setRateItems(updatedItems);
    
    // Update context with these changes
    updateFormData('extractedRates', updatedItems);
  };

  // Add progress indicators for different processing stages
  const renderProgressIndicators = () => {
    const stages = [
      { id: 'document', label: 'Document Processing', complete: processingStage !== 'document' },
      { id: 'relationship', label: 'Extracting Agreement Details', complete: processingStage !== 'document' && processingStage !== 'relationship' },
      { id: 'details', label: 'Extracting Supplier Details', complete: processingStage !== 'document' && processingStage !== 'relationship' && processingStage !== 'details' },
      { id: 'rates', label: 'Building Rate Table', complete: processingStage !== 'document' && processingStage !== 'relationship' && processingStage !== 'details' && processingStage !== 'rates' },
    ];
    
    return (
      <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Extraction Progress</h3>
        <div className="flex flex-wrap items-center space-x-2">
          {stages.map((stage, index) => (
            <React.Fragment key={stage.id}>
              <div className={`flex items-center space-x-1 ${processingStage === stage.id ? 'text-blue-600' : stage.complete ? 'text-green-600' : 'text-gray-400'}`}>
                {stage.complete ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : processingStage === stage.id ? (
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                  </svg>
                )}
                <span className="text-sm font-medium">{stage.label}</span>
              </div>
              
              {index < stages.length - 1 && (
                <div className={`w-5 h-0.5 ${stages[index].complete && stages[index + 1].complete ? 'bg-green-500' : 'bg-gray-300'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  // Skip if not the current step
  if (currentStep !== 2) {
    return null;
  }

  // Debug log when rendering
  console.log('SupplierConfigurationStep - Rendering');
  console.log('extractedData available during render:', extractedData);
  console.log('rateCardEffectiveDate during render:', extractedData?.rateCardEffectiveDate);

  // Determine if we're still processing
  const isProcessing = processingStage !== null && processingStage !== 'complete' && processingStage !== 'error';

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString();
    } catch (e) {
      return dateStr; // Return original string if parsing fails
    }
  };

  // Safe access to data
  const safeGetData = (obj, path, defaultValue = null) => {
    if (!obj) return defaultValue;
    const parts = path.split('.');
    let current = obj;
    
    for (const part of parts) {
      if (current[part] === undefined || current[part] === null) {
        return defaultValue;
      }
      current = current[part];
    }
    
    return current;
  };

  return (
    <div className="space-y-6">
      {/* Show progress indicators during processing */}
      {isProcessing && renderProgressIndicators()}
      
      {/* Show error message if extraction failed */}
      {processingStage === 'error' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="font-medium">Error extracting data from document</p>
          </div>
          <p className="text-sm mt-2">We encountered a problem while processing your document. You can still manually enter the information below.</p>
        </div>
      )}
      
      {/* Debug Panel */}
      <div className="bg-yellow-50 p-3 rounded border border-yellow-200 text-xs overflow-auto max-h-40">
        <details>
          <summary className="cursor-pointer font-bold">Debug: extractedData</summary>
          <pre>{JSON.stringify(extractedData, null, 2)}</pre>
        </details>
      </div>
      
      {/* Panel 1: Supplier Agreement Package */}
      <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Supplier Agreement Package</h3>
        
        {isProcessing && (processingStage === 'document' || processingStage === 'relationship') ? (
          <div className="flex items-center space-x-2 text-blue-700">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Extracting agreement information...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Master Agreement Information */}
            <div className="border p-4 rounded-lg bg-white">
              <h4 className="font-medium mb-2">Master Agreement</h4>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="text-gray-500">Name:</span> {safeGetData(extractedData, 'msaName') || safeGetData(extractedData, 'masterAgreement.name') || "Not detected"}
                </p>
                <p className="text-sm">
                  <span className="text-gray-500">Reference Number:</span> {safeGetData(extractedData, 'msaReference') || safeGetData(extractedData, 'masterAgreement.referenceNumber') || "Not detected"}
                </p>
                <p className="text-sm">
                  <span className="text-gray-500">Effective Date:</span> {formatDate(safeGetData(extractedData, 'effectiveDate') || safeGetData(extractedData, 'masterAgreement.effectiveDate')) || "Not detected"}
                </p>
                <p className="text-sm">
                  <span className="text-gray-500">Expiration Date:</span> {formatDate(safeGetData(extractedData, 'termEndDate') || safeGetData(extractedData, 'masterAgreement.expirationDate')) || "Not detected"}
                </p>
              </div>
            </div>
            
            {/* Provider Information */}
            <div className="border p-4 rounded-lg bg-white">
              <h4 className="font-medium mb-2">Provider</h4>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="text-gray-500">Name:</span> {safeGetData(extractedData, 'name') || safeGetData(extractedData, 'provider.name') || "Unknown Provider"}
                </p>
                <p className="text-sm">
                  <span className="text-gray-500">Address:</span> {safeGetData(extractedData, 'address') || safeGetData(extractedData, 'provider.address') || "Not detected"}
                </p>
              </div>
            </div>
            
            {/* Amendment Information (if available) */}
            {(safeGetData(extractedData, 'amendmentNumber') || safeGetData(extractedData, 'amendment.name')) && (
              <div className="border p-4 rounded-lg bg-white">
                <h4 className="font-medium mb-2">Amendment</h4>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="text-gray-500">Number:</span> {safeGetData(extractedData, 'amendmentNumber') || safeGetData(extractedData, 'amendment.name') || "Not detected"}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-500">Effective Date:</span> {formatDate(safeGetData(extractedData, 'amendmentEffectiveDate') || safeGetData(extractedData, 'amendment.effectiveDate')) || "Not detected"}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-500">Reference Number:</span> {safeGetData(extractedData, 'amendmentReferenceNumber') || safeGetData(extractedData, 'amendment.referenceNumber') || "Not detected"}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-500">Key Changes:</span> {safeGetData(extractedData, 'keyChanges') || "Not detected"}
                  </p>
                </div>
              </div>
            )}
            
            {/* Rate Card Information (if available) - FIXED WITH SAFE ACCESS */}
            {(safeGetData(extractedData, 'rateCardEffectiveDate') || 
               safeGetData(extractedData, 'rateCard.effectiveDate') ||
               (extractedRates && extractedRates.length > 0)) && (
              <div className="border p-4 rounded-lg bg-white">
                <h4 className="font-medium mb-2">Rate Card</h4>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="text-gray-500">Effective Date:</span> {formatDate(safeGetData(extractedData, 'rateCardEffectiveDate') || safeGetData(extractedData, 'rateCard.effectiveDate')) || "Not detected"}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-500">Expiration Date:</span> {formatDate(safeGetData(extractedData, 'rateCardExpirationDate') || safeGetData(extractedData, 'rateCard.expirationDate')) || "Not detected"}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-500">Currency:</span> {safeGetData(extractedData, 'currency') || "Not detected"}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-500">Total Rates:</span> {totalRates || (extractedRates && extractedRates.length) || 0}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Panel 2: Supplier Details */}
      <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Supplier Details</h3>
        
        {isProcessing && processingStage === 'details' ? (
          <div className="flex items-center space-x-2 text-blue-700">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Extracting supplier details...</span>
          </div>
        ) : (
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
            
            {/* Other form fields remain the same */}
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
                CLM Reference #
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
        )}
      </div>
      
      {/* Panel 3: Rate Card Preview */}
      <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Rate Card Preview</h3>
        
        <RateCardPreview 
          previewItems={rateItems}
          totalItems={totalRates || rateItems.length}
          processingStage={processingStage}
          onRateChange={handleRateChange}
        />
      </div>
    </div>
  );
};

export default SupplierConfigurationStep;
