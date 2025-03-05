import React, { createContext, useContext, useState, useEffect } from 'react';
import { buyingCompanies } from '../data/buyingCompanyData';
import { targetCompanies } from '../data/targetCompanyData';
import determineFilingRequirements, {
  calculateMarketShareOverlap,
  validateCompanyData
} from '../utils/mergerControlAlgorithms';

const MergerControlContext = createContext();

export const MergerControlProvider = ({ children }) => {
  // Run State Management
  const [currentRun, setCurrentRun] = useState({
    runId: null,
    projectId: null,
    displayName: null,
    dateCreated: null,
    lastModified: null,
    status: null,
    buyingCompany: null
  });

  // Company Data State
  const [transactionTargetCompany, setTransactionTargetCompany] = useState(null);
  const [transactionBuyingCompany, setTransactionBuyingCompany] = useState(null);
  
  // Analysis Results State
  const [analysisResults, setAnalysisResults] = useState({
    filingRequirements: null,
    marketOverlap: null,
    combinedMetrics: null,
    regionalPresence: null
  });

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load run data function aligned with API response
  const loadRunData = async ({ projectId, runId }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('📊 Loading run data...');
      const response = await fetch(`/api/projects/${projectId}/runs/${runId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch run data');
      }

      const data = await response.json();
      
      // Update run metadata
      setCurrentRun({
        runId: data.runId,
        projectId: data.projectId,
        displayName: data.displayName,
        dateCreated: data.dateCreated,
        lastModified: data.lastModified,
        status: data.status,
        buyingCompany: data.buyingCompany
      });

      // Update company data
      setTransactionTargetCompany(data.targetCompanyData);
      setTransactionBuyingCompany(data.buyingCompanyData);

      // Trigger analysis if we have both sets of data
      if (data.targetCompanyData && data.buyingCompanyData) {
        await performAnalysis(data.targetCompanyData, data.buyingCompanyData);
      }

      console.log('✅ Run data loaded successfully');
    } catch (err) {
      console.error('❌ Error loading run data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Perform analysis with both companies' data
  const performAnalysis = async (targetData, buyingData) => {
    try {
      if (!targetData || !buyingData) {
        console.warn('⚠️ Missing company data for analysis');
        return;
      }

      // Calculate filing requirements based on regional presence
      const filingRequirements = calculateFilingRequirements(targetData, buyingData);
      
      // Calculate market overlap in relevant jurisdictions
      const marketOverlap = calculateMarketOverlap(targetData, buyingData);
      
      // Calculate combined metrics
      const combinedMetrics = calculateCombinedMetrics(targetData, buyingData);

      setAnalysisResults({
        filingRequirements,
        marketOverlap,
        combinedMetrics,
        regionalPresence: analyzeRegionalPresence(targetData, buyingData)
      });

      console.log('✅ Analysis completed successfully');
    } catch (err) {
      console.error('❌ Error performing analysis:', err);
      setError('Failed to perform analysis');
    }
  };

  // Helper function to calculate filing requirements
  const calculateFilingRequirements = (targetData, buyingData) => {
    const requirements = {
      mandatoryFilings: [],
      additionalReview: []
    };

    // Check each region's member states for filing requirements
    Object.entries(targetData.regional_blocks || {}).forEach(([region, blockData]) => {
      if (blockData.presence) {
        Object.entries(blockData.member_states || {}).forEach(([state, stateData]) => {
          if (stateData.merger_control_info?.filing_required) {
            requirements.mandatoryFilings.push({
              jurisdiction: state,
              thresholds: stateData.merger_control_info.thresholds,
              reviewPeriod: stateData.merger_control_info.review_period_days
            });
          }
        });
      }
    });

    return requirements;
  };

  // Helper function to calculate market overlap
  const calculateMarketOverlap = (targetData, buyingData) => {
    const overlaps = {
      horizontal: [],
      vertical: []
    };

    // Check each region for market share overlaps
    Object.entries(targetData.regional_blocks || {}).forEach(([region, blockData]) => {
      if (blockData.presence) {
        Object.entries(blockData.member_states || {}).forEach(([state, stateData]) => {
          Object.entries(stateData.market_shares || {}).forEach(([market, share]) => {
            // Add to horizontal overlaps if both companies are in same market
            if (buyingData.regional_blocks?.[region]?.member_states?.[state]?.market_shares?.[market]) {
              overlaps.horizontal.push({
                region,
                state,
                market,
                targetShare: share,
                buyerShare: buyingData.regional_blocks[region].member_states[state].market_shares[market],
                combinedShare: share + buyingData.regional_blocks[region].member_states[state].market_shares[market]
              });
            }
          });
        });
      }
    });

    return overlaps;
  };

  // Helper function to analyze regional presence
  const analyzeRegionalPresence = (targetData, buyingData) => {
    const presence = {};
    
    // Combine all unique regions from both companies
    const allRegions = new Set([
      ...Object.keys(targetData.regional_blocks || {}),
      ...Object.keys(buyingData.regional_blocks || {})
    ]);

    allRegions.forEach(region => {
      if (region !== 'template') {
        presence[region] = {
          targetPresent: targetData.regional_blocks?.[region]?.presence || false,
          buyerPresent: buyingData.regional_blocks?.[region]?.presence || false,
          overlapStates: []
        };

        // Check for state-level overlaps
        const targetStates = Object.keys(targetData.regional_blocks?.[region]?.member_states || {});
        const buyerStates = Object.keys(buyingData.regional_blocks?.[region]?.member_states || {});
        
        presence[region].overlapStates = targetStates.filter(state => 
          buyerStates.includes(state) &&
          targetData.regional_blocks[region].member_states[state].presence &&
          buyingData.regional_blocks[region].member_states[state].presence
        );
      }
    });

    return presence;
  };

  // Helper function to calculate combined metrics
  const calculateCombinedMetrics = (targetData, buyingData) => {
    return {
      global: {
        revenue: (targetData.global_metrics?.global_revenue?.numeric || 0) +
                (buyingData.global_metrics?.global_revenue?.numeric || 0),
        employees: (targetData.global_metrics?.global_employees || 0) +
                  (buyingData.global_metrics?.global_employees || 0)
      },
      regional: Object.fromEntries(
        Object.keys(targetData.regional_blocks || {})
          .filter(region => region !== 'template')
          .map(region => [
            region,
            {
              revenue: (targetData.regional_blocks[region]?.block_metrics?.revenue || 0) +
                      (buyingData.regional_blocks[region]?.block_metrics?.revenue || 0),
              employees: (targetData.regional_blocks[region]?.block_metrics?.employees || 0) +
                        (buyingData.regional_blocks[region]?.block_metrics?.employees || 0)
            }
          ])
      )
    };
  };

  return (
    <MergerControlContext.Provider
      value={{
        // Run Data
        currentRun,
        
        // Company Data
        transactionTargetCompany,
        transactionBuyingCompany,
        
        // Analysis Results
        analysisResults,
        
        // UI State
        isLoading,
        error,
        
        // Functions
        loadRunData,
        performAnalysis
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
