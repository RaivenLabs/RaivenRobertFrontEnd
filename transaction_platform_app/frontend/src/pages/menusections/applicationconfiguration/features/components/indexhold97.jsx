import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  FileText, 
  Building2,
  Users,
  Cloud,
  Upload,
  ArrowRight,
  HelpCircle,
  Edit,
  CheckCircle,
  Database,
  LayoutGrid,
  List,
  AlertCircle,
  Loader2,
  FileCode
} from 'lucide-react';

import Tooltip from '../../../../../components/shared/common/Tooltip';
import PanelHeader from '../../../../../components/shared/common/PanelHeader';
import TemplateConfig from '../../templateconfiguration/TemplateConfig';

// Program groups configuration
const programGroups = [
    {
      id: 'sourcing',
      name: 'Sourcing Transactions',
      icon: Cloud,
      description: 'Configure templates for SaaS, MSA, and other sourcing agreements'
    },
    {
      id: 'real-estate',
      name: 'Real Estate',
      icon: Building2,
      description: 'Set up templates for leases and property transactions'
    },
    {
      id: 'hr',
      name: 'HR & Employment',
      icon: Users,
      description: 'Manage employment and benefits agreement templates'
    }
  ];
  
  // Program classes configuration
  const programClasses = [
    {
      id: 'saas',
      name: 'SaaS',
      description: 'Software as a Service agreements',
      group: 'sourcing'
    },
    {
      id: 'engineering-us',
      name: 'Engineering Services (US)',
      description: 'US engineering and professional services agreements',
      group: 'sourcing'
    },
    {
      id: 'engineering-india',
      name: 'Engineering Services (India)',
      description: 'India engineering and professional services agreements',
      group: 'sourcing'
    },
    {
      id: 'equipment',
      name: 'Equipment Purchase',
      description: 'Equipment purchase agreements',
      group: 'sourcing'
    },
    {
      id: 'nda',
      name: 'Confidentiality',
      description: 'Non-disclosure agreements',
      group: 'sourcing'
    },
    {
      id: 'reseller',
      name: 'Reseller',
      description: 'Reseller agreements',
      group: 'sourcing'
    },
    {
      id: 'tech-evaluation',
      name: 'Technology Evaluation',
      description: 'Technology evaluation agreements',
      group: 'sourcing'
    }
  ];


// Template configuration stages
const TEMPLATE_STAGES = {
  PROGRAM_SELECTION: 'PROGRAM_SELECTION',
  TEMPLATE_SETUP: 'TEMPLATE_SETUP',
  VARIABLE_CONFIG: 'VARIABLE_CONFIG',
  LOGIC_CONFIG: 'LOGIC_CONFIG',
  PREVIEW_VALIDATE: 'PREVIEW_VALIDATE',
  PRODUCTION_READY: 'PRODUCTION_READY'
};

// Custom ErrorBoundary component for form selection
const ErrorBoundary = ({ children, fallback }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error) => {
      console.error('Form Selection Error:', error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) return fallback;
  return children;
};

// Process bar component
const TemplateProcessBar = ({ currentStage }) => {
  const stages = [
    {
      id: TEMPLATE_STAGES.PROGRAM_SELECTION,
      label: 'Select Program',
      icon: LayoutGrid,
      tooltip: 'Choose program type and template'
    },
    {
      id: TEMPLATE_STAGES.TEMPLATE_SETUP,
      label: 'Setup Template',
      icon: FileText,
      tooltip: 'Configure base template settings'
    },
    {
      id: TEMPLATE_STAGES.VARIABLE_CONFIG,
      label: 'Configure Variables',
      icon: Edit,
      tooltip: 'Define template variables and constants'
    },
    {
      id: TEMPLATE_STAGES.LOGIC_CONFIG,
      label: 'Configure Logic',
      icon: Database,
      tooltip: 'Set up template logic and flows'
    },
    {
      id: TEMPLATE_STAGES.PREVIEW_VALIDATE,
      label: 'Preview & Validate',
      icon: HelpCircle,
      tooltip: 'Review and validate template configuration'
    },
    {
      id: TEMPLATE_STAGES.PRODUCTION_READY,
      label: 'Production Ready',
      icon: CheckCircle,
      tooltip: 'Template ready for production use'
    }
  ];

  const currentIndex = stages.findIndex(stage => stage.id === currentStage);
  const progress = ((currentIndex + 1) / stages.length) * 100;

  return (
    <div className="w-full space-y-4">
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-teal to-cyan transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-between">
        {stages.map((stage, index) => {
          const StageIcon = stage.icon;
          const isActive = index <= currentIndex;
          const isCompleted = index < currentIndex;
          
          return (
            <Tooltip key={stage.id} content={stage.tooltip}>
              <div className={`flex flex-col items-center transition-colors duration-300
                ${isActive ? 'text-teal' : 'text-gray-400'}
                ${isCompleted ? 'text-teal' : ''}`}
              >
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${isActive ? 'bg-teal/10' : 'bg-gray-100'}
                  ${isCompleted ? 'bg-teal text-white' : ''}
                  transition-colors duration-300
                `}>
                  <StageIcon className="w-5 h-5" />
                </div>
                <span className="text-sm mt-2">{stage.label}</span>
              </div>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};

const ConfigurableLanding = () => {
  // State management
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [templateFoundation, setTemplateFoundation] = useState(null);
  const [programClass, setProgramClass] = useState(null);
  const [selectedForm, setSelectedForm] = useState(null);
  const [currentStage, setCurrentStage] = useState(TEMPLATE_STAGES.PROGRAM_SELECTION);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [availableForms, setAvailableForms] = useState([]);
  const [isLoadingForms, setIsLoadingForms] = useState(false);
  const [formsError, setFormsError] = useState(null);

  // Fetch forms when program class is selected
  useEffect(() => {
    const fetchForms = async () => {
      if (programClass && templateFoundation === 'tangible') {
        setIsLoadingForms(true);
        setFormsError(null);
        try {
          const response = await fetch(`/api/forms/${programClass}`);
          if (!response.ok) throw new Error('Failed to fetch forms');
          const data = await response.json();
          setAvailableForms(data.forms);
        } catch (error) {
          console.error('Error fetching forms:', error);
          setFormsError('Failed to load available forms. Please try again.');
        } finally {
          setIsLoadingForms(false);
        }
      } else {
        setAvailableForms([]);
        setSelectedForm(null);
      }
    };

    fetchForms();
  }, [programClass, templateFoundation]);

  // Reset form selection when class changes
  useEffect(() => {
    setSelectedForm(null);
  }, [programClass]);

  // Handle transitions between stages
  const handleContinue = async () => {
    if (selectedGroup && templateFoundation && programClass && 
        (templateFoundation === 'custom' || selectedForm)) {
      setIsTransitioning(true);
      try {
        // Here you could add API calls to validate selections
        await new Promise(resolve => setTimeout(resolve, 500));
        setCurrentStage(TEMPLATE_STAGES.TEMPLATE_SETUP);
      } finally {
        setIsTransitioning(false);
      }
    }
  };

  // Render main selection grid
  const renderSelectionGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Program Group Selection */}
      <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-gray-100">
        <PanelHeader 
          title="Select Program Group" 
          isActive={true}
          icon={FileText}
        />
        <div className="p-6 space-y-4">
        {programGroups.map((group) => {
  const Icon = group.icon;  // Get the icon component
  return (
    <button
      key={group.id}
      onClick={() => {
        setSelectedGroup(group.id);
        setTemplateFoundation(null);
        setProgramClass(null);
      }}
      className={`w-full p-4 rounded-lg border transition-all
        ${selectedGroup === group.id 
          ? 'border-teal bg-teal/5' 
          : 'border-gray-200 hover:border-teal/50'
        }
        flex items-center gap-3`}
    >
      <Icon className="w-6 h-6" />  {/* Render the icon as a component */}
      <div className="text-left">
        <h3 className="font-medium text-gray-800">{group.name}</h3>
        <p className="text-sm text-gray-600">{group.description}</p>
      </div>
      <ArrowRight className={`w-5 h-5 ml-auto transition-opacity
        ${selectedGroup === group.id ? 'opacity-100' : 'opacity-0'}`} 
      />
    </button>
  );
})}
        </div>
      </div>

      {/* Template Foundation Selection */}
      <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-gray-100">
        <PanelHeader 
          title="Choose Foundation" 
          isActive={!!selectedGroup}
          icon={Upload}
        />
        <div className="p-6 space-y-4">
          {!selectedGroup ? (
            <div className="text-center py-8 text-gray-500">
              Select a program group first
            </div>
          ) : (
            <>
              <button
                onClick={() => {
                  setTemplateFoundation('tangible');
                  setProgramClass(null);
                }}
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
                onClick={() => {
                  setTemplateFoundation('custom');
                  setProgramClass(null);
                }}
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

      {/* Program Class Selection */}
      <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-gray-100">
        <PanelHeader 
          title="Select Program Class" 
          isActive={!!templateFoundation}
          icon={List}
        />
        <div className="p-6 space-y-4">
          {!selectedGroup || !templateFoundation ? (
            <div className="text-center py-8 text-gray-500">
              Complete previous selections first
            </div>
          ) : (
            <>
              {selectedGroup === 'sourcing' && programClasses.map((programClass) => (
                <button
                  key={programClass.id}
                  onClick={() => setProgramClass(programClass.id)}
                  className={`w-full p-4 rounded-lg border transition-all
                    ${programClass === programClass.id
                      ? 'border-teal bg-teal/5'
                      : 'border-gray-200 hover:border-teal/50'
                    }`}
                >
                  <h3 className="font-medium text-gray-800">
                    {programClass.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {programClass.description}
                  </p>
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Form Selection */}
      <ErrorBoundary fallback={
        <div className="text-center py-8 text-red-600">
          Error loading form selection. Please try again.
        </div>
      }>
        <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-gray-100">
          <PanelHeader 
            title="Select Form" 
            isActive={!!programClass && templateFoundation === 'tangible'}
            icon={FileCode}
          />
          <div className="p-6 space-y-4">
            {!selectedGroup || !templateFoundation || !programClass ? (
              <div className="text-center py-8 text-gray-500">
                Complete previous selections first
              </div>
            ) : templateFoundation === 'custom' ? (
              <div className="text-center py-8 text-gray-500">
                Form selection not needed for custom templates
              </div>
            ) : isLoadingForms ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-2">
                <Loader2 className="w-6 h-6 animate-spin text-teal" />
                <span className="text-gray-600">Loading available forms...</span>
              </div>
            ) : formsError ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-2 text-red-600">
                <AlertCircle className="w-6 h-6" />
                <span>{formsError}</span>
                <button 
                  onClick={() => setProgramClass(programClass)}
                  className="text-sm text-teal hover:underline"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {availableForms.map((form) => (
                  <button
                    key={form.id}
                    onClick={() => setSelectedForm(form.id)}
                    className={`w-full p-4 rounded-lg border transition-all
                      ${selectedForm === form.id
                        ? 'border-teal bg-teal/5'
                        : 'border-gray-200 hover:border-teal/50'
                      }`}
                  >
                    <h3 className="font-medium text-gray-800">{form.name}</h3>
                    <p className="text-sm text-gray-600">{form.description}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </ErrorBoundary>
    </div>
  );

  // Main render
  return (
    <div className="min-h-screen bg-ivory p-6 space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-8 h-8 text-teal" />
          <h1 className="text-2xl font-bold text-gray-800">
            Template Configuration Center
          </h1>

          <Tooltip content="Need help getting started? Click here for guidance">
            <HelpCircle className="w-6 h-6 text-gray-400 ml-auto cursor-help" />
          </Tooltip>
        </div>
        
        <p className="text-gray-600 mb-8">
          Welcome to the Template Configuration Center! Start by selecting a program 
          group, template foundation, and program class to begin customization.
        </p>

        <TemplateProcessBar currentStage={currentStage} />
      </div>

      {/* Dynamic Content Area */}
      {isTransitioning ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal"></div>
        </div>
      ) : currentStage === TEMPLATE_STAGES.PROGRAM_SELECTION ? (
        renderSelectionGrid()
      ) : (
        <TemplateConfig 
          programGroup={selectedGroup}
          templateFoundation={templateFoundation}
          programClass={programClass}
          selectedForm={selectedForm}
          currentStage={currentStage}
          setCurrentStage={setCurrentStage}
          onBack={() => setCurrentStage(TEMPLATE_STAGES.PROGRAM_SELECTION)}
        />
      )}

      {/* Action Panel */}
      {currentStage === TEMPLATE_STAGES.PROGRAM_SELECTION && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              {!selectedGroup 
                ? 'Select a program group to begin'
                : !templateFoundation
                ? 'Choose a template foundation'
                : !programClass
                ? 'Select a program class'
                : templateFoundation === 'custom'
                ? 'Click Continue to start configuring your template'
                : !selectedForm
                ? 'Select a form'
                : 'Click Continue to start configuring your template'}
            </p>
            
            <button
              onClick={handleContinue}
              disabled={!selectedGroup || !templateFoundation || !programClass || 
                       (templateFoundation === 'tangible' && !selectedForm) || 
                       isTransitioning}
              className={`px-6 py-2 rounded-lg transition-colors
                flex items-center gap-2
                ${selectedGroup && templateFoundation && programClass && 
                  (templateFoundation === 'custom' || selectedForm) && !isTransitioning
                  ? 'bg-teal text-white hover:bg-teal/90'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigurableLanding;  
