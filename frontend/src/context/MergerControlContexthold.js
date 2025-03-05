import React, { createContext, useState, useEffect } from 'react';
import { buyingCompanies } from '../data/buyingCompanyData.js';
import { targetCompanies } from '../data/targetCompanyData.js';
import determineFilingRequirements, {
  calculateMarketShareOverlap,
  validateCompanyData
} from '../utils/mergerControlAlgorithms';

const MergerControlContext = createContext();

const MergerControlProvider = ({ children }) => {
  // Analysis State
  const [activeRun, setActiveRun] = useState(null);
  const [projectId, setProjectId] = useState(null);
  
  // Original Company State Management
  const [buyingCompany, setBuyingCompany] = useState(null);
  const [buyingCompanyData, setBuyingCompanyData] = useState(null);
  const [targetCompany, setTargetCompany] = useState(null);
  const [targetCompanyData, setTargetCompanyData] = useState(null);
  const [combinedAnalysis, setCombinedAnalysis] = useState(null);
  const [dealSize, setDealSize] = useState(null);
  // Add this with the other state declarations
const [error, setError] = useState(null);
  
  // Transaction-specific Company States
  const [transactionTargetCompany, setTransactionTargetCompany] = useState(null);
  const [transactionBuyingCompany, setTransactionBuyingCompany] = useState(null);




  
  // Analysis Results State
  const [analysisResults, setAnalysisResults] = useState({
    filingRequirements: null,
    marketOverlap: null,
    combinedMetrics: null,
    regionalPresence: null
  });

  // Deal Card State
  const [dealCard, setDealCard] = useState({
    totalValue: null,
    closingDate: null,
    keyMetrics: {},
    riskFactors: []
  });
  
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
          setTargetCompany(savedSeller);
          setTargetCompanyData(targetCompanies[savedSeller]);
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
        console.error('Unable to load saved data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedData();
  }, []);

  // Load run data for transaction analysis
  const loadRunData = async (runData) => {
    try {
        setIsLoading(true);
        const { projectId, runId } = runData;
        
        console.log('🚀 Starting loadRunData with:', { projectId, runId });

        // Fetch both target and buying company data
        const targetDataPath = `/api/projects/${projectId}/runs/${runId}`;
        const buyingDataPath = `/api/projects/${projectId}/runs/${runId}`;
        
        console.log('🔍 Fetching data from:', { targetDataPath, buyingDataPath });

        // Fetch both in parallel
        const [targetResponse, buyingResponse] = await Promise.all([
            fetch(targetDataPath),
            fetch(buyingDataPath)
        ]);

        console.log('📥 Response status:', {
            targetStatus: targetResponse.status,
            buyingStatus: buyingResponse.status
        });

        if (!targetResponse.ok || !buyingResponse.ok) {
            throw new Error('Failed to fetch company data');
        }

        // Parse both responses
        const targetData = await targetResponse.json();
        const buyingData = await buyingResponse.json();

        console.log('🎯 Extracted company data:', {
            target: targetData,
            buying: buyingData
        });

        if (!targetData || !buyingData) {
            throw new Error('Missing company data in response');
        }

        // Update states with the fetched data
        setTransactionTargetCompany(targetData);
        setTransactionBuyingCompany(buyingData);

        updateDealCard(targetData, buyingData);
        performAnalysis(targetData, buyingData);

        console.log('✅ Successfully processed company data');

    } catch (error) {
        console.error('❌ Error loading run data:', error);
        setError(error.message);
    } finally {
        setIsLoading(false);
    }
};
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
      console.error('Unable to update combined analysis:', err);
    }
  };

  // Deal Card and Analysis Functions
  const updateDealCard = (targetData, buyingData) => {
    setDealCard({
      totalValue: dealSize,
      closingDate: new Date().toISOString(),
      keyMetrics: {
        combinedRevenue: targetData?.global_metrics?.global_revenue?.numeric + 
                        buyingData?.global_metrics?.global_revenue?.numeric,
        combinedEmployees: targetData?.global_metrics?.global_employees + 
                          buyingData?.global_metrics?.global_employees,
        geographicOverlap: calculateGeographicOverlap(targetData, buyingData)
      },
      riskFactors: determineRiskFactors(targetData, buyingData)
    });
  };


 



  const performAnalysis = (targetData, buyingData) => {
    if (!targetData || !buyingData) return;

    try {
      validateCompanyData(targetData);
      validateCompanyData(buyingData);

      const filingRequirements = determineFilingRequirements(targetData, buyingData, {
        checkHealthcare: true,
        considerJointVenture: false
      });

      const marketOverlap = calculateMarketShareOverlap(targetData, buyingData);
      const combinedMetrics = calculateCombinedMetrics(targetData, buyingData);
      const regionalPresence = analyzeRegionalPresence(targetData, buyingData);

      setAnalysisResults({
        filingRequirements,
        marketOverlap,
        combinedMetrics,
        regionalPresence
      });

    } catch (error) {
      console.error('Analysis error:', error);
    }
  };

  // Analysis Helper Functions
  const calculateGeographicOverlap = (targetData, buyingData) => {
    const targetRegions = Object.keys(targetData?.regional_blocks || {});
    const buyingRegions = Object.keys(buyingData?.regional_blocks || {});
    
    return targetRegions.filter(region => buyingRegions.includes(region));
  };

  const determineRiskFactors = (targetData, buyingData) => {
    const riskFactors = [];
    
    if (targetData?.sector === buyingData?.sector) {
      riskFactors.push('Horizontal overlap in sector');
    }

    const overlappingRegions = calculateGeographicOverlap(targetData, buyingData);
    if (overlappingRegions.length > 0) {
      riskFactors.push(`Geographic overlap in ${overlappingRegions.length} regions`);
    }

    return riskFactors;
  };

  const calculateCombinedMetrics = (targetData, buyingData) => {
    const combinedMetrics = {};
    const regions = new Set([
      ...Object.keys(targetData?.regional_blocks || {}),
      ...Object.keys(buyingData?.regional_blocks || {})
    ]);

    regions.forEach(region => {
      const targetMetrics = targetData?.regional_blocks?.[region]?.block_metrics || {};
      const buyerMetrics = buyingData?.regional_blocks?.[region]?.block_metrics || {};

      combinedMetrics[region] = {
        revenue: (targetMetrics.revenue || 0) + (buyerMetrics.revenue || 0),
        employees: (targetMetrics.employees || 0) + (buyerMetrics.employees || 0),
        assets: (targetMetrics.assets || 0) + (buyerMetrics.assets || 0)
      };
    });

    return combinedMetrics;
  };

  const analyzeRegionalPresence = (targetData, buyingData) => {
    const regionalAnalysis = {};
    const regions = new Set([
      ...Object.keys(targetData?.regional_blocks || {}),
      ...Object.keys(buyingData?.regional_blocks || {})
    ]);

    regions.forEach(region => {
      const targetPresent = targetData?.regional_blocks?.[region]?.presence || false;
      const buyerPresent = buyingData?.regional_blocks?.[region]?.presence || false;

      regionalAnalysis[region] = {
        targetPresent,
        buyerPresent,
        combinedPresence: targetPresent || buyerPresent,
        overlapping: targetPresent && buyerPresent
      };
    });

    return regionalAnalysis;
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
    setTargetCompany(companyId);
    const companyData = targetCompanies[companyId];
    if (companyData) {
      setTargetCompanyData(companyData);
      localStorage.setItem('selectedTargetCompany', companyId);
      updateCombinedAnalysis(buyingCompanyData, companyData);
    }
  };

  // Analysis management
  const startAnalysis = (runData) => {
    console.log('📊 Starting analysis with run:', runData?.runId);
    setActiveRun(runData);
    
    if (runData?.targetCompanyData) {
      setTargetCompanyData(runData.targetCompanyData.modified || runData.targetCompanyData.original);
    }

    if (runData?.projectId) {
      setProjectId(runData.projectId);
    }

    if (buyingCompanyData && runData?.targetCompanyData) {
      updateCombinedAnalysis(
        buyingCompanyData, 
        runData.targetCompanyData.modified || runData.targetCompanyData.original
      );
    }

    // Load transaction-specific data
    loadRunData(runData);
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
    setTargetCompany(null);
    setTargetCompanyData(null);
    setCombinedAnalysis(null);
    setTransactionTargetCompany(null);
    setTransactionBuyingCompany(null);
    setDealCard({
      totalValue: null,
      closingDate: null,
      keyMetrics: {},
      riskFactors: []
    });
    setWorksheetData({
      regions: {},
      targetInputs: {},
      analysisResults: {}
    });
    localStorage.removeItem('selectedBuyingCompany');
    localStorage.removeItem('selectedTargetCompany');
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
        dealSize,
        setDealSize,
        
        // Transaction-specific Data
        transactionTargetCompany,
        transactionBuyingCompany,
        analysisResults,
        dealCard,
        
        // Analysis State
        activeRun,
        startAnalysis,
        
        // Project Management
        projectName,
        projectMetadata,
        savedProjects,
        projectId,
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
        loadRunData,
        performAnalysis,
        
        // Available Companies Lists
        buyingCompanies,
        targetCompanies,
        
        // Analysis Helper Functions
        calculateGeographicOverlap,
        determineRiskFactors,
        calculateCombinedMetrics,
        analyzeRegionalPresence,
        
        // Status & Error States
        isLoading,
        error,                // Add this
        setError,            // Add this if you want components to be able to set errors


        // Deal Card Management
        updateDealCard
      }}
    >
      {children}
    </MergerControlContext.Provider>
  );
};

// Add this before your exports
function useMergerControl() {
  const context = React.useContext(MergerControlContext);
  if (!context) {
    throw new Error('useMergerControl must be used within a MergerControlProvider');
  }
  return context;
}


// Then at the bottom, update your exports to include both:
export { MergerControlProvider, useMergerControl };
export default MergerControlContext;
