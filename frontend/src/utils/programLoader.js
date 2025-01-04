// src/utils/programLoader.js
import { navigationConfig } from '../config/navigation';

const generateProgramDataMap = () => {
  const map = {};

  const processItems = (items) => {
    items.forEach(item => {
      // Create the import function for each item
      map[item.id] = () => {
        try {
          // First try to load from the application-specific location
          if (item.id === 'speakeasy-applications') {
            return import(`../data/speakeasy_programs.json`);
          }
          // Default fallback to original pattern
          return import(`../pages/menusections/${item.id}/${item.id}_programs.json`);
        } catch (error) {
          console.log('📝 No program data found for:', item.id);
          return Promise.resolve(null);
        }
      };

      // Process submenu items if they exist
      if (item.submenuItems) {
        processItems(item.submenuItems);
      }
    });
  };

  processItems(navigationConfig.mainItems);
  return map;
};

const PROGRAM_DATA_MAP = generateProgramDataMap();

export const loadProgramData = async (sectionId) => {
  console.log('🔍 Attempting to load program data for:', sectionId);
  
  try {
    if (PROGRAM_DATA_MAP[sectionId]) {
      const data = await PROGRAM_DATA_MAP[sectionId]();
      // If data is null, it means the import failed silently
      if (!data) {
        console.log('❌ No data found for:', sectionId);
        return null;
      }
      console.log('✅ Successfully loaded data for:', sectionId);
      return data.default;
    }
    return null;
  } catch (error) {
    // Only log errors for sections that should have program data
    const sectionsWithPrograms = [
      'rapidreview', 
      'buildkits', 
      'r2d2', 
      'sandbox',
      'exchange', 
      'speakeasy', 
      'speakeasy-applications',  // Added for our new section
      'houseapps', 
      'tangibleteams'
    ];
    
    if (sectionsWithPrograms.includes(sectionId)) {
      console.warn(`⚠️ Error loading program data for section: ${sectionId}`, error);
    }
    return null;
  }
};
