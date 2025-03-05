import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { TrendingUp, Scale, Clock, FileText, AlertTriangle } from 'lucide-react';
import '../../../../components/Dashboard/dashboard.css';

const LegalForecastDashboard = () => {
  // Mock time series data for matter volume forecasting
  const [matterForecast] = useState([
    { month: 'Jan 2025', actual: 145, forecast: 150, lower: 140, upper: 160 },
    { month: 'Feb 2025', actual: 158, forecast: 165, lower: 155, upper: 175 },
    { month: 'Mar 2025', actual: null, forecast: 175, lower: 165, upper: 185 },
    { month: 'Apr 2025', actual: null, forecast: 185, lower: 175, upper: 195 },
    { month: 'May 2025', actual: null, forecast: 195, lower: 185, upper: 205 },
  ]);

  // Mock matter type distribution
  const [matterTypes] = useState([
    { name: 'Commercial', value: 35, color: '#2563eb' },
    { name: 'Employment', value: 25, color: '#059669' },
    { name: 'Regulatory', value: 20, color: '#d97706' },
    { name: 'IP', value: 20, color: '#7c3aed' },
  ]);

  // Mock complexity trends
  const [complexityTrends] = useState([
    { month: 'Jan', low: 45, medium: 65, high: 35 },
    { month: 'Feb', low: 40, medium: 70, high: 48 },
    { month: 'Mar', low: 35, medium: 75, high: 45 },
    { month: 'Apr', low: 30, medium: 80, high: 55 },
  ]);

  const metrics = [
    {
      title: 'Projected Monthly Matters',
      value: '185',
      trend: '+15.3%',
      icon: FileText,
      color: 'trend-up'
    },
    {
      title: 'Avg. Completion Time',
      value: '18.5 days',
      trend: '-2.1 days',
      icon: Clock,
      color: 'trend-down'
    },
    {
      title: 'Risk Level',
      value: 'Moderate',
      trend: 'Stable',
      icon: AlertTriangle,
      color: 'trend-neutral'
    }
  ];

  return (
    <div className="operations-command">
      {/* Header Metrics */}
      <div className="row">
        {metrics.map((metric, index) => (
          <div key={index} className="card">
            <div className="card-content">
              <div className="metric-card">
                <p className="metric-header">{metric.title}</p>
                <h3 className="metric-value">{metric.value}</h3>
                <div className="metric-trend">
                  <TrendingUp className="w-4 h-4" />
                  <span className={metric.color}>{metric.trend}</span>
                </div>
                <metric.icon className="w-8 h-8" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="row">
        {/* Matter Volume Forecast */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Matter Volume Forecast</h3>
          </div>
          <div className="card-content">
            <div style={{ height: '320px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={matterForecast}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#2563eb" 
                    strokeWidth={2} 
                    name="Actual Volume" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="forecast" 
                    stroke="#059669" 
                    strokeWidth={2} 
                    name="Forecast" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="upper" 
                    stroke="#d1d5db" 
                    strokeDasharray="3 3" 
                    name="Upper Bound" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="lower" 
                    stroke="#d1d5db" 
                    strokeDasharray="3 3" 
                    name="Lower Bound" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Matter Type Distribution */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Matter Type Distribution</h3>
          </div>
          <div className="card-content">
            <div style={{ height: '320px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={matterTypes}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {matterTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Complexity Trends */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Matter Complexity Trends</h3>
          </div>
          <div className="card-content">
            <div style={{ height: '320px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={complexityTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="low" stackId="a" fill="#059669" name="Low Complexity" />
                  <Bar dataKey="medium" stackId="a" fill="#2563eb" name="Medium Complexity" />
                  <Bar dataKey="high" stackId="a" fill="#dc2626" name="High Complexity" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalForecastDashboard;
