import React, { useState } from 'react';
import {
  PackageCheck,
  Settings,
  FileText,
  ArrowLeft
} from 'lucide-react';

import TemplateSelector from './TemplateSelector';
import DealConstantsConfig from './DealConstantsConfig';
import DealBuildProcess from './DealBuildProcess';

const PanelHeader = ({ title, icon: Icon }) => (
  <div className="bg-white px-6 py-4 border-b border-gray-100">
    <div className="flex items-center gap-3">
      <Icon className="w-5 h-5 text-teal" />
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
  </div>
);

const BuildDealPackage = ({
  programGroup,
  agreementType,
  programClass,
  template,
  onBack
}) => {
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [buildStatus, setBuildStatus] = useState('idle');
  const [buildLog, setBuildLog] = useState([]);
  const [currentStep, setCurrentStep] = useState('template-selection');
  const [dealPackageData, setDealPackageData] = useState(null);

  // Handle template selection
  const handleTemplateSelect = (templates) => {
    console.log('🎯 Templates selected:', templates);
    setSelectedTemplates(templates);
  };

  // Handle continue from DealConstantsConfig
  const handleDealConstantsContinue = (data) => {
    console.log('📦 Received deal package data:', data);
    
    // Ensure we have the template information
    const packageWithTemplate = {
      ...data,
      templates: selectedTemplates // Make sure templates are included
    };
    
    console.log('📦 Complete package with templates:', packageWithTemplate);
    setDealPackageData(packageWithTemplate);
    setCurrentStep('build-process');
    
    // Begin template preparation
    prepareDealPackage(packageWithTemplate);
  };

  // Template preparation function
 // Template preparation function
const prepareDealPackage = async (data) => {
  setBuildStatus('preparing');
  setBuildLog(prev => [...prev, 'Starting deal package preparation...']);

  try {
    // Just set the data and move to next step
    console.log('📤 Preparing deal package with data:', data);
    setBuildStatus('ready');
    setBuildLog(prev => [...prev, 'Deal package data prepared successfully']);
    
  } catch (error) {
    console.error('❌ Error preparing deal package:', error);
    setBuildStatus('error');
    setBuildLog(prev => [...prev, `Error: ${error.message}`]);
  }
};
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PackageCheck className="w-6 h-6 text-teal" />
            <h2 className="text-xl font-semibold text-gray-800">Build Deal Package</h2>
          </div>
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-gray-500 hover:text-teal transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Conversion
          </button>
        </div>
        <p className="mt-2 text-gray-600">
          Create your deal package by selecting templates and configuring customer, provider, and deal-specific terms.
          The system will automatically populate your templates with the provided information.
        </p>
      </div>

      {/* Row 1: Template Selection */}
      <div className={`bg-white rounded-xl shadow-lg border border-gray-100 ${currentStep !== 'template-selection' ? 'opacity-50' : ''}`}>
        <PanelHeader title="Template Selection" icon={FileText} />
        <div className="p-6">
          <TemplateSelector
            programGroup={programGroup}
            agreementType={agreementType}
            programClass={programClass}
            onTemplateSelect={handleTemplateSelect}
          />
        </div>
      </div>

      {/* Row 2: Deal Constants Configuration */}
      <div className={`bg-white rounded-xl shadow-lg border border-gray-100 ${currentStep === 'build-process' ? 'opacity-50' : ''}`}>
        <PanelHeader title="Configure Deal Terms" icon={Settings} />
        <div className="p-6">
          <DealConstantsConfig
            templates={selectedTemplates}
            programClass={programClass}
            onContinue={handleDealConstantsContinue}
          />
        </div>
      </div>

      {/* Row 3: Build Process */}
      {currentStep === 'build-process' && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <PanelHeader title="Build Process" icon={PackageCheck} />
          <div className="p-6">
            <DealBuildProcess
              templates={selectedTemplates}
              buildStatus={buildStatus}
              buildLog={buildLog}
              dealPackageData={dealPackageData}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BuildDealPackage;
