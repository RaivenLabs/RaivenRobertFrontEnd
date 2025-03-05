import React from 'react';

const SupplierInformationForm = ({ supplierData, handleDataChange, extractedData }) => {
  return (
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
  );
};

export default SupplierInformationForm;
