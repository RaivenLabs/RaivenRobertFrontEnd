import { useCallback, useState } from 'react';
import { regionConfigs } from '../utils/regionConfigs';  // Add this import

export const useRegionSelection = (activeRun) => {
  // Track current selections separately from what's saved in run_data
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedJurisdictions, setSelectedJurisdictions] = useState({});
  const [originalRegions, setOriginalRegions] = useState(null);


//
  // Initialize from run data function

 // First, define our available regions structure

 const initializeFromRunData = useCallback(async (runData) => {
  if (!runData?.targetCompanyData?.original?.jurisdictional_presence?.countries) {
    console.error('❌ No jurisdictional data found in run data');
    return;
  }
 
  console.log('📦 Loading jurisdictional data...');
  
  const jurisdictionalPresence = runData.targetCompanyData.original.jurisdictional_presence.countries;
  const selectedRegionIds = new Set();
 
  // Check presence boolean and blocks for each country
  Object.entries(jurisdictionalPresence).forEach(([country, data]) => {
    if (data.presence && data.blocks) {
      data.blocks.forEach(block => {
        if (block === 'us' || block === 'eu' || block === 'uk') {
          selectedRegionIds.add(block);
        }
      });
    }
  });
 
  console.log('🗺️ Selected regions based on presence:', Array.from(selectedRegionIds));
 
  setSelectedRegions(Array.from(selectedRegionIds));
  setOriginalRegions(Array.from(selectedRegionIds));
  
  // Initialize jurisdictions based on presence
  const initialJurisdictions = {};
  Array.from(selectedRegionIds).forEach(regionId => {
    const region = regionConfigs[regionId];
    if (region) {
      // Only include jurisdictions where presence is true
      initialJurisdictions[regionId] = region.jurisdictions.filter(j => 
        jurisdictionalPresence[j]?.presence
      );
    }
  });
 
  console.log('📍 Initial jurisdictions:', initialJurisdictions);
  setSelectedJurisdictions(initialJurisdictions);
 
 }, []);
  



  // Update run data in the backend - now only called when rendering worksheet
  const saveRunData = useCallback(async (data) => {
    if (!activeRun?.projectId || !activeRun?.runId) {
      throw new Error('Missing run information');
    }

    try {
      console.log('💾 Saving region changes:', data);

      const response = await fetch(
        `/api/projects/${activeRun.projectId}/runs/${activeRun.runId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'region_update',
            regions: selectedRegions,
            jurisdictions: selectedJurisdictions,
            changes: {
              added: selectedRegions.filter(r => !originalRegions.includes(r)),
              removed: originalRegions.filter(r => !selectedRegions.includes(r))
            }
          })
        }
      );

      if (!response.ok) throw new Error('Failed to update regions');
      
      const updatedData = await response.json();
      console.log('✅ Successfully saved region changes:', updatedData);
      
      return updatedData;
    } catch (error) {
      console.error('❌ Error saving regions:', error);
      throw error;
    }
  }, [activeRun, selectedRegions, selectedJurisdictions, originalRegions]);

  const toggleRegion = useCallback((region) => {
    console.log('🔄 Toggling region:', region);
    
    setSelectedRegions(prev => {
      const isSelected = prev.includes(region);
      const newSelectedRegions = isSelected
        ? prev.filter(r => r !== region)
        : [...prev, region];
  
      console.log('Updated selected regions:', newSelectedRegions);
      return newSelectedRegions;
    });
  
    // Clean up jurisdictions if region is deselected
    setSelectedJurisdictions(prev => {
      const newJurisdictions = { ...prev };
      if (prev[region] && !selectedRegions.includes(region)) {
        delete newJurisdictions[region];
      }
      return newJurisdictions;
    });
  }, [selectedRegions]);
  const toggleJurisdiction = useCallback((regionId, jurisdiction, isSelected) => {
    console.log('🔄 Toggling jurisdiction:', { regionId, jurisdiction, isSelected });

    setSelectedJurisdictions(prev => {
      const currentSelected = prev[regionId] || [];
      const newSelected = isSelected
        ? [...currentSelected, jurisdiction]
        : currentSelected.filter(j => j !== jurisdiction);

      return {
        ...prev,
        [regionId]: newSelected
      };
    });
  }, []);

  const hasSelectedJurisdictions = useCallback(() => {
    return Object.values(selectedJurisdictions).some(jurisdictions =>
      jurisdictions && jurisdictions.length > 0
    );
  }, [selectedJurisdictions]);

  return {
    selectedRegions,
    selectedJurisdictions,
    toggleRegion,
    toggleJurisdiction,
    hasSelectedJurisdictions,
    saveRegionChanges: saveRunData,
    initializeFromRunData
  };
};
