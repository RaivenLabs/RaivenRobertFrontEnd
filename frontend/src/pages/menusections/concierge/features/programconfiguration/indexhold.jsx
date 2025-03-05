import React, { useState } from 'react';
import {
  Boxes,
  FileText,
  Users,
  Settings,
  Database,
  Layout,
  Building2,
  Shield,
  ChevronRight,
  Files,
  BookOpen,
  Network,
  GitBranch
} from 'lucide-react';



const ProgramConfiguration = () => {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedSection, setSelectedSection] = useState('overview');
  
  const navigationSections = [
    {
      id: 'overview',
      label: 'Program Overview',
      icon: <Layout className="w-5 h-5" />
    },
    {
      id: 'agreements',
      label: 'Agreement Types',
      icon: <FileText className="w-5 h-5" />,
      subsections: [
        { id: 'saas', label: 'SaaS Agreements' },
        { id: 'services', label: 'Service Agreements' },
        { id: 'infrastructure', label: 'Infrastructure' }
      ]
    },
    {
      id: 'templates',
      label: 'Templates & Documents',
      icon: <Files className="w-5 h-5" />,
      subsections: [
        { id: 'master-agreements', label: 'Master Agreements' },
        { id: 'rate-cards', label: 'Rate Cards' },
        { id: 'order-forms', label: 'Order Forms' }
      ]
    },
    {
      id: 'team',
      label: 'Team Configuration',
      icon: <Users className="w-5 h-5" />,
      subsections: [
        { id: 'roles', label: 'Roles & Responsibilities' },
        { id: 'contacts', label: 'Contact Directory' },
        { id: 'approvers', label: 'Approval Matrix' }
      ]
    },
    {
      id: 'vendors',
      label: 'Vendor Management',
      icon: <Building2 className="w-5 h-5" />,
      subsections: [
        { id: 'core-vendors', label: 'Core Vendors' },
        { id: 'integrations', label: 'Integrations' }
      ]
    },
    {
      id: 'protocols',
      label: 'Corporate Protocols',
      icon: <Shield className="w-5 h-5" />,
      subsections: [
        { id: 'compliance', label: 'Compliance Rules' },
        { id: 'authority', label: 'Signature Authority' },
        { id: 'privacy', label: 'Privacy Requirements' }
      ]
    }
  ];

  const programs = [
    {
      id: 'sourcing',
      name: 'Sourcing Program',
      description: 'Vendor and contract management automation',
      icon: <Network className="w-6 h-6" />
    },
    {
      id: 'real-estate',
      name: 'Real Estate Program',
      description: 'Property transaction and lease management',
      icon: <Building2 className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-ivory">
      {/* Header */}
      <header className="guide-header">
        <div className="guide-container">
          <h1>Program Configuration</h1>
          <p>Configure and customize your enterprise programs</p>
          <p>Set up workflows, templates, and team structures</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {!selectedProgram ? (
          // Program Selection Screen
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {programs.map((program) => (
              <button
                key={program.id}
                onClick={() => setSelectedProgram(program)}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    {program.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{program.name}</h3>
                    <p className="text-gray-600">{program.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          // Configuration Interface
          <div className="flex gap-6">
            {/* Navigation Sidebar */}
            <div className="w-64 bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center space-x-2 mb-6 p-2 bg-blue-50 rounded-lg">
                {selectedProgram.icon}
                <h2 className="font-semibold">{selectedProgram.name}</h2>
              </div>
              
              <nav className="space-y-2">
                {navigationSections.map((section) => (
                  <div key={section.id}>
                    <button
                      onClick={() => setSelectedSection(section.id)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left
                        ${selectedSection === section.id 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'hover:bg-gray-50'}`}
                    >
                      <div className="flex items-center space-x-2">
                        {section.icon}
                        <span>{section.label}</span>
                      </div>
                      {section.subsections && (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                    
                    {/* Subsections */}
                    {section.subsections && selectedSection === section.id && (
                      <div className="ml-4 mt-2 space-y-1">
                        {section.subsections.map((subsection) => (
                          <button
                            key={subsection.id}
                            className="w-full p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg text-left"
                          >
                            {subsection.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
                <span>{selectedProgram.name}</span>
                <ChevronRight className="w-4 h-4" />
                <span>{navigationSections.find(s => s.id === selectedSection)?.label}</span>
              </div>

              {/* Content placeholder - to be replaced with actual configuration forms */}
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center text-gray-500">
                Configuration interface for {selectedSection} will be displayed here
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramConfiguration;
