import React, { useEffect, useState } from 'react';
import WorksheetHeader from './WorksheetHeader';
import WorksheetRow from './WorksheetRow';
import { useWorksheetData } from '../../hooks/useWorksheetData';
import { regionConfigs } from '../../utils/regionConfigs';

const JurisdictionWorksheet = ({ runId, regionConfiguration }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [runData, setRunData] = useState(null);

  const {
    worksheetData,
    handleInputChange,
    getValue,
    error,
    projectName
  } = useWorksheetData(runData, regionConfiguration);

  // Add effect to load run data when component mounts
  useEffect(() => {
    const loadRunData = async () => {
      try {
        const response = await fetch(`/api/projects/hamilton/runs/${runId}/worksheet`);
        if (!response.ok) {
          throw new Error('Failed to load worksheet data');
        }
        const data = await response.json();
        setRunData(data);
      } catch (err) {
        console.error('Error loading worksheet data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (runId) {
      loadRunData();
    }
  }, [runId]);

  const generateRegionSection = (region, jurisdictions) => {
    const rows = [];
    const config = regionConfigs[region] || regionConfigs.us;

    // Add region header with active jurisdiction count
    const activeJurisdictions = jurisdictions?.filter(j => 
      runData?.jurisdictions?.[region]?.includes(j)
    );

    rows.push({
      type: 'regionHeader',
      content: config.title,
      region: region,
      totalEntities: activeJurisdictions?.length || 0
    });

    // Only generate rows for active jurisdictions
    if (activeJurisdictions?.length) {
      // Add column headers
      rows.push({
        type: 'columnHeaders',
        headers: config.headers
      });

      // Generate jurisdiction rows based on region type and active status
      if (region === 'uk' && runData?.jurisdictions?.uk) {
        rows.push({
          type: 'jurisdiction',
          name: "United Kingdom",
          region: region,
          requirements: config.headers,
          values: runData.jurisdictionData?.uk || {}
        });
      } else {
        activeJurisdictions.forEach(jurisdiction => {
          rows.push({
            type: 'jurisdiction',
            name: jurisdiction,
            region: region,
            requirements: config.headers,
            values: runData.jurisdictionData?.[jurisdiction] || {}
          });
        });
      }
    }

    return rows;
  };

  const handleSaveWorksheet = async () => {
    try {
      const response = await fetch(`/api/projects/hamilton/runs/${runId}/worksheet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(worksheetData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to save worksheet data');
      }
      
      // Handle successful save
      console.log('Worksheet data saved successfully');
    } catch (err) {
      console.error('Error saving worksheet data:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
        <div className="flex items-center justify-center h-40">
          <div className="text-gray-600">Loading worksheet data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
      <WorksheetHeader 
        projectName={projectName}
        onSaveClick={handleSaveWorksheet}
        onImportClick={() => console.log('Import Spreadsheet clicked')}
      />
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}
      
      <div className="overflow-x-auto">
        {Object.entries(regionConfiguration?.jurisdictions || {}).map(([region, jurisdictions]) => (
          generateRegionSection(region, jurisdictions).map((row, index) => (
            <WorksheetRow
              key={`${row.region}-${row.type}-${index}`}
              type={row.type}
              data={row}
              region={row.region}
              onInputChange={handleInputChange}
              getValue={getValue}
            />
          ))
        ))}
      </div>
    </div>
  );
};

export default JurisdictionWorksheet;
