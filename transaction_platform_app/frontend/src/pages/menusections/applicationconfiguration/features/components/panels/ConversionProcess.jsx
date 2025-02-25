import React, { useState, useEffect } from 'react';
import { 
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowRight
} from 'lucide-react';
import * as mammoth from 'mammoth';
import BuildDealPackage from '../panels/BuildDealPackage';  // adjust path as needed

const ConversionProcess = ({ 
  template,
  conversionStatus: initialConversionStatus,
  conversionLog: initialConversionLog,
  errorMessage: initialErrorMessage,
  onStartConversion: parentOnStartConversion,
  onComplete,
  onBuildDealPackage
  
}) => {
  // State for template content display
  const [templateContent, setTemplateContent] = useState(null);
  const [loadingContent, setLoadingContent] = useState(false);
  const [loadError, setLoadError] = useState(null);
  
  // Local state for conversion status tracking
  const [conversionStatus, setConversionStatus] = useState(initialConversionStatus || 'idle');
  const [conversionLog, setConversionLog] = useState(initialConversionLog || []);
  const [errorMessage, setErrorMessage] = useState(initialErrorMessage || '');
  const [jobId, setJobId] = useState(null);
  const [outputFile, setOutputFile] = useState(null);
  const [statusCheckInterval, setStatusCheckInterval] = useState(null);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }
    };
  }, [statusCheckInterval]);
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
        const relativePath = template.sourceTemplatePath;
        const response = await fetch(`/api/templateforms/${relativePath}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Handle different file types appropriately
        const isDocx = relativePath.toLowerCase().endsWith('.docx');
        
        if (isDocx) {
          // Step 1: Decode the base64 string to binary
          const binaryString = atob(data.content);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          
          // Step 2: Convert the DOCX binary to HTML using mammoth.js
          const result = await mammoth.convertToHtml({ arrayBuffer: bytes.buffer });
          
          // Store the HTML content (not the binary)
          setTemplateContent({
            type: 'docx',
            html: result.value
          });
        } else {
          // For text files, just decode if needed
          if (data.content && typeof data.content === 'string' && 
              data.content.match(/^[A-Za-z0-9+/=]+$/)) {
            // Looks like base64, decode it
            setTemplateContent({
              type: 'text',
              content: atob(data.content)
            });
          } else {
            // Not base64 or already decoded
            setTemplateContent({
              type: 'text',
              content: data.content
            });
          }
        }
      } catch (error) {
        console.error('Error loading template:', error);
        setLoadError(`Failed to load template content: ${error.message}`);
      } finally {
        setLoadingContent(false);
      }
    };
  
    loadTemplateContent();
  }, [template]);

  // Handle starting the conversion process
  const handleStartConversion = async () => {
    setConversionStatus('converting');
    setConversionLog(prev => [...prev, "Starting conversion process..."]);
    
    try {
        const response = await fetch('/api/convert_template', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                template: template
            })
        });

        const result = await response.json();
        
        if (!result.success) {
            throw new Error(result.error || 'Conversion failed');
        }

        // Update status and log
        setConversionLog(prev => [...prev, "Conversion completed successfully"]);
        setConversionStatus('success');
        setOutputFile(result.path);
        console.log("Converted file path:", result.path);

        // Fetch and display the converted file
        try {
            setLoadingContent(true);
            const fileResponse = await fetch(`/api/files/view?path=${encodeURIComponent(result.path)}`);
            
            if (!fileResponse.ok) {
                throw new Error(`Failed to load converted file: ${fileResponse.statusText}`);
            }

            const fileData = await fileResponse.json();

            // Update the template window with the converted content
            setTemplateContent({
                type: 'text',
                content: fileData.content
            });

            setConversionLog(prev => [...prev, "Converted file loaded in preview"]);
        } catch (loadError) {
            console.error("Error loading converted file:", loadError);
            setConversionLog(prev => [...prev, "Warning: Could not load converted file preview"]);
        } finally {
            setLoadingContent(false);
        }

    } catch (error) {
        console.error("Conversion error:", error);
        setErrorMessage(error.message);
        setConversionStatus('error');
    }
};

  // Check the status of an ongoing conversion
  const checkConversionStatus = async (jid) => {
    try {
      const response = await fetch(`/api/conversion_status/${jid}`);
      
      if (!response.ok) {
        // If we get a 404, the job might not be ready yet
        if (response.status === 404) {
        
          return;
        }
        
        throw new Error(`Error checking status: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to retrieve status');
      }
      
      // Update log with any new messages
      if (data.log && data.log.length > 0) {
        // Get the current log length
        const currentLogLength = conversionLog.length;
        
        // Add only new log entries
        if (data.log.length > currentLogLength) {
          const newEntries = data.log.slice(currentLogLength);
          newEntries.forEach(entry => {
            
          });
        }
      }
      
      // Update status if changed
      if (data.status !== conversionStatus && data.status !== 'unknown') {
        setConversionStatus(data.status);
        
        // Handle completed states
        if (data.status === 'success') {
          setOutputFile(data.output_file);
          clearInterval(statusCheckInterval);
          setStatusCheckInterval(null);
        } else if (data.status === 'error') {
          setErrorMessage(data.message || 'An error occurred during conversion');
          clearInterval(statusCheckInterval);
          setStatusCheckInterval(null);
        }
      }
      
    } catch (error) {
      console.error('Error checking conversion status:', error);
    
    }
  };

  // Handle showing the output file
  const handleShowFile = () => {
    if (outputFile) {
      // Open the file in a new window/tab
      window.open(`/api/files/view?path=${encodeURIComponent(outputFile)}`, '_blank');
    }
  };

  return (
    <div className="pt-0 px-6 pb-6">
      <h3 className="text-lg font-medium mb-4 text-teal"></h3>
      
      <div className="grid grid-cols-4 gap-6">
        {/* Controls Panel - takes up 1/4 of the space */}
        <div className="border rounded-lg overflow-hidden">
          <h4 className="font-medium px-4 py-2 bg-teal text-white">Controls</h4>
          <div className="p-4 space-y-4">
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
                    style={{ width: `${(conversionLog.length / 10) * 100}%` }}
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
                onClick={handleStartConversion}
                disabled={conversionStatus === 'converting' || !template}
                className={`w-full px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2
                  ${conversionStatus === 'converting' || !template
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-teal text-white hover:bg-teal/90'}`}
              >
                Launch Conversion
              </button>

              <button
                onClick={handleShowFile}
                disabled={conversionStatus !== 'success' || !outputFile}
                className={`w-full px-4 py-2 rounded-lg transition-colors
                  ${conversionStatus !== 'success' || !outputFile
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
                Continue to Customer Customization
                <ArrowRight className="w-4 h-4" />
              </button>



               <button
                onClick={onBuildDealPackage}
                className="w-full px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 bg-royalBlue text-white hover:bg-teal/90"
                >
                Build Deal Package
                <ArrowRight className="w-4 h-4" />
                </button>


            </div>

            {/* Logs Panel */}
            {conversionLog.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Conversion Log</p>
                <div className="bg-gray-100 rounded-lg p-3 text-sm font-mono max-h-48 overflow-y-auto">
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
        <div className="col-span-3 border rounded-lg overflow-hidden">
          <h4 className="font-medium px-4 py-2 bg-teal text-white">Template Window</h4>
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
                templateContent.type === 'docx' ? (
                  <div 
                    className="docx-content" 
                    dangerouslySetInnerHTML={{ __html: templateContent.html }}
                  />
                ) : (
                  <pre className="whitespace-pre-wrap font-mono text-sm">
                    {templateContent.content}
                  </pre>
                )
              ) : (
                <p className="text-gray-400 text-center mt-40">
                  {template ? 'No content available' : 'Select a template to begin'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversionProcess; 
