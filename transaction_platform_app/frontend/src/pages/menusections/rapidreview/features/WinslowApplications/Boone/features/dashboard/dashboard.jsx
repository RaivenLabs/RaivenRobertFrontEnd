// src/pages/menusections/flightdeck/features/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useConfig } from '../../../../../../../../context/ConfigContext';
import { fetchFromAPI } from '../../../../../../../../utils/api/api';  // Add this import
import { AlertCircle, BarChart2, Flag, FileText, MessageSquare } from 'lucide-react';

const ProjectCard = ({ project }) => (
  <div className="bg-white rounded-lg p-4 shadow mb-3">
    <div className="flex justify-between items-center mb-2">
      <h4 className="font-semibold text-royal-blue">{project.title}</h4>
      <span className="text-sm px-2 py-1 bg-blue-100 text-royal-blue rounded">{project.status}</span>
    </div>
    <div className="flex justify-between items-center text-sm text-teal mb-2">
      <span>Lead: {project.lead}</span>
      <span>{project.value}</span>
    </div>
    <div className="w-full bg-light-ivory rounded-full h-2.5">
      <div 
        className="bg-royal-blue h-2.5 rounded-full transition-all duration-500" 
        style={{ width: `${project.completion}%` }}
      ></div>
    </div>
  </div>
);

const MetricCard = ({ metric }) => (
  <div className="bg-white rounded-lg p-4 shadow">
    <div className="text-sm text-teal">{metric.title}</div>
    <div className="text-2xl font-bold text-royal-blue mt-1">{metric.value}</div>
    <div className={`text-sm mt-1 ${metric.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
      {metric.trend}
    </div>
  </div>
);

const FlagCard = ({ flag }) => (
  <div className="bg-white rounded-lg p-4 shadow mb-3">
    <div className="flex justify-between items-center">
      <h4 className="font-semibold text-royal-blue">{flag.title}</h4>
      <span className={`text-xs px-2 py-1 rounded ${
        flag.priority === 'Critical' ? 'bg-red-100 text-red-800' :
        flag.priority === 'High' ? 'bg-orange-100 text-orange-800' :
        'bg-yellow-100 text-yellow-800'
      }`}>
        {flag.priority}
      </span>
    </div>
    <div className="text-sm text-teal mt-2">Due: {flag.dueDate}</div>
    <div className="text-sm text-teal">Owner: {flag.owner}</div>
    <div className="text-sm text-royal-blue mt-1">{flag.impact}</div>
  </div>
);

const AlertCard = ({ alert }) => (
  <div className="bg-white rounded-lg p-4 shadow mb-3">
    <div className="flex justify-between items-center mb-2">
      <span className={`text-sm px-2 py-1 rounded ${
        alert.action_required ? 'bg-red-100 text-red-800' : 'bg-light-ivory text-royal-blue'
      }`}>
        {alert.type}
      </span>
      <span className="text-sm text-teal">{alert.timestamp}</span>
    </div>
    <div className="text-sm text-royal-blue">{alert.message}</div>
    <div className="text-xs text-teal mt-2">Category: {alert.category}</div>
  </div>
);

const SystemHealthIndicator = ({ health }) => (
  <div className="mt-4 grid grid-cols-3 gap-4">
    {Object.entries(health).map(([system, data]) => (
      <div key={system} className="bg-white rounded-lg p-4 shadow">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-semibold capitalize text-royal-blue">{system.replace(/_/g, ' ')}</h4>
          <span className={`px-2 py-1 rounded text-xs ${
            data.status === 'Healthy' ? 'bg-green-100 text-green-800' :
            data.status === 'Attention' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {data.status}
          </span>
        </div>
        {Object.entries(data).map(([key, value]) => (
          key !== 'status' && (
            <div key={key} className="text-sm text-teal">
              <span className="capitalize">{key.replace(/_/g, ' ')}:</span> {value}
            </div>
          )
        ))}
      </div>
    ))}
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

const BooneDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    projects: [],
    metrics: [],
    flags: [],
    alerts: [],
    system_health: {}
  });
  
  const { coreconfig } = useConfig();  // Get both coreconfig and config
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // fetchFromAPI already handles response.ok check and json parsing
       
       const data = await fetchFromAPI(
                 `/flightdeck/dashboard`, 
                 coreconfig.apiUrl
               );
       
       
       
   
        if (data.error) {
          throw new Error(data.error);
        }
        setDashboardData(data);
        setError(null);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [coreconfig.apiUrl]);  // Add this dependency

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <div className="p-6 bg-ivory min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Projects Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <FileText className="w-5 h-5 mr-2 text-royal-blue" />
            <h3 className="text-lg font-semibold text-royal-blue">Active Projects</h3>
          </div>
          <div>
            {dashboardData.projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>

        {/* Metrics Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <BarChart2 className="w-5 h-5 mr-2 text-royal-blue" />
            <h3 className="text-lg font-semibold text-royal-blue">Key Metrics</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {dashboardData.metrics.map((metric, index) => (
              <MetricCard key={index} metric={metric} />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Flags Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Flag className="w-5 h-5 mr-2 text-royal-blue" />
            <h3 className="text-lg font-semibold text-royal-blue">Flags</h3>
          </div>
          <div>
            {dashboardData.flags.map(flag => (
              <FlagCard key={flag.id} flag={flag} />
            ))}
          </div>
        </div>

        {/* Alerts Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <AlertCircle className="w-5 h-5 mr-2 text-royal-blue" />
            <h3 className="text-lg font-semibold text-royal-blue">Alerts</h3>
          </div>
          <div>
            {dashboardData.alerts.map(alert => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </div>

        {/* System Requests Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <MessageSquare className="w-5 h-5 mr-2 text-royal-blue" />
            <h3 className="text-lg font-semibold text-royal-blue">System Requests</h3>
          </div>
          <div className="text-center p-4">
            <h4 className="font-semibold text-royal-blue mb-2">Submit Feature Request</h4>
            <p className="text-teal mb-4">Help us improve the platform by suggesting new features</p>
            <button 
              className="bg-royal-blue text-white px-4 py-2 rounded hover:bg-royal-blue-hover transition-colors"
              onClick={() => alert('Feature request functionality coming soon!')}
            >
              New Request
            </button>
          </div>
        </div>
      </div>

      {/* System Health Section */}
      {dashboardData.system_health && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-royal-blue mb-4">System Health</h3>
          <SystemHealthIndicator health={dashboardData.system_health} />
        </div>
      )}
    </div>
  );
};

export default BooneDashboard;
