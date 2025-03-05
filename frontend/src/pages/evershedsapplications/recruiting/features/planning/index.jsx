import React, { useState } from 'react';
import { 
  Calendar, 
  Bell, 
  Users, 
  AlertTriangle,
  CheckSquare,
  Mail,
  FileText,
  Clock
} from 'lucide-react';

const RemediationPlanning = ({ onComplete, disabled }) => {
  const [planningData, setPlanningData] = useState({
    reviewSchedule: '',
    notificationList: '',
    escalationContact: '',
    automatedReminders: true,
    documentationRequired: [],
    contingencyPlan: '',
    riskLevel: 'low'
  });

  const [selectedActions, setSelectedActions] = useState([]);

  const documentOptions = [
    'Passport Renewal Reminder',
    'Visa Extension Documentation',
    'Settlement Status Update',
    'Work Permit Renewal',
    'Right to Work Follow-up',
    'Change of Circumstances Form'
  ];

  const recommendedActions = [
    {
      id: 'calendar',
      title: 'Schedule Follow-up Review',
      description: 'Set up calendar reminders for document expiry',
      type: 'required',
      icon: <Calendar className="h-5 w-5 text-blue-600" />
    },
    {
      id: 'notification',
      title: 'Configure Notifications',
      description: 'Set up automated email alerts for key stakeholders',
      type: 'required',
      icon: <Bell className="h-5 w-5 text-blue-600" />
    },
    {
      id: 'stakeholders',
      title: 'Assign Stakeholders',
      description: 'Designate responsible parties for compliance monitoring',
      type: 'recommended',
      icon: <Users className="h-5 w-5 text-blue-600" />
    },
    {
      id: 'documents',
      title: 'Prepare Documentation',
      description: 'Ready renewal documentation requirements',
      type: 'optional',
      icon: <FileText className="h-5 w-5 text-blue-600" />
    }
  ];

  const handleInputChange = (field, value) => {
    setPlanningData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleAction = (actionId) => {
    setSelectedActions(prev => {
      if (prev.includes(actionId)) {
        return prev.filter(id => id !== actionId);
      }
      return [...prev, actionId];
    });
  };

  const handleSubmit = () => {
    onComplete({
      ...planningData,
      selectedActions,
      completedAt: new Date().toISOString()
    });
  };

  return (
    <div className="bg-white/80 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-6">Forward Planning & Risk Management</h3>

      {/* Risk Level Assessment */}
      <div className="mb-8">
        <h4 className="font-medium text-gray-900 mb-4">Risk Level Assessment</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['low', 'medium', 'high'].map((risk) => (
            <button
              key={risk}
              onClick={() => handleInputChange('riskLevel', risk)}
              className={`p-4 rounded-lg border ${
                planningData.riskLevel === risk
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-500'
              }`}
            >
              <div className="font-medium capitalize mb-1">{risk} Risk</div>
              <div className="text-sm text-gray-500">
                {risk === 'low' && 'Standard monitoring sufficient'}
                {risk === 'medium' && 'Enhanced monitoring advised'}
                {risk === 'high' && 'Close monitoring required'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Actions */}
      <div className="mb-8">
        <h4 className="font-medium text-gray-900 mb-4">Recommended Actions</h4>
        <div className="space-y-4">
          {recommendedActions.map((action) => (
            <div
              key={action.id}
              className={`p-4 rounded-lg border ${
                selectedActions.includes(action.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200'
              }`}
            >
              <label className="flex items-start gap-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedActions.includes(action.id)}
                  onChange={() => toggleAction(action.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {action.icon}
                    <span className="font-medium">{action.title}</span>
                    {action.type === 'required' && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Setup */}
      <div className="mb-8">
        <h4 className="font-medium text-gray-900 mb-4">Notification Configuration</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Review Schedule
            </label>
            <select
              value={planningData.reviewSchedule}
              onChange={(e) => handleInputChange('reviewSchedule', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select frequency</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="biannual">Bi-annual</option>
              <option value="annual">Annual</option>
              <option value="custom">Custom Schedule</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notification Recipients
            </label>
            <input
              type="text"
              value={planningData.notificationList}
              onChange={(e) => handleInputChange('notificationList', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter email addresses (comma-separated)"
            />
          </div>
        </div>
      </div>

      {/* Documentation Requirements */}
      <div className="mb-8">
        <h4 className="font-medium text-gray-900 mb-4">Documentation Requirements</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documentOptions.map((doc) => (
            <label key={doc} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50">
              <input
                type="checkbox"
                checked={planningData.documentationRequired.includes(doc)}
                onChange={(e) => {
                  const newDocs = e.target.checked
                    ? [...planningData.documentationRequired, doc]
                    : planningData.documentationRequired.filter(d => d !== doc);
                  handleInputChange('documentationRequired', newDocs);
                }}
                className="mt-1"
              />
              <span className="text-gray-700">{doc}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Contingency Planning */}
      <div className="mb-8">
        <h4 className="font-medium text-gray-900 mb-4">Contingency Planning</h4>
        <textarea
          value={planningData.contingencyPlan}
          onChange={(e) => handleInputChange('contingencyPlan', e.target.value)}
          rows={4}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Outline contingency measures for potential compliance issues..."
        />
      </div>

      {/* Action Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-gray-900 mb-2">Action Summary</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-blue-600" />
            <span>Next review scheduled for: {planningData.reviewSchedule || 'Not set'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-blue-600" />
            <span>Notifications configured for: {planningData.notificationList || 'Not set'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <AlertTriangle className="h-4 w-4 text-blue-600" />
            <span>Risk Level: {planningData.riskLevel.toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={!selectedActions.length}
          className={`px-6 py-2 rounded-lg flex items-center gap-2 ${
            selectedActions.length
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 text-gray-500 cursor-not-allowed'
          }`}
        >
          <CheckSquare className="h-4 w-4" />
          Finalize Planning
        </button>
      </div>
    </div>
  );
};

export default RemediationPlanning;
