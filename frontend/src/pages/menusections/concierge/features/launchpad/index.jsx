import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  AlertCircle,
  FileText,
  Users,
  Building2,
  Upload,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  Send,
  Clock,
  DollarSign,
  Tag,
  User
} from 'lucide-react';
import './launchpad.css';

const Launchpad = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [alertInfo, setAlertInfo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [matterData, setMatterData] = useState({
    // Basic Matter Info
    clientName: '',
    matterName: '',
    matterDescription: '',
    businessFunction: '',
    taxonomyCategory: '',
    subcategory: '',
    
    // Assignment Info
    assignedProvider: '',
    clientSupervisor: '',
    clientBusinessOwner: '',
    billingType: 'hourly', // or 'fixed'
    billingRate: '',
    fixedFeeAmount: '',
    
    // Additional Details
    priority: 'normal',
    expectedDuration: '',
    specialInstructions: '',
    
    // Documents
    documents: []
  });

  // Mock data - replace with API calls
  const taxonomyCategories = [
    {
      id: 'saas',
      name: 'SaaS Agreements',
      subcategories: ['New License', 'Renewal', 'Amendment', 'Enterprise']
    },
    {
      id: 'professional-services',
      name: 'Professional Services',
      subcategories: ['Consulting', 'Implementation', 'Training', 'Support']
    },
    // Add more categories
  ];

  const providers = [
    { id: 'p1', name: 'Jane Smith', expertise: ['SaaS', 'Licensing'], availability: 'High' },
    { id: 'p2', name: 'John Doe', expertise: ['Professional Services'], availability: 'Medium' },
    // Add more providers
  ];

  const showAlert = (type, message) => {
    setAlertInfo({ type, message });
    setTimeout(() => setAlertInfo(null), 5000);
  };

  const handleFileUpload = async (files) => {
    setUploading(true);
    try {
      // Mock file upload logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMatterData(prev => ({
        ...prev,
        documents: [...prev.documents, ...Array.from(files).map(file => ({
          name: file.name,
          size: file.size,
          type: file.type
        }))]
      }));
      showAlert('success', 'Files uploaded successfully');
    } catch (err) {
      showAlert('error', 'Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  const handleLaunchMatter = async () => {
    setLoading(true);
    try {
      // API call to launch matter
      const response = await fetch('/api/matters/launch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(matterData)
      });

      if (!response.ok) throw new Error('Failed to launch matter');

      showAlert('success', 'Matter launched successfully');
      // Reset form or redirect
    } catch (err) {
      showAlert('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return matterData.clientName && matterData.matterName && matterData.taxonomyCategory;
      case 2:
        return matterData.assignedProvider && matterData.billingType && 
          (matterData.billingType === 'hourly' ? matterData.billingRate : matterData.fixedFeeAmount);
      case 3:
        return true; // Documents are optional
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Matter Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Name
                </label>
                <input
                  type="text"
                  value={matterData.clientName}
                  onChange={(e) => setMatterData({...matterData, clientName: e.target.value})}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Matter Name
                </label>
                <input
                  type="text"
                  value={matterData.matterName}
                  onChange={(e) => setMatterData({...matterData, matterName: e.target.value})}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Matter Description
                </label>
                <textarea
                  value={matterData.matterDescription}
                  onChange={(e) => setMatterData({...matterData, matterDescription: e.target.value})}
                  rows={3}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Taxonomy Category
                </label>
                <select
                  value={matterData.taxonomyCategory}
                  onChange={(e) => setMatterData({...matterData, taxonomyCategory: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select category...</option>
                  {taxonomyCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory
                </label>
                <select
                  value={matterData.subcategory}
                  onChange={(e) => setMatterData({...matterData, subcategory: e.target.value})}
                  className="w-full p-2 border rounded-md"
                  disabled={!matterData.taxonomyCategory}
                >
                  <option value="">Select subcategory...</option>
                  {taxonomyCategories
                    .find(cat => cat.id === matterData.taxonomyCategory)
                    ?.subcategories.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Assignment & Billing</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned Provider
                </label>
                <select
                  value={matterData.assignedProvider}
                  onChange={(e) => setMatterData({...matterData, assignedProvider: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select provider...</option>
                  {providers.map(provider => (
                    <option key={provider.id} value={provider.id}>
                      {provider.name} - {provider.availability} Availability
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Supervisor
                </label>
                <input
                  type="text"
                  value={matterData.clientSupervisor}
                  onChange={(e) => setMatterData({...matterData, clientSupervisor: e.target.value})}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Billing Type
                </label>
                <select
                  value={matterData.billingType}
                  onChange={(e) => setMatterData({...matterData, billingType: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="hourly">Hourly Rate</option>
                  <option value="fixed">Fixed Fee</option>
                </select>
              </div>

              {matterData.billingType === 'hourly' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hourly Rate
                  </label>
                  <input
                    type="number"
                    value={matterData.billingRate}
                    onChange={(e) => setMatterData({...matterData, billingRate: e.target.value})}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fixed Fee Amount
                  </label>
                  <input
                    type="number"
                    value={matterData.fixedFeeAmount}
                    onChange={(e) => setMatterData({...matterData, fixedFeeAmount: e.target.value})}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Additional Details & Documents</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={matterData.priority}
                  onChange={(e) => setMatterData({...matterData, priority: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Duration
                </label>
                <select
                  value={matterData.expectedDuration}
                  onChange={(e) => setMatterData({...matterData, expectedDuration: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select duration...</option>
                  <option value="short">Short (Less than 1 month)</option>
                  <option value="medium">Medium (1-3 months)</option>
                  <option value="long">Long (3 months plus)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Instructions
                </label>
                <textarea
                  value={matterData.specialInstructions}
                  onChange={(e) => setMatterData({...matterData, specialInstructions: e.target.value})}
                  rows={3}
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Documents
                </label>
                <div 
                  className="border-2 border-dashed rounded-md p-6 text-center"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleFileUpload(e.dataTransfer.files);
                  }}
                >
                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                    id="file-upload"
                  />
                  <label 
                    htmlFor="file-upload"
                    className="cursor-pointer text-blue-600 hover:text-blue-800"
                  >
                    <Upload className="w-8 h-8 mx-auto mb-2" />
                    <span>Click to upload or drag and drop</span>
                  </label>
                </div>

                {/* Document List */}
                {matterData.documents.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {matterData.documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="truncate">{doc.name}</span>
                        <button
                          onClick={() => {
                            setMatterData(prev => ({
                              ...prev,
                              documents: prev.documents.filter((_, i) => i !== idx)
                            }));
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {alertInfo && (
        <div className={`alert alert-${alertInfo.type} mb-4`}>
          {alertInfo.type === 'error' ? <AlertCircle className="h-5 w-5 mr-2" /> :



<CheckCircle className="h-5 w-5 mr-2" />}
{alertInfo.message}
</div>
)}

{/* Progress Steps */}
<div className="mb-8">
<div className="flex justify-between">
{['Matter Details', 'Assignment & Billing', 'Additional Details'].map((step, idx) => (
  <div key={idx} className="flex items-center">
    <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 
      ${currentStep > idx + 1 ? 'bg-blue-600 border-blue-600 text-white' :
        currentStep === idx + 1 ? 'border-blue-600 text-blue-600' :
        'border-gray-300 text-gray-300'}`}
    >
      {currentStep > idx + 1 ? <CheckCircle className="w-5 h-5" /> : idx + 1}
    </div>
    <span className={`ml-2 text-sm ${
      currentStep === idx + 1 ? 'text-blue-600 font-medium' : 'text-gray-500'
    }`}>
      {step}
    </span>
    {idx < 2 && (
      <div className="w-24 h-0.5 mx-4 bg-gray-200">
        <div className={`h-full bg-blue-600 transition-all ${
          currentStep > idx + 1 ? 'w-full' : 'w-0'
        }`} />
      </div>
    )}
  </div>
))}
</div>
</div>

{/* Step Content */}
<div className="bg-white rounded-lg shadow-sm p-6 mb-6">
{renderStep()}
</div>

{/* Navigation Buttons */}
<div className="flex justify-between">
<button
onClick={() => setCurrentStep(prev => prev - 1)}
disabled={currentStep === 1}
className={`flex items-center px-4 py-2 rounded-md ${
  currentStep === 1 
    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
    : 'bg-white text-gray-600 hover:bg-gray-50'
}`}
>
<ArrowLeft className="w-4 h-4 mr-2" />
Previous
</button>

<button
onClick={() => {
  if (currentStep < 3 && validateStep(currentStep)) {
    setCurrentStep(prev => prev + 1);
  } else if (currentStep === 3) {
    handleLaunchMatter();
  }
}}
disabled={!validateStep(currentStep) || loading}
className={`flex items-center px-4 py-2 rounded-md ${
  validateStep(currentStep)
    ? 'bg-blue-600 text-white hover:bg-blue-700'
    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
}`}
>
{loading ? (
  <>
    <span className="animate-spin mr-2">⌛</span>
    Processing...
  </>
) : currentStep === 3 ? (
  <>
    Launch Matter
    <Send className="w-4 h-4 ml-2" />
  </>
) : (
  <>
    Next
    <ArrowRight className="w-4 h-4 ml-2" />
  </>
)}
</button>
</div>

{/* Preview Panel */}
{currentStep === 3 && (
<div className="mt-8 bg-gray-50 rounded-lg p-4">
<h4 className="text-lg font-semibold mb-4">Matter Summary</h4>
<div className="grid grid-cols-2 gap-4">
  <div>
    <p className="text-sm text-gray-600">Client</p>
    <p className="font-medium">{matterData.clientName}</p>
  </div>
  <div>
    <p className="text-sm text-gray-600">Matter</p>
    <p className="font-medium">{matterData.matterName}</p>
  </div>
  <div>
    <p className="text-sm text-gray-600">Category</p>
    <p className="font-medium">{matterData.taxonomyCategory} - {matterData.subcategory}</p>
  </div>
  <div>
    <p className="text-sm text-gray-600">Assigned To</p>
    <p className="font-medium">
      {providers.find(p => p.id === matterData.assignedProvider)?.name}
    </p>
  </div>
  <div>
    <p className="text-sm text-gray-600">Billing</p>
    <p className="font-medium">
      {matterData.billingType === 'hourly' 
        ? `$${matterData.billingRate}/hour`
        : `Fixed Fee: $${matterData.fixedFeeAmount}`}
    </p>
  </div>
  <div>
    <p className="text-sm text-gray-600">Documents</p>
    <p className="font-medium">{matterData.documents.length} attached</p>
  </div>
</div>
</div>
)}
</div>
);
};

export default Launchpad;       
