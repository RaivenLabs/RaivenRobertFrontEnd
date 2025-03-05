import React from 'react';

const NavigationButtons = ({ 
  currentStep, 
  totalSteps, 
  canProceed, 
  isProcessing, 
  onPrevious, 
  onNext, 
  onSubmit,
  submitLabel = 'Complete Configuration'
}) => {
  return (
    <div className="flex justify-between mt-8">
      {currentStep > 1 ? (
        <button
          type="button"
          onClick={onPrevious}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Previous
        </button>
      ) : (
        <div></div>
      )}
      
      {currentStep < totalSteps ? (
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium ${
            canProceed
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Next
        </button>
      ) : (
        <button
          type="button"
          onClick={onSubmit}
          disabled={isProcessing}
          className="px-4 py-2 rounded-md shadow-sm text-sm font-medium bg-green-600 text-white hover:bg-green-700"
        >
          {isProcessing ? 'Processing...' : submitLabel}
        </button>
      )}
    </div>
  );
};

export default NavigationButtons;
