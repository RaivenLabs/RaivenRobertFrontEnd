import React, { useState } from 'react';

const DualPanelContainer = () => {
  // State for Automate More Inputs panel
  const [automatedInputs, setAutomatedInputs] = useState([
    { category: 'Contractor', template: '{{ContractorDefinedTerm}}' },
    { category: 'Customer', template: '{{CustomerDefinedTerm}}' },
    { category: 'Effective Date', template: '{{EffectiveDate}}' }
  ]);
  const [newInputCategory, setNewInputCategory] = useState('');
  const [newInputTemplate, setNewInputTemplate] = useState('');

  // State for Change Defined Terms panel
  const [definedTerms, setDefinedTerms] = useState([]);
  const [currentDefinedTerm, setCurrentDefinedTerm] = useState('');
  const [newDefinedTerm, setNewDefinedTerm] = useState('');

  // Handler for adding new automated input
  const handleAddAutomatedInput = () => {
    if (newInputCategory && newInputTemplate) {
      setAutomatedInputs([
        ...automatedInputs,
        { category: newInputCategory, template: `{{${newInputTemplate}}}` }
      ]);
      setNewInputCategory('');
      setNewInputTemplate('');
    }
  };

  // Handler for adding new defined term change
  const handleAddDefinedTerm = () => {
    if (currentDefinedTerm && newDefinedTerm) {
      setDefinedTerms([
        ...definedTerms,
        { current: currentDefinedTerm, replacement: newDefinedTerm }
      ]);
      setCurrentDefinedTerm('');
      setNewDefinedTerm('');
    }
  };

  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Two containers with equal size */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left panel - Automate More Inputs */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-medium mb-4">Automate More Inputs</h3>
          <p className="text-gray-600 mb-6">
            The system currently automates these input categories. Add more if needed.
          </p>
          
          {/* Current automated inputs */}
          <div className="border rounded-md overflow-hidden mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Input Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Template Variable
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {automatedInputs.map((input, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {input.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                      {input.template}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Add new input form */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-700">Add New Input to Automate</h4>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Input Category</label>
                <input
                  type="text"
                  placeholder="e.g., 'State of Incorporation'"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={newInputCategory}
                  onChange={(e) => setNewInputCategory(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Template Variable (without {{ }})</label>
                <input
                  type="text"
                  placeholder="e.g., 'StateOfIncorporation'"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={newInputTemplate}
                  onChange={(e) => setNewInputTemplate(e.target.value)}
                />
              </div>
              <button 
                className="p-2 bg-teal text-white rounded-md hover:bg-teal/90 transition-colors"
                onClick={handleAddAutomatedInput}
                disabled={!newInputCategory || !newInputTemplate}
              >
                Add New Input
              </button>
            </div>
          </div>
        </div>

        {/* Right panel - Change Defined Terms */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-medium mb-4">Change Defined Terms</h3>
          <p className="text-gray-600 mb-6">
            Customize how defined terms in the document are converted to template variables.
          </p>
          
          {/* Defined terms list */}
          <div className="border rounded-md overflow-hidden mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Defined Term
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    New Variable Name
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {definedTerms.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="px-6 py-4 text-center text-sm text-gray-500">
                      No defined term changes added yet
                    </td>
                  </tr>
                ) : (
                  definedTerms.map((term, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        "{term.current}"
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                        {`{{${term.replacement}}}`}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Add new defined term form */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-700">Add Defined Term Change</h4>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Defined Term (without quotes)</label>
                <input
                  type="text"
                  placeholder="e.g., 'Authorized Buyer'"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={currentDefinedTerm}
                  onChange={(e) => setCurrentDefinedTerm(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Variable Name (without {{ }})</label>
                <input
                  type="text"
                  placeholder="e.g., 'CustomerDefinedTerm'"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={newDefinedTerm}
                  onChange={(e) => setNewDefinedTerm(e.target.value)}
                />
              </div>
              <button 
                className="p-2 bg-teal text-white rounded-md hover:bg-teal/90 transition-colors"
                onClick={handleAddDefinedTerm}
                disabled={!currentDefinedTerm || !newDefinedTerm}
              >
                Add Defined Term Change
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DualPanelContainer;
