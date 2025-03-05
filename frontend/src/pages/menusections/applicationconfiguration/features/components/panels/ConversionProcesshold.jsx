import React, { useState, useEffect } from 'react';
import { 
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowRight
} from 'lucide-react';

const ConversionProcess = ({ 
  template,
  conversionStatus, 
  conversionLog, 
  errorMessage, 
  onStartConversion,
  onComplete 
}) => {
  const [templateContent, setTemplateContent] = useState(null);
  const [loadingContent, setLoadingContent] = useState(false);
  const [loadError, setLoadError] = useState(null);

  // Load template content when component mounts or template changes
  useEffect(() => {
    const loadTemplateContent = async () => {
      if (!template?.sourceTemplatePath) {
        console.log('No template path available:', template);
        return;
      }
      
      setLoadingContent(true);
      setLoadError(null);
      
      try {
        // Extract relative path from the full path
        const relativePath = template.sourceTemplatePath.split('/static/data/')[1];
        const response = await fetch(`/api/templates/${relativePath}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setTemplateContent(data.content);
      } catch (error) {
        console.error('Error loading template:', error);
        setLoadError('Failed to load template content');
      } finally {
        setLoadingContent(false);
      }
    };
  
    loadTemplateContent();
  }, [template]);

  return (
    <div className="p-6">
      <h3 className="text-lg font-medium mb-4 text-teal">Conversion Process</h3>
      
      <div className="grid grid-cols-4 gap-6">
        {/* Controls Panel - takes up 1/4 of the space */}
        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-4">Controls</h4>
          <div className="space-y-4">
            {/* Status Indicator */}
            {conversionStatus === 'converting' && (
              <div className="mb-4">
                <div className="flex items-center gap-2 text-teal mb-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <p className="font-medium">Converting...</p>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal transition-all duration-500 ease-out"
                    style={{ width: `${(conversionLog.length / 7) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {conversionStatus === 'error' && (
              <div className="flex items-center gap-2 text-red-500 mb-4">
                <AlertCircle className="w-5 h-5" />
                <p className="text-sm">{errorMessage}</p>
              </div>
            )}

            {conversionStatus === 'success' && (
              <div className="flex items-center gap-2 text-green-500 mb-4">
                <CheckCircle className="w-5 h-5" />
                <p className="text-sm">Conversion completed successfully!</p>
              </div>
            )}

            {/* Action Buttons Stack */}
            <div className="space-y-3 pt-4">
              <button
                onClick={onStartConversion}
                disabled={conversionStatus === 'converting' || !template}
                className={`w-full px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2
                  ${conversionStatus === 'converting' || !template
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-teal text-white hover:bg-teal/90'}`}
              >
                Launch Conversion
              </button>

              <button
                onClick={() => {/* Add show file handler */}}
                disabled={conversionStatus !== 'success'}
                className={`w-full px-4 py-2 rounded-lg transition-colors
                  ${conversionStatus !== 'success'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'}`}
              >
                Show File
              </button>

              <button
                onClick={() => {/* Add finish handler */}}
                disabled={conversionStatus !== 'success'}
                className={`w-full px-4 py-2 rounded-lg transition-colors
                  ${conversionStatus !== 'success'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-green-500 text-white hover:bg-green-600'}`}
              >
                Finish
              </button>

              <button
                onClick={onComplete}
                disabled={conversionStatus !== 'success'}
                className={`w-full px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2
                  ${conversionStatus !== 'success'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-teal text-white hover:bg-teal/90'}`}
              >
                Continue to Configuration
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Logs Panel */}
            {conversionLog.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Conversion Log</p>
                <div className="bg-gray-50 rounded-lg p-3 text-sm font-mono max-h-48 overflow-y-auto">
                  {conversionLog.map((log, index) => (
                    <div key={index} className="py-1">
                      <span className="text-gray-400">[{new Date().toLocaleTimeString()}]</span> {log}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Template Window - takes up 3/4 of the space */}
        <div className="col-span-3 border rounded-lg p-4">
          <h4 className="font-medium mb-4">Template Window</h4>
          <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-auto">
            {loadingContent ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-teal mb-2" />
                <p className="text-gray-500">Loading template content...</p>
              </div>
            ) : loadError ? (
              <div className="flex flex-col items-center justify-center h-full text-red-500">
                <AlertCircle className="w-6 h-6 mb-2" />
                <p>{loadError}</p>
              </div>
            ) : templateContent ? (
              <pre className="whitespace-pre-wrap font-mono text-sm">
                {templateContent}
              </pre>
            ) : (
              <p className="text-gray-400 text-center mt-40">
                {template ? 'No content available' : 'Select a template to begin'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversionProcess;
