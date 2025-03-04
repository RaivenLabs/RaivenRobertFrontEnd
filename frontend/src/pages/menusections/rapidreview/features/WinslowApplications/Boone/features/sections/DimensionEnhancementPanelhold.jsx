import React, { useState } from 'react';

const DimensionEnhancementPanel = ({ 
  projectName,
  currentDimensions,
  suggestedEnhancements,
  onApplyChanges,
  onCancel
}) => {
  // Initialize state for tracking which enhancements are selected
  const [selectedEnhancements, setSelectedEnhancements] = useState(
    suggestedEnhancements.map((enhancement) => ({
      ...enhancement,
      selected: false
    }))
  );

  // Toggle selection for an enhancement
  const toggleSelection = (index) => {
    const updatedEnhancements = [...selectedEnhancements];
    updatedEnhancements[index].selected = !updatedEnhancements[index].selected;
    setSelectedEnhancements(updatedEnhancements);
  };

  // Handle apply button click
  const handleApply = () => {
    const enhancementsToApply = selectedEnhancements.filter(enhancement => enhancement.selected);
    onApplyChanges(enhancementsToApply);
  };

  // Calculate total selected attribute count
  const totalSelectedAttributes = selectedEnhancements
    .filter(enhancement => enhancement.selected)
    .reduce((total, enhancement) => 
      total + enhancement.attributeGroups.reduce((groupTotal, group) => 
        groupTotal + group.count, 0), 0);

  return (
    <div className="bg-gray-50 rounded-lg">
      {/* Header Panel */}
      <div className="bg-blue-800 text-white p-4 rounded-t-lg shadow">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Star Schema Enhancement</h1>
          <span className="text-lg">{projectName}</span>
        </div>
      </div>

      {/* Description Panel */}
      <div className="bg-blue-50 p-4 border-b border-blue-100">
        <div className="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-blue-800 font-medium">
              Based on your uploaded documents, we've identified potential enhancements to your star schema.
            </p>
            <p className="text-blue-700 mt-1 text-sm">
              These recommendations will add dimensions and attributes to your schema while preserving the core constellation structure.
            </p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Current Dimensions Panel */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex-1">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Current Dimensions</h2>
              <p className="text-sm text-gray-500">Your star schema's existing dimensions</p>
            </div>
            
            <div className="p-4">
              <div className="bg-gray-50 rounded-lg border border-gray-200 h-96 overflow-y-auto">
                {currentDimensions.map((dimension, index) => (
                  <div 
                    key={index} 
                    className="m-2 bg-white p-3 rounded-lg shadow-sm border border-gray-200 hover:border-blue-200 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-blue-800 font-semibold">{dimension.name.charAt(0)}</span>
                        </div>
                        <span className="font-medium text-gray-800">{dimension.name}</span>
                      </div>
                      <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {dimension.attributeCount} attributes
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Suggested Enhancements Panel */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex-1">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-green-600">Suggested Enhancements</h2>
              <p className="text-sm text-gray-500">Select dimensions to add to your schema</p>
            </div>
            
            <div className="p-4">
              <div className="bg-gray-50 rounded-lg border border-gray-200 h-96 overflow-y-auto">
                {selectedEnhancements.map((enhancement, index) => (
                  <div 
                    key={index} 
                    className={`m-2 p-3 rounded-lg border ${enhancement.selected ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200'} transition-colors`}
                  >
                    <div className="flex items-start">
                      <div className="mr-3 mt-1.5">
                        <input
                          type="checkbox"
                          className="h-5 w-5 rounded border-green-600 text-green-600 focus:ring-green-500"
                          checked={enhancement.selected}
                          onChange={() => toggleSelection(index)}
                          id={`enhancement-${index}`}
                        />
                      </div>
                      <div className="flex-1">
                        <label htmlFor={`enhancement-${index}`} className="flex justify-between cursor-pointer">
                          <h3 className="font-bold text-gray-800">{enhancement.name}</h3>
                          <span className="text-sm text-gray-500">
                            {enhancement.attributeGroups.reduce((total, group) => total + group.count, 0)} attributes
                          </span>
                        </label>
                        <div className="mt-3 space-y-1">
                          {enhancement.attributeGroups.map((group, groupIndex) => (
                            <div key={groupIndex} className="flex justify-between text-sm pl-1">
                              <span className="text-gray-600">{group.name}</span>
                              <span className="text-gray-500">{group.count} attributes</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Summary and Action Bar */}
        <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-4 sm:mb-0">
            <span className="text-gray-700">
              {selectedEnhancements.filter(e => e.selected).length} dimensions selected 
              <span className="mx-1 text-gray-400">|</span>
              {totalSelectedAttributes} attributes to add
            </span>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Skip
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
              disabled={!selectedEnhancements.some(e => e.selected)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Apply Selected
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DimensionEnhancementPanel;
