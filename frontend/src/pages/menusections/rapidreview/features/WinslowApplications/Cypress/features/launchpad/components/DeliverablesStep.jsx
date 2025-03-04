import React, { useState } from 'react';

const DeliverablesStep = ({ deliverables, onAddDeliverable, onRemoveDeliverable, onUpdateDeliverable }) => {
  const [newDeliverable, setNewDeliverable] = useState({
    title: '',
    description: '',
    dueDate: ''
  });
  const [editIndex, setEditIndex] = useState(-1);
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (editIndex >= 0) {
      // If editing an existing deliverable
      const updatedDeliverable = {
        ...deliverables[editIndex],
        [name]: value
      };
      onUpdateDeliverable(editIndex, updatedDeliverable);
    } else {
      // If creating a new deliverable
      setNewDeliverable({
        ...newDeliverable,
        [name]: value
      });
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editIndex >= 0) {
      // Exit edit mode
      setEditIndex(-1);
    } else {
      // Add new deliverable
      onAddDeliverable(newDeliverable);
      
      // Reset form
      setNewDeliverable({
        title: '',
        description: '',
        dueDate: ''
      });
    }
  };
  
  // Start editing a deliverable
  const startEditing = (index) => {
    setEditIndex(index);
  };
  
  // Cancel editing
  const cancelEditing = () => {
    setEditIndex(-1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Add Deliverables</h2>
        <p className="text-gray-600">
          Define the specific deliverables that will be provided as part of this service order.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deliverable Form */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-4">
            {editIndex >= 0 ? 'Edit Deliverable' : 'Add New Deliverable'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deliverable Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={editIndex >= 0 ? deliverables[editIndex].title : newDeliverable.title}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="E.g., User Interface Design, Technical Documentation"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={editIndex >= 0 ? deliverables[editIndex].description : newDeliverable.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Provide details about what will be delivered..."
                required
              ></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="dueDate"
                value={editIndex >= 0 ? deliverables[editIndex].dueDate : newDeliverable.dueDate}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            
            <div className="pt-2 flex justify-between">
              {editIndex >= 0 ? (
                <>
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Update Deliverable
                  </button>
                </>
              ) : (
                <button
                  type="submit"
                  className="w-full bg-royalBlue text-white py-2 rounded hover:bg-blue-700 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Deliverable
                </button>
              )}
            </div>
          </form>
        </div>
        
        {/* Deliverable List */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-4">Deliverables List</h3>
          
          {deliverables.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <p>No deliverables added yet</p>
              <p className="mt-1 text-sm">Define deliverables using the form on the left</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {deliverables.map((deliverable, index) => (
                <div 
                  key={index} 
                  className={`border border-gray-200 rounded-lg p-3 ${
                    editIndex === index ? 'bg-blue-50 border-blue-300' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-800">{deliverable.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {deliverable.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        Due: {new Date(deliverable.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-200 flex justify-end space-x-2">
                    {editIndex !== index && (
                      <>
                        <button
                          onClick={() => startEditing(index)}
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                          disabled={editIndex >= 0}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => onRemoveDeliverable(index)}
                          className="text-red-600 hover:text-red-800 text-sm flex items-center"
                          disabled={editIndex >= 0}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Remove
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {deliverables.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-200">
              <span className="text-gray-700">Total: {deliverables.length} deliverable(s)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliverablesStep;
