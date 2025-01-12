import React from 'react';
import { Building2, ArrowRight } from 'lucide-react';
import ApplicationGroup from '../../../../components/shared/ApplicationGroup';

const EnterpriseApplications = () => {
  const handleSidebarChange = (id) => {
    console.log('Sidebar changed to:', id);
  };

  return (
    <div className="guide-wrapper">
      {/* Header Section */}
      <header className="guide-header">
        <div className="guide-container">
          <h1>Enterprise Applications</h1>
          <p>Purpose-built tools powering your core operations</p>
          <p>Transform your transaction workflows with intelligent automation</p>
        </div>
      </header>

      {/* Core Capabilities */}
      <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-royalBlue mb-6 text-center">Core Capabilities</h2>
        <div className="max-w-4xl mx-auto grid grid-cols-2 gap-6">
          {[
            "Contract Assembly & Automation",
            "Rate Management & Verification",
            "Compliance Monitoring",
            "Transaction Analytics Dashboard",
            "Document Repository & Search",
            "Approval Workflow Engine"
          ].map((feature, index) => (
            <div key={index} className="flex items-start">
              <ArrowRight className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
              <span className="text-gray-600">{feature}</span>
            </div>
          ))}
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

      {/* Integration Benefits */}
      <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-royalBlue mb-6 text-center">Platform Benefits</h2>
        <div className="max-w-4xl mx-auto grid grid-cols-2 gap-6">
          {[
            "Seamless workflow integration",
            "Enterprise-grade security",
            "Automated data validation",
            "Real-time analytics",
            "Configurable permissions",
            "Full audit trail support"
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
          Transforming operations through intelligent automation.</p>
      </footer>
    </div>
  );
};

export default EnterpriseApplications;
