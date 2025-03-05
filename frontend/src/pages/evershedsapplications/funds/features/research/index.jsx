// src/components/FundFinder/index.jsx
import React, { useState, useEffect } from 'react';
import { Search, Filter, CheckCircle, AlertCircle, Save, FolderPlus } from 'lucide-react';
import './FundFinder.css';

const FundFinder = () => {
  // State Management
  const [projectName, setProjectName] = useState('');
  const [existingProjects, setExistingProjects] = useState([]);
  const [searchMode, setSearchMode] = useState('single'); // 'single' or 'batch'
  const [searchParams, setSearchParams] = useState({
    fundName: '',
    registrationNumber: '',
    jurisdiction: '',
    fundType: '',
    status: ''
  });
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFunds, setSelectedFunds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Options for dropdowns
  const searchOptions = {
    jurisdictions: ['United Kingdom', 'Luxembourg', 'Ireland'],
    fundTypes: ['UCITS', 'AIF', 'Investment Trust'],
    statuses: ['Active', 'Pending', 'Suspended']
  };

  // Handle project selection/creation
  const handleProjectChange = (event) => {
    const value = event.target.value;
    if (value === 'new') {
      // Show new project input
      setProjectName('');
    } else {
      setProjectName(value);
      // Load existing project data if needed
    }
  };

  // Handle search parameter changes
  const handleSearchParamChange = (param, value) => {
    setSearchParams(prev => ({
      ...prev,
      [param]: value
    }));
  };

  // Handle search execution
  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      // API call would go here
      const results = await mockSearchAPI(searchParams);
      setSearchResults(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle fund selection
  const handleFundSelection = (fund) => {
    setSelectedFunds(prev => {
      const exists = prev.find(f => f.frn === fund.frn);
      if (exists) {
        return prev.filter(f => f.frn !== fund.frn);
      }
      return [...prev, fund];
    });
  };

  return (
    <div className="fund-finder">
      {/* Project Selection Section */}
      <div className="project-section mb-6">
        <h2 className="section-title">Project Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select Project</label>
            <select 
              className="form-select w-full"
              value={projectName}
              onChange={handleProjectChange}
            >
              <option value="">Select or Create Project</option>
              <option value="new">+ Create New Project</option>
              {existingProjects.map(project => (
                <option key={project.id} value={project.name}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          {projectName === 'new' && (
            <div>
              <label className="block text-sm font-medium mb-2">New Project Name</label>
              <input
                type="text"
                className="form-input w-full"
                placeholder="Enter project name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Search Controls Section */}
      <div className="search-controls mb-6">
        <h2 className="section-title">Search Parameters</h2>
        <div className="flex gap-4 mb-4">
          <button 
            className={`mode-button ${searchMode === 'single' ? 'active' : ''}`}
            onClick={() => setSearchMode('single')}
          >
            Single Fund Search
          </button>
          <button 
            className={`mode-button ${searchMode === 'batch' ? 'active' : ''}`}
            onClick={() => setSearchMode('batch')}
          >
            Batch Search
          </button>
        </div>

        {searchMode === 'single' ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Fund Name or Number</label>
              <input
                type="text"
                className="form-input w-full"
                placeholder="Enter fund name or registration number"
                value={searchParams.fundName}
                onChange={(e) => handleSearchParamChange('fundName', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Fund Type</label>
              <select 
                className="form-select w-full"
                value={searchParams.fundType}
                onChange={(e) => handleSearchParamChange('fundType', e.target.value)}
              >
                <option value="">All Fund Types</option>
                {searchOptions.fundTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div className="batch-upload">
            <label className="block text-sm font-medium mb-2">Upload Fund List</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input 
                type="file" 
                accept=".csv,.xlsx,.xls"
                className="hidden" 
                id="fileUpload"
                onChange={(e) => handleBatchUpload(e.target.files[0])}
              />
              <label htmlFor="fileUpload" className="cursor-pointer text-royal-blue">
                Click to upload or drag and drop
                <p className="text-sm text-gray-500 mt-1">
                  CSV, Excel files supported
                </p>
              </label>
            </div>
          </div>
        )}

        <button 
          className="search-button mt-4"
          onClick={handleSearch}
          disabled={loading}
        >
          <Search size={20} />
          {loading ? 'Searching...' : 'Search Funds'}
        </button>
      </div>

      {/* Results Section */}
      {searchResults.length > 0 && (
        <div className="results-section">
          <h2 className="section-title">Search Results</h2>
          <div className="table-container">
            <table className="results-table">
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Fund Name</th>
                  <th>Registration</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.map((fund) => (
                  <tr key={fund.frn} className="hover:bg-sky-50">
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedFunds.some(f => f.frn === fund.frn)}
                        onChange={() => handleFundSelection(fund)}
                        className="form-checkbox"
                      />
                    </td>
                    <td>{fund.name}</td>
                    <td>{fund.frn}</td>
                    <td>{fund.type}</td>
                    <td>
                      <span className={`status-indicator ${getStatusClass(fund.status)}`}>
                        {fund.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="view-button"
                        onClick={() => handleViewDetails(fund)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Selected Funds Summary */}
          {selectedFunds.length > 0 && (
            <div className="selected-summary mt-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium">{selectedFunds.length} funds selected</span>
                  <button 
                    className="text-sm text-royal-blue ml-4"
                    onClick={() => setSelectedFunds([])}
                  >
                    Clear Selection
                  </button>
                </div>
                <button 
                  className="save-button"
                  onClick={handleSaveSelection}
                >
                  <Save size={20} />
                  Save to Project
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="error-message">
          <AlertCircle size={20} />
          {error}
        </div>
      )}
    </div>
  );
};

export default FundFinder;
