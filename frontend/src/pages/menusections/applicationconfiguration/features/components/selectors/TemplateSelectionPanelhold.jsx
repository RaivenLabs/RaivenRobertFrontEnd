// Step 1: Create the component file with proper imports

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  FileText, 
  Building2,
  Users,
  Cloud,
  Upload,
  ArrowRight,
  HelpCircle,
  Edit,
  CheckCircle,
  Database,
  LayoutGrid,
  List,
  AlertCircle,
  Loader2,
  FileCode,
  FilePlus,
  ArrowUpCircle,
  AlertTriangle
} from 'lucide-react';


const TemplateSelectionPanel = ({ 
    forms,
    selectedForm,
    setSelectedForm,
    conversionStates,
    isLoading,
    error
  }) => {
    const convertedTemplates = forms.filter(form => form.fileExists);
    const sourceTemplates = forms.filter(form => form.sourceFileExists && !form.fileExists);
    
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-8 space-y-2">
          <Loader2 className="w-6 h-6 animate-spin text-teal" />
          <span className="text-gray-600">Loading available templates...</span>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-8 space-y-2 text-red-600">
          <AlertCircle className="w-6 h-6" />
          <span>{error}</span>
          <button className="text-sm text-teal hover:underline">Try Again</button>
        </div>
      );
    }
  
    if (forms.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No templates available for this selection
        </div>
      );
    }
  
    return (
      <div className="space-y-8">
        {/* Current Templates Panel */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-medium">Current Templates</h3>
            {convertedTemplates.length > 0 && (
              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                {convertedTemplates.length} Available
              </span>
            )}
          </div>
          
          {convertedTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
              {convertedTemplates.map((form) => (
                <button
                  key={form.id}
                  onClick={() => setSelectedForm(form.id)}
                  className={`p-4 rounded-lg border transition-all h-full relative bg-white
                    ${selectedForm === form.id
                      ? 'border-teal bg-teal/5 shadow-md'
                      : 'border-gray-200 hover:border-teal/50 hover:shadow-sm'
                    }`}
                >
                  <div className="absolute top-3 right-3">
                    <span className={conversionStates['CONVERTED']?.displayClass + " text-xs px-2 py-1 rounded-full"}>
                      Foundational
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-800 pr-20">{form.name}</h3>
                  <p className="text-sm text-gray-600 mt-2">{form.description}</p>
                  <div className="mt-4 text-xs text-gray-400 space-y-1">
                    <div>Template Order: {form.displayOrder}</div>
                    {form.lastConverted && (
                      <div>Last Updated: {new Date(form.lastConverted).toLocaleDateString()}</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
              No current templates available
            </div>
          )}
        </div>
  
        {/* Templates Ready for Conversion Panel */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <ArrowUpCircle className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-medium">Templates Ready for Conversion</h3>
            {sourceTemplates.length > 0 && (
              <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800">
                {sourceTemplates.length} Available
              </span>
            )}
          </div>
          
          {sourceTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-200/70 p-4 rounded-lg border-2 border-teal/30">
              {sourceTemplates.map((form) => (
                <button
                  key={form.id}
                  onClick={() => setSelectedForm(form.id)}
                  className={`p-4 rounded-lg border transition-all h-full relative bg-white
                    ${selectedForm === form.id
                      ? 'border-teal bg-teal/5 shadow-md'
                      : 'border-gray-200 hover:border-teal/50 hover:shadow-sm'
                    }`}
                >
                  <div className="absolute top-3 right-3">
                    <span className={conversionStates['SOURCE']?.displayClass + " text-xs px-2 py-1 rounded-full"}>
                      Source
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-800 pr-20">{form.name}</h3>
                  <p className="text-sm text-gray-600 mt-2">{form.description}</p>
                  <div className="mt-4 text-xs text-gray-400">
                    <div>Template Order: {form.displayOrder}</div>
                    {form.parentReferenceId && (
                      <div className="mt-1">Parent Reference: {form.parentReferenceId}</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500 bg-gray-200/70 rounded-lg border-2 border-teal/30">
              No templates ready for conversion
            </div>
          )}
        </div>
      </div>
    );
  };



export default TemplateSelectionPanel;


