import React from 'react';
import { FileCode } from 'lucide-react';
import PanelHeader from '../../../../../../components/shared/common/PanelHeader';
import ErrorBoundary from '../utility/ErrorBoundary';
import TemplateSelectionPanel from './TemplateSelectionPanel';

const FormSelectionWrapper = ({
  isActive,
  forms,
  selectedForm,
  setSelectedForm,
  stages,
  conversionStates,
  isLoading,
  error,
  agreementType
}) => {
  return (
    <ErrorBoundary 
      fallback={
        <div className="text-center py-8 text-red-600">
          Error loading form selection. Please try again.
        </div>
      }
    >
      <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-gray-100 md:col-span-4">
        <PanelHeader
          title="Select Form Template"
          isActive={isActive}
          icon={FileCode}
        />
        <div className="p-6">
          <TemplateSelectionPanel
            forms={forms}
            selectedForm={selectedForm}
            setSelectedForm={setSelectedForm}
            stages={stages}
            agreementType={agreementType}
            conversionStates={conversionStates}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default FormSelectionWrapper;
