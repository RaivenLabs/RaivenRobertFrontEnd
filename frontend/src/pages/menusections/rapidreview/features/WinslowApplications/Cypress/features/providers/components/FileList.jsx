import React from 'react';
import { useSupplier } from '../SupplierContext';

const FileList = ({ files, documentType }) => {
  const { updateFormData } = useSupplier();

  // Format file size to be human-readable
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Handle file removal
  const handleRemoveFile = (index) => {
    updateFormData('documents', prev => {
      // Create a copy of the current files array
      const updatedFiles = [...prev[documentType]];
      // Remove the file at the specified index
      updatedFiles.splice(index, 1);
      
      return {
        ...prev,
        [documentType]: updatedFiles
      };
    });
  };
  
  // If no files or empty array, don't render anything
  if (!files || files.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-4">
      <h5 className="text-sm font-medium mb-2">Uploaded Files ({files.length})</h5>
      <ul className="space-y-2">
        {files.map((file, index) => (
          <li key={`${file.name}-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <div className="flex items-center">
              {/* File icon */}
              <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              
              {/* File info */}
              <div>
                <p className="text-sm font-medium truncate max-w-xs">{file.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
              </div>
            </div>
            
            {/* Remove button */}
            <button
              type="button"
              onClick={() => handleRemoveFile(index)}
              className="p-1 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100"
              aria-label="Remove file"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
