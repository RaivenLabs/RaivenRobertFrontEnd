// src/components/panels/ApplicationArchitecturePanel.jsx
import React, { useState } from 'react';
import { Send, Check, ArrowRight } from 'lucide-react';
import { ENTERPRISE_PATTERNS } from '../../../../config/patterns';
import { STAGES } from '../../../../types';


// Pattern-specific themes
const PATTERN_THEMES = {
  raiven: { bg: 'bg-blue-50/50', border: 'border-blue-200', button: 'bg-blue-100 text-blue-700' },
  vector: { bg: 'bg-purple-50/50', border: 'border-purple-200', button: 'bg-purple-100 text-purple-700' },
  playbook: { bg: 'bg-green-50/50', border: 'border-green-200', button: 'bg-green-100 text-green-700' },
 
 
 
  hawk : { bg: 'bg-amber-50/50', border: 'border-amber-200', button: 'bg-amber-100 text-amber-700' },
  concierge: { bg: 'bg-rose-50/50', border: 'border-rose-200', button: 'bg-rose-100 text-rose-700' },
  atlas: { bg: 'bg-indigo-50/50', border: 'border-indigo-200', button: 'bg-indigo-100 text-indigo-700' },
  guardian: { bg: 'bg-emerald-50/50', border: 'border-emerald-200', button: 'bg-emerald-100 text-emerald-700' }
};

const ApplicationArchitecturePanel = ({ onSubmit }) => {
  const [applicationPurpose, setApplicationPurpose] = useState('');
  const [selectedPattern, setSelectedPattern] = useState(null);

  const handleSubmit = () => {
    if (!applicationPurpose || !selectedPattern) return;

      // Debug log to see what's being passed
      console.log('🔍 Submitting with values:', {
        purpose: applicationPurpose,
        pattern: selectedPattern,
        patternName: selectedPattern?.name,
        patternId: selectedPattern?.id
      });
      
    onSubmit({
      purpose: applicationPurpose,
      pattern: selectedPattern,
      stage: STAGES.SPECIFICATION
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Purpose Input Section */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Application Purpose
        </h3>
        <textarea
          value={applicationPurpose}
          onChange={(e) => setApplicationPurpose(e.target.value)}
          placeholder="Describe the purpose and goals of your application in detail..."
          className="w-full h-32 p-4 border rounded-lg resize-none 
            focus:ring-2 focus:ring-teal focus:border-transparent"
        />
      </div>

      {/* Patterns Selection Section */}
      <div className="flex-1 p-6 overflow-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Select Architecture Pattern
        </h3>
        <div className="space-y-4">
          {Object.values(ENTERPRISE_PATTERNS).map((pattern) => (
            <div 
              key={pattern.id}
              className={`p-4 rounded-lg border transition-all duration-200
                ${selectedPattern?.id === pattern.id 
                  ? `${PATTERN_THEMES[pattern.id].border} ${PATTERN_THEMES[pattern.id].bg}` 
                  : 'border-gray-200 hover:border-gray-300'}
                ${PATTERN_THEMES[pattern.id].bg}`}
            >
              <div className="grid grid-cols-12 gap-4">
                {/* Pattern Name & Purpose */}
                <div className="col-span-2">
                  <h4 className="font-medium text-gray-900">{pattern.name}</h4>
                  <p className="text-sm text-gray-500">{pattern.purpose}</p>
                </div>

                {/* Description */}
                <div className="col-span-4">
                  <p className="text-sm text-gray-600">{pattern.description}</p>
                </div>

                {/* Use Cases */}
                <div className="col-span-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Use Cases:</p>
                  <ul className="text-sm text-gray-600 list-disc pl-4 space-y-1">
                    {pattern.use_cases.slice(0, 3).map((useCase, index) => (
                      <li key={index}>{useCase}</li>
                    ))}
                  </ul>
                </div>

                {/* Selection Button */}
                <div className="col-span-2 flex items-center justify-end">
                  <button
                    onClick={() => setSelectedPattern(pattern)}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 
                      flex items-center gap-2
                      ${selectedPattern?.id === pattern.id
                        ? `${PATTERN_THEMES[pattern.id].button} font-medium`
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
                  >
                    {selectedPattern?.id === pattern.id ? (
                      <>
                        <Check className="w-4 h-4" />
                        Selected
                      </>
                    ) : (
                      'Select'
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Section with dual buttons */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            disabled={!applicationPurpose || !selectedPattern}
            className={`flex-1 px-6 py-3 rounded-xl flex items-center justify-center gap-2
              ${(!applicationPurpose || !selectedPattern)
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'} 
              transition-colors`}
          >
            <Send className="w-5 h-5" />
            Confirm with AIDA
          </button>
          
          <button
            onClick={() => onSubmit({ purpose: applicationPurpose, pattern: selectedPattern })}
            disabled={!applicationPurpose || !selectedPattern}
            className={`flex-1 px-6 py-3 rounded-xl flex items-center justify-center gap-2
              ${(!applicationPurpose || !selectedPattern)
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-teal text-white hover:bg-teal/90'} 
              transition-colors`}
          >
            <ArrowRight className="w-5 h-5" />
            Proceed to Specification
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationArchitecturePanel;
