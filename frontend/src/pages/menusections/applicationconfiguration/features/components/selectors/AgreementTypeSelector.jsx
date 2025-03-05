import React from 'react';
import PanelHeader from '../../../../../../components/shared/common/PanelHeader';
import { FilePlus } from 'lucide-react';

const AgreementTypeSelector = ({
  agreementTypes,
  selectedAgreementType,
  onSelectAgreementType,
  isActive
}) => {
  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-gray-100">
      <PanelHeader 
        title="Agreement Type" 
        isActive={isActive}
        icon={FilePlus}
      />
      <div className="p-6 space-y-4">
        {!isActive ? (
          <div className="text-center py-8 text-gray-500">
            Select a program group first
          </div>
        ) : (
          <>
            {agreementTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => onSelectAgreementType(type.id)}
                className={`w-full p-4 rounded-lg border transition-all
                  ${selectedAgreementType === type.id
                    ? 'border-teal bg-teal/5'
                    : 'border-gray-200 hover:border-teal/50'
                  }`}
              >
                <h3 className="font-medium text-gray-800">{type.name}</h3>
                <p className="text-sm text-gray-600">{type.description}</p>
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default AgreementTypeSelector;
