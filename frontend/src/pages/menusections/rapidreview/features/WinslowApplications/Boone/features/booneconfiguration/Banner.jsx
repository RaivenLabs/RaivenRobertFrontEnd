// src/components/platform/BooneConfiguration/Banner.jsx
import React from 'react';
import { Settings, Link, MessageSquare, LayoutTemplate, Briefcase, GitBranch, HelpCircle, Database } from 'lucide-react';
import Tooltip from '../shared/Tooltip';

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
      icon: Database,
      tooltip: 'Set up supporting RAGs'
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
      label: 'Model Dashboard Package',
      icon: GitBranch,
      tooltip: 'Set up extraction and processing pipeline'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-6">
      {/* Header content */}
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
      
      {/* Navigation section */}
      <div className="w-full">
        <div className="flex justify-between">
          {configSections.map((section) => {
            const SectionIcon = section.icon;
            const isActive = section.id === activeSection;
            
            return (
              <Tooltip key={section.id} content={section.tooltip}>
                <button
                  onClick={() => setActiveSection(section.id)}
                  className={`flex flex-col items-center transition-colors duration-300
                    ${isActive ? 'text-royalBlue' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    ${isActive 
                      ? 'bg-royalBlue text-white' 
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}
                    transition-colors duration-300
                  `}>
                    <SectionIcon className="w-5 h-5" />
                  </div>
                  <span className={`text-sm mt-2 font-medium ${isActive ? 'text-royalBlue' : ''}`}>
                    {section.label}
                  </span>
                </button>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Banner;
