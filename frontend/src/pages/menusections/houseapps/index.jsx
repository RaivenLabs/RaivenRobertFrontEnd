import React from 'react';
import {
  LayoutGrid, // for the header
  Building2, // for customer selection
  Shield, // for security section
  Network, // for network items
  ArrowRight, // for navigation arrows
  FileText, // for documents
  Share2, // for sharing functionality
  Layers, // for layers icon
  Sliders, // for controls
  Users, // for user management
  Bot, // for automation
  Code2, // for development
  Workflow, // for workflow
  Palette, // for customization/branding
} from 'lucide-react';

const HouseAppsOverview = () => {
  return (
    <div className="max-h-[80vh] overflow-y-auto bg-ivory text-gray-dark p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="bg-royalBlue text-ivory py-12 px-4 text-center rounded-lg mb-8">
          <div className="flex items-center justify-center mb-4">
            <LayoutGrid className="w-12 h-12 mr-4" />
            <h1 className="text-4xl font-semibold">House Apps</h1>
          </div>
          <p className="text-xl max-w-3xl mx-auto mb-2">
            Custom-built applications that transform your business processes
          </p>
          <p className="text-lg max-w-3xl mx-auto">
            Build, brand, and deploy enterprise applications your way
          </p>
        </header>

        {/* Development Options Section */}
        <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-royalBlue mb-8 text-center">
            Flexible Development Paths
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: <Bot className="w-8 h-8" />,
                title: 'Tangible-Built',
                description:
                  'Let our experts build custom applications tailored to your needs',
                features: [
                  'Expert development team',
                  'Industry best practices',
                  'Turnkey solutions',
                ],
              },
              {
                icon: <Code2 className="w-8 h-8" />,
                title: 'Self-Built',
                description:
                  'Develop your own applications in our secure sandbox environment',
                features: [
                  'Full platform capabilities',
                  'Development tools and resources',
                  'Testing environments',
                ],
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Collaborative Build',
                description:
                  'Partner with Tangible for guided application development',
                features: [
                  'Combined expertise',
                  'Knowledge transfer',
                  'Accelerated development',
                ],
              },
            ].map((option, index) => (
              <div
                key={index}
                className="bg-lightGray rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="text-royalBlue mb-4">{option.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{option.title}</h3>
                <p className="text-gray-600 mb-4">{option.description}</p>
                <ul className="space-y-2">
                  {option.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center text-sm">
                      <ArrowRight className="w-4 h-4 text-royalBlue mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Branding & Deployment Options */}
        <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-royalBlue mb-8 text-center">
            Flexible Branding & Deployment
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: <Palette className="w-8 h-8" />,
                title: 'Branding Options',
                features: [
                  {
                    title: 'Customer Branded',
                    description: 'Deploy as [Customer] Intelligence Platform',
                  },
                  {
                    title: 'Tangible Branded',
                    description:
                      'Leverage the Tangible Intelligence Platform brand',
                  },
                  {
                    title: 'White Label',
                    description: 'Custom branding for external stakeholders',
                  },
                ],
              },
              {
                icon: <Network className="w-8 h-8" />,
                title: 'Deployment Models',
                features: [
                  {
                    title: 'Platform Hosted',
                    description: 'Fully managed on Tangible platform',
                  },
                  {
                    title: 'API Integration',
                    description: 'Connect with existing systems',
                  },
                  {
                    title: 'External Access',
                    description: 'Secure access for third-party stakeholders',
                  },
                ],
              },
            ].map((section, index) => (
              <div key={index} className="bg-lightGray rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="text-royalBlue mr-3">{section.icon}</div>
                  <h3 className="text-xl font-semibold">{section.title}</h3>
                </div>
                <div className="space-y-4">
                  {section.features.map((feature, fIndex) => (
                    <div key={fIndex} className="bg-white p-4 rounded-md">
                      <h4 className="font-medium mb-1">{feature.title}</h4>
                      <p className="text-sm text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Key Benefits */}
        <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-royalBlue mb-8 text-center">
            Platform Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              {
                icon: <Shield className="w-6 h-6" />,
                title: 'Enterprise Security',
                description: 'Built-in compliance and risk management',
              },
              {
                icon: <Workflow className="w-6 h-6" />,
                title: 'Process Automation',
                description: 'Streamline complex workflows',
              },
              {
                icon: <Layers className="w-6 h-6" />,
                title: 'Integration Ready',
                description: 'Connect with existing systems',
              },
              {
                icon: <Building2 className="w-6 h-6" />,
                title: 'Multi-stakeholder Support',
                description: 'Serve internal and external users',
              },
              {
                icon: <Sliders className="w-6 h-6" />,
                title: 'Configurable Controls',
                description: 'Adapt to your requirements',
              },
              {
                icon: <Share2 className="w-6 h-6" />,
                title: 'Flexible Access',
                description: 'Secure external collaboration',
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className="flex items-start p-4 bg-lightGray rounded-lg"
              >
                <span className="text-royalBlue mr-3">{benefit.icon}</span>
                <div>
                  <span className="font-medium block mb-1">
                    {benefit.title}
                  </span>
                  <span className="text-sm text-gray-600">
                    {benefit.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Important Notes */}
        <section className="bg-white py-8 px-4 rounded-lg mb-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-royalBlue mb-4">
              Key Points
            </h2>
            <div className="bg-lightGray p-6 rounded-lg">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-royalBlue mr-2">•</span>
                  All apps inherit enterprise-grade security and compliance
                  features
                </li>
                <li className="flex items-start">
                  <span className="text-royalBlue mr-2">•</span>
                  Flexible deployment options protect your brand and security
                  requirements
                </li>
                <li className="flex items-start">
                  <span className="text-royalBlue mr-2">•</span>
                  Seamless integration with existing enterprise systems and
                  workflows
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-royalBlue text-ivory text-center py-8 px-4 mt-12 rounded-lg">
          <p>
            © 2025 Tangible Intelligence, ai. The Tangible Intelligence
            Platform. Transform your enterprise with custom applications.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default HouseAppsOverview;
