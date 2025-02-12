import React, { useState, useEffect } from 'react';
import { 
  Save,
  FileText, 
  Settings,
  Eye,
  CheckCircle,
  Loader
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
    customerName: '',      // [Customer]
    customerAddress: '',   // [Customer Address]
    governingLaw: ''      // [Governing Law]
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Load base template on mount
  useEffect(() => {
    const loadTemplate = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log('🔍 Fetching template:', { programClass, templateFoundation });
        const response = await fetch(
          `http://localhost:5000/api/templates/${programClass}?foundation=${templateFoundation}`,
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
        console.log('📄 Received template data:', data);

        if (data.template) {
          console.log('📝 Setting template content...');
          setTemplate(data.template);
        } else {
          console.warn('⚠️ No template content in response:', data);
          setError('Template content not found in response');
        }
      } catch (error) {
        console.error('❌ Error loading template:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    if (programClass && templateFoundation) {
      loadTemplate();
    }
  }, [programClass, templateFoundation]);

  // Replace constants in template with actual values
  const getProcessedTemplate = () => {
    if (!template) {
      return 'No template content available';
    }

    console.log('🔄 Processing template with values:', customerConstants);
    let processed = template;
    
    // Replace Customer Name
    processed = processed.replace(/\[Customer\]/g, 
      customerConstants.customerName || '[Customer]');
    
    // Replace Customer Address
    processed = processed.replace(/\[Customer Address\]/g, 
      customerConstants.customerAddress || '[Customer Address]');
    
    // Replace Governing Law
    processed = processed.replace(/\[Governing Law\]/g, 
      customerConstants.governingLaw || '[Governing Law]');

    return processed;
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const configuredTemplate = {
        programGroup,
        programClass,
        customerConstants,
        template: getProcessedTemplate(),
        metadata: {
          createdAt: new Date().toISOString(),
          foundation: templateFoundation,
          version: '1.0'
        }
      };

      console.log('💾 Saving template configuration:', configuredTemplate);

      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(configuredTemplate)
      });

      if (!response.ok) {
        throw new Error('Failed to save template');
      }
      
      const result = await response.json();
      console.log('✅ Save successful:', result);
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('❌ Error saving template:', error);
      setError(error.message);
    } finally {
      setIsSaving(false);
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
                  placeholder="Enter customer's legal name"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This will also be used to generate the signature block
                </p>
              </div>

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
                  placeholder="Enter customer's principal address as a single line"
                />
              </div>

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
                  placeholder="e.g., State of Delaware"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-gray-100">
          <PanelHeader 
            title="Template Preview" 
            isActive={true}
            icon={Eye}
          />
          <div className="p-6">
            <div className="prose max-w-none">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader className="w-6 h-6 text-teal animate-spin" />
                  <span className="ml-2 text-gray-600">Loading template...</span>
                </div>
              ) : (
                <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg">
                  {getProcessedTemplate()}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Panel */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {saveSuccess && (
              <span className="text-green-600 flex items-center gap-1">
                <CheckCircle className="w-5 h-5" />
                Template saved successfully
              </span>
            )}
          </div>
          
          <button
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="px-6 py-2 bg-teal text-white rounded-lg 
              hover:bg-teal/90 transition-colors
              flex items-center gap-2
              disabled:bg-gray-200 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {isSaving ? 'Saving...' : 'Save Template'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateConfig;
