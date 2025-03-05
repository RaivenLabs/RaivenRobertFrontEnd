import React, { useState } from 'react';
import { useConfig } from '../../../../../../../../context/ConfigContext';
import { 
    Settings, Shield, Database,  Globe, Building2, Server, Download,
    FileText, AlertCircle, Cloud, Clock, Package, Link, Users,
    Briefcase, Scale, Building, Rocket, Gavel, MessageSquare,
    Key, Warehouse, GitBranch, Book, X, UploadCloud,
    Code, TabletSmartphone, Zap, HardDrive, Braces, PenTool,
    LayoutTemplate, Workflow, Filter, ChevronsRight, Boxes, FolderGit2,
    HelpCircle, ArrowRight, CheckCircle
  } from 'lucide-react';


// ETL Workflow Panel

const ETLWorkflowPanel = () => {
  const { customerId, hasCustomerAccess } = useConfig();

  // Check if user has access to these controls
  const canAccessControls = (
    hasCustomerAccess(customerId) || customerId === 'HAWKEYE'
  );

  const workflowControls = [
    { label: "Configure Document Processing", icon: FileText },
    { label: "Set Up Extraction Pipeline", icon: Workflow },
    { label: "Data Transformation Rules", icon: Filter },
    { label: "Validation Steps", icon: Shield },
    { label: "Configure Load Operations", icon: HardDrive },
    { label: "Schedule ETL Jobs", icon: Clock }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center mb-4">
        <GitBranch className="w-6 h-6 text-royalBlue mr-3" />
        <h3 className="text-xl font-semibold">ETL Workflow Configuration</h3>
      </div>
      
      <div className="space-y-3">
        {workflowControls.map((control, index) => (
          <button
            key={index}
            disabled={!canAccessControls}
            className={`w-full p-3 ${
              canAccessControls 
                ? 'bg-lightGray hover:bg-gray-200' 
                : 'bg-gray-100 cursor-not-allowed'
            } rounded-md text-left flex items-center justify-between group transition-colors duration-200`}
          >
            <span className={!canAccessControls ? 'text-gray-400' : ''}>
              {control.label}
            </span>
            {control.icon && (
              <control.icon className={`w-4 h-4 ${
                canAccessControls 
                  ? 'text-gray-500 group-hover:text-royalBlue' 
                  : 'text-gray-400'
              }`} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};


  export default ETLWorkflowPanel;
