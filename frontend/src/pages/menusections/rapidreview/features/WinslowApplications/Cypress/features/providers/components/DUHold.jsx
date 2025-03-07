import React, { useRef, useState } from 'react';
import { useSupplier } from '../SupplierContext';
import ProcessingIndicator from './ProcessingIndicator';
import FileList from './FileList';

const DocumentUploader = ({
  documentType,
  title,
  description,
  documents,
  extractedData,
  isProcessing,
  setIsProcessing,
  formData,
  isRequired = false,
  isMultiFile = false,
  isRateCard = false,
  cardType = 'standalone',
  setCardType = () => {}
}) => {
  // Get what you need from context at the component level, not inside handlers
  const { updateFormData, updateField } = useSupplier();
  const fileInputRef = useRef(null);
  const [activeDropzone, setActiveDropzone] = useState(false);
  
  // Check for file existence based on document type
  const hasFile = isMultiFile
    ? documents[documentType] && documents[documentType].length > 0
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
    
    const files = e.dataTransfer.files;
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
    fileInputRef.current.click();
  };
  
  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (isRateCard) {
      handleRateCardUpload(file);
    } else {
      handleDocumentUpload(file);
    }
  };
  
  // Document upload handler for regular documents
  const handleDocumentUpload = async (file) => {
    console.log(`File: ${file.name}, Size: ${file.size} bytes, Type: ${documentType}`);
    
    // Update documents state in context
    if (isMultiFile) {
      updateFormData('documents', prev => ({
        ...prev,
        [documentType]: [...(prev[documentType] || []), file]
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
      // Create form data for the document extraction API
      const formDataObj = new FormData();
      formDataObj.append('file', file);
      formDataObj.append('documentType', documentType);
      
      // Use provider ID from props instead of accessing context again
      const providerId = formData?.id || 'new';
      formDataObj.append('providerId', providerId);
      
      // Call the document extraction API
      const response = await fetch('/api/extract-document-data', {
        method: 'POST',
        body: formDataObj
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Update extracted data in context based on document type
        updateFormData('extractedData', prev => ({
          ...prev,
          [documentType]: data
        }));
        
        // For MSA specifically, also update main form fields
        if (documentType === 'masterAgreement' && data) {
          Object.entries(data).forEach(([key, value]) => {
            if (value) updateField(key, value);
          });
        }
      } else {
        throw new Error(`Failed to extract data from ${documentType}`);
      }
    } catch (error) {
      console.error(`Error extracting data from ${documentType}:`, error);
    } finally {
      setIsProcessing(null);
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
    
    // Set processing state for rate card
    setIsProcessing('rateCard');
    
    try {
      // Create form data for the specialized rate card API
      const formDataObj = new FormData();
      formDataObj.append('file', file);
      formDataObj.append('cardType', cardType);
      
      // Use provider ID from props instead of accessing context again
      const providerId = formData?.id || 'new';
      formDataObj.append('providerId', providerId);
      
      // Add customer ID if available
      if (formData.customerId) {
        formDataObj.append('customerId', formData.customerId);
      }
      
      // Call the rate card extraction API
      const response = await fetch('/api/extract-rate-card', {
        method: 'POST',
        body: formDataObj
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Update extracted data in context
        updateFormData('extractedData', prev => ({
          ...prev,
          rateCard: data
        }));
      } else {
        throw new Error('Failed to extract rate card data');
      }
    } catch (error) {
      console.error('Error extracting rate card data:', error);
    } finally {
      setIsProcessing(null);
    }
  };
  
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
      <ProcessingIndicator 
        isProcessing={isProcessing === documentType} 
        documentType={documentType}
        extractedData={extractedData}
        documents={documents}
      />
      
      {/* File list for multi-file uploads */}
      {isMultiFile && hasFile && (
        <FileList 
          files={documents[documentType]} 
        />
      )}
    </div>
  );
};

export default DocumentUploader;
