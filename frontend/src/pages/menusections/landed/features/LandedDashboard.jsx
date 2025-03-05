// src/pages/menusections/landed/features/LandedDashboard.jsx
import React, { useState, useEffect } from 'react';
import { AlertCircle, FileText, Flag, BarChart2, Calendar, Users, BookOpen } from 'lucide-react';

// Mock data
const mockDashboardData = {
  vendors: [
    {
      id: 1,
      name: "Adobe Systems",
      status: "Active",
      agreement_id: "MSA-2024-001",
      expiry_date: "Dec 2024",
      active_orders: 5,
      pending_changes: 2
    },
    {
      id: 2,
      name: "Microsoft Corporation",
      status: "Review Required",
      agreement_id: "MSA-2023-089",
      expiry_date: "Mar 2024",
      active_orders: 12,
      pending_changes: 3
    }
  ],
  compliance_metrics: [
    {
      title: "GDPR Compliance",
      value: "93%",
      next_review: "Mar 15, 2024"
    },
    {
      title: "AI Policy Updates",
      value: "4",
      next_review: "Immediate"
    },
    {
      title: "Vendor Assessments",
      value: "87%",
      next_review: "Apr 1, 2024"
    },
    {
      title: "Payment Terms",
      value: "95%",
      next_review: "May 2024"
    }
  ],
  required_actions: [
    {
      id: 1,
      title: "GDPR Documentation Update",
      deadline_days: 15,
      vendor: "Adobe Systems",
      type: "Compliance",
      description: "Update DPA for new data processing requirements"
    },
    {
      id: 2,
      title: "Payment Terms Amendment",
      deadline_days: 7,
      vendor: "Microsoft",
      type: "Contract Update",
      description: "Implement new NET-60 payment terms"
    },
    {
      id: 3,
      title: "AI Risk Assessment",
      deadline_days: 30,
      vendor: "OpenAI",
      type: "Policy",
      description: "Complete AI usage risk assessment"
    }
  ],
  policy_updates: [
    {
      id: 1,
      category: "Data Privacy",
      impact: "High",
      effective_date: "Mar 1, 2024",
      description: "New AI data processing requirements",
      affected_agreements: 12
    },
    {
      id: 2,
      category: "Payment Terms",
      impact: "Medium",
      effective_date: "Apr 1, 2024",
      description: "Updated payment terms policy",
      affected_agreements: 8
    }
  ],
  upcoming_events: [
    {
      id: 1,
      title: "Annual Review",
      date: "Feb 15, 2024",
      vendor: "Adobe Systems",
      description: "Comprehensive service level review"
    },
    {
      id: 2,
      title: "Compliance Workshop",
      date: "Mar 1, 2024",
      vendor: "All Vendors",
      description: "New data privacy requirements briefing"
    }
  ]
};

// Component definitions
const VendorCard = ({ vendor }) => (
  <div className="bg-white rounded-lg p-4 shadow mb-3">
    <div className="flex justify-between items-center mb-2">
      <h4 className="font-semibold text-royal-blue">{vendor.name}</h4>
      <span className={`text-sm px-2 py-1 rounded ${
        vendor.status === 'Active' ? 'bg-green-100 text-green-800' :
        vendor.status === 'Review Required' ? 'bg-yellow-100 text-yellow-800' :
        'bg-red-100 text-red-800'
      }`}>
        {vendor.status}
      </span>
    </div>
    <div className="flex justify-between items-center text-sm text-teal mb-2">
      <span>Master Agreement: {vendor.agreement_id}</span>
      <span>Expires: {vendor.expiry_date}</span>
    </div>
    <div className="text-sm text-teal">
      Active Orders: {vendor.active_orders} | Pending Changes: {vendor.pending_changes}
    </div>
  </div>
);

const ComplianceCard = ({ metric }) => (
  <div className="bg-white rounded-lg p-4 shadow">
    <div className="text-sm text-teal">{metric.title}</div>
    <div className="text-2xl font-bold text-royal-blue mt-1">{metric.value}</div>
    <div className="text-sm mt-1">
      Next Review: {metric.next_review}
    </div>
  </div>
);

const ActionCard = ({ action }) => (
  <div className="bg-white rounded-lg p-4 shadow mb-3">
    <div className="flex justify-between items-center">
      <h4 className="font-semibold text-royal-blue">{action.title}</h4>
      <span className={`text-xs px-2 py-1 rounded ${
        action.deadline_days <= 7 ? 'bg-red-100 text-red-800' :
        action.deadline_days <= 30 ? 'bg-orange-100 text-orange-800' :
        'bg-blue-100 text-royal-blue'
      }`}>
        {action.deadline_days} days
      </span>
    </div>
    <div className="text-sm text-teal mt-2">Vendor: {action.vendor}</div>
    <div className="text-sm text-teal">Type: {action.type}</div>
    <div className="text-sm text-royal-blue mt-1">{action.description}</div>
  </div>
);

const PolicyUpdateCard = ({ update }) => (
  <div className="bg-white rounded-lg p-4 shadow mb-3">
    <div className="flex justify-between items-center mb-2">
      <span className={`text-sm px-2 py-1 rounded ${
        update.impact === 'High' ? 'bg-red-100 text-red-800' :
        update.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
        'bg-green-100 text-green-800'
      }`}>
        {update.category}
      </span>
      <span className="text-sm text-teal">Effective: {update.effective_date}</span>
    </div>
    <div className="text-sm text-royal-blue">{update.description}</div>
    <div className="text-xs text-teal mt-2">
      Affected Agreements: {update.affected_agreements}
    </div>
  </div>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-royal-blue"></div>
  </div>
);

const ErrorDisplay = ({ error }) => (
  <div className="p-6">
    <div className="bg-red-50 border-l-4 border-red-500 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-700">
            Error loading dashboard data: {error}
          </p>
        </div>
      </div>
    </div>
  </div>
);

// Main Dashboard Component
const LandedDashboard = () => {
  const [dashboardData, setDashboardData] = useState(mockDashboardData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
          setDashboardData(mockDashboardData);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <div className="p-6 bg-ivory min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Key Vendors Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Users className="w-5 h-5 mr-2 text-royal-blue" />
            <h3 className="text-lg font-semibold text-royal-blue">Key Vendor Agreements</h3>
          </div>
          <div>
            {dashboardData.vendors.map(vendor => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        </div>

        {/* Compliance Metrics */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <BarChart2 className="w-5 h-5 mr-2 text-royal-blue" />
            <h3 className="text-lg font-semibold text-royal-blue">Compliance Overview</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {dashboardData.compliance_metrics.map((metric, index) => (
              <ComplianceCard key={index} metric={metric} />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Required Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Flag className="w-5 h-5 mr-2 text-royal-blue" />
            <h3 className="text-lg font-semibold text-royal-blue">Required Actions</h3>
          </div>
          <div>
            {dashboardData.required_actions.map(action => (
              <ActionCard key={action.id} action={action} />
            ))}
          </div>
        </div>

        {/* Policy Updates */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <BookOpen className="w-5 h-5 mr-2 text-royal-blue" />
            <h3 className="text-lg font-semibold text-royal-blue">Policy Updates</h3>
          </div>
          <div>
            {dashboardData.policy_updates.map(update => (
              <PolicyUpdateCard key={update.id} update={update} />
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Calendar className="w-5 h-5 mr-2 text-royal-blue" />
            <h3 className="text-lg font-semibold text-royal-blue">Upcoming Events</h3>
          </div>
          <div>
            {dashboardData.upcoming_events.map(event => (
              <div key={event.id} className="bg-white rounded-lg p-4 shadow mb-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-royal-blue">{event.title}</span>
                  <span className="text-sm text-teal">{event.date}</span>
                </div>
                <div className="text-sm text-teal">Vendor: {event.vendor}</div>
                <div className="text-sm text-royal-blue">{event.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandedDashboard;
