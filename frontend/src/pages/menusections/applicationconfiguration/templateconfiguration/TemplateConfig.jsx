/**
 * Template Configuration Component
 * ===============================
 * 
 * Debug Prefixes:
 * 🔍 - General debugging/inspection logs
 * 📄 - Document and file operations
 * 🔁 - State changes and updates
 * 🌐 - API calls and network operations
 * ❌ - Errors and failures
 * ✅ - Success confirmations
 * 📁 - Path and directory operations
 * 
 * Debug Categories:
 * - State Management: Track all state changes and updates
 * - File Operations: Monitor template and PDF handling
 * - API Interactions: Log all network calls and responses
 * - Path Management: Track file paths and directory operations
 * - Error Handling: Detailed error tracking and reporting
 * - PDF Conversion: Monitor conversion process and status
 */

import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { 
  Save,
  FileText, 
  Settings,
  Eye,
  CheckCircle,
  Loader,
  FileSearch
} from 'lucide-react';

import PanelHeader from '../../../../components/shared/common/PanelHeader';
import Tooltip from '../../../../components/shared/common/Tooltip';

const TemplateConfig = ({ 
  programGroup, 
  templateFoundation, 
  programClass 
}) => {
  console.log('🔍 Initializing TemplateConfig with:', { programGroup, templateFoundation, programClass });

  // State Management
  const [template, setTemplate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [customerConstants, setCustomerConstants] = useState({
    platformName: '',     // Common name for directory structure
    customerName: '',     // Maps to [Customer] and [CUSTOMERSIGNATUREBLOCK]
    customerAddress: '',  // Maps to [Customer Address]
    governingLaw: ''     // Maps to [Governing Law]
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [processSuccess, setProcessSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [isViewingFinal, setIsViewingFinal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [savedDocxPath, setSavedDocxPath] = useState(null);

  // Debug state changes
  useEffect(() => {
    console.log('🔁 Customer Constants Updated:', customerConstants);
  }, [customerConstants]);

  useEffect(() => {
    console.log('🔁 Processing State:', { isProcessing, processSuccess });
  }, [isProcessing, processSuccess]);

  useEffect(() => {
    if (error) console.log('❌ Error State Updated:', error);
  }, [error]);

  useEffect(() => {
    if (savedDocxPath) console.log('📁 DOCX Path Updated:', savedDocxPath);
  }, [savedDocxPath]);

  useEffect(() => {
    if (pdfUrl) console.log('📁 PDF URL Updated:', pdfUrl);
  }, [pdfUrl]);

  // Quill configuration - read only
  const modules = {
    toolbar: false,
    clipboard: {
      matchVisual: false
    }
  };

  // Load template for preview
  useEffect(() => {
    const loadTemplate = async () => {
      console.log('🔍 Starting template load for:', { programClass, templateFoundation });
      setIsLoading(true);
      setError(null);

      try {
        console.log('🌐 Fetching template...');
        const response = await fetch(
          `http://localhost:5000/api/housetemplates/${programClass}?foundation=${templateFoundation}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );
        
        if (!response.ok) {
          throw new Error('Failed to load template');
        }
        
        const data = await response.json();
        console.log('✅ Template data received:', { dataSize: JSON.stringify(data).length });

        if (data.template) {
          console.log('📄 Setting template content');
          setTemplate(data.template);
        } else {
          throw new Error('Template content not found in response');
        }
      } catch (error) {
        console.log('❌ Template load error:', error);
        setError(error.message);
      } finally {
        console.log('🔍 Completing template load');
        setIsLoading(false);
      }
    };
  
    if (programClass && templateFoundation) {
      loadTemplate();
    }
  }, [programClass, templateFoundation]);

  const handleProcessTemplate = async () => {
    console.log('🔍 Starting template processing');

    if (!customerConstants.platformName) {
      console.log('❌ Validation failed: platformName required');
      setError('Common company name is required');
      return;
    }

    setIsProcessing(true);
    try {
      console.log('🌐 Sending template processing request:', { 
        programGroup, 
        programClass, 
        customerConstants 
      });

      const response = await fetch('http://localhost:5000/api/housetemplates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          programGroup,
          programClass,
          customerConstants: {
            ...customerConstants,
            customerSignatureBlock: customerConstants.customerName.toUpperCase()
          },
          metadata: {
            foundation: templateFoundation,
            createdAt: new Date().toISOString()
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to process template');
      }
      
      const result = await response.json();
      console.log('✅ Template processing successful:', result);

      // Store the path from the response
      console.log('📁 Saving DOCX path:', result.saved_path);
      setSavedDocxPath(result.saved_path);
      
      setProcessSuccess(true);
      setTimeout(() => {
        console.log('🔁 Resetting success state');
        setProcessSuccess(false);
      }, 3000);
    } catch (error) {
      console.log('❌ Template processing error:', error);
      setError(error.message);
    } finally {
      console.log('🔍 Completing template processing');
      setIsProcessing(false);
    }
  };

  const handleViewFinal = async () => {
    console.log('🔍 Starting PDF conversion');
    setIsViewingFinal(true);
    try {
      // First, convert the DOCX to PDF
      console.log('🌐 Requesting PDF conversion:', { docx_path: savedDocxPath });
      const convertResponse = await fetch('http://localhost:5000/api/housetemplates/convert-to-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          docx_path: savedDocxPath
        })
      });
      
      if (!convertResponse.ok) {
        throw new Error('Failed to convert to PDF');
      }
      
      const convertResult = await convertResponse.json();
      console.log('✅ PDF conversion successful:', convertResult);
      
      // Now get the PDF
      // Extract just the filename without the path
      const pdfFilename = convertResult.pdf_path.split(/[/\\]/).pop();
      console.log('📁 Requesting PDF file:', pdfFilename);

      const pdfResponse = await fetch(
        `http://localhost:5000/api/housetemplates/pdf/${customerConstants.platformName}/${pdfFilename}`,
        {
          method: 'GET',
        }
      );
      
      if (!pdfResponse.ok) {
        throw new Error('Failed to get PDF');
      }
      
      const blob = await pdfResponse.blob();
      const url = URL.createObjectURL(blob);
      console.log('✅ PDF blob created:', { size: blob.size });
      setPdfUrl(url);
    } catch (error) {
      console.log('❌ PDF conversion error:', error);
      setError(error.message);
    } finally {
      console.log('🔍 Completing PDF conversion');
      setIsViewingFinal(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-8 h-8 text-teal" />
          <h1 className="text-2xl font-bold text-gray-800">
            Configure Template Variables
          </h1>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Customer Information - 1/3 width */}
        <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-gray-100">
          <PanelHeader 
            title="Customer Information" 
            isActive={true}
            icon={FileText}
          />
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              {/* Common Name */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Common Company Name *
                </label>
                <input
                  type="text"
                  value={customerConstants.platformName}
                  onChange={(e) => {
                    console.log('🔁 Updating platformName:', e.target.value);
                    setCustomerConstants(prev => ({
                      ...prev,
                      platformName: e.target.value
                    }));
                  }}
                  className="w-full p-2 border border-gray-200 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-teal/50"
                  placeholder="Enter common company name (e.g., 3M, NBC, GE)"
                  required
                />
              </div>

              {/* Legal Name */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Customer Legal Name
                </label>
                <input
                  type="text"
                  value={customerConstants.customerName}
                  onChange={(e) => {
                    console.log('🔁 Updating customerName:', e.target.value);
                    setCustomerConstants(prev => ({
                      ...prev,
                      customerName: e.target.value
                    }));
                  }}
                  className="w-full p-2 border border-gray-200 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-teal/50"
                  placeholder="Enter full legal company name"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Will replace [Customer] and [CUSTOMERSIGNATUREBLOCK] in template
                </p>
              </div>

              {/* Customer Address */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Customer Address
                </label>
                <textarea
                  value={customerConstants.customerAddress}
                  onChange={(e) => {
                    console.log('🔁 Updating customerAddress:', e.target.value);
                    setCustomerConstants(prev => ({
                      ...prev,
                      customerAddress: e.target.value
                    }));
                  }}
                  className="w-full p-2 border border-gray-200 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-teal/50"
                  rows={3}
                  placeholder="Enter customer's legal address in inline format"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Will replace [Customer Address] in template
                </p>
              </div>

              {/* Governing Law */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Governing Law
                </label>
                <input
                  type="text"
                  value={customerConstants.governingLaw}
                  onChange={(e) => {
                    console.log('🔁 Updating governingLaw:', e.target.value);
                    setCustomerConstants(prev => ({
                      ...prev,
                      governingLaw: e.target.value
                    }));
                  }}
                  className="w-full p-2 border border-gray-200 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-teal/50"
                  placeholder="Enter preferred state for governing law"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Will replace [Governing Law] in template
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  onClick={handleProcessTemplate}
                  disabled={isProcessing || !customerConstants.platformName}
                  className="w-full px-6 py-3 bg-teal text-white rounded-lg 
                    hover:bg-teal/90 transition-colors
                    flex items-center justify-center gap-2
                    disabled:bg-gray-200 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5" />
                      Generate Template
                    </>
                  )}
                </button>
                {processSuccess && (
                  <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Template generated successfully
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Template Preview - 2/3 width */}
        <div className="col-span-2 flex flex-col h-full bg-white rounded-xl shadow-lg border border-gray-100">
          <PanelHeader 
            title="Template Preview" 
            isActive={true}
            icon={Eye}
          />
          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="w-6 h-6 text-teal animate-spin" />
                <span className="ml-2 text-gray-600">Loading template...</span>
              </div>
            ) : (
              <>
                <div className="flex justify-end mb-4">
                  <button
                    onClick={handleViewFinal}
                    disabled={isViewingFinal || !savedDocxPath}
                    className="px-4 py-2 bg-teal text-white rounded-lg 
                    hover:bg-teal/90 transition-colors
                    flex items-center gap-2
                    disabled:bg-gray-200 disabled:cursor-not-allowed"
                >
                  {isViewingFinal ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <FileSearch className="w-4 h-4" />
                  )}
                  View Final Template
                </button>
              </div>
              <div className="prose max-w-none h-[600px]">
                {pdfUrl ? (
                  <iframe 
                    src={pdfUrl}
                    className="w-full h-full border-0"
                    title="Template PDF Preview"
                  />
                ) : (
                  <ReactQuill
                    value={template}
                    readOnly={true}
                    modules={modules}
                    className="h-full overflow-y-auto quill-template-preview"
                    theme="snow"
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  </div>
);
};

// CSS for preview styling
const styles = `
.quill-template-preview {
.ql-container {
  font-size: 14px;
  font-family: system-ui, -apple-system, sans-serif;
}

.ql-editor {
  padding: 20px;
  min-height: 500px;
  background: white;
}

.ql-toolbar {
  display: none;
}

p {
  margin-bottom: 1em;
}
}
`;

// Add styles to document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);



export default TemplateConfig;           
                    