import React from 'react';

const ReviewSection = ({ supplierData, documents }) => {
  return (
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
  );
};

export default ReviewSection;
