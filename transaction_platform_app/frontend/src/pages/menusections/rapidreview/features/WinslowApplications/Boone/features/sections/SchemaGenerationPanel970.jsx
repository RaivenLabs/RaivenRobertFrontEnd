import React, { useState, useEffect } from 'react';
import { Database } from 'lucide-react';
import { useConfig } from '../../../../../../../../context/ConfigContext';
import { 
  analyzeSampleData, 
  generateSchemaProposal, 
  generateExportCode 
} from '../../services/llmservice';

// Import all sub-components
import SchemaStatus from './SchemaStatus';
import SchemaContextSection from './SchemaContextSection';
import SchemaAnalysisSection from './SchemaAnalysisSection';
import SchemaRefinementSection from './SchemaRefinementSection';
import SchemaExportPanel from './SchemaExportPanel';
import SchemaActionPanel from './SchemaActionPanel';

const SchemaGenerationPanel = ({ uploadedFiles, documentType, onSchemaGenerated, projectInfo }) => {
  // State management
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [proposedSchema, setProposedSchema] = useState(null);
  const [editedSchema, setEditedSchema] = useState(null);
  const [activeView, setActiveView] = useState('table'); // 'table' or 'visual'
  const [analysisContext, setAnalysisContext] = useState({
    documentType: documentType || 'unknown',
    extractionGoals: [],
    userNotes: '',
    previousAdjustments: []
  });
  const [exportFormat, setExportFormat] = useState('json'); // 'json' or 'sql'
  const [exportCode, setExportCode] = useState('');
  const [currentStep, setCurrentStep] = useState('upload'); // 'upload', 'analyze', 'refine', 'export'
  const [analysisErrors, setAnalysisErrors] = useState([]);
  
  const { apiKey, modelSettings } = useConfig();

  // Update context when document type changes
  useEffect(() => {
    setAnalysisContext(prev => ({
      ...prev,
      documentType
    }));
  }, [documentType]);

  // Track when files are uploaded
  useEffect(() => {
    if (uploadedFiles && uploadedFiles.length > 0) {
      setCurrentStep('analyze');
    }
  }, [uploadedFiles]);

  // Generate schema based on uploaded files
  const handleAnalyzeDocuments = async () => {
    if (!uploadedFiles || uploadedFiles.length === 0) {
      setAnalysisErrors(['No files uploaded. Please upload at least one document.']);
      return;
    }
    
    setIsAnalyzing(true);
    setAnalysisErrors([]);
    
    try {
      // First analyze the sample data
      const analysisResults = await analyzeSampleData(
        uploadedFiles,
        analysisContext,
        apiKey
      );
      
      // Then generate schema proposal based on analysis
      const schema = await generateSchemaProposal(
        analysisResults,
        analysisContext,
        modelSettings,
        apiKey
      );
      
      setProposedSchema(schema);
      setEditedSchema(schema); // Start with the proposed schema
      setCurrentStep('refine');
    } catch (error) {
      console.error('Error analyzing documents:', error);
      setAnalysisErrors([
        'An error occurred during document analysis. Please try again.',
        error.message
      ]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle schema field updates
  const handleSchemaUpdate = (updatedSchema) => {
    setEditedSchema(updatedSchema);
    
    // Track this adjustment in context for future refinements
    setAnalysisContext(prev => ({
      ...prev,
      previousAdjustments: [
        ...prev.previousAdjustments,
        {
          timestamp: new Date().toISOString(),
          change: 'Schema updated by user'
        }
      ]
    }));
  };

  // Generate export code (SQL or JSON)
  const handleGenerateExport = async () => {
    if (!editedSchema) return;
    
    setCurrentStep('export');
    
    try {
      const code = await generateExportCode(
        editedSchema,
        exportFormat,
        apiKey
      );
      
      setExportCode(code);
    } catch (error) {
      console.error('Error generating export:', error);
      setAnalysisErrors([
        `Error generating ${exportFormat === 'sql' ? 'SQL' : 'JSON Schema'}. Please try again.`,
        error.message
      ]);
    }
  };

  // Finalize schema and notify parent component
  const handleFinalizeSchema = () => {
    if (onSchemaGenerated && editedSchema) {
      onSchemaGenerated(editedSchema, exportCode);
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Section */}
      <SchemaStatus 
        proposedSchema={proposedSchema} 
        uploadedFiles={uploadedFiles} 
      />
      
      {/* Context Section */}
      <SchemaContextSection 
        analysisContext={analysisContext}
        setAnalysisContext={setAnalysisContext}
      />
      
      {/* Dynamic Content Based on Current Step */}
      {currentStep === 'analyze' && (
        <SchemaAnalysisSection 
          uploadedFiles={uploadedFiles}
          isAnalyzing={isAnalyzing}
          analysisErrors={analysisErrors}
          handleAnalyzeDocuments={handleAnalyzeDocuments}
        />
      )}
      
      {currentStep === 'refine' && editedSchema && (
        <SchemaRefinementSection 
          editedSchema={editedSchema}
          activeView={activeView}
          setActiveView={setActiveView}
          handleSchemaUpdate={handleSchemaUpdate}
          onBack={() => setCurrentStep('analyze')}
          onNext={handleGenerateExport}
        />
      )}
      
      {currentStep === 'export' && editedSchema && (
        <SchemaExportPanel 
          editedSchema={editedSchema}
          exportFormat={exportFormat}
          setExportFormat={setExportFormat}
          exportCode={exportCode}
          projectInfo={projectInfo}
          handleGenerateExport={handleGenerateExport}
          onBack={() => setCurrentStep('refine')}
          onFinalize={handleFinalizeSchema}
        />
      )}
      
      {/* Action Panel */}
      <SchemaActionPanel 
        currentStep={currentStep}
        isAnalyzing={isAnalyzing}
        exportFormat={exportFormat}
        exportCode={exportCode}
        handlePrimaryAction={
          currentStep === 'analyze' 
            ? handleAnalyzeDocuments
            : currentStep === 'refine'
            ? handleGenerateExport
            : handleFinalizeSchema
        }
      />
    </div>
  );
};

export default SchemaGenerationPanel;
