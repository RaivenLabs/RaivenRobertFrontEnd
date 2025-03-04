import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Loader, 
  CheckCircle, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import mammoth from 'mammoth';

const ConversionProcess = ({
  template,
  conversionStatus,
  conversionLog,
  errorMessage,
  onStartConversion,
  onComplete
}) => {
  // States for template content handling
  const [templateContent, setTemplateContent] = useState(null);
  const [loadingContent, setLoadingContent] = useState(false);
  const [loadError, setLoadError] = useState(null);

  // Fetch and process template content
  useEffect(() => {
    const loadTemplateContent = async () => {
      if (!template?.sourceTemplatePath) {
        console.log('No template path available:', template);
        return;
      }

      setLoadingContent(true);
      setLoadError(null);

      try {
        const relativePath = template.sourceTemplatePath;
        console.log('Loading template from:', relativePath);

        const response = await fetch(`/api/templates/${relativePath}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Handle different file types appropriately
        const isDocx = relativePath.toLowerCase().endsWith('.docx');

        if (isDocx) {
          // Process DOCX file
          console.log('Processing DOCX file');
          const binaryString = atob(data.content);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          // Convert DOCX to HTML
          const result = await mammoth.convertToHtml({ arrayBuffer: bytes.buffer });
          console.log('DOCX converted to HTML');

          setTemplateContent({
            type: 'docx',
            html: result.value,
            binary: bytes  // Keep binary for conversion process
          });
        } else {
          // Handle text content
          console.log('Processing text file');
          // Check if content is base64 encoded
          if (data.content && typeof data.content === 'string' &&
              data.content.match(/^[A-Za-z0-9+/=]+$/)) {
            setTemplateContent({
              type: 'text',
              content: atob(data.content)
            });
          } else {
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

  // Render template preview based on content type
  const renderTemplatePreview = () => {
    if (loadingContent) {
      return (
        <div className="flex items-center justify-center p-8">
          <Loader className="w-6 h-6 text-teal animate-spin" />
          <span className="ml-2">Loading template content...</span>
        </div>
      );
    }

    if (loadError) {
      return (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{loadError}</span>
          </div>
        </div>
      );
    }

    if (!templateContent) {
      return (
        <div className="p-4 text-gray-500">
          No template content available
        </div>
      );
    }

    if (templateContent.type === 'docx') {
      return (
        <div 
          className="prose max-w-none p-4"
          dangerouslySetInnerHTML={{ __html: templateContent.html }}
        />
      );
    }

    return (
      <pre className="p-4 whitespace-pre-wrap font-mono text-sm">
        {templateContent.content}
      </pre>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Template Preview Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Template Preview</h3>
        <div className="border rounded-lg overflow-auto max-h-96 bg-white">
          {renderTemplatePreview()}
        </div>
      </div>

      {/* Conversion Status and Controls */}
      <div className="space-y-4">
        {/* Conversion Log */}
        {conversionLog.length > 0 && (
          <div className="space-y-2">
            {conversionLog.map((log, index) => (
              <div 
                key={index}
                className="flex items-center text-sm"
              >
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                {log}
              </div>
            ))}
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            onClick={onStartConversion}
            disabled={loadingContent || conversionStatus === 'converting' || !templateContent}
            className={`
              px-6 py-2 rounded-lg 
              flex items-center gap-2
              transition-colors
              ${loadingContent || conversionStatus === 'converting' || !templateContent
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-teal text-white hover:bg-teal/90'
              }
            `}
          >
            {conversionStatus === 'converting' ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Converting...
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                Start Conversion
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversionProcess;
