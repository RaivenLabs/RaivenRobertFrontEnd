import React from 'react';
import { 
  Building2, Network, Users, FileText, Shield, BarChart2,
  Lock, FileCheck, ArrowRight, Handshake, Settings, Globe
} from 'lucide-react';

const ApplicationsOverview = () => {
  return (
    <div className="guide-wrapper">
      {/* Header Section */}
      <header className="guide-header">
        <div className="guide-container">
          <h1>Application Suite & Solutions</h1>
          <p>Transform your transaction workflows with purpose-built applications</p>
          <p>Designed for every stakeholder in your ecosystem</p>
        </div>
      </header>

      {/* Main Categories Section */}
      <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Enterprise Applications */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-50 p-6">
              <div className="text-royalBlue mb-4">
                <Building2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Enterprise Applications</h3>
              <p className="text-gray-600 mb-4">Internal tools powering your core operations</p>
              <ul className="space-y-2">
                {[
                  "Contract Assembly & Automation",
                  "Rate Management & Verification",
                  "Compliance Monitoring",
                  "Transaction Analytics Dashboard",
                  "Document Repository & Search",
                  "Approval Workflow Engine"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <ArrowRight className="w-4 h-4 text-royalBlue mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Industry Solutions */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-50 p-6">
              <div className="text-royalBlue mb-4">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Industry Solutions</h3>
              <p className="text-gray-600 mb-4">Domain or practice group specialized applications</p>
              <ul className="space-y-2">
                {[
                  "Legal Service Management",
                  "Vendor Contract Suite",
                  "Resource Classification Tools",
                  "Risk Assessment Module",
                  "Regulatory Compliance Tracker",
                  "Industry-Specific Templates"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <ArrowRight className="w-4 h-4 text-royalBlue mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Partner Solutions */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-50 p-6">
              <div className="text-royalBlue mb-4">
                <Handshake className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Partner Solutions</h3>
              <p className="text-gray-600 mb-4">Configurable applications supporting external workflow collaboration</p>
              <ul className="space-y-2">
                <li className="text-sm font-semibold text-royalBlue mt-4">Transaction Portal</li>
                {[
                  "Flexible branding options",
                  "Secure document submission and routing",
                  "Status tracking & notifications",
                  "Digital signature integration",
                  "Configurable workflow templates"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center text-sm ml-4">
                    <ArrowRight className="w-4 h-4 text-royalBlue mr-2" />
                    {feature}
                  </li>
                ))}
                
                <li className="text-sm font-semibold text-royalBlue mt-4">Collaboration Workspace</li>
                {[
                  "Integrated workflow management",
                  "Document sharing & version control",
                  "Automated rate handling",
                  "Progress tracking and reporting"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center text-sm ml-4">
                    <ArrowRight className="w-4 h-4 text-royalBlue mr-2" />
                    {feature}
                  </li>
                ))}

                <li className="text-sm font-semibold text-royalBlue mt-4">Enterprise Access Control</li>
                {[
                  "Organization-based permissions",
                  "Multi-level security controls",
                  "Customizable user roles",
                  "Comprehensive audit trails"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center text-sm ml-4">
                    <ArrowRight className="w-4 h-4 text-royalBlue mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="bg-white py-8 px-4 rounded-lg mb-8 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-royalBlue mb-6">Platform Benefits</h2>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <ul className="space-y-4">
              {[
                "Seamless integration across all application categories",
                "Flexible branding options to match your organization's needs",
                "Enterprise-grade security and compliance features",
                "Customizable workflows to match your business processes"
              ].map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <ArrowRight className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-600">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
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

export default ApplicationsOverview;
