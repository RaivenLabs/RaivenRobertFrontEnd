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
  FileCode,
  FilePlus,
  ArrowUpCircle,
  AlertTriangle
} from 'lucide-react';

import Tooltip from '../../../components/shared/common/Tooltip';
import PanelHeader from '../../../components/shared/common/PanelHeader';
import TemplateConfig from './templateconfiguration/TemplateConfig';
import TemplateProcessBar from './features/components/stages/TemplateProcessBar';
import ErrorBoundary from './features/components/utility/ErrorBoundary';
import TemplateSelectionPanel from './features/components/selectors/TemplateSelectionPanel';
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
    // Default conversion states as fallback
    const defaultConversionStates = {
      "SOURCE": {
        "label": "Source Template",
        "description": "Original template with standard variables, not yet converted",
        "displayClass": "bg-amber-100 text-amber-800 border-amber-300"
      },
      "CONVERTED": {
        "label": "Converted Template",
        "description": "Template with double curly bracket syntax, ready for use",
        "displayClass": "bg-green-100 text-green-800 border-green-300"
      },
      "IN_PROGRESS": {
        "label": "Conversion In Progress",
        "description": "Template is currently being processed",
        "displayClass": "bg-blue-100 text-blue-800 border-blue-300"
      },
      "ERROR": {
        "label": "Conversion Error",
        "description": "Error occurred during template conversion",
        "displayClass": "bg-red-100 text-red-800 border-red-300"
      }
    };
  
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
          // Fallback to defaults if needed
          setConversionStates(defaultConversionStates);
        }
      } catch (error) {
        console.error('Failed to load registry metadata:', error);
        // Use defaults in case of error
        setConversionStates(defaultConversionStates);
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
              const Icon = group.icon;
              return (
                <button
                  key={group.id}
                  onClick={() => {
                    setSelectedGroup(group.id);
                    setSelectedAgreementType(null);
                    setProgramClass(null);
                    setTemplateFoundation(null);
                  }}
                  className={`w-full p-4 rounded-lg border transition-all
                    ${selectedGroup === group.id 
                      ? 'border-teal bg-teal/5' 
                      : 'border-gray-200 hover:border-teal/50'
                    }
                    flex items-center gap-3`}
                >
                  <Icon className="w-6 h-6" />
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
  
        {/* Agreement Type Selection */}
        <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-gray-100">
          <PanelHeader 
            title="Agreement Type" 
            isActive={!!selectedGroup}
            icon={FilePlus}
          />
          <div className="p-6 space-y-4">
            {!selectedGroup ? (
              <div className="text-center py-8 text-gray-500">
                Select a program group first
              </div>
            ) : (
              <>
                {agreementTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setSelectedAgreementType(type.id);
                      setProgramClass(null);
                      setTemplateFoundation(null);
                    }}
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
  
        {/* Program Class Selection */}
        <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-gray-100">
          <PanelHeader 
            title="Select Program Class" 
            isActive={!!selectedAgreementType}
            icon={List}
          />
          <div className="p-6 space-y-4">
            {!selectedGroup || !selectedAgreementType ? (
              <div className="text-center py-8 text-gray-500">
                Complete previous selections first
              </div>
            ) : isLoadingClasses ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-2">
                <Loader2 className="w-6 h-6 animate-spin text-teal" />
                <span className="text-gray-600">Loading program classes...</span>
              </div>
            ) : classesError ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-2 text-red-600">
                <AlertCircle className="w-6 h-6" />
                <span>{classesError}</span>
                <button 
                  onClick={() => setSelectedAgreementType(selectedAgreementType)}
                  className="text-sm text-teal hover:underline"
                >
                  Try Again
                </button>
              </div>
            ) : availableProgramClasses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No program classes available for this selection
              </div>
            ) : (
              <>
                {availableProgramClasses.map((programClassItem) => (
                  <button
                    key={programClassItem.id}
                    onClick={() => setProgramClass(programClassItem.id)}
                    className={`w-full p-4 rounded-lg border transition-all
                      ${programClass === programClassItem.id
                        ? 'border-teal bg-teal/5'
                        : 'border-gray-200 hover:border-teal/50'
                      }`}
                  >
                    <h3 className="font-medium text-gray-800">
                      {programClassItem.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {programClassItem.description}
                    </p>
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
  
        {/* Template Foundation Selection */}
        <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-gray-100">
          <PanelHeader 
            title="Choose Foundation" 
            isActive={!!programClass}
            icon={Upload}
          />
          <div className="p-6 space-y-4">
            {!selectedGroup || !selectedAgreementType || !programClass ? (
              <div className="text-center py-8 text-gray-500">
                Complete previous selections first
              </div>
            ) : (
              <>
                <button
                  onClick={() => setTemplateFoundation('tangible')}
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
                  onClick={() => setTemplateFoundation('custom')}
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
  
        {/* Form Selection (conditionally rendered) */}
        {templateFoundation === 'tangible' && (
          <ErrorBoundary fallback={
            <div className="text-center py-8 text-red-600">
              Error loading form selection. Please try again.
            </div>
          }>
            <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-gray-100 md:col-span-4">
              <PanelHeader 
                title="Select Form Template" 
                isActive={templateFoundation === 'tangible'}
                icon={FileCode}
              />
              <div className="p-6">
                <TemplateSelectionPanel
                  forms={availableForms}
                  selectedForm={selectedForm}
                  setSelectedForm={setSelectedForm}
                  conversionStates={conversionStates}
                  isLoading={isLoadingForms}
                  error={formsError}
                />
              </div>
            </div>
          </ErrorBoundary>
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
