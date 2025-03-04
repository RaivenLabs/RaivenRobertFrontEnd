import React, { useState } from 'react';

const NewProviderForm = ({
  onCreateProvider,
  onUploadArtifact
}) => {
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [providerData, setProviderData] = useState({
    name: '',
    category: '',
    agreementType: '',
    msaReference: '',
    effectiveDate: '',
    termEndDate: '',
    autoRenewal: false,
    website: '',
    preferredStatus: false,
    status: 'Pending',
    contacts: []
  });
  const [contact, setContact] = useState({
    name: '',
    role: '',
    email: '',
    phone: ''
  });
  const [documents, setDocuments] = useState({
    msaDocument: null,
    rateCardDocument: null,
    orderTemplateDocument: null,
    amendments: []
  });
  const [fileNames, setFileNames] = useState({
    msaDocument: '',
    rateCardDocument: '',
    orderTemplateDocument: '',
    amendments: []
  });

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProviderData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle contact form changes
  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContact(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add a new contact
  const addContact = (e) => {
    e.preventDefault();
    if (contact.name && contact.role && contact.email) {
      setProviderData(prev => ({
        ...prev,
        contacts: [...prev.contacts, { ...contact }]
      }));
      setContact({
        name: '',
        role: '',
        email: '',
        phone: ''
      });
    }
  };

  // Remove a contact
  const removeContact = (index) => {
    setProviderData(prev => ({
      ...prev,
      contacts: prev.contacts.filter((_, i) => i !== index)
    }));
  };

  // Handle file selection
  const handleFileSelect = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === 'amendments') {
      setDocuments(prev => ({
        ...prev,
        amendments: [...prev.amendments, file]
      }));
      setFileNames(prev => ({
        ...prev,
        amendments: [...prev.amendments, file.name]
      }));
    } else {
      setDocuments(prev => ({
        ...prev,
        [type]: file
      }));
      setFileNames(prev => ({
        ...prev,
        [type]: file.name
      }));
    }
  };

  // Remove a file
  const removeFile = (type, index) => {
    if (type === 'amendments') {
      setDocuments(prev => ({
        ...prev,
        amendments: prev.amendments.filter((_, i) => i !== index)
      }));
      setFileNames(prev => ({
        ...prev,
        amendments: prev.amendments.filter((_, i) => i !== index)
      }));
    } else {
      setDocuments(prev => ({
        ...prev,
        [type]: null
      }));
      setFileNames(prev => ({
        ...prev,
        [type]: ''
      }));
    }
  };

  // Check if required fields are filled for each step
  const canProceed = () => {
    if (step === 1) {
      return (
        providerData.name && 
        providerData.category && 
        providerData.agreementType && 
        providerData.msaReference && 
        providerData.effectiveDate
      );
    } else if (step === 2) {
      // Contacts are optional
      return true;
    } else if (step === 3) {
      // Documents are validated in the final step
      return true;
    }
    return false;
  };

  // Check if all mandatory documents are uploaded
  const hasMandatoryDocuments = () => {
    return documents.msaDocument && documents.rateCardDocument;
  };

  // Move to the next step
  const nextStep = () => {
    if (canProceed()) {
      setStep(prev => prev + 1);
    }
  };

  // Move to the previous step
  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasMandatoryDocuments()) {
      alert('Please upload all required documents (MSA and Rate Card)');
      return;
    }

    try {
      setUploading(true);
      
      // First create the provider
      const result = await onCreateProvider(providerData);
      
      if (result.success && result.data && result.data.id) {
        const providerId = result.data.id;
        
        // Upload documents
        if (documents.msaDocument) {
          await onUploadArtifact(providerId, 'MSA', documents.msaDocument);
        }
        
        if (documents.rateCardDocument) {
          await onUploadArtifact(providerId, 'RateCard', documents.rateCardDocument);
        }
        
        if (documents.orderTemplateDocument) {
          await onUploadArtifact(providerId, 'OrderTemplate', documents.orderTemplateDocument);
        }
        
        // Upload amendments
        for (const amendment of documents.amendments) {
          await onUploadArtifact(providerId, 'Amendment', amendment);
        }
        
        alert('Provider created successfully!');
        
        // Reset form
        setStep(1);
        setProviderData({
          name: '',
          category: '',
          agreementType: '',
          msaReference: '',
          effectiveDate: '',
          termEndDate: '',
          autoRenewal: false,
          website: '',
          preferredStatus: false,
          status: 'Pending',
          contacts: []
        });
        setDocuments({
          msaDocument: null,
          rateCardDocument: null,
          orderTemplateDocument: null,
          amendments: []
        });
        setFileNames({
          msaDocument: '',
          rateCardDocument: '',
          orderTemplateDocument: '',
          amendments: []
        });
      } else {
        alert('Failed to create provider');
      }
    } catch (error) {
      console.error('Error creating provider:', error);
      alert(`Error creating provider: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Add New Provider</h2>
      
      {/* Progress Steps */}
      <div className="flex justify-between items-center mb-8">
        <div className="w-full">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 1 ? 'bg-royalBlue text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <div className={`flex-1 h-1 mx-2 ${
              step >= 2 ? 'bg-royalBlue' : 'bg-gray-200'
            }`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 2 ? 'bg-royalBlue text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
            <div className={`flex-1 h-1 mx-2 ${
              step >= 3 ? 'bg-royalBlue' : 'bg-gray-200'
            }`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= 3 ? 'bg-royalBlue text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              3
            </div>
          </div>
          <div className="flex text-sm mt-2">
            <div className="flex-1 text-center">Provider Information</div>
            <div className="flex-1 text-center">Contact Details</div>
            <div className="flex-1 text-center">Upload Documents</div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Provider Information */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provider Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={providerData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provider Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={providerData.category}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Select Category</option>
                  <option value="Professional Services">Professional Services</option>
                  <option value="Software Development">Software Development</option>
                  <option value="Consulting">Consulting</option>
                  <option value="IT Services">IT Services</option>
                  <option value="Staffing">Staffing</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Agreement Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="agreementType"
                  value={providerData.agreementType}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Select Agreement Type</option>
                  <option value="Evergreen">Evergreen</option>
                  <option value="Fixed Term">Fixed Term</option>
                  <option value="Time & Materials">Time & Materials</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  MSA Reference Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="msaReference"
                  value={providerData.msaReference}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Effective Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="effectiveDate"
                  value={providerData.effectiveDate}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Term End Date {providerData.agreementType === 'Evergreen' ? '' : <span className="text-red-500">*</span>}
                </label>
                <input
                  type="date"
                  name="termEndDate"
                  value={providerData.termEndDate}
                  onChange={handleChange}
                  disabled={providerData.agreementType === 'Evergreen'}
                  required={providerData.agreementType !== 'Evergreen'}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={providerData.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center space-x-2 mt-6">
                <input
                  type="checkbox"
                  id="autoRenewal"
                  name="autoRenewal"
                  checked={providerData.autoRenewal}
                  onChange={handleChange}
                  className="h-4 w-4 text-royalBlue"
                />
                <label htmlFor="autoRenewal" className="text-sm text-gray-700">
                  Auto-renewal enabled
                </label>
              </div>
              
              <div className="flex items-center space-x-2 mt-6">
                <input
                  type="checkbox"
                  id="preferredStatus"
                  name="preferredStatus"
                  checked={providerData.preferredStatus}
                  onChange={handleChange}
                  className="h-4 w-4 text-royalBlue"
                />
                <label htmlFor="preferredStatus" className="text-sm text-gray-700">
                  Preferred provider status
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Contact Information */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-4">Provider Contacts</h3>
              
              {/* Contact Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={contact.name}
                    onChange={handleContactChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={contact.role}
                    onChange={handleContactChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={contact.email}
                    onChange={handleContactChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={contact.phone}
                    onChange={handleContactChange}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
              
              <button
                type="button"
                onClick={addContact}
                className="bg-royalBlue text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add Contact
              </button>
            </div>
            
            {/* Contacts List */}
            {providerData.contacts.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-2">Added Contacts</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {providerData.contacts.map((c, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded relative">
                      <button
                        type="button"
                        onClick={() => removeContact(index)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                      <p className="font-medium">{c.name}</p>
                      <p className="text-sm text-gray-600">{c.role}</p>
                      <p className="text-sm text-gray-600">{c.email}</p>
                      <p className="text-sm text-gray-600">{c.phone}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Adding contacts is optional, but recommended for efficient provider management.
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Document Upload */}
        {step === 3 && (
          <div className="space-y-6">
            <p className="text-gray-700 mb-4">
              Please upload the required documents to complete the provider setup.
            </p>
            
            <div className="grid grid-cols-1 gap-6">
              {/* MSA Document */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h4 className="font-medium">Master Service Agreement (MSA) <span className="text-red-500">*</span></h4>
                    <p className="text-sm text-gray-500">Upload the signed MSA document</p>
                  </div>
                  <div>
                    <label className="bg-royalBlue text-white px-3 py-1 rounded text-sm hover:bg-blue-700 cursor-pointer">
                      Select File
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => handleFileSelect(e, 'msaDocument')}
                        accept=".pdf,.docx,.doc"
                      />
                    </label>
                  </div>
                </div>
                {fileNames.msaDocument ? (
                  <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                    <span className="text-sm">{fileNames.msaDocument}</span>
                    <button
                      type="button"
                      onClick={() => removeFile('msaDocument')}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="text-sm text-red-500">Required document not uploaded</div>
                )}
              </div>
              
              {/* Rate Card */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h4 className="font-medium">Rate Card <span className="text-red-500">*</span></h4>
                    <p className="text-sm text-gray-500">Upload the provider rate card</p>
                  </div>
                  <div>
                    <label className="bg-royalBlue text-white px-3 py-1 rounded text-sm hover:bg-blue-700 cursor-pointer">
                      Select File
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => handleFileSelect(e, 'rateCardDocument')}
                        accept=".pdf,.xlsx,.xls,.csv"
                      />
                    </label>
                  </div>
                </div>
                {fileNames.rateCardDocument ? (
                  <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                    <span className="text-sm">{fileNames.rateCardDocument}</span>
                    <button
                      type="button"
                      onClick={() => removeFile('rateCardDocument')}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="text-sm text-red-500">Required document not uploaded</div>
                )}
              </div>
              
              {/* Order Template */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h4 className="font-medium">Order Template</h4>
                    <p className="text-sm text-gray-500">Upload the standard service order template (optional)</p>
                  </div>
                  <div>
                    <label className="bg-royalBlue text-white px-3 py-1 rounded text-sm hover:bg-blue-700 cursor-pointer">
                      Select File
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => handleFileSelect(e, 'orderTemplateDocument')}
                        accept=".pdf,.docx,.doc"
                      />
                    </label>
                  </div>
                </div>
                {fileNames.orderTemplateDocument ? (
                  <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                    <span className="text-sm">{fileNames.orderTemplateDocument}</span>
                    <button
                      type="button"
                      onClick={() => removeFile('orderTemplateDocument')}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No file uploaded</div>
                )}
              </div>
              
              {/* Amendments */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h4 className="font-medium">Amendments</h4>
                    <p className="text-sm text-gray-500">Upload any amendments to the MSA (optional)</p>
                  </div>
                  <div>
                    <label className="bg-royalBlue text-white px-3 py-1 rounded text-sm hover:bg-blue-700 cursor-pointer">
                      Select File
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => handleFileSelect(e, 'amendments')}
                        accept=".pdf,.docx,.doc"
                      />
                    </label>
                  </div>
                </div>
                {fileNames.amendments.length > 0 ? (
                  <div className="space-y-2">
                    {fileNames.amendments.map((name, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                        <span className="text-sm">{name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile('amendments', idx)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No amendments uploaded</div>
                )}
              </div>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> MSA and Rate Card are required documents. The provider cannot be created without these documents.
              </p>
            </div>
          </div>
        )}
        
        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
            >
              Previous
            </button>
          ) : (
            <div></div>
          )}
          
          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={!canProceed()}
              className={`px-4 py-2 rounded ${
                canProceed() 
                  ? 'bg-royalBlue text-white hover:bg-blue-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={uploading || !hasMandatoryDocuments()}
              className={`px-4 py-2 rounded ${
                !uploading && hasMandatoryDocuments()
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {uploading ? 'Creating...' : 'Create Provider'}
            </button>
          )}
        </div>
      </form>


      </div>
  );
};

export default NewProviderForm;
