import React, { useState } from 'react';
import { useConfig } from '../../../../../../../../context/ConfigContext';
import { 
    Settings, Shield, Database,  Globe, Building2, Server, Download,
    FileText, AlertCircle, Cloud, Clock, Package, Link, Users,
    Briefcase, Scale, Building, Rocket, Gavel, MessageSquare,
    Key, Warehouse, GitBranch, Book, X, UploadCloud,
    Code, TabletSmartphone, Zap, HardDrive, Braces, PenTool,
    LayoutTemplate, Workflow, Filter, ChevronsRight, Boxes, FolderGit2,
    HelpCircle, ArrowRight, CheckCircle, Save, PlayCircle
  } from 'lucide-react';



import { saveSchema } from '../../services/llmservice';


// Add this component within the same file
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

  const SchemaExportSection = ({ 
    editedSchema, 
    exportFormat, 
    setExportFormat, 
    exportCode, 
    projectInfo,
    handleGenerateExport,
    onBack,
    onFinalize
  }) => {
    const [statusMessage, setStatusMessage] = useState(null);
    
    const handleSaveSchema = async () => {
      try {
        const projectId = projectInfo?.project?.id;
        if (!projectId) {
          setStatusMessage({
            type: 'error',
            text: "Project ID is missing. Please select a project first."
          });
          return;
        }
        
        await saveSchema(projectId, editedSchema);
        
        setStatusMessage({
          type: 'success',
          text: 'Schema saved successfully!'
        });
        setTimeout(() => setStatusMessage(null), 3000);
      } catch (error) {
        setStatusMessage({
          type: 'error',
          text: `Failed to save schema: ${error.message}`
        });
      }
    };
    
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
          <Code className="w-5 h-5 text-royalBlue" />
          Schema Export
        </h2>
        
        {/* Format selection section */}
        <div className="flex items-center gap-4 mb-3">
          {/* ...existing code... */}
        </div>
        
        {/* Code display section */}
        <ExportPanel 
          code={exportCode}
          format={exportFormat}
          onRefresh={handleGenerateExport}
        />
        
        {/* Save Schema Section */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-blue-700">Save Schema for Document Processing</h3>
              <p className="text-sm text-blue-600 mt-1">
                Save this schema to use it later when uploading documents for review and extraction.
              </p>
            </div>
            
            <button
              onClick={handleSaveSchema}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                transition-colors flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Schema
            </button>
          </div>
          
          {statusMessage && (
            <div className={`mt-3 p-2 rounded-md text-sm ${
              statusMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {statusMessage.text}
            </div>
          )}
        </div>
        
        {/* Navigation buttons */}
        <div className="flex justify-end mt-6 gap-3">
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-lg border border-gray-300 
              text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Back to Refinement
          </button>
          <button
            onClick={onFinalize}
            className="px-6 py-2 rounded-lg bg-green-600 text-white 
              hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Finalize Schema
          </button>
        </div>
      </div>
    );
  };


  export default SchemaExportSection;
