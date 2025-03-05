// src/contexts/ApplicationRunContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { RunStateManager } from '../utils/runStateManager';

const ApplicationRunContext = createContext();

export const ApplicationRunProvider = ({ children }) => {
  // Core run state
  const [runState, setRunState] = useState({
    runType: null,
    status: 'NEW',
    subStatus: null,
    runId: null
  });

  // Run metadata
  const [runMetadata, setRunMetadata] = useState({
    created: null,
    lastModified: null,
    lastAccessed: null,
    owner: null,
    collaborators: [],
    completedSteps: [],
    totalSteps: 0,
    accessHistory: []
  });

  // Application-specific state
  const [applicationState, setApplicationState] = useState(null);

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize a new run
  const initializeRun = async (type, userId, totalSteps = 0) => {
    try {
      setIsLoading(true);
      setError(null);

      const newRun = await RunStateManager.createNewRun(type, userId);
      
      setRunState(newRun.runState);
      setRunMetadata({
        ...newRun.metadata,
        totalSteps
      });
      setApplicationState({});

    } catch (err) {
      setError('Failed to initialize run: ' + err.message);
      console.error('Run initialization error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load an existing run
  const loadRun = async (runId) => {
    try {
      setIsLoading(true);
      setError(null);

      const existingRun = await RunStateManager.loadRunState(runId);
      if (!existingRun) {
        throw new Error('Run not found');
      }

      // Update last accessed timestamp
      const updatedRun = await RunStateManager.updateRunState(
        existingRun.runState.runType,
        runId,
        {
          metadata: {
            ...existingRun.metadata,
            lastAccessed: new Date().toISOString()
          }
        }
      );

      setRunState(updatedRun.runState);
      setRunMetadata(updatedRun.metadata);
      setApplicationState(updatedRun.applicationState);

    } catch (err) {
      setError('Failed to load run: ' + err.message);
      console.error('Run loading error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Save current state
  const saveCheckpoint = async (newApplicationState) => {
    if (!runState.runId) return;

    try {
      setIsLoading(true);
      setError(null);

      const updatedRun = await RunStateManager.updateRunState(
        runState.runType,
        runState.runId,
        {
          runState: {
            ...runState,
            status: 'IN_PROCESS'
          },
          metadata: {
            ...runMetadata,
            lastModified: new Date().toISOString()
          },
          applicationState: newApplicationState
        }
      );

      setRunState(updatedRun.runState);
      setRunMetadata(updatedRun.metadata);
      setApplicationState(updatedRun.applicationState);

    } catch (err) {
      setError('Failed to save checkpoint: ' + err.message);
      console.error('Checkpoint save error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Complete a run
  const completeRun = async (finalState) => {
    if (!runState.runId) return;

    try {
      setIsLoading(true);
      setError(null);

      const updatedRun = await RunStateManager.updateRunState(
        runState.runType,
        runState.runId,
        {
          runState: {
            ...runState,
            status: 'COMPLETE',
            subStatus: 'ACTIVE'
          },
          metadata: {
            ...runMetadata,
            lastModified: new Date().toISOString(),
            completedSteps: Array.from(new Set([...runMetadata.completedSteps, 'final']))
          },
          applicationState: finalState
        }
      );

      setRunState(updatedRun.runState);
      setRunMetadata(updatedRun.metadata);
      setApplicationState(updatedRun.applicationState);

    } catch (err) {
      setError('Failed to complete run: ' + err.message);
      console.error('Run completion error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Update application state
  const updateApplicationState = async (updates) => {
    if (!runState.runId) return;

    try {
      const updatedState = {
        ...applicationState,
        ...updates
      };

      await saveCheckpoint(updatedState);
    } catch (err) {
      setError('Failed to update application state: ' + err.message);
      console.error('State update error:', err);
    }
  };

  // Mark a step as complete
  const completeStep = async (stepId) => {
    if (!runState.runId || runMetadata.completedSteps.includes(stepId)) return;

    try {
      const updatedMetadata = {
        ...runMetadata,
        completedSteps: [...runMetadata.completedSteps, stepId],
        lastModified: new Date().toISOString()
      };

      const updatedRun = await RunStateManager.updateRunState(
        runState.runType,
        runState.runId,
        {
          metadata: updatedMetadata
        }
      );

      setRunMetadata(updatedRun.metadata);
    } catch (err) {
      setError('Failed to complete step: ' + err.message);
      console.error('Step completion error:', err);
    }
  };

  // Clear any errors
  const clearError = () => setError(null);

  return (
    <ApplicationRunContext.Provider
      value={{
        // State
        runState,
        runMetadata,
        applicationState,
        isLoading,
        error,

        // Core functions
        initializeRun,
        loadRun,
        saveCheckpoint,
        completeRun,
        
        // State management
        updateApplicationState,
        completeStep,
        clearError,

        // Helper functions
        isStepCompleted: (stepId) => runMetadata.completedSteps.includes(stepId),
        getProgress: () => ({
          completed: runMetadata.completedSteps.length,
          total: runMetadata.totalSteps,
          percentage: runMetadata.totalSteps 
            ? Math.round((runMetadata.completedSteps.length / runMetadata.totalSteps) * 100)
            : 0
        })
      }}
    >
      {children}
    </ApplicationRunContext.Provider>
  );
};

// Custom hook for using the context
export const useApplicationRun = () => {
  const context = useContext(ApplicationRunContext);
  if (!context) {
    throw new Error('useApplicationRun must be used within an ApplicationRunProvider');
  }
  return context;
};

export default ApplicationRunContext;
