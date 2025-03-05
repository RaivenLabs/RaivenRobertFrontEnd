import React, { useState } from 'react';
import { useConfig } from '../../../../../../../../context/ConfigContext';
import { 
    Settings, Shield, Database,  Globe, Building2, Server, Download,
    FileText, AlertCircle, Cloud, Clock, Package, Link, Users,
    Briefcase, Scale, Building, Rocket, Gavel, MessageSquare,
    Key, Warehouse, GitBranch, Book, X, UploadCloud,
    Code, TabletSmartphone, Zap, HardDrive, Braces, PenTool,
    LayoutTemplate, Workflow, Filter, ChevronsRight, Boxes, FolderGit2,
    HelpCircle, ArrowRight, CheckCircle, PlayCircle, AlertTriangle
  } from 'lucide-react';



  // AnalysisSection.jsx
  const SchemaAnalysisSection = ({ 
    uploadedFiles, 
    isAnalyzing, 
    analysisErrors, 
    handleAnalyzeDocuments 
  }) => (
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
  );
  export default SchemaAnalysisSection;
