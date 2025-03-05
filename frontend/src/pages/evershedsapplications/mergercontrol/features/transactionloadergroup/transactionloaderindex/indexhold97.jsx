import React, { useState } from 'react';
import { Scale, Save, CheckCircle, XCircle } from 'lucide-react';
import { useMergerControl } from '../../../../../../context/MergerControlContext';
import TransactionCompanySelector from '../components/TransactionCompanySelector';
import ProjectSelector from '../components/ProjectSelector';
import RegionSelector from '../components/RegionSelector';
import JurisdictionWorksheet from '../components/worksheet/JurisdictionWorksheet';

const MergerWorkflow = () => {
  // Define our workflow stages in strict sequence
  const WORKFLOW_STEPS = {
    COMPANY_SELECTION: {
      id: 'COMPANY_SELECTION',
      next: 'PROJECT_SETUP',
      title: 'Company Selection',
      validate: (data) => data.buyingCompany && data.targetCompany
    },
    PROJECT_SETUP: {
      id: 'PROJECT_SETUP',
      next: 'REGION_SELECTION',
      title: 'Project Setup',
      validate: (data) => data.activeRun?.runId
    },
    REGION_SELECTION: {
      id: 'REGION_SELECTION',
      next: 'WORKSHEET',
      title: 'Region Selection',
      validate: (data) => data.regionConfiguration
    },
    WORKSHEET: {
      id: 'WORKSHEET',
      next: 'ANALYSIS',
      title: 'Jurisdictional Worksheet',
      validate: (data) => data.worksheetComplete
    }
  };

  // State management
  const [currentStep, setCurrentStep] = useState(WORKFLOW_STEPS.COMPANY_SELECTION.id);
  const [workflowData, setWorkflowData] = useState({});
  const { buyingCompany, targetCompany } = useMergerControl();

  // Workflow control functions
  const advanceWorkflow = (newData) => {
    const currentStepConfig = WORKFLOW_STEPS[currentStep];
    
    // Update workflow data
    const updatedData = {
      ...workflowData,
      ...newData
    };
    setWorkflowData(updatedData);

    // Validate and advance if possible
    if (currentStepConfig.validate(updatedData)) {
      setCurrentStep(currentStepConfig.next);
      return true;
    }
    return false;
  };

  // Component rendering helper
  const renderWorkflowStep = () => {
    switch (currentStep) {
      case WORKFLOW_STEPS.COMPANY_SELECTION.id:
        return (
          <TransactionCompanySelector
            onComplete={(companyData) => 
              advanceWorkflow({
                buyingCompany: companyData.buyingCompany,
                targetCompany: companyData.targetCompany
              })}
          />
        );
      
      case WORKFLOW_STEPS.PROJECT_SETUP.id:
        return (
          workflowData.buyingCompany && workflowData.targetCompany && (
            <ProjectSelector
              onComplete={(runData) => 
                advanceWorkflow({ activeRun: runData })}
            />
          )
        );

      case WORKFLOW_STEPS.REGION_SELECTION.id:
        return (
          workflowData.activeRun && (
            <RegionSelector
              activeRun={workflowData.activeRun}
              projectName={workflowData.activeRun?.projectName}
              onComplete={(regionData) => 
                advanceWorkflow({ regionConfiguration: regionData })}
            />
          )
        );

      case WORKFLOW_STEPS.WORKSHEET.id:
        return (
          workflowData.regionConfiguration && (
            <JurisdictionWorksheet
              runData={workflowData.activeRun}
              regionConfiguration={workflowData.regionConfiguration}
              onComplete={(worksheetData) => 
                advanceWorkflow({ worksheetComplete: true, ...worksheetData })}
            />
          )
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-ivory min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center mb-4">
          <Scale className="text-royal-blue w-6 h-6 mr-2" />
          <h2 className="text-2xl font-semibold text-royal-blue">
            {WORKFLOW_STEPS[currentStep].title}
          </h2>
        </div>
        
        {/* Progress Indicator */}
        <div className="flex gap-2 mb-4">
          {Object.values(WORKFLOW_STEPS).map((step) => (
            <div
              key={step.id}
              className={`h-2 flex-1 rounded ${
                step.id === currentStep
                  ? 'bg-royal-blue'
                  : WORKFLOW_STEPS[step.id].validate(workflowData)
                  ? 'bg-green-500'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Current Step */}
      <div className="bg-white rounded-lg shadow p-6">
        {renderWorkflowStep()}
      </div>

      {/* Action Panel */}
      <div className="bg-white rounded-lg shadow p-6 mt-8">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <button
              className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 
                         rounded-lg transition-colors flex items-center space-x-2"
            >
              <XCircle className="w-5 h-5" />
              <span>Discard Work</span>
            </button>

            <button
              className="px-4 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 
                         rounded-lg transition-colors flex items-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>Save Progress</span>
            </button>
          </div>

          {currentStep === WORKFLOW_STEPS.WORKSHEET.id && (
            <button
              className="px-6 py-2 bg-teal text-white rounded-lg 
                         hover:bg-teal/90 transition-colors
                         flex items-center space-x-2"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Go to Results</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MergerWorkflow;
