import React, { useState } from 'react';
import { 
  FileCheck, Camera, Upload, CheckCircle, 
  XCircle, AlertTriangle, Search, Link
} from 'lucide-react';

const DocumentVerification = ({ onComplete, disabled }) => {
  const [verificationMode, setVerificationMode] = useState(null);
  const [shareCode, setShareCode] = useState('');
  const [verificationChecks, setVerificationChecks] = useState({
    isGenuine: false,
    photoMatch: false,
    datesValid: false,
    workPermitted: false,
    copiesMade: false
  });
  const [documentImages, setDocumentImages] = useState([]);
  const [notes, setNotes] = useState('');

  const handleShareCodeVerification = () => {
    // In production, this would call the Home Office API
    if (shareCode.length >= 9) {
      handleComplete({
        method: 'online',
        shareCode,
        verifiedAt: new Date().toISOString()
      });
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setDocumentImages(prev => [...prev, ...files]);
  };

  const toggleCheck = (check) => {
    setVerificationChecks(prev => ({
      ...prev,
      [check]: !prev[check]
    }));
  };

  const handleComplete = (data) => {
    const allChecksComplete = Object.values(verificationChecks).every(v => v);
    if (allChecksComplete || data.method === 'online') {
      onComplete({
        ...data,
        notes,
        documentImages,
        completedAt: new Date().toISOString()
      });
    }
  };

  const renderOnlineVerification = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Link className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Online Check Process</h4>
            <p className="text-sm text-blue-700 mt-1">
              Use the share code provided by the candidate to verify their right to work status
              through the Home Office online checking service.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="text-gray-700 font-medium">Share Code</span>
          <input
            type="text"
            value={shareCode}
            onChange={(e) => setShareCode(e.target.value)}
            placeholder="Enter 9-digit share code"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
          />
        </label>

        <button
          onClick={handleShareCodeVerification}
          disabled={shareCode.length < 9}
          className={`w-full py-2 px-4 rounded-md ${
            shareCode.length >= 9
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-100 text-gray-500 cursor-not-allowed'
          }`}
        >
          Verify Share Code
        </button>
      </div>
    </div>
  );

  const renderPhysicalVerification = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-900">Document Check Requirements</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Ensure all documents are original, valid, and belong to the candidate.
              Follow the verification checklist carefully.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Verification Checklist</h4>
        {Object.entries({
          isGenuine: 'Document appears genuine and unaltered',
          photoMatch: 'Photograph matches candidate appearance',
          datesValid: 'Dates and permissions are valid and current',
          workPermitted: 'Type of work is permitted',
          copiesMade: 'Clear copies have been made and dated'
        }).map(([key, label]) => (
          <label key={key} className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={verificationChecks[key]}
              onChange={() => toggleCheck(key)}
              className="mt-1"
            />
            <span className="text-gray-700">{label}</span>
          </label>
        ))}
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Document Images</h4>
        <div className="border-2 border-dashed rounded-lg p-6 text-center">
          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
          <div className="text-sm text-gray-600">
            <label className="cursor-pointer text-blue-600 hover:text-blue-700">
              Upload document images
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <p className="mt-1">or drag and drop</p>
          </div>
        </div>
        {documentImages.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {documentImages.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Document ${index + 1}`}
                  className="rounded-lg border"
                />
                <button
                  onClick={() => setDocumentImages(prev => prev.filter((_, i) => i !== index))}
                  className="absolute top-2 right-2 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="text-gray-700 font-medium">Additional Notes</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            placeholder="Add any relevant notes about the verification process..."
          />
        </label>
      </div>

      <button
        onClick={() => handleComplete({ method: 'physical' })}
        disabled={!Object.values(verificationChecks).every(v => v)}
        className={`w-full py-2 px-4 rounded-md ${
          Object.values(verificationChecks).every(v => v)
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-100 text-gray-500 cursor-not-allowed'
        }`}
      >
        Complete Verification
      </button>
    </div>
  );

  if (!verificationMode) {
    return (
      <div className="bg-white/80 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-6">Select Verification Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setVerificationMode('online')}
            className="p-6 border rounded-lg text-left hover:border-blue-500 focus:border-blue-500"
          >
            <div className="flex items-center gap-3 mb-2">
              <Link className="h-6 w-6 text-blue-600" />
              <h4 className="font-medium">Online Share Code</h4>
            </div>
            <p className="text-sm text-gray-600">
              Use the Home Office online checking service with a share code
            </p>
          </button>

          <button
            onClick={() => setVerificationMode('physical')}
            className="p-6 border rounded-lg text-left hover:border-blue-500 focus:border-blue-500"
          >
            <div className="flex items-center gap-3 mb-2">
              <FileCheck className="h-6 w-6 text-blue-600" />
              <h4 className="font-medium">Physical Document Check</h4>
            </div>
            <p className="text-sm text-gray-600">
              Verify physical documents and upload copies
            </p>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">
          {verificationMode === 'online' ? 'Online Verification' : 'Document Verification'}
        </h3>
        <button
          onClick={() => setVerificationMode(null)}
          className="text-gray-500 hover:text-gray-700"
        >
          Change Method
        </button>
      </div>
      {verificationMode === 'online' ? renderOnlineVerification() : renderPhysicalVerification()}
    </div>
  );
};

export default DocumentVerification;
