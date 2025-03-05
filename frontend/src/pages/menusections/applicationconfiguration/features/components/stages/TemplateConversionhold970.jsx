import CurrentTemplates from '../panels/CurrentTemplates';
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Code
} from 'lucide-react';
import TemplateDetails from '../panels/TemplateDetails';
import ConversionSettings from '../panels/ConversionSettings';
import AutomateConstants from '../panels/AutomateConstants';
import ConversionProcess from '../panels/ConversionProcess';

const TemplateConversion = ({
  programGroup,
  agreementType,
  programClass,
  selectedForm,
  templateFoundation,
  setCurrentStage,
  onBack,
  onComplete
}) => {
  // Metadata state
  const [formMetadata, setFormMetadata] = useState(null);

  // Conversion settings state
  const [conversionSettings, setConversionSettings] = useState({
    preserveFormatting: true,
    detectVariables: true,
    enableLoopSupport: true,
    enableConditionals: true
  });

  // Conversion process states
  const [conversionStatus, setConversionStatus] = useState('idle'); // idle, converting, success, error
  const [conversionLog, setConversionLog] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch the actual form metadata from the registry
  useEffect(() => {
    const fetchFormMetadata = async () => {
      if (selectedForm) {
        try {
          const response = await fetch('/api/template-registry/tangible');
          const registry = await response.json();
          
          // Navigate the registry structure to find our form
          const programGroupData = registry.programGroups.find(pg => pg.id === programGroup);
          if (programGroupData) {
            const agreementTypeData = programGroupData.agreementTypes
              .find(at => at.id === agreementType);
            
            if (agreementTypeData) {
              const programClassData = agreementTypeData.programClasses
                .find(pc => pc.id === programClass);
              
              if (programClassData) {
                const formData = programClassData.forms
                  .find(f => f.id === selectedForm);
                
                if (formData) {
                  setFormMetadata(formData);
                  return;
                }
              }
            }
          }
          console.error('Form metadata not found in registry');
        } catch (error) {
          console.error('Error fetching form metadata:', error);
        }
      }
    };

    fetchFormMetadata();
  }, [selectedForm, programGroup, agreementType, programClass]);

  // Handle conversion setting changes
  const handleConversionSettingChange = (setting) => {
    setConversionSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  // Handle conversion process
  const startConversion = async () => {
    setConversionStatus('converting');
    setConversionLog([]);
    
    try {
      // Simulate conversion process with logs
      setConversionLog(prev => [...prev, "Starting conversion process..."]);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setConversionLog(prev => [...prev, "Analyzing template structure..."]);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setConversionLog(prev => [...prev, "Identifying variable placeholders..."]);
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      setConversionLog(prev => [...prev, "Converting to Jinja2 syntax..."]);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setConversionLog(prev => [...prev, "Applying template settings..."]);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setConversionLog(prev => [...prev, "Validating conversion..."]);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setConversionLog(prev => [...prev, "Conversion completed successfully!"]);
      setConversionStatus('success');
    } catch (error) {
      console.error("Conversion error:", error);
      setErrorMessage("An error occurred during conversion. Please try again.");
      setConversionStatus('error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Code className="w-6 h-6 text-teal" />
            <h2 className="text-xl font-semibold text-gray-800">Template Conversion</h2>
          </div>
          <button 
            onClick={onBack}
            className="flex items-center gap-1 text-gray-500 hover:text-teal transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Selection
          </button>
        </div>
        <p className="mt-2 text-gray-600">
          Convert your template to Jinja2 format for use with our template engine.
          This process will replace standard variables with Jinja2 syntax and prepare your template for easy production runs of deal packages.
        </p>
      </div>

      {/* Row 1: Template Details and Conversion Settings */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Template Details Panel */}
          <div className="border rounded-lg p-4">
            <h4 className="text-lg font-medium mb-4 text-teal">Template Details</h4>
            <TemplateDetails 
              formMetadata={formMetadata}
              programGroup={programGroup}
              agreementType={agreementType}
              programClass={programClass}
              selectedForm={selectedForm}
              templateFoundation={templateFoundation}
            />
          </div>

          {/* Conversion Settings Panel */}
          <div className="border rounded-lg p-4">
            <h4 className="text-lg font-medium mb-4 text-teal">Conversion Settings</h4>
            <div className="max-w-xl">
              <ConversionSettings 
                conversionSettings={conversionSettings}
                onSettingChange={handleConversionSettingChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Automate Constants */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <AutomateConstants />
      </div>

      {/* Row 3: Conversion Process */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <ConversionProcess 
          conversionStatus={conversionStatus}
          conversionLog={conversionLog}
          errorMessage={errorMessage}
          onStartConversion={startConversion}
          onComplete={onComplete}
        />
      </div>
      {/* Row 4: Current Templates */}
      <CurrentTemplates />

      </div>
  );
};


export default TemplateConversion;
