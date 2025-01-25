// src/features/transaction-loader/components/Worksheet/JurisdictionWorksheet.jsx
import React from 'react';
import WorksheetHeader from './WorksheetHeader';
import WorksheetRow from './WorksheetRow';
import { useWorksheetData } from '../../hooks/useWorksheetData';
import { regionConfigs } from '../../utils/regionConfigs';  // Added this import




const JurisdictionWorksheet = ({ runData, regionConfiguration }) => {
  console.log('📊 JurisdictionWorksheet mounting with props:', { runData, regionConfiguration });
  const {
    worksheetData,
    handleInputChange,
    getValue,
    error,
    projectName
  } = useWorksheetData(runData, regionConfiguration);

  const generateRegionSection = (region, jurisdictions) => {
    const rows = [];
    const config = regionConfigs[region] || regionConfigs.us;

    // Add region header
    rows.push({
      type: 'regionHeader',
      content: config.title,
      region: region,
      totalEntities: jurisdictions?.length || 0
    });

    // Add column headers
    rows.push({
      type: 'columnHeaders',
      headers: config.headers
    });

    // Generate jurisdiction rows based on region type
    if (region === 'uk') {
      // UK specific rows - single jurisdiction
      rows.push({
        type: 'jurisdiction',
        name: "United Kingdom",
        region: region,
        requirements: config.headers
      });
    } else if (region === 'us') {
      // US specific rows with total and states
      rows.push({
        type: 'jurisdiction',
        name: "United States (Total)",
        region: region,
        isTotal: true,
        requirements: config.headers
      });

      jurisdictions?.forEach(state => {
        rows.push({
          type: 'jurisdiction',
          name: state,
          region: region,
          isState: true,
          requirements: config.headers
        });
      });
    } else {
      // EU and other regions
      jurisdictions?.forEach(jurisdiction => {
        rows.push({
          type: 'jurisdiction',
          name: jurisdiction,
          region: region,
          requirements: config.headers
        });
      });
    }

    return rows;
  };

  const renderWorksheetContent = () => {
    if (!worksheetData || !regionConfiguration) return [];

    let allRows = [];
    regionConfiguration.regions.forEach(region => {
      const regionJurisdictions = regionConfiguration.jurisdictions[region];
      const regionRows = generateRegionSection(region, regionJurisdictions);
      allRows = [...allRows, ...regionRows];
    });
    return allRows;
  };

  if (!worksheetData) {
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
        onImportClick={() => console.log('Import Spreadsheet clicked')}
      />
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}
      
      <div className="overflow-x-auto">
        {renderWorksheetContent().map((row, index) => (
          <WorksheetRow
            key={`${row.region}-${row.type}-${index}`}
            type={row.type}
            data={row}
            region={row.region}
            onInputChange={handleInputChange}
            getValue={getValue}
          />
        ))}
      </div>
    </div>
  );
};

export default JurisdictionWorksheet;
