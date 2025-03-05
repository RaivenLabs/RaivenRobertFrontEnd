import React, { useState, useEffect } from 'react';
import { Check, X, AlertCircle } from 'lucide-react';

const ProjectSyncManager = () => {
  const [pendingProjects, setPendingProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPendingProjects = async () => {
      try {
        // Load run_state.json and find all projects not in company data
        const runStateData = await window.fs.readFile('run_state.json', { encoding: 'utf8' });
        const runData = JSON.parse(runStateData);

        // Extract unique projects pending promotion
        const pending = Object.values(runData.runs.MERGER_CONTROL || {})
          .filter(run => run.applicationState?.projectName)
          .map(run => ({
            projectName: run.applicationState.projectName,
            buyingCompany: run.applicationState.buyingCompany,
            targetCompany: run.applicationState.targetCompany,
            created: new Date(run.metadata.created).toLocaleString(),
            status: run.runState.status
          }));

        setPendingProjects(pending);
      } catch (error) {
        console.error('Error loading pending projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPendingProjects();
  }, []);

  const handlePromote = async (project) => {
    // Logic to promote to company data files
  };

  const handleDismiss = async (project) => {
    // Logic to mark as "do not promote"
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading pending projects...</div>;
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-royalBlue">Project Promotion Manager</h2>
          <p className="text-sm text-gray-600">Review and promote temporary projects to company records</p>
        </div>

        {pendingProjects.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No projects pending promotion
          </div>
        ) : (
          <div className="divide-y">
            {pendingProjects.map(project => (
              <div key={project.projectName} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{project.projectName}</h3>
                    <p className="text-sm text-gray-600">
                      {project.buyingCompany} → {project.targetCompany}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Created: {project.created}
                    </p>
                    <div className="flex items-center mt-1">
                      <AlertCircle className="w-4 h-4 text-amber-500 mr-1" />
                      <span className="text-xs text-amber-500">Status: {project.status}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePromote(project)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded"
                      title="Promote to company records"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDismiss(project)}
                      className="p-2 text-gray-400 hover:bg-gray-50 rounded"
                      title="Do not promote"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectSyncManager;
