import React, { useState, useEffect } from 'react';

const DeliverablesStep = () => {
  // State for the service order (same as in RoleSelectionStep for consistency)
  const [serviceOrder, setServiceOrder] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days from now
    totalBudget: 150000,
    resources: [],
    deliverables: []
  });

  // State for the deliverable being added
  const [newDeliverable, setNewDeliverable] = useState({
    id: '',
    title: '',
    description: '',
    dueDate: serviceOrder.endDate,
    status: 'Planned',
    acceptanceCriteria: '',
    assignee: '', 
    milestonePayment: 0,
    dependencies: []
  });
  
  // Add state for confirmation dialog
  const [confirmationDialog, setConfirmationDialog] = useState({
    isOpen: false,
    deliverableId: null,
    message: ''
  });

  // State for editing
  const [editingDeliverable, setEditingDeliverable] = useState(null);

  // Sample deliverable templates based on common consulting deliverables
  const deliverableTemplates = [
    {
      category: 'Business Analysis',
      templates: [
        { title: 'Current State Assessment', description: 'Analysis of the current state processes and systems, identifying pain points and areas for improvement.' },
        { title: 'Business Requirements Document', description: 'Detailed documentation of business requirements including functional, non-functional and technical needs.' },
        { title: 'Process Flow Documentation', description: 'Documentation of business process flows using industry-standard notation.' }
      ]
    },
    {
      category: 'Strategy & Planning',
      templates: [
        { title: 'Strategic Roadmap', description: 'Long-term strategic plan with key initiatives, timelines, and dependencies.' },
        { title: 'Implementation Plan', description: 'Detailed plan for implementing recommended solutions, including timeline, resources, and risk mitigation.' },
        { title: 'Business Case', description: 'Comprehensive analysis of project benefits, costs, risks, and expected ROI.' }
      ]
    },
    {
      category: 'Technical Documentation',
      templates: [
        { title: 'System Architecture Design', description: 'Technical documentation detailing system components, interfaces, and data flows.' },
        { title: 'Integration Specification', description: 'Detailed specifications for integrating with existing systems and data sources.' },
        { title: 'Technical Requirements Specification', description: 'Documentation of technical requirements and specifications for implementation.' }
      ]
    },
    {
      category: 'Project Deliverables',
      templates: [
        { title: 'Status Report', description: 'Regular report documenting project progress, issues, risks, and next steps.' },
        { title: 'Final Project Report', description: 'Comprehensive summary of project outcomes, lessons learned, and recommendations for future work.' },
        { title: 'Knowledge Transfer Documentation', description: 'Materials and documentation for knowledge transfer to Nike staff.' }
      ]
    }
  ];

  // Calculate the recommended due date based on service order start and dependencies
  const calculateRecommendedDueDate = (dependencies = []) => {
    // Start with the service order start date
    let baseDate = new Date(serviceOrder.startDate);
    
    // Add time based on dependencies
    if (dependencies.length > 0) {
      // Find the latest due date among dependencies
      const latestDependencyDate = new Date(Math.max(
        ...dependencies.map(depId => {
          const dep = serviceOrder.deliverables.find(d => d.id === depId);
          return dep ? new Date(dep.dueDate).getTime() : 0;
        })
      ));
      
      // If valid date found, use it as the base
      if (latestDependencyDate.getTime() > 0) {
        baseDate = new Date(latestDependencyDate);
        // Add 7 days after the latest dependency
        baseDate.setDate(baseDate.getDate() + 7);
      }
    } else {
      // If no dependencies, calculate based on project progress
      const projectDuration = 
        (new Date(serviceOrder.endDate) - new Date(serviceOrder.startDate)) / (1000 * 60 * 60 * 24);
      const midPoint = Math.floor(projectDuration / 2);
      baseDate.setDate(baseDate.getDate() + midPoint);
    }
    
    // Don't exceed the project end date
    const endDate = new Date(serviceOrder.endDate);
    if (baseDate > endDate) {
      baseDate = endDate;
    }
    
    return baseDate.toISOString().split('T')[0];
  };
  // Apply a template to the new deliverable
  const applyTemplate = (template) => {
    setNewDeliverable({
      ...newDeliverable,
      title: template.title,
      description: template.description,
      dueDate: calculateRecommendedDueDate(newDeliverable.dependencies)
    });
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDeliverable({
      ...newDeliverable,
      [name]: value
    });
  };

  // Handle dependency selection
  const handleDependencyChange = (deliverableId) => {
    let updatedDependencies = [...newDeliverable.dependencies];
    
    if (updatedDependencies.includes(deliverableId)) {
      // Remove dependency
      updatedDependencies = updatedDependencies.filter(id => id !== deliverableId);
    } else {
      // Add dependency
      updatedDependencies.push(deliverableId);
    }
    
    setNewDeliverable({
      ...newDeliverable,
      dependencies: updatedDependencies,
      dueDate: calculateRecommendedDueDate(updatedDependencies)
    });
  };

  // Add deliverable to the service order
  const handleAddDeliverable = () => {
    if (!newDeliverable.title) {
      alert('Please provide a deliverable title');
      return;
    }
    
    const updatedDeliverables = [
      ...serviceOrder.deliverables,
      {
        ...newDeliverable,
        id: `deliverable-${Date.now()}` // Generate a unique ID
      }
    ];
    
    setServiceOrder({
      ...serviceOrder,
      deliverables: updatedDeliverables
    });
    
    // Reset the form
    setNewDeliverable({
      id: '',
      title: '',
      description: '',
      dueDate: serviceOrder.endDate,
      status: 'Planned',
      acceptanceCriteria: '',
      assignee: '',
      milestonePayment: 0,
      dependencies: []
    });
  };

  // Edit an existing deliverable
  const startEditingDeliverable = (deliverable) => {
    setEditingDeliverable(deliverable.id);
    setNewDeliverable({
      ...deliverable
    });
  };
  
  const saveEditedDeliverable = () => {
    const updatedDeliverables = serviceOrder.deliverables.map(deliverable => 
      deliverable.id === editingDeliverable ? { ...newDeliverable } : deliverable
    );
    
    setServiceOrder({
      ...serviceOrder,
      deliverables: updatedDeliverables
    });
    
    // Reset the form and editing state
    setEditingDeliverable(null);
    setNewDeliverable({
      id: '',
      title: '',
      description: '',
      dueDate: serviceOrder.endDate,
      status: 'Planned',
      acceptanceCriteria: '',
      assignee: '',
      milestonePayment: 0,
      dependencies: []
    });
  };
  
  const cancelEditing = () => {
    setEditingDeliverable(null);
    setNewDeliverable({
      id: '',
      title: '',
      description: '',
      dueDate: serviceOrder.endDate,
      status: 'Planned',
      acceptanceCriteria: '',
      assignee: '',
      milestonePayment: 0,
      dependencies: []
    });
  };

  // Handle remove deliverable with confirmation dialog
  const handleRemoveDeliverable = (deliverableId) => {
    // Check if any other deliverables depend on this one
    const hasDependents = serviceOrder.deliverables.some(deliverable => 
      deliverable.dependencies.includes(deliverableId)
    );
    
    if (hasDependents) {
      // Show confirmation dialog instead of using browser confirm
      setConfirmationDialog({
        isOpen: true,
        deliverableId,
        message: 'Other deliverables depend on this item. Removing it will also remove those dependencies. Continue?'
      });
      return;
    }
    
    // If no dependents, proceed with removal directly
    removeDeliverableById(deliverableId);
  };

  // Handle actual removal of deliverable
  const removeDeliverableById = (deliverableId) => {
    // Remove this deliverable
    const updatedDeliverables = serviceOrder.deliverables.filter(
      deliverable => deliverable.id !== deliverableId
    );
    
    // Remove this as a dependency from other deliverables
    updatedDeliverables.forEach(deliverable => {
      if (deliverable.dependencies.includes(deliverableId)) {
        deliverable.dependencies = deliverable.dependencies.filter(
          id => id !== deliverableId
        );
      }
    });
    
    setServiceOrder({
      ...serviceOrder,
      deliverables: updatedDeliverables
    });
    
    // Reset confirmation dialog
    setConfirmationDialog({
      isOpen: false,
      deliverableId: null,
      message: ''
    });
  };

  // Handle cancellation of confirmation
  const handleCancelConfirmation = () => {
    setConfirmationDialog({
      isOpen: false,
      deliverableId: null,
      message: ''
    });
  };

  // Group deliverables by month for timeline view
  const getDeliverablesByMonth = () => {
    const grouped = {};
    
    serviceOrder.deliverables.forEach(deliverable => {
      const date = new Date(deliverable.dueDate);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!grouped[month]) {
        grouped[month] = [];
      }
      
      grouped[month].push(deliverable);
    });
    
    // Sort months chronologically
    return Object.keys(grouped)
      .sort()
      .map(month => ({
        month,
        displayMonth: new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        deliverables: grouped[month].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      }));
  };

  // Get status badge styles
  const getStatusStyles = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'At Risk':
        return 'bg-red-100 text-red-800';
      case 'Delayed':
        return 'bg-yellow-100 text-yellow-800';
      case 'Planned':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate total milestone payments
  const totalMilestones = serviceOrder.deliverables.reduce(
    (sum, deliverable) => sum + (parseFloat(deliverable.milestonePayment) || 0), 
    0
  );
  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Define Deliverables</h1>
      
      {/* Provider information */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-500">Provider</span>
            <h3 className="font-bold text-lg">Talos Consulting Group LLC</h3>
            <p className="text-sm text-gray-600">MSA Reference: K-0386573</p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-sm text-gray-500">Project Timeline</span>
            <p className="font-medium">
              {new Date(serviceOrder.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - 
              {' '}{new Date(serviceOrder.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
      
      {/* Deliverables summary */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Deliverables Summary</h3>
          <div className="text-sm text-gray-600">
            {serviceOrder.deliverables.length} deliverables defined
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
            <div className="text-lg font-semibold">{serviceOrder.deliverables.length}</div>
            <div className="text-sm text-gray-600">Total Deliverables</div>
          </div>
          
          <div className="bg-green-50 p-3 rounded-lg border border-green-100">
            <div className="text-lg font-semibold">
              {serviceOrder.deliverables.filter(d => d.status === 'Completed').length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
            <div className="text-lg font-semibold">
              ${totalMilestones.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Milestone Payments</div>
          </div>
        </div>
      </div>
      
      {/* Deliverables Timeline */}
      {serviceOrder.deliverables.length > 0 && (
        <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
          <h3 className="font-semibold mb-4">Deliverables Timeline</h3>
          
          <div className="space-y-6">
            {getDeliverablesByMonth().map(monthGroup => (
              <div key={monthGroup.month} className="border-l-2 border-blue-200 pl-4 ml-2">
                <h4 className="font-medium text-blue-700 mb-2">{monthGroup.displayMonth}</h4>
                
                <div className="space-y-3">
                  {monthGroup.deliverables.map(deliverable => (
                    <div 
                      key={deliverable.id} 
                      className="flex flex-col md:flex-row md:items-center bg-gray-50 p-3 rounded border border-gray-200"
                    >
                      <div className="flex-grow">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusStyles(deliverable.status)}`}>
                            {deliverable.status}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(deliverable.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <div className="font-medium mt-1">{deliverable.title}</div>
                        {deliverable.milestonePayment > 0 && (
                          <div className="text-sm text-green-600 mt-1">
                            ${parseFloat(deliverable.milestonePayment).toLocaleString()} milestone payment
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2 mt-2 md:mt-0">
                        <button
                          onClick={() => startEditingDeliverable(deliverable)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleRemoveDeliverable(deliverable.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Add/Edit Deliverable Form */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <h3 className="font-semibold mb-4">
          {editingDeliverable ? 'Edit Deliverable' : 'Add New Deliverable'}
        </h3>
        
        {!editingDeliverable && (
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Quick Templates</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {deliverableTemplates.map(category => (
                <div key={category.category} className="mb-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">{category.category}</h4>
                  <div className="space-y-1">
                    {category.templates.map(template => (
                      <button
                        key={template.title}
                        onClick={() => applyTemplate(template)}
                        className="block w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded"
                      >
                        {template.title}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Title *</label>
            <input 
              type="text" 
              name="title"
              className="w-full p-2 border border-gray-300 rounded" 
              value={newDeliverable.title}
              onChange={handleInputChange}
              placeholder="E.g., Business Requirements Document"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">Due Date *</label>
            <input 
              type="date" 
              name="dueDate"
              className="w-full p-2 border border-gray-300 rounded" 
              value={newDeliverable.dueDate}
              onChange={handleInputChange}
              min={serviceOrder.startDate}
              max={serviceOrder.endDate}
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">Description</label>
          <textarea 
            name="description"
            className="w-full p-2 border border-gray-300 rounded h-24" 
            value={newDeliverable.description}
            onChange={handleInputChange}
            placeholder="Describe the deliverable and its purpose..."
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Status</label>
            <select 
              name="status"
              className="w-full p-2 border border-gray-300 rounded"
              value={newDeliverable.status}
              onChange={handleInputChange}
            >
              <option value="Planned">Planned</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Delayed">Delayed</option>
              <option value="At Risk">At Risk</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">Milestone Payment ($)</label>
            <input 
              type="number" 
              name="milestonePayment"
              className="w-full p-2 border border-gray-300 rounded" 
              value={newDeliverable.milestonePayment}
              onChange={handleInputChange}
              placeholder="0"
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">Acceptance Criteria</label>
          <textarea 
            name="acceptanceCriteria"
            className="w-full p-2 border border-gray-300 rounded h-16" 
            value={newDeliverable.acceptanceCriteria}
            onChange={handleInputChange}
            placeholder="Define the criteria for Nike to accept this deliverable..."
          />
        </div>
        
        {serviceOrder.deliverables.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Dependencies</label>
            <div className="max-h-40 overflow-y-auto p-2 border border-gray-300 rounded">
              {serviceOrder.deliverables
                .filter(d => d.id !== editingDeliverable) // Don't allow self-dependency
                .map(deliverable => (
                  <div key={deliverable.id} className="flex items-center mb-1">
                    <input 
                      type="checkbox"
                      className="mr-2"
                      checked={newDeliverable.dependencies.includes(deliverable.id)}
                      onChange={() => handleDependencyChange(deliverable.id)}
                    />
                    <span className="text-sm">{deliverable.title}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      (Due: {new Date(deliverable.dueDate).toLocaleDateString()})
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-end gap-2 mt-4">
          {editingDeliverable ? (
            <>
              <button
                onClick={cancelEditing}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveEditedDeliverable}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                disabled={!newDeliverable.title}
              >
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={handleAddDeliverable}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              disabled={!newDeliverable.title}
            >
              Add Deliverable
            </button>
          )}
        </div>
      </div>
      
      {/* Confirmation Dialog */}
      {confirmationDialog.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
            <h4 className="font-semibold mb-3">Confirm Action</h4>
            <p className="mb-4">{confirmationDialog.message}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelConfirmation}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => removeDeliverableById(confirmationDialog.deliverableId)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Next Step Button */}
      <div className="flex justify-between mt-6">
        <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
          Back to Team Selection
        </button>
        
        <button 
          className={`px-6 py-2 rounded ${
            serviceOrder.deliverables.length > 0 ?
            'bg-green-600 hover:bg-green-700 text-white' :
            'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={serviceOrder.deliverables.length === 0}
        >
          Finalize Service Order
        </button>
      </div>
    </div>
  );
};

export default DeliverablesStep;
