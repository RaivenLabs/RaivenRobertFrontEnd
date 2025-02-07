import React, { useState } from 'react';
import { 
  UserCheck, AlertTriangle, Clock, Activity,
  Download, RefreshCw, MessageCircle, Search,
  AlertCircle, CheckCircle, XCircle, Calendar,
  ArrowUpRight, ArrowDownRight, Heart, Zap,
  Settings, Users, FileText, HelpCircle
} from 'lucide-react';

const ConciergeDashboard = () => {
  const [timeframe, setTimeframe] = useState('7days');
  
  // Mock data for concierge metrics
  const platformMetrics = {
    activeCustomers: {
      total: 124,
      byStatus: {
        active: 112,
        onboarding: 8,
        needsAttention: 4
      }
    },
    supportStats: {
      openRequests: 15,
      avgResponseTime: '1.2h',
      customerSatisfaction: '98%',
      activeChats: 3
    },
    systemHealth: {
      uptime: '99.99%',
      performance: 'Optimal',
      activeAlerts: 2,
      pendingUpdates: 1
    }
  };

  const priorityAlerts = [
    {
      type: 'critical',
      count: 2,
      message: 'Customer needs immediate assistance',
      customer: 'Fortune 500 Corp'
    },
    {
      type: 'warning',
      count: 4,
      message: 'New feature requests pending review',
      customer: 'Various'
    },
    {
      type: 'info',
      count: 8,
      message: 'Customers in onboarding phase',
      customer: 'Multiple'
    }
  ];

  const customerSatisfaction = [
    {
      period: 'Last Week',
      rating: 98.5,
      interactions: 245,
      issues: 3,
      trend: 'up'
    },
    {
      period: 'This Week',
      rating: 99.1,
      interactions: 182,
      issues: 2,
      trend: 'up'
    },
    {
      period: 'Today',
      rating: 100,
      interactions: 45,
      issues: 0,
      trend: 'up'
    }
  ];

  return (
    <div className="dashboard-container">
      {/* Header with Key Stats */}
      <div className="dashboard-header">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Concierge Command Center</h1>
            <p className="text-gray-600">
              Platform Health Score: 
              <span className="font-bold text-blue-600 ml-2">98.5%</span>
            </p>
          </div>
          <div className="flex space-x-4">
            <button className="action-button">
              <Download className="h-4 w-4 mr-2" />
              Export Insights
            </button>
            <select 
              className="action-button"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Critical Alerts Banner */}
      {priorityAlerts.some(alert => alert.type === 'critical') && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3" />
            <div>
              <h4 className="font-semibold text-red-900">Priority Attention Required</h4>
              {priorityAlerts
                .filter(alert => alert.type === 'critical')
                .map((alert, idx) => (
                  <p key={idx} className="text-red-800 mt-1">
                    {alert.customer}: {alert.message}
                  </p>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Customer Engagement */}
        <div className="bg-white/80 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Customer Pulse</h3>
            <Heart className="h-5 w-5 text-pink-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Customers</span>
              <span className="font-bold text-gray-900">{platformMetrics.activeCustomers.total}</span>
            </div>
            <div className="flex justify-between items-center text-green-600">
              <span>Active & Healthy</span>
              <span className="font-bold">{platformMetrics.activeCustomers.active}</span>
            </div>
            <div className="flex justify-between items-center text-yellow-600">
              <span>Onboarding</span>
              <span className="font-bold">{platformMetrics.activeCustomers.onboarding}</span>
            </div>
            <div className="flex justify-between items-center text-red-600">
              <span>Needs Attention</span>
              <span className="font-bold">{platformMetrics.activeCustomers.needsAttention}</span>
            </div>
          </div>
        </div>

        {/* Support Activity */}
        <div className="bg-white/80 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Support Activity</h3>
            <MessageCircle className="h-5 w-5 text-blue-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-blue-600">
              <span>Open Requests</span>
              <span className="font-bold">{platformMetrics.supportStats.openRequests}</span>
            </div>
            <div className="flex justify-between items-center text-green-600">
              <span>Avg Response Time</span>
              <span className="font-bold">{platformMetrics.supportStats.avgResponseTime}</span>
            </div>
            <div className="flex justify-between items-center text-purple-600">
              <span>Active Chats</span>
              <span className="font-bold">{platformMetrics.supportStats.activeChats}</span>
            </div>
            <div className="flex justify-between items-center text-pink-600">
              <span>Satisfaction Rate</span>
              <span className="font-bold">{platformMetrics.supportStats.customerSatisfaction}</span>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white/80 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Platform Health</h3>
            <Activity className="h-5 w-5 text-green-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-green-600">
              <span>Uptime</span>
              <span className="font-bold">{platformMetrics.systemHealth.uptime}</span>
            </div>
            <div className="flex justify-between items-center text-blue-600">
              <span>Performance</span>
              <span className="font-bold">{platformMetrics.systemHealth.performance}</span>
            </div>
            <div className="flex justify-between items-center text-yellow-600">
              <span>Active Alerts</span>
              <span className="font-bold">{platformMetrics.systemHealth.activeAlerts}</span>
            </div>
            <div className="flex justify-between items-center text-purple-600">
              <span>Pending Updates</span>
              <span className="font-bold">{platformMetrics.systemHealth.pendingUpdates}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/80 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            <Zap className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="space-y-3">
            <button className="w-full text-left px-3 py-2 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
              <span className="flex items-center">
                <MessageCircle className="h-4 w-4 mr-2" />
                Start Customer Chat
              </span>
            </button>
            <button className="w-full text-left px-3 py-2 rounded bg-green-50 text-green-700 hover:bg-green-100 transition-colors">
              <span className="flex items-center">
                <UserCheck className="h-4 w-4 mr-2" />
                Review Health Checks
              </span>
            </button>
            <button className="w-full text-left px-3 py-2 rounded bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors">
              <span className="flex items-center">
                <HelpCircle className="h-4 w-4 mr-2" />
                View Help Requests
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Operational Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Matter Activity */}
        <div className="bg-white/80 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Matter Activity</h3>
            <FileText className="h-5 w-5 text-blue-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Active Matters</span>
              <span className="font-bold text-gray-900">248</span>
            </div>
            <div className="flex justify-between items-center text-green-600">
              <span>New Matters (Last 30 Days)</span>
              <span className="font-bold">42</span>
            </div>
            <div className="flex justify-between items-center text-blue-600">
              <span>Matters In Progress</span>
              <span className="font-bold">186</span>
            </div>
            <div className="flex justify-between items-center text-purple-600">
              <span>Recently Closed (30 Days)</span>
              <span className="font-bold">20</span>
            </div>
          </div>
        </div>

        {/* Service Activity */}
        <div className="bg-white/80 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Service Activity</h3>
            <Clock className="h-5 w-5 text-indigo-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-indigo-600">
              <span>Total Billable Hours (MTD)</span>
              <span className="font-bold">1,245</span>
            </div>
            <div className="flex justify-between items-center text-blue-600">
              <span>Active Service Providers</span>
              <span className="font-bold">32</span>
            </div>
            <div className="flex justify-between items-center text-green-600">
              <span>Avg Hours Per Matter</span>
              <span className="font-bold">18.5</span>
            </div>
            <div className="flex justify-between items-center text-purple-600">
              <span>Pending Time Entries</span>
              <span className="font-bold">45</span>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Billing Status */}
        <div className="bg-white/80 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Billing Status</h3>
            <Settings className="h-5 w-5 text-green-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-yellow-600">
              <span>Pending Billing</span>
              <span className="font-bold">$124,500</span>
            </div>
            <div className="flex justify-between items-center text-green-600">
              <span>Billed This Month</span>
              <span className="font-bold">$285,750</span>
            </div>
            <div className="flex justify-between items-center text-red-600">
              <span>Outstanding AR</span>
              <span className="font-bold">$78,250</span>
            </div>
            <div className="flex justify-between items-center text-blue-600">
              <span>YTD Collections</span>
              <span className="font-bold">$2.4M</span>
            </div>
          </div>
        </div>

        {/* Platform Usage */}
        <div className="bg-white/80 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Platform Metrics</h3>
            <Users className="h-5 w-5 text-blue-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-blue-600">
              <span>Active Users</span>
              <span className="font-bold">1,245</span>
            </div>
            <div className="flex justify-between items-center text-green-600">
              <span>New Subscriptions (MTD)</span>
              <span className="font-bold">28</span>
            </div>
            <div className="flex justify-between items-center text-purple-600">
              <span>Subscription Revenue</span>
              <span className="font-bold">$156,750</span>
            </div>
            <div className="flex justify-between items-center text-yellow-600">
              <span>Pending Upgrades</span>
              <span className="font-bold">12</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Satisfaction Trends */}
      <div className="bg-white/80 rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Satisfaction Trends</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {customerSatisfaction.map((period, idx) => (
            <div key={idx} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900">{period.period}</span>
                {period.trend === 'up' ? (
                  <ArrowUpRight className="h-5 w-5 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-5 w-5 text-red-500" />
                )}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">CSAT Score</span>
                  <span className="font-bold text-gray-900">{period.rating}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Interactions</span>
                  <span className="font-medium text-gray-900">{period.interactions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Issues</span>
                  <span className="font-medium text-red-600">{period.issues}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Issues and Requests */}
      <div className="bg-white/80 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Issues & Requests</h3>
        <div className="space-y-4">
          {priorityAlerts.map((alert, idx) => (
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
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{alert.message}</h4>
                    <p className="text-sm mt-1">Customer: {alert.customer}</p>
                  </div>
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                    Take Action →
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

export default ConciergeDashboard;
