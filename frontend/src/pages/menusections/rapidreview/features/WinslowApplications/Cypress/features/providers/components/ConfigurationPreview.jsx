import React, { useState, useEffect } from 'react';

const ConfigurationPreview = ({ 
  documentInfo,  // Extracted relationship information
  previewItems,  // Extracted rate items
  totalItems,    // Total number of rate items
  handleRateChange,  // Function to handle rate value changes
  handleConfirm,     // Function to handle final confirmation
  isProcessing,      // Boolean or string indicating processing state
  processingStage,   // Current stage of processing (document, ocr, extract, rates)
  setShowConfigPreview  // Function to close the preview
}) => {
  // Track panel completion/confirmation status
  const [relationshipConfirmed, setRelationshipConfirmed] = useState(false);
  const [ratesConfirmed, setRatesConfirmed] = useState(false);
  
  // Handle relationship panel confirmation
  const confirmRelationship = () => {
    setRelationshipConfirmed(true);
  };
  
  // Handle rate panel confirmation
  const confirmRates = () => {
    setRatesConfirmed(true);
  };
  
  // Submit final confirmation when both panels are confirmed
  const handleFinalConfirm = () => {
    handleConfirm({
      relationship: documentInfo,
      rates: previewItems
    });
  };

  // Helper function to determine if a column is a rate
  const isRateColumn = (key) => {
    const lowerKey = key.toLowerCase();
    return lowerKey.includes('rate') || 
           lowerKey.includes('region') || 
           lowerKey.includes('price') ||
           lowerKey.includes('cost') ||
           lowerKey.includes('bill') ||
           lowerKey.includes('mexico') ||
           lowerKey.includes('india') ||
           lowerKey.includes('latam') ||
           lowerKey.match(/us.*\d/); // Matches patterns like us_region1, us1, etc.
  };

  // Clean and normalize header names function
  const cleanHeaderName = (key) => {
    // First, convert snake_case or camelCase to spaces
    let header = key
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .toLowerCase();
    
    // Capitalize first letter of each word
    header = header
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // Handle specific patterns and abbreviations
    header = header
      .replace(/Us /g, 'US ')
      .replace(/Latam /g, 'LATAM ')
      .replace(/ Usd/g, ' (USD)')
      .replace(/ Rate$/, ' Rate');
    
    return header;
  };
  
  // Format cell values based on type
  const formatCellValue = (value) => {
    if (value === undefined || value === null) return '$-';
    if (typeof value === 'number') {
      // If it looks like a currency value
      if (value % 1 === 0) return value; // Integer
      return value.toFixed(2);
    }
    return value;
  };
  // Render the relationship details panel
  const renderRelationshipPanel = () => {
    return (
      <div className={`p-4 border rounded mb-4 ${relationshipConfirmed ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium">Relationship Details</h3>
          {relationshipConfirmed ? (
            <span className="text-green-600 flex items-center">
              <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Confirmed
            </span>
          ) : (
            <button 
              onClick={confirmRelationship}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
              disabled={isProcessing}
            >
              Confirm
            </button>
          )}
        </div>
        
        {/* Display extracted relationship information */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Master Agreement</p>
            <p className="font-medium">{documentInfo?.masterAgreement?.name || 'Not detected'}</p>
            {documentInfo?.masterAgreement?.effectiveDate && (
              <p className="text-sm">Effective: {documentInfo.masterAgreement.effectiveDate}</p>
            )}
            {documentInfo?.masterAgreement?.referenceNumber && (
              <p className="text-sm">Ref: {documentInfo.masterAgreement.referenceNumber}</p>
            )}
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Provider</p>
            <p className="font-medium">{documentInfo?.provider?.name || 'Not detected'}</p>
            {documentInfo?.provider?.address && (
              <p className="text-sm">{documentInfo.provider.address}</p>
            )}
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Amendment</p>
            <p className="font-medium">{documentInfo?.amendment?.name || 'Not detected'}</p>
            {documentInfo?.amendment?.effectiveDate && (
              <p className="text-sm">Effective: {documentInfo.amendment.effectiveDate}</p>
            )}
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Rate Card</p>
            <p className="font-medium">{documentInfo?.rateCard?.name || 'Exhibit B-1'}</p>
            {documentInfo?.rateCard?.effectiveDate && (
              <p className="text-sm">Effective: {documentInfo.rateCard.effectiveDate}</p>
            )}
            {documentInfo?.rateCard?.expirationDate && (
              <p className="text-sm">Expires: {documentInfo.rateCard.expirationDate}</p>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  // Render progress indicators for extraction stages
  const renderProgressIndicators = () => {
    const stages = [
      { id: 'document', label: 'Document Processing', complete: processingStage !== 'document' },
      { id: 'ocr', label: 'OCR Processing', complete: processingStage !== 'document' && processingStage !== 'ocr' },
      { id: 'extract', label: 'Extracting Relationships', complete: processingStage !== 'document' && processingStage !== 'ocr' && processingStage !== 'extract' },
      { id: 'rates', label: 'Building Rate Table', complete: processingStage !== 'document' && processingStage !== 'ocr' && processingStage !== 'extract' && processingStage !== 'rates' },
    ];
    
    return (
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Extraction Progress</h3>
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
  
  // Render the rate table panel
  const renderRateTablePanel = () => {
    // If we're still processing or have no preview items yet, show a placeholder
    if (isProcessing === 'rates' || !previewItems || previewItems.length === 0) {
      return (
        <div className="p-8 text-center">
          <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Building rate table... this may take a moment</p>
        </div>
      );
    }
    
    // Extract all possible keys from the preview items
    const allKeys = new Set();
    previewItems.forEach(item => {
      Object.keys(item).forEach(key => allKeys.add(key));
    });
    
    // Filter keys that should be displayed as columns
    const columnKeys = [...allKeys].filter(key => {
      // Skip technical or irrelevant fields
      return !key.includes('_type') && 
             !key.includes('original_') && 
             !key.includes('sql_') &&
             key !== 'additional_data';
    });
    
    // Define priority keys for better column ordering
    const priorityKeys = ['role_code', 'beeline_job_code', 'jobCode', 'code',
                          'role_title', 'job_title', 'jobTitle', 'title', 
                          'us_region1_rate', 'us_region_1', 'region1Rate'];
    
    // Sort keys with priority keys first
    columnKeys.sort((a, b) => {
      const aIndex = priorityKeys.findIndex(k => k === a || a.includes(k));
      const bIndex = priorityKeys.findIndex(k => k === b || b.includes(k));
      
      if (aIndex >= 0 && bIndex >= 0) return aIndex - bIndex;
      if (aIndex >= 0) return -1;
      if (bIndex >= 0) return 1;
      return a.localeCompare(b);
    });
    
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse mb-4">
          <thead>
            <tr className="bg-royalBlue bg-opacity-10">
              {columnKeys.map(key => (
                <th 
                  key={key} 
                  className="px-3 py-2 border text-royalBlue font-medium"
                >
                  {cleanHeaderName(key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {previewItems.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                {columnKeys.map(key => (
                  <td 
                    key={key} 
                    className={`px-3 py-2 border ${isRateColumn(key) ? 'font-mono text-right' : ''}`}
                  >
                    {isRateColumn(key) ? (
                      <input 
                        type="text" 
                        className="w-full text-right bg-transparent focus:outline-none focus:ring-1 focus:ring-royalBlue px-1" 
                        value={formatCellValue(item[key])} 
                        onChange={(e) => handleRateChange(index, key, e.target.value)}
                      />
                    ) : (
                      <span className="font-medium">{formatCellValue(item[key])}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  // Main component render
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-6xl max-h-[90vh] overflow-auto">
        <h2 className="text-xl font-bold mb-4 text-royalBlue">Configuration Preview</h2>
        
        {/* Show progress indicators during processing */}
        {isProcessing && renderProgressIndicators()}
        
        {/* Relationship Details Panel */}
        {(documentInfo || isProcessing === 'extract') && renderRelationshipPanel()}
        
        {/* Rate Table Panel */}
        <div className={`border rounded mb-4 ${ratesConfirmed ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="text-lg font-medium">Rate Card Preview</h3>
            {ratesConfirmed ? (
              <span className="text-green-600 flex items-center">
                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Confirmed
              </span>
            ) : (
              <button 
                onClick={confirmRates}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                disabled={isProcessing || !previewItems || previewItems.length === 0}
              >
                Confirm Rates
              </button>
            )}
          </div>
          
          {renderRateTablePanel()}
          
          {!isProcessing && previewItems && previewItems.length > 0 && (
            <div className="px-4 py-2 text-sm text-gray-500 italic">
              * You can edit any rate by clicking on it.
            </div>
          )}
        </div>
        
        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={() => setShowConfigPreview(false)}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleFinalConfirm}
            disabled={isProcessing || !(relationshipConfirmed && ratesConfirmed)}
            className="px-4 py-2 bg-royalBlue text-white rounded hover:bg-royalBlue-700 disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : 'Save Configuration'}
          </button>
        </div>
      </div>
    </div>
  );
};




export default ConfigurationPreview;
