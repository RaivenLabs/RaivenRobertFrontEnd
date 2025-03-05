import React, { useState } from 'react';
import { useConfig } from '../../../../../../../../context/ConfigContext';
import { 
    Settings, Shield, Database,  Globe, Building2, Server, Download,
    FileText, AlertCircle, Cloud, Clock, Package, Link, Users,
    Briefcase, Scale, Building, Rocket, Gavel, MessageSquare,
    Key, Warehouse, GitBranch, Book, X, UploadCloud,
    Code, TabletSmartphone, Zap, HardDrive, Braces, PenTool,
    LayoutTemplate, Workflow, Filter, ChevronsRight, Boxes, FolderGit2,
    HelpCircle, ArrowRight, CheckCircle, Edit, AlertTriangle
  } from 'lucide-react';




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

  export default SchemaVisualization;
