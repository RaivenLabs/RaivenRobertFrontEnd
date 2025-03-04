import React, { useState } from 'react';
import './Dashboard.css';

const FilterPanel = ({ filters, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [localFilters, setLocalFilters] = useState(filters);

  // Options for dropdown selects
  const dealSizeOptions = [
    { value: '', label: 'All Deal Sizes' },
    { value: 'small', label: 'Small (<$50M)' },
    { value: 'medium', label: 'Medium ($50M-$250M)' },
    { value: 'large', label: 'Large ($250M-$1B)' },
    { value: 'mega', label: 'Mega (>$1B)' },
  ];

  const industryOptions = [
    { value: '', label: 'All Industries' },
    { value: 'technology', label: 'Technology/SaaS' },
    { value: 'healthcare', label: 'Healthcare/Biotech' },
    { value: 'energy', label: 'Energy/Utilities' },
    { value: 'financial', label: 'Financial Services' },
    { value: 'consumer', label: 'Consumer Goods' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'retail', label: 'Retail/E-commerce' },
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'due_diligence', label: 'Due Diligence' },
    { value: 'regulatory', label: 'Regulatory' },
    { value: 'modeling', label: 'Modeling' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
  ];

  const handleFilterSelect = (filterName, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const applyFilters = () => {
    // Also add search term to the filters
    onFilterChange({ 
      ...localFilters,
      searchTerm
    });
  };

  return (
    <div className="filter-panel">
      <div className="search-box">
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="filter-select">
        <select 
          value={localFilters.dealSize} 
          onChange={(e) => handleFilterSelect('dealSize', e.target.value)}
        >
          {dealSizeOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-select">
        <select 
          value={localFilters.industry} 
          onChange={(e) => handleFilterSelect('industry', e.target.value)}
        >
          {industryOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-select">
        <select 
          value={localFilters.status} 
          onChange={(e) => handleFilterSelect('status', e.target.value)}
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button className="apply-filter-btn" onClick={applyFilters}>
        Apply Filters
      </button>
    </div>
  );
};

export default FilterPanel;
