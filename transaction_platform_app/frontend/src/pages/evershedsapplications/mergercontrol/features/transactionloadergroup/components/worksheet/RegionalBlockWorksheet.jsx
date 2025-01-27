// src/features/transaction-loader/components/Worksheet/RegionalBlockWorksheet.jsx
import React, { useState } from 'react';


import { useWorksheetData } from '../../hooks/useWorksheetData';
import { regionalBlockConfigs, getBlockDisplay, getMemberStateDisplay } from '../../utils/regionalBlockConfigs';


import { FileSpreadsheet } from 'lucide-react';

// Currency formatting utilities
const formatCurrency = (value, field, blockKey) => {
  if (!value) return '';
  
  // Remove any existing formatting to get raw number
  const numericValue = typeof value === 'string' ? 
    parseFloat(value.replace(/[^0-9.-]+/g, '')) : 
    value;

  if (isNaN(numericValue)) return value;

  // Determine currency symbol based on block
  const currencySymbol = blockKey === 'european_union' ? '€' : '$';
  
  // Format with proper currency symbol and commas
  return `${currencySymbol}${numericValue.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })}`;
};

// Handle currency input changes
const handleCurrencyChange = (e, blockKey, dataKey, field, onInputChange) => {
  // Strip non-numeric characters for processing
  const rawValue = e.target.value.replace(/[^0-9.-]+/g, '');
  
  // Convert to number if possible
  const numericValue = rawValue ? parseFloat(rawValue) : '';
  
  // Update with raw numeric value
  onInputChange(blockKey, dataKey, field, numericValue);
};

// WorksheetHeader Component
const WorksheetHeader = ({ projectName, onImportClick }) => (
  <div className="flex justify-between items-center mb-6">
    <div>
      <h2 className="text-2xl font-semibold text-gray-800">Regional Block Analysis Worksheet</h2>
      {projectName && (
        <p className="text-sm text-gray-600 mt-1">Project: {projectName}</p>
      )}
    </div>
    <button
      onClick={onImportClick}
      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
    >
      <FileSpreadsheet className="w-4 h-4 mr-2" />
      Import Spreadsheet
    </button>
  </div>
);

// MemberStateRow Component
const MemberStateRow = ({ 
  name, 
  requirements = {}, 
  blockKey, 
  dataKey, 
  getValue, 
  onInputChange,
  isTotal,
  isUSState 
}) => {
  const baseRowClass = "border-b border-gray-200 hover:bg-gray-50 transition-colors";
  const rowClass = isTotal 
    ? `${baseRowClass} bg-gray-50 font-semibold`
    : isUSState
    ? `${baseRowClass} pl-8 border-l-4 border-l-gray-100`
    : baseRowClass;

  const fields = Object.keys(requirements || {});

  const isMoneyField = (field) => 
    field.toLowerCase().includes('revenue') || 
    field.toLowerCase().includes('assets') || 
    field.toLowerCase().includes('size');

  return (
    <div className={rowClass}>
      <div className="grid grid-cols-[200px_1fr] md:grid-cols-[200px_repeat(4,1fr)] gap-4 p-4">
        <div className="font-medium text-gray-900">{name}</div>
        {fields.map(field => (
          <div key={field}>
            <input
              type="text"
              value={isMoneyField(field) ? 
                formatCurrency(getValue(blockKey, dataKey, field), field, blockKey) : 
                (getValue(blockKey, dataKey, field) || '')}
              onChange={(e) => isMoneyField(field) ?
                handleCurrencyChange(e, blockKey, dataKey, field, onInputChange) :
                onInputChange(blockKey, dataKey, field, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
              placeholder={`Enter ${field}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// ColumnHeaders Component
const ColumnHeaders = ({ headers }) => (
  <div className="grid grid-cols-[200px_1fr] md:grid-cols-[200px_repeat(4,1fr)] gap-4 p-4 bg-gray-50 border-y border-gray-200">
    <div className="font-semibold text-gray-700">Member State</div>
    {Object.entries(headers).map(([key, label]) => (
      <div key={key} className="font-semibold text-gray-700 text-right">
        {label}
      </div>
    ))}
  </div>
);

// BlockHeader Component
const BlockHeader = ({ content, totalEntities }) => (
  <div className="bg-gray-100 px-6 py-3 flex justify-between items-center">
    <h3 className="text-lg font-semibold text-gray-800">{content}</h3>
    <span className="text-sm text-gray-600">{totalEntities} entities</span>
  </div>
);

// WorksheetRow Component
const WorksheetRow = ({ type, data, blockKey, onInputChange, getValue }) => {
  switch (type) {
    case 'blockHeader':
      return <BlockHeader {...data} />;
    case 'columnHeaders':
      return <ColumnHeaders headers={data.headers} />;
    case 'memberState':
      return (
        <MemberStateRow
          {...data}
          blockKey={blockKey}
          getValue={getValue}
          onInputChange={onInputChange}
        />
      );
    default:
      return null;
  }
};

// Main Worksheet Component
const RegionalBlockWorksheet = ({ runData, blockConfiguration }) => {
  const [pendingChanges, setPendingChanges] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [localError, setLocalError] = useState(null);

  const {
    worksheetData,
    handleInputChange,
    getValue,
    error: hookError,
    projectName,
    loadWorksheetData
  } = useWorksheetData(runData, blockConfiguration);

  const handlePendingChange = (blockKey, memberStateKey, field, value) => {
    setPendingChanges(prev => ({
      ...prev,
      [`${blockKey}-${memberStateKey}-${field}`]: {
        blockKey,
        memberStateKey,
        field,
        value,
        previousValue: getValue(blockKey, memberStateKey, field)
      }
    }));
    setHasChanges(true);
  };

  const getEffectiveValue = (blockKey, memberStateKey, field) => {
    const changeKey = `${blockKey}-${memberStateKey}-${field}`;
    const pendingChange = pendingChanges[changeKey];
    return pendingChange ? pendingChange.value : getValue(blockKey, memberStateKey, field);
  };

  const renderWorksheetContent = () => {
    if (!worksheetData) return [];
    
    let allRows = [];
    Object.keys(worksheetData).forEach(blockKey => {
      if (blockKey === 'template') return;
      
      const config = regionalBlockConfigs[blockKey];
      if (!config) return;

      allRows.push({
        type: 'blockHeader',
        content: config.display,
        blockKey,
        totalEntities: Object.keys(worksheetData[blockKey]).length
      });

      // Add column headers - with special handling for US
      if (blockKey === 'united_states') {
        allRows.push({
          type: 'columnHeaders',
          headers: {
            revenue: config.headers.revenue,
            assets: config.headers.assets,
            transactionSize: config.headers.transactionSize,
            manufacturer: config.headers.manufacturer
          }
        });
      } else {
        allRows.push({
          type: 'columnHeaders',
          headers: config.headers
        });
      }

      // Special handling for US block
      if (blockKey === 'united_states') {
        // Add US Total row first
        allRows.push({
          type: 'memberState',
          name: "United States Total",
          dataKey: 'us_total',
          blockKey,
          isTotal: true,
          requirements: {
            revenue: config.headers.revenue,
            assets: config.headers.assets,
            transactionSize: config.headers.transactionSize,
            manufacturer: config.headers.manufacturer
          }
        });

        // Add only California and Connecticut with specific fields
        config.member_states
          .filter(state => ['california', 'connecticut'].includes(state.dataKey))
          .forEach(state => {
            allRows.push({
              type: 'memberState',
              name: state.display,
              dataKey: state.dataKey,
              blockKey,
              isUSState: true,
              requirements: {
                revenue: config.headers.revenue,
                assets: config.headers.assets,
                transactionSize: config.headers.transactionSize,
                manufacturer: config.headers.manufacturer
              }
            });
          });
      } else {
        // Normal handling for other blocks
        Object.keys(worksheetData[blockKey]).forEach(stateKey => {
          if (stateKey === 'template') return;
          const state = config.member_states.find(s => s.dataKey === stateKey);
          if (!state) return;
          
          allRows.push({
            type: 'memberState',
            name: state.display,
            dataKey: stateKey,
            blockKey,
            requirements: config.headers
          });
        });
      }
    });

    return allRows;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-6 relative">
      <WorksheetHeader 
        projectName={projectName}
        onImportClick={() => console.log('Import Spreadsheet clicked')}
      />
      
      {(hookError || localError) && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {hookError || localError}
        </div>
      )}
      
      <div className="overflow-x-auto">
        {renderWorksheetContent().map((row, index) => (
          <WorksheetRow
            key={`${row.blockKey}-${row.type}-${index}`}
            type={row.type}
            data={row}
            blockKey={row.blockKey}
            onInputChange={handlePendingChange}
            getValue={getEffectiveValue}
          />
        ))}
      </div>

      {hasChanges && (
        <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {Object.keys(pendingChanges).length} pending changes
            </div>
            <div className="space-x-4">
              <button
                onClick={() => {
                  setPendingChanges({});
                  setHasChanges(false);
                }}
                className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
              >
                Discard Changes
              </button>
              <button
                onClick={async () => {
                  try {
                    await Promise.all(
                      Object.values(pendingChanges).map(change => 
                        handleInputChange({
                          blockKey: change.blockKey,
                          memberStateKey: change.memberStateKey,
                          field: change.field,
                          value: change.value
                        })
                      )
                    );
                    await loadWorksheetData();
                    setPendingChanges({});
                    setHasChanges(false);
                  } catch (error) {
                    setLocalError(`Failed to save changes: ${error.message}`);
                  }
                }}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Submit All Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegionalBlockWorksheet;
