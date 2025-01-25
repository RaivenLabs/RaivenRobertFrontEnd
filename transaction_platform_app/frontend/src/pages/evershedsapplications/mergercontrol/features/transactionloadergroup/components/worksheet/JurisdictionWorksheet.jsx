// JurisdictionWorksheet.jsx
import React from 'react';
import { useWorksheetData } from '../../hooks/useWorksheetData';

const JurisdictionWorksheet = ({ runData, regionConfiguration }) => {
  console.log('🎯 Simple worksheet mounting with:', { runData, regionConfiguration });
  
  const { testValue } = useWorksheetData(runData, regionConfiguration);
  
  return (
    <div>
      <h1>Test Worksheet</h1>
      <p>Test Value: {testValue}</p>
    </div>
  );
};

export default JurisdictionWorksheet;
