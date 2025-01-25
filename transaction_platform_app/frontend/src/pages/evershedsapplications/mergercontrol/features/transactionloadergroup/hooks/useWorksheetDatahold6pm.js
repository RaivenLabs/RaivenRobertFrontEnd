// hooks/useWorksheetData.js
import { useState, useEffect } from 'react';
import { mapRunDataToWorksheet, mapWorksheetToRunData } from '../../../../../../utils/worksheetMapping';

export const useWorksheetData = (runData, regionConfiguration) => {
  const [worksheetData, setWorksheetData] = useState(null);
  const [error, setError] = useState(null);
  const [completeRunData, setCompleteRunData] = useState(null);

  useEffect(() => {
    const loadWorksheetData = async () => {
      try {
        console.log('🚀 Starting worksheet data load with:', { 
          projectId: runData?.projectId, 
          runId: runData?.runId 
        });

        // Fetch complete run data
        const response = await fetch(
          `/api/projects/${runData.projectId}/runs/${runData.runId}`
        );

        if (!response.ok) throw new Error('Failed to load worksheet data');
        const fetchedRunData = await response.json();

        console.log('📦 Fetched complete run data:', JSON.stringify(fetchedRunData, null, 2));
        setCompleteRunData(fetchedRunData);

        // Initialize worksheet data using complete run data
        const initialData = {};
        
        console.log('🎯 Processing regions:', regionConfiguration.regions);
        regionConfiguration.regions.forEach(region => {
          console.log(`\n🌍 Processing region: ${region}`);
          initialData[region] = {};
          
          if (region === 'uk') {
            console.log('🇬🇧 Processing UK as special case');
            initialData[region] = mapRunDataToWorksheet(fetchedRunData, region, 'uk');
            console.log('UK Data mapped:', initialData[region]);
          } else {
            console.log(`📊 Processing jurisdictions for ${region}:`, 
              regionConfiguration.jurisdictions[region]);
            
            regionConfiguration.jurisdictions[region]?.forEach(jurisdiction => {
              console.log(`  🔸 Mapping jurisdiction: ${jurisdiction}`);
              initialData[region][jurisdiction] = mapRunDataToWorksheet(
                fetchedRunData,
                region,
                jurisdiction
              );
              console.log(`  ✅ Mapped data for ${jurisdiction}:`, 
                initialData[region][jurisdiction]);
            });
          }
        });

        console.log('🏁 Final worksheet data structure:', JSON.stringify(initialData, null, 2));
        setWorksheetData(initialData);

      } catch (error) {
        console.error('❌ Error loading worksheet data:', error);
        setError('Failed to load worksheet data. Please try again.');
      }
    };

    if (runData?.projectId && runData?.runId && regionConfiguration) {
      loadWorksheetData();
    } else {
      console.log('⚠️ Missing required data:', { 
        hasRunData: !!runData, 
        hasProjectId: !!runData?.projectId,
        hasRunId: !!runData?.runId,
        hasRegionConfig: !!regionConfiguration 
      });
    }
  }, [runData, regionConfiguration]);

  const handleInputChange = async (region, jurisdiction, field, value) => {
    console.log('📝 Handling input change:', { region, jurisdiction, field, value });
    
    try {
      // Update local state
      setWorksheetData(prev => ({
        ...prev,
        [region]: {
          ...prev[region],
          [jurisdiction]: {
            ...prev[region][jurisdiction],
            [field]: value
          }
        }
      }));

      // Map to run_data format
      const updateData = mapWorksheetToRunData({ 
        ...worksheetData[region][jurisdiction],
        [field]: value
      }, region, jurisdiction);

      console.log('📤 Sending update to backend:', updateData);
      
      // Send update to backend
      const response = await fetch(
        `/api/projects/${runData.projectId}/runs/${runData.runId}/update_jurisdiction_data`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jurisdiction,
            region,
            updates: updateData
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update jurisdiction data');
      }

      const result = await response.json();
      console.log('✅ Successfully updated:', result);

    } catch (err) {
      console.error('❌ Error updating worksheet:', err);
      setError('Failed to save changes. Please try again.');
    }
  };

  return {
    worksheetData,
    handleInputChange,
    error,
    setValue: (region, jurisdiction, field, value) => {
      handleInputChange(region, jurisdiction, field, value);
    },
    getValue: (region, jurisdiction, field) => {
      console.log('📖 Getting value for:', { region, jurisdiction, field });
      const value = worksheetData?.[region]?.[jurisdiction]?.[field];
      console.log('📖 Retrieved value:', value);
      return value ?? '';
    }
  };
};
