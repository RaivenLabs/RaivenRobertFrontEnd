import React, { useState } from 'react';
import { useConfig } from '../../../../../../../../context/ConfigContext';
import { 
    Settings, Shield, Database,  Globe, Building2, Server, Download,
    FileText, AlertCircle, Cloud, Clock, Package, Link, Users,
    Briefcase, Scale, Building, Rocket, Gavel, MessageSquare,
    Key, Warehouse, GitBranch, Book, X, UploadCloud,
    Code, TabletSmartphone, Zap, HardDrive, Braces, PenTool,
    LayoutTemplate, Workflow, Filter, ChevronsRight, Boxes, FolderGit2,
    HelpCircle, ArrowRight, CheckCircle, Plus
  } from 'lucide-react';



  
  // ContextSection.jsx
  const SchemaContextSection = ({ analysisContext, setAnalysisContext }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
        <Database className="w-5 h-5 text-royalBlue" />
        Schema Generation Context
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Document Type Selector */}
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
        
        {/* Extraction Goals */}
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
        
        {/* Additional Notes */}
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
  );
  
 
  
 export default SchemaContextSection;
