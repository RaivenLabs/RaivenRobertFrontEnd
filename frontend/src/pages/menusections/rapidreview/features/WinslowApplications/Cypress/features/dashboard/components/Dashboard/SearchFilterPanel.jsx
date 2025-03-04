import React from 'react';

const SearchFilterPanel = ({ 
  filterValues, 
  handleFilterChange, 
  applyFilters, 
  resetFilters 
}) => {
  return (
    <div className="bg-gray-50 p-4 border-b border-gray-200">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="w-64">
          <input 
            type="text" 
            name="search"
            value={filterValues.search}
            onChange={handleFilterChange}
            placeholder="Search service orders..." 
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="w-36 relative">
          <select 
            name="provider"
            value={filterValues.provider}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded appearance-none"
          >
            <option value="">Provider</option>
            <option value="Midway Consulting">Midway Consulting</option>
            <option value="Apex Systems">Apex Systems</option>
            <option value="Technica Solutions">Technica Solutions</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
        <div className="w-36 relative">
          <select 
            name="status"
            value={filterValues.status}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded appearance-none"
          >
            <option value="">Status</option>
            <option value="Active">Active</option>
            <option value="Pending Approval">Pending Approval</option>
            <option value="Planning">Planning</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
        <div className="w-36 relative">
          <select 
            name="resourceRole"
            value={filterValues.resourceRole}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded appearance-none"
          >
            <option value="">Resource Role</option>
            <option value="Technical Lead">Technical Lead</option>
            <option value="Senior Developer">Senior Developer</option>
            <option value="Project Manager">Project Manager</option>
            <option value="Data Scientist">Data Scientist</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
        <div className="w-36 relative">
          <select 
            name="fiscalYear"
            value={filterValues.fiscalYear}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded appearance-none"
          >
            <option value="">Fiscal Year</option>
            <option value="FY25">FY25</option>
            <option value="FY26">FY26</option>
            <option value="FY25-26">Cross-FY</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
        <button 
          onClick={applyFilters}
          className="bg-royalBlue text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Apply Filters
        </button>
        <button 
          onClick={resetFilters}
          className="border border-gray-300 text-gray-600 px-4 py-2 rounded hover:bg-gray-100"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default SearchFilterPanel;
