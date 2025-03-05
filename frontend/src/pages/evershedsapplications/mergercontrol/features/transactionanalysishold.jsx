import React, { useState } from 'react';
import { 
  // eslint-disable-next-line no-unused-vars
  Building2, Globe, Scale, AlertTriangle, Clipboard,
  // eslint-disable-next-line no-unused-vars
  DollarSign, Users, PieChart, Flag, ChevronDown, Clock,
  ChevronUp, AlertCircle, CheckCircle, Info
} from 'lucide-react';

const DataPanel = ({ title, icon, data }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center mb-4">
      {icon}
      <h3 className="text-xl font-semibold text-royal-blue ml-2">{title}</h3>
    </div>
    <div className="space-y-4">
      {Object.entries(data).map(([category, items]) => (
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

const TransactionAnalysis = () => {
  const analysisData = {
    acquirer: {
      "Financial Metrics": {
        "Global Turnover": "$45.2B",
        "US Revenue": "$12.5B",
        "EU Turnover": "€15.3B",
        "German Revenue": "€3.2B"
      },
      "Asset Information": {
        "Global Assets": "$38.7B",
        "US Assets": "$14.2B"
      },
      "Employment": {
        "Global Headcount": "52,000",
        "German Employees": "5,200"
      }
    },
    target: {
      "Financial Metrics": {
        "Global Turnover": "$8.5B",
        "US Revenue": "$2.8B",
        "EU Turnover": "€2.1B",
        "German Revenue": "€0.8B"
      },
      "Asset Information": {
        "Global Assets": "$6.2B",
        "US Assets": "$2.1B"
      },
      "Employment": {
        "Global Headcount": "12,000",
        "German Employees": "1,800"
      }
    },
    combined: {
      "Combined Metrics": {
        "Global Turnover": "$53.7B",
        "US Revenue": "$15.3B",
        "EU Turnover": "€17.4B",
        "German Revenue": "€4.0B"
      },
      "Market Information": {
        "Key Overlap Markets": "3 Markets",
        "Highest Share": "32% (EU)",
        "HHI Delta": "+150 points"
      }
    }
  };

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
                <span>2 Mandatory Filings</span>
              </div>
              <div className="flex items-center text-orange-500">
                <AlertTriangle className="w-4 h-4 mr-2" />
                <span>1 Additional Analysis</span>
              </div>
            </div>
          </div>
          <div className="bg-light-ivory p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Key Risks</h3>
            <div className="space-y-2">
              <div className="flex items-center text-orange-500">
                <AlertTriangle className="w-4 h-4 mr-2" />
                <span>Market Share &gt; 30% in EU</span>
              </div>
            </div>
          </div>
          <div className="bg-light-ivory p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Timeline Estimate</h3>
            <div className="space-y-2">
              <div className="flex items-center text-royal-blue">
                <Clock className="w-4 h-4 mr-2" />
                <span>4-6 months expected</span>
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

      {/* Company Data Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DataPanel 
          title="Our Company" 
          icon={<Building2 className="text-royal-blue w-6 h-6" />} 
          data={analysisData.acquirer} 
        />
        <DataPanel 
          title="Target Company" 
          icon={<Flag className="text-royal-blue w-6 h-6" />} 
          data={analysisData.target} 
        />
        <DataPanel 
          title="Combined Entity" 
          icon={<PieChart className="text-royal-blue w-6 h-6" />} 
          data={analysisData.combined} 
        />
      </div>
    </div>
  );
};

export default TransactionAnalysis;
