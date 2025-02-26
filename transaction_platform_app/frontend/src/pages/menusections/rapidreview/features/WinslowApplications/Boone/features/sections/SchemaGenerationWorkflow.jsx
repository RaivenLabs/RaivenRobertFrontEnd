import React, { useState, useEffect } from 'react';
import { useConfig } from '../../../../../../../../context/ConfigContext';
import { Settings, Database, FileText, ArrowRight, LayoutTemplate } from 'lucide-react';

import ProjectSelectionPanel from './ProjectSelectionPanel';
import DocumentUploadPanel from './DocumentUploadPanel';
import SchemaGenerationPanel from './SchemaGenerationPanel';
import SchemaFieldTable from './SchemaFieldTable';

// Workflow stages
const WORKFLOW_STAGES = {
  PROJECT_SELECTION: 'project_selection',
  DOCUMENT_UPLOAD: 'document_upload',
  SCHEMA_GENERATION: 'schema_generation',
  SCHEMA_EXPORT: 'schema_export'
};

const SchemaGenerationWorkflow = () => {
  const { customerId } = useConfig();
  
  // State management
  const [currentStage, setCurrentStage] = useState(WORKFLOW_STAGES.PROJECT_SELECTION);
  const [projectInfo, setProjectInfo] = useState(null);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [generatedSchema, setGeneratedSchema] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [briefingContext, setBriefingContext] = useState(null);
  
  // Load briefing context for the selected project
  useEffect(() => {
    if (projectInfo && projectInfo.project) {
      const loadBriefingContext = async () => {
        try {
          // In a real implementation, this would be an API call
          // For demo purposes, we'll simulate loading from a static file
          const response = await fetch(`/api/briefing/${projectInfo.project.id}`);
          
          if (!response.ok) {
            throw new Error(`Failed to load briefing: ${response.status}`);
          }
          
          const contextData = await response.json();
          setBriefingContext(contextData);
          console.log("Loaded briefing context:", contextData);
        } catch (error) {
          console.error('Error loading briefing context:', error);
          
          // Fallback to a default context if needed
          setBriefingContext({
            project: {
              name: projectInfo.project.name,
              type: projectInfo.programType === 'ma' ? 'M&A Due Diligence' : 'Unknown'
            },
            business_context: 'Default context information'
          });
        }
      };
      
      loadBriefingContext();
    }
  }, [projectInfo]);
  
  // Handle project selection
  const handleProjectSelected = (programType, project) => {
    setProjectInfo({
      programType,
      project
    });
    
    setCurrentStage(WORKFLOW_STAGES.DOCUMENT_UPLOAD);
  };
  
  // Handle document upload completion
  const handleDocumentsUploaded = (documents) => {
    setUploadedDocuments(documents);
    setCurrentStage(WORKFLOW_STAGES.SCHEMA_GENERATION);
  };
  
  // Handle schema generation
  const handleSchemaGenerated = (schema, exportCode) => {
    setGeneratedSchema(schema);
    setCurrentStage(WORKFLOW_STAGES.SCHEMA_EXPORT);
  };
  
  // Function to get the stage title
  const getStageTitle = () => {
    switch (currentStage) {
      case WORKFLOW_STAGES.PROJECT_SELECTION:
        return 'Select Project';
      case WORKFLOW_STAGES.DOCUMENT_UPLOAD:
        return 'Upload Schema Source Documents';
      case WORKFLOW_STAGES.SCHEMA_GENERATION:
        return 'Generate Data Schema';
      case WORKFLOW_STAGES.SCHEMA_EXPORT:
        return 'Export Schema';
      default:
        return 'Schema Generation';
    }
  };
  
  // Function to get the stage icon
  const getStageIcon = () => {
    switch (currentStage) {
      case WORKFLOW_STAGES.PROJECT_SELECTION:
        return Settings;
      case WORKFLOW_STAGES.DOCUMENT_UPLOAD:
        return FileText;
      case WORKFLOW_STAGES.SCHEMA_GENERATION:
        return LayoutTemplate;
      case WORKFLOW_STAGES.SCHEMA_EXPORT:
        return Database;
      default:
        return Settings;
    }
  };
  
  // Render the StageIndicator component
  const StageIndicator = () => {
    const stages = [
      { id: WORKFLOW_STAGES.PROJECT_SELECTION, label: 'Project Selection' },
      { id: WORKFLOW_STAGES.DOCUMENT_UPLOAD, label: 'Document Upload' },
      { id: WORKFLOW_STAGES.SCHEMA_GENERATION, label: 'Schema Generation' },
      { id: WORKFLOW_STAGES.SCHEMA_EXPORT, label: 'Schema Export' }
    ];
    
    return (
      <div className="flex items-center mb-8">
        {stages.map((stage, index) => (
          <React.Fragment key={stage.id}>
            <div className={`flex flex-col items-center ${
              stages.indexOf(stage) <= stages.findIndex(s => s.id === currentStage)
                ? 'text-royalBlue'
                : 'text-gray-400'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                stages.indexOf(stage) < stages.findIndex(s => s.id === currentStage)
                  ? 'bg-royalBlue text-white border-royalBlue'
                  : stage.id === currentStage
                  ? 'border-royalBlue text-royalBlue'
                  : 'border-gray-300 text-gray-400'
              }`}>
                {stages.indexOf(stage) < stages.findIndex(s => s.id === currentStage) ? (
                  '✓'
                ) : (
                  index + 1
                )}
              </div>
              <span className="text-xs mt-1">{stage.label}</span>
            </div>
            
            {index < stages.length - 1 && (
              <div className={`h-0.5 w-16 mx-1 ${
                stages.indexOf(stage) < stages.findIndex(s => s.id === currentStage)
                  ? 'bg-royalBlue'
                  : 'bg-gray-300'
              }`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-ivory p-6 space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-8 h-8 text-royalBlue" />
          <h1 className="text-2xl font-bold text-gray-800">
            Data Schema Generator
          </h1>
        </div>
        
        <p className="text-gray-600 mb-6">
          Generate and export optimized data schemas for document extraction using AI assistance.
          {projectInfo && (
            <span className="ml-1">
              Currently working on: <strong>{projectInfo.project.name}</strong>
            </span>
          )}
        </p>
        
        <StageIndicator />
      </div>
      
      {/* Dynamic Content Area */}
      {currentStage === WORKFLOW_STAGES.PROJECT_SELECTION && (
        <ProjectSelectionPanel 
          onProjectSelected={handleProjectSelected} 
        />
      )}
      
      {currentStage === WORKFLOW_STAGES.DOCUMENT_UPLOAD && (
        <DocumentUploadPanel 
          projectInfo={projectInfo}
          onDocumentsUploaded={handleDocumentsUploaded}
        />
      )}
      
      {currentStage === WORKFLOW_STAGES.SCHEMA_GENERATION && (
        <SchemaGenerationPanel
          uploadedFiles={uploadedDocuments.map(doc => doc.file)}
          documentType={projectInfo?.programType === 'ma' ? 'ma_due_diligence' : 'unknown'}
          briefingContext={briefingContext} 
          projectInfo={projectInfo}
          onSchemaGenerated={handleSchemaGenerated}
        />
      )}
      
      {/* Navigation Controls */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <button
            onClick={() => {
              if (currentStage === WORKFLOW_STAGES.DOCUMENT_UPLOAD) {
                setCurrentStage(WORKFLOW_STAGES.PROJECT_SELECTION);
              } else if (currentStage === WORKFLOW_STAGES.SCHEMA_GENERATION) {
                setCurrentStage(WORKFLOW_STAGES.DOCUMENT_UPLOAD);
              } else if (currentStage === WORKFLOW_STAGES.SCHEMA_EXPORT) {
                setCurrentStage(WORKFLOW_STAGES.SCHEMA_GENERATION);
              }
            }}
            className={`px-4 py-2 rounded-lg border border-gray-300 
              text-gray-700 hover:bg-gray-50 transition-colors
              ${currentStage === WORKFLOW_STAGES.PROJECT_SELECTION ? 'invisible' : ''}`}
          >
            Back
          </button>
          
          <div className="text-gray-600">
            {currentStage === WORKFLOW_STAGES.PROJECT_SELECTION ? (
              "Select a project to begin"
            ) : currentStage === WORKFLOW_STAGES.DOCUMENT_UPLOAD ? (
              "Upload schema source documents"
            ) : currentStage === WORKFLOW_STAGES.SCHEMA_GENERATION ? (
              "Generate and refine data schema"
            ) : (
              "Export and finalize your schema"
            )}
          </div>
          
          <button
            onClick={() => {
              // This is handled by the individual panels
              // but we add this button for visual consistency
            }}
            className="invisible px-6 py-2 rounded-lg bg-royalBlue text-white 
              hover:bg-royalBlue/90 transition-colors flex items-center gap-2"
          >
            Continue
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchemaGenerationWorkflow;
