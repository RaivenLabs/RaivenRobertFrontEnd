// src/components/mergercontrol/components/RunProgressBar.jsx
import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';

const RunProgressBar = ({ steps, completedSteps, currentStep }) => {
  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="relative">
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
          <div
            style={{ 
              width: `${(completedSteps.length / steps.length) * 100}%`
            }}
            className="shadow-none flex flex-col text-center whitespace-nowrap 
                     text-white justify-center bg-royalBlue transition-all duration-500"
          />
        </div>

        {/* Steps */}
        <div className="flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = currentStep === step.id;
            
            return (
              <div 
                key={step.id}
                className={`flex flex-col items-center ${
                  index === steps.length - 1 ? 'items-end' : 
                  index === 0 ? 'items-start' : ''
                }`}
              >
                {/* Step Icon */}
                <div className={`
                  rounded-full w-8 h-8 flex items-center justify-center
                  ${isCompleted ? 'text-green-500' : 
                    isCurrent ? 'text-royalBlue' : 'text-gray-400'}
                `}>
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </div>

                {/* Step Label */}
                <span className={`
                  mt-2 text-sm
                  ${isCompleted ? 'text-green-600' :
                    isCurrent ? 'text-royalBlue font-medium' : 'text-gray-500'}
                `}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RunProgressBar;
