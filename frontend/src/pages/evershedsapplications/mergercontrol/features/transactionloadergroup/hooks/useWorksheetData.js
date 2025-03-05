import { useState, useEffect } from 'react';
import { regionalBlockConfigs } from '../utils/regionalBlockConfigs';

export const useWorksheetData = (runData) => {
  const [worksheetData, setWorksheetData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load worksheet data from run data
  const loadWorksheetData = async () => {
    try {
      console.log('📦 Starting worksheet load with runData:', runData);
      
      setIsLoading(true);
      setError(null);

      
      if (!runData?.targetCompanyData?.regional_blocks) {
        throw new Error('No run data available');
      }

      const initialData = {};
      const runDataBlocks = runData.targetCompanyData.regional_blocks;
      
      // Process each block in the run data
      Object.entries(runDataBlocks).forEach(([blockKey, blockData]) => {
        if (blockKey === 'template') return;
        if (!blockData.presence) return;
        
        console.log(`📊 Processing block ${blockKey}`);
        initialData[blockKey] = {};
        
        // Process member states that are marked as present
        Object.entries(blockData.member_states || {}).forEach(([memberStateKey, stateData]) => {
          if (memberStateKey === 'template') return;
          if (!stateData.presence) return;
          
          console.log(`✅ Loading data for ${blockKey}/${memberStateKey}`);
          initialData[blockKey][memberStateKey] = {
            revenue: stateData.metrics?.revenue || '',
            assets: stateData.metrics?.assets || '',
            employees: stateData.metrics?.employees || '',
            transactionSize: blockKey === 'united_states' ? stateData.metrics?.transaction_size || '' : undefined,
            marketShare: blockKey !== 'united_states' ? stateData.market_shares?.clinical_software || '' : undefined
          };
        });
      });

      console.log('📊 Final worksheet data:', initialData);
      setWorksheetData(initialData);

    } catch (error) {
      console.error('❌ Error loading worksheet:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle individual field changes
  const handleInputChange = (change) => {
    try {
      const { blockKey, memberStateKey, field, value } = change;
      console.log('🔄 Processing input change:', { blockKey, memberStateKey, field, value });
  
      // Parse the input value based on field type
      let parsedValue = value;
      if (typeof value === 'string') {
        // Remove currency symbols, commas, and other formatting
        const cleanValue = value.replace(/[^0-9.-]+/g, '');
        
        if (field === 'marketShare') {
          // Convert percentage to decimal (e.g., "40%" -> 0.4)
          parsedValue = cleanValue ? parseFloat(cleanValue) / 100 : null;
        } else if (field === 'employees') {
          // Convert to integer
          parsedValue = cleanValue ? parseInt(cleanValue) : null;
        } else {
          // For revenue, assets, transaction size - convert to float
          parsedValue = cleanValue ? parseFloat(cleanValue) : null;
        }
      }
  
      console.log('📝 Parsed value:', { field, originalValue: value, parsedValue });

      // Update local state
      setWorksheetData(prev => {
        const updated = {
          ...prev,
          [blockKey]: {
            ...prev[blockKey],
            [memberStateKey]: {
              ...prev[blockKey]?.[memberStateKey],
              [field]: parsedValue
            }
          }
        };
        console.log('📊 Updated worksheet data:', updated);
        return updated;
      });
  
    } catch (error) {
      console.error('❌ Error updating data:', error);
      setError(`Failed to update: ${error.message}`);
    }
  };

  const saveAllChanges = async (inputUpdates) => {
    try {
      // Debug log the input
      console.log('🚀 Starting saveAllChanges with raw input:', inputUpdates);
  
      if (!runData?.projectId || !runData?.runId) {
        throw new Error('Missing project or run ID');
      }
  
      // Create a new object for the request body
      const requestData = {
        updates: inputUpdates
      };
  
      console.log('📦 Final request data:', JSON.stringify(requestData, null, 2));
  
      const response = await fetch(
        `/api/projects/${runData.projectId}/runs/${runData.runId}/update_member_state_data`,
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestData)  // Use requestData instead of {updates}
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save worksheet');
      }
  
      const result = await response.json();
      console.log('✅ API success response:', result);
  
      return result;
  
    } catch (error) {
      console.error('❌ Error in saveAllChanges:', error);
      throw error;
    }
  };

  // Format values for display
  const getValue = (blockKey, memberStateKey, field) => {
    const rawValue = worksheetData?.[blockKey]?.[memberStateKey]?.[field];
    if (rawValue === undefined || rawValue === null || rawValue === '') {
      return '';
    }
    
    // Format based on field type
    if (field === 'revenue' || field === 'assets' || field === 'transactionSize') {
      const currency = blockKey === 'european_union' ? '€' : 
                      blockKey === 'united_kingdom' ? '£' : '$';
      return `${currency}${parseInt(rawValue).toLocaleString()}`;
    }
    
    if (field === 'marketShare') {
      return `${(parseFloat(rawValue) * 100).toFixed(1)}%`;
    }
    
    // For employees and other numeric fields
    return rawValue.toLocaleString();
  };

  // Initialize on mount or when runData changes
  useEffect(() => {
    loadWorksheetData();
  }, [runData]);

  return {
    worksheetData,
    handleInputChange,
    saveAllChanges,
    getValue,
    error,
    isLoading,
    loadWorksheetData,
    projectName: runData?.projectName
  };
};

export default useWorksheetData;
