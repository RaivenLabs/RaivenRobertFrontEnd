// src/components/platform/BooneConfiguration.jsx
import React, { useState, useMemo, useEffect } from 'react';
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

// Import tooltip component (placeholder - adjust path to your actual Tooltip component)
const Tooltip = ({ children, content }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <div className="relative inline-block" 
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}>
      {children}
      {showTooltip && (
        <div className="absolute z-10 px-3 py-2 text-sm text-white bg-gray-900 rounded-md shadow-lg -top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          {content}
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45 bg-gray-900"></div>
        </div>
      )}
    </div>
  );
};

// Banner Component with Process Bar
const Banner = ({ activeSection, setActiveSection }) => {
  const configSections = [
    {
      id: 'api',
      label: 'API Configuration',
      icon: Link,
      tooltip: 'Configure incoming and outgoing APIs'
    },

    {
        id: 'rag',
        label: 'RAG Configuration',
        icon: GitBranch,
        tooltip: 'Set up supporitng RAGs'
      },
    {
      id: 'prompts',
      label: 'Prompt Packages',
      icon: MessageSquare,
      tooltip: 'Manage prompt templates and RAG settings'
    },
    {
      id: 'schema',
      label: 'Data Schema',
      icon: LayoutTemplate,
      tooltip: 'Define data schemas and field mappings'
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: Briefcase,
      tooltip: 'Configure project settings and teams'
    },
    {
      id: 'etl',
      label: 'ETL Workflow',
      icon: GitBranch,
      tooltip: 'Set up extraction and processing pipeline'
    }
  ];

  const currentIndex = configSections.findIndex(section => section.id === activeSection);
  const progress = ((currentIndex + 1) / configSections.length) * 100;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-8 h-8 text-royalBlue" />
        <h1 className="text-2xl font-bold text-gray-800">
          Boone Configuration Center
        </h1>
        <div className="ml-auto">
          <Tooltip content="Need help getting started? Click here for guidance">
            <HelpCircle className="w-6 h-6 text-gray-400 cursor-help" />
          </Tooltip>
        </div>
      </div>
      
      <p className="text-gray-600 mb-8">
        Welcome to the Boone Configuration Center! Configure ETL settings, prompt packages, 
        and data schemas to extract information from your documents.
      </p>

      <div className="w-full space-y-4">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-royalBlue to-blue-300 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between">
          {configSections.map((section, index) => {
            const SectionIcon = section.icon;
            const isActive = section.id === activeSection;
            
            return (
              <Tooltip key={section.id} content={section.tooltip}>
                <button 
                  onClick={() => setActiveSection(section.id)}
                  className={`flex flex-col items-center transition-colors duration-300
                    ${isActive ? 'text-royalBlue' : 'text-gray-400'}`}
                >
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${isActive ? 'bg-royalBlue/10' : 'bg-gray-100'}
                    transition-colors duration-300
                  `}>
                    <SectionIcon className="w-5 h-5" />
                  </div>
                  <span className="text-sm mt-2">{section.label}</span>
                </button>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Modal Component
const Modal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative bg-white rounded-lg w-full max-w-md m-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
        {children}
      </div>
    </div>
  );
};

// Status Card Component
const StatusCard = ({ title, status, description, icon: Icon }) => {
  const statusColors = {
    active: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    inactive: "bg-gray-100 text-gray-800",
    error: "bg-red-100 text-red-800"
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center mb-2">
        <Icon className="w-6 h-6 text-royalBlue mr-3" />
        <h3 className="text-xl font-semibold">{title}</h3>
        <span className={`ml-auto px-2 py-1 text-xs rounded-full ${statusColors[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

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

// Data Schema Panel
const DataSchemaPanel = () => {
  const { customerId, hasCustomerAccess } = useConfig();

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
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center mb-4">
        <LayoutTemplate className="w-6 h-6 text-royalBlue mr-3" />
        <h3 className="text-xl font-semibold">Build Data Schema</h3>
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
    </div>
  );
};

// Project Configuration Panel
const ProjectConfigPanel = () => {
  const { customerId, hasCustomerAccess } = useConfig();

  // Check if user has access to these controls
  const canAccessControls = (
    hasCustomerAccess(customerId) || customerId === 'HAWKEYE'
  );

  const [projects, setProjects] = useState([
    { id: 'sequoia-artemis', name: 'Project Sequoia (Artemis Acquisition)', active: true },
    { id: 'phoenix-claims', name: 'Phoenix Claims Processing', active: false },
    { id: 'evergreen-contracts', name: 'Evergreen Contract Analysis', active: false }
  ]);

  const projectControls = [
    { label: "Create New Project", icon: FolderGit2 },
    { label: "Configure Project Settings", icon: Settings },
    { label: "Manage Team Access", icon: Users },
    { label: "Set Project Deliverables", icon: Boxes },
    { label: "Configure Workflow", icon: Workflow }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center mb-4">
        <Briefcase className="w-6 h-6 text-royalBlue mr-3" />
        <h3 className="text-xl font-semibold">Project Configuration</h3>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Active Projects
        </label>
        <div className="space-y-2">
          {projects.map(project => (
            <div 
              key={project.id} 
              className={`flex items-center justify-between p-3 rounded-md ${
                !canAccessControls 
                  ? 'bg-gray-100 text-gray-400' 
                  : project.active
                  ? 'bg-blue-50 border border-royalBlue'
                  : 'bg-lightGray'
              }`}
            >
              <span>{project.name}</span>
              <div className="flex space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  project.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {project.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-3">
        {projectControls.map((control, index) => (
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

// Main Configuration Component
const BooneConfiguration = () => {
  const [activeSection, setActiveSection] = useState('api');
  const { hasCustomerAccess } = useConfig();
  
  // Clock icon definition
  const Clock = ({ className }) => {
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>;
  };

  // Check if user has access to controls - simplify to always allow
  const canAccessControls = true;

  // Action Button Component
  const ActionButton = ({ onClick, label, icon: Icon, disabled = false }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2
        ${!disabled 
          ? 'bg-royalBlue text-white hover:bg-royalBlue/90' 
          : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
    >
      {label}
      <Icon className="w-5 h-5" />
    </button>
  );

  return (
    <div className="min-h-screen bg-ivory p-6 space-y-6">
      <Banner activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <div className="max-w-7xl mx-auto">        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activeSection === 'api' && (
            <>
              <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StatusCard 
                  title="API Status"
                  status="active"
                  description="All API connections are functioning correctly"
                  icon={Link}
                />
                <StatusCard 
                  title="Textract Connection"
                  status="active"
                  description="Amazon Textract is properly configured"
                  icon={Cloud}
                />
              </div>
              <APIConfigPanel section="incoming" />
              <APIConfigPanel section="outgoing" />
            </>
          )}

          {activeSection === 'prompts' && (
            <>
              <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StatusCard 
                  title="Prompt Package Status"
                  status="active"
                  description="Asbestos Claims package is currently loaded"
                  icon={MessageSquare}
                />
                <StatusCard 
                  title="RAG System"
                  status="active"
                  description="Domain knowledge base with 25 documents is ready"
                  icon={Database}
                />
              </div>
              <PromptConfigPanel />
            </>
          )}

          {activeSection === 'schema' && (
            <>
              <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StatusCard 
                  title="Schema Status"
                  status="pending"
                  description="Data schema definition is in progress"
                  icon={LayoutTemplate}
                />
                <StatusCard 
                  title="Field Mappings"
                  status="pending"
                  description="75 fields ready to be mapped to extraction prompts"
                  icon={Database}
                />
              </div>
              <DataSchemaPanel />
            </>
          )}

          {activeSection === 'projects' && (
            <>
              <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StatusCard 
                  title="Active Project"
                  status="active"
                  description="Project Sequoia (Artemis Acquisition) is in progress"
                  icon={Briefcase}
                />
                <StatusCard 
                  title="Team Access"
                  status="pending"
                  description="3 team members need to confirm access"
                  icon={Users}
                />
              </div>
              <ProjectConfigPanel />
            </>
          )}

          {activeSection === 'etl' && (
            <>
              <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StatusCard 
                  title="ETL Pipeline"
                  status="active"
                  description="Document processing pipeline is operational"
                  icon={GitBranch}
                />
                <StatusCard 
                  title="Scheduled Jobs"
                  status="pending"
                  description="2 ETL jobs waiting to be scheduled"
                  icon={Clock}
                />
              </div>
              <ETLWorkflowPanel />
            </>
          )}
        </div>
      </div>

      {/* Action Panel */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            {activeSection === 'api' 
              ? 'Configure API endpoints and authentication settings'
              : activeSection === 'prompts'
              ? 'Select and configure prompt packages for extraction'
              : activeSection === 'schema'
              ? 'Define data schema for extracted information'
              : activeSection === 'projects'
              ? 'Manage project settings and team access'
              : 'Configure document processing and ETL workflow'}
          </p>
          
          <div className="flex space-x-4">
            <ActionButton 
              onClick={() => console.log('Save changes')} 
              label="Save Changes" 
              icon={CheckCircle} 
            />
            <ActionButton 
              onClick={() => console.log('Continue to next section')} 
              label="Continue" 
              icon={ArrowRight} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BooneConfiguration;
