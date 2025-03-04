import React from 'react';
import { Upload } from 'lucide-react';

const TemplateDetails = ({ 
  programGroup,
  agreementType,
  programClass,
  selectedForm,
  templateFoundation,
  formMetadata,
}) => {
  const isCustomTemplate = templateFoundation === 'custom';

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-gray-500">Program Group</p>
        <p className="font-medium">{capitalizeFirstLetter(programGroup)}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Agreement Type</p>
        <p className="font-medium">{capitalizeFirstLetter(agreementType)}</p>
      </div>
      <div>
        <p className="text-sm text-gray-500">Program Class</p>
        <p className="font-medium">{getProgramClassDisplay(programClass)}</p>
      </div>
      
      {!isCustomTemplate && formMetadata && (
        <>
          <div>
            <p className="text-sm text-gray-500">Template Name</p>
            <p className="font-medium">{formMetadata.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Template Type</p>
            <p className="font-medium">{formMetadata.sourceFileType || 'Word Document (.docx)'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Modified</p>
            <p className="font-medium">{formMetadata.lastModified}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Description</p>
            <p className="font-medium">{formatDescription(formMetadata.description)}</p>
          </div>
        </>
      )}
      
      {isCustomTemplate && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-medium mb-3">Upload Custom Template</h4>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="mx-auto h-10 w-10 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">Drag and drop your template file here, or click to browse</p>
            <button className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              Browse Files
            </button>
            <p className="mt-2 text-xs text-gray-400">Supported formats: .docx, .doc, .pdf, .rtf</p>
          </div>
        </div>
      )}
    </div>
  );
};

const capitalizeFirstLetter = (str) => {
  if (!str) return '';
  return str.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const getProgramClassDisplay = (classCode) => {
  const classMap = {
    'eng_us': 'Engineering US',
    'eng_india': 'Engineering India',
  };
  return classMap[classCode] || capitalizeFirstLetter(classCode);
};

const formatDescription = (desc) => {
  if (!desc) return '';
  const sentences = desc.split('. ');
  return sentences
    .map(sentence => capitalizeFirstLetter(sentence))
    .join('. ');
};

export default TemplateDetails;
