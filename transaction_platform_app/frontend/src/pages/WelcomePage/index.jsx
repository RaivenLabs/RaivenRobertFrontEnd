import React, { useEffect } from 'react';

import {
  ClipboardCheck,
  Workflow,
  Zap,
  Building2,
  Network,
  ArrowRight,
  BarChart3,
  Layers,
  Lock,
  Brain,
  Bot,
  FileText,
} from 'lucide-react';

const WelcomePage = () => {
  // Add this new useEffect to check config on component mount

  return (
    <div className="guide-wrapper">
      {/* Header Section */}
      <header className="guide-header">
        <div className="guide-container">
          <h1>
            Transform Enterprise Operations with CoIntelligent Technologies
          </h1>
          <p>
            Balance speed, efficiency, and risk through advanced intelligence
          </p>
          <p>
            Purpose-built solutions for transaction management, compliance, and
            sourcing teams
          </p>
        </div>
      </header>

      {/* Core Technologies */}
      <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-royalBlue mb-8 text-center">
          Core Technologies
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-50 p-6">
              <div className="text-royalBlue mb-4">
                <Brain className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                CoreIntel™ Technology
              </h3>
              <p className="text-gray-600 mb-4">
                Transform unstructured data into actionable intelligence
              </p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-50 p-6">
              <div className="text-royalBlue mb-4">
                <Bot className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                CoIntelligent Automation
              </h3>
              <p className="text-gray-600 mb-4">
                Drive smart operational workflows with advanced technology and
                AI
              </p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-50 p-6">
              <div className="text-royalBlue mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Transaction Architecture
              </h3>
              <p className="text-gray-600 mb-4">
                Advanced transaction control, programming and delivery
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-royalBlue mb-8 text-center">
          Measurable Impact
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            {
              metric: '75%',
              description: 'Faster Document Processing',
              detail: 'From weeks to hours',
            },
            {
              metric: '40%',
              description: 'Efficiency Improvement',
              detail: 'Through automated workflows',
            },
            {
              metric: '15-20%',
              description: 'Cost Savings',
              detail: 'Via automated rate verification',
            },
            {
              metric: '60%',
              description: 'Risk Reduction',
              detail: 'In compliance-related issues',
            },
          ].map((item, index) => (
            <div
              key={index}
              className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200"
            >
              <div className="text-3xl font-bold text-royalBlue mb-2">
                {item.metric}
              </div>
              <div className="font-semibold text-gray-800 mb-1">
                {item.description}
              </div>
              <div className="text-sm text-gray-600">{item.detail}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Who We Serve */}
      <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-royalBlue mb-8 text-center">
          Who We Serve
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: <Building2 className="w-8 h-8" />,
              title: 'Enterprise Teams',
              description:
                'Supporting organizations of all sizes in managing recurring transactions, compliance, and operational workflows',
            },
            {
              icon: <Network className="w-8 h-8" />,
              title: 'Enterprise Law Firms',
              description:
                'Enabling law firms and service providers to deliver more efficient, technology-driven solutions to enterprise clients',
            },
            {
              icon: <BarChart3 className="w-8 h-8" />,
              title: 'Investment Firms',
              description:
                'Facilitating capital delivery and portfolio management through streamlined, intelligent processes',
            },
          ].map((service, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              <div className="bg-gray-50 p-6">
                <div className="text-royalBlue mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="guide-footer">
        <p>
          © 2025 Tangible Intelligence, ai. Transform your operations through
          intelligent automation.
        </p>
      </footer>
    </div>
  );
};

export default WelcomePage;
