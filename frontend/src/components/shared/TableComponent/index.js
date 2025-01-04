// src/components/shared/TableComponent/index.jsx
import React, { useRef } from 'react';
import './TableComponent.css';
import { processImportData } from '../../../utils/sampleDataUtils';

const TableComponent = ({ 
  title,
  data,
  columns,
  importEnabled = false,
  onImport,
  onActionClick,
  importButtonText = "Import Data",
  projectImportEnabled = false,
  onProjectImport,
  setData  // Add this prop to update parent component's state
}) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const rawData = JSON.parse(e.target.result);
          const processedData = processImportData(rawData);
          setData(processedData);
        } catch (error) {
          console.error('Error parsing file:', error);
          // Add toast notification here if you want
        }
      };
      reader.readAsText(file);
    } catch (error) {
      console.error('Error reading file:', error);
      // Add toast notification here if you want
    }
  };

  const handleImportClick = async () => {
    try {
      const response = await fetch('/api/sampleagreementdata');
      if (!response.ok) {
        throw new Error('Failed to load agreement data');
      }
      const data = await response.json();
      // Access the agreements array from the response
      setData(data.agreements);  // This is the key change
    } catch (error) {
      console.error('Error importing sample data:', error);
    }
  };

  return (
    <div className="table-reporting">
      <div className="panel-title">
        {title}
      </div>
      
      <div className="panel-content">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th key={index}>{column.header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <td key={colIndex}>
                      {column.type === 'status' ? (
                        <span className={`status-indicator status-${row[column.key]?.toLowerCase()}`}>
                          {row[column.key]}
                        </span>
                      ) : column.type === 'action' ? (
                        <button 
                          className="action-button"
                          onClick={() => onActionClick(row)}
                        >
                          View
                        </button>
                      ) : (
                        row[column.key]
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {(importEnabled || projectImportEnabled) && (
        <div className="dashboard-actions">
          <input 
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileSelect}
            accept=".json,.csv"
          />
          
          {importEnabled && (
            <button 
              className="import-button" 
              onClick={handleImportClick}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              {importButtonText}
            </button>
          )}
          
          {projectImportEnabled && (
            <button 
              className="import-button" 
              onClick={() => fileInputRef.current?.click()}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Import Project Data
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TableComponent;
