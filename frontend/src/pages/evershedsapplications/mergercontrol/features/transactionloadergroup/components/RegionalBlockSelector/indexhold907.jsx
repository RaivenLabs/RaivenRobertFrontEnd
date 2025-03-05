import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { regionalBlockConfigs } from '../../utils/regionalBlockConfigs';
import { useMergerControl } from '../../../../../../../context/MergerControlContext';


const RegionalBlockSelector = ({ disabled, onWorksheetGenerate }) => {
  const { activeRun } = useMergerControl();
  const [displayState, setDisplayState] = useState({
    activeRegions: [],
    activeMemberStates: {}
  });
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from active run data
  const initializeFromRun = () => {
    if (!activeRun?.targetCompanyData?.regional_blocks) {
      setIsLoading(false);
      return;
    }

    console.log('📊 Initializing from active run:', activeRun);
    const blocks = activeRun.targetCompanyData.regional_blocks;
    
    const newState = {
      activeRegions: [],
      activeMemberStates: {}
    };

    Object.entries(blocks).forEach(([regionKey, regionData]) => {
      if (regionKey === 'template') return;
      
      const activeStates = [];
      Object.entries(regionData.member_states || {}).forEach(([stateKey, stateData]) => {
        if (stateData.presence === true) {
          activeStates.push(stateKey);
        }
      });

      if (activeStates.length > 0) {
        newState.activeRegions.push(regionKey);
        newState.activeMemberStates[regionKey] = activeStates;
      }
    });

    console.log('📊 Setting initial display state:', newState);
    setDisplayState(newState);
    setIsLoading(false);
  };

  useEffect(() => {
    initializeFromRun();
  }, [activeRun]);

  // Handle member state toggling
  const handleMemberStateToggle = async (regionKey, stateKey, checked) => {
    if (disabled) return;

    console.log('🔄 Toggling member state:', { regionKey, stateKey, checked });
    
    try {
      // Update local state immediately for responsiveness
      setDisplayState(prev => {
        const newState = { ...prev };
        const regionStates = [...(prev.activeMemberStates[regionKey] || [])];
        
        if (checked) {
          regionStates.push(stateKey);
        } else {
          const index = regionStates.indexOf(stateKey);
          if (index > -1) {
            regionStates.splice(index, 1);
          }
        }

        // Update active member states
        newState.activeMemberStates = {
          ...prev.activeMemberStates,
          [regionKey]: regionStates
        };

        // Update active regions based on member state presence
        newState.activeRegions = Object.entries(newState.activeMemberStates)
          .filter(([_, states]) => states.length > 0)
          .map(([key]) => key);

        console.log('📊 Updated display state:', newState);
        return newState;
      });

      // Prepare changes for API
      const changes = [{
        run_id: activeRun.runId,
        project_id: activeRun.projectId,
        block_key: regionKey,
        member_state_key: stateKey,
        presence: checked
      }];

      // Save changes to API
      const saveResponse = await fetch(
        `/api/projects/${activeRun.projectId}/runs/${activeRun.runId}/toggle_regional_blocks`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ changes })
        }
      );

      if (!saveResponse.ok) {
        throw new Error('Failed to save changes');
      }

      const freshData = await saveResponse.json();
      console.log('✅ Received fresh data:', freshData);

      // Update display state from fresh data
      const regional_blocks = freshData.data.targetCompanyData.regional_blocks;
      console.log('🔍 Processing regional blocks:', regional_blocks);

      const newDisplayState = {
        activeRegions: [],
        activeMemberStates: {}
      };

      // Process each region
      Object.entries(regional_blocks).forEach(([regionKey, regionData]) => {
        const activeStates = [];
        
        Object.entries(regionData.member_states || {}).forEach(([stateKey, stateData]) => {
          if (stateData.presence === true) {
            activeStates.push(stateKey);
          }
        });

        if (activeStates.length > 0) {
          newDisplayState.activeRegions.push(regionKey);
          newDisplayState.activeMemberStates[regionKey] = activeStates;
        }
      });

      console.log('🎯 Setting new display state:', newDisplayState);
      setDisplayState(newDisplayState);

    } catch (error) {
      console.error('❌ Error saving changes:', error);
      // Revert local state on error
      initializeFromRun();
    }
  };

  if (isLoading) {
    return <div className="p-6 text-gray-600">Analyzing regional presence...</div>;
  }

  const { activeRegions, activeMemberStates } = displayState;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-wrap gap-6">
        {Object.entries(regionalBlockConfigs).map(([regionKey, regionConfig]) => {
          const isRegionActive = activeRegions.includes(regionKey);
          const activeStatesForRegion = activeMemberStates[regionKey] || [];

          return (
            <div key={regionKey} className="flex flex-col">
              <div className={`
                w-fit px-6 py-3 rounded-lg flex items-center space-x-2
                ${isRegionActive ? 'bg-royalBlue text-white' : 'bg-gray-100 text-gray-700'}
              `}>
                <Globe className={`w-5 h-5 ${isRegionActive ? 'text-white' : 'text-gray-600'}`} />
                <span>{regionConfig.display}</span>
              </div>

              <div className="mt-2">
                <div className="bg-white rounded-md border border-gray-300 p-2 w-fit min-w-[200px]">
                  {regionConfig.member_states.map(memberState => (
                    <div key={`${regionKey}-${memberState.dataKey}`} 
                      className="flex items-center p-2 hover:bg-gray-50 rounded-md">
                      <input
                        type="checkbox"
                        checked={activeStatesForRegion.includes(memberState.dataKey)}
                        onChange={(e) => handleMemberStateToggle(regionKey, memberState.dataKey, e.target.checked)}
                        disabled={disabled}
                        className={`rounded border-gray-300 text-royalBlue focus:ring-royalBlue mr-2
                          ${disabled ? 'cursor-not-allowed bg-gray-100' : ''}`}
                      />
                      <label className={`text-gray-700 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                        {memberState.display}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-sm text-gray-600">
        {Object.values(activeMemberStates).flat().length} member states active across {activeRegions.length} regions
      </div>

      <div className="mt-8 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {Object.values(activeMemberStates).flat().length} member states selected
        </div>
        
        <button
          onClick={() => onWorksheetGenerate(activeRun)}
          disabled={disabled || Object.values(activeMemberStates).flat().length === 0}
          className="px-6 py-3 bg-teal text-white rounded-lg hover:bg-teal/90 disabled:opacity-50"
        >
          Generate Worksheet
        </button>
      </div>
    </div>
  );
};

export default RegionalBlockSelector;
