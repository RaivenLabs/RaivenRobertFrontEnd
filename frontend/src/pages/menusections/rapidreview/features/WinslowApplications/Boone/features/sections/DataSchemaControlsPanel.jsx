// src/components/platform/BooneConfiguration/DataSchemaControls.jsx
import React, { useRef, useState } from 'react';
import EngineControls from './EngineControls';
import SchemaWorkspace from './SchemaWorkspace';
import DocumentUploadPanel from './DocumentUploadPanel';
import { 
  FileText,
  Database,
  CheckCircle,
} from 'lucide-react';

const DataSchemaControls = ({ projectInfo, onSchemaAnalyticsComplete }) => {
  // Engine control state
  const [generationMode, setGenerationMode] = useState('ai'); // 'ai' or 'manual'
  const [extractionPrecision, setExtractionPrecision] = useState('balanced'); // 'conservative', 'balanced', 'aggressive'
  const [detectionStrategy, setDetectionStrategy] = useState('auto'); // 'auto', 'template', 'custom'
  
  // Document upload state
  const [documents, setDocuments] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);
  
  // Analytics state
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Required document types
  const requiredDocumentTypes = {
    sample_document: {
      label: "Sample Document",
      description: "Upload a representative document that contains the type of data to be extracted",
      formats: ".pdf, .docx",
      required: true,
      icon: FileText
    },
    data_structure: {
      label: "Existing Data Structure",
      description: "Upload an example of the current data format (CSV, Excel, JSON)",
      formats: ".csv, .xlsx, .json",
      required: false,
      icon: Database
    },
    diligence_checklist: {
      label: "Due Diligence Checklist",
      description: "Upload a checklist of items to be extracted (if available)",
      formats: ".pdf, .docx, .xlsx",
      required: false,
      icon: CheckCircle
    }
  };

  // Handle file selection via button click
  const handleFileSelect = (e) => {
    console.log('File input change event triggered');
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      console.log('Files selected:', files);
      addFiles(files);
    }
  };

  // Add files to the document list
  const addFiles = (files) => {
    console.log('Adding files:', files);
    if (!files || files.length === 0) {
      console.log('No files to add');
      return;
    }
    
    const newDocuments = [...documents];
    
    files.forEach(file => {
      console.log('Processing file:', file.name);
      // Check if file already exists in list
      const exists = documents.some(doc => 
        doc.name === file.name && doc.size === file.size
      );
      
      if (!exists) {
        // Determine document type based on file extension
        let documentType = "unknown";
        const extension = file.name.split('.').pop().toLowerCase();
        
        if (['pdf', 'docx', 'doc'].includes(extension)) {
          documentType = "sample_document";
        } else if (['csv', 'xlsx', 'xls', 'json'].includes(extension)) {
          documentType = "data_structure";
        }
        
        console.log(`Adding ${file.name} as type ${documentType}`);
        newDocuments.push({
          id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file,
          name: file.name,
          size: file.size,
          type: documentType,
          status: 'ready'
        });
      } else {
        console.log(`File ${file.name} already exists in document list`);
      }
    });
    
    console.log('Updated documents list:', newDocuments);
    setDocuments(newDocuments);
  };

  // Handle drag events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    console.log('Files dropped:', files);  // Debug log
    addFiles(files);
  };

  // Remove a document from the list
  const removeDocument = (docId) => {
    setDocuments(documents.filter(doc => doc.id !== docId));
  };

  // Set document type
  const setDocumentType = (docId, type) => {
    setDocuments(documents.map(doc => 
      doc.id === docId ? { ...doc, type } : doc
    ));
  };

  // Upload documents
  const uploadDocuments = async () => {
    // Check if required document types are present
    const hasRequiredDocuments = Object.entries(requiredDocumentTypes)
      .filter(([_, info]) => info.required)
      .every(([type]) => documents.some(doc => doc.type === type));
    
    if (!hasRequiredDocuments) {
      setUploadError("Please upload all required document types");
      return;
    }
    
    // Reset states
    setUploadError(null);
    setUploadProgress({});
    
    // Set all documents to uploading
    setDocuments(documents.map(doc => ({
      ...doc,
      status: 'uploading'
    })));
    
    // Simulate upload for each document
    for (const doc of documents) {
      try {
        // Simulate progress updates
        for (let progress = 0; progress <= 100; progress += 10) {
          setUploadProgress(prev => ({
            ...prev,
            [doc.id]: progress
          }));
          
          // Add some delay to simulate network activity
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        // Mark upload as complete
        setDocuments(prev => prev.map(d => 
          d.id === doc.id ? { ...d, status: 'complete' } : d
        ));
      } catch (error) {
        console.error("Upload error:", error);
        
        // Mark upload as failed
        setDocuments(prev => prev.map(d => 
          d.id === doc.id ? { ...d, status: 'error' } : d
        ));
        
        setUploadError("An error occurred during upload. Please try again.");
      }
    }
    
    // All uploads complete
    setUploadComplete(true);
  };

  // Helper to format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // Check if all required document types are uploaded
  const checkRequiredDocuments = () => {
    return Object.entries(requiredDocumentTypes)
      .filter(([_, info]) => info.required)
      .every(([type]) => documents.some(doc => doc.type === type));
  };

  // Handle launching schema analytics
  const handleLaunchSchemaAnalytics = async () => {
    try {
      setIsAnalyzing(true);
      
      // Prepare data for analysis
      const formData = new FormData();
      
      // Add context information
      const contextData = {
        documentType: projectInfo?.type || 'custom',
        extractionGoals: ['Extract all fields', 'Create optimal schema'],
        briefingContext: {
          project_id: projectInfo?.id,
          context: {
            project: projectInfo,
            business_context: projectInfo?.businessContext || ''
          },
          scope: projectInfo?.scope || ''
        }
      };
      
      formData.append('context', JSON.stringify(contextData));
      
      // Add files to FormData
      documents.forEach((doc, index) => {
        formData.append(`file_${index}`, doc.file);
      });
      
      console.log('Submitting for analysis...');
      
      // Call the API endpoint
      const response = await fetch('/api/suggest-schema-enhancements', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Error analyzing documents: ${response.statusText}`);
      }
      
      const analysisResults = await response.json();
      console.log('Analysis results:', analysisResults);
      
      // Pass the results to the parent component
      if (onSchemaAnalyticsComplete) {
        onSchemaAnalyticsComplete(analysisResults);
      }
      
      setIsAnalyzing(false);
    } catch (error) {
      console.error('Schema analysis error:', error);
      setUploadError(`Analysis failed: ${error.message}`);
      setIsAnalyzing(false);
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Engine Controls */}
      <EngineControls 
        generationMode={generationMode}
        setGenerationMode={setGenerationMode}
        extractionPrecision={extractionPrecision}
        setExtractionPrecision={setExtractionPrecision}
        detectionStrategy={detectionStrategy}
        setDetectionStrategy={setDetectionStrategy}
      />
      
      {/* Schema Workspace */}
      <SchemaWorkspace 
        generationMode={generationMode}
      />
      
      {/* Document Upload Panel */}
      <DocumentUploadPanel 
        documents={documents}
        setDocuments={setDocuments}
        dragging={dragging}
        setDragging={setDragging}
        uploadProgress={uploadProgress}
        setUploadProgress={setUploadProgress}
        uploadComplete={uploadComplete}
        setUploadComplete={setUploadComplete}
        uploadError={uploadError}
        setUploadError={setUploadError}
        fileInputRef={fileInputRef}
        requiredDocumentTypes={requiredDocumentTypes}
        handleFileSelect={handleFileSelect}
        handleDragEnter={handleDragEnter}
        handleDragLeave={handleDragLeave}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        removeDocument={removeDocument}
        setDocumentType={setDocumentType}
        uploadDocuments={uploadDocuments}
        formatFileSize={formatFileSize}
        checkRequiredDocuments={checkRequiredDocuments}
        onLaunchSchemaAnalytics={handleLaunchSchemaAnalytics}
      />
      
      {/* Loading overlay for analysis */}
      {isAnalyzing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
            <div className="flex items-center justify-center mb-4">
              <div className="w-10 h-10 border-4 border-royalBlue border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-lg font-semibold text-center">Analyzing Documents</h3>
            <p className="text-gray-600 text-center mt-2">
              Our AI is analyzing your documents to create an optimal schema. This might take a minute...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataSchemaControls;
