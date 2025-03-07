import React from 'react';

const RateCardPreview = ({ 
  previewItems, 
  totalItems, 
  handleRateChange, 
  handleRateCardConfirm, 
  isProcessing, 
  setShowRateCardPreview,
  isRateColumn 
}) => {
  // Handle dynamic column display based on available data
  const renderPreviewTable = () => {
    if (!previewItems || previewItems.length === 0) {
      return <p>No preview data available</p>;
    }
    
    // Extract all possible keys from the preview items
    const allKeys = new Set();
    previewItems.forEach(item => {
      Object.keys(item).forEach(key => allKeys.add(key));
    });
    
    // Prioritize certain keys
    const priorityKeys = ['role_code', 'beeline_job_code', 'jobCode', 'code',
                          'role_title', 'job_title', 'jobTitle', 'title', 
                          'us_region1_rate', 'us_region_1', 'region1Rate'];
    
    // Filter keys that should be displayed as columns
    const columnKeys = [...allKeys].filter(key => {
      // Skip technical or irrelevant fields
      return !key.includes('_type') && 
             !key.includes('original_') && 
             !key.includes('sql_') &&
             key !== 'additional_data';
    });
    
    // Sort keys with priority keys first
    columnKeys.sort((a, b) => {
      const aIndex = priorityKeys.findIndex(k => k === a || a.includes(k));
      const bIndex = priorityKeys.findIndex(k => k === b || b.includes(k));
      
      if (aIndex >= 0 && bIndex >= 0) return aIndex - bIndex;
      if (aIndex >= 0) return -1;
      if (bIndex >= 0) return 1;
      return a.localeCompare(b);
    });
    
    // Use all the columnKeys, not limited to 6
    const displayKeys = columnKeys;
    
    // Find best display names for columns
    const getDisplayName = (key) => {
      const parts = key.split('_').map(part => 
        part.charAt(0).toUpperCase() + part.slice(1)
      );
      return parts.join(' ');
    };
    
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse mb-4">
          <thead className="bg-royalBlue bg-opacity-10">
            <tr>
              {displayKeys.map(key => (
                <th key={key} className="px-3 py-2 border text-royalBlue font-medium">
                  {getDisplayName(key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {previewItems.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                {displayKeys.map(key => (
                  <td key={key} className={`px-3 py-2 border ${isRateColumn(key) ? 'font-mono text-right' : ''}`}>
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
  
  // Format cell values based on type
  const formatCellValue = (value) => {
    if (value === undefined || value === null) return '';
    if (typeof value === 'number') {
      // If it looks like a currency value
      if (value % 1 === 0) return value; // Integer
      return value.toFixed(2);
    }
    return value;
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-6xl max-h-[90vh] overflow-auto">
        <h2 className="text-xl font-bold mb-2 text-royalBlue">Rate Card Preview</h2>
        <p className="mb-4 text-gray-600">
          Showing {previewItems.length} of approximately {totalItems} rates. 
          Rates are editable - click on any rate to modify it.
        </p>
        
        {/* Dynamic rate table with horizontal scrolling */}
        <div className="overflow-x-auto border rounded">
          {renderPreviewTable()}
        </div>
        
        <div className="mt-3 text-sm text-gray-500 italic">
          * You can edit any rate by clicking on it. All changes will be saved when you confirm.
        </div>
        
        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-4">
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
            className="px-4 py-2 bg-royalBlue text-white rounded hover:bg-royalBlue-700 disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : `Save All ${totalItems} Rates`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RateCardPreview;
