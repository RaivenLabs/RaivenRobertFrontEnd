import React, { useState } from 'react';
// To:

import { Alert, AlertDescription } from "../../../../../components/ui/alert";
import { 
  BarChart, 
  Activity, 
  AlertCircle, 
  FileText, 
  Users, 
  Building, 
  Calendar,
  Download,
  Upload,
  Filter
} from 'lucide-react';

const EUCSDDDashboard = () => {
  const [selectedEntity, setSelectedEntity] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('2024');

  // Sample data for dashboard
  const complianceMetrics = [
    {
      title: "Overall Compliance Score",
      value: "87%",
      change: "+3%",
      icon: <Activity className="h-6 w-6 text-blue-600" />
    },
    {
      title: "Risk Areas Identified",
      value: "12",
      change: "-2",
      icon: <AlertCircle className="h-6 w-6 text-yellow-600" />
    },
    {
      title: "Due Diligence Actions",
      value: "45",
      change: "+8",
      icon: <FileText className="h-6 w-6 text-green-600" />
    },
    {
      title: "Stakeholder Engagements",
      value: "28",
      change: "+5",
      icon: <Users className="h-6 w-6 text-purple-600" />
    }
  ];

  const entityData = [
    {
      entity: "EU Manufacturing Division",
      employeeCount: "2,500",
      turnover: "€280M",
      riskLevel: "Medium",
      nextReview: "2024-05-15",
      status: "Compliant"
    },
    {
      entity: "Global Supply Chain Operations",
      employeeCount: "1,800",
      turnover: "€175M",
      riskLevel: "High",
      nextReview: "2024-04-30",
      status: "Review Required"
    },
    {
      entity: "Eastern Europe Distribution",
      employeeCount: "620",
      turnover: "€85M",
      riskLevel: "Low",
      nextReview: "2024-06-10",
      status: "Compliant"
    }
  ];

  return (
    <div className="table-reporting">
      {/* Header Section */}
      <div className="flex justify-between items-center panel-title">
        <div className="flex items-center gap-2">
          <Building className="h-6 w-6" />
          <h1>CSDD Compliance Dashboard</h1>
        </div>
        <div className="flex gap-4">
          <select 
            className="form-select"
            value={selectedEntity}
            onChange={(e) => setSelectedEntity(e.target.value)}
          >
            <option value="all">All Entities</option>
            <option value="eu">EU Entities</option>
            <option value="global">Global Operations</option>
          </select>
          <select 
            className="form-select"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {complianceMetrics.map((metric, index) => (
          <div key={index} className="summary-card">
            <div className="flex items-center justify-between mb-2">
              {metric.icon}
              <span className={`text-sm ${
                metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change}
              </span>
            </div>
            <h3>{metric.title}</h3>
            <p className="text-2xl font-bold text-gray-800">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Main Table */}
      <div className="table-container">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Entity Compliance Status</h2>
          <div className="flex gap-2">
            <button className="action-button flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </button>
            <button className="import-button">
              <Download className="h-4 w-4" />
              Export Report
            </button>
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Entity Name</th>
              <th>Employee Count</th>
              <th>Annual Turnover</th>
              <th>Risk Level</th>
              <th>Next Review</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entityData.map((row, index) => (
              <tr key={index}>
                <td>{row.entity}</td>
                <td>{row.employeeCount}</td>
                <td>{row.turnover}</td>
                <td>
                  <span className={`status-indicator ${
                    row.riskLevel === 'High' ? 'bg-red-100 text-red-800' :
                    row.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {row.riskLevel}
                  </span>
                </td>
                <td>{row.nextReview}</td>
                <td>
                  <span className={`status-indicator ${
                    row.status === 'Compliant' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {row.status}
                  </span>
                </td>
                <td>
                  <button className="action-button">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upcoming Reviews Alert */}
      <Alert className="mt-6 bg-blue-50 border-blue-200">
        <Calendar className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Upcoming Reviews:</strong> 3 entities require review in the next 30 days.
          Schedule your assessments to maintain compliance status.
        </AlertDescription>
      </Alert>

      {/* Dashboard Actions */}
      <div className="dashboard-actions">
        <button className="import-button">
          <Upload className="h-4 w-4" />
          Import Data
        </button>
        <button className="action-button">
          Schedule Review
        </button>
      </div>
    </div>
  );
};

export default EUCSDDDashboard;
