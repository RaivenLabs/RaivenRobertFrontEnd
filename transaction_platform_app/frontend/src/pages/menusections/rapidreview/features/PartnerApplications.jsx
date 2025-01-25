import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import ApplicationGroup from '../../../../components/shared/ApplicationGroup';

const PartnerApplications = ({ setActiveSidebar }) => {
  const programType = 'rapidreview';
  const [hasSelectedApp, setHasSelectedApp] = useState(false);
  
  // Handler for when an app is selected
  const handleAppSelection = () => {
    console.log('🎯 Partner: Transferring control to ApplicationGroup');
    setHasSelectedApp(true);
  };

  return (
    <div className="guide-wrapper">
      {/* Header Section */}
      <header className="guide-header">
        <div className="guide-container">
          <h1>Engagement Applications</h1>
          <p>Transform your service delivery with client-facing applications</p>
          <p>Create new revenue streams while enhancing client engagement</p>
        </div>
      </header>

      {/* Solution Categories */}
      <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-royalBlue mb-6 text-center">Solution Categories</h2>
        <div className="max-w-4xl mx-auto grid grid-cols-2 gap-8">
          {/* Law Firm Solutions */}
          <div className="p-8 bg-gray-50 rounded-xl">
            <h3 className="text-xl font-semibold text-royalBlue mb-4">Law Firm Solutions</h3>
            <p className="text-gray-600 mb-6">Transform legal services into tech-enabled offerings</p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">Compliance Assessment Tools</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">Due Diligence Automation</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">Cap Table Management</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">GDPR Risk Analysis</span>
              </li>
            </ul>
          </div>

          {/* Enterprise Solutions */}
          <div className="p-8 bg-gray-50 rounded-xl">
            <h3 className="text-xl font-semibold text-royalBlue mb-4">Enterprise Solutions</h3>
            <p className="text-gray-600 mb-6">Standardize and control external provider engagement</p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">Service Order Management</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">Rate Card Compliance</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">Risk Classification</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">Provider Management</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-royalBlue mb-6 text-center">Platform Features</h2>
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6">
          <div className="p-6 border border-gray-100 rounded-xl">
            <h3 className="text-lg font-semibold text-royalBlue mb-4">Flexible Branding</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">White Label Ready</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">Client Branded</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">Tangible Branded</span>
              </li>
            </ul>
          </div>

          <div className="p-6 border border-gray-100 rounded-xl">
            <h3 className="text-lg font-semibold text-royalBlue mb-4">Revenue Generation</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">Tech-Enabled Services</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">Value-Added Solutions</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">New Service Lines</span>
              </li>
            </ul>
          </div>

          <div className="p-6 border border-gray-100 rounded-xl">
            <h3 className="text-lg font-semibold text-royalBlue mb-4">Platform Support</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">Custom Portals</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">Analytics Dashboard</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">Integration Tools</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Applications Grid Section */}
      <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-royalBlue mb-8 text-center">
          Available Applications
        </h2>
        <div className="max-w-4xl mx-auto">
          <ApplicationGroup 
            apiEndpoint={`/programs/${programType}`}
            setActiveSidebar={setActiveSidebar}
            onAppSelected={handleAppSelection}
            isInControl={hasSelectedApp}
          />
        </div>
        <div className="text-center mt-8 text-gray-600">
          <p>Press and hold any highlighted application to launch</p>
          <p className="text-sm mt-2">
            Blue icons indicate available applications • Gray icons show upcoming features
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="guide-footer">
        <p>© 2024 Tangible Intelligence, ai. The Tangible Intelligence Platform. 
          Enabling partners to deliver tech-enhanced solutions.</p>
      </footer>
    </div>
  );
};

export default PartnerApplications;
