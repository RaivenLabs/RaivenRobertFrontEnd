import React, { useState, useEffect } from 'react';
import { 
  Database, FileText, Edit, Save, Download, 
  Code, PlayCircle, X, Plus, ArrowRight,
  CheckCircle, AlertTriangle
} from 'lucide-react';

import { useConfig } from '../../../../../../../../context/ConfigContext';
import { analyzeSampleData, generateSchemaProposal, generateExportCode } from '../../services/llmservice.js';
import Tooltip from '../shared/Tooltip';
import StatusCard from '../booneconfiguration/StatusCard';
import SchemaFieldTable from './SchemaFieldTable';




const SchemaGenerationPanel = ({ uploadedFiles, documentType, onSchemaGenerated }) => {
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
      {/* Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusCard 
          title="Schema Generation Status"
          status={proposedSchema ? "active" : "pending"}
          description={proposedSchema 
            ? "Schema generated and ready for refinement" 
            : "Waiting for document analysis"}
          icon={Database}
        />
        <StatusCard 
          title="Document Analysis"
          status={uploadedFiles?.length > 0 ? "active" : "pending"}
          description={`${uploadedFiles?.length || 0} document(s) ready for processing`}
          icon={FileText}
        />
      </div>

      {/* Analysis Context Panel */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
          <Database className="w-5 h-5 text-royalBlue" />
          Schema Generation Context
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document Type
            </label>
            <select 
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={analysisContext.documentType}
              onChange={(e) => setAnalysisContext(prev => ({
                ...prev, 
                documentType: e.target.value
              }))}
            >
              <option value="toxic_tort">Toxic Tort Case Files</option>
              <option value="ma_due_diligence">M&A Due Diligence</option>
              <option value="saas_agreement">SaaS Agreement</option>
              <option value="other">Other Document Type</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Extraction Goals
            </label>
            <div className="flex gap-2 flex-wrap">
              {analysisContext.extractionGoals.map((goal, index) => (
                <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                  <span className="text-sm">{goal}</span>
                  <button 
                    className="ml-2 text-gray-500 hover:text-red-500"
                    onClick={() => {
                      setAnalysisContext(prev => ({
                        ...prev,
                        extractionGoals: prev.extractionGoals.filter((_, i) => i !== index)
                      }));
                    }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button 
                className="text-royalBlue flex items-center gap-1 text-sm"
                onClick={() => {
                  const goal = prompt('Enter a new extraction goal:');
                  if (goal) {
                    setAnalysisContext(prev => ({
                      ...prev,
                      extractionGoals: [...prev.extractionGoals, goal]
                    }));
                  }
                }}
              >
                <Plus className="w-4 h-4" /> Add Goal
              </button>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-md px-3 py-2 h-20"
              placeholder="Add any additional context that might help with schema generation..."
              value={analysisContext.userNotes}
              onChange={(e) => setAnalysisContext(prev => ({
                ...prev,
                userNotes: e.target.value
              }))}
            />
          </div>
        </div>
      </div>

      {/* Document Analysis Section */}
      {currentStep === 'analyze' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-royalBlue" />
            Document Analysis
          </h2>
          
          <div className="mb-4">
            <h3 className="font-medium text-gray-700">Uploaded Documents:</h3>
            <ul className="mt-2 space-y-1">
              {uploadedFiles?.map((file, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4 text-gray-500" />
                  {file.name} 
                  <span className="text-gray-500 text-xs">
                    ({Math.round(file.size / 1024)} KB)
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
          {analysisErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <div className="flex items-center gap-2 text-red-600 font-medium">
                <AlertTriangle className="w-5 h-5" />
                Analysis Errors
              </div>
              <ul className="mt-2 text-sm text-red-600 space-y-1 list-disc list-inside">
                {analysisErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          
          <button
            onClick={handleAnalyzeDocuments}
            disabled={isAnalyzing || !uploadedFiles?.length}
            className={`px-6 py-2 rounded-lg transition-colors 
              flex items-center gap-2
              ${(!isAnalyzing && uploadedFiles?.length)
                ? 'bg-royalBlue text-white hover:bg-royalBlue/90' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
          >
            {isAnalyzing ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                Analyzing Documents...
              </>
            ) : (
              <>
                <PlayCircle className="w-5 h-5" />
                Analyze Documents
              </>
            )}
          </button>
        </div>
      )}

      {/* Schema Refinement Section */}
      {currentStep === 'refine' && editedSchema && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
              <Edit className="w-5 h-5 text-royalBlue" />
              Schema Refinement
            </h2>
            
            <div className="flex items-center gap-2">
              <button
                className={`px-3 py-1 rounded-md text-sm ${
                  activeView === 'table' 
                    ? 'bg-royalBlue text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setActiveView('table')}
              >
                Table View
              </button>
              <button
                className={`px-3 py-1 rounded-md text-sm ${
                  activeView === 'visual' 
                    ? 'bg-royalBlue text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setActiveView('visual')}
              >
                Visual View
              </button>
            </div>
          </div>
          
          {activeView === 'table' ? (
            <SchemaFieldTable
              schema={editedSchema}
              onUpdateSchema={handleSchemaUpdate}
            />
          ) : (
            <SchemaVisualization 
              schema={editedSchema}
              onUpdateSchema={handleSchemaUpdate}
            />
          )}
          
          <div className="flex justify-end mt-6 gap-3">
            <button
              onClick={() => setCurrentStep('analyze')}
              className="px-4 py-2 rounded-lg border border-gray-300 
                text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back to Analysis
            </button>
            <button
              onClick={handleGenerateExport}
              className="px-6 py-2 rounded-lg bg-royalBlue text-white 
                hover:bg-royalBlue/90 transition-colors flex items-center gap-2"
            >
              <ArrowRight className="w-5 h-5" />
              Generate Export
            </button>
          </div>
        </div>
      )}

      {/* Schema Export Section */}
      {currentStep === 'export' && editedSchema && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
            <Code className="w-5 h-5 text-royalBlue" />
            Schema Export
          </h2>
          
          <div className="mb-4">
            <div className="flex items-center gap-4 mb-3">
              <label className="font-medium text-gray-700">Export Format:</label>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="exportFormat"
                    value="json"
                    checked={exportFormat === 'json'}
                    onChange={() => setExportFormat('json')}
                    className="text-royalBlue"
                  />
                  JSON Schema
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="exportFormat"
                    value="sql"
                    checked={exportFormat === 'sql'}
                    onChange={() => setExportFormat('sql')}
                    className="text-royalBlue"
                  />
                  SQL (PostgreSQL)
                </label>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-700">
                  {exportFormat === 'json' ? 'JSON Schema' : 'SQL DDL Statements'}
                </h3>
                <button
                  onClick={handleGenerateExport}
                  className="p-1 rounded-md hover:bg-gray-200 text-gray-600"
                  title="Refresh code"
                >
                  <PlayCircle className="w-4 h-4" />
                </button>
              </div>
              
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
                {exportCode || 'Loading...'}
              </pre>
            </div>
          </div>
          
          <div className="flex justify-end mt-6 gap-3">
            <button
              onClick={() => setCurrentStep('refine')}
              className="px-4 py-2 rounded-lg border border-gray-300 
                text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back to Refinement
            </button>
            <button
              onClick={handleFinalizeSchema}
              className="px-6 py-2 rounded-lg bg-green-600 text-white 
                hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Finalize Schema
            </button>
          </div>
        </div>
      )}

      {/* Action Panel */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            {currentStep === 'upload'
              ? 'Upload documents to begin the schema generation process'
              : currentStep === 'analyze'
              ? 'Analyze documents to generate an initial schema proposal'
              : currentStep === 'refine'
              ? 'Review and refine the proposed schema before generating exports'
              : 'Export your schema as SQL or JSON for implementation'}
          </p>
          
          <div className="flex space-x-4">
            {currentStep === 'export' && (
              <button
                onClick={() => {
                  // Download functionality
                  const blob = new Blob([exportCode], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `schema-export.${exportFormat === 'sql' ? 'sql' : 'json'}`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }}
                className="px-6 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-800 
                  transition-colors flex items-center gap-2"
              >
                Download Export
                <Download className="w-5 h-5" />
              </button>
            )}
            
            {currentStep !== 'upload' && (
              <button
                onClick={currentStep === 'analyze' 
                  ? handleAnalyzeDocuments
                  : currentStep === 'refine'
                  ? handleGenerateExport
                  : handleFinalizeSchema}
                className="px-6 py-2 rounded-lg bg-royalBlue text-white hover:bg-royalBlue/90 
                  transition-colors flex items-center gap-2"
                disabled={isAnalyzing}
              >
                {currentStep === 'analyze' 
                  ? 'Generate Schema'
                  : currentStep === 'refine'
                  ? 'Generate Export'
                  : 'Save & Finalize'}
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock component for SchemaVisualization since it's referenced but not defined
const SchemaVisualization = ({ schema, onUpdateSchema }) => {
  return (
    <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-center py-12 text-center">
        <AlertTriangle className="w-8 h-8 text-yellow-400 mr-3" />
        <div>
          <h3 className="font-medium text-gray-700">Visualization Coming Soon</h3>
          <p className="text-gray-500 mt-1">
            Schema visualization is currently under development.
            Please use the table view for schema editing.
          </p>
        </div>
      </div>
    </div>
  );
};

// Mock component for ExportPanel since it's referenced but not defined
const ExportPanel = ({ code, format, onRefresh }) => {
  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium text-gray-700">
          {format === 'json' ? 'JSON Schema' : 'SQL DDL Statements'}
        </h3>
        <button
          onClick={onRefresh}
          className="p-1 rounded-md hover:bg-gray-200 text-gray-600"
          title="Refresh code"
        >
          <PlayCircle className="w-4 h-4" />
        </button>
      </div>
      
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
        {code || 'No code generated yet. Click "Generate Export" to create code.'}
      </pre>
    </div>
  );
};

export default SchemaGenerationPanel;
