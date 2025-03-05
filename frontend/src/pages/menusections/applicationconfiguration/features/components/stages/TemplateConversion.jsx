import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Code,
  Settings,
  FileText
} from 'lucide-react';
import TemplateDetails from '../panels/TemplateDetails';
import ConversionSettings from '../panels/ConversionSettings';
import ConversionProcess from '../panels/ConversionProcess';
import AutomateConstants from '../panels/AutomateConstants';
import BuildDealPackage from '../panels/BuildDealPackage';

const PanelHeader = ({ title, icon: Icon }) => (
  <div className="bg-white px-6 py-4 border-b border-gray-100">
    <div className="flex items-center gap-3">
      <Icon className="w-5 h-5 text-teal" />
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
  </div>
);

const TemplateConversion = ({
  programGroup,
  agreementType,
  programClass,
  selectedForm,
  templateData,
  templateFoundation,
  setCurrentStage,
  onBack,
  onComplete
}) => {
  // States
  const [conversionStatus, setConversionStatus] = useState('idle');
  const [conversionLog, setConversionLog] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [formMetadata, setFormMetadata] = useState(templateData);
  const [showBuildDealPackage, setShowBuildDealPackage] = useState (false);

  const handleStartConversion = async () => {
    console.log('Starting conversion with template:', templateData);
    
    setConversionStatus('converting');
    setConversionLog([]);
    setErrorMessage('');
    
    try {
      setConversionLog(prev => [...prev, "Starting conversion process..."]);
      
      const response = await fetch('/api/convert_template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template: templateData,
          settings: {
            preserveFormatting: true,
            detectVariables: true,
            enableLoopSupport: true,
            enableConditionals: true
          }
        })
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Conversion failed');
      }

      setConversionLog(prev => [...prev, "Conversion completed successfully"]);
      setConversionStatus('success');
      
      // Brief pause before completing
      await new Promise(resolve => setTimeout(resolve, 800));
      onComplete();
    } catch (error) {
      console.error("Conversion error:", error);
      setErrorMessage(error.message || "An error occurred during conversion. Please try again.");
      setConversionStatus('error');
    }
  };


  const handleBuildDealPackage = () => {
    setShowBuildDealPackage(true);
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
<div className="bg-white rounded-xl shadow-lg border border-gray-100">
  <PanelHeader title="Template Configuration" icon={Settings} />
  <div className="grid grid-cols-2 gap-6 p-6">
    {/* Template Details Container */}
    <div className="rounded-lg border border-gray-200">
      <div className="bg-teal text-white px-4 py-2 text-sm font-medium rounded-t-lg">
        Template Details
      </div>
      <div className="bg-gray-50 p-4 rounded-b-lg">
        <TemplateDetails 
          formMetadata={formMetadata}
          programGroup={programGroup}
          agreementType={agreementType}
          programClass={programClass}
          selectedForm={selectedForm}
          templateFoundation={templateFoundation}
        />
      </div>
    </div>

    {/* Conversion Settings Container */}
    <div className="rounded-lg border border-gray-200">
      <div className="bg-teal text-white px-4 py-2 text-sm font-medium rounded-t-lg">
        Conversion Settings
      </div>
      <div className="bg-gray-50 p-4 rounded-b-lg">
        <ConversionSettings 
          conversionSettings={{
            preserveFormatting: true,
            detectVariables: true,
            enableLoopSupport: true,
            enableConditionals: true
          }}
          onSettingChange={() => {}}
        />
      </div>
    </div>
  </div>
</div>

      {/* Row 2: Automate Constants */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <PanelHeader title="Automate Constants" icon={FileText} />
        <div className="p-6">
          <AutomateConstants />
        </div>
      </div>

      {/* Row 3: Conversion Process */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <PanelHeader title="Conversion Process" icon={Code} />
        <div className="p-6">
          {/* Debug log */}
          
          
          <ConversionProcess 
            template={templateData}
            conversionStatus={conversionStatus}
            conversionLog={conversionLog}
            errorMessage={errorMessage}
            onStartConversion={handleStartConversion}
            onComplete={onComplete}
            onBuildDealPackage={handleBuildDealPackage}

          />
        </div>
      </div>




{/* Row 4: Build Deal Package (shown conditionally) */}
{showBuildDealPackage && (
        <BuildDealPackage 
          programGroup={programGroup}
          agreementType={agreementType}
          programClass={programClass}
          template={templateData}
        />
      )}
    </div>
  );
};

export default TemplateConversion;
