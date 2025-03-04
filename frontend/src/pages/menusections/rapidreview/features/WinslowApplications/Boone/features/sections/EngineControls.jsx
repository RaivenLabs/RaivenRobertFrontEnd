// src/components/platform/BooneConfiguration/EngineControls.jsx
import React from 'react';
import { 
  Bot, 
  UserCircle, 
  AlertCircle,
  Settings
} from 'lucide-react';

const GenerationModeSelector = ({ generationMode, setGenerationMode }) => {
  return (
    <div className="border-r border-gray-200 pr-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Generation Mode</h3>
      <div className="flex gap-2 mb-3">
        <button 
          className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-md text-sm ${
            generationMode === 'ai' 
              ? 'bg-royalBlue text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setGenerationMode('ai')}
        >
          <Bot className="w-4 h-4" />
          AI Assisted
        </button>
        
        <button 
          className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-md text-sm ${
            generationMode === 'manual' 
              ? 'bg-royalBlue text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setGenerationMode('manual')}
        >
          <UserCircle className="w-4 h-4" />
          Manual
        </button>
      </div>
      
      {/* Note underneath mode selection */}
      <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded-md border border-blue-100">
        <div className="flex items-start">
          <AlertCircle className="w-3 h-3 text-blue-500 mr-1 flex-shrink-0 mt-0.5" />
          <p>{generationMode === 'ai' 
            ? 'AI analyzes documents to identify fields automatically.' 
            : 'Manually define schema structure and fields.'}</p>
        </div>
      </div>
    </div>
  );
};

const ExtractionPrecisionSelector = ({ extractionPrecision, setExtractionPrecision }) => {
  return (
    <div className="border-r border-gray-200 px-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Extraction Precision</h3>
      <div className="flex gap-2">
        <button 
          className={`flex-1 py-2 rounded-md text-sm ${
            extractionPrecision === 'conservative'
              ? 'bg-royalBlue text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setExtractionPrecision('conservative')}
        >
          Conservative
        </button>
        <button 
          className={`flex-1 py-2 rounded-md text-sm ${
            extractionPrecision === 'balanced'
              ? 'bg-royalBlue text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setExtractionPrecision('balanced')}
        >
          Balanced
        </button>
        <button 
          className={`flex-1 py-2 rounded-md text-sm ${
            extractionPrecision === 'aggressive'
              ? 'bg-royalBlue text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setExtractionPrecision('aggressive')}
        >
          Aggressive
        </button>
      </div>
    </div>
  );
};

const AdditionalSettings = ({ detectionStrategy, setDetectionStrategy }) => {
  return (
    <div className="pl-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Additional Settings</h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">Detection Strategy:</span>
          <select 
            className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm w-44"
            value={detectionStrategy}
            onChange={(e) => setDetectionStrategy(e.target.value)}
          >
            <option value="auto">Auto-detect</option>
            <option value="template">Template-based</option>
            <option value="custom">Custom rules</option>
          </select>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">Use Document Context:</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-royalBlue peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
          </label>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">Include Nested Fields:</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-royalBlue peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

const EngineControls = ({ 
  generationMode, 
  setGenerationMode, 
  extractionPrecision, 
  setExtractionPrecision,
  detectionStrategy,
  setDetectionStrategy
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center">
        <Settings className="w-5 h-5 text-royalBlue mr-2" />
        <h2 className="text-lg font-semibold text-gray-800">
          Engine Controls
        </h2>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GenerationModeSelector 
            generationMode={generationMode} 
            setGenerationMode={setGenerationMode} 
          />
          
          <ExtractionPrecisionSelector 
            extractionPrecision={extractionPrecision} 
            setExtractionPrecision={setExtractionPrecision} 
          />
          
          <AdditionalSettings 
            detectionStrategy={detectionStrategy}
            setDetectionStrategy={setDetectionStrategy}
          />
        </div>
      </div>
    </div>
  );
};

export default EngineControls;
