import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from './CardTitle';

const NewSupplierWorkflow = ({ onSaveSupplier, onExtractDocumentData, onUploadArtifact }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  
  // State for uploaded documents with their types
  const [documents, setDocuments] = useState({
    masterAgreement: null,
    rateCard: null,
    amendments: [],
    localCountryAgreements: [],
    orderTemplates: []
  });
  
  // State for supplier data combined from extractions and manual input
  const [supplierData, setSupplierData] = useState({
    name: '',
    category: '',
    agreementType: '',
    msaReference: '',
    claimNumber: '',
    effectiveDate: '',
    termEndDate: '',
    autoRenewal: false,
    website: '',
    preferredStatus: false,
    status: 'Pending',
    contacts: []
  });
  
  // Handle document upload and categorization
  const handleDocumentUpload = async (e, documentType) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Update documents state
    if (documentType === 'amendments' || documentType === 'localCountryAgreements' || documentType === 'orderTemplates') {
      setDocuments(prev => ({
        ...prev,
        [documentType]: [...prev[documentType], file]
      }));
    } else {
      setDocuments(prev => ({
        ...prev,
        [documentType]: file
      }));
    }
    
    // If it's the master agreement, try to extract data immediately
    if (documentType === 'masterAgreement') {
      await extractDataFromDocument(file, 'masterAgreement');
    } else if (documentType === 'rateCard') {
      await extractDataFromDocument(file, 'rateCard');
    }
  };
  
  // Function to extract data from uploaded document
  const extractDataFromDocument = async (file, documentType) => {
    setIsProcessing(true);
    try {
      // Call API to extract data
      const extractionResult = await onExtractDocumentData(file, documentType);
      
      // Update the supplier data with the extracted information
      if (extractionResult.success) {
        setExtractedData(extractionResult.data);
        
        // Merge extracted data with existing supplier data
        setSupplierData(prev => ({
          ...prev,
          ...extractionResult.data
        }));
      }
    } catch (error) {
      console.error('Error extracting data:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle manual data entry and updates
  const handleDataChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSupplierData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Validate if we can proceed to the next step
  const canProceed = () => {
    if (currentStep === 1) {
      // Require at least a master agreement upload
      return documents.masterAgreement !== null;
    } else if (currentStep === 2) {
      // Require basic supplier information
      return (
        supplierData.name && 
        supplierData.effectiveDate && 
        supplierData.msaReference
      );
    }
    
    return true;
  };
  
  // Handle step navigation
  const goToNextStep = () => {
    if (canProceed()) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const goToPreviousStep = () => {
    setCurrentStep(prev => prev - 1);
  };
  
  // Save the supplier with all gathered information
  const saveSupplier = async () => {
    setIsProcessing(true);
    try {
      // First save the supplier data
      const result = await onSaveSupplier(supplierData);
      
      if (result.success && result.data && result.data.id) {
        const supplierId = result.data.id;
        
        // Then upload all documents as artifacts
        if (documents.masterAgreement) {
          await onUploadArtifact(supplierId, 'MSA', documents.masterAgreement);
        }
        
        if (documents.rateCard) {
          await onUploadArtifact(supplierId, 'RateCard', documents.rateCard);
        }
        
        // Upload all amendments
        for (const amendment of documents.amendments) {
          await onUploadArtifact(supplierId, 'Amendment', amendment);
        }
        
        // Upload all LCAs
        for (const lca of documents.localCountryAgreements) {
          await onUploadArtifact(supplierId, 'LCA', lca);
        }
        
        // Upload all order templates
        for (const template of documents.orderTemplates) {
          await onUploadArtifact(supplierId, 'OrderTemplate', template);
        }
        
        alert('Supplier configuration completed successfully!');
        
        // Reset form
        setCurrentStep(1);
        setDocuments({
          masterAgreement: null,
          rateCard: null,
          amendments: [],
          localCountryAgreements: [],
          orderTemplates: []
        });
        setSupplierData({
          name: '',
          category: '',
          agreementType: '',
          msaReference: '',
          claimNumber: '',
          effectiveDate: '',
          termEndDate: '',
          autoRenewal: false,
          website: '',
          preferredStatus: false,
          status: 'Pending',
          contacts: []
        });
      } else {
        alert('Failed to create supplier');
      }
    } catch (error) {
      console.error('Error saving supplier:', error);
      alert(`Error saving supplier: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Supplier Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}>1</div>
            <div className={`h-1 flex-1 mx-2 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}>2</div>
            <div className={`h-1 flex-1 mx-2 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}>3</div>
            <div className={`h-1 flex-1 mx-2 ${currentStep >= 4 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep >= 4 ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}>4</div>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <div className="text-center w-20">Document Upload</div>
            <div className="text-center w-20">Supplier Info</div>
            <div className="text-center w-20">Rate Card</div>
            <div className="text-center w-20">Review & Confirm</div>
          </div>
        </div>
        
        {/* Step 1: Document Upload & Analysis */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Upload Documents</h3>
            <p className="text-gray-600">Start by uploading supplier documents. We'll automatically extract information when possible.</p>
            
            {/* Master Agreement Upload */}
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium">Master Service Agreement (MSA) <span className="text-red-500">*</span></h4>
              <p className="text-sm text-gray-500 mb-3">Upload the master agreement to automatically extract key information</p>
              <div className="flex justify-between items-center">
                <input 
                  type="file" 
                  onChange={(e) => handleDocumentUpload(e, 'masterAgreement')}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
                {documents.masterAgreement && (
                  <span className="text-green-600">✓ Uploaded</span>
                )}
              </div>
              {isProcessing && documents.masterAgreement && (
                <div className="mt-2 text-blue-600">Extracting information...</div>
              )}
              {extractedData && documents.masterAgreement && (
                <div className="mt-2 p-2 bg-green-50 rounded">
                  <p className="text-sm text-green-800">Successfully extracted information</p>
                </div>
              )}
            </div>
            
            {/* Rate Card Upload */}
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium">Rate Card</h4>
              <p className="text-sm text-gray-500 mb-3">Upload the provider rate card</p>
              <div className="flex justify-between items-center">
                <input 
                  type="file" 
                  onChange={(e) => handleDocumentUpload(e, 'rateCard')}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
                {documents.rateCard && (
                  <span className="text-green-600">✓ Uploaded</span>
                )}
              </div>
            </div>
            
            {/* Amendments Upload */}
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium">Amendments</h4>
              <p className="text-sm text-gray-500 mb-3">Upload any amendments to the MSA</p>
              <div className="flex justify-between items-center">
                <input 
                  type="file" 
                  onChange={(e) => handleDocumentUpload(e, 'amendments')}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </div>
              {documents.amendments.length > 0 && (
                <div className="mt-2">
                  <p className="font-medium text-sm">Uploaded Amendments ({documents.amendments.length})</p>
                  <ul className="text-sm">
                    {documents.amendments.map((file, index) => (
                      <li key={index} className="text-gray-600">{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Local Country Agreements Upload */}
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium">Local Country Agreements</h4>
              <p className="text-sm text-gray-500 mb-3">Upload any local country agreements</p>
              <div className="flex justify-between items-center">
                <input 
                  type="file" 
                  onChange={(e) => handleDocumentUpload(e, 'localCountryAgreements')}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </div>
              {documents.localCountryAgreements.length > 0 && (
                <div className="mt-2">
                  <p className="font-medium text-sm">Uploaded LCAs ({documents.localCountryAgreements.length})</p>
                </div>
              )}
            </div>
            
            {/* Order Templates Upload */}
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium">Order Templates</h4>
              <p className="text-sm text-gray-500 mb-3">Upload any order templates</p>
              <div className="flex justify-between items-center">
                <input 
                  type="file" 
                  onChange={(e) => handleDocumentUpload(e, 'orderTemplates')}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </div>
              {documents.orderTemplates.length > 0 && (
                <div className="mt-2">
                  <p className="font-medium text-sm">Uploaded Templates ({documents.orderTemplates.length})</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Step 2: Information Review & Enrichment */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Supplier Information</h3>
            <p className="text-gray-600">Review and complete supplier information. Fields with <span className="text-red-500">*</span> are required.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={supplierData.name}
                  onChange={handleDataChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier Category
                </label>
                <select
                  name="category"
                  value={supplierData.category}
                  onChange={handleDataChange}
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
                  Agreement Type
                </label>
                <select
                  name="agreementType"
                  value={supplierData.agreementType}
                  onChange={handleDataChange}
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
                  value={supplierData.msaReference}
                  onChange={handleDataChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CLIM Number
                </label>
                <input
                  type="text"
                  name="claimNumber"
                  value={supplierData.claimNumber}
                  onChange={handleDataChange}
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
                  value={supplierData.effectiveDate}
                  onChange={handleDataChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Term End Date
                </label>
                <input
                  type="date"
                  name="termEndDate"
                  value={supplierData.termEndDate}
                  onChange={handleDataChange}
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
                  value={supplierData.website}
                  onChange={handleDataChange}
                  placeholder="https://example.com"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              
              <div className="flex items-center space-x-2 mt-6">
                <input
                  type="checkbox"
                  id="autoRenewal"
                  name="autoRenewal"
                  checked={supplierData.autoRenewal}
                  onChange={handleDataChange}
                  className="h-4 w-4 text-blue-600"
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
                  checked={supplierData.preferredStatus}
                  onChange={handleDataChange}
                  className="h-4 w-4 text-blue-600"
                />
                <label htmlFor="preferredStatus" className="text-sm text-gray-700">
                  Preferred supplier status
                </label>
              </div>
            </div>
            
            {/* Extracted Information Notice */}
            {extractedData && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Some information was automatically extracted from the uploaded documents.
                  Please review and make any necessary corrections.
                </p>
              </div>
            )}
          </div>
        )}
        
        {/* Step 3: Rate Card Processing */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Rate Card Information</h3>
            <p className="text-gray-600">Review and confirm the rate card information extracted from the documents.</p>
            
            {documents.rateCard ? (
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-green-50">
                  <p className="font-medium">Rate Card Uploaded</p>
                  <p className="text-sm text-gray-600">The system will process the rate information for this supplier.</p>
                </div>
                
                {/* Rate Card Preview - This would be populated with actual data in a real implementation */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Rate Card Preview</h4>
                  <p className="text-sm text-gray-500 mb-4">This is a preview of the extracted rate information. You can make adjustments if needed.</p>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience Level</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hourly Rate</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Daily Rate</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {/* Sample rate entries - would be dynamic in real implementation */}
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Project Manager</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Senior</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$150.00</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$1,200.00</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Developer</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Mid-level</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$125.00</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$1,000.00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="mt-4">
                    <button className="text-blue-600 text-sm">Edit Rate Information</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 border rounded-lg bg-yellow-50">
                <p className="font-medium">No Rate Card Uploaded</p>
                <p className="text-sm text-gray-600 mt-1">You can proceed without a rate card, but it's recommended to provide one for complete supplier configuration.</p>
                <button 
                  className="mt-3 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                  onClick={() => setCurrentStep(1)}
                >
                  Go Back to Upload
                </button>
              </div>
            )}
            
            {/* Rate Card Amendment Information */}
            {documents.amendments.length > 0 && (
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Rate Card Amendments</h4>
                <p className="text-sm text-gray-500">The system will process any rate changes from the uploaded amendments.</p>
              </div>
            )}
          </div>
        )}
        
        {/* Step 4: Review & Confirmation */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Review & Confirm</h3>
            <p className="text-gray-600">Please review all information before finalizing the supplier configuration.</p>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-3">Supplier Information</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">Name:</div>
                <div>{supplierData.name}</div>
                
                <div className="font-medium">Category:</div>
                <div>{supplierData.category || "Not specified"}</div>
                
                <div className="font-medium">Agreement Type:</div>
                <div>{supplierData.agreementType || "Not specified"}</div>
                
                <div className="font-medium">MSA Reference:</div>
                <div>{supplierData.msaReference}</div>
                
                <div className="font-medium">CLIM Number:</div>
                <div>{supplierData.claimNumber || "Not specified"}</div>
                
                <div className="font-medium">Effective Date:</div>
                <div>{supplierData.effectiveDate}</div>
                
                <div className="font-medium">Term End Date:</div>
                <div>{supplierData.termEndDate || "Not specified"}</div>
                
                <div className="font-medium">Auto Renewal:</div>
                <div>{supplierData.autoRenewal ? "Yes" : "No"}</div>
                
                <div className="font-medium">Preferred Status:</div>
                <div>{supplierData.preferredStatus ? "Yes" : "No"}</div>
                
                <div className="font-medium">Website:</div>
                <div>{supplierData.website || "Not specified"}</div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-3">Uploaded Documents</h4>
              <ul className="text-sm space-y-2">
                <li className="flex justify-between">
                  <span>Master Service Agreement:</span>
                  <span className="text-green-600">{documents.masterAgreement ? "✓ Uploaded" : "Not uploaded"}</span>
                </li>
                <li className="flex justify-between">
                  <span>Rate Card:</span>
                  <span className={documents.rateCard ? "text-green-600" : "text-yellow-600"}>
                    {documents.rateCard ? "✓ Uploaded" : "Not uploaded"}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Amendments:</span>
                  <span>{documents.amendments.length > 0 ? `${documents.amendments.length} uploaded` : "None"}</span>
                </li>
                <li className="flex justify-between">
                  <span>Local Country Agreements:</span>
                  <span>{documents.localCountryAgreements.length > 0 ? `${documents.localCountryAgreements.length} uploaded` : "None"}</span>
                </li>
                <li className="flex justify-between">
                  <span>Order Templates:</span>
                  <span>{documents.orderTemplates.length > 0 ? `${documents.orderTemplates.length} uploaded` : "None"}</span>
                </li>
              </ul>
            </div>
            
            <div className="p-4 border rounded-lg bg-blue-50">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> After saving, all uploaded documents will be stored as artifacts linked to this supplier.
                Rate card information will be automatically processed into the rates table.
              </p>
            </div>
          </div>
        )}
        
        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={goToPreviousStep}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
          ) : (
            <div></div>
        )}
          
        {currentStep === 4 && (
          <button
            type="button"
            onClick={saveSupplier}
            disabled={isProcessing}
            className="px-4 py-2 rounded-md shadow-sm text-sm font-medium bg-green-600 text-white hover:bg-green-700"
          >
            {isProcessing ? 'Saving...' : 'Complete Configuration'}
          </button>
        )}
      </div>
    </CardContent>
  </Card>
);
};

export default NewSupplierWorkflow;
