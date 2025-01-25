import React, { useState, useEffect } from 'react';
import { Scale, Save, CheckCircle, XCircle } from 'lucide-react';
import { useMergerControl } from '../../../../../../context/MergerControlContext';
import TransactionCompanySelector from '../components/TransactionCompanySelector';
import ProjectSelector from '../components/ProjectSelector';
import RegionSelector from '../components/RegionSelector';
import ProcessSteps from './ProcessSteps';
import JurisdictionWorksheet from '../components/worksheet/JurisdictionWorksheet';

const TransactionLoader = () => {
  const [currentStep, setCurrentStep] = useState('company_selection');
  const [activeRun, setActiveRun] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [regionConfiguration, setRegionConfiguration] = useState(null);
  const { buyingCompany, targetCompany } = useMergerControl();
  
  // Track completed steps - our "partridge" tracker! 🦃
  const [completedSteps, setCompletedSteps] = useState(new Set());

  // Helper to mark a step as complete and move to next
  const completeStepAndAdvance = (completed, nextStep) => {
    console.log(`✅ Marking step ${completed} as complete and moving to ${nextStep}`);
    setCompletedSteps(prev => new Set([...prev, completed]));
    setCurrentStep(nextStep);
  };

  // Handlers for step transitions
  const handleCompanySelectionComplete = () => {
    console.log('🏢 Company selection complete, moving to project setup...');
    completeStepAndAdvance('company_selection', 'project_setup');
  };

  const handleRunSelectionComplete = (runData) => {
    console.log('🏁 Run selected, moving to region selection...', runData?.runId);
    setActiveRun(runData);
    completeStepAndAdvance('project_setup', 'region_selection');
  };

  const handleWorksheetGenerate = (regionData) => {
    console.log('🎯 Receiving region configuration handoff...', regionData);
    setRegionConfiguration(regionData);
    completeStepAndAdvance('region_selection', 'worksheet');
  };

  // Helper to check if we should show a component
  const shouldShowStep = (step) => {
    // If this is the current step, show it
    if (currentStep === step) return true;
    // If this step isn't complete, don't show it
    if (!completedSteps.has(step)) return false;
    // Show completed steps with reduced opacity
    return true;
  };

// In TransactionLoader
useEffect(() => {
  // Only watch buyingCompany and targetCompany if we're in company_selection
  if (currentStep === 'company_selection' && buyingCompany && targetCompany) {
    handleCompanySelectionComplete();
  }
}, [buyingCompany, targetCompany, currentStep]);





  return (
    <div className="p-6 bg-ivory min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center mb-4">
          <Scale className="text-royal-blue w-6 h-6 mr-2" />
          <h2 className="text-2xl font-semibold text-royal-blue">
            Transaction Setup
          </h2>
        </div>
        <div className="prose max-w-none">
          <p className="text-gray-600 mb-6">
            Configure your merger control analysis by following these steps.
          </p>
          <ProcessSteps 
            currentStep={currentStep} 
            completedSteps={completedSteps}
          />
        </div>
      </div>

      {/* Progressive panels */}
      <div className="space-y-6">
        {/* Company Selection */}
        {shouldShowStep('company_selection') && (
          <div className={`transition-opacity duration-300 
            ${currentStep === 'company_selection' ? 'opacity-100' : 'opacity-70'}`}
          >
            <TransactionCompanySelector 
              onComplete={handleCompanySelectionComplete}
              disabled={completedSteps.has('company_selection')}
            />
          </div>
        )}

        {/* Project Selection */}
        {shouldShowStep('project_setup') && (
          <div className={`transition-opacity duration-300 
            ${currentStep === 'project_setup' ? 'opacity-100' : 'opacity-70'}`}
          >
            <ProjectSelector
              onRunSelectionComplete={handleRunSelectionComplete}
              disabled={completedSteps.has('project_setup')}
            />
          </div>
        )}

        {/* Region Selection */}
        {shouldShowStep('region_selection') && (
          <div className={`transition-opacity duration-300 
            ${currentStep === 'region_selection' ? 'opacity-100' : 'opacity-70'}`}
          >
            <RegionSelector 
              activeRun={activeRun}
              projectName={activeRun?.projectName}
              onWorksheetGenerate={handleWorksheetGenerate}
              disabled={completedSteps.has('region_selection')}
            />
          </div>
        )}

        {/* Jurisdiction Worksheet */}
        {shouldShowStep('worksheet') && (
          <div className={`transition-opacity duration-300 
            ${currentStep === 'worksheet' ? 'opacity-100' : 'opacity-70'}`}
          >
            <JurisdictionWorksheet 
              runData={activeRun}
              regionConfiguration={regionConfiguration}
            />
          </div>
        )}

        {/* Action Panel */}
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <button className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 
                             rounded-lg transition-colors flex items-center space-x-2">
                <XCircle className="w-5 h-5" />
                <span>Discard Work</span>
              </button>
              <button className="px-4 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 
                             rounded-lg transition-colors flex items-center space-x-2">
                <Save className="w-5 h-5" />
                <span>Save Progress</span>
              </button>
            </div>

            {currentStep === 'worksheet' && (
              <button className="px-6 py-2 bg-teal text-white rounded-lg 
                             hover:bg-teal/90 transition-colors
                             flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>Go to Results</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionLoader;
