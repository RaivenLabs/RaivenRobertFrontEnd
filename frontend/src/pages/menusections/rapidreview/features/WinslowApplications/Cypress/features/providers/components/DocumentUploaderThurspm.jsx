import React, { useRef, useState } from 'react';
import { useSupplier } from '../SupplierContext';
import FileList from './FileList';

const DocumentUploader = ({
  documentType,
  title,
  description,
  isMultiFile = false,
  isRateCard = false
}) => {
  // Get what you need directly from context
  const { 
    formData, 
    updateFormData, 
    updateField
  } = useSupplier();
  
  // Extract documents and extractedData from context
  const documents = formData.documents || {};
  const extractedData = formData.extractedData || {};
  
  // Local state for UI
  const fileInputRef = useRef(null);
  const [activeDropzone, setActiveDropzone] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState(null); // Local processing stage
  const [cardType, setCardType] = useState('standalone');
  
  // Check for file existence based on document type
  const hasFile = isMultiFile
    ? documents[documentType] && Array.isArray(documents[documentType]) && documents[documentType].length > 0
    : Boolean(documents[documentType]);
    
  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDropzone(true);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDropzone(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDropzone(false);
    
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      if (isRateCard) {
        handleRateCardUpload(files[0]);
      } else {
        handleDocumentUpload(files[0]);
      }
    }
  };
  
  // Handle browse button click
  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    
    if (isRateCard) {
      handleRateCardUpload(file);
    } else {
      handleDocumentUpload(file);
    }
  };
  
  // Extract document info from a document (includes both relationship and supplier details)
  const extractDocumentInfo = async (file, docType, formDataObj) => {
    try {
      // Update processing stage
      setProcessingStage('rates');
      updateFormData('processingStage', 'rates');
      
      // TEMPORARY: Comment out the actual API call
      /*
      // Call the unified rate extraction API
      const response = await fetch('/api/extract-rate-card', {
        method: 'POST',
        body: formDataObj
      });
      
      if (!response.ok) {
        throw new Error(`Failed to extract rates from ${docType}`);
      }
      
      const data = await response.json();
      */
      
      // TEMPORARY: Use mock data instead
      console.log('Using mock data instead of calling API');
      
      // Mock data that mimics the structure from your Python backend
      const data = {
        previewItems: [
          {
            job_code: "B9071",
            job_title: "Agile Lead 1",
            us_region1_rate: 155.00,
            us_region2_rate: 145.00,
            us_region3_rate: 135.00,
            india_rate: 65.00
          },
          {
            job_code: "B9072",
            job_title: "Agile Lead 2",
            us_region1_rate: 165.00,
            us_region2_rate: 155.00,
            us_region3_rate: 145.00,
            india_rate: 75.00
          },
          {
            job_code: "D2033",
            job_title: "Senior Developer",
            us_region1_rate: 135.00,
            us_region2_rate: 125.00,
            us_region3_rate: 115.00,
            india_rate: 55.00
          }
        ],
        estimatedTotal: 3
      };
      
      console.log('Mock API Response Data:', data);
      
      // Update extracted rates in context
      updateFormData('extractedRates', data.previewItems || []);
      updateFormData('totalRates', data.estimatedTotal || data.previewItems?.length || 0);
      
      // Add debug logs to see what's stored in context
      setTimeout(() => {
        console.log('Current extractedRates in context:', formData.extractedRates);
      }, 100);
      
      // Mark processing as complete
      setProcessingStage('complete');
      updateFormData('processingStage', 'complete');
      
      return data;
    } catch (error) {
      console.error(`Error extracting rates from ${docType}:`, error);
      setProcessingStage('error');
      updateFormData('processingStage', 'error');
      return null;
    }
  };
  
  // Document upload handler for regular documents
  const handleDocumentUpload = async (file) => {
    console.log(`File: ${file.name}, Size: ${file.size} bytes, Type: ${documentType}`);
    
    // Update documents state in context
    if (isMultiFile) {
      updateFormData('documents', prev => ({
        ...prev,
        [documentType]: [...(prev?.[documentType] || []), file]
      }));
    } else {
      updateFormData('documents', prev => ({
        ...prev,
        [documentType]: file
      }));
    }
    
    // Set processing state
    setIsProcessing(true);
    setProcessingStage('document');
    updateFormData('processingStage', 'document');
    
    try {
      // Create form data for the document extraction API
      const formDataObj = new FormData();
      formDataObj.append('file', file);
      formDataObj.append('documentType', documentType);
      
      // Use provider ID from formData
      const providerId = formData?.id || 'new';
      formDataObj.append('providerId', providerId);
      
      // Extract document info (relationship + supplier details)
      await extractDocumentInfo(file, documentType, formDataObj);
      
      // If this is a Master Agreement or Amendment, also extract rates
      if (documentType === 'masterAgreement' || documentType === 'amendments') {
        extractRates(file, documentType, formDataObj);
      } else {
        // If not extracting rates, mark processing as complete
        setProcessingStage('complete');
        updateFormData('processingStage', 'complete');
      }
    } catch (error) {
      console.error(`Error processing ${documentType}:`, error);
      setProcessingStage('error');
      updateFormData('processingStage', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Function to extract rates from documents
  const extractRates = async (file, docType, formDataObj) => {
    try {
      // Update processing stage
      setProcessingStage('rates');
      updateFormData('processingStage', 'rates');
      
      // Call the unified rate extraction API
      const response = await fetch('/api/extract-rate-card', {
        method: 'POST',
        body: formDataObj
      });
      
      if (!response.ok) {
        throw new Error(`Failed to extract rates from ${docType}`);
      }
      
      const data = await response.json();
      
      console.log('API Response Data:', data);
      console.log('preview_items (snake_case):', data.preview_items);
      console.log('previewItems (camelCase):', data.previewItems);
      
      // Update extracted rates in context - check for both snake_case and camelCase
      updateFormData('extractedRates', data.previewItems || data.preview_items || []);
      updateFormData('totalRates', data.estimatedTotal || data.totalCount || 
                           (data.previewItems?.length || data.preview_items?.length || 0));
      
      // Log what was stored in context
      console.log('Stored in extractedRates:', data.previewItems || data.preview_items || []);
      console.log('Stored in totalRates:', data.estimatedTotal || data.totalCount || 
                           (data.previewItems?.length || data.preview_items?.length || 0));
      console.log('Current extractedRates in context:', formData.extractedRates)
      
      
      // Mark processing as complete
      setProcessingStage('complete');
      updateFormData('processingStage', 'complete');
      
      return data;
    } catch (error) {
      console.error(`Error extracting rates from ${docType}:`, error);
      setProcessingStage('error');
      updateFormData('processingStage', 'error');
      return null;
    }
  };

  // Document upload handler for rate cards
  const handleRateCardUpload = async (file) => {
    console.log(`File: ${file.name}, Size: ${file.size} bytes, Type: rate card (${cardType})`);
    
    // Update documents state in context
    updateFormData('documents', prev => ({
      ...prev,
      rateCard: file
    }));
    
    // Set processing state
    setIsProcessing(true);
    setProcessingStage('document');
    updateFormData('processingStage', 'document');
    
    try {
      // Create form data for the rate card API
      const formDataObj = new FormData();
      formDataObj.append('file', file);
      formDataObj.append('cardType', cardType);
      
      // Use provider ID from formData
      const providerId = formData?.id || 'new';
      formDataObj.append('providerId', providerId);
      
      // Add customer ID if available
      if (formData.customerId) {
        formDataObj.append('customerId', formData.customerId);
      }
      
      // First, extract document info (this is much faster for Excel files)
      await extractDocumentInfo(file, 'rateCard', formDataObj);
      
      // Then extract rates (this is the time-consuming part)
      await extractRates(file, 'rateCard', formDataObj);
      
    } catch (error) {
      console.error('Error extracting rate card data:', error);
      setProcessingStage('error');
      updateFormData('processingStage', 'error');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Simple processing indicator component
  const ProcessingIndicator = () => {
    if (!isProcessing) return null;
    
    return (
      <div className="mt-3 flex items-center text-blue-600">
        <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Processing {documentType}...</span>
      </div>
    );
  };
  
  // Component to jump directly to configuration after uploading
  const QuickNavButton = () => {
    if (!hasFile || !isProcessing) return null;
    
    const handleContinueClick = () => {
      // You'll need to implement navigation to step 2 here
      // This could be a function passed as a prop or a router function
      console.log('Continue to configuration while processing');
      // Example: onContinue(); or router.push('/configuration');
    };
    
    return (
      <div className="mt-3 flex justify-end">
        <button
          onClick={handleContinueClick}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Continue to Configuration
        </button>
      </div>
    );
  };
  
  return (
    <div className="p-5 border rounded-lg">
      <div className="flex justify-between mb-4">
        <div>
          <h4 className="font-medium">
            {title}
          </h4>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
        <div>
          {/* Success checkmark for single documents */}
          {hasFile && !isMultiFile && (
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
      {isRateCard && (
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
          ${activeDropzone ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
          ${hasFile && !isMultiFile ? 'bg-green-50' : ''}
        `}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
        />
        <div className="flex flex-col items-center justify-center py-3">
          <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-sm text-gray-600">Drag and drop your file here, or click to browse</p>
          <p className="text-xs text-gray-500 mt-1">PDF, Word, or Excel files accepted</p>
        </div>
      </div>
      
      {/* Processing indicator */}
      <ProcessingIndicator />
      
      {/* Quick navigation button */}
      <QuickNavButton />
      
      {/* File list for multi-file uploads */}
      {isMultiFile && hasFile && documents[documentType] && (
        <FileList 
          files={documents[documentType] || []}
          documentType={documentType}
        />
      )}
    </div>
  );
};

export default DocumentUploader;
