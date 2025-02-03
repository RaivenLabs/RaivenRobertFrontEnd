import React, { useEffect, useState } from 'react';
import { Building2 } from 'lucide-react';
import { useMergerControl } from '../../../../../../../context/MergerControlContext';

const CompanyInfo = ({ company, type }) => {
  if (!company) return null;

  return (
    <div className="flex items-center space-x-2 text-sm text-gray-600">
      <span>Revenue: {company.revenue.global}</span>
      <span>|</span>
      <span>Sector: {company.sector}</span>
    </div>
  );
};

const TransactionCompanySelector = ({ onComplete, disabled }) => {
  // Add state for confirmation
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isStepCompleted, setIsStepCompleted] = useState(false);
  
  const { 
    buyingCompany,
    targetCompany,
    updateBuyingCompany,
    updateTargetCompany,
    buyingCompanies,
    targetCompanies,
    buyingCompanyData,
    targetCompanyData,
    isLoading,
    clearSelections
  } = useMergerControl();

  // Reset on mount
  useEffect(() => {
    console.log('🔄 Component mounted - clearing any existing selections');
    clearSelections();
    setIsConfirmed(false);
    setIsStepCompleted(false);
  }, []);

  // Debug logging
  useEffect(() => {
    console.log('🔍 Component State:', {
      buyingCompany,
      targetCompany,
      isConfirmed,
      isStepCompleted,
      hasData: {
        buyingCompanyData: !!buyingCompanyData,
        targetCompanyData: !!targetCompanyData
      }
    });
  }, [buyingCompany, targetCompany, isConfirmed, isStepCompleted, buyingCompanyData, targetCompanyData]);

  // Only proceed when explicitly confirmed
  useEffect(() => {
    if (!isStepCompleted && buyingCompany && targetCompany && isConfirmed) {
      console.log('✨ Companies selected and confirmed:', {
        buyer: buyingCompany,
        target: targetCompany,
        isConfirmed
      });
      setIsStepCompleted(true);
      onComplete();
    }
  }, [buyingCompany, targetCompany, isConfirmed, isStepCompleted, onComplete]);

  const handleBuyingCompanyChange = (e) => {
    if (!isStepCompleted) {
      console.log('📝 Updating buying company:', e.target.value);
      updateBuyingCompany(e.target.value);
      setIsConfirmed(false);
    }
  };

  const handleTargetCompanyChange = (e) => {
    if (!isStepCompleted) {
      console.log('📝 Updating target company:', e.target.value);
      updateTargetCompany(e.target.value);
      setIsConfirmed(false);
    }
  };

  const handleConfirm = () => {
    console.log('🔒 Confirming company selection:', {
      buyer: buyingCompany,
      target: targetCompany
    });
    setIsConfirmed(true);
  };

  const handleReset = () => {
    console.log('🔄 Resetting selection');
    clearSelections();
    setIsConfirmed(false);
    setIsStepCompleted(false);
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-6 mb-6`}>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-royalBlue"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 mb-6`}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-lg font-semibold text-royalBlue mb-1">Transaction Companies:</h3>
          <p className="text-sm text-gray-600">
            {isStepCompleted 
              ? "Company selection completed"
              : "Select acquiring and target companies"}
          </p>
        </div>

        {/* Company Selection Section */}
        <div className="space-y-4">
          {/* Acquiring Company Row */}
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 w-64">
                <Building2 className="w-5 h-5 text-royalBlue" />
                <span className="text-gray-700 font-medium">Acquiring Company:</span>
              </div>
              <div className="relative flex-grow">
                <select
                  value={buyingCompany || ''}
                  onChange={handleBuyingCompanyChange}
                  disabled={isStepCompleted}
                  className={`w-full px-4 py-2 bg-white border border-gray-300 rounded-lg 
                            focus:border-royalBlue focus:ring-1 focus:ring-royalBlue
                            appearance-none pr-10
                            ${isStepCompleted ? 'cursor-not-allowed bg-gray-50' : ''}`}
                >
                  <option value="">Select Acquiring Company</option>
                  {Object.entries(buyingCompanies).map(([id, company]) => (
                    <option key={id} value={id}>
                      {company.icon} {company.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className={`h-5 w-5 ${isStepCompleted ? 'text-gray-300' : 'text-gray-400'}`} viewBox="0 0 20 20" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 8l4 4 4-4" />
                  </svg>
                </div>
              </div>
            </div>
            {buyingCompanyData && (
              <div className="ml-[calc(1.25rem+0.5rem+16rem)] text-sm">
                <CompanyInfo company={buyingCompanyData} type="Acquiring" />
              </div>
            )}
          </div>

          {/* Target Company Row */}
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 w-64">
                <Building2 className="w-5 h-5 text-emerald-600" />
                <span className="text-gray-700 font-medium">Target Company:</span>
              </div>
              <div className="relative flex-grow">
                <select
                  value={targetCompany || ''}
                  onChange={handleTargetCompanyChange}
                  disabled={isStepCompleted}
                  className={`w-full px-4 py-2 bg-white border border-gray-300 rounded-lg 
                            focus:border-royalBlue focus:ring-1 focus:ring-royalBlue
                            appearance-none pr-10
                            ${isStepCompleted ? 'cursor-not-allowed bg-gray-50' : ''}`}
                >
                  <option value="">Select Target Company</option>
                  {Object.entries(targetCompanies).map(([id, company]) => (
                    <option key={id} value={id}>
                      {company.icon} {company.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className={`h-5 w-5 ${isStepCompleted ? 'text-gray-300' : 'text-gray-400'}`} viewBox="0 0 20 20" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 8l4 4 4-4" />
                  </svg>
                </div>
              </div>
            </div>
            {targetCompanyData && (
              <div className="ml-[calc(1.25rem+0.5rem+16rem)] text-sm">
                <CompanyInfo company={targetCompanyData} type="Target" />
              </div>
            )}
          </div>
        </div>

        {/* Confirmation Section */}
        {!isStepCompleted && (
          <div className="mt-6 space-y-4">
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleConfirm}
                disabled={!buyingCompany || !targetCompany}
                className={`px-4 py-2 rounded-lg font-medium 
                  ${(!buyingCompany || !targetCompany) 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-royalBlue text-white hover:bg-blue-700'}`}
              >
                Confirm Companies
              </button>
              
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
              >
                Reset Selection
              </button>
            </div>
            
            {isConfirmed && (
              <div className="text-center text-green-600 font-medium">
                ✓ Company selection confirmed
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionCompanySelector;
