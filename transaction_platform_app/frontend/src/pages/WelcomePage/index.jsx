import React from 'react';
import { 
  ClipboardCheck, 
  Workflow, 
  Zap, 
  Building2,
  Network,
  ArrowRight,
  BarChart3,
  Layers,
  Lock
} from 'lucide-react';

const WelcomePage = () => {
  return (
    <div className="p-16 max-w-7xl mx-auto bg-ivory">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-semibold text-royalBlue mb-6">
          Transform Your Enterprise Operations
        </h1>
        <p className="text-xl text-gray-700 mb-4 max-w-4xl mx-auto">
          Revolutionizing how enterprises manage high-volume portfolios through intelligent automation and seamless integration
        </p>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          From transactions to compliance, procurement to litigation—we're transforming paper-based silos into fluid digital workflows
        </p>
      </div>

      {/* Who We Serve */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-royalBlue mb-8 text-center">Who We Serve</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Building2 className="w-6 h-6" />,
              title: "Enterprise Teams",
              description: "Supporting organizations of all sizes in managing recurring transactions, compliance, and operational workflows"
            },
            {
              icon: <Network className="w-6 h-6" />,
              title: "Professional Providers",
              description: "Enabling law firms and service providers to deliver more efficient, technology-driven solutions to enterprise clients"
            },
            {
              icon: <BarChart3 className="w-6 h-6" />,
              title: "Investment Firms",
              description: "Facilitating capital delivery and portfolio management through streamlined, intelligent processes"
            }
          ].map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </section>

      {/* Core Platform Benefits */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-royalBlue mb-8 text-center">Our Approach</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Workflow className="w-6 h-6" />,
              title: "Connected Workflows",
              description: "Break down silos between enterprise functions with seamlessly integrated processes and improved gate-to-gate handoffs"
            },
            {
              icon: <Zap className="w-6 h-6" />,
              title: "Intelligent Automation",
              description: "Leverage pattern recognition and smart processing to handle each transaction with the right level of attention"
            },
            {
              icon: <Lock className="w-6 h-6" />,
              title: "Enterprise-Grade Control",
              description: "Maintain compliance, security, and business protocols while accelerating processing speed"
            },
            {
              icon: <ClipboardCheck className="w-6 h-6" />,
              title: "Portfolio Optimization",
              description: "Treat each transaction as part of a larger pattern, applying lessons learned across the enterprise"
            },
            {
              icon: <Layers className="w-6 h-6" />,
              title: "Fluid Architecture",
              description: "Transform rigid, paper-based systems into dynamic, digital workflows that adapt to your needs"
            },
            {
              icon: <Network className="w-6 h-6" />,
              title: "Collaborative Innovation",
              description: "Partner with us to build and customize solutions that address your specific challenges"
            }
          ].map((benefit, index) => (
            <BenefitCard key={index} {...benefit} />
          ))}
        </div>
      </section>

      {/* Innovation Commitment */}
      <section className="bg-white rounded-lg p-8 shadow-lg">
        <h2 className="text-2xl font-semibold text-royalBlue mb-4 text-center">Our Commitment to Innovation</h2>
        <p className="text-gray-700 mb-6 text-center max-w-3xl mx-auto">
          Through our Speakeasy innovation hub, we're constantly pushing boundaries and inviting collaboration. Join us in shaping the future of enterprise operations.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {[
            "Cutting-edge prototypes available for exploration",
            "Community-driven application development",
            "Commitment to radical generosity in sharing innovation"
          ].map((point, index) => (
            <div key={index} className="flex items-start p-4 bg-lightGray rounded-lg">
              <ArrowRight className="w-5 h-5 text-royalBlue mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{point}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const ServiceCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="bg-lightBlue w-12 h-12 rounded-xl flex items-center justify-center mb-4">
        <div className="text-royalBlue">{icon}</div>
      </div>
      <h3 className="text-xl font-semibold text-royalBlue mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
};

const BenefitCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
      <div className="flex items-center mb-4">
        <div className="bg-lightBlue w-10 h-10 rounded-lg flex items-center justify-center mr-4">
          <div className="text-royalBlue">{icon}</div>
        </div>
        <h3 className="text-lg font-semibold text-royalBlue">{title}</h3>
      </div>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
};

export default WelcomePage;
