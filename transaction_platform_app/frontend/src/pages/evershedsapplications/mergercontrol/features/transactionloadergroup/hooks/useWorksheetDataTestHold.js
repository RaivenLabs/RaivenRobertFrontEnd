// useWorksheetData.js
import { useState, useEffect } from 'react';

console.log('🎯 Simple hook file loaded');

export const useWorksheetData = (runData, regionConfiguration) => {
  console.log('🚀 Simple hook called');
  const [testValue, setTestValue] = useState('Hello from hook!');

  useEffect(() => {
    console.log('⭐ Hook effect running');
  }, []);

  return { testValue };
};
