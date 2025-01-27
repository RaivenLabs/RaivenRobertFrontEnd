// hooks/useWorksheetData.js
import { useState, useEffect } from 'react';
import { regionalBlockConfigs } from '../utils/regionalBlockConfigs';

export const useWorksheetData = (runData, blockConfiguration) => {
 const [worksheetData, setWorksheetData] = useState(null);
 const [error, setError] = useState(null);
 const [isLoading, setIsLoading] = useState(true);

 const loadWorksheetData = async () => {
   try {
     console.log('📦 Starting worksheet load with:', {
       runData,
       blockConfiguration
     });
     
     setIsLoading(true);
     setError(null);

     if (!runData?.targetCompanyData?.original?.regional_blocks) {
       throw new Error('No run data available');
     }

     if (!blockConfiguration?.regional_blocks) {
       throw new Error('No block configuration available');
     }

     const initialData = {};
     const runDataBlocks = runData.targetCompanyData.original.regional_blocks;
     
     // Process each selected block
     blockConfiguration.regional_blocks.forEach(blockKey => {
       console.log(`📊 Processing block ${blockKey}`);
       initialData[blockKey] = {};
       
       // Get member states for this block
       const selectedMemberStates = blockConfiguration.member_states[blockKey] || [];
       const blockData = runDataBlocks[blockKey];

       if (!blockData) {
         console.warn(`⚠️ No data found for block ${blockKey}`);
         return;
       }

       selectedMemberStates.forEach(memberStateKey => {
         const stateData = blockData.member_states?.[memberStateKey];
         
         if (stateData) {
           console.log(`✅ Loading data for ${blockKey}/${memberStateKey}`);
           initialData[blockKey][memberStateKey] = {
             revenue: stateData.metrics?.revenue,
             employees: stateData.metrics?.employees,
             assets: stateData.metrics?.assets,
             marketShare: stateData.market_shares?.clinical_software,
           };
         } else {
           console.warn(`⚠️ No data found for member state ${memberStateKey} in ${blockKey}`);
         }
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

 const handleInputChange = async (change) => {
   try {
     console.log('🔄 Processing input change:', change);
     
     if (!runData?.projectId || !runData?.runId) {
       throw new Error('Missing project or run ID');
     }

     // Update local state first for immediate feedback
     setWorksheetData(prev => {
       if (!prev[change.blockKey]) {
         prev[change.blockKey] = {};
       }
       if (!prev[change.blockKey][change.memberStateKey]) {
         prev[change.blockKey][change.memberStateKey] = {};
       }

       return {
         ...prev,
         [change.blockKey]: {
           ...prev[change.blockKey],
           [change.memberStateKey]: {
             ...prev[change.blockKey][change.memberStateKey],
             [change.field]: change.value
           }
         }
       };
     });

     // Prepare the update for the backend
     const updateData = {
       metrics: {
         revenue: null,
         employees: null,
         assets: null
       },
       market_shares: {
         clinical_software: null
       }
     };

     // Map the changed field to the correct data structure
     if (change.field === 'revenue' || change.field === 'employees' || change.field === 'assets') {
       updateData.metrics[change.field] = change.value;
     } else if (change.field === 'marketShare') {
       updateData.market_shares.clinical_software = change.value;
     }

     console.log('📤 Sending update to backend:', updateData);

     // Save to backend
     const response = await fetch(
       `/api/projects/${runData.projectId}/runs/${runData.runId}/update_member_state_data`,
       {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           block_key: change.blockKey,
           member_state_key: change.memberStateKey,
           updates: updateData
         })
       }
     );

     if (!response.ok) {
       throw new Error('Failed to save changes');
     }

     const result = await response.json();
     console.log('✅ Update successful:', result);

   } catch (error) {
     console.error('❌ Error updating data:', error);
     setError(`Failed to save changes: ${error.message}`);
     throw error;
   }
 };

 const getValue = (blockKey, memberStateKey, field) => {
   if (!worksheetData?.[blockKey]?.[memberStateKey]) {
     console.warn('⚠️ No data found for:', { blockKey, memberStateKey });
     return '';
   }
   
   const value = worksheetData[blockKey][memberStateKey][field];
   return value ?? '';
 };

 // Initialize on mount or when dependencies change
 useEffect(() => {
   loadWorksheetData();
 }, [runData, blockConfiguration]);

 return {
   worksheetData,
   handleInputChange,
   error,
   isLoading,
   getValue,
   loadWorksheetData
 };
};

export default useWorksheetData;
