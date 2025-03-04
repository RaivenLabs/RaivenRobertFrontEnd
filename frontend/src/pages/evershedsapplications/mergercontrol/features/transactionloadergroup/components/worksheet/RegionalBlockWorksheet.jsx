import React, { useState } from 'react';
import { useWorksheetData } from '../../hooks/useWorksheetData';
import { regionalBlockConfigs } from '../../utils/regionalBlockConfigs';
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
const RegionalBlockWorksheet = ({ runData }) => {
  const [pendingChanges, setPendingChanges] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const {
    worksheetData,
    handleInputChange,
    getValue,
    error: hookError,
    projectName,
    loadWorksheetData,
    saveAllChanges
  } = useWorksheetData(runData);

  const handlePendingChange = (blockKey, memberStateKey, field, value) => {
    console.log('🔄 Adding pending change:', { 
        blockKey, 
        memberStateKey, 
        field, 
        value,
        type: typeof value
    });

    // Update pending changes
    setPendingChanges(prev => {
        const newChanges = {
            ...prev,
            [`${blockKey}-${memberStateKey}-${field}`]: {
                blockKey,
                memberStateKey,
                field,
                value,
                previousValue: getValue(blockKey, memberStateKey, field)
            }
        };
        console.log('📦 Updated pending changes:', newChanges);
        return newChanges;
    });

    setHasChanges(true);

    // Also update the local worksheet data through handleInputChange
    handleInputChange({
        blockKey,
        memberStateKey,
        field,
        value
    });
};

const handleSaveWorksheet = async () => {
  console.log('💾 Starting worksheet save...', new Date().toISOString());
  setIsSaving(true);
  setLocalError(null);
  
  try {
      console.log('📦 Current worksheet data:', worksheetData);
      console.log('📦 Pending changes to save:', pendingChanges);
      
      // Convert pending changes to the format expected by the API
      const updates = {};
      
      Object.values(pendingChanges).forEach(change => {
          const { blockKey, memberStateKey, field, value } = change;
          console.log('🔄 Processing change:', { blockKey, memberStateKey, field, value });
          
          if (!updates[blockKey]) {
              updates[blockKey] = {};
          }
          if (!updates[blockKey][memberStateKey]) {
              updates[blockKey][memberStateKey] = {
                  metrics: {},
                  market_shares: {}
              };
          }
          
          // Sort the field into the appropriate category
          if (['revenue', 'employees', 'assets', 'transactionSize'].includes(field)) {
              const metricKey = field === 'transactionSize' ? 'transaction_size' : field;
              updates[blockKey][memberStateKey].metrics[metricKey] = value;
          } else if (field === 'marketShare' && blockKey !== 'united_states') {
              updates[blockKey][memberStateKey].market_shares.clinical_software = value;
          }
      });
      
      console.log('📤 Formatted updates for API:', JSON.stringify(updates, null, 2));
      
      // Call the saveAllChanges function
      const result = await saveAllChanges(updates);
      
      console.log('✅ Save successful:', result);
      setPendingChanges({});
      setHasChanges(false);
      
      
      
  } catch (error) {
      console.error('❌ Save failed:', error);
      setLocalError(`Failed to save worksheet: ${error.message}`);
  } finally {
      setIsSaving(false);
  }
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
          name: "All States",
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
    
      {/* Save button section */}
      <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-end">
          <button
            onClick={handleSaveWorksheet}
            disabled={!hasChanges || isSaving}
            className={`px-6 py-3 text-sm text-white rounded-md ${
              hasChanges && !isSaving
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {isSaving ? 'Saving...' : 'Save Worksheet'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegionalBlockWorksheet;
