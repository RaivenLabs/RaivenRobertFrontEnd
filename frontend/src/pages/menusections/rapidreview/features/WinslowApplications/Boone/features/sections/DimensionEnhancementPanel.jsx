import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronDownIcon, ChevronUpIcon, CheckIcon, XMarkIcon, InformationCircleIcon } from '@heroicons/react/24/solid';

const DimensionEnhancementPanel = ({ 
  projectId,
  projectName,
  onApplyChanges,
  onCancel
}) => {
  const [currentDimensions, setCurrentDimensions] = useState([]);
  const [suggestedDimensions, setSuggestedDimensions] = useState([]);
  const [expandedDimensions, setExpandedDimensions] = useState({});
  const [selectedDimensions, setSelectedDimensions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appliedChanges, setAppliedChanges] = useState(false); // Track if changes were applied

  // Fetch both current and suggested dimensions from the database
  useEffect(() => {
    const fetchDimensions = async () => {
      setIsLoading(true);
      try {
        // Fetch current dimensions (view = 'on')
        const currentResponse = await axios.get('/api/dashboard/dimensions', {
          params: { view: 'on' }
        });
        
        // Fetch suggested dimensions (view = 'off')
        const suggestedResponse = await axios.get('/api/dashboard/dimensions', {
          params: { view: 'off' }
        });
        
        // Process the responses
        const currentDims = currentResponse.data.dimensions || [];
        const suggestedDims = suggestedResponse.data.dimensions || [];
        
        // Initialize expanded state for all dimensions (collapsed by default)
        const expandedState = {};
        [...currentDims, ...suggestedDims].forEach(dim => {
          expandedState[dim.id] = false;
        });
        
        // Initialize selected state for suggested dimensions (all selected by default)
        const selectedState = {};
        suggestedDims.forEach(dim => {
          selectedState[dim.id] = true;
        });
        
        // Update state
        setCurrentDimensions(currentDims);
        setSuggestedDimensions(suggestedDims);
        setExpandedDimensions(expandedState);
        setSelectedDimensions(selectedState);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching dimensions:", err);
        setError("Failed to load dimensions. Please try again.");
        setIsLoading(false);
      }
    };
    
    fetchDimensions();
  }, [projectId]);

  // Toggle the expanded state of a dimension
  const toggleDimension = (dimensionId) => {
    setExpandedDimensions(prev => ({
      ...prev,
      [dimensionId]: !prev[dimensionId]
    }));
  };
  
  // Toggle selection of a suggested dimension
  const toggleSelection = (dimensionId) => {
    setSelectedDimensions(prev => ({
      ...prev,
      [dimensionId]: !prev[dimensionId]
    }));
  };
  
  // Calculate total selected dimensions and attributes
  const totalSelectedDimensions = Object.values(selectedDimensions).filter(Boolean).length;
  const totalSelectedAttributes = suggestedDimensions
    .filter(dim => selectedDimensions[dim.id])
    .reduce((total, dim) => total + (dim.attributeCount || 0), 0);
  
  // Handle apply button click
  const handleApply = async () => {
    try {
      // Get the IDs of selected dimensions
      const selectedDimensionIds = Object.keys(selectedDimensions)
        .filter(dimId => selectedDimensions[dimId]);
      
      // Update the 'view' status in the database
      await axios.post('/api/dashboard/dimensions/update-view', {
        dimensionIds: selectedDimensionIds,
        view: 'on'
      });
      
      // Set the applied changes flag to true
      setAppliedChanges(true);
      
      // Store the selected suggested dimensions for later use
      const selectedSuggestedDimensions = suggestedDimensions.filter(dim => 
        selectedDimensions[dim.id]
      );
      
      // Create a new array with both current and newly selected dimensions
      setCurrentDimensions(prevDimensions => [
        ...prevDimensions,
        ...selectedSuggestedDimensions
      ]);
      
      // Clear the suggested dimensions as they're now part of current
      setSuggestedDimensions([]);
      
      // We'll pass these selected dimensions to the parent when the user clicks "Continue"
      
    } catch (err) {
      console.error("Error applying changes:", err);
      setError("Failed to apply changes. Please try again.");
    }
  };
  
  // Render a dimension card with attributes
  const renderDimensionCard = (dimension, isSuggested = false) => {
    const isExpanded = expandedDimensions[dimension.id];
    const isSelected = isSuggested ? selectedDimensions[dimension.id] : true;
    
    return (
      <div 
        key={dimension.id} 
        className={`mb-3 rounded-lg border transition-colors ${
          isSuggested 
            ? isSelected 
              ? 'bg-green-50 border-green-300' 
              : 'bg-white border-gray-200'
            : 'bg-blue-50 border-blue-200'
        }`}
      >
        <div className="p-4">
          <div className="flex items-center">
            {/* Checkbox for suggested dimensions */}
            {isSuggested && (
              <div className="mr-3">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded border-green-600 text-green-600 focus:ring-green-500"
                  checked={isSelected}
                  onChange={() => toggleSelection(dimension.id)}
                  id={`dimension-${dimension.id}`}
                />
              </div>
            )}
            
            {/* Dimension icon and name */}
            <div className="flex items-center flex-1">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                isSuggested ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                <span className="font-semibold text-lg">{dimension.displayName.charAt(0)}</span>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{dimension.displayName}</h3>
                <span className="text-sm text-gray-500">
                  {dimension.attributeCount || 0} attributes
                </span>
              </div>
            </div>
            
            {/* Badge for dimension type */}
            <div className="mr-4">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                isSuggested ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {isSuggested ? 'Suggested' : 'Current'}
              </span>
            </div>
            
            {/* Expand/collapse button */}
            <button
              onClick={() => toggleDimension(dimension.id)}
              className={`p-1 rounded-full ${
                isSuggested && isSelected
                  ? 'hover:bg-green-200 text-green-700'
                  : isSuggested
                    ? 'hover:bg-gray-200 text-gray-700' 
                    : 'hover:bg-blue-200 text-blue-700'
              }`}
            >
              {isExpanded ? (
                <ChevronUpIcon className="h-6 w-6" />
              ) : (
                <ChevronDownIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Expanded attributes section */}
        {isExpanded && (
          <div className={`border-t px-4 py-3 ${
            isSuggested 
              ? isSelected ? 'border-green-200 bg-green-50' : 'border-gray-200' 
              : 'border-blue-200 bg-blue-50'
          }`}>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Attributes</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto px-2">
              {dimension.attributes ? (
                dimension.attributes.map((attr, index) => (
                  <div 
                    key={index} 
                    className={`p-2 rounded ${
                      isSuggested 
                        ? isSelected ? 'bg-green-100' : 'bg-gray-100' 
                        : 'bg-blue-100'
                    }`}
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">{attr.displayName}</span>
                      <span className="text-xs text-gray-500">{attr.dataType}</span>
                    </div>
                    {attr.description && (
                      <p className="text-xs text-gray-600 mt-1">{attr.description}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">
                  Attributes will be loaded when expanded
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 flex justify-center items-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600">Loading dimensions...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 rounded-lg p-8 flex justify-center items-center h-96">
        <div className="text-center text-red-600">
          <XMarkIcon className="h-12 w-12 mx-auto mb-4" />
          <p className="font-medium">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg">
      {/* Header Panel */}
      <div className="bg-blue-800 text-white p-4 rounded-t-lg shadow">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">
            {!appliedChanges 
              ? 'Star Schema Enhancement' 
              : 'Schema Updated Successfully'}
          </h1>
          <span className="text-lg">{projectName || "Unnamed Project"}</span>
        </div>
      </div>

      {/* Description Panel */}
      <div className="bg-blue-50 p-4 border-b border-blue-100">
        <div className="flex items-start">
          <InformationCircleIcon className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
          <div>
            {!appliedChanges ? (
              <>
                <p className="text-blue-800 font-medium">
                  Based on your uploaded documents, we've identified potential enhancements to your star schema.
                </p>
                <p className="text-blue-700 mt-1 text-sm">
                  These recommendations will add dimensions and attributes to your schema while preserving the core constellation structure.
                </p>
              </>
            ) : (
              <>
                <p className="text-blue-800 font-medium">
                  Your schema has been successfully updated with the selected dimensions.
                </p>
                <p className="text-blue-700 mt-1 text-sm">
                  Below is your complete schema including the newly added dimensions. Click "Continue to Model Dashboard" when ready.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Dimensions Accordion */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              {!appliedChanges 
                ? 'Schema Dimensions' 
                : 'Updated Schema'}
            </h2>
            <p className="text-sm text-gray-500">
              {!appliedChanges
                ? 'Your current dimensions and suggested enhancements'
                : 'All dimensions in your schema including newly added ones'}
            </p>
          </div>
          
          <div className="p-4">
            {!appliedChanges ? (
              <>
                {/* SELECTION MODE: Current Dimensions Section */}
                {currentDimensions.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-md font-semibold text-blue-700 mb-3">
                      Current Dimensions
                    </h3>
                    {currentDimensions.map(dimension => renderDimensionCard(dimension, false))}
                  </div>
                )}
                
                {/* SELECTION MODE: Suggested Dimensions Section */}
                {suggestedDimensions.length > 0 && (
                  <div>
                    <h3 className="text-md font-semibold text-green-700 mb-3">
                      Suggested Enhancements
                    </h3>
                    {suggestedDimensions.map(dimension => renderDimensionCard(dimension, true))}
                  </div>
                )}
              </>
            ) : (
              <>
                {/* APPLIED CHANGES: Complete Schema Section */}
                <div>
                  <div className="flex items-center mb-4 bg-green-50 p-3 rounded-lg border border-green-200">
                    <div className="h-8 w-8 bg-green-100 text-green-800 rounded-full flex items-center justify-center mr-2">
                      <CheckIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-md font-semibold text-green-800">
                        Schema Updated Successfully
                      </h3>
                      <p className="text-sm text-green-700">
                        New dimensions and attributes have been added to your schema
                      </p>
                    </div>
                  </div>

                  {/* All dimensions accordion */}
                  {currentDimensions.map(dimension => renderDimensionCard(dimension, false))}
                </div>
              </>
            )}
            
            {/* Empty state */}
            {currentDimensions.length === 0 && suggestedDimensions.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No dimensions found for this project.</p>
              </div>
            )}
          </div>
        </div>

        {/* Summary and Action Bar */}
        <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col sm:flex-row justify-between items-center">
          {!appliedChanges ? (
            <>
              <div className="mb-4 sm:mb-0">
                <span className="text-gray-700">
                  {totalSelectedDimensions} dimensions selected 
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
                  disabled={totalSelectedDimensions === 0}
                >
                  <CheckIcon className="h-5 w-5 mr-1" />
                  Apply Selected
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4 sm:mb-0">
                <span className="text-gray-700">
                  Your schema now contains {currentDimensions.length} dimensions with all their associated attributes
                </span>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => onApplyChanges(suggestedDimensions.filter(dim => selectedDimensions[dim.id]))}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                >
                  <CheckIcon className="h-5 w-5 mr-1" />
                  Continue to Model Dashboard
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DimensionEnhancementPanel;
