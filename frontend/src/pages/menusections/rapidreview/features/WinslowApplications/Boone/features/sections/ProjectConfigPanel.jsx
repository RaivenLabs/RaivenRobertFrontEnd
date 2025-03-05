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
  export default ProjectConfigPanel;
