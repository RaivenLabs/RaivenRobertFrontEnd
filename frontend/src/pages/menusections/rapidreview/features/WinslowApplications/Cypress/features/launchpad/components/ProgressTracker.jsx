import React from 'react';

const ProgressTracker = ({ currentStep, totalSteps, stepLabels = [] }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNumber = i + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          
          return (
            <div key={stepNumber} className="flex flex-col items-center relative flex-1">
              {/* Connecting line before */}
              {stepNumber > 1 && (
                <div 
                  className={`absolute top-4 left-0 right-1/2 h-1 ${isCompleted ? 'bg-royalBlue' : 'bg-gray-300'}`}
                ></div>
              )}
              
              {/* Connecting line after */}
              {stepNumber < totalSteps && (
                <div 
                  className={`absolute top-4 left-1/2 right-0 h-1 ${stepNumber < currentStep ? 'bg-royalBlue' : 'bg-gray-300'}`}
                ></div>
              )}
              
              {/* Step Circle */}
              <div 
                className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-medium z-10 border-2 
                  ${isActive ? 'bg-royalBlue border-royalBlue' : 
                    isCompleted ? 'bg-royalBlue border-royalBlue' : 
                    'bg-white border-gray-300 text-gray-500'}`}
              >
                {isCompleted ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>
              
              {/* Step Label */}
              <span className={`mt-2 text-xs font-medium ${isActive || isCompleted ? 'text-gray-800' : 'text-gray-500'}`}>
                {stepLabels[i] || `Step ${stepNumber}`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressTracker;
