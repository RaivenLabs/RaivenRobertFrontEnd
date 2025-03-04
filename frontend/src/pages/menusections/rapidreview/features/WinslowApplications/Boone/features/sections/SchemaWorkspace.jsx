// src/components/platform/BooneConfiguration/SchemaWorkspace.jsx
import React from 'react';
import { 
  LayoutTemplate, 
  Check,
  Save,
  AlertCircle,
  Sliders
} from 'lucide-react';

const AIWorkspace = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center text-sm text-gray-600 bg-blue-50 p-3 rounded-md border border-blue-100">
        <AlertCircle className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
        <p>AI-assisted schema generation analyzes your documents to identify relevant fields and create an optimized schema structure. Upload your documents below to begin.</p>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">What to expect from AI schema generation:</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start">
            <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
            <span>Automatic field detection based on document content</span>
          </li>
          <li className="flex items-start">
            <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
            <span>Intelligent field type inference (string, number, date, etc.)</span>
          </li>
          <li className="flex items-start">
            <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
            <span>Optimized schema structure with appropriate nesting</span>
          </li>
          <li className="flex items-start">
            <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
            <span>Consistently named fields following best practices</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

const SchemaStructure = () => {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Schema Structure</h3>
      <div className="bg-gray-50 p-4 rounded-md">
        <div className="mb-3">
          <label className="block text-sm text-gray-700 mb-1">Schema Name</label>
          <input 
            type="text" 
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" 
            placeholder="Enter schema name"
            defaultValue="m&a_due_diligence_schema"
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-700 mb-1">Schema Description</label>
          <textarea 
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" 
            placeholder="Enter schema description"
            rows={3}
            defaultValue="Schema for M&A due diligence document extraction"
          ></textarea>
        </div>
      </div>
    </div>
  );
};

const FieldDefinitions = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-700">Field Definitions</h3>
        <button className="text-royalBlue text-sm flex items-center gap-1">
          + Add Field
        </button>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md">
        <div className="border border-gray-200 rounded-md divide-y divide-gray-200">
          <div className="p-3 flex items-center justify-between bg-white">
            <div>
              <span className="font-medium text-sm">document_id</span>
              <span className="ml-2 text-xs text-gray-500">string</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">Required</span>
              <Sliders className="w-4 h-4 text-gray-400 cursor-pointer" />
            </div>
          </div>
          
          <div className="p-3 flex items-center justify-between bg-white">
            <div>
              <span className="font-medium text-sm">document_metadata</span>
              <span className="ml-2 text-xs text-gray-500">object</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">Required</span>
              <Sliders className="w-4 h-4 text-gray-400 cursor-pointer" />
            </div>
          </div>
          
          <div className="p-3 flex items-center justify-between bg-white">
            <div>
              <span className="font-medium text-sm">financial_data</span>
              <span className="ml-2 text-xs text-gray-500">object</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">Optional</span>
              <Sliders className="w-4 h-4 text-gray-400 cursor-pointer" />
            </div>
          </div>
        </div>
        
        <div className="mt-3 text-center">
          <button className="text-royalBlue text-sm hover:underline">
            Show All Fields (12 more)
          </button>
        </div>
      </div>
    </div>
  );
};

const ManualWorkspace = () => {
  return (
    <div className="space-y-4">
      <SchemaStructure />
      <FieldDefinitions />
    </div>
  );
};

const SchemaWorkspace = ({ generationMode }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <LayoutTemplate className="w-5 h-5 text-royalBlue mr-2" />
          <h2 className="text-lg font-semibold text-gray-800">
            {generationMode === 'ai' ? 'AI-Assisted Schema Definition' : 'Manual Schema Definition'}
          </h2>
        </div>
        
      </div>
      
      <div className="p-4">
        {/* Render the appropriate workspace based on the generation mode */}
        {generationMode === 'ai' ? <AIWorkspace /> : <ManualWorkspace />}
      </div>
    </div>
  );
};

export default SchemaWorkspace;
