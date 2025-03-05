import React, { useEffect, useState } from 'react';
import { 
  Building2, Globe, Scale, AlertTriangle, Clipboard,
  DollarSign, Users, PieChart, Flag, ChevronDown, Clock,
  ChevronUp, AlertCircle, CheckCircle, Info
} from 'lucide-react';
import { useMergerControl } from '../../../../context/MergerControlContext';

// Sample data for top panels
const sampleAnalysisData = {
  filingRequirements: {
    mandatoryFilings: 2,
    additionalAnalysis: 1
  },
  keyRisks: [
    "Market Share > 30% in EU"
  ],
  timeline: "4-6 months"
};

// Sample data for jurisdictional analysis
const jurisdictionAnalyses = {
  "United States (HSR)": {
    status: "Filing Required",
    thresholds: [
      {
        name: "Size of Transaction",
        value: "$8.5B (Threshold: $111.4M)",
        met: true
      },
      {
        name: "Size of Person",
        value: "Both parties exceed thresholds",
        met: true
      }
    ],
    notes: "Early termination unlikely due to market overlap in key sectors"
  },
  "European Union": {
    status: "Filing Required",
    thresholds: [
      {
        name: "Combined Worldwide Turnover",
        value: "€53.7B (Threshold: €5B)",
        met: true
      },
      {
        name: "EU-wide Turnover",
        value: "Both exceed €250M threshold",
        met: true
      }
    ],
    notes: "Phase I review likely; vertical relationships require detailed analysis"
  },
  "Germany": {
    status: "Further Analysis Needed",
    thresholds: [
      {
        name: "Combined Worldwide Turnover",
        value: "€53.7B (Threshold: €500M)",
        met: true
      },
      {
        name: "Domestic Turnover",
        value: "Analysis of local nexus ongoing",
        met: false
      }
    ],
    notes: "Additional data needed on German market specifics"
  }
};

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
  
  if (numericValue >= 1000) {
    return numericValue.toLocaleString();
  }
  return numericValue.toString();
};

// DataPanel component with structure handling
const DataPanel = ({ title, icon, companyData, isTargetCompany = false }) => {
  // Function to get metrics based on data structure
  const getMetrics = () => {
    if (isTargetCompany) {
      return {
        "Financial Metrics": {
          "Global Revenue": formatCurrency(companyData?.global_metrics?.global_revenue?.numeric),
          "US Revenue": formatCurrency(companyData?.regional_blocks?.united_states?.block_metrics?.revenue),
          "EU Revenue": formatCurrency(companyData?.regional_blocks?.european_union?.block_metrics?.revenue, 'EUR'),
          "UK Revenue": formatCurrency(companyData?.regional_blocks?.united_kingdom?.block_metrics?.revenue, 'GBP')
        },
        "Asset Information": {
          "Global Assets": formatCurrency(companyData?.global_metrics?.size_of_person?.total_assets?.numeric),
          "US Assets": formatCurrency(companyData?.regional_blocks?.united_states?.block_metrics?.assets),
          "EU Assets": formatCurrency(companyData?.regional_blocks?.european_union?.block_metrics?.assets, 'EUR')
        },
        "Employment": {
          "Global Employees": formatNumber(companyData?.global_metrics?.global_employees),
          "US Employees": formatNumber(companyData?.regional_blocks?.united_states?.block_metrics?.employees),
          "EU Employees": formatNumber(companyData?.regional_blocks?.european_union?.block_metrics?.employees)
        }
      };
    }

    return {
      "Financial Metrics": {
        "Global Revenue": formatCurrency(companyData?.revenue?.numeric?.global),
        "US Revenue": formatCurrency(companyData?.revenue?.numeric?.us),
        "EU Revenue": formatCurrency(companyData?.revenue?.numeric?.eu, 'EUR'),
        "UK Revenue": formatCurrency(companyData?.jurisdictional_presence?.countries?.uk?.revenue, 'GBP')
      },
      "Asset Information": {
        "Global Assets": formatCurrency(companyData?.assets?.numeric?.global),
        "US Assets": formatCurrency(companyData?.assets?.numeric?.us),
        "EU Assets": formatCurrency(companyData?.assets?.numeric?.eu, 'EUR')
      },
      "Employment": {
        "Global Employees": formatNumber(companyData?.employees?.global),
        "US Employees": formatNumber(companyData?.employees?.us),
        "EU Employees": formatNumber(companyData?.employees?.eu)
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

// JurisdictionAnalysis component
const JurisdictionAnalysis = ({ jurisdiction, analysis }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow">
      <button 
        className="w-full p-4 flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <div className={`mr-3 ${
            analysis.status === 'Filing Required' ? 'text-red-500' :
            analysis.status === 'Further Analysis Needed' ? 'text-orange-500' :
            'text-green-500'
          }`}>
            {analysis.status === 'Filing Required' ? <AlertCircle /> :
             analysis.status === 'Further Analysis Needed' ? <AlertTriangle /> :
             <CheckCircle />}
          </div>
          <div>
            <h4 className="font-semibold text-royal-blue">{jurisdiction}</h4>
            <span className="text-sm text-teal">{analysis.status}</span>
          </div>
        </div>
        {isExpanded ? <ChevronUp /> : <ChevronDown />}
      </button>
      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="space-y-3">
            {analysis.thresholds.map((threshold, index) => (
              <div key={index} className="flex items-start">
                <div className={`mt-1 mr-2 ${
                  threshold.met ? 'text-red-500' : 'text-green-500'
                }`}>
                  {threshold.met ? <AlertCircle className="w-4 h-4" /> : 
                                 <CheckCircle className="w-4 h-4" />}
                </div>
                <div>
                  <div className="text-sm font-medium">{threshold.name}</div>
                  <div className="text-sm text-gray-600">{threshold.value}</div>
                </div>
              </div>
            ))}
            {analysis.notes && (
              <div className="mt-2 text-sm text-gray-600 bg-light-ivory p-3 rounded">
                <div className="flex items-center mb-1">
                  <Info className="w-4 h-4 mr-1" />
                  <span className="font-medium">Additional Considerations</span>
                </div>
                {analysis.notes}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper to combine company metrics
const combineMetrics = (buyingCompany, targetCompany) => {
  const buying = {
    global_revenue: buyingCompany?.revenue?.numeric?.global || 0,
    us_revenue: buyingCompany?.revenue?.numeric?.us || 0,
    eu_revenue: buyingCompany?.revenue?.numeric?.eu || 0,
    global_assets: buyingCompany?.assets?.numeric?.global || 0,
    us_assets: buyingCompany?.assets?.numeric?.us || 0,
    eu_assets: buyingCompany?.assets?.numeric?.eu || 0,
    global_employees: buyingCompany?.employees?.global || 0,
    us_employees: buyingCompany?.employees?.us || 0,
    eu_employees: buyingCompany?.employees?.eu || 0
  };

  const target = {
    global_revenue: targetCompany?.global_metrics?.global_revenue?.numeric || 0,
    us_revenue: targetCompany?.regional_blocks?.united_states?.block_metrics?.revenue || 0,
    eu_revenue: targetCompany?.regional_blocks?.european_union?.block_metrics?.revenue || 0,
    global_assets: targetCompany?.global_metrics?.size_of_person?.total_assets?.numeric || 0,
    us_assets: targetCompany?.regional_blocks?.united_states?.block_metrics?.assets || 0,
    eu_assets: targetCompany?.regional_blocks?.european_union?.block_metrics?.assets || 0,
    global_employees: targetCompany?.global_metrics?.global_employees || 0,
    us_employees: targetCompany?.regional_blocks?.united_states?.block_metrics?.employees || 0,
    eu_employees: targetCompany?.regional_blocks?.european_union?.block_metrics?.employees || 0
  };

  return {
    revenue: {
      numeric: {
        global: buying.global_revenue + target.global_revenue,
        us: buying.us_revenue + target.us_revenue,
        eu: buying.eu_revenue + target.eu_revenue
      }
    },
    assets: {
      numeric: {
        global: buying.global_assets + target.global_assets,
        us: buying.us_assets + target.us_assets,
        eu: buying.eu_assets + target.eu_assets
      }
    },
    employees: {
      global: buying.global_employees + target.global_employees,
      us: buying.us_employees + target.us_employees,
      eu: buying.eu_employees + target.eu_employees
    }
  };
};

const TransactionAnalysis = () => {
  const { 
    transactionTargetCompany,
    buyingCompanyData,
    transactionBuyingCompany,
    analysisResults,
    dealCard,
    isLoading,
    loadRunData,
    performAnalysis,
    activeRun,
    projectId
  } = useMergerControl();


  // Add effect to check data on mount
  useEffect(() => {
    console.log('Data Check:', {
      buyingCompanyData: buyingCompanyData,
      activeRun: activeRun,
      buyingStructure: buyingCompanyData ? Object.keys(buyingCompanyData) : 'No buying data',
      targetData: activeRun?.targetCompanyData ? 
        Object.keys(activeRun.targetCompanyData) : 'No target data'
    });
  }, [buyingCompanyData, activeRun]);

  // More protective check before rendering
  if (!activeRun?.targetCompanyData || !buyingCompanyData) {
    return (
      <div className="p-6 bg-ivory min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">
            Loading analysis data... 
            {!activeRun?.targetCompanyData && ' (Missing target data)'}
            {!buyingCompanyData && ' (Missing buying company data)'}
          </div>
        </div>
      </div>
    );
  }

  const targetCompanyData = activeRun.targetCompanyData?.modified || 
                          activeRun.targetCompanyData?.original;

  
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
                <span>{sampleAnalysisData.filingRequirements.mandatoryFilings} Mandatory Filings</span>
              </div>
              <div className="flex items-center text-orange-500">
                <AlertTriangle className="w-4 h-4 mr-2" />
                <span>{sampleAnalysisData.filingRequirements.additionalAnalysis} Additional Analysis</span>
              </div>
            </div>
          </div>
          <div className="bg-light-ivory p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Key Risks</h3>
            <div className="space-y-2">
              {sampleAnalysisData.keyRisks.map((risk, index) => (
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
                <span>{sampleAnalysisData.timeline} expected</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Jurisdiction Analysis */}
      <div className="space-y-4 mb-6">
        {Object.entries(jurisdictionAnalyses).map(([jurisdiction, analysis]) => (
          <JurisdictionAnalysis 
            key={jurisdiction} 
            jurisdiction={jurisdiction} 
            analysis={analysis} 
          />
        ))}
      </div>

      {/* Company Analysis Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DataPanel 
          title="Acquiring Company" 
          icon={<Building2 className="text-royal-blue w-6 h-6" />} 
          companyData={buyingCompanyData}
          isTargetCompany={false}
        />
        <DataPanel 
          title="Target Company" 
          icon={<Flag className="text-royal-blue w-6 h-6" />} 
          companyData={targetCompanyData}
          isTargetCompany={true}
        />
        <DataPanel 
          title="Combined Entity" 
          icon={<PieChart className="text-royal-blue w-6 h-6" />} 
          companyData={combineMetrics(buyingCompanyData, targetCompanyData)}
          isTargetCompany={false}
        />
      </div>
    </div>
  );
};

export default TransactionAnalysis;
