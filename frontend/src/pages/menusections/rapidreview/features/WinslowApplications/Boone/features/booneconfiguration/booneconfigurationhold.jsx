// src/components/platform/BooneConfiguration/index.jsx
import React, { useState } from 'react';
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

import ActionPanel from './ActionPanel';
import Banner from './Banner';
import Tooltip from '../shared/Tooltip';
import StatusCard from './StatusCard';
import APIConfigPanel from '../sections/APIConfigPanel';
import RAGConfigPanel from '../sections/RAGConfigPanel';
import PromptConfigPanel from '../sections/PromptConfigPanel';
import ETLWorkflowPanel from '../sections/ETLWorkflowPanel';
import DataSchemaPanel from '../sections/DataSchemaPanel';
import ProjectConfigPanel from '../sections/ProjectConfigPanel';
import Modal from '../modals/modal';

// Main Configuration Component
const BooneConfiguration = () => {
  const [activeSection, setActiveSection] = useState('api');
  const { hasCustomerAccess } = useConfig();
  
  // Keep the custom Clock icon
  const ClockIcon = ({ className }) => {
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>;
  };

  // Action Button Component (we'll move this to a separate file later)
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

          {activeSection === 'rag' && (
            <>
              <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StatusCard 
                  title="RAG Status"
                  status="active"
                  description="Vector database is properly connected"
                  icon={Database}
                />
                <StatusCard 
                  title="Document Collection"
                  status="active"
                  description="25 domain documents loaded and indexed"
                  icon={FileText}
                />
              </div>
              <RAGConfigPanel />
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
                  icon={ClockIcon}
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
              : activeSection === 'rag'
              ? 'Set up and manage Retrieval-Augmented Generation for documents'
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
