// src/context/PrototypingContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';
import { STAGES } from '../types';

const PrototypingContext = createContext();

export const usePrototyping = () => {
  const context = useContext(PrototypingContext);
  if (!context) {
    throw new Error('usePrototyping must be used within a PrototypingProvider');
  }
  return context;
};

export const PrototypingProvider = ({ children }) => {
  const [currentStage, setCurrentStage] = useState(STAGES.PATTERN_SELECTION);
  const [isInitialized, setIsInitialized] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isAidaThinking, setIsAidaThinking] = useState(false);
  const [workflowData, setWorkflowData] = useState({
    selectedPattern: null,
    purpose: null,
    specification: null,
    logicStructure: null,
    componentLayout: null,
    integrationConfig: null,
    deploymentConfig: null
  });

  const initializeProgress = useCallback(() => {
    if (!isInitialized) {
      setCurrentStage(STAGES.PATTERN_SELECTION);
      setIsInitialized(true);
      console.log('🚀 Initializing Prototyping Lab progress...');
    }
  }, [isInitialized]);

  const saveProgress = useCallback(async (stage, data) => {
    try {
      console.log(`📝 Saving progress for stage: ${stage}`, data);
      
      // Update workflow data for the stage
      setWorkflowData(prev => ({
        ...prev,
        [stage]: data
      }));

      // Here you could also persist to backend
      // await saveToBackend(stage, data);
      
      return true;
    } catch (error) {
      console.error('Error saving progress:', error);
      throw error;
    }
  }, []);

  const updateConversation = useCallback((newHistory) => {
    console.log('📝 Updating conversation history:', newHistory);
    setConversationHistory(newHistory);
  }, []);

  const addConversationEntry = useCallback(async (entry) => {
    try {
      console.log('📝 Adding conversation entry:', entry);
      console.log('Current stage:', currentStage);
      
      // Add new entry to history
      setConversationHistory(prev => [...prev, entry]);

      if (entry.type === 'user') {
        setIsAidaThinking(true);
        
        const response = await fetch('/api/prototyping/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: entry.content,
            history: conversationHistory,
            currentStage,
            pattern: workflowData.selectedPattern
          })
        });

        if (!response.ok) {
          throw new Error('Failed to get AIDA response');
        }

        const data = await response.json();
        console.log('Received AIDA response:', data);
        
        setConversationHistory(prev => [...prev, {
          type: 'assistant',
          content: data.response
        }]);
      }
    } catch (error) {
      console.error('Error in conversation:', error);
    } finally {
      setIsAidaThinking(false);
    }
  }, [conversationHistory, currentStage, workflowData.selectedPattern]);

  const handlePromoteToCanvas = useCallback(async (content) => {
    try {
      setIsAidaThinking(true);
      console.log('🎯 Promoting to canvas with content:', content);

      const response = await fetch('/api/prototyping/promote-to-canvas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workflow_text: content,
          pattern: workflowData.selectedPattern
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate canvas');
      }

      const data = await response.json();
      console.log('Canvas generation response:', data);

      // Update workflow data with canvas info
      setWorkflowData(prev => ({
        ...prev,
        componentLayout: data.canvas_json
      }));

      // Move to next stage
      setCurrentStage(STAGES.COMPONENT_LAYOUT);

      return data.canvas_json;
    } catch (error) {
      console.error('Error promoting to canvas:', error);
      throw error;
    } finally {
      setIsAidaThinking(false);
    }
  }, [workflowData.selectedPattern]);

  const validateStageCompletion = useCallback((stage, data) => {
    const validations = {
      [STAGES.PATTERN_SELECTION]: (data) => !!data?.selectedPattern && !!data?.purpose,
      [STAGES.SPECIFICATION]: (data) => !!data?.specification,
      [STAGES.LOGIC_STRUCTURE]: (data) => !!data?.logicStructure,
      [STAGES.COMPONENT_LAYOUT]: (data) => !!data?.componentLayout,
      [STAGES.INTEGRATION_CONFIG]: (data) => !!data?.integrationConfig,
      [STAGES.DEPLOYMENT_READY]: (data) => !!data?.deploymentConfig
    };

    return validations[stage] ? validations[stage](data) : true;
  }, []);

  const value = {
    currentStage,
    setCurrentStage,
    initializeProgress,
    conversationHistory,
    updateConversation,
    addConversationEntry,
    isAidaThinking,
    workflowData,
    saveProgress,
    validateStageCompletion,
    handlePromoteToCanvas
  };

  return (
    <PrototypingContext.Provider value={value}>
      {children}
    </PrototypingContext.Provider>
  );
};

export default PrototypingProvider;
