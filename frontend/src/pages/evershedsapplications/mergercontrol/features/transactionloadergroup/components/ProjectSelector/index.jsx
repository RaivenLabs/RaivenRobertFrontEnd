
import React, { useState, useEffect } from 'react';
import { useProjectManagement } from '../../hooks/useProjectManagement';
import { useMergerControl } from '../../../../../../../context/MergerControlContext';



const ProjectSelector = ({onRunSelectionComplete, disabled}) => {
    const {
      selectedAcquiring,
      selectedTarget,
      findExistingProject,
      createNewProject,
      selectProject,
      isLoading,
      setIsLoading,          // from useProjectManagement
      error,              // from useProjectManagement
      setError           // add this to the destructure
    } = useProjectManagement();
  
    // Local state
    const [newProjectName, setNewProjectName] = useState('');
    const [existingProject, setExistingProject] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [savedRuns, setSavedRuns] = useState([]);
    const [showSavedRuns, setShowSavedRuns] = useState(false);
    const [activeRun, setActiveRun] = useState(null);
    const {dealSize, setDealSize } = useMergerControl();
    const [showNewRunSuccess, setShowNewRunSuccess] = useState(false);
    const { startAnalysis } = useMergerControl();  // Add this line to get startAnalysis
 
  useEffect(() => {
    const checkExistingProject = async () => {

      if (disabled) return ;

      if (selectedAcquiring && selectedTarget) {
        const project = await findExistingProject(selectedAcquiring, selectedTarget);
        setExistingProject(project);
        setSelectedProject(null);
        setNewProjectName('');
        setShowSuccessMessage(false);
      } else {
        setExistingProject(null);
        setSelectedProject(null);
      }
    };

    checkExistingProject();
  }, [selectedAcquiring, selectedTarget, findExistingProject]);









  useEffect(() => {
    if (selectedProject?.applicationRuns) {
      console.log("All application runs:", selectedProject.applicationRuns); // Debug log
      
      const runs = Object.values(selectedProject.applicationRuns)
        .filter(run => 
          // Include all valid statuses
          ['in_progress', 'completed', 'setup_initiated'].includes(run.status)
        )
        .sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
      
      console.log("Filtered runs:", runs); // Debug log
      setSavedRuns(runs);
    } else {
      setSavedRuns([]);
    }
}, [selectedProject]);

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    
    try {
      const project = await createNewProject({
        projectName: newProjectName.trim(),
        buyingCompany: selectedAcquiring,
        targetCompany: selectedTarget
      });
      
      setSelectedProject(project);
      setNewProjectName('');
      setShowSuccessMessage(true);
    } catch (err) {
      console.error('Error creating project:', err);
    }
  };

  const handleSelectProject = async () => {
    if (!existingProject) return;
    
    try {
      await selectProject(existingProject.projectId);
      setSelectedProject(existingProject);
      if (setDealSize && existingProject.dealSize) {
        setDealSize(existingProject.dealSize);
      }
    } catch (err) {
      console.error('Error selecting project:', err);
    }
  };

  

  const handleNewRun = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/projects/${selectedProject.projectId}/runs`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to create new run');
      }

      const newRun = await response.json();
      console.log('Created new run:', newRun);  // Debug log
      
      setActiveRun(newRun);
      startAnalysis(newRun);  // This will update the merger context
      setShowNewRunSuccess(true);

      // Refresh the saved runs list to include the new run
      if (selectedProject?.applicationRuns) {
        const updatedRuns = Object.values(selectedProject.applicationRuns)
          .filter(run => run.status === 'in_progress' || run.status === 'completed')
          .sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
        setSavedRuns(updatedRuns);
      }

    } catch (err) {
      console.error('Error creating new run:', err);
      setError('Failed to create new run: ' + err.message);
    } finally {
      setIsLoading(false);
    }
};

const handleLoadRun = async (runId) => {
  try {
    setIsLoading(true);
    console.log(`Loading run: ${runId}`);

    const response = await fetch(
      `/api/projects/${selectedProject.projectId}/runs/${runId}`, 
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to load run data');
    }

    const runData = await response.json();
    
    // Force full expansion in console
    console.group('Complete Run Data:');
    console.dir(runData, { depth: null });  // depth: null forces full expansion
    console.log('Target Company Data:', JSON.stringify(runData.targetCompanyData, null, 2));
    console.groupEnd();
    
    setActiveRun(runData);
    setShowNewRunSuccess(false);
    setShowSavedRuns(false);

  } catch (err) {
    console.error('Error loading run:', err);
    setError('Failed to load run: ' + err.message);
  } finally {
    setIsLoading(false);
  }
};

const handleStartAnalysis = () => {
  if (disabled) return;
  console.log('🔵 handleStartAnalysis called');
  console.log('Current state:', { activeRun, selectedProject });

  if (!activeRun || !selectedProject) {
    console.log('❌ Missing required data:', { activeRun, selectedProject });
    return;
  }

  console.log('✅ Calling onRunSelectionComplete');
  onRunSelectionComplete(activeRun);
  console.log('✨ onRunSelectionComplete called successfully');
};


return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column - Mandatory Project Selection */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-royalBlue mb-1">Active Projects:</h3>
            <p className="text-sm text-gray-600">
              {existingProject 
                ? "" 
                : "Create new project to proceed"}
            </p>
          </div>

          {selectedAcquiring && selectedTarget && (
            <div className="space-y-4">
              {showSuccessMessage ? (
                <div className="p-4 border-2 border-green-500 rounded-lg bg-green-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-green-700">
                        Active Project: {selectedProject.projectName}
                      </span>
                    </div>
                    <div className="text-sm text-green-600">✓ Ready for Application Run</div>
                  </div>
                  
                </div>
              ) : existingProject ? (
                <div className="p-4 border-2 border-royalBlue rounded-lg bg-gray-50 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{existingProject.projectName}</p>
                    <p className="text-xs text-gray-500">
                      Created: {new Date(existingProject.dateCreated).toLocaleDateString()}
                    </p>
                    <input
                      type="text"
                      value={existingProject?.dealSize ? 
                        new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          maximumFractionDigits: 0
                        }).format(existingProject.dealSize) : 
                        ''
                      }
                      onChange={(e) => {
                        // Remove all non-digits first
                        const rawValue = e.target.value.replace(/[^0-9]/g, '');
                        // Convert to number or null if empty
                        const numericValue = rawValue ? parseInt(rawValue) : null;
                        
                        const updatedProject = {
                          ...existingProject,
                          dealSize: numericValue
                        };
                        setExistingProject(updatedProject);
                        
                        // This updates the merger context
                        setDealSize(numericValue);
                      }}
                      placeholder="Set Deal Size"
                      className="w-[106px] mt-2 p-2 border border-gray-300 rounded
                               focus:border-royalBlue focus:ring-1 focus:ring-royalBlue
                               text-sm"
                    />
                  </div>
                  <button
                    onClick={handleSelectProject}
                    disabled={isLoading}
                    className="px-6 py-2 bg-royalBlue text-white rounded-lg 
                             hover:bg-blue-700 disabled:bg-gray-300
                             font-medium"
                  >
                    Confirm Project
                  </button>
                </div>
              </div> 
              ) : (
                <div className="p-4 border-2 border-royalBlue rounded-lg bg-gray-50 h-32">
                  <h4 className="font-medium text-gray-700 mb-2">Create New Project</h4>
                  <div className="space-y-4">
                    <div className="text-sm text-royalBlue">
                      * No existing project found - new project creation required to proceed
                    </div>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        placeholder="Enter project name"
                        className="flex-1 p-2 border border-gray-300 rounded-lg
                                 focus:border-royalBlue focus:ring-1 focus:ring-royalBlue"
                      />
                      <button
                        onClick={handleCreateProject}
                        disabled={!newProjectName.trim() || isLoading}
                        className="px-6 py-2 bg-royalBlue text-white rounded-lg 
                                 hover:bg-blue-700 disabled:bg-gray-300
                                 font-medium"
                      >
                        Create Project
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {isLoading && (
            <div className="flex justify-center items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-royalBlue"></div>
              <span className="text-sm text-royalBlue">Loading...</span>
            </div>
          )}

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Right Column - Application Runs */}
        <div className={`space-y-4 ${!selectedProject ? 'opacity-50' : ''}`}>
          <div>
            <h3 className="text-lg font-semibold text-royalBlue mb-1">Application Runs:</h3>
            <p className="text-sm text-gray-600">
              {selectedProject 
                ? "" 
                : "Select or create a project to manage runs"}
            </p>
          </div>

          <div className={`space-y-4 ${!selectedProject ? 'pointer-events-none' : ''}`}>
            
            
            
            
            
            
            
          {selectedProject ? (
  activeRun ? (
    <div className="p-4 border-2 border-green-500 rounded-lg bg-green-50 h-32">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-green-700">
              New Application Run: {activeRun.displayName}
            </h4>
            <p className="text-sm text-green-600">
              Created: {new Date(activeRun.dateCreated).toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => {
              console.log('🎯 Run Analysis button clicked');
              handleStartAnalysis();
            }}

            disabled={disabled || !activeRun || !selectedProject}

            className="px-6 py-2 bg-green-600 text-white rounded-lg 
                     hover:bg-green-700 font-medium
                     flex items-center space-x-2"
          >
            <span>Run Analysis</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  ) : (
    // ... rest of the code
    <div>
      <button
        onClick={handleNewRun}
        disabled={isLoading}
        className="w-full p-4 bg-royalBlue text-white rounded-lg
                 hover:bg-blue-700 disabled:bg-gray-300
                 flex items-center justify-center space-x-2
                 font-medium"
      >
        <span className="text-xl">+</span>
        <span>Launch New Application Run</span>
      </button>
      
      {savedRuns.length > 0 && (
        <div className="relative mt-4">
          <button
            onClick={() => setShowSavedRuns(!showSavedRuns)}
            className="w-full p-4 border border-royalBlue text-royalBlue rounded-lg
                      hover:bg-blue-50 transition-colors
                      flex items-center justify-between"
          >
            <div className="flex items-center space-x-2">
              <span className="text-xl">{showSavedRuns ? '−' : '+'}</span>
              <span>Saved Runs ({savedRuns.length})</span>
            </div>
            <span className="text-sm text-gray-500">Click to expand</span>
          </button>
          
          {showSavedRuns && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg z-10">
              <div className="p-2 max-h-60 overflow-y-auto">
              {savedRuns.map(run => (
  <div
    key={run.runId}
    onClick={() => handleLoadRun(run.runId)}  // Using runId directly
    className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0
              transition-colors duration-150 ease-in-out"
  >
    <div className="flex justify-between items-start">
      <div>
        <div className="font-medium text-gray-900">{run.displayName}</div>
        <div className="text-sm text-gray-500">
          Created: {new Date(run.dateCreated).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
      <div className={`px-3 py-1 rounded-full text-xs font-medium
        ${run.status === 'in_progress' 
          ? 'bg-yellow-100 text-yellow-800' 
          : 'bg-green-100 text-green-800'}`}
      >
        {run.status === 'in_progress' ? 'In Progress' : 'Completed'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {savedRuns.length > 3 && (
                <div className="p-2 bg-gray-50 border-t text-center text-sm text-gray-500">
                  {savedRuns.length} runs available
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
) : (
  <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg 
                  bg-gray-50 text-center space-y-2">
    <div className="text-gray-400 text-4xl">🔒</div>
    <div className="text-gray-500 font-medium">
      Project Selection Required
    </div>
    <div className="text-sm text-gray-400">
      Select an existing project or create a new one to manage application runs
    </div>
  </div>
)} 






          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSelector;
