import React from 'react';

const ProviderFilterPanel = ({
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
            placeholder="Search providers..." 
            className="w-full p-2 border border-gray-300 rounded"
          />
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
            <option value="Pending">Pending</option>
            <option value="Inactive">Inactive</option>
            <option value="Terminated">Terminated</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
        <div className="w-36 relative">
          <select 
            name="category"
            value={filterValues.category}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded appearance-none"
          >
            <option value="">Category</option>
            <option value="Professional Services">Professional Services</option>
            <option value="Software Development">Software Development</option>
            <option value="Consulting">Consulting</option>
            <option value="IT Services">IT Services</option>
            <option value="Staffing">Staffing</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
        <div className="w-36 relative">
          <select 
            name="agreementType"
            value={filterValues.agreementType}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded appearance-none"
          >
            <option value="">Agreement Type</option>
            <option value="Evergreen">Evergreen</option>
            <option value="Fixed Term">Fixed Term</option>
            <option value="Time & Materials">Time & Materials</option>
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

export default ProviderFilterPanel;
