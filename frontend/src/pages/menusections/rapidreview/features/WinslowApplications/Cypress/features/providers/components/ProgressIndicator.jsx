import React from 'react';

const ProgressIndicator = ({ currentStep, steps }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep >= index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className={`h-1 flex-1 mx-2 ${
                currentStep >= index + 2 ? 'bg-blue-600' : 'bg-gray-200'
              }`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-between text-sm mt-2">
        {steps.map((step, index) => (
          <div key={index} className="text-center w-20">{step}</div>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;
