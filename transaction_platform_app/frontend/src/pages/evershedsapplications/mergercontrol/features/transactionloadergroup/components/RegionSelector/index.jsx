import React, { useState, useEffect } from 'react';
import { Globe, FileSpreadsheet } from 'lucide-react';
import { useRegionSelection } from '../../hooks/useRegionSelection';
import { regionConfigs } from '../../utils/regionConfigs';

// Internal component for region button with disabled state
const RegionButton = ({ region, regionConfig, isSelected, onToggle, disabled }) => {
  console.log('🔘 RegionButton render:', { region, isSelected, disabled });
  
  const baseStyles = "w-fit px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-200";
  const selectedStyles = "bg-royalBlue text-white hover:bg-blue-700";
  const unselectedStyles = "bg-gray-100 text-gray-700 hover:bg-gray-200";
  const disabledStyles = "opacity-50 cursor-not-allowed";
  
  const buttonClass = `${baseStyles} 
    ${isSelected ? selectedStyles : unselectedStyles}
    ${disabled ? disabledStyles : ''}`;
  
  return (
    <button
      onClick={() => !disabled && onToggle(region)}
      disabled={disabled}
      className={buttonClass}
    >
      <Globe className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
      <span>{regionConfig.title}</span>
    </button>
  );
};

// Internal component for jurisdiction checkboxes with disabled state
const JurisdictionList = ({ 
  region, 
  jurisdictions, 
  selectedJurisdictions = [], 
  onJurisdictionToggle,
  requiresParent,
  disabled 
}) => (
  <div className={`mt-2 ${disabled ? 'opacity-75' : ''}`}>
    <div className="bg-white rounded-md border border-gray-300 p-2 w-fit min-w-[200px]">
      {jurisdictions.map(jurisdiction => (
        <div 
          key={`${region}-jurisdiction-${jurisdiction}`}
          className={`flex items-center p-2 hover:bg-gray-50 rounded-md
            ${disabled ? 'cursor-not-allowed' : ''}`}
        >
          <input
            type="checkbox"
            id={`checkbox-${region}-${jurisdiction}`}
            checked={selectedJurisdictions.includes(jurisdiction)}
            onChange={(e) => !disabled && onJurisdictionToggle(region, jurisdiction, e.target.checked)}
            disabled={disabled}
            className={`rounded border-gray-300 text-royalBlue focus:ring-royalBlue mr-2
              ${disabled ? 'cursor-not-allowed bg-gray-100' : ''}`}
          />
          <label 
            htmlFor={`checkbox-${region}-${jurisdiction}`}
            className={`cursor-pointer text-gray-700 hover:text-royalBlue flex-grow
              ${disabled ? 'cursor-not-allowed' : ''}`}
          >
            {jurisdiction}
          </label>
        </div>
      ))}
    </div>
    {requiresParent && (
      <div className="text-sm text-gray-500 mt-1">
        Parent jurisdiction data required for analysis
      </div>
    )}
  </div>
);

const RegionSelector = ({ onWorksheetGenerate, projectName, activeRun, disabled }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const {
    selectedRegions,
    selectedJurisdictions,
    toggleRegion,
    toggleJurisdiction,
    hasSelectedJurisdictions,
    initializeFromRunData
  } = useRegionSelection(activeRun);

  useEffect(() => {
    const loadInitialData = async () => {
      if (disabled) {
        console.log('🔒 Region selector is disabled, skipping data load');
        return;
      }
      
      try {
        console.log('🌍 Loading initial region data from run:', activeRun);
        setIsLoading(true);
        setLoadError(null);
        await initializeFromRunData(activeRun);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading initial region data:', error);
        setLoadError('Failed to load region data. Please try again.');
        setIsLoading(false);
      }
    };

    if (activeRun) {
      loadInitialData();
    }
  }, [activeRun, initializeFromRunData, disabled]);

  const handleRegionToggle = (regionKey) => {
    if (disabled) return;
    console.log('🔄 Toggling region:', regionKey);
    toggleRegion(regionKey);
    setHasUnsavedChanges(true);
  };

  const handleJurisdictionToggle = (region, jurisdiction, checked) => {
    if (disabled) return;
    toggleJurisdiction(region, jurisdiction, checked);
    setHasUnsavedChanges(true);
  };

  const handleWorksheetGenerate = async () => {
    if (disabled || !hasSelectedJurisdictions()) return;
    console.log('🌍 Preparing region data handoff...');
    
    try {
      if (hasUnsavedChanges) {
        const projectId = activeRun.project || 'hamilton';
        const changes = [];
        
        selectedRegions.forEach(region => {
          changes.push({
            run_id: activeRun.runId,
            project_name: activeRun.projectName || activeRun.project,
            buying_company: activeRun.buyingCompany || 'artemis',
            country: region,
            active: true
          });
          
          if (selectedJurisdictions[region]?.length > 0) {
            selectedJurisdictions[region].forEach(jurisdiction => {
              changes.push({
                run_id: activeRun.runId,
                project_name: activeRun.projectName || activeRun.project,
                buying_company: activeRun.buyingCompany || 'artemis',
                country: jurisdiction,
                parent_region: region,
                active: true
              });
            });
          }
        });
        
        console.log('📦 Saving final region configuration...');
        const response = await fetch(`/api/projects/${projectId}/runs/${activeRun.runId}/toggle_jurisdiction`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ changes })
        });
        
        const responseData = await response.json();
        console.log('✅ Region configuration saved:', responseData);
      }
  
      const regionAnalysisPackage = {
        runId: activeRun.runId,
        projectId: activeRun.project,
        regions: selectedRegions,
        jurisdictions: selectedJurisdictions,
        dateConfigured: new Date().toISOString()
      };
  
      console.log('🤝 Handing off to Worksheet team:', regionAnalysisPackage);
      onWorksheetGenerate(regionAnalysisPackage);
  
    } catch (error) {
      console.error('❌ Error in region handoff:', error);
      setLoadError('Failed to save region configuration. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-6 ${disabled ? 'opacity-75' : ''}`}>
        <div className="flex items-center justify-center h-40">
          <div className="text-gray-600">Loading region data...</div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-6 ${disabled ? 'opacity-75' : ''}`}>
        <div className="flex flex-col items-center justify-center h-40">
          <div className="text-red-600 mb-4">{loadError}</div>
          <button 
            onClick={() => !disabled && window.location.reload()} 
            disabled={disabled}
            className={`px-4 py-2 bg-royalBlue text-ivory rounded-lg hover:opacity-90
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${disabled ? 'opacity-75' : ''}`}>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold text-royalBlue">
              Set Target Company Analysis Scope
            </h2>
            {projectName && (
              <p className="text-gray-600 text-sm mt-1">
                Project: {projectName}
                {disabled && " (Completed)"}
              </p>
            )}
          </div>
          <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
            Target Company
          </span>
        </div>
        <p className="text-gray-600">
          {disabled 
            ? "Region and jurisdiction selection completed"
            : "Review and modify regions and jurisdictions for analysis"}
        </p>
      </div>

      <div className="flex flex-wrap gap-6 mb-8">
        {Object.entries(regionConfigs).map(([regionKey, config]) => (
          <div key={`region-${regionKey}`} className="flex flex-col">
            <RegionButton
              region={regionKey}
              regionConfig={config}
              isSelected={selectedRegions.includes(regionKey)}
              onToggle={() => handleRegionToggle(regionKey)}
              disabled={disabled}
            />
            
            {selectedRegions.includes(regionKey) && config.jurisdictions?.length > 0 && (
              <JurisdictionList
                key={`jurisdictions-${regionKey}`}
                region={regionKey}
                jurisdictions={config.jurisdictions}
                selectedJurisdictions={selectedJurisdictions[regionKey]}
                onJurisdictionToggle={handleJurisdictionToggle}
                requiresParent={config.requiresParent}
                disabled={disabled}
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {hasSelectedJurisdictions() 
            ? `${Object.values(selectedJurisdictions).flat().length} jurisdictions selected${hasUnsavedChanges ? ' (unsaved)' : ''}`
            : 'Select at least one jurisdiction to continue'}
        </div>
        <button
          onClick={handleWorksheetGenerate}
          disabled={disabled || !hasSelectedJurisdictions()}
          className={`px-6 py-3 bg-teal text-ivory rounded-lg
                   hover:opacity-90 disabled:opacity-50 
                   disabled:cursor-not-allowed transition-colors
                   flex items-center space-x-2`}
        >
          <FileSpreadsheet className="w-5 h-5" />
          <span>
            {hasUnsavedChanges ? 'Save and Generate Worksheet' : 'Generate Worksheet'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default RegionSelector;
