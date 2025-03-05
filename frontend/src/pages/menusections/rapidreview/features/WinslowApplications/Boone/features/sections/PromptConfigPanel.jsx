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


// Prompt Configuration Panel
const PromptConfigPanel = () => {
  const { customerId, hasCustomerAccess } = useConfig();
  const [selectedPackage, setSelectedPackage] = useState('asbestos');

  // Check if user has access to these controls
  const canAccessControls = (
    hasCustomerAccess(customerId) || customerId === 'HAWKEYE'
  );

  const promptPackages = [
    { id: 'asbestos', name: 'Asbestos Claims Package' },
    { id: 'product-liability', name: 'Product Liability Package' },
    { id: 'gdpr', name: 'GDPR Compliance Package' },
    { id: 'saas', name: 'SaaS Agreements Package' },
    { id: 'real-estate', name: 'Real Estate Package' }
  ];

  const promptControls = [
    { label: "Edit Prompt Templates", icon: PenTool },
    { label: "Load Prompt Package", icon: UploadCloud },
    { label: "Test Prompts", icon: Zap },
    { label: "Configure RAG Settings", icon: Database },
    { label: "Manage Domain Knowledge", icon: Book }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center mb-4">
        <MessageSquare className="w-6 h-6 text-royalBlue mr-3" />
        <h3 className="text-xl font-semibold">Configure Prompt Packages</h3>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Prompt Package
        </label>
        <div className="space-y-2">
          {promptPackages.map(pkg => (
            <label 
              key={pkg.id} 
              className={`flex items-center p-3 rounded-md cursor-pointer ${
                !canAccessControls 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : selectedPackage === pkg.id
                  ? 'bg-blue-50 border border-royalBlue'
                  : 'bg-lightGray hover:bg-gray-200'
              }`}
            >
              <input
                type="radio"
                name="promptPackage"
                value={pkg.id}
                checked={selectedPackage === pkg.id}
                onChange={() => setSelectedPackage(pkg.id)}
                disabled={!canAccessControls}
                className="mr-3"
              />
              {pkg.name}
            </label>
          ))}
        </div>
      </div>
      
      <div className="space-y-3">
        {promptControls.map((control, index) => (
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


  export default PromptConfigPanel;
