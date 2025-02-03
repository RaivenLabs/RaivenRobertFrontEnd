import React, { useState } from 'react';
import { 
  UserCheck, AlertTriangle, Clock, Filter,
  Download, RefreshCw, ChevronDown, Search,
  AlertCircle, CheckCircle, XCircle, Calendar,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import './RecruitingDashboard.css';

const RecruitingDashboard = () => {
  const [timeframe, setTimeframe] = useState('30days');
  const [filterOpen, setFilterOpen] = useState(false);

  // Enhanced mock data for comprehensive compliance view
  const complianceMetrics = {
    activeEmployees: {
      total: 4256,
      byStatus: {
        compliant: 4150,
        pending: 23,
        expiring: 45,
        overdue: 38
      }
    },
    verificationStats: {
      lastMonth: 245,
      thisMonth: 268,
      trend: '+9.4%'
    },
    riskProfile: {
      high: 38,
      medium: 45,
      low: 4173
    }
  };

  const keyAlerts = [
    {
      type: 'critical',
      count: 12,
      message: 'Expired permissions still in system',
      action: 'Immediate review required'
    },
    {
      type: 'warning',
      count: 45,
      message: 'Permits expiring within 30 days',
      action: 'Schedule follow-up checks'
    },
    {
      type: 'info',
      count: 23,
      message: 'New hires pending initial verification',
      action: 'Process within 5 working days'
    }
  ];

  const complianceTrends = [
    {
      period: 'Q4 2023',
      rate: 97.8,
      verifications: 680,
      issues: 15,
      trend: 'up'
    },
    {
      period: 'Q1 2024',
      rate: 98.5,
      verifications: 725,
      issues: 11,
      trend: 'up'
    },
    {
      period: 'Current',
      rate: 97.6,
      verifications: 268,
      issues: 8,
      trend: 'down'
    }
  ];

  return (
    <div className="dashboard-container">
      {/* Header with Key Stats */}
      <div className="dashboard-header">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Right to Work Compliance Overview</h1>
            <p className="text-gray-600">
              Overall Compliance Rate: 
              <span className="font-bold text-blue-600 ml-2">
                {((complianceMetrics.activeEmployees.byStatus.compliant / 
                   complianceMetrics.activeEmployees.total) * 100).toFixed(1)}%
              </span>
            </p>
          </div>
          <div className="flex space-x-4">
            <button className="action-button">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </button>
            <select 
              className="action-button"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last Quarter</option>
            </select>
          </div>
        </div>
      </div>

      {/* Critical Alerts Banner */}
      {keyAlerts.some(alert => alert.type === 'critical') && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3" />
            <div>
              <h4 className="font-semibold text-red-900">Critical Compliance Issues</h4>
              {keyAlerts
                .filter(alert => alert.type === 'critical')
                .map((alert, idx) => (
                  <p key={idx} className="text-red-800 mt-1">
                    {alert.count} {alert.message} - {alert.action}
                  </p>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white/80 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Active Workforce</h3>
            <UserCheck className="h-5 w-5 text-blue-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Employees</span>
              <span className="font-bold text-gray-900">{complianceMetrics.activeEmployees.total}</span>
            </div>
            <div className="flex justify-between items-center text-green-600">
              <span>Compliant</span>
              <span className="font-bold">{complianceMetrics.activeEmployees.byStatus.compliant}</span>
            </div>
            <div className="flex justify-between items-center text-yellow-600">
              <span>Pending Verification</span>
              <span className="font-bold">{complianceMetrics.activeEmployees.byStatus.pending}</span>
            </div>
            <div className="flex justify-between items-center text-red-600">
              <span>Non-Compliant</span>
              <span className="font-bold">{complianceMetrics.activeEmployees.byStatus.overdue}</span>
            </div>
          </div>
        </div>

        <div className="bg-white/80 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Risk Profile</h3>
            <AlertTriangle className="h-5 w-5 text-orange-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-red-600">
              <span>High Risk</span>
              <span className="font-bold">{complianceMetrics.riskProfile.high}</span>
            </div>
            <div className="flex justify-between items-center text-yellow-600">
              <span>Medium Risk</span>
              <span className="font-bold">{complianceMetrics.riskProfile.medium}</span>
            </div>
            <div className="flex justify-between items-center text-green-600">
              <span>Low Risk</span>
              <span className="font-bold">{complianceMetrics.riskProfile.low}</span>
            </div>
            <div className="flex justify-between items-center text-blue-600">
              <span>Total Monitored</span>
              <span className="font-bold">{complianceMetrics.activeEmployees.total}</span>
            </div>
          </div>
        </div>

        <div className="bg-white/80 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Verification Activity</h3>
            <Clock className="h-5 w-5 text-blue-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">This Month</span>
              <span className="font-bold text-gray-900">{complianceMetrics.verificationStats.thisMonth}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Last Month</span>
              <span className="font-bold text-gray-900">{complianceMetrics.verificationStats.lastMonth}</span>
            </div>
            <div className="flex justify-between items-center text-green-600">
              <span>Monthly Trend</span>
              <span className="font-bold">{complianceMetrics.verificationStats.trend}</span>
            </div>
          </div>
        </div>

        <div className="bg-white/80 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Action Items</h3>
            <AlertCircle className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="space-y-3">
            {keyAlerts.map((alert, idx) => (
              <div key={idx} className={`flex justify-between items-center ${
                alert.type === 'critical' ? 'text-red-600' :
                alert.type === 'warning' ? 'text-yellow-600' :
                'text-blue-600'
              }`}>
                <span>{alert.message}</span>
                <span className="font-bold">{alert.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compliance Trends */}
      <div className="bg-white/80 rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quarterly Compliance Trends</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {complianceTrends.map((quarter, idx) => (
            <div key={idx} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900">{quarter.period}</span>
                {quarter.trend === 'up' ? (
                  <ArrowUpRight className="h-5 w-5 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-5 w-5 text-red-500" />
                )}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Compliance Rate</span>
                  <span className="font-bold text-gray-900">{quarter.rate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Verifications</span>
                  <span className="font-medium text-gray-900">{quarter.verifications}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Issues Found</span>
                  <span className="font-medium text-red-600">{quarter.issues}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Required Section */}
      <div className="bg-white/80 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Immediate Action Required</h3>
        <div className="space-y-4">
          {keyAlerts.map((alert, idx) => (
            <div key={idx} className={`flex items-start p-4 rounded-lg ${
              alert.type === 'critical' ? 'bg-red-50' :
              alert.type === 'warning' ? 'bg-yellow-50' :
              'bg-blue-50'
            }`}>
              <AlertCircle className={`h-5 w-5 mt-0.5 mr-3 ${
                alert.type === 'critical' ? 'text-red-600' :
                alert.type === 'warning' ? 'text-yellow-600' :
                'text-blue-600'
              }`} />
              <div>
                <h4 className="font-semibold">{alert.message}</h4>
                <p className="text-sm mt-1">{alert.action}</p>
                <div className="mt-2">
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecruitingDashboard;
