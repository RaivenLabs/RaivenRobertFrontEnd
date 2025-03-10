import React, { useState } from 'react';

const RateCardPreview = ({ 
  previewItems = [], 
  totalItems = 0, 
  processingStage = null,
  onRateChange 
}) => {
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
    if (value === undefined || value === null || value === 0 || value === '0' || value === '0.0') return '-';
    if (typeof value === 'number') {
      // If it looks like a currency value
      if (value % 1 === 0) return value; // Integer
      return value.toFixed(2);
    }
    return value;
  };

  // Check if data is still loading
  const isProcessing = processingStage === 'rates';
  
  // If we're still processing or have no preview items yet, show a placeholder
  if (isProcessing || !previewItems || previewItems.length === 0) {
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
  const priorityKeys = [
    'beeline_job_code', 'Beeline Job Code', 'jobCode', 'code', 'role_code',
    'beeline_job_title', 'Beeline Job Title (with Level)', 'role_title', 'job_title', 'jobTitle', 'title', 
    'us_region_1_bill_rate', 'us_region1_rate', 'US Region 1 Bill Rate (USD)', 'region1Rate',
    'us_region_2_bill_rate', 'us_region2_rate', 'US Region 2 Bill Rate (USD)',
    'us_region_3_bill_rate', 'us_region3_rate', 'US Region 3 Bill Rate (USD)',
    'mexico_bill_rate', 'Mexico Bill Rate (USD)',
    'india_bill_rate', 'India Bill Rate (USD)',
    'latam_bill_rate', 'LATAM Bill Rate (USD)'
  ];
  
  // Sort keys with priority keys first, then by name
  columnKeys.sort((a, b) => {
    const aIndex = priorityKeys.findIndex(k => k === a || a.toLowerCase().includes(k.toLowerCase()));
    const bIndex = priorityKeys.findIndex(k => k === b || b.toLowerCase().includes(k.toLowerCase()));
    
    if (aIndex >= 0 && bIndex >= 0) return aIndex - bIndex;
    if (aIndex >= 0) return -1;
    if (bIndex >= 0) return 1;
    return a.localeCompare(b);
  });

  // Modified: Get essential columns and all rate columns
  let displayColumns = columnKeys;
  if (columnKeys.length > 8) {
    // Get the first code/job code column
    const codeColumn = columnKeys.find(key => 
      key.toLowerCase().includes('code') || 
      key.toLowerCase().includes('job code')
    );
    
    // Get the first title/job title column
    const titleColumn = columnKeys.find(key => 
      key.toLowerCase().includes('title') || 
      key.toLowerCase().includes('job title')
    );
    
    // Get ALL rate columns
    const rateColumns = columnKeys.filter(key => isRateColumn(key));
    
    // Combine essential columns - ensuring ALL rate columns are included
    displayColumns = [
      ...(codeColumn ? [codeColumn] : []),
      ...(titleColumn ? [titleColumn] : []),
      ...rateColumns,
      'unit' // Add unit if it exists
    ].filter(key => columnKeys.includes(key));
  }
  
  // Detect if there are any active rate columns with non-zero values
  const activeRateColumns = {};
  displayColumns.forEach(column => {
    if (isRateColumn(column)) {
      // Check if this rate column has any non-zero, non-null values
      const hasValues = previewItems.some(item => {
        const value = item[column];
        return value !== undefined && value !== null && value !== 0 && value !== '0' && value !== '0.0';
      });
      activeRateColumns[column] = hasValues;
    }
  });
  
  // Filter out rate columns with all zero/null values if we have multiple rate columns
  const rateColumnsCount = Object.keys(activeRateColumns).length;
  if (rateColumnsCount > 1) {
    displayColumns = displayColumns.filter(column => {
      if (isRateColumn(column)) {
        return activeRateColumns[column]; // Only keep columns with actual values
      }
      return true; // Keep all non-rate columns
    });
  }
  
  return (
    <div>
      {previewItems.length > 0 && (
        <div className="mb-3">
          <p className="text-sm">Found {totalItems} rates. Showing first {Math.min(10, previewItems.length)} items:</p>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse mb-4">
          <thead>
            <tr className="bg-blue-50">
              {displayColumns.map(key => (
                <th 
                  key={key} 
                  className="px-3 py-2 border text-blue-800 font-medium text-sm"
                >
                  {cleanHeaderName(key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {previewItems.slice(0, 10).map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                {displayColumns.map(key => {
                  // Is this a rate column that should be editable?
                  const isRate = isRateColumn(key);
                  
                  return (
                    <td 
                      key={key} 
                      className={`px-3 py-2 border ${isRate ? 'font-mono text-right' : ''}`}
                    >
                      {isRate ? (
                        <input 
                          type="text" 
                          className="w-24 text-right bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 px-1 border rounded" 
                          value={formatCellValue(item[key])} 
                          onChange={(e) => onRateChange(index, key, e.target.value)}
                        />
                      ) : (
                        <span className="text-sm">{formatCellValue(item[key])}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {totalItems > 10 && (
        <p className="text-sm text-gray-500 mt-2">
          + {totalItems - 10} more rates will be saved with the configuration.
        </p>
      )}
      
      <div className="px-3 py-2 text-sm text-gray-500 italic bg-gray-50 rounded">
        * You can edit any rate value by clicking on it.
      </div>
    </div>
  );
};

export default RateCardPreview;
