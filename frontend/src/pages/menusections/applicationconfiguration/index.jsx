import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

import Tooltip from '../../../components/shared/common/Tooltip';
import TemplateConfig from './templateconfiguration/TemplateConfig';
import TemplateConversion from './features/components/stages/TemplateConversion';
import TemplateProcessBar from './features/components/stages/TemplateProcessBar';
import ErrorBoundary from './features/components/utility/ErrorBoundary';
import ProgramGroupSelector from './features/components/selectors/ProgramGroupSelector';
import AgreementTypeSelector from './features/components/selectors/AgreementTypeSelector';
import ProgramClassSelector from './features/components/selectors/ProgramClassSelector';
import TemplateFoundationSelector from './features/components/selectors/TemplateFoundationSelector';
import FormSelectionWrapper from './features/components/selectors/FormSelectionWrapper';
import { TEMPLATE_STAGES, DEFAULT_CONVERSION_STATES, DEFAULT_STAGES } from './features/components/constants/index';

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
  const [conversionStates, setConversionStates] = useState(DEFAULT_CONVERSION_STATES);
  const [stages, setStages] = useState(DEFAULT_STAGES);
  const [needsConversion, setNeedsConversion] = useState(false);
  
  // Derived states for available options
  const [availableProgramClasses, setAvailableProgramClasses] = useState([]);
  const [availableForms, setAvailableForms] = useState([]);
  
  // Loading states
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  const [isLoadingForms, setIsLoadingForms] = useState(false);
  const [classesError, setClassesError] = useState(null);
  const [formsError, setFormsError] = useState(null);
  
  // Determine if template needs conversion
  const determineTemplateAction = () => {
    if (!selectedForm && templateFoundation !== 'custom') return null;
    
    if (templateFoundation === 'custom') {
      return 'conversion';
    }
    
    const selectedFormData = availableForms.find(form => form.id === selectedForm);
    
    if (selectedFormData) {
      if (selectedFormData.sourceFileExists && !selectedFormData.fileExists) {
        return 'conversion';
      } else if (selectedFormData.fileExists) {
        return 'configuration';
      }
    }
    
    return null;
  };
  
  // Fetch registry metadata (stages and conversion states)
  useEffect(() => {
    const fetchRegistryMetadata = async () => {
      try {
        const response = await fetch('/api/template/registry/tangible', {
          headers: {
            'X-Environment': process.env.NODE_ENV
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        
        const data = await response.json();
        if (data.stages) {
          setStages(data.stages);
        }
        if (data.conversionStates) {
          setConversionStates(data.conversionStates);
        }
      } catch (error) {
        console.error('Failed to load registry metadata:', error);
        // Use defaults in case of error
        setStages(DEFAULT_STAGES);
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
          const response = await fetch('/api/template/registry/tangible');
          const registry = await response.json();
          
          let foundForms = [];
          const programGroup = registry.programGroups.find(pg => pg.id === selectedGroup);
          
          if (programGroup) {
            const agreementType = programGroup.agreementTypes
              .find(at => at.id === selectedAgreementType);
              
            if (agreementType) {
              const matchingProgramClasses = agreementType.programClasses
                .filter(pc => pc.id === programClass);
              
              foundForms = matchingProgramClasses.flatMap(pc => pc.forms);
            }
          }
  
          setAvailableForms(foundForms);
        } catch (error) {
          console.error('Error fetching forms:', error);
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
    if (!selectedGroup || !selectedAgreementType || !programClass || 
        (!selectedForm && templateFoundation !== 'custom')) {
      return;
    }
  
    setIsTransitioning(true);
  
    try {
      // Get the selected form's data from the registry
      const formData = availableForms.find(form => form.id === selectedForm);
      console.log('Selected form data:', formData);
  
      if (!formData && templateFoundation !== 'custom') {
        throw new Error('Selected form not found in registry');
      }
  
      const needsConversion = templateFoundation === 'custom' || 
                            (formData?.conversionState === 'SOURCE');
  
      if (needsConversion) {
        console.log('Template needs conversion, proceeding to conversion stage');
        // Include the full template info when transitioning
        setCurrentStage(TEMPLATE_STAGES.TEMPLATE_CONVERSION);
      } else {
        console.log('Template already converted, proceeding to configuration stage');
        setCurrentStage(TEMPLATE_STAGES.TEMPLATE_SETUP);
      }
    } catch (error) {
      console.error('Error in handleContinue:', error);
      // Consider adding error state/display here
    } finally {
      setIsTransitioning(false);
    }
  };
  
  // Add a new state for the selected template data
  const [selectedTemplateData, setSelectedTemplateData] = useState(null);
  
  // Update template data when form is selected
  useEffect(() => {
    if (selectedForm && availableForms.length > 0) {
      const formData = availableForms.find(form => form.id === selectedForm);
      setSelectedTemplateData(formData);
    } else {
      setSelectedTemplateData(null);
    }
  }, [selectedForm, availableForms]);
  
 

  // Render main selection grid
  const renderSelectionGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

      <ProgramClassSelector
        isActive={!!selectedAgreementType}
        availableProgramClasses={availableProgramClasses}
        programClass={programClass}
        setProgramClass={setProgramClass}
        isLoadingClasses={isLoadingClasses}
        classesError={classesError}
        onRetry={() => setSelectedAgreementType(selectedAgreementType)}
      />

      <TemplateFoundationSelector
        isActive={!!programClass}
        templateFoundation={templateFoundation}
        onSelectFoundation={setTemplateFoundation}
      />

      {templateFoundation === 'tangible' && (
        <FormSelectionWrapper
          isActive={templateFoundation === 'tangible'}
          forms={availableForms}
          selectedForm={selectedForm}
          setSelectedForm={setSelectedForm}
          stages={stages}
          agreementType={selectedAgreementType}
          conversionStates={conversionStates}
          isLoading={isLoadingForms}
          error={formsError}
        />
      )}
    </div>
  );

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
      ) : currentStage === TEMPLATE_STAGES.TEMPLATE_CONVERSION ? (
        <TemplateConversion 
          programGroup={selectedGroup}
          agreementType={selectedAgreementType}
          programClass={programClass}
          selectedForm={selectedForm}
          templateData={selectedTemplateData}
          templateFoundation={templateFoundation}
          setCurrentStage={setCurrentStage}
          onBack={() => setCurrentStage(TEMPLATE_STAGES.PROGRAM_SELECTION)}
          onComplete={() => setCurrentStage(TEMPLATE_STAGES.TEMPLATE_SETUP)}
        />
      ) : (
        <TemplateConfig 
          programGroup={selectedGroup}
          agreementType={selectedAgreementType}
          programClass={programClass}
          templateFoundation={templateFoundation}
          selectedForm={selectedForm}
          currentStage={currentStage}
          setCurrentStage={setCurrentStage}
          onBack={() => {
            if (needsConversion && currentStage === TEMPLATE_STAGES.TEMPLATE_SETUP) {
              setCurrentStage(TEMPLATE_STAGES.TEMPLATE_CONVERSION);
            } else {
              setCurrentStage(TEMPLATE_STAGES.PROGRAM_SELECTION);
            }
          }}
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
                : determineTemplateAction() === 'conversion'
                ? 'Click Continue to convert this template'
                : 'Click Continue to configure this template'}
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
              {determineTemplateAction() === 'conversion' 
                ? 'Continue to Conversion' 
                : 'Continue to Configuration'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigurableLanding;
