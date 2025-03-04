import { useState, useCallback } from 'react';
import { useMergerControl } from '../../../../../../context/MergerControlContext';

export const useProjectManagement = () => {
    // Context for company information
    const { 
      buyingCompany: selectedAcquiring,
      targetCompany: selectedTarget
    } = useMergerControl();

    // Basic state management
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Find existing project for company pair
    const findExistingProject = useCallback(async (buyingCompanyId, targetCompanyId) => {
      if (!buyingCompanyId || !targetCompanyId) return null;
      
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/projects/search?buyingCompany=${buyingCompanyId}&targetCompany=${targetCompanyId}`
        );

        if (!response.ok) {
          throw new Error('Failed to find project');
        }

        const projects = await response.json();
        // Return the first matching project if any exist
        return projects.length > 0 ? projects[0] : null;

      } catch (err) {
        console.error('Error finding project:', err);
        setError('Failed to find project: ' + err.message);
        return null;
      } finally {
        setIsLoading(false);
      }
    }, []);

    // Create new project
    const createNewProject = useCallback(async ({ projectName, buyingCompany, targetCompany }) => {
      if (!projectName || !buyingCompany || !targetCompany) {
        throw new Error('Missing required project information');
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            projectName,
            buyingCompany,
            targetCompany
          })
        });

        if (!response.ok) {
          throw new Error('Failed to create project');
        }

        const newProject = await response.json();
        return newProject;

      } catch (err) {
        console.error('Error creating project:', err);
        setError('Failed to create project: ' + err.message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    }, []);

    // Select existing project
    const selectProject = useCallback(async (projectId) => {
      if (!projectId) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/projects/${projectId}`);
        
        if (!response.ok) {
          throw new Error('Failed to load project');
        }

        const project = await response.json();
        return project;

      } catch (err) {
        console.error('Error selecting project:', err);
        setError('Failed to select project: ' + err.message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    }, []);

    return {
      // Company info
      selectedAcquiring,
      selectedTarget,
      
      // Core project functions
      findExistingProject,
      createNewProject,
      selectProject,
      
      // Status
      isLoading,
      setIsLoading,
      error,
      setError
    };
};
