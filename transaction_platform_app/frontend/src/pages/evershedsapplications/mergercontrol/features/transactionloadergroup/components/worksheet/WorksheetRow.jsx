// src/features/transaction-loader/components/Worksheet/WorksheetRow.jsx
import React from 'react';
import { Globe } from 'lucide-react';
import JurisdictionRow from './JurisdictionRow';
import { calculateSizeOfPerson } from '../../../../../../../utils/mergerControlAlgorithms';

const WorksheetRow = ({ 
  type, 
  data, 
  region,
  onInputChange,
  getValue
}) => {
  const getRegionStyle = (regionKey) => {
    const styles = {
      us: "bg-royalBlue",
      eu: "bg-teal",
      uk: "bg-navyBlue",
      comesa: "bg-[#2C5282]",
      southAmerica: "bg-[#2D3748]"
    };
    return styles[regionKey] || "bg-royalBlue";
  };

  switch (type) {
    case 'regionHeader':
      return (
        <div className={`${getRegionStyle(data.region)} rounded-t-lg p-4 
                        text-ivory font-semibold text-lg 
                        shadow-sm mt-8 first:mt-0 
                        flex items-center justify-between`}>
          <div className="flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            {data.content}
          </div>
          {data.totalEntities > 0 && (
            <span className="text-sm opacity-80">
              {data.totalEntities} jurisdictions selected
            </span>
          )}
        </div>
      );

    case 'columnHeaders':
      return (
        <div className="bg-gray-50">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                {/* Jurisdiction column */}
                <th className="pl-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                  Jurisdiction
                </th>
                {/* Dynamic headers based on region */}
                {Object.entries(data.headers).map(([key, value]) => (
                  <th 
                    key={key} 
                    className="pl-6 pr-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48"
                  >
                    {value}
                  </th>
                ))}
              </tr>
            </thead>
          </table>
        </div>
      );

    case 'jurisdiction':
      return (
        <JurisdictionRow
          data={data}
          region={region}
          onInputChange={onInputChange}
          getValue={getValue}
          calculateSizeOfPerson={calculateSizeOfPerson}
        />
      );

    default:
      return null;
  }
};

export default WorksheetRow;
