// src/components/platform/BooneConfiguration/DocumentUploadPanel.jsx
import React from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  X,
  Database,
  LayoutTemplate,
  Play,
  Plus
} from 'lucide-react';

const RequiredDocumentTypes = ({ requiredDocumentTypes, documents }) => {
  return (
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
  );
};

const DocumentDropZone = ({ dragging, handleDragEnter, handleDragLeave, handleDragOver, handleDrop, fileInputRef, handleFileSelect }) => {
  return (
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
  );
};

const DocumentList = ({ 
  documents, 
  uploadProgress, 
  setDocumentType, 
  removeDocument, 
  requiredDocumentTypes,
  formatFileSize
}) => {
  if (documents.length === 0) {
    return (
      <div className="border rounded-lg p-6 text-center bg-gray-50">
        <p className="text-gray-500">No documents uploaded yet</p>
      </div>
    );
  }

  return (
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
  );
};

const DocumentUploadPanel = ({
  documents,
  setDocuments,
  dragging,
  setDragging,
  uploadProgress,
  setUploadProgress,
  uploadComplete,
  setUploadComplete,
  uploadError,
  setUploadError,
  fileInputRef,
  requiredDocumentTypes,
  handleFileSelect,
  handleDragEnter,
  handleDragLeave,
  handleDragOver,
  handleDrop,
  removeDocument,
  setDocumentType,
  uploadDocuments,
  formatFileSize,
  checkRequiredDocuments,
  onLaunchSchemaAnalytics // Added new prop for handling schema analytics
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center">
        <Upload className="w-5 h-5 text-royalBlue mr-2" />
        <h2 className="text-lg font-semibold text-gray-800">
          Document Processing
        </h2>
      </div>
      
      <div className="p-4">
        {/* Required document types information */}
        <RequiredDocumentTypes 
          requiredDocumentTypes={requiredDocumentTypes} 
          documents={documents} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left side - Drag & Drop Area */}
          <DocumentDropZone 
            dragging={dragging}
            handleDragEnter={handleDragEnter}
            handleDragLeave={handleDragLeave}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            fileInputRef={fileInputRef}
            handleFileSelect={handleFileSelect}
          />
          
          {/* Right side - Document List & Upload Controls */}
          <div className="space-y-4">
            <DocumentList 
              documents={documents}
              uploadProgress={uploadProgress}
              setDocumentType={setDocumentType}
              removeDocument={removeDocument}
              requiredDocumentTypes={requiredDocumentTypes}
              formatFileSize={formatFileSize}
            />
            
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
                onClick={onLaunchSchemaAnalytics} // Modified to use the callback
                className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 transition-colors"
              >
                <LayoutTemplate className="w-4 h-4" />
                Launch Schema Analytics
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadPanel;
