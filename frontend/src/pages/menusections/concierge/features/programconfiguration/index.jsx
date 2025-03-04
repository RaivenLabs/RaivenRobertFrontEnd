import React, { useState } from 'react';
import { 
  FileText, Users, Building2, Shield, Files,
  Scale, CheckCircle
} from 'lucide-react';

const programs = [
  { id: 'sourcing', label: 'Sourcing' },
  { id: 'real-estate', label: 'Real Estate' },
  { id: 'sales', label: 'Sales' },
  { id: 'finance', label: 'Finance' },
  { id: 'hr', label: 'HR' }
];

const configGroups = [
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

const ConfigurationCard = ({ title, children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    {children}
  </div>
);

const ProgramConfiguration = () => {
  // Initialize with defaults
  const [activeProgram, setActiveProgram] = useState('sourcing');
  const [activeGroup, setActiveGroup] = useState('agreements');
  const [completedGroups, setCompletedGroups] = useState(new Set());

  const handleGroupComplete = () => {
    if (activeGroup) {
      setCompletedGroups(prev => new Set([...prev, activeGroup]));
    }
  };

  return (
    <div className="p-6 bg-ivory min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center mb-4">
          <Scale className="text-royal-blue w-6 h-6 mr-2" />
          <h2 className="text-2xl font-semibold text-royal-blue">
            Program Configuration
          </h2>
        </div>
        <p className="text-gray-600">
          Configure your program settings and manage configurations
        </p>
      </div>

      {/* Configuration Setup Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Active Program */}
        <ConfigurationCard title="Active Program">
          <div className="space-y-2">
            {programs.map(program => (
              <button
                key={program.id}
                onClick={() => setActiveProgram(program.id)}
                className={`w-full p-2 text-left rounded-lg transition-colors
                  ${activeProgram === program.id 
                    ? 'bg-teal text-white' 
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
              >
                {program.label}
              </button>
            ))}
          </div>
        </ConfigurationCard>

        {/* Active Group */}
        <ConfigurationCard title="Active Program Group">
          <div className="space-y-2">
            {configGroups.map(group => (
              <button
                key={group.id}
                onClick={() => setActiveGroup(group.id)}
                className={`w-full p-2 text-left rounded-lg transition-colors flex items-center justify-between
                  ${activeGroup === group.id 
                    ? 'bg-teal text-white' 
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
              >
                <span className="flex items-center">
                  {group.icon}
                  <span className="ml-2">{group.label}</span>
                </span>
                {completedGroups.has(group.id) && (
                  <CheckCircle className="w-4 h-4" />
                )}
              </button>
            ))}
          </div>
        </ConfigurationCard>
      </div>

      {/* Active Configuration Panel */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          {configGroups.find(g => g.id === activeGroup)?.label} Configuration
        </h3>
        <div className="min-h-[400px] bg-gray-50 rounded-lg p-4 mb-4">
          {/* Display active group's subsections */}
          <div className="space-y-4">
            {configGroups.find(g => g.id === activeGroup)?.subsections.map(subsection => (
              <div 
                key={subsection.id}
                className="p-4 bg-white rounded-lg shadow-sm hover:shadow transition-shadow"
              >
                <h4 className="font-medium text-gray-900">{subsection.label}</h4>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <button 
            onClick={handleGroupComplete}
            className="px-6 py-2 bg-teal text-white rounded-lg hover:bg-teal/90 flex items-center space-x-2"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Confirm Configuration</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgramConfiguration;
