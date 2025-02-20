import React, { useState } from 'react';
import { PlusCircle, Trash2, AlertCircle } from 'lucide-react';

const AutomateDealConstants = () => {
  // Standard variables state
  const [standardVariables, setStandardVariables] = useState({
    effectiveDate: true,
    company: true,
    supplier: true
  });

  // Custom variables state (up to 3)
  const [customVariables, setCustomVariables] = useState([
    // { value: '' }
  ]);

  // Handle standard variable toggles
  const handleStandardToggle = (variable) => {
    setStandardVariables(prev => ({
      ...prev,
      [variable]: !prev[variable]
    }));
  };

  // Add new custom variable pair
  const handleAddCustomVariable = () => {
    if (customVariables.length < 3) {
      setCustomVariables(prev => [...prev, { value: '' }]);
    }
  };

  // Update custom variable
  const handleCustomVariableChange = (index, field, value) => {
    const updated = customVariables.map((variable, i) => {
      if (i === index) {
        return { ...variable, [field]: value };
      }
      return variable;
    });
    setCustomVariables(updated);
  };

  // Remove custom variable
  const handleRemoveCustomVariable = (index) => {
    setCustomVariables(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Standard Variables Section */}
      <div>
        <h4 className="font-medium mb-4">Standard Variables</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Effective Date</p>
              <p className="text-sm text-gray-500">Convert "_______" to &#123;&#123;EffectiveDate&#125;&#125;</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={standardVariables.effectiveDate}
                onChange={() => handleStandardToggle('effectiveDate')}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Company Name</p>
              <p className="text-sm text-gray-500">Convert customer name placeholders to &#123;&#123;Company&#125;&#125;</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={standardVariables.company}
                onChange={() => handleStandardToggle('company')}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Supplier Name</p>
              <p className="text-sm text-gray-500">Convert supplier placeholders to &#123;&#123;Supplier&#125;&#125;</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={standardVariables.supplier}
                onChange={() => handleStandardToggle('supplier')}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Custom Variables Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium">Custom Variables</h4>
          {customVariables.length < 3 && (
            <button
              onClick={handleAddCustomVariable}
              className="flex items-center gap-2 text-teal hover:text-teal/80 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Add Variable
            </button>
          )}
        </div>

        {customVariables.length === 0 ? (
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Add up to three custom variables</p>
          </div>
        ) : (
          <div className="space-y-4">
            {customVariables.map((variable, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Enter template placeholder blank to convert (e.g. 'Customer Address: _______')"
                    value={variable.value}
                    onChange={(e) => handleCustomVariableChange(index, 'value', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <button
                  onClick={() => handleRemoveCustomVariable(index)}
                  className="text-red-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
        <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
        <div className="text-sm text-blue-700">
          <p className="font-medium mb-1">How this works:</p>
          <p className="mb-2">Standard Variables will automatically detect and convert common fields in your template:</p>
          <ul className="list-disc ml-4 mb-2">
            <li>Effective Date converts underscores ("_______") to &#123;&#123;EffectiveDate&#125;&#125;</li>
            <li>Company Name converts customer placeholders to &#123;&#123;Company&#125;&#125;</li>
            <li>Supplier Name converts supplier references to &#123;&#123;Supplier&#125;&#125;</li>
          </ul>
          <p className="mb-2">Custom Variables let you automate other common fields like:</p>
          <ul className="list-disc ml-4">
            <li>Customer Address: _______ → &#123;&#123;CustomerAddress&#125;&#125;</li>
            <li>Project Name: _______ → &#123;&#123;ProjectName&#125;&#125;</li>
            <li>Contract Value: _______ → &#123;&#123;ContractValue&#125;&#125;</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AutomateDealConstants;
