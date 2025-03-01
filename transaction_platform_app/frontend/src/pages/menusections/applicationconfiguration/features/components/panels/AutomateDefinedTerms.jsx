import React, { useState } from 'react';
import { PlusCircle, Trash2, AlertCircle } from 'lucide-react';

const AutomateDefinedTerms = () => {
  // State for defined term replacements
  const [definedTerms, setDefinedTerms] = useState([
    // { original: '', replacement: '' }
  ]);

  // Add new term replacement pair
  const handleAddTermPair = () => {
    setDefinedTerms(prev => [...prev, { original: '', replacement: '' }]);
  };

  // Update term pair
  const handleTermChange = (index, field, value) => {
    const updated = definedTerms.map((term, i) => {
      if (i === index) {
        return { ...term, [field]: value };
      }
      return term;
    });
    setDefinedTerms(updated);
  };

  // Remove term pair
  const handleRemoveTermPair = (index) => {
    setDefinedTerms(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Term Pairs Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium">Define Term Replacements</h4>
          <button
            onClick={handleAddTermPair}
            className="flex items-center gap-2 text-teal hover:text-teal/80 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Add Term Pair
          </button>
        </div>

        {definedTerms.length === 0 ? (
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Add defined terms to replace in your template</p>
          </div>
        ) : (
          <div className="space-y-4">
            {definedTerms.map((term, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder='Original term (e.g. "Program Support Order")'
                    value={term.original}
                    onChange={(e) => handleTermChange(index, 'original', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder='Replacement term (e.g. "Service Order")'
                    value={term.replacement}
                    onChange={(e) => handleTermChange(index, 'replacement', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <button
                  onClick={() => handleRemoveTermPair(index)}
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
          <p className="mb-2">Define pairs of terms to replace throughout your template:</p>
          <ul className="list-disc ml-4">
            <li className="mb-2">Enter the original defined term exactly as it appears in your template, including any quotation marks or formatting</li>
            <li className="mb-2">Enter the replacement term as you want it to appear in the final document</li>
            <li>Example: Replace <span className="font-mono">"Program Order"</span> with <span className="font-mono">"Service Order"</span></li>
          </ul>
          <p className="mt-2 text-sm">The automation will maintain capitalization and formatting while replacing all instances of the term.</p>
        </div>
      </div>
    </div>
  );
};

export default AutomateDefinedTerms;
