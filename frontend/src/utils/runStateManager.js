// src/utils/runStateManager.js

export class RunStateManager {
  static INITIAL_STATE = {
    runs: {
      MERGER_CONTROL: {},
      SAAS_AGREEMENT: {}
    }
  };

  static async createNewRun(type, userId, totalSteps = 0) {
    const runId = `${type}_${Date.now()}`;
    const newRun = {
      runState: {
        runType: type,
        status: 'NEW',
        subStatus: null,
        runId
      },
      metadata: {
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        lastAccessed: new Date().toISOString(),
        owner: userId,
        collaborators: [],
        completedSteps: [],
        totalSteps
      },
      applicationState: {}
    };

    try {
      const response = await fetch(`/api/merger-control/runs/${runId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRun)
      });

      if (!response.ok) {
        throw new Error('Failed to create new run');
      }

      return newRun;
    } catch (error) {
      console.error('Error creating new run:', error);
      throw error;
    }
  }

  static async loadRunState(runId) {
    try {
      const response = await fetch(`/api/merger-control/runs/${runId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('Failed to load run state');
      }

      return await response.json();
    } catch (error) {
      console.error('Error loading run state:', error);
      throw error;
    }
  }

  static async loadRunsByCompanies(buyingCompany, targetCompany) {
    try {
      const response = await fetch(
        `/api/merger-control/runs/by-companies?buyer=${buyingCompany}&target=${targetCompany}`
      );

      if (!response.ok) {
        throw new Error('Failed to load runs by companies');
      }

      return await response.json();
    } catch (error) {
      console.error('Error loading runs by companies:', error);
      throw error;
    }
  }

  static async updateRunState(runType, runId, updates) {
    try {
      // First, get the current state
      const currentState = await this.loadRunState(runId);
      
      if (!currentState) {
        throw new Error('Run not found');
      }

      // Merge updates with current state
      const updatedState = {
        ...currentState,
        runState: {
          ...currentState.runState,
          ...updates.runState
        },
        metadata: {
          ...currentState.metadata,
          ...updates.metadata,
          lastModified: new Date().toISOString()
        },
        applicationState: {
          ...currentState.applicationState,
          ...updates.applicationState
        }
      };

      // Save the updated state
      const response = await fetch(`/api/merger-control/runs/${runId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedState)
      });

      if (!response.ok) {
        throw new Error('Failed to update run state');
      }

      return updatedState;
    } catch (error) {
      console.error('Error updating run state:', error);
      throw error;
    }
  }

  static async saveCheckpoint(runId, checkpointData) {
    try {
      const response = await fetch(`/api/merger-control/runs/${runId}/checkpoint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkpointData)
      });

      if (!response.ok) {
        throw new Error('Failed to save checkpoint');
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving checkpoint:', error);
      throw error;
    }
  }
}
