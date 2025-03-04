// src/components/platform/BooneConfiguration/DataSchemaControls.jsx
import React, { useRef, useState } from 'react';
import { 
  LayoutTemplate, 
  Bot, 
  UserCircle, 
  Sliders, 
  Save,
  Upload,
  Play,
  FileText,
  AlertCircle,
  CheckCircle,
  X,
  Database,
  Plus,
  Check,
  Settings
} from 'lucide-react';

const DataSchemaControls = ({ projectInfo }) => {
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
  
  return (
    <div className="space-y-4">
      {/* Engine Controls Row */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center">
          <Settings className="w-5 h-5 text-royalBlue mr-2" />
          <h2 className="text-lg font-semibold text-gray-800">
            Engine Controls
          </h2>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left column: Generation Mode with note underneath */}
            <div className="border-r border-gray-200 pr-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Generation Mode</h3>
              <div className="flex gap-2 mb-3">
                <button 
                  className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-md text-sm ${
                    generationMode === 'ai' 
                      ? 'bg-royalBlue text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setGenerationMode('ai')}
                >
                  <Bot className="w-4 h-4" />
                  AI Assisted
                </button>
                
                <button 
                  className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-md text-sm ${
                    generationMode === 'manual' 
                      ? 'bg-royalBlue text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setGenerationMode('manual')}
                >
                  <UserCircle className="w-4 h-4" />
                  Manual
                </button>
              </div>
              
              {/* Note underneath mode selection */}
              <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded-md border border-blue-100">
                <div className="flex items-start">
                  <AlertCircle className="w-3 h-3 text-blue-500 mr-1 flex-shrink-0 mt-0.5" />
                  <p>{generationMode === 'ai' 
                    ? 'AI analyzes documents to identify fields automatically.' 
                    : 'Manually define schema structure and fields.'}</p>
                </div>
              </div>
            </div>
            
            {/* Middle column: Extraction Precision */}
            <div className="border-r border-gray-200 px-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Extraction Precision</h3>
              <div className="flex gap-2">
                <button 
                  className={`flex-1 py-2 rounded-md text-sm ${
                    extractionPrecision === 'conservative'
                      ? 'bg-royalBlue text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setExtractionPrecision('conservative')}
                >
                  Conservative
                </button>
                <button 
                  className={`flex-1 py-2 rounded-md text-sm ${
                    extractionPrecision === 'balanced'
                      ? 'bg-royalBlue text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setExtractionPrecision('balanced')}
                >
                  Balanced
                </button>
                <button 
                  className={`flex-1 py-2 rounded-md text-sm ${
                    extractionPrecision === 'aggressive'
                      ? 'bg-royalBlue text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setExtractionPrecision('aggressive')}
                >
                  Aggressive
                </button>
              </div>
            </div>
            
            {/* Right column: Additional Settings */}
            <div className="pl-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Additional Settings</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Detection Strategy:</span>
                  <select 
                    className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm w-44"
                    value={detectionStrategy}
                    onChange={(e) => setDetectionStrategy(e.target.value)}
                  >
                    <option value="auto">Auto-detect</option>
                    <option value="template">Template-based</option>
                    <option value="custom">Custom rules</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Use Document Context:</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-royalBlue peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Include Nested Fields:</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-royalBlue peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Workspace Container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <LayoutTemplate className="w-5 h-5 text-royalBlue mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">
              {generationMode === 'ai' ? 'AI-Assisted Schema Definition' : 'Manual Schema Definition'}
            </h2>
          </div>
          <button className="flex items-center gap-1 px-3 py-1.5 bg-royalBlue text-white rounded-md text-sm hover:bg-blue-700 transition-colors">
            <Save className="w-4 h-4" />
            Save Schema Definition
          </button>
        </div>
        
        <div className="p-4">
          {/* AI Workspace */}
          {generationMode === 'ai' && (
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
          )}
          
          {/* Manual Workspace */}
          {generationMode === 'manual' && (
            <div className="space-y-4">
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
            </div>
          )}
        </div>
      </div>
      
      {/* Document Upload Container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center">
          <Upload className="w-5 h-5 text-royalBlue mr-2" />
          <h2 className="text-lg font-semibold text-gray-800">
            Document Processing
          </h2>
        </div>
        
        <div className="p-4">
          {/* Required document types information */}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left side - Drag & Drop Area */}
            <div 
              className={`border-2 border-dashed rounded-lg p-6 text-center ${
                dragging ? 'border-royalBlue bg-royalBlue/5' : 'border-gray-300 hover:border-royalBlue hover:bg-royalBlue/5'
              } transition-colors`}
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
            
            {/* Right side - Document List & Upload Controls */}
            <div className="space-y-4">
              {documents.length > 0 ? (
                <div className="border rounded-lg divide-y">
                  {documents.map(doc => (
                    <div key={doc.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-gray-500 mr-3" />
                        
                        <div>
                          <div className="font-medium">{doc.name}</div>
                          <div className="text-sm text-gray-500">{formatFileSize(doc.size)}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        {doc.status === 'uploading' ? (
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
                        ) : doc.status === 'complete' ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mr-4" />
                        ) : (
                          <>
                            <select
                              value={doc.type}
                              onChange={(e) => setDocumentType(doc.id, e.target.value)}
                              className="mr-4 border rounded-md p-1 text-sm"
                            >
                              <option value="unknown">Select document type...</option>
                              {Object.entries(requiredDocumentTypes).map(([key, info]) => (
                                <option key={key} value={key}>{info.label}</option>
                              ))}
                            </select>
                            
                            <button
                              onClick={() => removeDocument(doc.id)}
                              className="p-1 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border rounded-lg p-6 text-center bg-gray-50">
                  <p className="text-gray-500">No documents uploaded yet</p>
                </div>
              )}
              
              {/* Upload status message */}
              {uploadComplete && (
                <div className="flex items-center text-sm text-green-600 bg-green-50 p-3 rounded-md border border-green-100">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  <p>Documents uploaded successfully</p>
                </div>
              )}
              
              {uploadError && (
                <div className="flex items-center text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-100">
                  <AlertCircle className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                  <p>{uploadError}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Bottom Action Buttons */}
          <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-3">
              {documents.length > 0 && !uploadComplete && (
                <button 
                  onClick={() => setDocuments([])}
                  className="flex items-center gap-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear All
                </button>
              )}
              
              {documents.length > 0 && !uploadComplete ? (
                <button 
                  onClick={uploadDocuments}
                  className="flex items-center gap-1 px-4 py-2 bg-royalBlue text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
                  disabled={!checkRequiredDocuments()}
                >
                  <Upload className="w-4 h-4" />
                  Upload Documents
                </button>
              ) : (
                <button 
                  className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors"
                >
                  <LayoutTemplate className="w-4 h-4" />
                  Generate Schema
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSchemaControls;
