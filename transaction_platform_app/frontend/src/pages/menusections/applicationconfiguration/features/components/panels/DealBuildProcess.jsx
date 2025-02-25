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
  const [processedContent, setProcessedContent] = useState(null);

  // Load initial template content
  useEffect(() => {
    const loadTemplateContent = async () => {
      // Handle both array and single object cases
      const templateToUse = Array.isArray(templates) ? templates[0] : templates;
      
      if (!templateToUse) {
        console.log('📋 No template available:', templates);
        return;
      }
      
      if (!templateToUse.templatePath) {
        console.log('📋 No template path found:', templateToUse);
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
        console.log('📥 Received template data');
        
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
        console.log('✅ Template loaded and converted');
        
      } catch (error) {
        console.error('❌ Error loading template:', error);
        setLoadError(`Failed to load template: ${error.message}`);
      } finally {
        setLoadingContent(false);
      }
    };

    loadTemplateContent();
  }, [templates]);

  // Handle building the package with substitutions 
  const handleBuildPackage = async () => {
    if (!dealPackageData?.template?.templatePath || !dealPackageData?.templateSubstitutions) {
      console.error('❌ Missing template path or substitutions:', dealPackageData);
      return;
    }
  
    setLoadingContent(true);
    try {
      // Log full dealPackageData
      console.log('📦 Full deal package data:', dealPackageData);
      
      // Create the request payload
      const payload = {
        templatePath: dealPackageData.template.templatePath,
        substitutions: dealPackageData.templateSubstitutions
      };
      
      // Log the exact payload being sent
      console.log('📤 Sending payload to /api/process-template:', payload);
      console.log('📤 Stringified payload:', JSON.stringify(payload, null, 2));
  
      const response = await fetch('/api/process-template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
  
      // Log response details
      console.log('📥 Response status:', response.status);
      const responseText = await response.text();
      console.log('📥 Response text:', responseText);
  
      if (!response.ok) {
        throw new Error(`Failed to process template: ${response.status} ${responseText}`);
      }
  
      const result = JSON.parse(responseText);
      console.log('📥 Received processed template');
        
      // Convert to HTML using mammoth
      const binaryString = atob(result.document.content);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
  
      const converted = await mammoth.convertToHtml({ arrayBuffer: bytes.buffer });
      setProcessedContent(converted.value);
      console.log('✅ Template processed successfully');
  
    } catch (error) {
      console.error('❌ Error processing template:', error);
      setLoadError(`Failed to process template: ${error.message}`);
    } finally {
      setLoadingContent(false);
    }
  };

  // Handle downloading the document
  const handleDownload = () => {
    // TODO: Implement download functionality
    console.log('📥 Download requested');
  };

  // Handle sending the document
  const handleSend = () => {
    // TODO: Implement send functionality
    console.log('📤 Send requested');
  };

  // Handle finish action
  const handleFinish = () => {
    // TODO: Implement finish functionality
    console.log('✅ Finish requested');
  };

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
              disabled={loadingContent}
              onClick={handleBuildPackage}
            >
              {loadingContent ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <PackageCheck className="w-4 h-4" />
              )}
              Build Package
            </button>

            <button
              className="w-full px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              onClick={handleDownload}
              disabled={!processedContent}
            >
              <Download className="w-4 h-4" />
              Download
            </button>

            <button
              className="w-full px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              onClick={handleSend}
              disabled={!processedContent}
            >
              <Send className="w-4 h-4" />
              Send
            </button>

            <button
              className="w-full px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              onClick={handleFinish}
              disabled={!processedContent}
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
                <p className="text-gray-500">
                  {processedContent ? 'Processing template...' : 'Loading template...'}
                </p>
              </div>
            ) : loadError ? (
              <div className="flex flex-col items-center justify-center h-full text-red-500">
                <AlertCircle className="w-6 h-6 mb-2" />
                <p>{loadError}</p>
              </div>
            ) : processedContent ? (
              <div 
                className="docx-content"
                dangerouslySetInnerHTML={{ __html: processedContent }}
              />
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
