import React, { useState, useEffect } from 'react';
import { Loader2, PackageCheck, Download, Send, CheckCircle, AlertCircle } from 'lucide-react';
import * as mammoth from 'mammoth';

const DealBuildProcess = ({
  templates,
  buildStatus,
  buildLog = [],
  dealPackageData
}) => {
  const [templateContent, setTemplateContent] = useState(null);
  const [loadingContent, setLoadingContent] = useState(false);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    const loadTemplateContent = async () => {
      // Log what we received
      console.log('📦 DealBuildProcess received:', {
        templates,
        buildStatus,
        dealPackageData
      });
      
      const templateToUse = Array.isArray(templates) ? templates[0] : templates;
      console.log('🎯 Template to use:', templateToUse);
      
      if (!templateToUse?.templatePath) {
        console.log('❌ No template path found in:', templateToUse);
        return;
      }
      
      console.log('🔍 Found template path:', templateToUse.templatePath);
      
      setLoadingContent(true);
      setLoadError(null);
      
      try {
        console.log('📤 Sending fetch request with path:', templateToUse.templatePath);
        
        const response = await fetch('/api/fetch-template', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            templatePath: templateToUse.templatePath
          })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📥 Received response:', data);
        
        // Decode base64 content
        const binaryString = atob(data.content);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        // Convert to HTML using mammoth
        console.log('🔄 Converting DOCX to HTML...');
        const result = await mammoth.convertToHtml({ arrayBuffer: bytes.buffer });
        setTemplateContent(result.value);
        console.log('✅ Template conversion complete');
        
      } catch (error) {
        console.error('❌ Error loading template:', error);
        setLoadError(`Failed to load template: ${error.message}`);
      } finally {
        setLoadingContent(false);
      }
    };

    loadTemplateContent();
  }, [templates]);

  return (
    <div className="grid grid-cols-4 gap-6">
      {/* Controls Panel */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-teal text-white px-4 py-2 text-sm font-medium">
          Build Controls
        </div>
        <div className="p-4">
          <div className="space-y-3">
            <button
              className="w-full px-4 py-2 rounded-lg bg-teal text-white hover:bg-teal/90 transition-colors flex items-center justify-center gap-2"
              disabled={buildStatus === 'preparing'}
            >
              {buildStatus === 'preparing' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <PackageCheck className="w-4 h-4" />
              )}
              Build Package
            </button>

            <button
              className="w-full px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </button>

            <button
              className="w-full px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send
            </button>

            <button
              className="w-full px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Finish
            </button>
          </div>

          {/* Build Status Log */}
          {buildLog.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Build Log</h4>
              <div className="text-sm text-gray-500 space-y-1">
                {buildLog.map((log, index) => (
                  <p key={index}>{log}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Window */}
      <div className="col-span-3 border rounded-lg overflow-hidden">
        <div className="bg-teal text-white px-4 py-2 text-sm font-medium">
          Deal Package Preview
        </div>
        <div className="p-4">
          <div className="bg-white rounded-lg p-4 h-96 overflow-auto">
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
              <div 
                className="docx-content"
                dangerouslySetInnerHTML={{ __html: templateContent }}
              />
            ) : (
              <p className="text-center text-gray-500">
                No template content available
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealBuildProcess;
