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
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
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
  const [currentStep, setCurrentStep] = useState('upload'); // 'upload', 'analyze', 'readyToGenerate', 'refine', 'export'
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

  // Analyze documents but don't automatically generate schema
  const handleAnalyzeDocuments = async () => {
    if (!uploadedFiles || uploadedFiles.length === 0) {
      setAnalysisErrors(['No files uploaded. Please upload at least one document.']);
      return;
    }
    
    setIsAnalyzing(true);
    setAnalysisErrors([]);
    
    try {
      // First analyze the sample data
      const results = await analyzeSampleData(
        uploadedFiles,
        analysisContext,
        apiKey
      );
      
      // Store analysis results
      setAnalysisResults(results);
      
      // Change to 'readyToGenerate' step instead of automatically generating schema
      setCurrentStep('readyToGenerate');
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

  // Generate schema - separate step that requires user action
  const handleGenerateSchema = async () => {
    if (!analysisResults) {
      setAnalysisErrors(['No analysis results available. Please analyze documents first.']);
      return;
    }
    
    setIsGenerating(true);
    setAnalysisErrors([]);
    
    try {
      // Generate schema proposal using analysis results
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
      console.error('Error generating schema:', error);
      setAnalysisErrors([
        'An error occurred during schema generation. Please try again.',
        error.message
      ]);
    } finally {
      setIsGenerating(false);
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
      
      {/* New section for when analysis is complete but schema hasn't been generated yet */}
      {currentStep === 'readyToGenerate' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Database className="w-6 h-6 text-royalBlue mr-3" />
            <h2 className="text-xl font-semibold">Documents Analyzed Successfully</h2>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-600">
              {uploadedFiles.length} document(s) have been analyzed. 
              You can now generate a schema based on the analysis results.
            </p>
            
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="font-medium text-blue-800 mb-2">Analysis Summary</h3>
              <ul className="list-disc pl-5 text-blue-700">
                <li>Document Type: {analysisContext.documentType}</li>
                <li>Files Analyzed: {uploadedFiles.length}</li>
                <li>Extraction Goals: {analysisContext.extractionGoals.length ? 
                  analysisContext.extractionGoals.join(', ') : 'No specific goals defined'}</li>
              </ul>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleGenerateSchema}
              disabled={isGenerating}
              className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2
                ${isGenerating
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-royalBlue text-white hover:bg-royalBlue/90'
                }`}
            >
              {isGenerating ? 'Generating Schema...' : 'Generate Schema'}
              {isGenerating && (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              )}
            </button>
          </div>
        </div>
      )}
      
      {currentStep === 'refine' && editedSchema && (
        <SchemaRefinementSection 
          editedSchema={editedSchema}
          activeView={activeView}
          setActiveView={setActiveView}
          handleSchemaUpdate={handleSchemaUpdate}
          onBack={() => setCurrentStep('readyToGenerate')}
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
        isGenerating={isGenerating}
        exportFormat={exportFormat}
        exportCode={exportCode}
        handlePrimaryAction={
          currentStep === 'analyze' 
            ? handleAnalyzeDocuments
            : currentStep === 'readyToGenerate'
            ? handleGenerateSchema
            : currentStep === 'refine'
            ? handleGenerateExport
            : handleFinalizeSchema
        }
      />
    </div>
  );
};

export default SchemaGenerationPanel;
