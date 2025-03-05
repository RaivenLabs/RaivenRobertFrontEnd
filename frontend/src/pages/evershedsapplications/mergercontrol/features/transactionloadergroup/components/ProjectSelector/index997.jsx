import React, { useState, useEffect } from 'react';
import { useProjectManagement } from '../../hooks/useProjectManagement';

const ProjectSelector = ({ onComplete, buyingCompany, targetCompany }) => {
  const {
    findExistingProject,
    selectProject,
    isLoading,
    setIsLoading,
    error,
    setError
  } = useProjectManagement();

  // Local state
  const [existingProject, setExistingProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [savedRuns, setSavedRuns] = useState([]);
  const [showSavedRuns, setShowSavedRuns] = useState(false);
  const [activeRun, setActiveRun] = useState(null);
  const [showNewRunSuccess, setShowNewRunSuccess] = useState(false);

  // Check for existing project when companies are selected
  useEffect(() => {
    const checkExistingProject = async () => {
      
        console.log('Checking for existing project:', { buyingCompany, targetCompany });
        if (buyingCompany && targetCompany) {
        const project = await findExistingProject(buyingCompany, targetCompany);
        if (!project) {
          setError('No project found for these companies. Please configure a project first.');
          return;
        }
        setExistingProject(project);
        setSelectedProject(null);
        setShowSuccessMessage(false);
      }
    };

  
    


    
    checkExistingProject();
  }, [buyingCompany, targetCompany, findExistingProject, setError]);

  // Load saved runs when project is selected
  useEffect(() => {
    if (selectedProject?.applicationRuns) {
      const runs = Object.values(selectedProject.applicationRuns)
        .filter(run => 
          ['in_progress', 'completed', 'setup_initiated'].includes(run.status)
        )
        .sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
      
      setSavedRuns(runs);
    } else {
      setSavedRuns([]);
    }
  }, [selectedProject]);

  useEffect(() => {
    console.log('ProjectSelector mounted with:', { buyingCompany, targetCompany });
  }, [buyingCompany, targetCompany]);



  const handleSelectProject = async () => {
    if (!existingProject) return;
    
    try {
      await selectProject(existingProject.projectId);
      setSelectedProject(existingProject);
      setShowSuccessMessage(true);
    } catch (err) {
      console.error('Error selecting project:', err);
      setError('Failed to select project: ' + err.message);
    }
  };

  const handleNewRun = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/projects/${selectedProject.projectId}/runs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to create new run');
      }

      const newRun = await response.json();
      setActiveRun(newRun);
      setShowNewRunSuccess(true);

      // Refresh saved runs
      if (selectedProject?.applicationRuns) {
        const updatedRuns = Object.values(selectedProject.applicationRuns)
          .filter(run => ['in_progress', 'completed'].includes(run.status))
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
    if (!activeRun || !selectedProject) return;

    onComplete({
      projectId: selectedProject.projectId,
      projectName: selectedProject.projectName,
      runId: activeRun.runId,
      runData: activeRun,
      dateCreated: activeRun.dateCreated
    });
  };
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 relative">
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column - Project Selection */}
        <div className="space-y-4 relative z-10"> {/* Added relative and z-10 */}
          <div>
            <h3 className="text-lg font-semibold text-royalBlue mb-1">Active Project:</h3>
            {existingProject && (
              <div className="p-4 border-2 border-royalBlue rounded-lg bg-white"> {/* Changed to bg-white */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{existingProject.projectName}</p>
                    <p className="text-xs text-gray-500">
                      Created: {new Date(existingProject.dateCreated).toLocaleDateString()}
                    </p>
                  </div>
                  {!showSuccessMessage && (
                    <button
                      onClick={handleSelectProject}
                      disabled={isLoading}
                      className="px-6 py-2 bg-royalBlue text-white rounded-lg 
                               hover:bg-blue-700 disabled:bg-gray-300
                               font-medium"
                    >
                      Confirm Project
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
  
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}
        </div>
  
        {/* Right Column - Application Runs */}
        <div className={`space-y-4 relative z-10 ${!selectedProject ? 'opacity-50' : ''}`}> {/* Added relative and z-10 */}
          <div>
            <h3 className="text-lg font-semibold text-royalBlue mb-1">Application Runs:</h3>
            <p className="text-sm text-gray-600">
              {selectedProject 
                ? "" 
                : "Please confirm project to manage runs"}
            </p>
          </div>
  
          <div className={`space-y-4 ${!selectedProject ? 'pointer-events-none' : ''}`}>
            {selectedProject ? (
 
              activeRun ? (
                <div className="p-4 border-2 border-green-500 rounded-lg bg-green-50">
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
                        onClick={handleStartAnalysis}
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
                                onClick={() => handleLoadRun(run.runId)}
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
                             bg-white text-center space-y-2"> {/* Changed to bg-white */}
                  <div className="text-gray-400 text-4xl">🔒</div>
                  <div className="text-gray-500 font-medium">
                    Project Confirmation Required
                  </div>
                  <div className="text-sm text-gray-400">
                    Please confirm the project to manage application runs
                  </div>
                </div>
            )}
          </div>
        </div>
      </div>
 {/* Loading Indicator */}
 {isLoading && (
      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-20">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-royalBlue"></div>
          <span className="text-sm text-royalBlue">Loading...</span>
        </div>
      </div>
    )}
  </div>
);







   
};

export default ProjectSelector;
