import React, { useState } from 'react';
import {
  PackageCheck,
  Settings,
  FileText,
  ArrowLeft,
  Download,
  Send,
  CheckCircle
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

  const handleDealConstantsContinue = (data) => {
    setDealPackageData(data);
    setCurrentStep('build-process');
    prepareDealPackage(data);
  };

  const prepareDealPackage = async (data) => {
    setBuildStatus('preparing');
    setBuildLog(prev => [...prev, 'Starting deal package preparation...']);

    try {
      const response = await fetch('/api/prepare-deal-package', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to prepare deal package');
      }

      const result = await response.json();
      setBuildStatus('complete');
      setBuildLog(prev => [...prev, 'Deal package prepared successfully']);

    } catch (error) {
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
            onTemplateSelect={setSelectedTemplates}
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

      {/* Row 3: Build Process and Controls */}
      {currentStep === 'build-process' && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <PanelHeader title="Build Process" icon={PackageCheck} />
          <div className="p-6 space-y-6">
            <DealBuildProcess
              templates={selectedTemplates}
              buildStatus={buildStatus}
              buildLog={buildLog}
              dealPackageData={dealPackageData}
            />
            
            {/* Control Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => prepareDealPackage(dealPackageData)}
                  className="flex items-center gap-2 px-4 py-2 bg-teal text-white rounded-lg hover:bg-teal/90"
                  disabled={buildStatus === 'preparing'}
                >
                  <PackageCheck className="w-4 h-4" />
                  Build Deal
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  <Send className="w-4 h-4" />
                  Send
                </button>
              </div>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4" />
                Finish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuildDealPackage;
