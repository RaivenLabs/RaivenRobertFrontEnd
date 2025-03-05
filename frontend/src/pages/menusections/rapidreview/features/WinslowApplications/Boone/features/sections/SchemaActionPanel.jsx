import React, { useState } from 'react';
import { useConfig } from '../../../../../../../../context/ConfigContext';
import { 
    Settings, Shield, Database,  Globe, Building2, Server, Download,
    FileText, AlertCircle, Cloud, Clock, Package, Link, Users,
    Briefcase, Scale, Building, Rocket, Gavel, MessageSquare,
    Key, Warehouse, GitBranch, Book, X, UploadCloud,
    Code, TabletSmartphone, Zap, HardDrive, Braces, PenTool,
    LayoutTemplate, Workflow, Filter, ChevronsRight, Boxes, FolderGit2,
    HelpCircle, ArrowRight, CheckCircle
  } from 'lucide-react';


 // ActionPanel.jsx
  const ActionPanel = ({ 
    currentStep, 
    isAnalyzing, 
    exportFormat, 
    exportCode, 
    handlePrimaryAction 
  }) => (
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
              onClick={handlePrimaryAction}
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
  );
  export default ActionPanel;
