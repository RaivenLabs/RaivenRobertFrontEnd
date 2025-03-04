// src/pages/eversheds/applications/funds/features/loader/index.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, Save, CheckCircle, XCircle } from 'lucide-react';
import { useFundContext } from '../../../../../context/FundContext';
import LaunchPanel from '../launchpanel';
import QueryBuilder from '../querybuilder';
import FundFamiliesTable from '../fundfamilies';

const FundLoader = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('launch');
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  
  const { clearSession } = useFundContext();

  // Helper to mark a step as complete and move to next
  const completeStepAndAdvance = (completed, nextStep) => {
    console.log(`✅ Completing step ${completed}, advancing to ${nextStep}`);
    setCompletedSteps(prev => new Set([...prev, completed]));
    setCurrentStep(nextStep);
  };

  // Step completion handlers
  const handleLaunchComplete = () => {
    console.log('🚀 Launch phase complete, moving to query construction');
    completeStepAndAdvance('launch', 'query');
  };

  const handleQueryComplete = () => {
    console.log('🔍 Query construction complete, moving to results');
    completeStepAndAdvance('query', 'results');
  };

  const handleResultsComplete = () => {
    console.log('✨ Results processing complete');
    completeStepAndAdvance('results', 'completed');
  };

  // Helper to check if we should show a component
  const shouldShowStep = (step) => {
    return currentStep === step || completedSteps.has(step);
  };

  // Handle discarding work
  const handleDiscard = () => {
    console.log('🗑️ Discarding current work');
    clearSession();
    navigate('/funds/dashboard');
  };

  return (
    <div className="p-6 bg-ivory min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center mb-4">
          <Scale className="text-royal-blue w-6 h-6 mr-2" />
          <h2 className="text-2xl font-semibold text-royal-blue">
            Fund Family Search
          </h2>
        </div>
        <div className="prose max-w-none">
          <p className="text-gray-600 mb-6">
            Build and execute your fund search through these steps:
          </p>
          
          {/* Process Steps Indicator */}
          <div className="flex items-center space-x-4 mb-6">
            {[
              { id: 'launch', label: 'Launch Search' },
              { id: 'query', label: 'Construct Query' },
              { id: 'results', label: 'Process Results' }
            ].map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center">
                  <div className={`rounded-full h-8 w-8 flex items-center justify-center
                    ${currentStep === step.id ? 'bg-royal-blue text-white' :
                      completedSteps.has(step.id) ? 'bg-green-500 text-white' :
                      'bg-gray-200 text-gray-600'}`}
                  >
                    {completedSteps.has(step.id) ? '✓' : index + 1}
                  </div>
                  <span className={`ml-2 ${currentStep === step.id ? 'text-royal-blue font-medium' :
                    completedSteps.has(step.id) ? 'text-green-500' : 'text-gray-600'}`}>
                    {step.label}
                  </span>
                </div>
                {index < 2 && (
                  <div className={`flex-1 h-1 ${completedSteps.has(step.id) ? 'bg-green-500' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Progressive Steps */}
      <div className="space-y-6">
        {/* Launch Panel */}
        {shouldShowStep('launch') && (
          <div className={`transition-opacity duration-300 
            ${currentStep === 'launch' ? 'opacity-100' : 'opacity-70'}`}
          >
            <LaunchPanel 
              onComplete={handleLaunchComplete}
              disabled={completedSteps.has('launch')}
            />
          </div>
        )}

        {/* Query Builder */}
        {shouldShowStep('query') && (
          <div className={`transition-opacity duration-300 
            ${currentStep === 'query' ? 'opacity-100' : 'opacity-70'}`}
          >
            <QueryBuilder
              onComplete={handleQueryComplete}
              disabled={completedSteps.has('query')}
            />
          </div>
        )}

            {/* Results Handler */}
        {shouldShowStep('results') && (
        <div className={`transition-opacity duration-300 
            ${currentStep === 'results' ? 'opacity-100' : 'opacity-70'}`}
        >
            <FundFamiliesTable 
            onComplete={handleQueryComplete}
            disabled={completedSteps.has('results')}
            />
        </div>
        )}

        {/* Action Panel */}
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <button 
                onClick={handleDiscard}
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

            {currentStep === 'completed' && (
              <button 
                onClick={() => navigate('/funds/dashboard')}
                className="px-6 py-2 bg-teal text-white rounded-lg 
                          hover:bg-teal/90 transition-colors
                          flex items-center space-x-2"
              >
                <CheckCircle className="w-5 h-5" />
                <span>View Dashboard</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundLoader;
