import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Code, 
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  Upload
} from 'lucide-react';

const TemplateConversion = ({
  programGroup,
  agreementType,
  programClass,
  selectedForm,
  templateFoundation,
  setCurrentStage,
  onBack,
  onComplete
}) => {
  const [conversionStatus, setConversionStatus] = useState('idle'); // idle, converting, success, error
  const [conversionSettings, setConversionSettings] = useState({
    preserveFormatting: true,
    detectVariables: true,
    enableLoopSupport: true,
    enableConditionals: true
  });
  const [conversionLog, setConversionLog] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [customVariables, setCustomVariables] = useState([]);

  // Fetch selected form details or handle custom template
  const [formDetails, setFormDetails] = useState({
    id: selectedForm || 'custom',
    name: selectedForm ? "Loading..." : "Custom Template",
    description: selectedForm ? "Loading template details..." : "Upload your custom template file",
    templateType: selectedForm ? "Word Document" : "Unknown",
    lastModified: selectedForm ? "Loading..." : new Date().toLocaleDateString()
  });

  // Simulate fetching template details
  React.useEffect(() => {
    if (selectedForm) {
      // In a real app, you'd fetch this from your API
      setTimeout(() => {
        setFormDetails({
          id: selectedForm,
          name: "India Engineering Services Agreement",
          description: "Standard template for engineering services in India region",
          templateType: "Word Document (.docx)",
          lastModified: "2023-11-15"
        });
      }, 500);
    }
  }, [selectedForm]);

  const handleConversionSettingChange = (setting) => {
    setConversionSettings({
      ...conversionSettings,
      [setting]: !conversionSettings[setting]
    });
  };

  const handleAddCustomVariable = (variable) => {
    setCustomVariables([...customVariables, variable]);
  };

  const startConversion = async () => {
    setConversionStatus('converting');
    setConversionLog([]);
    
    try {
      // Simulate conversion process with logs
      setConversionLog(prev => [...prev, "Starting conversion process..."]);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setConversionLog(prev => [...prev, "Analyzing template structure..."]);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setConversionLog(prev => [...prev, "Identifying variable placeholders..."]);
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      if (customVariables.length > 0) {
        setConversionLog(prev => [...prev, `Processing ${customVariables.length} custom variables...`]);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      setConversionLog(prev => [...prev, "Converting to Jinja2 syntax..."]);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setConversionLog(prev => [...prev, "Applying template settings..."]);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setConversionLog(prev => [...prev, "Validating conversion..."]);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setConversionLog(prev => [...prev, "Conversion completed successfully!"]);
      setConversionStatus('success');
    } catch (error) {
      console.error("Conversion error:", error);
      setErrorMessage("An error occurred during conversion. Please try again.");
      setConversionStatus('error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Code className="w-6 h-6 text-teal" />
            <h2 className="text-xl font-semibold text-gray-800">Template Conversion</h2>
          </div>
          <button 
            onClick={onBack}
            className="flex items-center gap-1 text-gray-500 hover:text-teal transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Selection
          </button>
        </div>
        <p className="mt-2 text-gray-600">
          Convert your template to Jinja2 format for use with our template engine.
          This process will replace standard variables with Jinja2 syntax (e.g., "Company Name" becomes "&#123;&#123;company_name&#125;&#125;").  This operation prepares your template for easy production runs of deal packages.
        </p>
      </div>

      {/* Main content - two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Template Details & Settings */}
        <div className="lg:col-span-1 space-y-6">
          {/* Template Information Panel */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-medium mb-4">Template Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Template Name</p>
                <p className="font-medium">{formDetails.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Template Type</p>
                <p className="font-medium">{formDetails.templateType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Modified</p>
                <p className="font-medium">{formDetails.lastModified}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p className="font-medium">{formDetails.description}</p>
              </div>
            </div>
            
            {templateFoundation === 'custom' && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium mb-3">Upload Custom Template</h4>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="mx-auto h-10 w-10 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">Drag and drop your template file here, or click to browse</p>
                  <button className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    Browse Files
                  </button>
                  <p className="mt-2 text-xs text-gray-400">Supported formats: .docx, .doc, .pdf, .rtf</p>
                </div>
              </div>
            )}
          </div>

          {/* Conversion Settings */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-medium mb-4">Conversion Settings</h3>
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
                    onChange={() => handleConversionSettingChange('preserveFormatting')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal"></div>
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
                    onChange={() => handleConversionSettingChange('detectVariables')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal"></div>
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
                    onChange={() => handleConversionSettingChange('enableLoopSupport')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal"></div>
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
                    onChange={() => handleConversionSettingChange('enableConditionals')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right column - Custom Variables & Conversion Process */}
        <div className="lg:col-span-2 space-y-6">
          {/* Custom Variables Panel */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-medium mb-4">Customize Conversion Variables</h3>
            <p className="text-gray-600 mb-6">
              Define additional variables that may not be automatically detected during conversion.
            </p>
            
            {/* Custom variable form */}
            <div className="grid grid-cols-12 gap-4 mb-6">
              <div className="col-span-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">Template Text</label>
                <input
                  type="text"
                  placeholder="e.g., 'Company Name'"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="col-span-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">Variable Name</label>
                <input
                  type="text"
                  placeholder="e.g., 'company_name'"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="col-span-2 flex items-end">
                <button 
                  className="w-full p-2 bg-teal text-white rounded-md hover:bg-teal/90 transition-colors"
                  onClick={() => handleAddCustomVariable({
                    templateText: 'Company Name',
                    variableName: 'company_name'
                  })}
                >
                  Add
                </button>
              </div>
            </div>
            
            {/* Custom variables list */}
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Template Text
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Variable Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customVariables.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                        No custom variables added yet
                      </td>
                    </tr>
                  ) : (
                    customVariables.map((variable, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {variable.templateText}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {`{{${variable.variableName}}}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-red-500 hover:text-red-700">
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Conversion Process Panel */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">Conversion Process</h3>
              {conversionStatus === 'success' && (
                <span className="text-green-600 flex items-center gap-1 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Conversion Complete
                </span>
              )}
            </div>
            
            <div>
              {conversionStatus === 'idle' ? (
                <div className="text-center py-8">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Ready to convert your template to Jinja2 format. This process will analyze your 
                    document and replace standard variables with Jinja2 template syntax.  
                  </p>
                  <button
                    onClick={startConversion}
                    className="px-6 py-2 bg-teal text-white rounded-lg hover:bg-teal/90 transition-colors"
                  >
                    Start Conversion
                  </button>
                </div>
              ) : conversionStatus === 'converting' ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin text-teal" />
                    <p className="font-medium">Converting your template...</p>
                  </div>
                  
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal transition-all duration-500 ease-out"
                      style={{ width: `${(conversionLog.length / 7) * 100}%` }}
                    />
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto font-mono text-sm">
                    {conversionLog.map((log, index) => (
                      <div key={index} className="py-1">
                        <span className="text-gray-400">[{new Date().toLocaleTimeString()}]</span> {log}
                      </div>
                    ))}
                  </div>
                </div>
              ) : conversionStatus === 'error' ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <p className="text-red-600 mb-2">{errorMessage}</p>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    We encountered an error during conversion. This could be due to an 
                    unsupported format or issues with the template structure.
                  </p>
                  <button
                    onClick={startConversion}
                    className="px-6 py-2 bg-teal text-white rounded-lg hover:bg-teal/90 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <p className="text-green-600 mb-2">Conversion completed successfully!</p>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Your template has been converted to Jinja2 format and is ready for configuration.
                    Click continue to proceed to the configuration stage.
                  </p>
                  <button
                    onClick={onComplete}
                    className="px-8 py-3 bg-teal text-white rounded-lg hover:bg-teal/90 transition-colors flex items-center gap-2 mx-auto"
                  >
                    Continue to Configuration
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateConversion;
