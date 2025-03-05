import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { regionalBlockConfigs, createInitialPresenceState } from '../../utils/regionalBlockConfigs';
import { useMergerControl } from '../../../../../../../context/MergerControlContext';

const RegionalBlockSelector = ({ disabled, onWorksheetGenerate }) => {
  const { activeRun } = useMergerControl();
  const [presenceState, setPresenceState] = useState(() => createInitialPresenceState());
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from active run data
  useEffect(() => {
    if (!activeRun?.targetCompanyData?.regional_blocks) {
      setIsLoading(false);
      return;
    }

    console.log('📊 Initializing from active run:', activeRun);
    const blocks = activeRun.targetCompanyData.regional_blocks;
    
    // Start with clean slate
    const newState = createInitialPresenceState();

    // Set true values from existing run data
    Object.entries(blocks).forEach(([regionKey, regionData]) => {
      if (regionKey === 'template') return;
      
      Object.entries(regionData.member_states || {}).forEach(([stateKey, stateData]) => {
        if (stateData.presence === true) {
          newState[regionKey][stateKey] = true;
        }
      });
    });

    console.log('📊 Setting initial presence state:', newState);
    setPresenceState(newState);
    setIsLoading(false);
  }, [activeRun]);

  // Simple toggle function - just updates local state
  const handleMemberStateToggle = (regionKey, stateKey, checked) => {
    if (disabled) return;

    console.log('🔄 Toggling member state:', { regionKey, stateKey, checked });
    
    setPresenceState(prev => ({
      ...prev,
      [regionKey]: {
        ...prev[regionKey],
        [stateKey]: checked
      }
    }));
  };

  // Save configuration - this is where we update run_data
  const handleSaveConfiguration = async () => {
    try {
      console.log('💾 Saving configuration with state:', presenceState);

      // Build the changes array for all true values
      const changes = [];
      
      Object.entries(presenceState).forEach(([regionKey, states]) => {
        Object.entries(states).forEach(([stateKey, isPresent]) => {
          changes.push({
            run_id: activeRun.runId,
            project_id: activeRun.projectId,
            block_key: regionKey,
            member_state_key: stateKey,
            presence: isPresent
          });
        });
      });

      // Save all changes at once
      const saveResponse = await fetch(
        `/api/projects/${activeRun.projectId}/runs/${activeRun.runId}/toggle_regional_blocks`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ changes })
        }
      );

      if (!saveResponse.ok) {
        throw new Error('Failed to save configuration');
      }

      const result = await saveResponse.json();
      console.log('✅ Successfully saved configuration:', result);

      // Call worksheet generate with updated data
      onWorksheetGenerate(result.data);

    } catch (error) {
      console.error('❌ Error saving configuration:', error);
    }
  };

  // Helper to check if any states are selected in a region
  const isRegionActive = (regionKey) => {
    return Object.values(presenceState[regionKey] || {}).some(isPresent => isPresent);
  };

  // Helper to count total selected states
  const getSelectedStateCount = () => {
    return Object.values(presenceState).reduce((total, region) => {
      return total + Object.values(region).filter(isPresent => isPresent).length;
    }, 0);
  };

  if (isLoading) {
    return <div className="p-6 text-gray-600">Analyzing regional presence...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-wrap gap-6">
        {Object.entries(regionalBlockConfigs).map(([regionKey, regionConfig]) => {
          const isActive = isRegionActive(regionKey);

          return (
            <div key={regionKey} className="flex flex-col">
              <div className={`
                w-fit px-6 py-3 rounded-lg flex items-center space-x-2
                ${isActive ? 'bg-royalBlue text-white' : 'bg-gray-100 text-gray-700'}
              `}>
                <Globe className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                <span>{regionConfig.display}</span>
              </div>

              <div className="mt-2">
                <div className="bg-white rounded-md border border-gray-300 p-2 w-fit min-w-[200px]">
                  {regionConfig.member_states.map(memberState => (
                    <div key={`${regionKey}-${memberState.dataKey}`} 
                      className="flex items-center p-2 hover:bg-gray-50 rounded-md">
                      <input
                        type="checkbox"
                        checked={presenceState[regionKey]?.[memberState.dataKey] || false}
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
        {getSelectedStateCount()} member states selected
      </div>

      <div className="mt-8 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Select member states to include in analysis
        </div>
        
        <button
          onClick={handleSaveConfiguration}
          disabled={disabled || getSelectedStateCount() === 0}
          className="px-6 py-3 bg-teal text-white rounded-lg hover:bg-teal/90 disabled:opacity-50"
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
};

export default RegionalBlockSelector;
