import React, { useState, useEffect } from 'react';
import { useSupplier } from '../SupplierContext';
import RateCardPreview from './RateCardPreview';

const SupplierConfigurationStep = ({ 
  currentStep, 
  documentInfo, 
  previewItems = [], 
  totalItems = 0,
  processingStage = null
}) => {
  const { formData, updateFormData, updateField } = useSupplier();
  
  // Local state for rate card values
  const [rateItems, setRateItems] = useState(previewItems);
  
  // Update rateItems when previewItems changes
  useEffect(() => {
    if (previewItems && previewItems.length > 0) {
      setRateItems(previewItems);
    }
  }, [previewItems]);

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
    
    // You may want to update the context with these changes
    updateFormData('extractedRates', updatedItems);
  };

  // Add progress indicators from ConfigurationPreview
  const renderProgressIndicators = () => {
    const stages = [
      { id: 'document', label: 'Document Processing', complete: processingStage !== 'document' },
      { id: 'ocr', label: 'OCR Processing', complete: processingStage !== 'document' && processingStage !== 'ocr' },
      { id: 'extract', label: 'Extracting Relationships', complete: processingStage !== 'document' && processingStage !== 'ocr' && processingStage !== 'extract' },
      { id: 'rates', label: 'Building Rate Table', complete: processingStage !== 'document' && processingStage !== 'ocr' && processingStage !== 'extract' && processingStage !== 'rates' },
    ];
    
    return (
      <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Extraction Progress</h3>
        <div className="flex items-center space-x-2">
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

  // Determine if we're still processing
  const isProcessing = processingStage !== null && processingStage !== 'complete';

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

  return (
    <div className="space-y-6">
      {/* Show progress indicators during processing */}
      {processingStage && processingStage !== 'complete' && renderProgressIndicators()}
      
      {/* Panel 1: Supplier Agreement Package */}
      <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Supplier Agreement Package</h3>
        
        {isProcessing && processingStage === 'document' ? (
          <div className="flex items-center space-x-2 text-blue-700">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Extracting document information...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Master Agreement Information */}
            <div className="border p-4 rounded-lg bg-white">
              <h4 className="font-medium mb-2">Master Agreement</h4>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="text-gray-500">Name:</span> {documentInfo?.masterAgreement?.name || "Not detected"}
                </p>
                <p className="text-sm">
                  <span className="text-gray-500">Reference Number:</span> {documentInfo?.masterAgreement?.referenceNumber || "Not detected"}
                </p>
                <p className="text-sm">
                  <span className="text-gray-500">Effective Date:</span> {formatDate(documentInfo?.masterAgreement?.effectiveDate) || "Not detected"}
                </p>
                <p className="text-sm">
                  <span className="text-gray-500">Expiration Date:</span> {formatDate(documentInfo?.masterAgreement?.expirationDate) || "Not detected"}
                </p>
              </div>
            </div>
            
            {/* Provider Information */}
            <div className="border p-4 rounded-lg bg-white">
              <h4 className="font-medium mb-2">Provider</h4>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="text-gray-500">Name:</span> {documentInfo?.provider?.name || "Unknown Provider"}
                </p>
                <p className="text-sm">
                  <span className="text-gray-500">Address:</span> {documentInfo?.provider?.address || "Not detected"}
                </p>
              </div>
            </div>
            
            {/* Amendment Information (if available) */}
            {documentInfo?.amendment && (
              <div className="border p-4 rounded-lg bg-white">
                <h4 className="font-medium mb-2">Amendment</h4>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="text-gray-500">Name:</span> {documentInfo.amendment.name || "Not detected"}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-500">Reference Number:</span> {documentInfo.amendment.referenceNumber || "Not detected"}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-500">Effective Date:</span> {formatDate(documentInfo.amendment.effectiveDate) || "Not detected"}
                  </p>
                </div>
              </div>
            )}
            
            {/* Rate Card Information (if available) */}
            {documentInfo?.rateCard && (
              <div className="border p-4 rounded-lg bg-white">
                <h4 className="font-medium mb-2">Rate Card</h4>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="text-gray-500">Name:</span> {documentInfo.rateCard.name || "Not detected"}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-500">Effective Date:</span> {formatDate(documentInfo.rateCard.effectiveDate) || "Not detected"}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-500">Expiration Date:</span> {formatDate(documentInfo.rateCard.expirationDate) || "Not detected"}
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
      
      {/* Panel 3: Rate Card Preview */}
      <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Rate Card Preview</h3>
        
        <RateCardPreview 
          previewItems={rateItems}
          totalItems={totalItems}
          processingStage={processingStage}
          onRateChange={handleRateChange}
        />
      </div>
      
      {/* We've removed the navigation buttons since they're handled by the parent component */}
    </div>
  );
};

export default SupplierConfigurationStep;
