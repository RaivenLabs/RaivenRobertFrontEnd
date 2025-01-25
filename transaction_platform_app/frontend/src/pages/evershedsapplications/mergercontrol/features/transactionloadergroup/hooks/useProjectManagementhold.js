import { useState, useEffect, useCallback, useMemo } from 'react';
import { useMergerControl } from '../../../../../../context/MergerControlContext';
import { useApplicationRun } from '../../../../../../context/ApplicationRunContext';

export const useProjectManagement = () => {
    // 1. Context values
    const { 
      buyingCompanies,
      targetCompanies,
      updateBuyingCompany,
      updateTargetCompany,
      buyingCompany,
      targetCompany
    } = useMergerControl();

    const {
      runState,
      updateApplicationState,
      initializeRun
    } = useApplicationRun();

    // 2. State initialization
    const [newProjectName, setNewProjectName] = useState('');
    const [selectedProject, setSelectedProject] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [existingProjects, setExistingProjects] = useState([]);

    // 3. Project finding logic
    const findExistingProjects = useCallback((buyerId, targetId) => {
      if (!buyerId || !targetId) return [];
      
      try {
        const buyerProjects = buyingCompanies[buyerId]?.projects || {};
        const targetProjects = targetCompanies[targetId]?.projects || {};

        const projects = [];

        // Add buyer projects
        if (buyerProjects) {
          Object.values(buyerProjects)
            .filter(project => project.targetCompany === targetId)
            .forEach(project => projects.push({
              projectName: project.projectName,
              dateCreated: project.dateCreated,
              source: 'buyer'
            }));
        }

        // Add target projects
        if (targetProjects) {
          Object.values(targetProjects)
            .filter(project => project.buyingCompany === buyerId)
            .forEach(project => projects.push({
              projectName: project.projectName,
              dateCreated: project.dateCreated,
              source: 'target'
            }));
        }

        return projects
          .sort((a, b) => b.dateCreated - a.dateCreated)
          .filter((project, index, self) =>
            index === self.findIndex((p) => p.projectName === project.projectName)
          );

      } catch (error) {
        console.error('Error finding projects:', error);
        return [];
      }
    }, [buyingCompanies, targetCompanies]);

    // 4. Update projects when companies change
    useEffect(() => {
      if (buyingCompany && targetCompany) {
        const projects = findExistingProjects(buyingCompany, targetCompany);
        setExistingProjects(projects);
      } else {
        setExistingProjects([]);
      }
    }, [buyingCompany, targetCompany, findExistingProjects]);

    // 5. Create new project
    const createNewProject = useCallback(async (projectName) => {
      if (!buyingCompany || !targetCompany || !projectName) {
        throw new Error('Missing required information');
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log('Creating project with:', { projectName, buyingCompany, targetCompany });

        // First initialize a new run
        await initializeRun('MERGER_CONTROL', 'currentUserId', 5);
        console.log('Run initialized');

        // Then update the application state
        await updateApplicationState({
          projectName,
          buyingCompany,
          targetCompany,
          projectCreated: new Date().toISOString()
        });
        console.log('Application state updated');

        // After successful creation, refresh projects list
        const projects = findExistingProjects(buyingCompany, targetCompany);
        setExistingProjects(projects);
        console.log('Projects list refreshed');

        // Set the newly created project as selected
        setSelectedProject(projectName);
        console.log('Project created successfully');

        return true;
      } catch (err) {
        console.error('Failed to create project:', err);
        setError('Failed to create project: ' + err.message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    }, [buyingCompany, targetCompany, initializeRun, updateApplicationState, findExistingProjects]);

    // 6. Project selection handler
    const onProjectSelect = useCallback(async (projectName) => {
      if (!projectName) {
        setSelectedProject(null);
        return;
      }
      
      setIsLoading(true);
      setError(null);

      try {
        setSelectedProject(projectName);
        await updateApplicationState({
          projectName
        });
      } catch (err) {
        setError('Failed to select project: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    }, [updateApplicationState]);

    // 7. Company selection handlers
    const handleAcquiringSelect = useCallback(async (companyId) => {
      if (!companyId) return;
      
      setIsLoading(true);
      setError(null);

      try {
        await updateBuyingCompany(companyId);
        await updateApplicationState({
          buyingCompany: companyId
        });
      } catch (err) {
        setError('Failed to set acquiring company: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    }, [updateBuyingCompany, updateApplicationState]);

    const handleTargetSelect = useCallback(async (companyId) => {
      if (!companyId) return;
      
      setIsLoading(true);
      setError(null);

      try {
        await updateTargetCompany(companyId);
        await updateApplicationState({
          targetCompany: companyId
        });
      } catch (err) {
        setError('Failed to set target company: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    }, [updateTargetCompany, updateApplicationState]);

    // 8. Generate Run ID
    const generatedRunId = useMemo(() => {
      if (buyingCompany && targetCompany) {
        const timestamp = new Date();
        const formattedDate = timestamp.toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
        return {
          id: `${buyingCompany}_${targetCompany}_${timestamp.getTime()}`,
          displayDate: formattedDate
        };
      }
      return null;
    }, [buyingCompany, targetCompany]);

    // 9. Return values
    return {
      // Company Selection
      handleAcquiringSelect,
      handleTargetSelect,
      buyingCompanies,
      targetCompanies,
      selectedAcquiring: buyingCompany,
      selectedTarget: targetCompany,
      
      // Project Management
      existingProjects,
      selectedProject,
      onProjectSelect,
      createNewProject,

      // Project Name
      newProjectName,
      setNewProjectName,

      // Run ID
      generatedRunId,

      // Status
      isLoading,
      error
    };
};
