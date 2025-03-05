import React, { useState } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, DollarSign, Users, ShoppingCart, AlertTriangle } from 'lucide-react';
import '../../../../components/Dashboard/dashboard.css';

const SourcingForecastDashboard = () => {
  // Mock time series data for spend forecasting
  const [spendForecast] = useState([
    { month: 'Jan 2025', actual: 2.1, forecast: 2.2, lower: 2.0, upper: 2.4 },
    { month: 'Feb 2025', actual: 2.3, forecast: 2.4, lower: 2.2, upper: 2.6 },
    { month: 'Mar 2025', actual: null, forecast: 2.6, lower: 2.4, upper: 2.8 },
    { month: 'Apr 2025', actual: null, forecast: 2.8, lower: 2.6, upper: 3.0 },
    { month: 'May 2025', actual: null, forecast: 3.0, lower: 2.8, upper: 3.2 },
  ]);

  // Mock vendor risk data
  const [riskData] = useState([
    { category: 'High Risk', value: 12, trend: '+2' },
    { category: 'Medium Risk', value: 45, trend: '-5' },
    { category: 'Low Risk', value: 156, trend: '+8' },
  ]);

  // Mock category spend data
  const [categorySpend] = useState([
    { category: 'IT Services', spend: 850000, forecast: 920000 },
    { category: 'Professional Services', spend: 620000, forecast: 680000 },
    { category: 'Software', spend: 450000, forecast: 510000 },
    { category: 'Hardware', spend: 380000, forecast: 420000 },
  ]);

  const metrics = [
    {
      title: 'Projected Q2 Spend',
      value: '$8.4M',
      trend: '+12.3%',
      icon: DollarSign,
      color: 'trend-up'
    },
    {
      title: 'Active Vendors',
      value: '213',
      trend: '-2.1%',
      icon: Users,
      color: 'trend-down'
    },
    {
      title: 'Risk Score',
      value: '72',
      trend: '+5pts',
      icon: AlertTriangle,
      color: 'trend-up'
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
        {/* Spend Forecast */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quarterly Spend Forecast</h3>
          </div>
          <div className="card-content">
            <div style={{ height: '320px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={spendForecast}>
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
                    name="Actual Spend ($M)" 
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
        {/* Category Spend */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Category Spend Distribution</h3>
          </div>
          <div className="card-content">
            <div style={{ height: '320px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categorySpend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="spend" fill="#2563eb" name="Current Spend" />
                  <Bar dataKey="forecast" fill="#059669" name="Forecast" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Vendor Risk Distribution */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Vendor Risk Distribution</h3>
          </div>
          <div className="card-content">
            <div style={{ height: '320px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={riskData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    fill="#2563eb" 
                    stroke="#2563eb" 
                    name="Vendor Count" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SourcingForecastDashboard;
