import React, { useState, useEffect } from 'react';
import { useConfig } from '../../../../../../../../context/ConfigContext';
import {
  Settings, Shield, Database, Globe, Building2, Server, 
  FileText, AlertCircle, Cloud, Clock, Package, Link, Users,
  Briefcase, Scale, Building, Rocket, Gavel, MessageSquare,
  Key, Warehouse, GitBranch, Book, X, UploadCloud, Download,
  Code, TabletSmartphone, Zap, HardDrive, Braces, PenTool,
  LayoutTemplate, Workflow, Filter, ChevronsRight, Boxes, FolderGit2,
  HelpCircle, ArrowRight, CheckCircle
} from 'lucide-react';

import SchemaGenerationWorkflow from './SchemaGenerationWorkflow';

// Data Schema Panel
const DataSchemaPanel = () => {
  const { customerId, hasCustomerAccess } = useConfig();
  const [activeTab, setActiveTab] = useState('workflow'); // 'workflow' or 'controls'
  
  // Check if user has access to these controls
  const canAccessControls = (
    hasCustomerAccess(customerId) || customerId === 'HAWKEYE'
  );
  
  const schemaControls = [
    { label: "Define Data Schema", icon: Braces },
    { label: "Import JSON Schema", icon: UploadCloud },
    { label: "Export Schema to PostgreSQL", icon: Database },
    { label: "Validate Schema", icon: Shield },
    { label: "Generate Sample Data", icon: FileText },
    { label: "Map Fields to Prompts", icon: ChevronsRight }
  ];
  
  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'workflow'
                ? 'text-royalBlue border-b-2 border-royalBlue'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('workflow')}
          >
            AI-Assisted Workflow
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'controls'
                ? 'text-royalBlue border-b-2 border-royalBlue'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('controls')}
          >
            Manual Controls
          </button>
        </div>
      </div>
      
      {/* Dynamic Content based on selected tab */}
      {activeTab === 'workflow' ? (
        <SchemaGenerationWorkflow />
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-4">
            <LayoutTemplate className="w-6 h-6 text-royalBlue mr-3" />
            <h3 className="text-xl font-semibold">Manual Schema Controls</h3>
          </div>
          
          <div className="space-y-3">
            {schemaControls.map((control, index) => (
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
          
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-500 mr-3 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-700">Manual Mode Notice</h4>
                <p className="text-sm text-yellow-600 mt-1">
                  We recommend using the AI-Assisted Workflow tab for most users.
                  Manual controls are intended for advanced users who need fine-grained
                  control over schema definition and validation.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataSchemaPanel;
