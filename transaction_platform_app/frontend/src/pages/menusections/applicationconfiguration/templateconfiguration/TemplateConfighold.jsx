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
      setIsLoading(true);
      setError(null);
      try {
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
        if (data.template) {
          setTemplate(data.template);
        } else {
          setError('Template content not found in response');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    if (programClass && templateFoundation) {
      loadTemplate();
    }
  }, [programClass, templateFoundation]);

  const handleProcessTemplate = async () => {
    if (!customerConstants.platformName) {
      setError('Common company name is required');
      return;
    }

    setIsProcessing(true);
    try {
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
            customerSignatureBlock: customerConstants.customerName.toUpperCase() // Add uppercase version
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
      setProcessSuccess(true);
      setTimeout(() => setProcessSuccess(false), 3000);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewFinal = async () => {
    setIsViewingFinal(true);
    // TODO: Add PDF preview logic here
    setTimeout(() => setIsViewingFinal(false), 3000);
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Information */}
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
                  onChange={(e) => setCustomerConstants(prev => ({
                    ...prev,
                    platformName: e.target.value
                  }))}
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
                  onChange={(e) => setCustomerConstants(prev => ({
                    ...prev,
                    customerName: e.target.value
                  }))}
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
                  onChange={(e) => setCustomerConstants(prev => ({
                    ...prev,
                    customerAddress: e.target.value
                  }))}
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
                  onChange={(e) => setCustomerConstants(prev => ({
                    ...prev,
                    governingLaw: e.target.value
                  }))}
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

        {/* Template Preview */}
        <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-gray-100">
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
                    disabled={isViewingFinal}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg 
                      hover:bg-gray-200 transition-colors
                      flex items-center gap-2"
                  >
                    <FileSearch className="w-4 h-4" />
                    View Final Template
                  </button>
                </div>
                <div className="prose max-w-none">
                  <ReactQuill
                    value={template}
                    readOnly={true}
                    modules={modules}
                    className="h-[500px] overflow-y-auto quill-template-preview"
                    theme="snow"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// CSS for preview only
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

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default TemplateConfig;
