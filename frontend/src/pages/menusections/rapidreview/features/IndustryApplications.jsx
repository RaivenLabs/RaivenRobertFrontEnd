import React from 'react';
import { ArrowRight } from 'lucide-react';
import ApplicationGroup from '../../../../components/shared/ApplicationGroup';

const IndustryApplications = () => {
  const handleSidebarChange = (id) => {
    console.log('Sidebar changed to:', id);
  };

  return (
    <div className="guide-wrapper">
      {/* Header Section */}
      <header className="guide-header">
        <div className="guide-container">
          <h1>Team Applications</h1>
          <p>Domain-specific solutions for legal, sourcing, and claims management</p>
          <p>Purpose-built tools that understand your industry's unique challenges</p>
        </div>
      </header>

      {/* Practice Areas */}
      <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-royalBlue mb-6 text-center">Practice Areas</h2>
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6">
          {/* Legal Practice */}
          <div className="p-6 bg-gray-50 rounded-xl">
            <h3 className="text-xl font-semibold text-royalBlue mb-4">Legal Services</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">Matter Management</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">Document Review</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">Practice Templates</span>
              </li>
            </ul>
          </div>

          {/* Sourcing */}
          <div className="p-6 bg-gray-50 rounded-xl">
            <h3 className="text-xl font-semibold text-royalBlue mb-4">Sourcing</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">Vendor Management</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">Contract Analysis</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">Rate Compliance</span>
              </li>
            </ul>
          </div>

          {/* Claims */}
          <div className="p-6 bg-gray-50 rounded-xl">
            <h3 className="text-xl font-semibold text-royalBlue mb-4">Claims</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">Claims Processing</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">Risk Assessment</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">Compliance Tools</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Applications Grid */}
      <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-royalBlue mb-8 text-center">
          Available Applications
        </h2>
        <div className="max-w-4xl mx-auto">
          <ApplicationGroup apiEndpoint="/programs/rapidreview"
            onSidebarChange={handleSidebarChange}
          />
        </div>
        <div className="text-center mt-8 text-gray-600">
          <p>Press and hold any highlighted application to launch</p>
          <p className="text-sm mt-2">Blue icons indicate available applications • Gray icons show upcoming features</p>
        </div>
      </section>

      {/* Industry Benefits */}
      <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-royalBlue mb-6 text-center">Industry Benefits</h2>
        <div className="max-w-4xl mx-auto grid grid-cols-2 gap-6">
          {[
            "Domain-specific workflow templates",
            "Industry standard compliance",
            "Practice area expertise built-in",
            "Specialized data extraction",
            "Role-based access control",
            "Industry reporting standards"
          ].map((benefit, index) => (
            <div key={index} className="flex items-start">
              <ArrowRight className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
              <span className="text-gray-600">{benefit}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="guide-footer">
        <p>© 2024 Tangible Intelligence, ai. The Tangible Intelligence Platform. 
          Transforming industry-specific operations through intelligent automation.</p>
      </footer>
    </div>
  );
};

export default IndustryApplications;
