import React, { useState } from 'react';
import SourcingForecastDashboard from './SourcingForecastDashboard';
import LegalForecastingDashboard from './LegalForecastingDashboard';
import SupplyChainForecastingDashboard from './SupplyChainForecastingDashboard';

const ForecastingDashboards = () => {
  const [selectedGroup, setSelectedGroup] = useState('sourcing');
  const dashboardGroups = [
    {
      id: 'sourcing',
      title: 'Sourcing Analytics',
      description: 'Vendor spend and demand forecasting trends',
    },
    {
      id: 'legal',
      title: 'Legal Operations',
      description: 'Matter volume and complexity forecasting',
    },
    {
      id: 'supply-chain',
      title: 'Supply Chain Insights',
      description: 'Demand, inventory, and supplier performance predictions',
    },
  ];

  const renderDashboard = () => {
    switch (selectedGroup) {
      case 'sourcing':
        return <SourcingForecastDashboard />;
      case 'legal':
        return <LegalForecastingDashboard />;
      case 'supply-chain':
        return <SupplyChainForecastingDashboard />;
      default:
        return <SourcingForecastDashboard />;
    }
  };

  return (
    <div className="guide-wrapper">
      {/* Header Section */}
      <header className="guide-header">
        <div className="guide-container">
          <h1>Forecasting Dashboards</h1>
          <p>Strategic insights powered by transaction metadata analysis</p>
          <p>Discover predictive trends across your business functions</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Dashboard Group Selection */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          {dashboardGroups.map((group) => (
            <button
              key={group.id}
              onClick={() => setSelectedGroup(group.id)}
              className={`p-6 rounded-lg border-2 text-left transition-all duration-200
                ${
                  selectedGroup === group.id
                    ? 'border-blue-600 bg-blue-50 shadow-md transform scale-105'
                    : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50 hover:shadow-sm hover:transform hover:scale-102'
                }`}
            >
              <h3 className="font-semibold text-lg mb-2">{group.title}</h3>
              <p className="text-sm text-gray-600">{group.description}</p>
            </button>
          ))}
        </div>

        {/* Dashboard Display */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          {renderDashboard()}
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>
            © 2025 Tangible Intelligence, ai. The Tangible Intelligence
            Platform.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ForecastingDashboards;
