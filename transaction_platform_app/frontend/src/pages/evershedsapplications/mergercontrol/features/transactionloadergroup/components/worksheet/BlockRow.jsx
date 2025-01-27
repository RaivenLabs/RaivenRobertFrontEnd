// src/features/transaction-loader/components/Worksheet/BlockRow.jsx
import React from 'react';
import { Globe } from 'lucide-react';
import MemberStateRow from './MemberStateRow';  // renamed from JurisdictionRow
import BlockHeader from './BlockHeader';        // renamed from RegionHeader
import ColumnHeaders from './ColumnHeaders';
import { calculateSizeOfPerson } from '../../../../../../../utils/mergerControlAlgorithms';

const BlockRow = ({ 
  type, 
  data, 
  blockKey,
  onInputChange,
  getValue
}) => {
  // Updated styling for blocks
  const getBlockStyle = (key) => {
    const styles = {
      united_states: "bg-royalBlue",
      european_union: "bg-teal",
      united_kingdom: "bg-navyBlue",
      comesa: "bg-[#2C5282]",
      south_america: "bg-[#2D3748]"
    };
    return styles[key] || "bg-royalBlue";
  };

  switch (type) {
    case 'blockHeader':
      return (
        <div className={`${getBlockStyle(data.blockKey)} rounded-t-lg p-4 
                        text-ivory font-semibold text-lg 
                        shadow-sm mt-8 first:mt-0 
                        flex items-center justify-between`}>
          <div className="flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            {data.content}
          </div>
          {data.totalEntities > 0 && (
            <span className="text-sm opacity-80">
              {data.totalEntities} member state{data.totalEntities !== 1 ? 's' : ''} selected
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
                {/* Member State column */}
                <th className="pl-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                  Member State
                </th>
                {/* Dynamic headers based on block configuration */}
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

    case 'memberState':
      return (
        <MemberStateRow
          data={data}
          blockKey={blockKey}
          onInputChange={onInputChange}
          getValue={getValue}
          calculateSizeOfPerson={calculateSizeOfPerson}
        />
      );

    default:
      console.warn('Unknown row type:', type);
      return null;
  }
};



export default BlockRow;
