import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';

// Simple chart component
const LegalChart = () => {
  const data = [
    { name: 'Commercial', current: 45, forecast: 52 },
    { name: 'Employment', current: 35, forecast: 38 },
    { name: 'IP', current: 28, forecast: 32 },
    { name: 'Regulatory', current: 22, forecast: 25 },
    { name: 'Litigation', current: 18, forecast: 22 }
  ];

  return (
    <div className="h-96">
      <BarChart
        width={800}
        height={400}
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="current" fill="#2563eb" name="Current Matters" />
        <Bar dataKey="forecast" fill="#059669" name="Forecasted Matters" />
      </BarChart>
    </div>
  );
};

// Main dashboard component
const ForecastingDashboards = () => {
  const [selectedGroup, setSelectedGroup] = React.useState('legal');

  const dashboardGroups = [
    {
      id: 'legal',
      title: 'Legal Operations',
      description: 'Matter volume and complexity forecasting'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-teal-800 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Forecasting Dashboards</h1>
          <p className="text-xl mb-2">Strategic insights powered by transaction metadata analysis</p>
          <p className="text-lg">Discover predictive trends across your business functions</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          {dashboardGroups.map((group) => (
            <button
              key={group.id}
              onClick={() => setSelectedGroup(group.id)}
              className={`p-6 rounded-lg border-2 text-left transition-colors ${
                selectedGroup === group.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <h3 className="font-semibold text-lg mb-2">{group.title}</h3>
              <p className="text-sm text-gray-600">{group.description}</p>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <LegalChart />
        </div>
      </div>
    </div>
  );
};

export default ForecastingDashboards;
