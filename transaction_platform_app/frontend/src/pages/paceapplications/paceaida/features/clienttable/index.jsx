import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  XCircle,
  AlertTriangle,
  Edit,
  Save
} from 'lucide-react';
import './clienttable.css';

const NullValueModal = ({ isOpen, onClose, caseData, onSave }) => {
  const [editedValues, setEditedValues] = useState({});
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Initialize editedValues with current case data
    if (caseData) {
      setEditedValues(caseData);
      // Check for null values to set initial complete status
      const hasNulls = Object.values(caseData).some(value => value === null);
      setIsComplete(!hasNulls);
    }
  }, [caseData]);

  if (!isOpen) return null;

  const handleValueChange = (field, value) => {
    setEditedValues(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Check if all required fields are filled
    const updatedValues = { ...editedValues, [field]: value };
    const hasNulls = Object.values(updatedValues).some(value => value === null);
    setIsComplete(!hasNulls);
  };

  const handleSave = () => {
    onSave(editedValues);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Review Missing Values</h2>
          <button onClick={onClose}>
            <XCircle className="h-6 w-6 text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        <div className="space-y-4">
          {Object.entries(editedValues).map(([field, value]) => (
            value === null && (
              <div key={field} className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">
                  {field.replace(/_/g, ' ').toUpperCase()}
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={editedValues[field] || ''}
                  onChange={(e) => handleValueChange(field, e.target.value)}
                />
              </div>
            )
          ))}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 rounded-md text-white ${
              isComplete ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
            }`}
            onClick={handleSave}
            disabled={!isComplete}
          >
            Complete
          </button>
        </div>
      </div>
    </div>
  );
};

const ClientTable = () => {
  const [clientData, setClientData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alertInfo, setAlertInfo] = useState(null);

  useEffect(() => {
    fetchClientData();
  }, []);

  const fetchClientData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/litigation/promote-to-client');
      if (!response.ok) throw new Error('Failed to fetch client data');
      const data = await response.json();
      setClientData(data.cases || []);
    } catch (err) {
      setError(err.message);
      showAlert('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveCase = async (caseId) => {
    try {
      const response = await fetch('/api/litigation/approve-case', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId })
      });
      
      if (!response.ok) throw new Error('Failed to approve case');
      
      // Remove approved case from the list
      setClientData(prev => prev.filter(c => c.case_id !== caseId));
      showAlert('success', 'Case approved successfully');
    } catch (err) {
      showAlert('error', err.message);
    }
  };

  const handleNullValues = (caseData) => {
    setSelectedCase(caseData);
    setIsModalOpen(true);
  };

  const handleModalSave = async (updatedValues) => {
    try {
      const response = await fetch('/api/litigation/update-case-values', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId: selectedCase.case_id,
          updates: updatedValues
        })
      });

      if (!response.ok) throw new Error('Failed to update case values');

      // Update local state
      setClientData(prev => prev.map(c => 
        c.case_id === selectedCase.case_id 
          ? { ...c, ...updatedValues }
          : c
      ));

      showAlert('success', 'Case values updated successfully');
    } catch (err) {
      showAlert('error', err.message);
    }
  };

  const showAlert = (type, message) => {
    setAlertInfo({ type, message });
    setTimeout(() => setAlertInfo(null), 5000);
  };

  const hasNullValues = (caseData) => {
    return Object.values(caseData).some(value => value === null);
  };

  if (loading) {
    return (
      <div className="loading-state">
        <RefreshCw className="animate-spin h-5 w-5 mr-2" />
        Loading client cases...
      </div>
    );
  }

  return (
    <div className="p-4">
      {alertInfo && (
        <div className={`alert alert-${alertInfo.type}`}>
          {alertInfo.type === 'error' ? <AlertCircle className="h-5 w-5 mr-2" /> : 
           alertInfo.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> :
           <AlertTriangle className="h-5 w-5 mr-2" />}
          {alertInfo.message}
        </div>
      )}

      <div className="table-header">
        <h2 className="text-xl font-bold">
          Client Cases
          <span className="text-sm text-gray-500 ml-2">
            ({clientData.length} cases)
          </span>
        </h2>
        <button
          onClick={fetchClientData}
          className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Actions</th>
              <th>Log Number</th>
              <th>Case Caption</th>
              <th>Jurisdiction</th>
              <th>Client Match</th>
              <th>Confidence</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {clientData.map((item) => (
              <tr key={item.case_id}>
                <td className="flex space-x-2">
                  <button
                    onClick={() => handleApproveCase(item.case_id)}
                    className="p-1 text-green-600 hover:text-green-800"
                    title="Approve Case"
                  >
                    <CheckCircle className="h-5 w-5" />
                  </button>
                  {hasNullValues(item) && (
                    <button
                      onClick={() => handleNullValues(item)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                      title="Review Missing Values"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                  )}
                </td>
                <td>{item.log_number}</td>
                <td className="truncate">{item.case_caption}</td>
                <td>{item.jurisdiction}</td>
                <td>{item.matched_client}</td>
                <td>
                  <span className={`confidence-${
                    item.confidence_score >= 85 ? 'high' :
                    item.confidence_score >= 75 ? 'medium' : 'low'
                  }`}>
                    {item.confidence_score}%
                  </span>
                </td>
                <td>
                  <span className={`status-indicator ${
                    hasNullValues(item) ? 'status-pending' : 'status-confirmed'
                  }`}>
                    {hasNullValues(item) ? 'Needs Review' : 'Ready'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {clientData.length === 0 && (
          <div className="empty-state">
            No cases waiting for review
          </div>
        )}
      </div>

      <NullValueModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        caseData={selectedCase}
        onSave={handleModalSave}
      />
    </div>
  );
};

export default ClientTable;
