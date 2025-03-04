import React, { useState } from 'react';

const RoleSelectionStep = ({ rateCard, selectedRoles, onAddRole, onRemoveRole }) => {
  const [newRole, setNewRole] = useState({
    roleId: '',
    roleName: '',
    rate: 0,
    standardRate: 0,
    startDate: '',
    endDate: ''
  });
  const [customRate, setCustomRate] = useState(false);
  
  // Handle role selection change
  const handleRoleChange = (e) => {
    const roleId = e.target.value;
    const selectedRoleInfo = rateCard.roles.find(r => r.roleId === roleId);
    
    if (selectedRoleInfo) {
      setNewRole({
        ...newRole,
        roleId: selectedRoleInfo.roleId,
        roleName: selectedRoleInfo.roleName,
        rate: selectedRoleInfo.rate,
        standardRate: selectedRoleInfo.rate
      });
      setCustomRate(false);
    } else {
      setNewRole({
        ...newRole,
        roleId: '',
        roleName: '',
        rate: 0,
        standardRate: 0
      });
    }
  };
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRole({
      ...newRole,
      [name]: name === 'rate' ? parseFloat(value) || 0 : value
    });
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation checks
    if (!newRole.roleId || !newRole.startDate || !newRole.endDate) {
      alert('Please fill in all required fields.');
      return;
    }
    
    if (new Date(newRole.startDate) > new Date(newRole.endDate)) {
      alert('Start date cannot be after end date.');
      return;
    }
    
    // Add the role to selected roles
    onAddRole(newRole);
    
    // Reset form
    setNewRole({
      roleId: '',
      roleName: '',
      rate: 0,
      standardRate: 0,
      startDate: '',
      endDate: ''
    });
    setCustomRate(false);
  };
  
  // Calculate the variance as a percentage
  const calculateVariance = (rate, standardRate) => {
    if (!standardRate) return 0;
    return ((standardRate - rate) / standardRate) * 100;
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Select Roles & Rates</h2>
        <p className="text-gray-600">
          Add the roles needed for this service order along with their rates and durations.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Role Selection Form */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-4">Add New Role</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={newRole.roleId}
                  onChange={handleRoleChange}
                  className="w-full p-2 border border-gray-300 rounded appearance-none"
                  required
                >
                  <option value="">-- Select a Role --</option>
                  {rateCard.roles.map(role => (
                    <option key={role.roleId} value={role.roleId}>
                      {role.roleName} - ${role.rate}/{role.unit}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center mb-2">
                <label className="block text-sm font-medium text-gray-700 mr-2">
                  Rate <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="custom-rate"
                    checked={customRate}
                    onChange={() => setCustomRate(!customRate)}
                    className="h-4 w-4 text-royalBlue focus:ring-royalBlue border-gray-300 rounded"
                    disabled={!newRole.roleId}
                  />
                  <label htmlFor="custom-rate" className="ml-2 block text-xs text-gray-600">
                    Use custom rate
                  </label>
                </div>
              </div>
              <div className="flex items-center">
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    name="rate"
                    value={newRole.rate}
                    onChange={handleInputChange}
                    disabled={!customRate || !newRole.roleId}
                    className={`pl-8 pr-12 py-2 border border-gray-300 rounded w-full ${
                      !customRate && newRole.roleId ? 'bg-gray-100' : ''
                    }`}
                    min="0"
                    step="0.01"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">/hour</span>
                  </div>
                </div>
              </div>
              {customRate && newRole.standardRate > 0 && (
                <div className="mt-1">
                  <span className={`text-xs ${
                    newRole.rate < newRole.standardRate ? 'text-green-600' : 
                    newRole.rate > newRole.standardRate ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {newRole.rate < newRole.standardRate ? 
                      `${calculateVariance(newRole.rate, newRole.standardRate).toFixed(1)}% below rate card` : 
                      newRole.rate > newRole.standardRate ? 
                      `${Math.abs(calculateVariance(newRole.rate, newRole.standardRate)).toFixed(1)}% above rate card` : 
                      'Standard rate card rate'}
                  </span>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={newRole.startDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={newRole.endDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-royalBlue text-white py-2 rounded hover:bg-blue-700 flex items-center justify-center"
                disabled={!newRole.roleId}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Role
              </button>
            </div>
          </form>
        </div>
        
        {/* Selected Roles */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-4">Selected Roles</h3>
          
          {selectedRoles.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p>No roles added yet</p>
              <p className="mt-1 text-sm">Select roles from the form on the left to add them to the order</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {selectedRoles.map((role, index) => {
                const duration = calculateDuration(role.startDate, role.endDate);
                const subtotal = role.rate * duration * 8; // 8 hours/day
                
                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-800">{role.roleName}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {formatCurrency(role.rate)}/hour
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(role.startDate).toLocaleDateString()} to {new Date(role.endDate).toLocaleDateString()} ({duration} days)
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-800">{formatCurrency(subtotal)}</p>
                        {role.rate !== role.standardRate && (
                          <p className={`text-xs mt-1 ${role.rate < role.standardRate ? 'text-green-600' : 'text-red-600'}`}>
                            {role.rate < role.standardRate ? 
                              `${calculateVariance(role.rate, role.standardRate).toFixed(1)}% below rate card` : 
                              `${Math.abs(calculateVariance(role.rate, role.standardRate)).toFixed(1)}% above rate card`}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-200 flex justify-end">
                      <button
                        onClick={() => onRemoveRole(index)}
                        className="text-red-600 hover:text-red-800 text-sm flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {selectedRoles.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Total:</span>
                <span className="font-bold text-gray-800">
                  {formatCurrency(selectedRoles.reduce((sum, role) => {
                    const duration = calculateDuration(role.startDate, role.endDate);
                    return sum + (role.rate * duration * 8);
                  }, 0))}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to calculate duration in days between two dates
const calculateDuration = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export default RoleSelectionStep;
