import React from 'react';
import { 
  Building2, Globe, Scale, Calculator, FileText,
  // eslint-disable-next-line no-unused-vars
  Users, Clock, CheckCircle, Shield, Gauge, RefreshCw
} from 'lucide-react';

const SourcingHubContent = () => {
  return (
    <div className="guide-wrapper">
      {/* Header Section */}
      <header className="guide-header">
        <div className="guide-container">
          <div className="flex items-center justify-center mb-4">
            <Scale className="w-12 h-12 mr-4" />
            <h1>Sourcing Hub Navigator</h1>
          </div>
          <p>Streamlined global merger control compliance with intelligent jurisdiction analysis</p>
          <p>Automate threshold assessments, accelerate filings, and maintain comprehensive compliance</p>
        </div>
      </header>

      {/* Intelligent Compliance Management Section */}
      <section className="bg-white py-16 px-4 rounded-lg mb-8">
        <h2 className="text-3xl font-semibold text-royalBlue text-center mb-12">
          Intelligent Compliance Management
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: <Globe className="w-8 h-8" />,
              title: "Global Coverage",
              items: [
                "Automated threshold calculations",
                "Cross-border coordination",
                "Local requirement tracking",
                "Multi-jurisdiction analysis"
              ]
            },
            {
              icon: <Shield className="w-8 h-8" />,
              title: "Risk Management",
              items: [
                "Early warning system",
                "Compliance validation",
                "Audit trail maintenance",
                "Risk assessment protocols"
              ]
            },
            {
              icon: <Gauge className="w-8 h-8" />,
              title: "Process Acceleration",
              items: [
                "Intelligent data collection",
                "Automated assessments",
                "Timeline optimization",
                "Workflow automation"
              ]
            }
          ].map((principle, index) => (
            <div key={index} className="bg-lightGray p-8 rounded-lg shadow-md">
              <div className="text-royalBlue mb-4">{principle.icon}</div>
              <h3 className="text-xl font-semibold mb-4">{principle.title}</h3>
              <ul className="space-y-3">
                {principle.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-teal mr-2" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow Modules Section */}
      <section className="bg-white py-16 px-4 rounded-lg mb-8">
        <h2 className="text-3xl font-semibold text-royalBlue text-center mb-12">
          Comprehensive Workflow Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: <Building2 className="w-8 h-8" />,
              title: "Company Profiling",
              desc: "Structured data collection and corporate structure mapping"
            },
            {
              icon: <Globe className="w-8 h-8" />,
              title: "Jurisdiction Scanner",
              desc: "Automated multi-jurisdictional analysis and threshold calculations"
            },
            {
              icon: <Scale className="w-8 h-8" />,
              title: "Control Analysis",
              desc: "Comprehensive assessment of voting rights and board control"
            },
            {
              icon: <Calculator className="w-8 h-8" />,
              title: "Threshold Calculator",
              desc: "Automated revenue and asset threshold assessments"
            },
            {
              icon: <FileText className="w-8 h-8" />,
              title: "Filing Manager",
              desc: "Coordinated document assembly and review workflow"
            },
            {
              icon: <Clock className="w-8 h-8" />,
              title: "Timeline Tracker",
              desc: "Comprehensive deadline and milestone management"
            }
          ].map((module, index) => (
            <div key={index} 
                 className="bg-lightGray p-8 rounded-lg shadow-md hover:-translate-y-1 transition-transform duration-300">
              <div className="text-royalBlue mb-4">{module.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{module.title}</h3>
              <p className="text-gray-600">{module.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* KPI Section */}
      <section className="bg-gray-50 py-16 px-4 rounded-lg mb-8">
        <h2 className="text-3xl font-semibold text-royalBlue text-center mb-12">
          Key Performance Indicators
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            {
              icon: <Clock className="w-8 h-8" />,
              metric: "Process Efficiency",
              description: "50% faster assessment completion"
            },
            {
              icon: <Shield className="w-8 h-8" />,
              metric: "Compliance Accuracy",
              description: "99.9% jurisdiction assessment accuracy"
            },
            {
              icon: <RefreshCw className="w-8 h-8" />,
              metric: "Resource Optimization",
              description: "40% reduction in manual review time"
            }
          ].map((metric, index) => (
            <div key={index} 
                 className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <span className="text-royalBlue mr-3">{metric.icon}</span>
                <span className="text-xl font-semibold">{metric.metric}</span>
              </div>
              <p className="text-gray-600">{metric.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Principles Section */}
      <section className="bg-white py-16 px-4 rounded-lg mb-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold text-royalBlue text-center mb-12">
            Core Principles
          </h2>
          <div className="bg-lightGray p-8 rounded-lg shadow-md">
            <ul className="space-y-6">
              <li className="flex items-start">
                <span className="text-royalBlue mr-3 text-xl">•</span>
                <span className="text-lg">
                  Comprehensive analysis requires systematic data collection and validation
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-royalBlue mr-3 text-xl">•</span>
                <span className="text-lg">
                  Automation enhances accuracy while reducing processing time
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-royalBlue mr-3 text-xl">•</span>
                <span className="text-lg">
                  Global compliance requires local expertise with centralized coordination
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-royalBlue text-ivory text-center py-8 px-4 mt-12 rounded-lg">
        <p>© 2024 Tangible Intelligence, ai. The Tangible Intelligence Platform.</p>
        <p className="text-sm mt-2">Intelligent merger control compliance at global scale.</p>
      </footer>
    </div>
  );
};

export default SourcingHubContent;
