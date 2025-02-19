import React from 'react';
import PanelHeader from '../../../../../../components/shared/common/PanelHeader';
import { Upload } from 'lucide-react';

const TemplateFoundationSelector = ({
  isActive,
  templateFoundation,
  onSelectFoundation
}) => {
  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-gray-100">
      <PanelHeader 
        title="Choose Foundation" 
        isActive={isActive}
        icon={Upload}
      />
      <div className="p-6 space-y-4">
        {!isActive ? (
          <div className="text-center py-8 text-gray-500">
            Complete previous selections first
          </div>
        ) : (
          <>
            <button
              onClick={() => onSelectFoundation('tangible')}
              className={`w-full p-4 rounded-lg border transition-all
                ${templateFoundation === 'tangible'
                  ? 'border-teal bg-teal/5'
                  : 'border-gray-200 hover:border-teal/50'
                }`}
            >
              <h3 className="font-medium text-gray-800">
                Start with Tangible Template
              </h3>
              <p className="text-sm text-gray-600">
                Use our pre-configured template as your starting point
              </p>
            </button>
            
            <button
              onClick={() => onSelectFoundation('custom')}
              className={`w-full p-4 rounded-lg border transition-all
                ${templateFoundation === 'custom'
                  ? 'border-teal bg-teal/5'
                  : 'border-gray-200 hover:border-teal/50'
                }`}
            >
              <h3 className="font-medium text-gray-800">
                Upload Custom Template
              </h3>
              <p className="text-sm text-gray-600">
                Use your own template file as a starting point
              </p>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TemplateFoundationSelector;
