import React, { useState, useEffect } from 'react';
import { 
  programGroups, 
  agreementTypes, 
  getAvailableProgramClasses,
  getAvailableForms 
} from '../../../programStructure';
import { ChevronRight, CheckCircle } from 'lucide-react';
import TemplateDetails from './TemplateDetails';

const TemplateSelector = ({ 
  programGroup: initialProgramGroup,
  agreementType: initialAgreementType,
  programClass: initialProgramClass,
  onTemplateSelect,
  templateData,
  templateFoundation,
  selectedForm
}) => {
  // States for selections, defaulting to initial values
  const [selectedGroup, setSelectedGroup] = useState(initialProgramGroup);
  const [selectedAgreementType, setSelectedAgreementType] = useState(initialAgreementType);
  const [selectedProgramClass, setSelectedProgramClass] = useState(initialProgramClass);
  const [availableProgramClasses, setAvailableProgramClasses] = useState([]);
  const [availableForms, setAvailableForms] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [formMetadata, setFormMetadata] = useState(templateData);

  // Get selected items' names for breadcrumbs
  const selectedGroupName = programGroups.find(g => g.id === selectedGroup)?.name;
  const selectedTypeName = agreementTypes.find(t => t.id === selectedAgreementType)?.name;
  const selectedClassName = availableProgramClasses.find(c => c.id === selectedProgramClass)?.name;

  // Update available program classes when group and agreement type change
  useEffect(() => {
    if (selectedGroup && selectedAgreementType) {
      const classes = getAvailableProgramClasses(selectedGroup, selectedAgreementType);
      setAvailableProgramClasses(classes);
    } else {
      setAvailableProgramClasses([]);
    }
  }, [selectedGroup, selectedAgreementType]);

  // Update available forms when program class changes
  useEffect(() => {
    if (selectedProgramClass && selectedAgreementType) {
      const forms = getAvailableForms(selectedProgramClass, selectedAgreementType);
      setAvailableForms(forms);
    } else {
      setAvailableForms([]);
    }
  }, [selectedProgramClass, selectedAgreementType]);

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Left panel - Selection Hierarchy */}
      <div className="rounded-lg border border-gray-200">
        <div className="bg-teal text-white px-4 py-2 text-sm font-medium rounded-t-lg">
          Focus
        </div>
        <div className="bg-gray-50 p-4 rounded-b-lg">
          {/* Breadcrumbs */}
          <div className="mb-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              {selectedGroupName && (
                <>
                  <span className="font-medium">{selectedGroupName}</span>
                  {selectedTypeName && <ChevronRight className="w-4 h-4" />}
                </>
              )}
              {selectedTypeName && (
                <>
                  <span className="font-medium">{selectedTypeName}</span>
                  {selectedClassName && <ChevronRight className="w-4 h-4" />}
                </>
              )}
              {selectedClassName && (
                <span className="font-medium">{selectedClassName}</span>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Program Group Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Program Group
              </label>
              <div className="space-y-2">
                {programGroups.map(group => (
                  <label key={group.id} className="flex items-center gap-2 p-2 rounded hover:bg-gray-100">
                    <input
                      type="radio"
                      name="programGroup"
                      value={group.id}
                      checked={selectedGroup === group.id}
                      onChange={(e) => {
                        setSelectedGroup(e.target.value);
                        setSelectedAgreementType(null);
                        setSelectedProgramClass(null);
                      }}
                      className="text-teal focus:ring-teal"
                    />
                    <span className="text-sm text-gray-600">{group.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Agreement Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agreement Type
              </label>
              <div className="space-y-2">
                {agreementTypes.map(type => (
                  <label key={type.id} className="flex items-center gap-2 p-2 rounded hover:bg-gray-100">
                    <input
                      type="radio"
                      name="agreementType"
                      value={type.id}
                      checked={selectedAgreementType === type.id}
                      onChange={(e) => {
                        setSelectedAgreementType(e.target.value);
                        setSelectedProgramClass(null);
                      }}
                      className="text-teal focus:ring-teal"
                    />
                    <span className="text-sm text-gray-600">{type.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Program Class Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Program Class
              </label>
              <div className="space-y-2">
                {availableProgramClasses.map(cls => (
                  <label key={cls.id} className="flex items-center gap-2 p-2 rounded hover:bg-gray-100">
                    <input
                      type="radio"
                      name="programClass"
                      value={cls.id}
                      checked={selectedProgramClass === cls.id}
                      onChange={(e) => setSelectedProgramClass(e.target.value)}
                      className="text-teal focus:ring-teal"
                    />
                    <span className="text-sm text-gray-600">{cls.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle panel - Template Selection */}
      <div className="rounded-lg border border-gray-200">
        <div className="bg-teal text-white px-4 py-2 text-sm font-medium rounded-t-lg">
          Template Selection
        </div>
        <div className="bg-gray-50 p-4 rounded-b-lg">
          <div className="space-y-4">
            {availableForms.map(template => (
              <div 
                key={template.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all
                  ${selectedTemplateId === template.id 
                    ? 'border-teal bg-white shadow-sm' 
                    : 'border-gray-200 hover:border-teal/50 hover:shadow-sm'}`}
                onClick={() => {
                  setSelectedTemplateId(template.id);
                  setFormMetadata(template);
                  onTemplateSelect(template);
                }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-800">{template.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                  </div>
                  {selectedTemplateId === template.id && (
                    <CheckCircle className="w-5 h-5 text-teal" />
                  )}
                </div>
              </div>
            ))}
            {availableForms.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>Select a program class to view available templates</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right panel - Template Details */}
      <div className="rounded-lg border border-gray-200">
        <div className="bg-teal text-white px-4 py-2 text-sm font-medium rounded-t-lg">
          Template Details
        </div>
        <div className="bg-gray-50 p-4 rounded-b-lg">
          <TemplateDetails 
            formMetadata={formMetadata}
            programGroup={selectedGroup}
            agreementType={selectedAgreementType}
            programClass={selectedProgramClass}
            selectedForm={selectedTemplateId}
            templateFoundation={templateFoundation}
          />
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;
