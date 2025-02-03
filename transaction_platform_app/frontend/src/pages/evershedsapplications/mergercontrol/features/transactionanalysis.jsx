import React, { useEffect } from 'react';
import { 
  Building2, Globe, Scale, AlertTriangle, Clipboard,
  DollarSign, Users, PieChart, Flag, ChevronDown, Clock,
  ChevronUp, AlertCircle, CheckCircle, Info
} from 'lucide-react';
import { useMergerControl } from '../../../../context/MergerControlContext';

// Helper function to format numbers nicely
const formatCurrency = (value, currency = 'USD') => {
  if (!value) return 'N/A';
  
  const symbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';
  const numericValue = typeof value === 'number' ? value : Number(value);
  
  if (numericValue >= 1e9) {
    return `${symbol}${(numericValue / 1e9).toFixed(1)}B`;
  } else if (numericValue >= 1e6) {
    return `${symbol}${(numericValue / 1e6).toFixed(1)}M`;
  }
  return `${symbol}${numericValue.toLocaleString()}`;
};

const formatNumber = (value) => {
  if (!value) return 'N/A';
  const numericValue = typeof value === 'number' ? value : Number(value);
  return numericValue.toLocaleString();
};

// DataPanel component with updated structure handling
const DataPanel = ({ title, icon, companyData }) => {
  const getMetrics = () => {
    return {
      "Global Metrics": {
        "Global Revenue": formatCurrency(companyData?.global_metrics?.global_revenue?.numeric),
        "Total Assets": formatCurrency(companyData?.global_metrics?.size_of_person?.total_assets?.numeric),
        "Global Employees": formatNumber(companyData?.global_metrics?.global_employees)
      },
      "Regional Metrics": {
        "US Revenue": formatCurrency(companyData?.regional_blocks?.united_states?.block_metrics?.revenue),
        "EU Revenue": formatCurrency(companyData?.regional_blocks?.european_union?.block_metrics?.revenue, 'EUR'),
        "UK Revenue": formatCurrency(companyData?.regional_blocks?.united_kingdom?.block_metrics?.revenue, 'GBP')
      },
      "Employment": {
        "US Employees": formatNumber(companyData?.regional_blocks?.united_states?.block_metrics?.employees),
        "EU Employees": formatNumber(companyData?.regional_blocks?.european_union?.block_metrics?.employees),
        "UK Employees": formatNumber(companyData?.regional_blocks?.united_kingdom?.block_metrics?.employees)
      }
    };
  };

  const metrics = getMetrics();

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-4">
        {icon}
        <h3 className="text-xl font-semibold text-royal-blue ml-2">{title}</h3>
      </div>
      <div className="space-y-4">
        {Object.entries(metrics).map(([category, items]) => (
          <div key={category}>
            <h4 className="font-semibold text-teal mb-2">{category}</h4>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(items).map(([key, value]) => (
                <div key={key} className="bg-light-ivory p-3 rounded-lg">
                  <div className="text-sm text-gray-600">{key}</div>
                  <div className="text-lg font-semibold text-royal-blue">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper to analyze filing requirements based on company data
const analyzeFilingRequirements = (buyingCompany, targetCompany) => {
  const requirements = [];
  const regions = ['european_union', 'united_states', 'united_kingdom'];
  
  regions.forEach(region => {
    const buyerPresent = buyingCompany?.regional_blocks?.[region]?.presence;
    const targetPresent = targetCompany?.regional_blocks?.[region]?.presence;
    
    if (buyerPresent && targetPresent) {
      // Check member states for filing requirements
      const memberStates = Object.entries(targetCompany.regional_blocks[region].member_states || {});
      memberStates.forEach(([state, data]) => {
        if (data.merger_control_info?.filing_required) {
          requirements.push({
            jurisdiction: state.charAt(0).toUpperCase() + state.slice(1),
            status: 'Filing Required',
            thresholds: data.merger_control_info.thresholds,
            reviewPeriod: data.merger_control_info.review_period_days
          });
        }
      });
    }
  });
  
  return requirements;
};

// Helper to identify key risks
const identifyKeyRisks = (buyingCompany, targetCompany) => {
  const risks = [];
  
  // Check for sector overlap
  if (buyingCompany?.sector === targetCompany?.sector) {
    risks.push('Horizontal overlap in sector');
  }

  // Check for high market shares
  const regions = ['european_union', 'united_states', 'united_kingdom'];
  regions.forEach(region => {
    const states = targetCompany?.regional_blocks?.[region]?.member_states || {};
    Object.entries(states).forEach(([state, data]) => {
      Object.entries(data.market_shares || {}).forEach(([market, share]) => {
        if (share > 0.25) {
          risks.push(`High market share (${(share * 100).toFixed(1)}%) in ${state} ${market}`);
        }
      });
    });
  });

  return risks;
};

// Main component
const TransactionAnalysis = () => {
  const { 
    transactionTargetCompany,
    transactionBuyingCompany,
    loadRunData,
    isLoading,
    activeRun,
    projectId
  } = useMergerControl();

  // Load data when component mounts
  useEffect(() => {
    const loadAnalysisData = async () => {
      if (!transactionTargetCompany || !transactionBuyingCompany) {
        console.log('📊 Loading transaction data...');
        
        if (activeRun?.runId && projectId) {
          await loadRunData({
            projectId: projectId,
            runId: activeRun.runId
          });
        }
      }
    };

    loadAnalysisData();
  }, [activeRun?.runId, projectId]);

  if (isLoading) {
    return (
      <div className="p-6 bg-ivory min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Loading analysis data...</div>
        </div>
      </div>
    );
  }

  if (!transactionTargetCompany || !transactionBuyingCompany) {
    return (
      <div className="p-6 bg-ivory min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">
            Unable to load analysis data. 
            {!transactionTargetCompany && ' (Missing target company data)'}
            {!transactionBuyingCompany && ' (Missing buying company data)'}
          </div>
        </div>
      </div>
    );
  }

  // Calculate filing requirements and risks
  const filingRequirements = analyzeFilingRequirements(transactionBuyingCompany, transactionTargetCompany);
  const keyRisks = identifyKeyRisks(transactionBuyingCompany, transactionTargetCompany);

  // Helper to combine metrics
  const combinedMetrics = {
    global_metrics: {
      global_revenue: {
        numeric: (transactionBuyingCompany?.global_metrics?.global_revenue?.numeric || 0) +
                (transactionTargetCompany?.global_metrics?.global_revenue?.numeric || 0)
      },
      size_of_person: {
        total_assets: {
          numeric: (transactionBuyingCompany?.global_metrics?.size_of_person?.total_assets?.numeric || 0) +
                  (transactionTargetCompany?.global_metrics?.size_of_person?.total_assets?.numeric || 0)
        }
      },
      global_employees: (transactionBuyingCompany?.global_metrics?.global_employees || 0) +
                      (transactionTargetCompany?.global_metrics?.global_employees || 0)
    },
    regional_blocks: {
      united_states: {
        block_metrics: {
          revenue: (transactionBuyingCompany?.regional_blocks?.united_states?.block_metrics?.revenue || 0) +
                  (transactionTargetCompany?.regional_blocks?.united_states?.block_metrics?.revenue || 0),
          employees: (transactionBuyingCompany?.regional_blocks?.united_states?.block_metrics?.employees || 0) +
                    (transactionTargetCompany?.regional_blocks?.united_states?.block_metrics?.employees || 0)
        }
      },
      european_union: {
        block_metrics: {
          revenue: (transactionBuyingCompany?.regional_blocks?.european_union?.block_metrics?.revenue || 0) +
                  (transactionTargetCompany?.regional_blocks?.european_union?.block_metrics?.revenue || 0),
          employees: (transactionBuyingCompany?.regional_blocks?.european_union?.block_metrics?.employees || 0) +
                    (transactionTargetCompany?.regional_blocks?.european_union?.block_metrics?.employees || 0)
        }
      },
      united_kingdom: {
        block_metrics: {
          revenue: (transactionBuyingCompany?.regional_blocks?.united_kingdom?.block_metrics?.revenue || 0) +
                  (transactionTargetCompany?.regional_blocks?.united_kingdom?.block_metrics?.revenue || 0),
          employees: (transactionBuyingCompany?.regional_blocks?.united_kingdom?.block_metrics?.employees || 0) +
                    (transactionTargetCompany?.regional_blocks?.united_kingdom?.block_metrics?.employees || 0)
        }
      }
    }
  };

  return (
    <div className="p-6 bg-ivory min-h-screen">
      {/* Analysis Summary Panel */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center mb-4">
          <Scale className="text-royal-blue w-6 h-6 mr-2" />
          <h2 className="text-2xl font-semibold text-royal-blue">
            Transaction Analysis Summary
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-light-ivory p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Filing Requirements</h3>
            <div className="space-y-2">
              <div className="flex items-center text-red-500">
                <AlertCircle className="w-4 h-4 mr-2" />
                <span>{filingRequirements.length} Required Filings</span>
              </div>
            </div>
          </div>
          <div className="bg-light-ivory p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Key Risks</h3>
            <div className="space-y-2">
              {keyRisks.map((risk, index) => (
                <div key={index} className="flex items-center text-orange-500">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  <span>{risk}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-light-ivory p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Timeline Estimate</h3>
            <div className="space-y-2">
              <div className="flex items-center text-royal-blue">
                <Clock className="w-4 h-4 mr-2" />
                <span>
                  {Math.max(...filingRequirements.map(r => r.reviewPeriod || 0))} days review period
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Company Analysis Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DataPanel 
          title="Acquiring Company" 
          icon={<Building2 className="text-royal-blue w-6 h-6" />} 
          companyData={transactionBuyingCompany}
        />
        <DataPanel 
          title="Target Company" 
          icon={<Flag className="text-royal-blue w-6 h-6" />} 
          companyData={transactionTargetCompany}
        />
        <DataPanel 
          title="Combined Entity" 
          icon={<PieChart className="text-royal-blue w-6 h-6" />} 
          companyData={combinedMetrics}
        />
      </div>

      {/* Filing Requirements Analysis */}
      <div className="mt-6 space-y-4">
        <h3 className="text-xl font-semibold text-royal-blue">Filing Requirements Analysis</h3>
        {filingRequirements.map((requirement, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertCircle className="text-red-500 w-5 h-5 mr-2" />
                <h4 className="font-semibold">{requirement.jurisdiction}</h4>
              </div>
              <span className="text-sm text-gray-600">
                {requirement.reviewPeriod} day review period
              </span>
            </div>
            <div className="mt-2">
              {Object.entries(requirement.thresholds || {}).map(([key, value]) => (
                <div key={key} className="text-sm text-gray-600">
                  • {key.replace(/_/g, ' ')}: {formatCurrency(value)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};





export default TransactionAnalysis;
