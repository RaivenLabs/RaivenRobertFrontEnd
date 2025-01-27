import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, Save, CheckCircle, XCircle } from 'lucide-react';
import { useMergerControl } from '../../../../../../context/MergerControlContext';
import TransactionCompanySelector from '../components/TransactionCompanySelector';
import ProjectSelector from '../components/ProjectSelector';
import RegionalBlockSelector from '../components/RegionalBlockSelector';
import ProcessSteps from './ProcessSteps';
import RegionalBlockWorksheet from '../components/worksheet/RegionalBlockWorksheet';

const TransactionLoader = () => {
  const [currentStep, setCurrentStep] = useState('company_selection');
  const navigate = useNavigate();
  const [activeRun, setActiveRun] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [blockConfiguration, setBlockConfiguration] = useState(null);
  const { buyingCompany, targetCompany, startAnalysis } = useMergerControl();
  
  // Track completed steps
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
    console.log('🏁 Run selected, moving to regional block selection...', runData?.runId);
    setActiveRun(runData);
    completeStepAndAdvance('project_setup', 'block_selection');
  };

  const handleWorksheetGenerate = (blockData) => {
    console.log('🎯 Receiving block configuration handoff:', blockData);
    
    // Update activeRun with fresh data if provided
    if (blockData.runData) {
      console.log('📥 Updating active run with fresh data');
      setActiveRun(blockData.runData);
    }
    
    setBlockConfiguration({
      regional_blocks: blockData.regional_blocks,
      member_states: blockData.member_states,
      runId: blockData.runId,
      projectId: blockData.projectId
    });
  
    completeStepAndAdvance('block_selection', 'worksheet');
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

  // Effect to auto-advance company selection
  useEffect(() => {
    if (currentStep === 'company_selection' && buyingCompany && targetCompany) {
      handleCompanySelectionComplete();
    }
  }, [buyingCompany, targetCompany, currentStep]);


  const handleAnalysisNavigation = async () => {
    try {
      // Mark worksheet as complete
      completeStepAndAdvance('worksheet', 'completed');
      
      // Start the analysis (this updates the context)
      startAnalysis(activeRun);
      
      // Navigate to analysis page
      navigate('/mergercontrol/transactionanalysis');
    } catch (error) {
      console.error('Error transitioning to analysis:', error);
    }
  };


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
            Configure your merger control analysis by selecting regional blocks and member states.
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

        {/* Regional Block Selection */}
        {shouldShowStep('block_selection') && (
          <div className={`transition-opacity duration-300 
            ${currentStep === 'block_selection' ? 'opacity-100' : 'opacity-70'}`}
          >
            <RegionalBlockSelector 
              activeRun={activeRun}
              projectName={activeRun?.projectName}
              onWorksheetGenerate={handleWorksheetGenerate}
              disabled={completedSteps.has('block_selection')}
            />
          </div>
        )}

        {/* Regional Block Worksheet */}
        {shouldShowStep('worksheet') && (
          <div className={`transition-opacity duration-300 
            ${currentStep === 'worksheet' ? 'opacity-100' : 'opacity-70'}`}
          >
            <RegionalBlockWorksheet 
              runData={activeRun}
              blockConfiguration={blockConfiguration}
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
    <button 
      onClick={handleAnalysisNavigation}
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
    </div>
  );
};

export default TransactionLoader;
