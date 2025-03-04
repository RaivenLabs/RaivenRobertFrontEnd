// src/components/platform/BooneConfiguration/Banner.jsx
import React from 'react';
import { Settings, Link, MessageSquare, LayoutTemplate, Briefcase, GitBranch, HelpCircle, Database } from 'lucide-react';
import Tooltip from '../../../../../../../../components/shared/Tooltip/Tooltip';

const Banner = ({ activeSection, setActiveSection }) => {
  const configSections = [
    {
      id: 'halsey',
      label: 'Halsey Group',
      icon: Link,
      tooltip: 'Application Prototypes for Halsey'
    },
    {
      id: 'nimitz',
      label: 'Nimitz Group',
      icon: Database,
      tooltip: 'Application Prototypes for Nimitz'
    },
    {
      id: 'jackson',
      label: 'Jackson Group',
      icon: MessageSquare,
      tooltip: 'Application Prototypes for Jackaon'
    },
    {
      id: 'atticus',
      label: 'Atticus Group',
      icon: LayoutTemplate,
      tooltip: 'Application Prototypes for Atticus'
    },
    {
      id: 'barrister',
      label: 'Barrister Group',
      icon: Briefcase,
      tooltip: 'Application Prototypes for Barrister'
    },
    {
      id: 'highland',
      label: 'Highland Group',
      icon: GitBranch,
      tooltip: 'Application Prototypes for Highland'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-6">
      {/* Header content */}
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-8 h-8 text-royalBlue" />
        <h1 className="text-2xl font-bold text-gray-800">
          Protoype Application Center
        </h1>
        <div className="ml-auto">
          <Tooltip content="Need help getting started? Click here for guidance">
            <HelpCircle className="w-6 h-6 text-gray-400 cursor-help" />
          </Tooltip>
        </div>
      </div>
      
      <p className="text-gray-600 mb-8">
        Welcome to the Prototype Application Center! This space provides you with an opporutntiy to explore, test and advance your prototype applciation suite.
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
