// src/components/platform/BooneConfiguration/SchemaConfigPanel.jsx
import React from 'react';
import { 
  LayoutTemplate, 
  Briefcase, 
  Tag
} from 'lucide-react';

const OpeningDashboardPanel = ({ projectType = "M&A Due Diligence" }) => {
  // Define configuration groups based on project type
  const getConfigGroups = () => {
    switch(projectType) {
      case "M&A Due Diligence":
        return [
          { name: "IP", count: 12, status: "complete" },
          { name: "IT", count: 18, status: "complete" },
          { name: "Supply Chain", count: 15, status: "pending" },
          { name: "Financial", count: 22, status: "complete" },
          { name: "HR", count: 10, status: "pending" }
        ];
      case "Toxic Tort Litigation":
        return [
          { name: "Plaintiff Information", count: 8, status: "complete" },
          { name: "Defendant Information", count: 8, status: "complete" },
          { name: "Court Information", count: 5, status: "complete" },
          { name: "Evidence", count: 14, status: "pending" },
          { name: "Medical Records", count: 20, status: "pending" }
        ];
      case "Sourcing":
        return [
          { name: "Vendor Details", count: 15, status: "complete" },
          { name: "Deal Terms", count: 12, status: "pending" },
          { name: "Regulatory Compliance", count: 8, status: "pending" },
          { name: "Pricing Structure", count: 10, status: "complete" },
          { name: "Service Levels", count: 7, status: "pending" }
        ];
      default:
        return [
          { name: "General", count: 10, status: "pending" },
          { name: "Custom", count: 5, status: "pending" }
        ];
    }
  };

  const configGroups = getConfigGroups();
  
  // Example project details
  const projectDetails = {
    name: "Avignon Acquisition",
    client: "TechCorp Industries",
    type: projectType,
    fieldsTotal: 75,
    fieldsMapped: 42,
    extractionAccuracy: "87%",
    lastUpdated: "2025-02-25"
  };

  const renderStatusBadge = (status) => {
    if (status === "complete") {
      return (
        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 flex items-center">
          ✓ Complete
        </span>
      );
    }
    return (
      <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800 flex items-center">
        ⚠ Pending
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6 w-full max-w-full">
      <div className="flex items-center gap-2 p-4 border-b border-gray-100">
        <LayoutTemplate className="w-5 h-5 text-royalBlue" />
        <h2 className="text-lg font-semibold text-gray-800">
          Current Configuration
        </h2>
      </div>
      
      <div className="flex divide-x divide-gray-200">
        {/* Project Details Section */}
        <div className="p-4 flex-1">
          <div className="flex items-center gap-1 mb-3">
            <Briefcase className="w-4 h-4 text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-700">Project Details</h3>
          </div>
          
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-1 text-sm">
              <span className="text-gray-600">Project Name:</span>
              <span className="font-medium">{projectDetails.name}</span>
            </div>
            <div className="grid grid-cols-2 gap-1 text-sm">
              <span className="text-gray-600">Client:</span>
              <span className="font-medium">{projectDetails.client}</span>
            </div>
            <div className="grid grid-cols-2 gap-1 text-sm">
              <span className="text-gray-600">Project Type:</span>
              <span className="font-medium">{projectDetails.type}</span>
            </div>
            <div className="grid grid-cols-2 gap-1 text-sm">
              <span className="text-gray-600">Last Updated:</span>
              <span className="font-medium">{projectDetails.lastUpdated}</span>
            </div>
          </div>
        </div>
        
        {/* Schema Mapping Section */}
        <div className="p-4 flex-1">
          <div className="flex items-center gap-1 mb-3">
            <LayoutTemplate className="w-4 h-4 text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-700">Schema Mapping</h3>
          </div>
          
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-1 text-sm">
              <span className="text-gray-600">Total Fields:</span>
              <span className="font-medium">{projectDetails.fieldsTotal}</span>
            </div>
            <div className="grid grid-cols-2 gap-1 text-sm">
              <span className="text-gray-600">Mapped Fields:</span>
              <span className="font-medium">{projectDetails.fieldsMapped}</span>
            </div>
            <div className="grid grid-cols-2 gap-1 text-sm">
              <span className="text-gray-600">Extraction Accuracy:</span>
              <span className="font-medium">{projectDetails.extractionAccuracy}</span>
            </div>
          </div>
        </div>
        
        {/* Field Groups Section */}
        <div className="p-4 flex-1">
          <div className="flex items-center gap-1 mb-3">
            <Tag className="w-4 h-4 text-gray-600" />
            <h3 className="text-sm font-semibold text-gray-700">Field Groups</h3>
          </div>
          
          <div className="space-y-2.5">
            {configGroups.map((group, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-gray-600">{group.name}:</span>
                  <span className="text-xs text-gray-500">{group.count} fields</span>
                </div>
                {renderStatusBadge(group.status)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpeningDashboardPanel;
