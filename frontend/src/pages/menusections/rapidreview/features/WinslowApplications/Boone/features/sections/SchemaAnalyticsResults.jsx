// src/components/platform/BooneConfiguration/SchemaAnalyticsResults.jsx
import React, { useState } from 'react';
import { 
  CheckCircle,
  FileText,
  AlertCircle,
  Database,
  LayoutTemplate
} from 'lucide-react';

const AnalysisCard = ({ title, description, data }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-medium text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
      
      <div className="p-4 bg-gray-50">
        <div className={`overflow-hidden ${isExpanded ? 'max-h-full' : 'max-h-32'}`}>
          <pre className="text-xs bg-gray-900 text-gray-100 p-3 rounded overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
        
        {Object.keys(data).length > 0 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-sm text-royalBlue hover:underline"
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </button>
        )}
      </div>
    </div>
  );
};

const FileAnalysisSummary = ({ fileAnalyses }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {fileAnalyses.map((file, index) => (
        <div key={index} className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-start mb-2">
            <FileText className="w-5 h-5 text-royalBlue mr-2 mt-0.5" />
            <div>
              <h3 className="font-medium">{file.filename}</h3>
              <p className="text-sm text-gray-600">
                {file.file_type === 'structured_data' ? 'Structured Data File' : 'Document File'}
              </p>
            </div>
          </div>
          
          <div className="mt-2">
            {file.file_type === 'structured_data' ? (
              <div>
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Columns detected: </span>
                  {file.columns?.length || 0}
                </div>
                <div className="text-sm text-gray-700 mt-1">
                  <span className="font-medium">Sample rows: </span>
                  {file.sample_data?.length || 0}
                </div>
              </div>
            ) : (
              <div>
                <div className="text-sm text-gray-700">
                  <span className="font-medium">Fields identified: </span>
                  {file.analysis?.identified_fields?.length || 0}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const SchemaAnalyticsResults = ({ analysisData, onGenerateSchema }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationOptions, setGenerationOptions] = useState({
    includeOptionalFields: true,
    useNestedStructure: true,
    includeValidationRules: true
  });
  
  const handleOptionChange = (option) => {
    setGenerationOptions({
      ...generationOptions,
      [option]: !generationOptions[option]
    });
  };
  
  const handleGenerateSchema = async () => {
    try {
      setIsGenerating(true);
      
      // Prepare data for schema generation
      const payload = {
        analysisResults: analysisData,
        options: generationOptions
      };
      
      console.log('Generating schema with options:', generationOptions);
      
      // In a real app, this would call an API endpoint
      // For now, simulate a delay and just return the analysis data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Call the callback with the schema data
      if (onGenerateSchema) {
        // In a real implementation, this would be the actual schema
        onGenerateSchema(analysisData);
      }
      
      setIsGenerating(false);
    } catch (error) {
      console.error('Schema generation error:', error);
      setIsGenerating(false);
      // Handle error
    }
  };
  
  if (!analysisData) {
    return <div>No analysis data available.</div>;
  }
  
  const { document_type, extraction_goals, file_analyses, briefing_context } = analysisData;
  
  return (
    <div className="space-y-6">
      {/* Analysis summary */}
      <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
        <h2 className="font-semibold text-blue-800 mb-2">Document Analysis Summary</h2>
        <div className="text-sm text-blue-700">
          <p>
            <span className="font-medium">Document Type:</span> {document_type || 'Not specified'}
          </p>
          <p className="mt-1">
            <span className="font-medium">Files Analyzed:</span> {file_analyses?.length || 0}
          </p>
        </div>
      </div>
      
      {/* File Analysis Summary */}
      <div>
        <h2 className="font-semibold text-gray-800 mb-3">Analyzed Documents</h2>
        <FileAnalysisSummary fileAnalyses={file_analyses || []} />
      </div>
      
      {/* Analysis Details Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnalysisCard 
          title="Document Type Analysis" 
          description="Information detected about the document type"
          data={{ document_type, extraction_goals }}
        />
        
        <AnalysisCard 
          title="Project Context" 
          description="Context information used for analysis"
          data={briefing_context || {}}
        />
      </div>
      
      {/* Schema Generation Options */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
        <h2 className="font-semibold text-gray-800 mb-3">Schema Generation Options</h2>
        
        <div className="space-y-3">
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="includeOptionalFields" 
              className="w-4 h-4 text-royalBlue border-gray-300 rounded focus:ring-royalBlue"
              checked={generationOptions.includeOptionalFields}
              onChange={() => handleOptionChange('includeOptionalFields')}
            />
            <label htmlFor="includeOptionalFields" className="ml-2 text-gray-700">
              Include optional fields detected in analysis
            </label>
          </div>
          
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="useNestedStructure" 
              className="w-4 h-4 text-royalBlue border-gray-300 rounded focus:ring-royalBlue"
              checked={generationOptions.useNestedStructure}
              onChange={() => handleOptionChange('useNestedStructure')}
            />
            <label htmlFor="useNestedStructure" className="ml-2 text-gray-700">
              Use nested structure for related fields
            </label>
          </div>
          
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="includeValidationRules" 
              className="w-4 h-4 text-royalBlue border-gray-300 rounded focus:ring-royalBlue"
              checked={generationOptions.includeValidationRules}
              onChange={() => handleOptionChange('includeValidationRules')}
            />
            <label htmlFor="includeValidationRules" className="ml-2 text-gray-700">
              Include validation rules based on detected patterns
            </label>
          </div>
        </div>
      </div>
      
      {/* Generate Schema Button */}
      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button
          onClick={handleGenerateSchema}
          disabled={isGenerating}
          className={`
            flex items-center gap-1 px-4 py-2 rounded-md text-white
            ${isGenerating ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}
            transition-colors
          `}
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <LayoutTemplate className="w-4 h-4" />
              <span>Generate Schema</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SchemaAnalyticsResults;
