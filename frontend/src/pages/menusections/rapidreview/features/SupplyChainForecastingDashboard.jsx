import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, ScatterChart, Scatter } from 'recharts';
import { TrendingUp, Box, Truck, AlertTriangle, BarChart2 } from 'lucide-react';
import '../../../../components/Dashboard/dashboard.css';

const SupplyChainForecastDashboard = () => {
  // Mock time series data for demand forecasting
  const [demandForecast] = useState([
    { month: 'Jan 2025', actual: 1200, forecast: 1250, lower: 1150, upper: 1350 },
    { month: 'Feb 2025', actual: 1300, forecast: 1350, lower: 1250, upper: 1450 },
    { month: 'Mar 2025', actual: null, forecast: 1450, lower: 1350, upper: 1550 },
    { month: 'Apr 2025', actual: null, forecast: 1550, lower: 1450, upper: 1650 },
    { month: 'May 2025', actual: null, forecast: 1650, lower: 1550, upper: 1750 },
  ]);

  // Mock supplier performance data
  const [supplierData] = useState([
    { supplier: 'Supplier A', reliability: 92, leadTime: 12, risk: 'low' },
    { supplier: 'Supplier B', reliability: 88, leadTime: 15, risk: 'medium' },
    { supplier: 'Supplier C', reliability: 95, leadTime: 10, risk: 'low' },
    { supplier: 'Supplier D', reliability: 85, leadTime: 18, risk: 'high' },
    { supplier: 'Supplier E', reliability: 90, leadTime: 14, risk: 'medium' },
  ]);

  // Mock inventory optimization data
  const [inventoryTrends] = useState([
    { category: 'Raw Materials', current: 850, optimal: 800, excess: 50 },
    { category: 'WIP', current: 420, optimal: 400, excess: 20 },
    { category: 'Finished Goods', current: 680, optimal: 600, excess: 80 },
    { category: 'Spare Parts', current: 320, optimal: 300, excess: 20 },
  ]);

  const metrics = [
    {
      title: 'Demand Forecast Accuracy',
      value: '94.2%',
      trend: '+2.3%',
      icon: BarChart2,
      color: 'trend-up'
    },
    {
      title: 'Average Lead Time',
      value: '13.8 days',
      trend: '-1.2 days',
      icon: Truck,
      color: 'trend-up'
    },
    {
      title: 'Supply Risk Index',
      value: '82/100',
      trend: '+5pts',
      icon: AlertTriangle,
      color: 'trend-down'
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
        {/* Demand Forecast */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Demand Forecast Trends</h3>
          </div>
          <div className="card-content">
            <div style={{ height: '320px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={demandForecast}>
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
                    name="Actual Demand" 
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
        {/* Supplier Performance Matrix */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Supplier Performance Matrix</h3>
          </div>
          <div className="card-content">
            <div style={{ height: '320px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="leadTime" name="Lead Time" unit=" days" />
                  <YAxis type="number" dataKey="reliability" name="Reliability" unit="%" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Legend />
                  <Scatter
                    name="Suppliers"
                    data={supplierData}
                    fill="#2563eb"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Inventory Optimization */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Inventory Optimization Status</h3>
          </div>
          <div className="card-content">
            <div style={{ height: '320px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={inventoryTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="current" fill="#2563eb" name="Current Level" />
                  <Bar dataKey="optimal" fill="#059669" name="Optimal Level" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplyChainForecastDashboard;
