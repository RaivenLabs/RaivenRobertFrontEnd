// src/components/FundLoader/steps/QueryBuilder.jsx
import React, { useState, useEffect } from 'react';
import { FileSearch, Filter, AlertCircle } from 'lucide-react';
import { useFundContext } from '../../../../../context/FundContext';

const QueryBuilder = ({ onComplete, disabled }) => {
  // State Management
  const [queryType, setQueryType] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isStepCompleted, setIsStepCompleted] = useState(false);
  
  const { selectedFunds } = useFundContext();

 // Add this useEffect to see what's in context when component mounts
 useEffect(() => {
  console.log('🔍 QueryBuilder mounted - Context funds:', selectedFunds);
}, [selectedFunds]);



  // Available query types
  const queryTypes = [
    {
      id: 'general_details',
      label: 'General Details',
      description: 'Basic firm information, status, and registration details',
      active: true
    },
    {
      id: 'permissions',
      label: 'Permissions & Requirements',
      description: 'Regulatory permissions and operational requirements',
      active: false
    },
    {
      id: 'disciplinary',
      label: 'Disciplinary History',
      description: 'Past regulatory actions and compliance history',
      active: false
    },
    {
      id: 'passports',
      label: 'Passports',
      description: 'Cross-border authorizations and permissions',
      active: false
    },
    {
      id: 'regulators',
      label: 'Regulators',
      description: 'Regulatory oversight and supervision details',
      active: false
    }
  ];

  // Handle query type selection
  const handleQuerySelection = (type) => {
    setQueryType(type);
    setIsConfirmed(false);
  };

  const handleConfirm = async () => {
    try {
      console.log('🔍 Starting query execution for type:', queryType);
      
      const fundFRNs = selectedFunds.map(fund => fund.frn);
      console.log('📋 FRNs being sent to API:', fundFRNs);
      
      const response = await fetch('/api/funds/query/general-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          queryType: queryType,
          funds: fundFRNs
        })
      });
  
      const results = await response.json();
      // Add these more detailed logs:
      console.log('✨ Raw query results:', JSON.stringify(results, null, 2));
      console.log('📊 Query data:', results.results[0].Data);  // This should show the actual fund data
  
      setIsConfirmed(true);
      setIsStepCompleted(true);
      onComplete();
    } catch (error) {
      console.error('❌ Error executing query:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-lg font-semibold text-royalBlue mb-1">
            Query Configuration
          </h3>
          <p className="text-sm text-gray-600">
            Select the type of information you want to retrieve for your selected funds
          </p>
        </div>

        {/* Selected Funds Summary */}
        <div className="bg-sky-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <FileSearch className="h-5 w-5 text-royalBlue" />
            <span>Querying data for {selectedFunds?.length || 0} selected funds</span>
          </div>
        </div>

        {/* Query Type Selection */}
        <div className="grid grid-cols-1 gap-4">
          {queryTypes.map((type) => (
            <div
              key={type.id}
              onClick={() => !disabled && type.active && handleQuerySelection(type.id)}
              className={`p-4 rounded-lg border transition-all
                ${type.active 
                  ? queryType === type.id
                    ? 'border-royalBlue bg-sky-50'
                    : 'border-gray-200 hover:border-royalBlue cursor-pointer'
                  : 'border-gray-200 opacity-50 cursor-not-allowed'}
              `}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">{type.label}</h4>
                  <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                </div>
                {!type.active && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    Coming Soon
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Warning for inactive selections */}
        {queryType && !queryTypes.find(t => t.id === queryType)?.active && (
          <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 p-4 rounded-lg">
            <AlertCircle className="h-5 w-5" />
            <span>This query type is not yet available</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setQueryType('')}
            className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg 
                     hover:bg-gray-50 font-medium"
          >
            Reset
          </button>
          <button
            onClick={handleConfirm}
            disabled={!queryType || !queryTypes.find(t => t.id === queryType)?.active}
            className={`px-4 py-2 rounded-lg font-medium
              ${queryType && queryTypes.find(t => t.id === queryType)?.active
                ? 'bg-royalBlue text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
          >
            Configure Query
          </button>
        </div>
      </div>
    </div>
  );
};

export default QueryBuilder;
