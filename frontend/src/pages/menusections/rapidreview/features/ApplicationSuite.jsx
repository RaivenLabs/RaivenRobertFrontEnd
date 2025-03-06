import React, { useState } from 'react';
import { Building2 } from 'lucide-react';
import ApplicationGroup from '../../../../components/shared/ApplicationGroup';

const ApplicationSuite = () => {
  const [selectedGroup, setSelectedGroup] = useState('enterprise');
  const handleSidebarChange = (id) => {
    console.log('Sidebar changed to:', id);
  };

  const applicationGroups = [
    {
      id: 'enterprise',
      title: 'Enterprise Solutions',
      description: 'Organization-wide tools for core business operations',
    },
    {
      id: 'team',
      title: 'Team Operations',
      description: 'Streamline internal team workflows and processes',
    },
    {
      id: 'catalyx',
      title: 'Outward Bound',
      description:
        'Manage relationships with customers, suppliers, and partners',
    },
  ];

  return (
    <div className="guide-wrapper">
      {/* Header Section */}
      <header className="guide-header">
        <div className="guide-container">
          <h1>Application Suite</h1>
          <p>
            Transform your transaction workflows with purpose-built applications
          </p>
          <p>Designed for every stakeholder in your ecosystem</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Group Selection */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          {applicationGroups.map((group) => (
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

        {/* Applications Display */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <ApplicationGroup
            apiEndpoint="/programs/rapidreview"
            onSidebarChange={handleSidebarChange}
          />
          <div className="text-center mt-8 text-sm text-gray-600">
            <p>Press and hold any highlighted application to launch</p>
          </div>
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

export default ApplicationSuite;
