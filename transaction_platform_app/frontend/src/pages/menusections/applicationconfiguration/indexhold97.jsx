import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

import Tooltip from '../../../components/shared/common/Tooltip';
import TemplateConfig from './templateconfiguration/TemplateConfig';
import TemplateProcessBar from './features/components/stages/TemplateProcessBar';
import ErrorBoundary from './features/components/utility/ErrorBoundary';






import ProgramGroupSelector from './features/components/selectors/ProgramGroupSelector';
import AgreementTypeSelector from './features/components/selectors/AgreementTypeSelector';
import ProgramClassSelector from './features/components/selectors/ProgramClassSelector';
import TemplateFoundationSelector from './features/components/selectors/TemplateFoundationSelector';
import FormSelectionWrapper from './features/components/selectors/FormSelectionWrapper';
import { TEMPLATE_STAGES, DEFAULT_CONVERSION_STATES } from './features/components/constants/index';

// Import from our program structure module or API
import { 
  programGroups, 
  agreementTypes, 
  getAvailableProgramClasses, 
  getAvailableForms 
} from './programStructure';

const ConfigurableLanding = () => {
  // State management
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedAgreementType, setSelectedAgreementType] = useState(null);
  const [programClass, setProgramClass] = useState(null);
  const [templateFoundation, setTemplateFoundation] = useState(null);
  const [selectedForm, setSelectedForm] = useState(null);
  const [currentStage, setCurrentStage] = useState(TEMPLATE_STAGES.PROGRAM_SELECTION);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [conversionStates, setConversionStates] = useState({});
  const [needsConversion, setNeedsConversion] = useState(false);
  
  // Derived states for available options
  const [availableProgramClasses, setAvailableProgramClasses] = useState([]);
  const [availableForms, setAvailableForms] = useState([]);
  
  // Loading states
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  const [isLoadingForms, setIsLoadingForms] = useState(false);
  const [classesError, setClassesError] = useState(null);
  const [formsError, setFormsError] = useState(null);
  
  // Fetch conversion states from registry
  useEffect(() => {
    const fetchRegistryMetadata = async () => {
      try {
        // Call our backend API endpoint
        const response = await fetch('/api/template-registry/tangible', {
          headers: {
            'X-Environment': process.env.NODE_ENV  // Pass environment to backend
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        
        const data = await response.json();
        if (data.conversionStates) {
          setConversionStates(data.conversionStates);
        } else {
          // Fallback to defaults
          setConversionStates(DEFAULT_CONVERSION_STATES);
        }
      } catch (error) {
        console.error('Failed to load registry metadata:', error);
        // Use defaults in case of error
        setConversionStates(DEFAULT_CONVERSION_STATES);
      }
    };
    
    fetchRegistryMetadata();
  }, []);
  
  // Update available program classes when group and agreement type change
  useEffect(() => {
    const fetchProgramClasses = async () => {
      if (selectedGroup && selectedAgreementType) {
        setIsLoadingClasses(true);
        setClassesError(null);
        try {
          // In production, this could be an API call
          // For now we'll use our utility function
          const classes = getAvailableProgramClasses(selectedGroup, selectedAgreementType);
          setAvailableProgramClasses(classes);
        } catch (error) {
          console.error('Error fetching program classes:', error);
          setClassesError('Failed to load program classes. Please try again.');
        } finally {
          setIsLoadingClasses(false);
        }
      } else {
        setAvailableProgramClasses([]);
      }
      // Reset dependent selections
      setProgramClass(null);
    };

    fetchProgramClasses();
  }, [selectedGroup, selectedAgreementType]);

  // Update available forms when program class changes
  useEffect(() => {
    const fetchForms = async () => {
      if (programClass && selectedAgreementType && templateFoundation === 'tangible') {
        setIsLoadingForms(true);
        try {
          console.log('FETCH FORMS - Starting fetch for:', {
            programClass,
            selectedAgreementType,
            selectedGroup
          });
  
          const response = await fetch('/api/template-registry/tangible');
          const registry = await response.json();
          
          let foundForms = [];
          const programGroup = registry.programGroups.find(pg => pg.id === selectedGroup);
          
          if (programGroup) {
            const agreementType = programGroup.agreementTypes
              .find(at => at.id === selectedAgreementType);
              
            if (agreementType) {
              // Find ALL program classes with matching ID
              const matchingProgramClasses = agreementType.programClasses
                .filter(pc => pc.id === programClass);
              
              console.log('FETCH FORMS - Found matching program classes:', 
                matchingProgramClasses.map(pc => pc.name)
              );
  
              // Combine all forms from all matching program classes
              foundForms = matchingProgramClasses.flatMap(pc => pc.forms);
              
              console.log('FETCH FORMS - Combined forms from all matches:', foundForms.length);
            }
          }
  
          console.log('FETCH FORMS - Setting availableForms with:', foundForms);
          setAvailableForms(foundForms);
  
        } catch (error) {
          console.error('FETCH FORMS - Error:', error);
          setFormsError('Failed to load available forms');
        } finally {
          setIsLoadingForms(false);
        }
      }
    };
    fetchForms();
  }, [programClass, selectedAgreementType, templateFoundation, selectedGroup]);

  // Handle transitions between stages
  const handleContinue = async () => {
    if (selectedGroup && selectedAgreementType && programClass && 
        ((templateFoundation === 'tangible' && selectedForm) || templateFoundation === 'custom')) {
      setIsTransitioning(true);
      try {
        // Determine if selected form is a source template that needs conversion
        const selectedFormData = availableForms.find(form => form.id === selectedForm);
        
        if (selectedFormData) {
          if (selectedFormData.sourceFileExists && !selectedFormData.fileExists) {
            // This is a source template that needs conversion
            setNeedsConversion(true);
            setCurrentStage(TEMPLATE_STAGES.TEMPLATE_CONVERSION);
          } else if (selectedFormData.fileExists) {
            // This is a converted template ready for configuration
            setNeedsConversion(false);
            setCurrentStage(TEMPLATE_STAGES.TEMPLATE_SETUP);
          }
        } else if (templateFoundation === 'custom') {
          // For custom templates, go to upload/conversion screen
          setNeedsConversion(true);
          setCurrentStage(TEMPLATE_STAGES.TEMPLATE_CONVERSION);
        }
      } finally {
        setIsTransitioning(false);
      }
    }
  };

  // Render main selection grid
  const renderSelectionGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Program Group Selection */}
      <ProgramGroupSelector
        programGroups={programGroups}
        selectedGroup={selectedGroup}
        onSelectGroup={(id) => {
          setSelectedGroup(id);
          setSelectedAgreementType(null);
          setProgramClass(null);
          setTemplateFoundation(null);
        }}
      />

      {/* Agreement Type Selection */}
      <AgreementTypeSelector
        agreementTypes={agreementTypes}
        selectedAgreementType={selectedAgreementType}
        onSelectAgreementType={(id) => {
          setSelectedAgreementType(id);
          setProgramClass(null);
          setTemplateFoundation(null);
        }}
        isActive={!!selectedGroup}
      />

      {/* Program Class Selection */}
      <ProgramClassSelector
        isActive={!!selectedAgreementType}
        availableProgramClasses={availableProgramClasses}
        programClass={programClass}
        setProgramClass={setProgramClass}
        isLoadingClasses={isLoadingClasses}
        classesError={classesError}
        onRetry={() => setSelectedAgreementType(selectedAgreementType)}
      />

      {/* Template Foundation Selection */}
      <TemplateFoundationSelector
        isActive={!!programClass}
        templateFoundation={templateFoundation}
        onSelectFoundation={setTemplateFoundation}
      />

      {/* Form Selection (conditionally rendered) */}
      {templateFoundation === 'tangible' && (
        <FormSelectionWrapper
          isActive={templateFoundation === 'tangible'}
          forms={availableForms}
          selectedForm={selectedForm}
          setSelectedForm={setSelectedForm}
          conversionStates={conversionStates}
          isLoading={isLoadingForms}
          error={formsError}
        />
      )}
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
            Application Configuration Center
          </h1>

          <Tooltip content="Need help getting started? Click here for guidance">
            <HelpCircle className="w-6 h-6 text-gray-400 ml-auto cursor-help" />
          </Tooltip>
        </div>
        
        <p className="text-gray-600 mb-8">
          Welcome to the Application Configuration Center! Start by selecting a program 
          group, agreement type, and program class to begin customization.
        </p>

        <TemplateProcessBar 
          currentStage={currentStage}
          showConversionStage={needsConversion}
        />
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
          agreementType={selectedAgreementType}
          programClass={programClass}
          templateFoundation={templateFoundation}
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
                : !selectedAgreementType
                ? 'Choose an agreement type'
                : !programClass
                ? 'Select a program class'
                : !templateFoundation
                ? 'Choose a template foundation'
                : templateFoundation === 'custom'
                ? 'Click Continue to upload your custom template'
                : !selectedForm
                ? 'Select a form template'
                : 'Click Continue to start configuring your template'}
            </p>
            
            <button
              onClick={handleContinue}
              disabled={!selectedGroup || !selectedAgreementType || !programClass || 
                       !templateFoundation || 
                       (templateFoundation === 'tangible' && !selectedForm) || 
                       isTransitioning}
              className={`px-6 py-2 rounded-lg transition-colors
                flex items-center gap-2
                ${selectedGroup && selectedAgreementType && programClass && 
                  templateFoundation && 
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
