import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, Save, CheckCircle, XCircle } from 'lucide-react';
import BackgroundPanel from '../backgroundcheck';
import DocumentVerification from '../verification';
import ComplianceRecord from '../compliancereview';
import RemediationPlanning from '../planning';

const RecruitingLoader = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('background');
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  
  // Define our workflow steps
  const workflowSteps = [
    { 
      id: 'background',
      label: 'Initial Assessment',
      description: 'Preliminary review of nationality status and documentation requirements'
    },
    { 
      id: 'verification',
      label: 'Document Verification',
      description: 'Comprehensive document examination and authenticity verification'
    },
    { 
      id: 'compliance',
      label: 'Compliance Documentation',
      description: 'Statutory record-keeping and compliance certification'
    },
    { 
      id: 'planning',
      label: 'Planning',
      description: 'Risk mitigation and ongoing compliance management'
    }
  ];

  // Helper to mark a step as complete and move to next
  const completeStepAndAdvance = (completed, nextStep) => {
    console.log(`✅ Completing ${completed} phase, advancing to ${nextStep}`);
    setCompletedSteps(prev => new Set([...prev, completed]));
    setCurrentStep(nextStep);
  };

  // Step completion handlers
  const handleBackgroundComplete = () => {
    completeStepAndAdvance('background', 'verification');
  };

  const handleVerificationComplete = () => {
    completeStepAndAdvance('verification', 'compliance');
  };

  const handleComplianceComplete = () => {
    completeStepAndAdvance('compliance', 'planning');
  };

  const handlePlanningComplete = () => {
    completeStepAndAdvance('planning', 'completed');
  };

  const handleRemediationComplete = () => {
    completeStepAndAdvance('planning', 'completed');
  };

  // Helper to check if we should show a component
  const shouldShowStep = (step) => {
    return currentStep === step || completedSteps.has(step);
  };

  // Handle discarding assessment
  const handleDiscard = () => {
    if (window.confirm('This will discard all current compliance assessment progress. Would you like to proceed?')) {
      navigate('/rtw/dashboard');
    }
  };

  return (
    <div className="p-6 bg-ivory min-h-screen">
      {/* Header */}
      <div className="bg-white/80 rounded-lg shadow p-6 mb-6">
        <div className="flex items-center mb-4">
          <Scale className="text-royal-blue w-6 h-6 mr-2" />
          <h2 className="text-2xl font-semibold text-royal-blue">
            Right to Work Compliance Assessment
          </h2>
        </div>
        <div className="prose max-w-none">
          <p className="text-gray-600 mb-6">
            Comprehensive right to work verification and ongoing compliance assurance process.
          </p>
          
          {/* Process Steps Indicator */}
          <div className="flex items-center space-x-4 mb-6">
            {workflowSteps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center">
                  <div className={`rounded-full h-8 w-8 flex items-center justify-center
                    ${currentStep === step.id ? 'bg-royal-blue text-white' :
                      completedSteps.has(step.id) ? 'bg-green-500 text-white' :
                      'bg-gray-200 text-gray-600'}`}
                  >
                    {completedSteps.has(step.id) ? '✓' : index + 1}
                  </div>
                  <div className="ml-2">
                    <span className={`block ${currentStep === step.id ? 'text-royal-blue font-medium' :
                      completedSteps.has(step.id) ? 'text-green-500' : 'text-gray-600'}`}>
                      {step.label}
                    </span>
                    <span className="text-xs text-gray-500 hidden md:block">
                      {step.description}
                    </span>
                  </div>
                </div>
                {index < workflowSteps.length - 1 && (
                  <div className={`flex-1 h-1 ${completedSteps.has(step.id) ? 'bg-green-500' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Progressive Steps */}
      <div className="space-y-6">
        {shouldShowStep('background') && (
          <div className={`transition-opacity duration-300 
            ${currentStep === 'background' ? 'opacity-100' : 'opacity-70'}`}
          >
            <BackgroundPanel 
              onComplete={handleBackgroundComplete}
              disabled={completedSteps.has('background')}
            />
          </div>
        )}

        {shouldShowStep('verification') && (
          <div className={`transition-opacity duration-300 
            ${currentStep === 'verification' ? 'opacity-100' : 'opacity-70'}`}
          >
            <DocumentVerification
              onComplete={handleVerificationComplete}
              disabled={completedSteps.has('verification')}
            />
          </div>
        )}

        {shouldShowStep('compliance') && (
          <div className={`transition-opacity duration-300 
            ${currentStep === 'compliance' ? 'opacity-100' : 'opacity-70'}`}
          >
            <ComplianceRecord
              onComplete={handleComplianceComplete}
              disabled={completedSteps.has('compliance')}
            />
          </div>
        )}

        {shouldShowStep('planning') && (
          <div className={`transition-opacity duration-300 
            ${currentStep === 'planning' ? 'opacity-100' : 'opacity-70'}`}
          >
            <RemediationPlanning
              onComplete={handleRemediationComplete}
              disabled={completedSteps.has('planning')}
            />
          </div>
        )}

        {/* Action Panel */}
        <div className="bg-white/80 rounded-lg shadow p-6 mt-8">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <button 
                onClick={handleDiscard}
                className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 
                          rounded-lg transition-colors flex items-center space-x-2"
              >
                <XCircle className="w-5 h-5" />
                <span>Terminate Assessment</span>
              </button>
              
              <button 
                className="px-4 py-2 bg-royal-blue/10 text-royal-blue hover:bg-royal-blue/20 
                          rounded-lg transition-colors flex items-center space-x-2"
              >
                <Save className="w-5 h-5" />
                <span>Save Assessment State</span>
              </button>
            </div>

            {currentStep === 'completed' && (
              <button 
                onClick={() => navigate('/rtw/advisory-services')}
                className="px-6 py-2 bg-royal-blue text-white rounded-lg 
                          hover:bg-royal-blue/90 transition-colors
                          flex items-center space-x-2"
              >
                <CheckCircle className="w-5 h-5" />
                <span>View Advisory Recommendations</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruitingLoader;
