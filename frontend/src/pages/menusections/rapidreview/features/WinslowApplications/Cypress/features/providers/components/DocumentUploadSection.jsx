import React, { useState, useEffect } from 'react';
import { useSupplier } from '../SupplierContext';
import DocumentUploader from './DocumentUploader';

const DocumentUploadSection = () => {
  // Get what you need from context
  const { formData, updateFormData } = useSupplier();
  
  // Initialize documents and extractedData only once on mount
  useEffect(() => {
    // Only initialize if they don't exist
    if (!formData.documents) {
      updateFormData('documents', {
        masterAgreement: null,
        rateCard: null,
        amendments: [],
        localCountryAgreements: [],
        orderTemplates: [],
        serviceOrders: []
      });
    }
    
    if (!formData.extractedData) {
      updateFormData('extractedData', {});
    }
    // Empty dependency array means this only runs once on mount
  }, []);
  
  // State for rate card handling
  const [cardType, setCardType] = useState('standalone');
  
  // Define document types configuration
  const documentTypes = [
    {
      type: "masterAgreement",
      title: "Master Service Agreement (MSA)",
      description: "Upload to automatically extract supplier information, effective dates, and reference numbers",
      isMultiFile: false
    },
    {
      type: "rateCard",
      title: "Rate Card",
      description: "Upload to automatically capture pricing information for different service categories",
      isMultiFile: false,
      isRateCard: true
    },
    {
      type: "serviceOrders",
      title: "Service Orders",
      description: "Upload executed service orders to extract detailed project information, timelines, and resource rates",
      isMultiFile: true
    },
    {
      type: "amendments",
      title: "Amendments",
      description: "Upload any amendments to the MSA that modify terms or pricing",
      isMultiFile: true
    },
    {
      type: "localCountryAgreements",
      title: "Local Country Agreements",
      description: "Upload any country-specific agreements or addendums",
      isMultiFile: true
    },
    {
      type: "orderTemplates",
      title: "Order Templates",
      description: "Upload any standard order templates for this supplier",
      isMultiFile: true
    }
  ];
  
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
      
      {/* Render all document uploaders */}
      {documentTypes.map((docConfig) => (
        <DocumentUploader
          key={docConfig.type}
          documentType={docConfig.type}
          title={docConfig.title}
          description={docConfig.description}
          isMultiFile={docConfig.isMultiFile}
          isRateCard={docConfig.isRateCard || false}
          cardType={docConfig.isRateCard ? cardType : undefined}
          setCardType={docConfig.isRateCard ? setCardType : undefined}
        />
      ))}
    </div>
  );
};

export default DocumentUploadSection;
