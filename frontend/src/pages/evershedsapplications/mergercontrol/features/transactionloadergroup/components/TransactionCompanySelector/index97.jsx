import React, { useEffect, useState } from 'react';
import { Building2, CheckCircle } from 'lucide-react';
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

const TransactionCompanySelector = ({ onComplete }) => {
  const { 
    buyingCompany,
    targetCompany,
    updateBuyingCompany,
    updateTargetCompany,
    buyingCompanies,
    targetCompanies,
    buyingCompanyData,
    targetCompanyData,
    isLoading
  } = useMergerControl();

  // Add local confirmation state
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Handle company selection confirmation
  const handleConfirmSelection = () => {
    if (buyingCompany && targetCompany) {
      setIsConfirmed(true);
      onComplete({
        buyingCompany: buyingCompanyData,
        targetCompany: targetCompanyData
      });
    }
  };

  // Reset confirmation if companies change
  useEffect(() => {
    setIsConfirmed(false);
  }, [buyingCompany, targetCompany]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-royalBlue"></div>
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
            Transaction Companies:
          </h3>
          <p className="text-sm text-gray-600">
            Select acquiring and target companies
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
                  onChange={(e) => updateBuyingCompany(e.target.value)}
                  disabled={isConfirmed}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg 
                            focus:border-royalBlue focus:ring-1 focus:ring-royalBlue
                            appearance-none pr-10 disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="">Select Acquiring Company</option>
                  {Object.entries(buyingCompanies).map(([id, company]) => (
                    <option key={id} value={id}>
                      {company.icon} {company.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor">
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
                  onChange={(e) => updateTargetCompany(e.target.value)}
                  disabled={isConfirmed}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg 
                            focus:border-royalBlue focus:ring-1 focus:ring-royalBlue
                            appearance-none pr-10 disabled:bg-gray-50 disabled:text-gray-500"
                >
                  <option value="">Select Target Company</option>
                  {Object.entries(targetCompanies).map(([id, company]) => (
                    <option key={id} value={id}>
                      {company.icon} {company.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor">
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

        {/* Confirmation Button */}
        {buyingCompany && targetCompany && !isConfirmed && (
          <div className="pt-4 border-t">
            <button
              onClick={handleConfirmSelection}
              className="w-full px-4 py-2 bg-royalBlue text-white rounded-lg 
                       hover:bg-royalBlue/90 transition-colors
                       flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Confirm Company Selection</span>
            </button>
          </div>
        )}

        {/* Confirmation Message */}
        {isConfirmed && (
          <div className="pt-4 border-t flex items-center justify-center text-emerald-600 gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>Companies confirmed - proceeding to project setup</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionCompanySelector;
