import React, { useState, useRef } from 'react';
import { useSupplier } from '../SupplierContext';

const DocumentUploadSection = () => {
  // Get what you need from context
  const { 
    formData, 
    updateFormData, 
    updateField,
    extractDocumentData
  } = useSupplier();
  
  // Extract the data you need from formData
  const documents = formData.documents;
  const extractedData = formData.extractedData;
  
  // State for rate card handling
  const [cardType, setCardType] = useState('standalone');
  const [showRateCardPreview, setShowRateCardPreview] = useState(false);
  const [previewItems, setPreviewItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  
  // Add state for tracking extraction process
  const [isProcessing, setIsProcessing] = useState(null);
  
  // State to track which dropzone is active
  const [activeDropzone, setActiveDropzone] = useState(null);
  
  // References to file inputs
  const fileInputRefs = {
    masterAgreement: useRef(null),
    rateCard: useRef(null),
    amendments: useRef(null),
    localCountryAgreements: useRef(null),
    orderTemplates: useRef(null),
    serviceOrders: useRef(null)
  };
  
  // Handle drag events
  const handleDragEnter = (e, documentType) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDropzone(documentType);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDropzone(null);
  };
  
  const handleDrop = (e, documentType) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDropzone(null);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      // Create a synthetic event object with the file
      const syntheticEvent = {
        target: {
          files: documentType === 'amendments' || 
                 documentType === 'localCountryAgreements' || 
                 documentType === 'orderTemplates' ||
                 documentType === 'serviceOrders'
                   ? [files[0]] // For multi-document types, we'll handle one at a time
                   : files
        }
      };
      
      if (documentType === 'rateCard') {
        handleRateCardUpload(syntheticEvent);
      } else {
        handleDocumentUpload(syntheticEvent, documentType);
      }
    }
  };
  // Handle browse button click
  const handleBrowseClick = (documentType) => {
    fileInputRefs[documentType].current.click();
  };
  
  // Document upload handler for regular documents
  const handleDocumentUpload = async (e, documentType) => {
    console.log("🚀 Processing document upload for:", documentType);
    
    const file = e.target.files[0];
    if (!file) return;
    
    console.log(`File: ${file.name}, Size: ${file.size} bytes, Type: ${documentType}`);
    
    // Update documents state in context
    if (documentType === 'amendments' || 
        documentType === 'localCountryAgreements' || 
        documentType === 'orderTemplates' ||
        documentType === 'serviceOrders') {
      updateFormData('documents', prev => ({
        ...prev,
        [documentType]: [...prev[documentType], file]
      }));
    } else {
      updateFormData('documents', prev => ({
        ...prev,
        [documentType]: file
      }));
    }
    
    // Set processing state for this document type
    setIsProcessing(documentType);
    
    try {
      // Call the extraction API through your context
      const extractedData = await extractDocumentData(file, documentType);
      
      // Update extracted data in context based on document type
      if (extractedData) {
        updateFormData('extractedData', prev => ({
          ...prev,
          [documentType]: extractedData
        }));
      }
      
      // For MSA specifically, also update main form fields
      if (documentType === 'masterAgreement') {
        Object.entries(extractedData).forEach(([key, value]) => {
          updateField(key, value);
        });
      }
      
    } catch (error) {
      console.error(`Error extracting data from ${documentType}:`, error);
      // You might want to show an error message to the user here
    } finally {
      setIsProcessing(null);
    }
  };
  
  // Specialized handler for rate card uploads
  const handleRateCardUpload = async (e) => {
    console.log("🚀 Processing rate card upload");
    
    const file = e.target.files[0];
    if (!file) return;
    
    console.log(`File: ${file.name}, Size: ${file.size} bytes, Type: rate card (${cardType})`);
    
    // Update documents state in context
    updateFormData('documents', prev => ({
      ...prev,
      rateCard: file
    }));
    
    // Set processing state for rate card
    setIsProcessing('rateCard');
    
    try {
      // Create form data for the specialized rate card API
      const formData = new FormData();
      formData.append('file', file);
      formData.append('cardType', cardType);
      formData.append('providerId', formData.id || 'new'); // Use ID if existing, or 'new'
      
      // Call the rate card extraction API
      const response = await fetch('/api/extract-rate-card', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        setPreviewItems(data.previewItems || data.previewBatch || []);
        setTotalItems(data.estimatedTotal || 0);
        setShowRateCardPreview(true);
      } else {
        throw new Error('Failed to extract rate card data');
      }
    } catch (error) {
      console.error('Error extracting rate card data:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsProcessing(null);
    }
  };
  
  // Handle rate card confirmation
  const handleRateCardConfirm = async () => {
    setIsProcessing('rateCard');
    try {
      const response = await fetch('/api/process-complete-rate-card', {
        method: 'POST'
      });
      
      if (response.ok) {
        const result = await response.json();
        // Update context with success info
        updateFormData('extractedData', prev => ({
          ...prev,
          rateCard: {
            processed: true,
            rateCardId: result.rateCardId,
            totalProcessed: result.totalProcessed
          }
        }));
        setShowRateCardPreview(false);
      }
    } catch (error) {
      console.error('Error processing complete rate card:', error);
    } finally {
      setIsProcessing(null);
    }
  };

  // Render a document upload section
  const renderDocumentUploader = (documentType, title, description, isRequired = false) => {
    const isActive = activeDropzone === documentType;
    const hasFile = documentType === 'amendments' || 
                    documentType === 'localCountryAgreements' || 
                    documentType === 'orderTemplates' ||
                    documentType === 'serviceOrders'
                      ? documents[documentType].length > 0
                      : documents[documentType];
    
    return (
      <div className="p-5 border rounded-lg">
        <div className="flex justify-between mb-4">
          <div>
            <h4 className="font-medium">
              {title} {isRequired && <span className="text-red-500">*</span>}
            </h4>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          </div>
          <div>
            {/* Success checkmark for single documents */}
            {hasFile && documentType !== 'amendments' && 
             documentType !== 'localCountryAgreements' && 
             documentType !== 'orderTemplates' &&
             documentType !== 'serviceOrders' && (
              <span className="text-green-600 flex items-center">
                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Uploaded
              </span>
            )}
          </div>
        </div>
        
        {/* Rate Card Type Selector (only for rate card) */}
        {documentType === 'rateCard' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rate Card Type
            </label>
            <select
              value={cardType}
              onChange={(e) => setCardType(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="standalone">Standalone Rate Card</option>
              <option value="amendment">Rate Card in Amendment</option>
              <option value="msa_exhibit">Rate Card in MSA Exhibit</option>
            </select>
          </div>
        )}
        
        {/* Drag & Drop Zone */}
        <div 
          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
            ${isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
            ${hasFile && documentType !== 'amendments' && 
              documentType !== 'localCountryAgreements' && 
              documentType !== 'orderTemplates' &&
              documentType !== 'serviceOrders' ? 'bg-green-50' : ''}
          `}
          onDragEnter={(e) => handleDragEnter(e, documentType)}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, documentType)}
          onClick={() => handleBrowseClick(documentType)}
        >
          <input 
            type="file" 
            ref={fileInputRefs[documentType]}
            onChange={(e) => documentType === 'rateCard' 
              ? handleRateCardUpload(e) 
              : handleDocumentUpload(e, documentType)}
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center py-3">
            <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm text-gray-600">Drag and drop your file here, or click to browse</p>
            <p className="text-xs text-gray-500 mt-1">PDF, Word, or Excel files accepted</p>
          </div>
        </div>
        
        {/* Processing indicator for document extraction */}
        {isProcessing === documentType && (
          <div className="mt-3 p-2 bg-blue-50 rounded flex items-center">
            <svg className="animate-spin h-4 w-4 text-blue-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm text-blue-700">Extracting information...</span>
          </div>
        )}

        {/* Success indicator for document extraction */}
        {extractedData && 
         extractedData[documentType] && 
         ((documentType === 'amendments' || 
           documentType === 'localCountryAgreements' || 
           documentType === 'orderTemplates' ||
           documentType === 'serviceOrders') 
            ? documents[documentType].length > 0 
            : documents[documentType]) && (
          <div className="mt-3 p-2 bg-green-50 rounded flex items-center">
            <svg className="h-4 w-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-green-700">Successfully extracted information!</span>
          </div>
        )}
        
        {/* File list for multi-file uploads */}
        {(documentType === 'amendments' || 
          documentType === 'localCountryAgreements' || 
          documentType === 'orderTemplates' ||
          documentType === 'serviceOrders') && 
         documents[documentType].length > 0 && (
          <div className="mt-3">
            <p className="text-sm font-medium mb-2">
              Uploaded Files ({documents[documentType].length})
            </p>
            <ul className="text-sm space-y-1 max-h-32 overflow-y-auto bg-gray-50 rounded p-2">
              {documents[documentType].map((file, index) => (
                <li key={index} className="text-gray-700 flex items-center">
                  <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {file.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };
  
  // Rate Card Preview Component
  const RateCardPreview = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-6xl max-h-[90vh] overflow-auto">
          <h2 className="text-xl font-bold mb-4">Rate Card Preview</h2>
          <p className="mb-4 text-gray-600">
            Showing {previewItems.length} of approximately {totalItems} rates. 
            Please review and confirm to save all rates.
          </p>
          
          {/* Rate table */}
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse mb-4">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 border">Job Code</th>
                  <th className="px-3 py-2 border">Job Title</th>
                  <th className="px-3 py-2 border">Rate (USD)</th>
                  {/* Add other columns based on your data structure */}
                </tr>
              </thead>
              <tbody>
                {previewItems.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="px-3 py-2 border">{item.jobCode || item.code || ''}</td>
                    <td className="px-3 py-2 border">{item.jobTitle || item.roleTitle || ''}</td>
                    <td className="px-3 py-2 border text-right">
                      ${typeof item.rate === 'number' ? item.rate.toFixed(2) : item.rate || ''}
                    </td>
                    {/* Add other cells based on your data structure */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setShowRateCardPreview(false)}
              disabled={isProcessing === 'rateCard'}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleRateCardConfirm}
              disabled={isProcessing === 'rateCard'}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isProcessing === 'rateCard' ? 'Processing...' : `Save All ${totalItems} Rates`}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium">Upload Documents</h3>
        <p className="text-gray-600 mt-1">
          Start by uploading key supplier documents. Our AI will automatically extract essential 
          information, saving you time on manual data entry.
        </p>
        
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex">
            <svg className="w-6 h-6 text-blue-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-blue-800">
              <strong>Time-Saving Tip:</strong> We encourage you to upload any artifacts that are included in the Supplier Transaction Family. We will 
              automatically extract key information like supplier name, effective dates, and reference 
              numbers to minimize manual entry. All transaction documents will improve data accuracy, and save a great deal of time in inputting the data required to build your orders.
            </p>
          </div>
        </div>
      </div>
      
      {/* Master Agreement Upload */}
      {renderDocumentUploader(
        'masterAgreement',
        'Master Service Agreement (MSA)',
        'Upload to automatically extract supplier information, effective dates, and reference numbers',
        false // Making this optional to match your requirement
      )}
      
      {/* Rate Card Upload */}
      {renderDocumentUploader(
        'rateCard',
        'Rate Card',
        'Upload to automatically capture pricing information for different service categories'
      )}
      
      {/* Service Orders Upload */}
      {renderDocumentUploader(
        'serviceOrders',
        'Service Orders',
        'Upload executed service orders to extract detailed project information, timelines, and resource rates'
      )}
      
      {/* Amendments Upload */}
      {renderDocumentUploader(
        'amendments',
        'Amendments',
        'Upload any amendments to the MSA that modify terms or pricing'
      )}
      
      {/* Local Country Agreements Upload */}
      {renderDocumentUploader(
        'localCountryAgreements',
        'Local Country Agreements',
        'Upload any country-specific agreements or addendums'
      )}
      
      {/* Order Templates Upload */}
      {renderDocumentUploader(
        'orderTemplates',
        'Order Templates',
        'Upload any standard order templates for this supplier'
      )}
      
      {/* Overall success message */}
      {extractedData && (
        <div className="p-4 border border-green-200 rounded-lg bg-green-50">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium text-green-800">Information Successfully Extracted</p>
              <p className="text-sm text-green-700 mt-1">
                We've automatically extracted key information from your documents. In the next step,
                you can review and make any necessary adjustments.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Rate Card Preview Modal */}
      {showRateCardPreview && <RateCardPreview />}
    </div>
  );
};

export default DocumentUploadSection;
