import React, { useState, useEffect } from 'react';
import { useConfig } from '../../../../../../../../context/ConfigContext';
import {
  Settings, Shield, Database, Globe, Building2, Server, 
  FileText, AlertCircle, Cloud, Clock, Package, Link, Users,
  Briefcase, Scale, Building, Rocket, Gavel, MessageSquare,
  Key, UploadCloud, Download, Search, FolderOpen, 
  ChevronDown, ChevronRight, Check, DatabaseIcon
} from 'lucide-react';

// Project Selection Panel
const ProjectSelectionPanel = ({ onProjectSelected }) => {
  const { customerId, hasCustomerAccess } = useConfig();
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Check if user has access to these controls
  const canAccessControls = (
    hasCustomerAccess(customerId) || customerId === 'HAWKEYE'
  );

  // Available program types
  const programTypes = [
    { id: 'ma', name: 'M&A Due Diligence', icon: Briefcase, enabled: true },
    { id: 'torts', name: 'Toxic Tort', icon: Scale, enabled: false },
    { id: 'sourcing', name: 'Sourcing', icon: Globe, enabled: false },
    { id: 'realestate', name: 'Real Estate', icon: Building, enabled: false },
    { id: 'hr', name: 'HR', icon: Users, enabled: false }
  ];

  // Simulated project data (would come from an API in production)
  const projectsByProgram = {
    ma: [
      { id: 'sequoia', name: 'Project Sequoia', status: 'in-progress', enabled: false },
      { id: 'avignon', name: 'Project Avignon', status: 'active', enabled: true },
      { id: 'hermes', name: 'Project Hermes', status: 'planning', enabled: false }
    ]
  };

  // Load projects when program changes
  useEffect(() => {
    if (selectedProgram) {
      setIsLoading(true);
      
      // Simulating API call to fetch projects
      setTimeout(() => {
        setProjects(projectsByProgram[selectedProgram] || []);
        setIsLoading(false);
        setDropdownOpen(true);
      }, 600);
      
      // Reset selected project when program changes
      setSelectedProject(null);
    } else {
      setProjects([]);
    }
  }, [selectedProgram]);

  // Handle program selection
  const handleProgramSelect = (programId) => {
    setSelectedProgram(programId);
  };

  // Handle project selection
  const handleProjectSelect = (project) => {
    if (!project.enabled) return;
    
    setSelectedProject(project);
    setDropdownOpen(false);
    
    // Notify parent component about selection
    if (onProjectSelected) {
      onProjectSelected(selectedProgram, project);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-6">
        <Settings className="w-6 h-6 text-royalBlue mr-3" />
        <h2 className="text-xl font-semibold">Project Selection</h2>
      </div>
      
      <div className="mb-8">
        <h3 className="text-md font-medium text-gray-700 mb-3">Select Program Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {programTypes.map((program) => (
            <button
              key={program.id}
              onClick={() => handleProgramSelect(program.id)}
              disabled={!program.enabled || !canAccessControls}
              className={`p-4 rounded-lg flex flex-col items-center text-center transition-colors
                ${selectedProgram === program.id 
                  ? 'bg-royalBlue text-white' 
                  : program.enabled && canAccessControls
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-800' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
            >
              <program.icon className={`w-10 h-10 mb-2 ${
                selectedProgram === program.id 
                  ? 'text-white' 
                  : program.enabled && canAccessControls
                    ? 'text-royalBlue'
                    : 'text-gray-400'
              }`} />
              <span className="text-sm font-medium">{program.name}</span>
              
              {!program.enabled && (
                <span className="text-xs mt-1 text-gray-500">Coming Soon</span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {selectedProgram && (
        <div className="mb-6">
          <h3 className="text-md font-medium text-gray-700 mb-3">Select Project</h3>
          
          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full p-3 border border-gray-300 rounded-lg flex items-center justify-between bg-white"
            >
              <div className="flex items-center">
                <Briefcase className="w-5 h-5 text-gray-500 mr-2" />
                <span>
                  {selectedProject 
                    ? selectedProject.name 
                    : "Select a project..."}
                </span>
              </div>
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-royalBlue"></div>
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>
            
            {dropdownOpen && !isLoading && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                {projects.length > 0 ? (
                  <ul className="py-1">
                    {projects.map((project) => (
                      <li key={project.id}>
                        <button
                          onClick={() => handleProjectSelect(project)}
                          disabled={!project.enabled}
                          className={`w-full text-left px-4 py-2 flex items-center justify-between
                            ${project.enabled 
                              ? 'hover:bg-gray-100' 
                              : 'text-gray-400 cursor-not-allowed'
                            }`}
                        >
                          <div className="flex items-center">
                            <FolderOpen className={`w-4 h-4 mr-2 ${
                              project.enabled ? 'text-royalBlue' : 'text-gray-400'
                            }`} />
                            {project.name}
                            {project.status === 'in-progress' && (
                              <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                                In Progress
                              </span>
                            )}
                          </div>
                          
                          {selectedProject && selectedProject.id === project.id && (
                            <Check className="w-4 h-4 text-green-500" />
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No projects available
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      
      {selectedProject && (
        <div className="border-t pt-4 mt-4">
          <h3 className="text-md font-medium text-gray-700 mb-2">Selected Project Information</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Project Name</div>
                <div className="font-medium">{selectedProject.name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Program Type</div>
                <div className="font-medium">
                  {programTypes.find(p => p.id === selectedProgram)?.name}
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-right">
              <button 
                onClick={() => onProjectSelected(selectedProgram, selectedProject)}
                className="px-4 py-2 bg-royalBlue text-white rounded-lg hover:bg-royalBlue/90 transition-colors flex items-center gap-2 ml-auto"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectSelectionPanel;
