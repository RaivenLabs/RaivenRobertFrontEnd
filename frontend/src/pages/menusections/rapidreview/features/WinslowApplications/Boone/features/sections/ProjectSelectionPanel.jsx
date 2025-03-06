import React, { useState, useEffect } from 'react';
import { 
  Settings, Briefcase, Scale, Globe, Building, Users, FolderOpen, 
  ChevronDown, ChevronRight, Check, FileText, Database, Info
} from 'lucide-react';

const ProjectSelectionPanel = ({ onProjectSelected }) => {
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [briefingContext, setBriefingContext] = useState(null);
  const [briefingLoading, setBriefingLoading] = useState(false);
  const [briefingError, setBriefingError] = useState(null);

  // For demo, assume user has access
  const canAccessControls = true;

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
      
      // Reset selected project and briefing when program changes
      setSelectedProject(null);
      setBriefingContext(null);
    } else {
      setProjects([]);
    }
  }, [selectedProgram]);

  // Fetch briefing context when a project is selected
  const fetchBriefingContext = async (projectId) => {
    setBriefingLoading(true);
    setBriefingError(null);
    
    try {
      // Simulate API call to fetch briefing context
      const response = await fetch(`/api/briefing/${projectId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to load briefing: ${response.status}`);
      }
      
      const contextData = await response.json();
      console.log("Loaded briefing context:", contextData);
      setBriefingContext(contextData);
    } catch (error) {
      console.error('Error loading briefing context:', error);
      setBriefingError(error.message);
      
      // Fallback to a default context in case of error
      setBriefingContext({
        context: {
          project: {
            name: selectedProject.name,
            type: selectedProgram === 'ma' ? 'M&A Due Diligence' : 'Unknown'
          },
          business_context: 'Default context information'
        },
        scope: 'Default scope information',
        project_id: projectId
      });
    } finally {
      setBriefingLoading(false);
    }
  };

  // Handle program selection
  const handleProgramSelect = (programId) => {
    setSelectedProgram(programId);
  };

  // Handle project selection
  const handleProjectSelect = (project) => {
    if (!project.enabled) return;
    
    setSelectedProject(project);
    setDropdownOpen(false);
    
    // Fetch briefing context
    fetchBriefingContext(project.id);
  };

  // Handle continue button click
  const handleContinue = () => {
    if (onProjectSelected && selectedProject && briefingContext) {
      onProjectSelected(selectedProgram, selectedProject, briefingContext);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center">
        <Settings className="w-5 h-5 text-royalBlue mr-2" />
        <h2 className="text-lg font-semibold text-gray-800">
          Project Selection
        </h2>
      </div>
      
      <div className="p-4">
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Select Program Type</h3>
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
                <program.icon className={`w-8 h-8 mb-2 ${
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
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Select Project</h3>
            
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
          <>
            <div className="border-t pt-4 mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Project Information</h3>
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
              </div>
            </div>

            {/* Briefing Context Section */}
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Briefing Context</h3>
              
              {briefingLoading ? (
                <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-royalBlue mr-3"></div>
                  <span className="text-gray-600">Loading briefing documents...</span>
                </div>
              ) : briefingError ? (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <div className="flex items-center text-red-600">
                    <Info className="w-5 h-5 mr-2" />
                    <span>Error loading briefing: {briefingError}</span>
                  </div>
                </div>
              ) : briefingContext ? (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center text-green-700 mb-3">
                    <Check className="w-5 h-5 mr-2 text-green-500" />
                    <span>Briefing documents loaded successfully</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-3 bg-white">
                      <div className="flex items-center mb-2">
                        <FileText className="w-4 h-4 text-royalBlue mr-2" />
                        <span className="font-medium">Context YAML</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Contains project metadata and business context information
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-3 bg-white">
                      <div className="flex items-center mb-2">
                        <Database className="w-4 h-4 text-royalBlue mr-2" />
                        <span className="font-medium">Scope TXT</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Contains detailed project scope and requirements
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg text-gray-500 text-center">
                  Select a project to load briefing context
                </div>
              )}
            </div>
            
            <div className="mt-4 text-right">
              <button 
                onClick={handleContinue}
                disabled={!briefingContext || briefingLoading}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ml-auto
                  ${briefingContext && !briefingLoading
                    ? 'bg-royalBlue text-white hover:bg-royalBlue/90' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  } transition-colors`}
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectSelectionPanel;
