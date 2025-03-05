// src/components/platform/BooneConfiguration/sections/RAGConfigPanel.jsx
import React, { useState } from 'react';
import { useConfig } from '../../../../../../../../context/ConfigContext';
import { Database, UploadCloud, GitBranch, Settings, FileText, Server } from 'lucide-react';

const RAGConfigPanel = () => {
  const { customerId, hasCustomerAccess } = useConfig();
  const [vectorDatabase, setVectorDatabase] = useState('pinecone');

  // Access control
  const canAccessControls = true; // Simplified for now

  // Vector DB options
  const vectorDatabases = [
    { id: 'pinecone', name: 'Pinecone' },
    { id: 'faiss', name: 'FAISS (Local)' },
    { id: 'milvus', name: 'Milvus' }
  ];

  // RAG Controls
  const ragControls = [
    { label: "Upload Domain Documents", icon: UploadCloud },
    { label: "Configure Vector Settings", icon: Settings },
    { label: "Manage Document Collections", icon: FileText },
    { label: "Test RAG Retrieval", icon: GitBranch },
    { label: "Integration Settings", icon: Server }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center mb-4">
        <Database className="w-6 h-6 text-royalBlue mr-3" />
        <h3 className="text-xl font-semibold">RAG Configuration</h3>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Vector Database
        </label>
        <div className="space-y-2">
          {vectorDatabases.map(db => (
            <label 
              key={db.id} 
              className={`flex items-center p-3 rounded-md cursor-pointer ${
                !canAccessControls 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : vectorDatabase === db.id
                  ? 'bg-blue-50 border border-royalBlue'
                  : 'bg-lightGray hover:bg-gray-200'
              }`}
            >
              <input
                type="radio"
                name="vectorDatabase"
                value={db.id}
                checked={vectorDatabase === db.id}
                onChange={() => setVectorDatabase(db.id)}
                disabled={!canAccessControls}
                className="mr-3"
              />
              {db.name}
            </label>
          ))}
        </div>
      </div>
      
      <div className="space-y-3">
        {ragControls.map((control, index) => (
          <button
            key={index}
            disabled={!canAccessControls}
            className={`w-full p-3 ${
              canAccessControls 
                ? 'bg-lightGray hover:bg-gray-200' 
                : 'bg-gray-100 cursor-not-allowed'
            } rounded-md text-left flex items-center justify-between group transition-colors duration-200`}
          >
            <span className={!canAccessControls ? 'text-gray-400' : ''}>
              {control.label}
            </span>
            <control.icon className={`w-4 h-4 ${
              canAccessControls 
                ? 'text-gray-500 group-hover:text-royalBlue' 
                : 'text-gray-400'
            }`} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default RAGConfigPanel;
