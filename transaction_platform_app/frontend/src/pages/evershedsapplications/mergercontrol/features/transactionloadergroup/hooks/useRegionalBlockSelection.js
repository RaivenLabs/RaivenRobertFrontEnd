// hooks/useRegionalBlockSelection.js
import { useCallback, useState } from 'react';
import { regionalBlockConfigs } from '../utils/regionalBlockConfigs';

export const useRegionalBlockSelection = (activeRun) => {
  // Track current selections separately from what's saved in run_data
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const [selectedMemberStates, setSelectedMemberStates] = useState({});
  const [originalBlocks, setOriginalBlocks] = useState(null);

  // Initialize from run data function
  const initializeFromRunData = useCallback(async (runData) => {
    if (!runData?.targetCompanyData?.original?.regional_blocks) {
      console.error('❌ No regional block data found in run data');
      return;
    }
 
    console.log('📦 Loading regional block data...');
  
    const regionalBlockPresence = runData.targetCompanyData.original.regional_blocks;
    const selectedBlockIds = new Set();
 
    // Check presence and blocks for each member state
    Object.entries(regionalBlockPresence).forEach(([key, data]) => {
      if (data.presence) {
        // Map old keys to new format if needed
        const blockKey = {
          'us': 'united_states',
          'eu': 'european_union',
          'uk': 'united_kingdom'
        }[key.toLowerCase()] || key.toLowerCase();

        selectedBlockIds.add(blockKey);
      }
    });
 
    console.log('🗺️ Selected blocks based on presence:', Array.from(selectedBlockIds));
 
    setSelectedBlocks(Array.from(selectedBlockIds));
    setOriginalBlocks(Array.from(selectedBlockIds));
  
    // Initialize member states based on presence
    const initialMemberStates = {};
    Array.from(selectedBlockIds).forEach(blockKey => {
      const blockConfig = regionalBlockConfigs[blockKey];
      if (blockConfig) {
        // Only include member states where presence is true
        initialMemberStates[blockKey] = blockConfig.member_states
          .filter(state => 
            regionalBlockPresence[state.dataKey]?.presence ||
            // Check alternative keys for backward compatibility
            regionalBlockPresence[state.display.toLowerCase()]?.presence
          )
          .map(state => state.dataKey);
      }
    });
 
    console.log('📍 Initial member states:', initialMemberStates);
    setSelectedMemberStates(initialMemberStates);
  }, []);

  // Update run data in the backend
  const saveRunData = useCallback(async (data) => {
    if (!activeRun?.projectId || !activeRun?.runId) {
      throw new Error('Missing run information');
    }

    try {
      console.log('💾 Saving regional block changes:', data);

      const response = await fetch(
        `/api/projects/${activeRun.projectId}/runs/${activeRun.runId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'regional_block_update',
            blocks: selectedBlocks,
            member_states: selectedMemberStates,
            changes: {
              added: selectedBlocks.filter(b => !originalBlocks.includes(b)),
              removed: originalBlocks.filter(b => !selectedBlocks.includes(b))
            }
          })
        }
      );

      if (!response.ok) throw new Error('Failed to update regional blocks');
      
      const updatedData = await response.json();
      console.log('✅ Successfully saved regional block changes:', updatedData);
      
      return updatedData;
    } catch (error) {
      console.error('❌ Error saving regional blocks:', error);
      throw error;
    }
  }, [activeRun, selectedBlocks, selectedMemberStates, originalBlocks]);

  const toggleBlock = useCallback((blockKey) => {
    console.log('🔄 Toggling regional block:', blockKey);
    
    setSelectedBlocks(prev => {
      const isSelected = prev.includes(blockKey);
      const newSelectedBlocks = isSelected
        ? prev.filter(b => b !== blockKey)
        : [...prev, blockKey];
  
      console.log('Updated selected blocks:', newSelectedBlocks);
      return newSelectedBlocks;
    });
  
    // Clean up member states if block is deselected
    setSelectedMemberStates(prev => {
      const newMemberStates = { ...prev };
      if (prev[blockKey] && !selectedBlocks.includes(blockKey)) {
        delete newMemberStates[blockKey];
      }
      return newMemberStates;
    });
  }, [selectedBlocks]);

  const toggleMemberState = useCallback((blockKey, memberStateKey, isSelected) => {
    console.log('🔄 Toggling member state:', { blockKey, memberStateKey, isSelected });

    setSelectedMemberStates(prev => {
      const currentSelected = prev[blockKey] || [];
      const newSelected = isSelected
        ? [...currentSelected, memberStateKey]
        : currentSelected.filter(key => key !== memberStateKey);

      return {
        ...prev,
        [blockKey]: newSelected
      };
    });
  }, []);

  const hasSelectedMemberStates = useCallback(() => {
    return Object.values(selectedMemberStates).some(states =>
      states && states.length > 0
    );
  }, [selectedMemberStates]);

  return {
    selectedBlocks,
    selectedMemberStates,
    toggleBlock,
    toggleMemberState,
    hasSelectedMemberStates,
    saveRegionalBlockChanges: saveRunData,
    initializeFromRunData
  };
};

export default useRegionalBlockSelection;
