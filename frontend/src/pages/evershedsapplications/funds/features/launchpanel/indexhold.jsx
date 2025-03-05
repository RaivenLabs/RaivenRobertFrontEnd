// src/components/FundLoader/steps/FundLaunchPanel.jsx
import React, { useState, useEffect } from 'react';
import { FolderPlus, Building2, Search } from 'lucide-react';
import { useFundContext } from '../../../../../context/FundContext';

const FundLaunchPanel = ({ onComplete, disabled }) => {
  // State Management
  const [registryData, setRegistryData] = useState(null);
  const [selectedFunds, setSelectedFunds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isStepCompleted, setIsStepCompleted] = useState(false);

  const { 
    setProject,
    clearSession
  } = useFundContext();

  // Load registry data
  useEffect(() => {
    const fetchRegistry = async () => {
      try {
        const response = await fetch('/api/funds/registry');
        const data = await response.json();
        setRegistryData(data);
      } catch (error) {
        console.error('Error loading fund registry:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegistry();
  }, []);

  // Reset on mount
  useEffect(() => {
    console.log('🔄 Launch Panel mounted - clearing any existing selections');
    clearSession();
    setIsConfirmed(false);
    setIsStepCompleted(false);
  }, []);

  // Debug logging
  useEffect(() => {
    console.log('🔍 Launch Panel State:', {
      selectedFunds,
      isConfirmed,
      isStepCompleted
    });
  }, [selectedFunds, isConfirmed, isStepCompleted]);

  // Handle selection completion
  useEffect(() => {
    if (!isStepCompleted && selectedFunds.length > 0 && isConfirmed) {
      console.log('✨ Launch selection confirmed:', { funds: selectedFunds });
      setIsStepCompleted(true);
      
      // Create new project in context with selected funds
      setProject({
        name: 'Fund Family Analysis',
        id: Date.now().toString(),
        type: 'fund_analysis',
        selectedFunds: selectedFunds
      });
      
      onComplete();
    }
  }, [selectedFunds, isConfirmed, isStepCompleted, onComplete, setProject]);

  const handleFundToggle = (frn) => {
    if (!isStepCompleted) {
      setSelectedFunds(prev => {
        const isSelected = prev.includes(frn);
        return isSelected 
          ? prev.filter(id => id !== frn)
          : [...prev, frn];
      });
      setIsConfirmed(false);
    }
  };

  const handleConfirm = () => {
    console.log('🔒 Confirming fund selection:', selectedFunds);
    setIsConfirmed(true);
  };

  // simpler utility function
const getNestedValue = (obj, path, defaultValue = null) => {
  try {
    return path.split('.').reduce((current, key) => 
      current && current[key] !== undefined ? current[key] : defaultValue, obj);
  } catch {
    return defaultValue;
  }
};



  const handleReset = () => {
    console.log('🔄 Resetting fund selection');
    setSelectedFunds([]);
    setIsConfirmed(false);
    setIsStepCompleted(false);
    setSearchTerm('');
  };

  // Filter funds based on search term
  const filteredFunds = registryData?.firms 
    ? Object.entries(registryData.firms).filter(([frn, fund]) => 
        fund.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fund.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        frn.includes(searchTerm)
      )
    : [];

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-royalBlue"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-lg font-semibold text-royalBlue mb-1">
            Fund Selection
          </h3>
          <p className="text-sm text-gray-600">
            {isStepCompleted 
              ? `Selected ${selectedFunds.length} funds for analysis`
              : "Select the funds you want to analyze"}
          </p>
        </div>

        {/* Search Box */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg
                     focus:outline-none focus:ring-1 focus:ring-royalBlue focus:border-royalBlue"
            placeholder="Search funds by name, type, or FRN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Fund Selection List */}
        <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
          <div className="divide-y divide-gray-200">
            {filteredFunds.map(([frn, fund]) => (
              <div 
                key={frn}
                className={`p-4 hover:bg-sky-50 transition-colors
                  ${selectedFunds.includes(frn) ? 'bg-sky-50' : ''}`}
              >
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedFunds.includes(frn)}
                    onChange={() => handleFundToggle(frn)}
                    className="mt-1 h-4 w-4 text-royalBlue rounded
                             focus:ring-royalBlue border-gray-300"
                    disabled={isStepCompleted}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{fund.name}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      <span className="mr-3">FRN: {frn}</span>
                      <span className="mr-3">Type: {fund.type}</span>
                      <span>Status: {fund.status}</span>
                    </div>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        {!isStepCompleted && (
          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {selectedFunds.length} funds selected
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg 
                           font-medium hover:bg-gray-300"
                >
                  Reset
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={selectedFunds.length === 0}
                  className={`px-4 py-2 rounded-lg font-medium 
                    ${selectedFunds.length === 0
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-royalBlue text-white hover:bg-blue-700'}`}
                >
                  Confirm Selection
                </button>
              </div>
            </div>
            
            {isConfirmed && (
              <div className="text-center text-green-600 font-medium">
                ✓ Fund selection confirmed
              </div>
            )}
          </div>
        )}

        {/* Selection Summary */}
        {selectedFunds.length > 0 && (
          <div className="mt-4 p-4 bg-sky-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Selected Funds:</h4>
            <div className="space-y-2">
              {selectedFunds.map(frn => (
                <div key={frn} className="text-sm text-gray-600">
                  {registryData.firms[frn].name} (FRN: {frn})
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FundLaunchPanel;
