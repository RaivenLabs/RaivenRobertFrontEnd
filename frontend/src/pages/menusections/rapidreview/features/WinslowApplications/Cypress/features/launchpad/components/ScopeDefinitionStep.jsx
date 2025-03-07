import React, { useState } from 'react';

const ServiceScopeStep = () => {
  // State for the service order
  const [serviceOrder, setServiceOrder] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days from now
    totalBudget: 150000,
    resources: [],
    deliverables: [],
    scope: {
      summary: '',
      details: '',
      workLocation: 'Remote',
      serviceCategories: [],
      objectives: [],
      exclusions: [],
      assumptions: []
    }
  });

  // State for objective management
  const [newObjective, setNewObjective] = useState('');
  const [objectiveError, setObjectiveError] = useState('');

  // State for exclusion management
  const [newExclusion, setNewExclusion] = useState('');
  const [exclusionError, setExclusionError] = useState('');

  // State for assumption management
  const [newAssumption, setNewAssumption] = useState('');
  const [assumptionError, setAssumptionError] = useState('');

  // Service category options
  const serviceCategories = [
    "Application Development",
    "Data Engineering",
    "DevOps",
    "UI/UX Design",
    "Quality Assurance",
    "Project Management",
    "Business Analysis",
    "Strategy Consulting",
    "Technical Architecture",
    "Cloud Engineering",
    "Security Services",
    "Data Science",
    "Machine Learning",
    "System Integration"
  ];

  // Common service scope templates for quick selection
  const scopeTemplates = [
    {
      title: "Web Application Development",
      summary: "Full-stack development services for building a responsive web application.",
      details: "Provider will deliver end-to-end development services including front-end React components, back-end APIs, database schema design, and deployment configuration. Services include requirements gathering, architecture design, implementation, testing, and deployment support.",
      categories: ["Application Development", "UI/UX Design"],
      objectives: [
        "Develop responsive, cross-browser compatible frontend components",
        "Create RESTful APIs for data access and manipulation",
        "Design and implement database schema",
        "Implement authentication and authorization",
        "Provide documentation for all implemented features"
      ]
    },
    {
      title: "Data Platform Enhancement",
      summary: "Services to enhance and optimize the existing data platform architecture.",
      details: "Provider will analyze the current data architecture and implement improvements to enhance performance, scalability, and reliability. Services include data pipeline optimization, ETL process improvement, and implementation of data quality measures.",
      categories: ["Data Engineering", "Cloud Engineering"],
      objectives: [
        "Optimize existing data pipelines for improved performance",
        "Implement data quality monitoring",
        "Enhance data security measures",
        "Automate ETL processes",
        "Create documentation and knowledge transfer"
      ]
    },
    {
      title: "DevOps Implementation",
      summary: "Implementation of DevOps practices and CI/CD pipeline configuration.",
      details: "Provider will establish modern DevOps practices including CI/CD pipeline configuration, infrastructure as code implementation, monitoring setup, and automation of deployment processes to improve development efficiency and system reliability.",
      categories: ["DevOps", "Cloud Engineering"],
      objectives: [
        "Configure and optimize CI/CD pipelines",
        "Implement infrastructure as code",
        "Set up monitoring and alerting systems",
        "Automate deployment processes",
        "Create runbooks and operational documentation"
      ]
    },
    {
      title: "Digital Strategy & Roadmap",
      summary: "Strategic consulting to define digital transformation roadmap.",
      details: "Provider will conduct analysis of current business processes and technology stack to develop a comprehensive digital transformation strategy and implementation roadmap that aligns with business objectives and industry best practices.",
      categories: ["Strategy Consulting", "Business Analysis"],
      objectives: [
        "Assess current technology landscape",
        "Identify digital transformation opportunities",
        "Develop strategic roadmap with priorities",
        "Define implementation plan with timeline",
        "Provide cost-benefit analysis for recommended initiatives"
      ]
    }
  ];

  // Location options
  const locationOptions = [
    "Remote",
    "On-site at Client Location",
    "Provider Location",
    "Hybrid"
  ];
  // Handle text input changes for scope fields
  const handleScopeChange = (e) => {
    const { name, value } = e.target;
    setServiceOrder({
      ...serviceOrder,
      scope: {
        ...serviceOrder.scope,
        [name]: value
      }
    });
  };

  // Handle service category selection
  const handleCategoryChange = (category) => {
    const currentCategories = [...serviceOrder.scope.serviceCategories];
    
    if (currentCategories.includes(category)) {
      // Remove the category if already selected
      const updatedCategories = currentCategories.filter(cat => cat !== category);
      setServiceOrder({
        ...serviceOrder,
        scope: {
          ...serviceOrder.scope,
          serviceCategories: updatedCategories
        }
      });
    } else {
      // Add the category if not already selected
      setServiceOrder({
        ...serviceOrder,
        scope: {
          ...serviceOrder.scope,
          serviceCategories: [...currentCategories, category]
        }
      });
    }
  };

  // Handle work location selection
  const handleLocationChange = (e) => {
    setServiceOrder({
      ...serviceOrder,
      scope: {
        ...serviceOrder.scope,
        workLocation: e.target.value
      }
    });
  };

  // Apply a template to the scope
  const applyTemplate = (template) => {
    setServiceOrder({
      ...serviceOrder,
      scope: {
        ...serviceOrder.scope,
        summary: template.summary,
        details: template.details,
        serviceCategories: template.categories,
        objectives: template.objectives
      }
    });
  };

  // Handle adding a new objective
  const handleAddObjective = () => {
    if (!newObjective.trim()) {
      setObjectiveError('Please enter an objective');
      return;
    }

    setServiceOrder({
      ...serviceOrder,
      scope: {
        ...serviceOrder.scope,
        objectives: [...serviceOrder.scope.objectives, newObjective.trim()]
      }
    });

    setNewObjective('');
    setObjectiveError('');
  };

  // Handle removing an objective
  const handleRemoveObjective = (index) => {
    const updatedObjectives = [...serviceOrder.scope.objectives];
    updatedObjectives.splice(index, 1);
    
    setServiceOrder({
      ...serviceOrder,
      scope: {
        ...serviceOrder.scope,
        objectives: updatedObjectives
      }
    });
  };

  // Handle adding a new exclusion
  const handleAddExclusion = () => {
    if (!newExclusion.trim()) {
      setExclusionError('Please enter an exclusion');
      return;
    }

    setServiceOrder({
      ...serviceOrder,
      scope: {
        ...serviceOrder.scope,
        exclusions: [...serviceOrder.scope.exclusions, newExclusion.trim()]
      }
    });

    setNewExclusion('');
    setExclusionError('');
  };

  // Handle removing an exclusion
  const handleRemoveExclusion = (index) => {
    const updatedExclusions = [...serviceOrder.scope.exclusions];
    updatedExclusions.splice(index, 1);
    
    setServiceOrder({
      ...serviceOrder,
      scope: {
        ...serviceOrder.scope,
        exclusions: updatedExclusions
      }
    });
  };

  // Handle adding a new assumption
  const handleAddAssumption = () => {
    if (!newAssumption.trim()) {
      setAssumptionError('Please enter an assumption');
      return;
    }

    setServiceOrder({
      ...serviceOrder,
      scope: {
        ...serviceOrder.scope,
        assumptions: [...serviceOrder.scope.assumptions, newAssumption.trim()]
      }
    });

    setNewAssumption('');
    setAssumptionError('');
  };

  // Handle removing an assumption
  const handleRemoveAssumption = (index) => {
    const updatedAssumptions = [...serviceOrder.scope.assumptions];
    updatedAssumptions.splice(index, 1);
    
    setServiceOrder({
      ...serviceOrder,
      scope: {
        ...serviceOrder.scope,
        assumptions: updatedAssumptions
      }
    });
  };

  // Check if scope has minimum required information
  const isScopeComplete = () => {
    return (
      serviceOrder.scope.summary.trim() !== '' &&
      serviceOrder.scope.serviceCategories.length > 0 &&
      serviceOrder.scope.objectives.length > 0
    );
  };
  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Define Service Scope</h1>
      
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
      
      {/* Templates Section */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <h3 className="font-semibold mb-4">Quick Start Templates</h3>
        <p className="text-sm text-gray-600 mb-4">
          Select a template below to quickly define the service scope, or create your own custom scope below.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scopeTemplates.map((template, index) => (
            <div 
              key={index} 
              className="border border-gray-200 hover:border-blue-300 rounded-lg p-3 cursor-pointer hover:bg-blue-50"
              onClick={() => applyTemplate(template)}
            >
              <h4 className="font-medium text-blue-800">{template.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{template.summary}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {template.categories.map((category, catIndex) => (
                  <span 
                    key={catIndex} 
                    className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Scope Definition Form */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
        <h3 className="font-semibold mb-4">Scope Definition</h3>
        
        {/* Basic scope information */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Scope Summary *</label>
            <input 
              type="text" 
              name="summary"
              className="w-full p-2 border border-gray-300 rounded" 
              value={serviceOrder.scope.summary}
              onChange={handleScopeChange}
              placeholder="Brief summary of the services to be provided"
            />
            <p className="text-xs text-gray-500 mt-1">
              A concise, one-sentence description of the overall services.
            </p>
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">Detailed Description</label>
            <textarea 
              name="details"
              className="w-full p-2 border border-gray-300 rounded h-32" 
              value={serviceOrder.scope.details}
              onChange={handleScopeChange}
              placeholder="Detailed description of the services, capabilities, and responsibilities..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Provide a thorough description of the services to be performed, specific capabilities to be provided, and key responsibilities.
            </p>
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">Work Location</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded"
              value={serviceOrder.scope.workLocation}
              onChange={handleLocationChange}
            >
              {locationOptions.map((location, index) => (
                <option key={index} value={location}>{location}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Service Categories */}
        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-2">Service Categories *</label>
          <div className="flex flex-wrap gap-2">
            {serviceCategories.map((category, index) => (
              <button
                key={index}
                className={`px-3 py-1.5 text-sm rounded-full border ${
                  serviceOrder.scope.serviceCategories.includes(category)
                    ? 'bg-blue-100 border-blue-300 text-blue-800'
                    : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Select all categories that apply to the services being provided.
          </p>
        </div>
        
        {/* Objectives Section */}
        <div className="mb-6 border-t pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Project Objectives *</label>
          
          <div className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-grow p-2 border border-gray-300 rounded"
                placeholder="Enter an objective..."
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddObjective()}
              />
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleAddObjective}
              >
                Add
              </button>
            </div>
            {objectiveError && <p className="text-red-500 text-xs mt-1">{objectiveError}</p>}
          </div>
          
          {serviceOrder.scope.objectives.length > 0 ? (
            <ul className="space-y-2 max-h-60 overflow-y-auto px-2">
              {serviceOrder.scope.objectives.map((objective, index) => (
                <li key={index} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded border border-gray-200">
                  <span className="text-sm">{objective}</span>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveObjective(index)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic">No objectives defined yet.</p>
          )}
          
          <p className="text-xs text-gray-500 mt-2">
            Define the key objectives and success criteria for the services being provided.
          </p>
        </div>
        
        {/* Exclusions Section */}
        <div className="mb-6 border-t pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Scope Exclusions</label>
          
          <div className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-grow p-2 border border-gray-300 rounded"
                placeholder="Enter services explicitly excluded from scope..."
                value={newExclusion}
                onChange={(e) => setNewExclusion(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddExclusion()}
              />
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleAddExclusion}
              >
                Add
              </button>
            </div>
            {exclusionError && <p className="text-red-500 text-xs mt-1">{exclusionError}</p>}
          </div>
          
          {serviceOrder.scope.exclusions.length > 0 ? (
            <ul className="space-y-2 max-h-40 overflow-y-auto px-2">
              {serviceOrder.scope.exclusions.map((exclusion, index) => (
                <li key={index} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded border border-gray-200">
                  <span className="text-sm">{exclusion}</span>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveExclusion(index)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic">No exclusions defined yet.</p>
          )}
          
          <p className="text-xs text-gray-500 mt-2">
            Clearly define any services that are explicitly excluded from the scope to avoid misunderstandings.
          </p>
        </div>
        
        {/* Assumptions Section */}
        <div className="mb-6 border-t pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Key Assumptions</label>
          
          <div className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-grow p-2 border border-gray-300 rounded"
                placeholder="Enter a key assumption for this engagement..."
                value={newAssumption}
                onChange={(e) => setNewAssumption(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddAssumption()}
              />
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleAddAssumption}
              >
                Add
              </button>
            </div>
            {assumptionError && <p className="text-red-500 text-xs mt-1">{assumptionError}</p>}
          </div>
          
          {serviceOrder.scope.assumptions.length > 0 ? (
            <ul className="space-y-2 max-h-40 overflow-y-auto px-2">
              {serviceOrder.scope.assumptions.map((assumption, index) => (
                <li key={index} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded border border-gray-200">
                  <span className="text-sm">{assumption}</span>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveAssumption(index)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 italic">No assumptions defined yet.</p>
          )}
          
          <p className="text-xs text-gray-500 mt-2">
            Document key assumptions that are being made about the client environment, resources, or responsibilities.
          </p>
        </div>
      </div>
      
      {/* Scope Preview */}
      {serviceOrder.scope.summary && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">Scope Preview</h3>
          
          <div className="mb-3">
            <h4 className="text-sm font-medium text-blue-700">Summary</h4>
            <p className="text-sm">{serviceOrder.scope.summary}</p>
          </div>
          
          {serviceOrder.scope.details && (
            <div className="mb-3">
              <h4 className="text-sm font-medium text-blue-700">Description</h4>
              <p className="text-sm whitespace-pre-line">{serviceOrder.scope.details}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <h4 className="text-sm font-medium text-blue-700">Categories</h4>
              <div className="flex flex-wrap gap-1 mt-1">
                {serviceOrder.scope.serviceCategories.map((category, index) => (
                  <span key={index} className="text-xs px-2 py-0.5 bg-blue-100 rounded">
                    {category}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-blue-700">Work Location</h4>
              <p className="text-sm">{serviceOrder.scope.workLocation}</p>
            </div>
          </div>
          
          {serviceOrder.scope.objectives.length > 0 && (
            <div className="mt-3">
              <h4 className="text-sm font-medium text-blue-700">Objectives</h4>
              <ul className="list-disc list-inside text-sm">
                {serviceOrder.scope.objectives.map((objective, index) => (
                  <li key={index}>{objective}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
          Back to Deliverables
        </button>
        
        <button 
          className={`px-6 py-2 rounded ${
            isScopeComplete() ?
            'bg-green-600 hover:bg-green-700 text-white' :
            'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!isScopeComplete()}
        >
          Continue to Review
        </button>
      </div>
    </div>
  );
};

export default ServiceScopeStep;
