import React, { useState } from 'react';
import { Scale, AlertCircle } from 'lucide-react';

const WorkflowManager = () => {
  // Define our workflow stages with more flexibility
  const WORKFLOW_STEPS = {
    COMPANY_SELECTION: {
      id: 'COMPANY_SELECTION',
      next: 'PROJECT_SETUP',
      title: 'Company Selection',
      validate: (data) => data.buyingCompany && data.targetCompany,
      // Define possible alternate paths
      alternativePaths: {
        REGION_SELECTION: (data) => data.skipProjectSetup,
        COMPANY_SELECTION: (data) => data.needsCompanyReset
      }
    },
    PROJECT_SETUP: {
      id: 'PROJECT_SETUP',
      next: 'REGION_SELECTION',
      title: 'Project Setup',
      validate: (data) => data.activeRun?.runId,
      alternativePaths: {
        COMPANY_SELECTION: (data) => data.companiesInvalid,
        WORKSHEET: (data) => data.skipRegionSelection
      }
    },
    REGION_SELECTION: {
      id: 'REGION_SELECTION',
      next: 'WORKSHEET',
      title: 'Region Selection',
      validate: (data) => data.regionConfiguration,
      alternativePaths: {
        PROJECT_SETUP: (data) => data.needsNewProject,
        COMPANY_SELECTION: (data) => data.needsNewCompanies
      }
    },
    WORKSHEET: {
      id: 'WORKSHEET',
      next: 'ANALYSIS',
      title: 'Jurisdictional Worksheet',
      validate: (data) => data.worksheetComplete,
      alternativePaths: {
        REGION_SELECTION: (data) => data.regionsInvalid,
        PROJECT_SETUP: (data) => data.projectInvalid,
        COMPANY_SELECTION: (data) => data.companiesInvalid
      }
    }
  };

  const [currentStep, setCurrentStep] = useState(WORKFLOW_STEPS.COMPANY_SELECTION.id);
  const [workflowData, setWorkflowData] = useState({});
  const [workflowHistory, setWorkflowHistory] = useState([WORKFLOW_STEPS.COMPANY_SELECTION.id]);

  // Enhanced workflow control functions
  const moveToStep = (targetStep, reason) => {
    const currentStepConfig = WORKFLOW_STEPS[currentStep];
    
    // Check if this is a valid move
    const isValidMove = 
      targetStep === currentStepConfig.next || // Normal forward progression
      (currentStepConfig.alternativePaths && // Or a defined alternative path
       currentStepConfig.alternativePaths[targetStep]?.(workflowData));
    
    if (!isValidMove) {
      console.warn(`Invalid step transition attempted: ${currentStep} → ${targetStep}`);
      return false;
    }

    // Log the transition for audit/debugging
    console.log(`Workflow transition: ${currentStep} → ${targetStep}`, { reason });
    
    // Update state
    setCurrentStep(targetStep);
    setWorkflowHistory(prev => [...prev, targetStep]);
    return true;
  };

  const advanceWorkflow = (newData, alternativePath = null) => {
    const currentStepConfig = WORKFLOW_STEPS[currentStep];
    
    // Update workflow data
    const updatedData = {
      ...workflowData,
      ...newData
    };
    setWorkflowData(updatedData);

    // Check for alternative paths first
    if (alternativePath) {
      const canTakeAlternativePath = 
        currentStepConfig.alternativePaths?.[alternativePath]?.(updatedData);
      
      if (canTakeAlternativePath) {
        return moveToStep(alternativePath, 'Alternative path taken');
      }
    }

    // Otherwise proceed with normal validation and advancement
    if (currentStepConfig.validate(updatedData)) {
      return moveToStep(currentStepConfig.next, 'Normal progression');
    }
    
    return false;
  };

  // Example of how a component might trigger a step change
  const handleCompanyInvalidation = () => {
    advanceWorkflow(
      { companiesInvalid: true },
      'COMPANY_SELECTION' // Request specific alternative path
    );
  };

  const renderWorkflowStep = () => {
    switch (currentStep) {
      case WORKFLOW_STEPS.COMPANY_SELECTION.id:
        return (
          <CompanySelector
            onComplete={(companyData) => advanceWorkflow({
              buyingCompany: companyData.buyingCompany,
              targetCompany: companyData.targetCompany
            })}
          />
        );
      
      case WORKFLOW_STEPS.PROJECT_SETUP.id:
        return (
          workflowData.buyingCompany && workflowData.targetCompany && (
            <ProjectSelector
              onComplete={(runData) => advanceWorkflow({ activeRun: runData })}
              onCompanyInvalid={handleCompanyInvalidation}
            />
          )
        );

      // ... other steps ...
    }
  };

  return (
    <div className="p-6 bg-ivory min-h-screen">
      {/* Header and progress indicator remain the same */}
      
      {/* Current Step with Potential Warning */}
      <div className="bg-white rounded-lg shadow p-6">
        {workflowHistory.length > 10 && (
          <div className="mb-4 p-4 bg-yellow-50 rounded-lg flex items-center gap-2">
            <AlertCircle className="text-yellow-600 w-5 h-5" />
            <span className="text-yellow-700">
              Unusual workflow pattern detected. Please verify your inputs.
            </span>
          </div>
        )}
        {renderWorkflowStep()}
      </div>
    </div>
  );
};

export default WorkflowManager;
