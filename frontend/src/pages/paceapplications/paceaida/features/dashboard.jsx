// src/components/LitigationDashboard/index.jsx
import React, { useState, useEffect } from 'react';
import { FileText, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { fetchLitigationData, formatDate, getDiseaseCategories, getJurisdictions } from '../../../../utils/litigationUtils';
import './LitigationDashboard.css';

const LitigationDashboard = () => {
  // State Management
  const [litigationData, setLitigationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    disease: '',
    jurisdiction: ''
  });
  const [availableFilters, setAvailableFilters] = useState({
    diseases: [],
    jurisdictions: []
  });
  
  // Table Column Definitions
  const columns = [
    { header: 'Log Number', key: 'log_number' },
    { header: 'Case Caption', key: 'case_caption' },
    { header: 'Jurisdiction', key: 'jurisdiction_display' },
    { header: 'Disease', key: 'disease_name' },
    { header: 'Filed', key: 'file_date' },
    { header: 'Due Date', key: 'answer_due_date' },
    { header: 'Company', key: 'company_served' },
    { header: 'Status', key: 'status', type: 'status' },
    { header: 'Actions', key: 'actions', type: 'action' }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simplified fetch call - no endpoint needed
        const processedCases = await fetchLitigationData(filters);
        setLitigationData(processedCases);
        
        // Update available filters
        setAvailableFilters({
          diseases: getDiseaseCategories(processedCases),
          jurisdictions: getJurisdictions(processedCases)
        });
      } catch (err) {
        setError(err.message);
        console.error('Error loading litigation data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Get status indicator styles
  const getStatusStyles = (status) => {
    const statusStyles = {
      'ACTIVE': 'bg-green-100 text-green-800',
      'URGENT': 'bg-yellow-100 text-yellow-800',
      'OVERDUE': 'bg-red-100 text-red-800',
      'PENDING': 'bg-blue-100 text-blue-800'
    };
    return statusStyles[status] || 'bg-gray-100 text-gray-800';
  };

  // Handle view details
  const handleViewDetails = (row) => {
    console.log('Viewing details for case:', row);
    // Implement detail view functionality
  };

  // Loading State
  if (loading) {
    return (
      <div className="table-reporting">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading litigation data...</div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="table-reporting">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="table-reporting">
      {/* Header Section */}
      <div className="panel-title flex justify-between items-center">
        <div>
          Litigation Dashboard
          <span className="text-sm text-gray-500 ml-2">
            Active Cases: {litigationData.length}
          </span>
        </div>
        
        {/* Filters Section */}
        <div className="flex gap-4">
          <select 
            className="form-select bg-white border border-gray-300 rounded-md px-3 py-1"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="URGENT">Urgent</option>
            <option value="OVERDUE">Overdue</option>
            <option value="PENDING">Pending</option>
          </select>
          
          <select 
            className="form-select bg-white border border-gray-300 rounded-md px-3 py-1"
            value={filters.disease}
            onChange={(e) => handleFilterChange('disease', e.target.value)}
          >
            <option value="">All Diseases</option>
            {availableFilters.diseases.map(disease => (
              <option key={disease} value={disease}>{disease}</option>
            ))}
          </select>

          <select 
            className="form-select bg-white border border-gray-300 rounded-md px-3 py-1"
            value={filters.jurisdiction}
            onChange={(e) => handleFilterChange('jurisdiction', e.target.value)}
          >
            <option value="">All Jurisdictions</option>
            {availableFilters.jurisdictions.map(jurisdiction => (
              <option key={jurisdiction} value={jurisdiction}>{jurisdiction}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Table Section */}
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
              {litigationData.map((row, rowIndex) => (
                <tr 
                  key={rowIndex}
                  className="hover:bg-sky-50 cursor-pointer"
                  onClick={() => handleViewDetails(row)}
                >
                  <td className="font-medium">{row.log_number}</td>
                  <td className="max-w-md truncate">{row.case_caption}</td>
                  <td>{row.jurisdiction_display}</td>
                  <td>{row.disease_name}</td>
                  <td>{formatDate(row.file_date)}</td>
                  <td>{formatDate(row.answer_due_date)}</td>
                  <td>{row.company_served}</td>
                  <td>
                    <span className={`status-indicator ${getStatusStyles(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="action-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(row);
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions Section */}
      <div className="dashboard-actions">
        <button 
          className="import-button"
          onClick={() => window.location.reload()}
        >
          <FileText size={20} />
          Refresh Data
        </button>
      </div>
    </div>
  );
};

export default LitigationDashboard;
