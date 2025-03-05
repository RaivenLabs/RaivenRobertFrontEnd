// src/features/transaction-loader/components/Worksheet/WorksheetHeader.jsx
import React from 'react';
import { FileSpreadsheet } from 'lucide-react';

const WorksheetHeader = ({ projectName, onImportClick }) => (
  <div className="flex justify-between items-center mb-6">
    <div>
      <h2 className="text-xl font-semibold text-royalBlue">
        Regional Block Analysis Worksheet
      </h2>
      {projectName && (
        <p className="text-gray-600 mt-1">Project: {projectName}</p>
      )}
    </div>
    <button
      onClick={onImportClick}
      className="px-6 py-3 bg-royalBlue text-ivory rounded-lg
                hover:bg-royalBlue-hover transition-colors
                flex items-center space-x-2"
    >
      <FileSpreadsheet className="w-5 h-5" />
      <span>Import Spreadsheet</span>
    </button>
  </div>
);

export default WorksheetHeader;
