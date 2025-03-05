import React, { useMemo } from 'react';
import { 
  FileText, 
  Building2,
  Briefcase,
  ArrowRight,
  AlertCircle,
  Loader2,
  FileCode,
  CheckCircle
} from 'lucide-react';

import { TEMPLATE_STAGES, DEFAULT_CONVERSION_STATES, DEFAULT_STAGES } from '../constants/index';

const TemplateSelectionPanel = ({ 
  forms,
  selectedForm,
  setSelectedForm,
  stages = DEFAULT_STAGES,
  isLoading,
  error,
  agreementType // 'parent' or 'order'
}) => {
  // Group templates by stage
  const templatesByStage = useMemo(() => {
    return {
      SOURCE: forms.filter(form => form.stage === 'SOURCE'),
      BASE: forms.filter(form => form.stage === 'BASE'),
      CUSTOMER_SPECIFIC: forms.filter(form => form.stage === 'CUSTOMER_SPECIFIC'),
      CUSTOMER_PROVIDER_SPECIFIC: forms.filter(form => form.stage === 'CUSTOMER_PROVIDER_SPECIFIC')
    };
  }, [forms]);

  // Loading and error states
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-2">
        <Loader2 className="w-6 h-6 animate-spin text-teal" />
        <span className="text-gray-600">Loading available templates...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8 space-y-2 text-red-600">
        <AlertCircle className="w-6 h-6" />
        <span>{error}</span>
      </div>
    );
  }

  // Template card component
  const TemplateCard = ({ template }) => (
    <button
      onClick={() => setSelectedForm(template.id)}
      className={`p-4 rounded-lg border transition-all h-full relative bg-white
        ${selectedForm === template.id
          ? 'border-teal bg-teal/5 shadow-md'
          : 'border-gray-200 hover:border-teal/50 hover:shadow-sm'
        }`}
    >
      <div className="absolute top-3 right-3">
        <span className={stages[template.stage]?.displayClass + " text-xs px-2 py-1 rounded-full"}>
          {stages[template.stage]?.label}
        </span>
      </div>
      <h3 className="font-medium text-gray-800 pr-20">{template.name}</h3>
      <p className="text-sm text-gray-600 mt-2">{template.description}</p>
      
      <div className="mt-4 text-xs text-gray-400 space-y-1">
        {template.lastConverted && (
          <div>Last Updated: {new Date(template.lastConverted).toLocaleDateString()}</div>
        )}
        {template.customerSpecificTerms && (
          <div>Customer: {template.customerSpecificTerms.companyName}</div>
        )}
        {template.providerSpecificTerms && (
          <div>Provider: {template.providerSpecificTerms.providerName}</div>
        )}
      </div>
    </button>
  );

  // Stage section component
  const StageSection = ({ stage, icon: Icon, templates, label }) => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Icon className={`w-5 h-5 ${stages[stage]?.displayClass.replace('bg-', 'text-').split(' ')[0]}`} />
        <h3 className="text-lg font-medium text-teal">{label || stages[stage]?.label}</h3>
        {templates.length > 0 && (
          <span className={`px-2 py-1 text-xs rounded-full ${stages[stage]?.displayClass}`}>
            {templates.length} Available
          </span>
        )}
      </div>

      {templates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map((template) => (
            <TemplateCard 
              key={template.id} 
              template={template}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
          No templates in {(label || stages[stage]?.label).toLowerCase()} stage
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Source Templates */}
      <StageSection 
        stage="SOURCE"
        icon={FileText}
        templates={templatesByStage.SOURCE}
        label="Source Template"
      />

      {/* Base Templates */}
      <StageSection 
        stage="BASE"
        icon={FileCode}
        templates={templatesByStage.BASE}
        label="Base Template"
      />

      {/* Customer Specific Templates */}
      <StageSection 
        stage="CUSTOMER_SPECIFIC"
        icon={Building2}
        templates={templatesByStage.CUSTOMER_SPECIFIC}
        label="Customer Specific"
      />

      {/* Provider Specific Templates (Orders Only) */}
      {agreementType === 'order' && (
        <StageSection 
          stage="CUSTOMER_PROVIDER_SPECIFIC"
          icon={Briefcase}
          templates={templatesByStage.CUSTOMER_PROVIDER_SPECIFIC}
          label="Provider Specific"
        />
      )}

      {/* Journey Progress Indicator */}
      <div className="mt-8 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-teal font-medium">Source</span>
          <ArrowRight className="w-4 h-4 text-gray-400" />
          <span className="text-teal font-medium">Base</span>
          <ArrowRight className="w-4 h-4 text-gray-400" />
          <span className="text-teal font-medium">Customer Specific</span>
          {agreementType === 'order' && (
            <>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <span className="text-teal font-medium">Provider Specific</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateSelectionPanel;
