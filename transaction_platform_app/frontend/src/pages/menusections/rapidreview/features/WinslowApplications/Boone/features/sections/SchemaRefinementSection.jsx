import React, { useState } from 'react';
import { useConfig } from '../../../../../../../../context/ConfigContext';
import { 
    Settings, Shield, Database,  Globe, Building2, Server, Download,
    FileText, AlertCircle, Cloud, Clock, Package, Link, Users,
    Briefcase, Scale, Building, Rocket, Gavel, MessageSquare,
    Key, Warehouse, GitBranch, Book, X, UploadCloud,
    Code, TabletSmartphone, Zap, HardDrive, Braces, PenTool,
    LayoutTemplate, Workflow, Filter, ChevronsRight, Boxes, FolderGit2,
    HelpCircle, ArrowRight, CheckCircle, Edit
  } from 'lucide-react';
  import SchemaFieldTable from './SchemaFieldTable';

  import SchemaVisualization from './SchemaVisualizationPanel';


  // SchemaRefinementSection.jsx
  const SchemaRefinementSection = ({
    editedSchema,
    activeView,
    setActiveView,
    handleSchemaUpdate,
    onBack,
    onNext
  }) => (
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
          onClick={onBack}
          className="px-4 py-2 rounded-lg border border-gray-300 
            text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Back to Analysis
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2 rounded-lg bg-royalBlue text-white 
            hover:bg-royalBlue/90 transition-colors flex items-center gap-2"
        >
          <ArrowRight className="w-5 h-5" />
          Generate Export
        </button>
      </div>
    </div>
  );

  export default SchemaRefinementSection;
