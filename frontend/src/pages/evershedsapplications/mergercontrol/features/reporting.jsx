import React, { useState, useEffect } from 'react';
import { useConfig } from '../../../../context/ConfigContext';
import { fetchFromAPI } from '../../../../utils/api/api';
import { 
  AlertCircle, BarChart2, Flag, FileText, Clock,
  DollarSign, Globe, Scale, AlertTriangle
} from 'lucide-react';

const DealCard = ({ deal }) => (
  <div className="bg-white rounded-lg p-4 shadow mb-3">
    <div className="flex justify-between items-center mb-2">
      <h4 className="font-semibold text-royal-blue">{deal.code_name}</h4>
      <span className={`text-sm px-2 py-1 rounded ${
        deal.status === 'Phase II Review' ? 'bg-orange-100 text-orange-800' :
        deal.status === 'Cleared' ? 'bg-green-100 text-green-800' :
        'bg-blue-100 text-royal-blue'
      }`}>
        {deal.status}
      </span>
    </div>
    <div className="flex justify-between items-center text-sm text-teal mb-2">
      <span>{deal.target_name}</span>
      <span>{deal.deal_size}</span>
    </div>
    <div className="text-sm text-teal mb-2">Key Markets: {deal.key_jurisdictions}</div>
    <div className="w-full bg-light-ivory rounded-full h-2.5">
      <div 
        className="bg-royal-blue h-2.5 rounded-full transition-all duration-500" 
        style={{ width: `${deal.completion}%` }}
      ></div>
    </div>
  </div>
);

const MetricCard = ({ metric }) => (
  <div className="bg-white rounded-lg p-4 shadow">
    <div className="text-sm text-teal">{metric.title}</div>
    <div className="text-2xl font-bold text-royal-blue mt-1">{metric.value}</div>
    <div className="text-sm mt-1 text-teal">
      {metric.detail}
    </div>
  </div>
);

const RegulatoryAlert = ({ alert }) => (
  <div className="bg-white rounded-lg p-4 shadow mb-3">
    <div className="flex justify-between items-center mb-2">
      <span className={`text-sm px-2 py-1 rounded ${
        alert.severity === 'Critical' ? 'bg-red-100 text-red-800' :
        alert.severity === 'High' ? 'bg-orange-100 text-orange-800' :
        'bg-yellow-100 text-yellow-800'
      }`}>
        {alert.severity}
      </span>
      <span className="text-sm text-teal">{alert.date}</span>
    </div>
    <div className="text-sm text-royal-blue font-semibold mb-1">{alert.project}</div>
    <div className="text-sm text-royal-blue">{alert.message}</div>
    <div className="text-xs text-teal mt-2">Region: {alert.jurisdiction}</div>
  </div>
);

const TimelineFlag = ({ flag }) => (
  <div className="bg-white rounded-lg p-4 shadow mb-3">
    <div className="flex justify-between items-center">
      <h4 className="font-semibold text-royal-blue">{flag.project}</h4>
      <span className="text-sm text-red-600">{flag.days_remaining} days remaining</span>
    </div>
    <div className="text-sm text-teal mt-2">{flag.milestone}</div>
    <div className="text-sm text-royal-blue mt-1">{flag.next_steps}</div>
  </div>
);

const MergerControlDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    active_deals: [
      {
        code_name: "Project Gelato",
        target_name: "Creamy Delights Ltd.",
        deal_size: "$850M",
        key_jurisdictions: "US, EU, UK",
        status: "Phase I Review",
        completion: 65
      },
      {
        code_name: "Project Phoenix",
        target_name: "Digital Solutions AG",
        deal_size: "$3.5B",
        key_jurisdictions: "US, EU, China",
        status: "Phase II Review",
        completion: 45
      },
      {
        code_name: "Project Quantum",
        target_name: "Advanced Semiconductors",
        deal_size: "$4.2B",
        key_jurisdictions: "US, EU, Japan",
        status: "Pre-Filing",
        completion: 20
      }
    ],
    metrics: [
      {
        title: "Total Active Deals",
        value: "9",
        detail: "3 in Phase I, 1 in Phase II"
      },
      {
        title: "Aggregate Deal Value",
        value: "$12.8B",
        detail: "Across all active transactions"
      },
      {
        title: "Filing Success Rate",
        value: "96%",
        detail: "Last 12 months"
      },
      {
        title: "Average Timeline",
        value: "142 days",
        detail: "From announcement to clearance"
      }
    ],
    regulatory_alerts: [
      {
        severity: "Critical",
        project: "Project Phoenix",
        message: "Phase II investigation launched by EU Commission",
        jurisdiction: "European Union",
        date: "Today"
      },
      {
        severity: "High",
        project: "Project Quantum",
        message: "Additional information request from CFIUS",
        jurisdiction: "United States",
        date: "Yesterday"
      },
      {
        severity: "Medium",
        project: "Project Gelato",
        message: "Market testing feedback suggests potential concerns",
        jurisdiction: "Germany",
        date: "2 days ago"
      }
    ],
    timeline_flags: [
      {
        project: "Project Gelato",
        milestone: "US HSR Waiting Period Expiry",
        days_remaining: 12,
        next_steps: "Prepare for potential second request"
      },
      {
        project: "Project Phoenix",
        milestone: "EU Phase II Deadline",
        days_remaining: 45,
        next_steps: "Submit remedies package"
      },
      {
        project: "Project Quantum",
        milestone: "Filing Deadline",
        days_remaining: 5,
        next_steps: "Complete draft notifications"
      }
    ]
  });

  return (
    <div className="p-6 bg-ivory min-h-screen">
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {dashboardData.metrics.map((metric, index) => (
          <MetricCard key={index} metric={metric} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Active Deals */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Scale className="w-5 h-5 mr-2 text-royal-blue" />
            <h3 className="text-lg font-semibold text-royal-blue">Priority Transactions</h3>
          </div>
          <div>
            {dashboardData.active_deals.map((deal, index) => (
              <DealCard key={index} deal={deal} />
            ))}
          </div>
        </div>

        {/* Timeline Flags */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Clock className="w-5 h-5 mr-2 text-royal-blue" />
            <h3 className="text-lg font-semibold text-royal-blue">Critical Deadlines</h3>
          </div>
          <div>
            {dashboardData.timeline_flags.map((flag, index) => (
              <TimelineFlag key={index} flag={flag} />
            ))}
          </div>
        </div>
      </div>

      {/* Regulatory Alerts */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <AlertTriangle className="w-5 h-5 mr-2 text-royal-blue" />
          <h3 className="text-lg font-semibold text-royal-blue">Regulatory Alerts</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dashboardData.regulatory_alerts.map((alert, index) => (
            <RegulatoryAlert key={index} alert={alert} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MergerControlDashboard;
