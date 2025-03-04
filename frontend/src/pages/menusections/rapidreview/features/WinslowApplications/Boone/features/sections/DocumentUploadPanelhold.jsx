import React, { useState, useRef } from 'react';
import { 
  FileText, Upload, X, File, CheckCircle, AlertCircle, 
  Plus, UploadCloud, Database, ArrowRight
} from 'lucide-react';

const DocumentUploadPanel = ({ projectInfo, onDocumentsUploaded }) => {
  const [documents, setDocuments] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  // Required document types based on project type
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

  // Handle file selection
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    addFiles(files);
  };

  // Add files to the document list
  const addFiles = (files) => {
    const newDocuments = [...documents];
    
    files.forEach(file => {
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
        
        newDocuments.push({
          id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file,
          name: file.name,
          size: file.size,
          type: documentType,
          status: 'ready'
        });
      }
    });
    
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
    
    // Notify parent component
    if (onDocumentsUploaded) {
      onDocumentsUploaded(documents);
    }
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

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-6">
        <UploadCloud className="w-6 h-6 text-royalBlue mr-3" />
        <h2 className="text-xl font-semibold">Upload Schema Source Documents</h2>
      </div>
      
      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          Please upload the following documents to help generate an optimal data schema
          for {projectInfo?.project?.name || 'your project'}.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {Object.entries(requiredDocumentTypes).map(([key, info]) => (
            <div key={key} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-start mb-2">
                <info.icon className="w-5 h-5 text-royalBlue mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium">
                    {info.label}
                    {info.required && <span className="text-red-500 ml-1">*</span>}
                  </h3>
                  <p className="text-sm text-gray-600">{info.description}</p>
                  <p className="text-xs text-gray-500 mt-1">Formats: {info.formats}</p>
                </div>
              </div>
              
              {documents.some(doc => doc.type === key) ? (
                <div className="mt-2 flex items-center text-sm text-green-600">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Uploaded
                </div>
              ) : info.required ? (
                <div className="mt-2 flex items-center text-sm text-orange-600">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Required
                </div>
              ) : (
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <Plus className="w-4 h-4 mr-1" />
                  Optional
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* File upload area */}
        <div 
          className={`border-2 border-dashed rounded-lg p-6 text-center ${
            dragging ? 'border-royalBlue bg-royalBlue/5' : 'border-gray-300'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            multiple
          />
          
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          
          <h3 className="text-lg font-medium mb-2">
            Drag and drop files here
          </h3>
          
          <p className="text-gray-500 mb-4">
            or
          </p>
          
          <button
            onClick={() => fileInputRef.current.click()}
            className="px-4 py-2 bg-royalBlue text-white rounded-lg hover:bg-royalBlue/90 transition-colors"
          >
            Browse Files
          </button>
          
          <p className="text-sm text-gray-500 mt-4">
            Upload PDF, Word, Excel, or JSON files
          </p>
        </div>
        
        {/* Error message */}
        {uploadError && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-3">
            <div className="flex items-center text-red-600">
              <AlertCircle className="w-5 h-5 mr-2" />
              {uploadError}
            </div>
          </div>
        )}
      </div>
      
      {/* Document list */}
      {documents.length > 0 && (
        <div className="mb-6">
          <h3 className="font-medium text-gray-800 mb-3">Uploaded Documents</h3>
          
          <div className="border rounded-lg divide-y">
            {documents.map((doc) => (
              <div key={doc.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <File className="w-5 h-5 text-gray-500 mr-3" />
                  
                  <div>
                    <div className="font-medium">{doc.name}</div>
                    <div className="text-sm text-gray-500">
                      {formatFileSize(doc.size)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  {/* Document type selector */}
                  <select
                    value={doc.type}
                    onChange={(e) => setDocumentType(doc.id, e.target.value)}
                    className="mr-4 border rounded-md p-1 text-sm"
                    disabled={doc.status === 'uploading' || doc.status === 'complete'}
                  >
                    <option value="unknown">Select document type...</option>
                    {Object.entries(requiredDocumentTypes).map(([key, info]) => (
                      <option key={key} value={key}>{info.label}</option>
                    ))}
                  </select>
                  
                  {/* Upload status */}
                  {doc.status === 'uploading' && (
                    <div className="flex items-center mr-4">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-royalBlue"
                          style={{ width: `${uploadProgress[doc.id] || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 ml-2">
                        {uploadProgress[doc.id] || 0}%
                      </span>
                    </div>
                  )}
                  
                  {doc.status === 'complete' && (
                    <CheckCircle className="w-5 h-5 text-green-500 mr-4" />
                  )}
                  
                  {doc.status === 'error' && (
                    <AlertCircle className="w-5 h-5 text-red-500 mr-4" />
                  )}
                  
                  {/* Remove button */}
                  {doc.status !== 'uploading' && doc.status !== 'complete' && (
                    <button
                      onClick={() => removeDocument(doc.id)}
                      className="p-1 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Action buttons */}
      <div className="flex justify-between items-center border-t pt-4">
        <div className="text-gray-600">
          {documents.length === 0 ? (
            "Upload documents to continue"
          ) : !checkRequiredDocuments() ? (
            "Please upload all required document types"
          ) : uploadComplete ? (
            "Documents uploaded successfully"
          ) : (
            "Documents ready for upload"
          )}
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={() => setDocuments([])}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={documents.length === 0 || uploadComplete}
          >
            Clear All
          </button>
          
          {uploadComplete ? (
            <button
              onClick={() => onDocumentsUploaded && onDocumentsUploaded(documents)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              Continue to Schema Generation
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={uploadDocuments}
              disabled={documents.length === 0 || !checkRequiredDocuments()}
              className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2
                ${documents.length > 0 && checkRequiredDocuments()
                  ? 'bg-royalBlue text-white hover:bg-royalBlue/90'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
            >
              Upload Documents
              <Upload className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadPanel;
