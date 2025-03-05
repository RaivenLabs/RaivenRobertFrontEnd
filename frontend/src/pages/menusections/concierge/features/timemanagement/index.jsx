import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Plus,
  FileText,
  Search,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  MessageSquare,
  Calendar
} from 'lucide-react';
import './timemanagement.css';

// Time Entry Modal Component
const TimeEntryModal = ({ isOpen, onClose, matter, onSave }) => {
  const [timeEntry, setTimeEntry] = useState({
    hours: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSave(matter.id, timeEntry);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Log Time - {matter.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={timeEntry.date}
              onChange={(e) => setTimeEntry({...timeEntry, date: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Hours</label>
            <input
              type="number"
              step="0.1"
              value={timeEntry.hours}
              onChange={(e) => setTimeEntry({...timeEntry, hours: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={timeEntry.description}
              onChange={(e) => setTimeEntry({...timeEntry, description: e.target.value})}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!timeEntry.hours || !timeEntry.description}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Save Time Entry
          </button>
        </div>
      </div>
    </div>
  );
};

// New Matter Request Modal
const NewMatterModal = ({ isOpen, onClose, onSubmit }) => {
  const [matterRequest, setMatterRequest] = useState({
    name: '',
    description: '',
    clientName: '',
    expectedDuration: '',
    priority: 'normal'
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Request New Matter</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Matter Name</label>
            <input
              type="text"
              value={matterRequest.name}
              onChange={(e) => setMatterRequest({...matterRequest, name: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Client Name</label>
            <input
              type="text"
              value={matterRequest.clientName}
              onChange={(e) => setMatterRequest({...matterRequest, clientName: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={matterRequest.description}
              onChange={(e) => setMatterRequest({...matterRequest, description: e.target.value})}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Expected Duration</label>
            <select
              value={matterRequest.expectedDuration}
              onChange={(e) => setMatterRequest({...matterRequest, expectedDuration: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="">Select duration...</option>
              <option value="short">Short (Less than 1 month)</option>
              <option value="medium">Medium (1-3 months)</option>
              <option value="long">Long (3 months plus)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              value={matterRequest.priority}
              onChange={(e) => setMatterRequest({...matterRequest, priority: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSubmit(matterRequest);
              onClose();
            }}
            disabled={!matterRequest.name || !matterRequest.description}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
};

const TimeManagement = () => {
  const [matters, setMatters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMatter, setSelectedMatter] = useState(null);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [showNewMatterModal, setShowNewMatterModal] = useState(false);
  const [alertInfo, setAlertInfo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMatters();
  }, []);

  const fetchMatters = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/matters');
      if (!response.ok) throw new Error('Failed to fetch matters');
      const data = await response.json();
      setMatters(data.matters || []);
    } catch (err) {
      showAlert('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlertInfo({ type, message });
    setTimeout(() => setAlertInfo(null), 5000);
  };

  const handleTimeEntry = async (matterId, timeData) => {
    try {
      const response = await fetch('/api/time-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matterId, ...timeData })
      });
      
      if (!response.ok) throw new Error('Failed to save time entry');
      
      showAlert('success', 'Time entry saved successfully');
      fetchMatters(); // Refresh matters list
    } catch (err) {
      showAlert('error', err.message);
    }
  };

  const handleNewMatterRequest = async (matterData) => {
    try {
      const response = await fetch('/api/matter-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(matterData)
      });
      
      if (!response.ok) throw new Error('Failed to submit matter request');
      
      showAlert('success', 'Matter request submitted successfully');
    } catch (err) {
      showAlert('error', err.message);
    }
  };

  const filteredMatters = matters.filter(matter =>
    matter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    matter.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-state">
        <RefreshCw className="animate-spin h-5 w-5 mr-2" />
        Loading matters...
      </div>
    );
  }

  return (
    <div className="p-4">
      {alertInfo && (
        <div className={`alert alert-${alertInfo.type}`}>
          {alertInfo.type === 'error' ? <AlertCircle className="h-5 w-5 mr-2" /> : 
           <CheckCircle className="h-5 w-5 mr-2" />}
          {alertInfo.message}
        </div>
      )}

      <div className="table-header">
        <h2 className="text-xl font-bold">
          Time Management
          <span className="text-sm text-gray-500 ml-2">
            ({matters.length} active matters)
          </span>
        </h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search matters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md"
            />
          </div>
          <button
            onClick={() => setShowNewMatterModal(true)}
            className="action-button"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Matter Request
          </button>
          <button
            onClick={fetchMatters}
            className="action-button"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Matter Name</th>
              <th>Client</th>
              <th>Last Time Entry</th>
              <th>Total Hours</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMatters.map((matter) => (
              <tr key={matter.id}>
                <td className="truncate">{matter.name}</td>
                <td>{matter.client}</td>
                <td>{matter.lastTimeEntry || 'No entries'}</td>
                <td>{matter.totalHours?.toFixed(1) || '0.0'}</td>
                <td>
                  <span className={`status-indicator ${
                    matter.status === 'active' ? 'status-confirmed' :
                    matter.status === 'pending' ? 'status-pending' :
                    'status-rejected'
                  }`}>
                    {matter.status}
                  </span>
                </td>
                <td>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedMatter(matter);
                        setShowTimeModal(true);
                      }}
                      className="p-1 text-blue-600 hover:text-blue-800"
                      title="Log Time"
                    >
                      <Clock className="h-5 w-5" />
                    </button>
                    <button
                      className="p-1 text-gray-600 hover:text-gray-800"
                      title="View Details"
                    >
                      <FileText className="h-5 w-5" />
                    </button>
                    <button
                      className="p-1 text-purple-600 hover:text-purple-800"
                      title="Contact Concierge"
                    >
                      <MessageSquare className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredMatters.length === 0 && (
          <div className="empty-state">
            No matters found
          </div>
        )}
      </div>

      <TimeEntryModal
        isOpen={showTimeModal}
        onClose={() => {
          setShowTimeModal(false);
          setSelectedMatter(null);
        }}
        matter={selectedMatter}
        onSave={handleTimeEntry}
      />

      <NewMatterModal
        isOpen={showNewMatterModal}
        onClose={() => setShowNewMatterModal(false)}
        onSubmit={handleNewMatterRequest}
      />
    </div>
  );
};

export default TimeManagement;
