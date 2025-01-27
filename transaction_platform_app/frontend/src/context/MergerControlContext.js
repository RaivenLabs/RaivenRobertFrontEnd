// contexts/MergerControlContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { buyingCompanies } from '../data/buyingCompanyData';
import { targetCompanies } from '../data/targetCompanyData';
import determineFilingRequirements, {
  calculateMarketShareOverlap,
  validateCompanyData
} from '../utils/mergerControlAlgorithms';

const MergerControlContext = createContext();

export const MergerControlProvider = ({ children }) => {
  // Analysis State
  const [activeRun, setActiveRun] = useState(null);
  
  // State Management
  const [buyingCompany, setBuyingCompany] = useState(null);
  const [buyingCompanyData, setBuyingCompanyData] = useState(null);
  const [targetCompany, settargetCompany] = useState(null);
  const [targetCompanyData, settargetCompanyData] = useState(null);
  const [combinedAnalysis, setCombinedAnalysis] = useState(null);
  
  // Project Management State
  const [projectName, setProjectName] = useState('');
  const [savedProjects, setSavedProjects] = useState({});
  const [projectMetadata, setProjectMetadata] = useState({
    created: null,
    lastModified: null,
    status: 'draft'
  });

  // Worksheet Data State
  const [worksheetData, setWorksheetData] = useState({
    regions: {},
    targetInputs: {},
    analysisResults: {}
  });

  // Region Selection State
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedJurisdictions, setSelectedJurisdictions] = useState({});

  // Status States
  const [isLoading, setIsLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadSavedData = async () => {
      setIsLoading(true);
      try {
        const savedBuyer = localStorage.getItem('selectedBuyingCompany');
        const savedSeller = localStorage.getItem('selectedTargetCompany');
        const savedProject = localStorage.getItem('currentProject');
        const savedProjectsData = localStorage.getItem('savedProjects');
        
        if (savedBuyer) {
          setBuyingCompany(savedBuyer);
          setBuyingCompanyData(buyingCompanies[savedBuyer]);
        }
        
        if (savedSeller) {
          settargetCompany(savedSeller);
          settargetCompanyData(targetCompanies[savedSeller]);
        }

        if (savedProject) {
          const projectData = JSON.parse(savedProject);
          setProjectName(projectData.name);
          setProjectMetadata(projectData.metadata);
          setWorksheetData(projectData.worksheetData || {});
        }

        if (savedProjectsData) {
          setSavedProjects(JSON.parse(savedProjectsData));
        }
      } catch (err) {
        console.log('Unable to load saved data');
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedData();
  }, []);

  // Update combined analysis using the algorithm file
  const updateCombinedAnalysis = (buyer, seller) => {
    if (!buyer || !seller) return;

    try {
      validateCompanyData(buyer);
      validateCompanyData(seller);

      const filingRequirements = determineFilingRequirements(buyer, seller, {
        checkHealthcare: true,
        considerJointVenture: false
      });

      const analysis = {
        filing_requirements: filingRequirements,
        market_analysis: calculateMarketShareOverlap(buyer, seller),
        metadata: {
          calculation_date: new Date().toISOString(),
          status: 'complete'
        }
      };

      setCombinedAnalysis(analysis);
    } catch (err) {
      console.log('Unable to update combined analysis');
    }
  };

  // Company update functions
  const updateBuyingCompany = (companyId) => {
    setBuyingCompany(companyId);
    const companyData = buyingCompanies[companyId];
    if (companyData) {
      setBuyingCompanyData(companyData);
      localStorage.setItem('selectedBuyingCompany', companyId);
      updateCombinedAnalysis(companyData, targetCompanyData);
    }
  };

  const updateTargetCompany = (companyId) => {
    settargetCompany(companyId);
    const companyData = targetCompanies[companyId];
    if (companyData) {
      settargetCompanyData(companyData);
      localStorage.setItem('selectedtargetCompany', companyId);
      updateCombinedAnalysis(buyingCompanyData, companyData);
    }
  };

  // Analysis management
  const startAnalysis = (runData) => {
    console.log('📊 Starting analysis with run:', runData?.runId);
    setActiveRun(runData);
    // Update target company data from run if available
    if (runData?.targetCompanyData) {
      settargetCompanyData(runData.targetCompanyData.modified || runData.targetCompanyData.original);
    }
    // Update combined analysis
    if (buyingCompanyData && runData?.targetCompanyData) {
      updateCombinedAnalysis(
        buyingCompanyData, 
        runData.targetCompanyData.modified || runData.targetCompanyData.original
      );
    }
  };

  // Project management functions
  const updateProjectName = (name) => {
    setProjectName(name);
    const metadata = {
      ...projectMetadata,
      lastModified: new Date().toISOString(),
      created: projectMetadata.created || new Date().toISOString()
    };
    setProjectMetadata(metadata);
    
    const projectData = {
      name,
      metadata,
      worksheetData
    };
    
    setSavedProjects(prev => ({
      ...prev,
      [name]: projectData
    }));
    
    localStorage.setItem('currentProject', JSON.stringify(projectData));
    localStorage.setItem('savedProjects', JSON.stringify({
      ...savedProjects,
      [name]: projectData
    }));
  };

  // Worksheet data management
  const updateWorksheetData = (regionKey, jurisdictionKey, fieldKey, value) => {
    setWorksheetData(prev => ({
      ...prev,
      regions: {
        ...prev.regions,
        [regionKey]: {
          ...prev.regions[regionKey],
          [jurisdictionKey]: {
            ...(prev.regions[regionKey]?.[jurisdictionKey] || {}),
            [fieldKey]: value
          }
        }
      }
    }));
  };

  // Clear function
  const clearSelections = () => {
    setBuyingCompany(null);
    setBuyingCompanyData(null);
    settargetCompany(null);
    settargetCompanyData(null);
    setCombinedAnalysis(null);
    setWorksheetData({
      regions: {},
      targetInputs: {},
      analysisResults: {}
    });
    localStorage.removeItem('selectedBuyingCompany');
    localStorage.removeItem('selectedtargetCompany');
    localStorage.removeItem('currentProject');
  };

  return (
    <MergerControlContext.Provider
      value={{
        // Company Data
        buyingCompany,
        buyingCompanyData,
        targetCompany,
        targetCompanyData,
        combinedAnalysis,
        
        // Analysis State
        activeRun,
        startAnalysis,
        
        // Project Management
        projectName,
        projectMetadata,
        savedProjects,
        updateProjectName,
        
        // Worksheet Data
        worksheetData,
        updateWorksheetData,
        
        // Region Selection
        selectedRegions,
        selectedJurisdictions,
        updateRegionSelections: (regions, jurisdictions) => {
          setSelectedRegions(regions);
          setSelectedJurisdictions(jurisdictions);
        },
        
        // Status Indicator
        isLoading,
        
        // Functions
        updateBuyingCompany,
        updateTargetCompany,
        clearSelections,
        
        // Available Companies Lists
        buyingCompanies,
        targetCompanies
      }}
    >
      {children}
    </MergerControlContext.Provider>
  );
};

export const useMergerControl = () => {
  const context = useContext(MergerControlContext);
  if (!context) {
    throw new Error('useMergerControl must be used within a MergerControlProvider');
  }
  return context;
};

export default MergerControlContext;
