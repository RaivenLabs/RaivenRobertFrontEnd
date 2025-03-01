// src/components/platform/BooneConfiguration/sections/RAGConfigPanel.jsx
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
  


// API Configuration Panel
const APIConfigPanel = ({ section }) => {
    const { customerId, hasCustomerAccess } = useConfig();
  
    const apiSections = {
      incoming: {
        title: "Incoming API Configuration",
        icon: <UploadCloud className="w-6 h-6 text-royalBlue mr-3" />,
        controls: [
          { label: "REST API Endpoints", icon: Link },
          { label: "SOAP Service Configuration", icon: Code },
          { label: "Webhook Setup", icon: Zap },
          { label: "API Authentication", icon: Shield },
          { label: "Rate Limiting", icon: Filter }
        ]
      },
      outgoing: {
        title: "Payload API Configuration",
        icon: <Download className="w-6 h-6 text-royalBlue mr-3" />,
        controls: [
          { label: "Customer API Connections", icon: Link },
          { label: "Payload Formatting", icon: Code },
          { label: "Response Handling", icon: MessageSquare },
          { label: "Error Management", icon: AlertCircle },
          { label: "Authentication Keys", icon: Key }
        ]
      }
    };
  
    const selectedSection = apiSections[section] || apiSections.incoming;
  
    // Check if user has access to these controls
    const canAccessControls = (
      hasCustomerAccess(customerId) || customerId === 'HAWKEYE'
    );
  
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-4">
          {selectedSection.icon}
          <h3 className="text-xl font-semibold">{selectedSection.title}</h3>
        </div>
        <div className="space-y-3">
          {selectedSection.controls.map((control, index) => (
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


  export default APIConfigPanel;
  