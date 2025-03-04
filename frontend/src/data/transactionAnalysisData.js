// transactionAnalysisData.js

export const sampleProjects = {
  "project-hopper": {
    projectName: "Project Hopper",
    lastUpdated: "2025-01-19",
    status: "In Progress",
    analysisData: {
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
    },
    jurisdictionAnalyses: {
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
    }
  },
  "project-bluewing": {
    projectName: "Project Bluewing",
    lastUpdated: "2025-01-18",
    status: "In Progress",
    analysisData: {
      // Similar structure but with Bluewing-specific data
      // We can populate this with real data from your MergerControlContext
    }
  }
};

// Helper functions for working with the data
export const getProjectList = () => {
  return Object.entries(sampleProjects).map(([id, data]) => ({
    id,
    name: data.projectName,
    lastUpdated: data.lastUpdated,
    status: data.status
  }));
};

export const getProjectAnalysis = (projectId) => {
  return sampleProjects[projectId] || null;
};

// Function to transform MergerControlContext data into analysis format
export const transformContextToAnalysis = (mergerControlData) => {
  // This will be implemented to transform your context data
  // into the format expected by the TransactionAnalysis component
  return {
    analysisData: {
      // Transform logic here
    },
    jurisdictionAnalyses: {
      // Transform logic here
    }
  };
};
