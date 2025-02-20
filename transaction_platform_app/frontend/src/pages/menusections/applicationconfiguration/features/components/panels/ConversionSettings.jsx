import React from 'react';

const ConversionSettings = ({ conversionSettings, onSettingChange }) => {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Preserve Document Formatting</p>
          <p className="text-sm text-gray-500">Maintain original styling during conversion</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox"
            className="sr-only peer"
            checked={conversionSettings.preserveFormatting}
            onChange={() => onSettingChange('preserveFormatting')}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal" />
        </label>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Auto-Detect Variables</p>
          <p className="text-sm text-gray-500">Automatically identify variable placeholders</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox"
            className="sr-only peer"
            checked={conversionSettings.detectVariables}
            onChange={() => onSettingChange('detectVariables')}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal" />
        </label>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Enable Loop Support</p>
          <p className="text-sm text-gray-500">Convert repeating sections to Jinja2 loops</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox"
            className="sr-only peer"
            checked={conversionSettings.enableLoopSupport}
            onChange={() => onSettingChange('enableLoopSupport')}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal" />
        </label>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">Enable Conditionals</p>
          <p className="text-sm text-gray-500">Convert conditional text to Jinja2 if statements</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox"
            className="sr-only peer"
            checked={conversionSettings.enableConditionals}
            onChange={() => onSettingChange('enableConditionals')}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal" />
        </label>
      </div>
    </div>
  );
};

export default ConversionSettings;
