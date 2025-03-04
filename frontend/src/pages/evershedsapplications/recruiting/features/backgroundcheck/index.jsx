import React, { useState } from 'react';
import { 
  Building2, Globe, UserCheck, AlertTriangle, 
  FileText, CheckCircle, HelpCircle, CreditCard 
} from 'lucide-react';

const BackgroundPanel = ({ onComplete, disabled }) => {
  const [formData, setFormData] = useState({
    nationality: '',
    euStatus: '',
    documentType: '',
    employmentStart: ''
  });

  const [currentSection, setCurrentSection] = useState('nationality');
  const [selectedCombo, setSelectedCombo] = useState(null);

  const handleInputChange = (field, value) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);

    // Determine next section based on input
    if (field === 'nationality') {
      if (value === 'uk') {
        setCurrentSection('documents-uk');
      } else if (value === 'eu') {
        setCurrentSection('eu-status');
      } else {
        setCurrentSection('visa-status');
      }
    }
  };

  const handleSubmit = () => {
    // Validate required fields
    const isValid = formData.nationality && formData.employmentStart;
    if (isValid) {
      onComplete(formData);
    }
  };

  const renderNationalitySection = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Nationality Assessment</h3>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <button
          onClick={() => handleInputChange('nationality', 'uk')}
          className={`p-4 text-left rounded-lg border ${
            formData.nationality === 'uk' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 hover:border-blue-500'
          }`}
        >
          <div className="font-medium mb-1">British Citizen</div>
          <div className="text-sm text-gray-500">
            Including those with right of abode
          </div>
        </button>

        <button
          onClick={() => handleInputChange('nationality', 'eu')}
          className={`p-4 text-left rounded-lg border ${
            formData.nationality === 'eu' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 hover:border-blue-500'
          }`}
        >
          <div className="font-medium mb-1">EU/EEA Citizen</div>
          <div className="text-sm text-gray-500">
            Including settled and pre-settled status holders
          </div>
        </button>

        <button
          onClick={() => handleInputChange('nationality', 'other')}
          className={`p-4 text-left rounded-lg border ${
            formData.nationality === 'other' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 hover:border-blue-500'
          }`}
        >
          <div className="font-medium mb-1">Other Nationality</div>
          <div className="text-sm text-gray-500">
            Requiring valid visa or immigration status
          </div>
        </button>
      </div>
    </div>
  );

  const renderUKDocumentsSection = () => {
    const documentCombinations = {
      listA: [
        {
          id: 'uk-passport',
          title: 'British Passport',
          description: 'Current or expired UK passport demonstrating citizenship',
          notes: 'Most straightforward option for right to work',
          allowsWork: 'Permanent',
          guidance: 'Check photo page for authenticity features'
        },
        {
          id: 'birth-ni',
          title: 'Birth/Adoption Certificate + NI Evidence',
          description: 'UK birth/adoption certificate with official NI number evidence',
          notes: 'Must have both documents together',
          allowsWork: 'Permanent',
          subDocs: [
            'Full UK birth certificate',
            'UK adoption certificate',
            'P45/P60 showing NI number',
            'Official NI number card',
            'Letter from HMRC with NI number',
            'Payslip showing NI number'
          ]
        },
        {
          id: 'naturalization',
          title: 'Naturalisation + Permitted Document',
          description: 'Certificate of naturalisation with additional permitted document',
          notes: 'Requires supporting identity document',
          allowsWork: 'Permanent',
          subDocs: [
            'Certificate of naturalisation',
            'Supporting passport/identity card',
            'Biometric residence permit'
          ]
        },
        {
          id: 'right-of-abode',
          title: 'Certificate of Right of Abode',
          description: 'Current passport with certificate of entitlement to right of abode',
          notes: 'Must be current and valid',
          allowsWork: 'Permanent'
        }
      ],
      listB: [
        {
          id: 'limited-leave',
          title: 'Limited Leave Documents',
          description: 'Documents showing limited leave to remain with work permissions',
          notes: 'Time-limited check required',
          allowsWork: 'Time Limited',
          subDocs: [
            'Current passport with valid visa',
            'Biometric residence permit',
            'Residence card',
            'Immigration status document'
          ]
        }
      ]
    };

    const handleDocumentSelection = (combo, docType) => {
      setSelectedCombo({
        combo,
        docType,
        requiresNI: docType === 'birth-ni'
      });
      handleInputChange('documentType', docType);
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">UK Right to Work Documentation</h3>
        </div>

        {/* Guidance Panel */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <HelpCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Documentation Guidance</h4>
              <p className="text-sm text-blue-800">
                Select the most appropriate document combination for right to work verification.
                List A documents provide a permanent right to work, while List B requires follow-up checks.
              </p>
            </div>
          </div>
        </div>

        {/* List A Documents */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            List A - Permanent Right to Work
          </h4>
          <div className="grid grid-cols-1 gap-4">
            {documentCombinations.listA.map((doc) => (
              <button
                key={doc.id}
                onClick={() => handleDocumentSelection('A', doc.id)}
                className={`p-4 text-left rounded-lg border transition-all ${
                  selectedCombo?.docType === doc.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-500'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium">{doc.title}</div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {doc.allowsWork}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-2">{doc.description}</div>
                {doc.subDocs && (
                  <div className="mt-3 border-t border-gray-100 pt-3">
                    <div className="text-sm font-medium text-gray-700 mb-2">Required Documents:</div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {doc.subDocs.map((subDoc, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <div className="h-1 w-1 bg-gray-400 rounded-full"></div>
                          {subDoc}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {doc.notes && (
                  <div className="mt-2 text-sm text-blue-600 italic">
                    Note: {doc.notes}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* List B Documents */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            List B - Limited Right to Work
          </h4>
          <div className="grid grid-cols-1 gap-4">
            {documentCombinations.listB.map((doc) => (
              <button
                key={doc.id}
                onClick={() => handleDocumentSelection('B', doc.id)}
                className={`p-4 text-left rounded-lg border transition-all ${
                  selectedCombo?.docType === doc.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-500'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium">{doc.title}</div>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                    {doc.allowsWork}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-2">{doc.description}</div>
                {doc.subDocs && (
                  <div className="mt-3 border-t border-gray-100 pt-3">
                    <div className="text-sm font-medium text-gray-700 mb-2">Acceptable Documents:</div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {doc.subDocs.map((subDoc, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <div className="h-1 w-1 bg-gray-400 rounded-full"></div>
                          {subDoc}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {doc.notes && (
                  <div className="mt-2 text-sm text-yellow-600 italic">
                    Important: {doc.notes}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Continue Button */}
        {selectedCombo && (
          <div className="flex justify-end mt-6">
            <button
              onClick={() => setCurrentSection('employment-details')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 
                       flex items-center gap-2 transition-colors"
            >
              <span>Continue to Employment Details</span>
              <CreditCard className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderEUStatusSection = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <UserCheck className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Settlement Status</h3>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <button
          onClick={() => {
            handleInputChange('euStatus', 'settled');
            setCurrentSection('employment-details');
          }}
          className="p-4 text-left rounded-lg border border-gray-200 hover:border-blue-500"
        >
          <div className="font-medium mb-1">Settled Status</div>
          <div className="text-sm text-gray-500">
            Permanent right to work in the UK
          </div>
        </button>

        <button
          onClick={() => {
            handleInputChange('euStatus', 'pre-settled');
            setCurrentSection('employment-details');
          }}
          className="p-4 text-left rounded-lg border border-gray-200 hover:border-blue-500"
        >
          <div className="font-medium mb-1">Pre-settled Status</div>
          <div className="text-sm text-gray-500">
            Time-limited right to work in the UK
          </div>
        </button>

        <button
          onClick={() => {
            handleInputChange('euStatus', 'none');
            setCurrentSection('visa-status');
          }}
          className="p-4 text-left rounded-lg border border-gray-200 hover:border-blue-500"
        >
          <div className="font-medium mb-1">Other/None</div>
          <div className="text-sm text-gray-500">
            No settlement status currently held
          </div>
        </button>
      </div>
    </div>
  );

  const renderEmploymentDetails = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Employment Details</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Planned Employment Start Date
          </label>
          <input
            type="date"
            value={formData.employmentStart}
            onChange={(e) => handleInputChange('employmentStart', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        {formData.employmentStart && (
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Continue to Document Verification
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderVisaStatus = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-5 w-5 text-yellow-600" />
        <h3 className="text-lg font-semibold">Immigration Status Check</h3>
      </div>

      <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-4">
        <p className="text-sm text-yellow-800">
          Additional immigration status verification will be required. 
          Please ensure you have valid documentation ready for the next step.
        </p>
      </div>

      <button
        onClick={() => setCurrentSection('employment-details')}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Continue to Employment Details
      </button>
    </div>
  );

  // Render the appropriate section based on current state
  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'documents-uk':
        return renderUKDocumentsSection();
      
      
      case 'nationality':
        return renderNationalitySection();
      case 'eu-status':
        return renderEUStatusSection();
      case 'employment-details':
        return renderEmploymentDetails();
      case 'visa-status':
        return renderVisaStatus();
      default:
        return renderNationalitySection();
    }
  };

  return (
    <div className="bg-white/80 rounded-lg shadow p-6">
      {renderCurrentSection()}
    </div>
  );
};

export default BackgroundPanel;
