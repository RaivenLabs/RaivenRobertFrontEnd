import React from 'react';
import PanelHeader from '../../../../../../components/shared/common/PanelHeader';
import { List, Loader2, AlertCircle } from 'lucide-react';

const ProgramClassSelector = ({
  isActive,
  availableProgramClasses,
  programClass,
  setProgramClass,
  isLoadingClasses,
  classesError,
  onRetry
}) => {
  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-gray-100">
      <PanelHeader 
        title="Select Program Class" 
        isActive={isActive}
        icon={List}
      />
      <div className="p-6 space-y-4">
        {!isActive ? (
          <div className="text-center py-8 text-gray-500">
            Complete previous selections first
          </div>
        ) : isLoadingClasses ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-teal" />
            <span className="text-gray-600">Loading program classes...</span>
          </div>
        ) : classesError ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-2 text-red-600">
            <AlertCircle className="w-6 h-6" />
            <span>{classesError}</span>
            <button 
              onClick={onRetry}
              className="text-sm text-teal hover:underline"
            >
              Try Again
            </button>
          </div>
        ) : availableProgramClasses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No program classes available for this selection
          </div>
        ) : (
          <>
            {availableProgramClasses.map((programClassItem) => (
              <button
                key={programClassItem.id}
                onClick={() => setProgramClass(programClassItem.id)}
                className={`w-full p-4 rounded-lg border transition-all
                  ${programClass === programClassItem.id
                    ? 'border-teal bg-teal/5'
                    : 'border-gray-200 hover:border-teal/50'
                  }`}
              >
                <h3 className="font-medium text-gray-800">
                  {programClassItem.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {programClassItem.description}
                </p>
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default ProgramClassSelector;
