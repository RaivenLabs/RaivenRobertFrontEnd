import React, { createContext, useState, useEffect } from 'react';
import { buyingCompanies } from '../data/buyingCompanyData.js';
import { targetCompanies } from '../data/targetCompanyData.js';

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
  const [dealSize, setDealSize] = useState(null);
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

  // Load run data for transaction analysis
  const loadRunData = async (runData) => {
    try {
      setIsLoading(true);
      const { projectId, runId } = runData;
      
      const targetDataPath = `/api/projects/${projectId}/runs/${runId}`;
      const buyingDataPath = `/api/projects/${projectId}/runs/${runId}/buying_data`;
      
      const [targetResponse, buyingResponse] = await Promise.all([
        fetch(targetDataPath),
        fetch(buyingDataPath)
      ]);

      if (!targetResponse.ok || !buyingResponse.ok) {
        throw new Error('Failed to fetch company data');
      }

      const targetData = await targetResponse.json();
      const buyingData = await buyingResponse.json();

      // Update states with the fetched data
      setTransactionTargetCompany(targetData.targetCompanyData);
      setTransactionBuyingCompany(buyingData.buyingCompanyData);

      // Update deal card with basic metrics
      updateDealCard(targetData.targetCompanyData, buyingData.buyingCompanyData);

    } catch (error) {
      console.error('❌ Error loading run data:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Basic metrics calculation
  const updateDealCard = (targetData, buyingData) => {
    setDealCard({
      totalValue: dealSize,
      closingDate: new Date().toISOString(),
      keyMetrics: {
        combinedRevenue: (targetData?.global_metrics?.global_revenue?.numeric || 0) + 
                        (buyingData?.global_metrics?.global_revenue?.numeric || 0),
        combinedEmployees: (targetData?.global_metrics?.global_employees || 0) + 
                         (buyingData?.global_metrics?.global_employees || 0)
      }
    });
  };

  // Company update functions
  const updateBuyingCompany = (companyId) => {
    setBuyingCompany(companyId);
    const companyData = buyingCompanies[companyId];
    if (companyData) {
      setBuyingCompanyData(companyData);
      localStorage.setItem('selectedBuyingCompany', companyId);
    }
  };

  const updateTargetCompany = (companyId) => {
    setTargetCompany(companyId);
    const companyData = targetCompanies[companyId];
    if (companyData) {
      setTargetCompanyData(companyData);
      localStorage.setItem('selectedTargetCompany', companyId);
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

    // Load transaction-specific data
    loadRunData(runData);
  };

  // Clear function
  const clearSelections = () => {
    setBuyingCompany(null);
    setBuyingCompanyData(null);
    setTargetCompany(null);
    setTargetCompanyData(null);
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

  return (
    <MergerControlContext.Provider
      value={{
        // Company Data
        buyingCompany,
        buyingCompanyData,
        targetCompany,
        targetCompanyData,
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
        
        // Region Selection
        selectedRegions,
        selectedJurisdictions,
        updateRegionSelections: (regions, jurisdictions) => {
          setSelectedRegions(regions);
          setSelectedJurisdictions(jurisdictions);
        },
        
        // Status & Error States
        isLoading,
        error,
        setError,

        // Functions
        updateBuyingCompany,
        updateTargetCompany,
        clearSelections,
        loadRunData,
        
        // Available Companies Lists
        buyingCompanies,
        targetCompanies,
      }}
    >
      {children}
    </MergerControlContext.Provider>
  );
};

function useMergerControl() {
  const context = React.useContext(MergerControlContext);
  if (!context) {
    throw new Error('useMergerControl must be used within a MergerControlProvider');
  }
  return context;
}

export { MergerControlProvider, useMergerControl };
export default MergerControlContext;
