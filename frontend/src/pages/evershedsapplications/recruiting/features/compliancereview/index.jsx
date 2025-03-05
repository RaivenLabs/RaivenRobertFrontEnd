import React, { useState } from 'react';
import { 
  FileText, 
  Calendar, 
  UserCheck, 
  AlertTriangle,
  CheckSquare,
  Download,
  Save
} from 'lucide-react';

const ComplianceRecord = ({ onComplete, disabled }) => {
  const [formData, setFormData] = useState({
    checkDate: new Date().toISOString().split('T')[0],
    checkedBy: '',
    evidenceType: '',
    expiryDate: '',
    followUpDate: '',
    storageRef: `RTW-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
    notes: ''
  });

  const [confirmations, setConfirmations] = useState({
    originalsSeen: false,
    copiesStored: false,
    dataProtection: false,
    retentionUnderstood: false
  });

  const [isFinalized, setIsFinalized] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleConfirmation = (field) => {
    setConfirmations(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = () => {
    const isValid = Object.values(confirmations).every(v => v) &&
                   formData.checkDate &&
                   formData.checkedBy;

    if (isValid) {
      setIsFinalized(true);
      onComplete({
        ...formData,
        confirmations,
        completedAt: new Date().toISOString()
      });
    }
  };

  return (
    <div className="bg-white/80 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <FileText className="h-5 w-5 text-blue-600" />
        Compliance Record Generation
      </h3>

      {/* Check Details Section */}
      <div className="space-y-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Check
            </label>
            <input
              type="date"
              value={formData.checkDate}
              onChange={(e) => handleInputChange('checkDate', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Checked By
            </label>
            <input
              type="text"
              value={formData.checkedBy}
              onChange={(e) => handleInputChange('checkedBy', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Full name of person conducting check"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Evidence Type
            </label>
            <select
              value={formData.evidenceType}
              onChange={(e) => handleInputChange('evidenceType', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select evidence type</option>
              <option value="passport">Passport</option>
              <option value="biometric">Biometric Residence Permit</option>
              <option value="shareCode">Online Share Code</option>
              <option value="birthCertificate">Birth Certificate & NI</option>
              <option value="other">Other Immigration Document</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document Expiry Date (if applicable)
            </label>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>

        {formData.expiryDate && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Follow-up Check Required By
            </label>
            <input
              type="date"
              value={formData.followUpDate}
              onChange={(e) => handleInputChange('followUpDate', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Add any relevant notes about the compliance record..."
          />
        </div>
      </div>

      {/* Statutory Requirements Confirmation */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-blue-900 mb-4">Compliance Confirmations</h4>
        <div className="space-y-3">
          {[
            {
              id: 'originalsSeen',
              label: 'I confirm that I have seen original documents or used the online checking service'
            },
            {
              id: 'copiesStored',
              label: 'I confirm that copies have been taken and stored securely'
            },
            {
              id: 'dataProtection',
              label: 'I understand that this information is subject to data protection regulations'
            },
            {
              id: 'retentionUnderstood',
              label: 'I understand the document retention requirements (employment duration + 2 years)'
            }
          ].map(({ id, label }) => (
            <label key={id} className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={confirmations[id]}
                onChange={() => toggleConfirmation(id)}
                className="mt-1"
              />
              <span className="text-sm text-blue-800">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Storage Reference */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">Storage Reference</h4>
            <p className="text-sm text-gray-600 mt-1">
              Use this reference for future retrieval
            </p>
          </div>
          <div className="text-lg font-mono font-medium text-gray-900">
            {formData.storageRef}
          </div>
        </div>
      </div>

      {/* Warning Section */}
      {formData.expiryDate && (
        <div className="bg-yellow-50 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800">Time-Limited Permission</h4>
              <p className="text-sm text-yellow-700 mt-1">
                This permission expires on {new Date(formData.expiryDate).toLocaleDateString()}. 
                Ensure follow-up checks are scheduled before expiry.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <button
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
            onClick={() => {/* Add download functionality */}}
          >
            <Download className="h-4 w-4" />
            Export Record
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
            onClick={() => {/* Add save functionality */}}
          >
            <Save className="h-4 w-4" />
            Save Draft
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!Object.values(confirmations).every(v => v)}
          className={`px-6 py-2 rounded-lg flex items-center gap-2 ${
            Object.values(confirmations).every(v => v)
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 text-gray-500 cursor-not-allowed'
          }`}
        >
          <CheckSquare className="h-4 w-4" />
          Finalize Record
        </button>
      </div>
    </div>
  );
};

export default ComplianceRecord;
