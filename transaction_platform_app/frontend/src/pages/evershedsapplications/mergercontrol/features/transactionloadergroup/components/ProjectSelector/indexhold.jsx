import React, { useState, setError, useEffect } from 'react';
import { useProjectManagement } from '../../hooks/useProjectManagement';
import { useApplicationRun } from '../../../../../../../context/ApplicationRunContext';

const ProjectSelector = () => {
  const {
    newProjectName,
    setNewProjectName,
    generatedRunId,
    error,
    selectedAcquiring,
    selectedTarget,
    existingProjects,
    onProjectSelect,
    selectedProject,
    createNewProject  
  } = useProjectManagement();

  const { 
    initializeRun,
    loadRun,
    runState 
  } = useApplicationRun();

  const [projectOption, setProjectOption] = useState('existing');
  const [runOption, setRunOption] = useState('new');
  const [savedRuns, setSavedRuns] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Determine if a project is properly selected
  const isProjectSelected = projectOption === 'new' ? 
    !!newProjectName : 
    !!selectedProject;

  // Load saved runs for these counterparties
  useEffect(() => {
    const loadSavedRuns = async () => {
      if (selectedAcquiring && selectedTarget) {
        setIsLoading(true);
        try {
          const response = await window.fs.readFile('run_state.json', { encoding: 'utf8' });
          const runData = JSON.parse(response);
          
          const matchingRuns = Object.entries(runData.runs.MERGER_CONTROL)
            .filter(([_, run]) => 
              run.applicationState?.buyingCompany === selectedAcquiring &&
              run.applicationState?.targetCompany === selectedTarget &&
              run.runState?.status === 'IN_PROCESS'
            )
            .map(([runId, run]) => ({
              runId,
              createdDate: new Date(run.metadata.created).toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              }),
              projectName: run.applicationState?.projectName
            }));

          setSavedRuns(matchingRuns);
        } catch (error) {
          console.error('Error loading saved runs:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadSavedRuns();
  }, [selectedAcquiring, selectedTarget]);

  const handleRunOptionSelection = async (option, runId) => {
    setIsLoading(true);
    try {
      if (option === 'new' && projectOption === 'new' && newProjectName) {
        await initializeRun('MERGER_CONTROL', 'currentUserId', 5);
      } else if (option === 'existing' && runId) {
        await loadRun(runId);
      }
    } catch (error) {
      console.error('Error handling run selection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectSelection = (projectName) => {
    onProjectSelect(projectName);
    // Reset run option to new when project changes
    setRunOption('new');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="space-y-6">
        {/* Project Name Section */}
        <div>
          <h3 className="text-lg font-semibold text-royalBlue mb-1">Project Details</h3>
          <p className="text-sm text-gray-600">Configure project information</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Existing Project Option */}
          <div className={`space-y-2 p-4 border rounded-lg ${projectOption === 'existing' ? 'bg-gray-100' : 'bg-gray-50'} 
                          hover:bg-gray-100 cursor-pointer`}
               onClick={() => setProjectOption('existing')}>
            <div className="flex items-center space-x-2 mb-3">
              <input
                type="radio"
                checked={projectOption === 'existing'}
                onChange={() => setProjectOption('existing')}
                className="text-royalBlue"
              />
              <label className="font-medium text-gray-700">Select Existing Project</label>
            </div>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg 
                       focus:border-royalBlue focus:ring-1 focus:ring-royalBlue
                       disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={projectOption !== 'existing' || !selectedAcquiring || !selectedTarget}
              onChange={(e) => handleProjectSelection(e.target.value)}
              value={selectedProject || ''}
            >
              <option value="">Select a project...</option>
              {existingProjects.map(project => (
                <option key={project.projectName} value={project.projectName}>
                  {project.projectName} - {new Date(project.dateCreated).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>

          {/* New Project Option */}
          <div className={`space-y-2 p-4 border rounded-lg ${projectOption === 'new' ? 'bg-gray-100' : 'bg-gray-50'} 
                          hover:bg-gray-100 cursor-pointer`}
               onClick={() => setProjectOption('new')}>
            <div className="flex items-center space-x-2 mb-3">
              <input
                type="radio"
                checked={projectOption === 'new'}
                onChange={() => setProjectOption('new')}
                className="text-royalBlue"
              />
              <label className="font-medium text-gray-700">Create New Project</label>
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Enter custom project name"
                disabled={projectOption !== 'new' || !selectedAcquiring || !selectedTarget}
                className="flex-1 p-2 border border-gray-300 rounded-lg
                         focus:border-royalBlue focus:ring-1 focus:ring-royalBlue
                         disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              {projectOption === 'new' && newProjectName && (
                <button
          // Add error display for the create operation
onClick={async (e) => {
  e.stopPropagation();
  setIsLoading(true);
  try {
    await createNewProject(newProjectName);
    setRunOption('new');
    // Maybe add some success feedback?
    console.log('Project created successfully'); // For debugging
  } catch (err) {
    console.error('Error creating project:', err);
    // Add error display to user
    setError(`Failed to create project: ${err.message}`);
  } finally {
    setIsLoading(false);
  }
}}
                  disabled={isLoading}
                  className="px-4 py-2 bg-royalBlue text-white rounded-lg 
                           hover:bg-blue-700 disabled:bg-gray-300"
                >
                  Create
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Run Management Section */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-royalBlue mb-1">Run Configuration</h3>
          <p className="text-sm text-gray-600">Continue saved run or start new analysis</p>
        </div>

        <div className={`grid grid-cols-2 gap-6 ${!isProjectSelected && 'opacity-50'}`}>
          {/* Existing Runs Option */}
          <div className={`space-y-2 p-4 border rounded-lg ${runOption === 'existing' ? 'bg-gray-100' : 'bg-gray-50'} 
                          hover:bg-gray-100 cursor-pointer ${!isProjectSelected && 'pointer-events-none'}`}
               onClick={() => isProjectSelected && setRunOption('existing')}>
            <div className="flex items-center space-x-2 mb-3">
              <input
                type="radio"
                checked={runOption === 'existing'}
                onChange={() => setRunOption('existing')}
                className="text-royalBlue"
                disabled={!isProjectSelected}
              />
              <label className="font-medium text-gray-700">Continue Saved Run</label>
            </div>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg 
                       focus:border-royalBlue focus:ring-1 focus:ring-royalBlue
                       disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={runOption !== 'existing' || !isProjectSelected}
              onChange={(e) => handleRunOptionSelection('existing', e.target.value)}
            >
              <option value="">Select a saved run...</option>
              {savedRuns.map(run => (
                <option key={run.runId} value={run.runId}>
                  {run.projectName || 'Unnamed Run'} - {run.createdDate}
                </option>
              ))}
            </select>
          </div>

          {/* New Run Option */}
          <div className={`space-y-2 p-4 border rounded-lg ${runOption === 'new' ? 'bg-gray-100' : 'bg-gray-50'} 
                          hover:bg-gray-100 cursor-pointer ${!isProjectSelected && 'pointer-events-none'}`}
               onClick={() => {
                 if (isProjectSelected) {
                   setRunOption('new');
                   handleRunOptionSelection('new');
                 }
               }}>
            <div className="flex items-center space-x-2 mb-3">
              <input
                type="radio"
                checked={runOption === 'new'}
                onChange={() => setRunOption('new')}
                className="text-royalBlue"
                disabled={!isProjectSelected}
              />
              <label className="font-medium text-gray-700">Start New Run</label>
            </div>
            {generatedRunId && (
              <div className="text-sm text-gray-600">
                New run will be created: {generatedRunId.displayDate}
              </div>
            )}
          </div>
        </div>

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
    </div>
  );
};

export default ProjectSelector;
