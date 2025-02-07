import React from 'react';
import {
  Boxes,
  Network,
  Users,
  FileText,
  Settings,
  Workflow,
  Building2,
  GitMerge,
  Shield,
  Scale,
  Eye,
  BarChart2,
  Sparkles,
  MessageCircle,
  HeartHandshake,
  Compass,
  ArrowRightCircle
} from 'lucide-react';

const ConciergeOverview = () => {
  const programs = [
    {
      title: "Sourcing Program",
      description: "Automated vendor management and contract generation",
      icon: <Network className="w-8 h-8" />,
      features: ["SaaS Agreements", "Service Orders", "Master Rate Cards"]
    },
    {
      title: "Real Estate Program",
      description: "End-to-end property transaction management",
      icon: <Building2 className="w-8 h-8" />,
      features: ["Lease Management", "Property Acquisition", "Facility Services"]
    },
    {
      title: "Sales Program",
      description: "Customer relationship and contract lifecycle",
      icon: <Users className="w-8 h-8" />,
      features: ["Customer Onboarding", "Contract Generation", "Terms Management"]
    },
    {
      title: "Privacy Compliance",
      description: "Comprehensive data protection and compliance",
      icon: <Shield className="w-8 h-8" />,
      features: ["GDPR Templates", "Privacy Assessment", "Data Processing"]
    }
  ];

  return (
    <div className="guide-wrapper">
      {/* Header Section */}
      <header className="guide-header">
        <div className="guide-container">
          <h1>Tangible Concierge</h1>
          <p>Your intelligent guide for seamless business execution</p>
          <p>Personalized support and insights at every step</p>
        </div>
      </header>

      {/* Digital Compass */}
      <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-royalBlue mb-8 text-center">
          Digital Compass
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              icon: <Eye className="w-8 h-8" />,
              title: "Real-Time Deal Visibility",
              description: "Monitor transaction progress and status updates instantly"
            },
            {
              icon: <BarChart2 className="w-8 h-8" />,
              title: "Dynamic Performance Analytics",
              description: "Track key metrics and insights across your portfolio"
            },
            {
              icon: <Sparkles className="w-8 h-8" />,
              title: "Action-Based Insights",
              description: "Receive intelligent recommendations for next steps"
            }
          ].map((feature, index) => (
            <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 p-6">
                <div className="text-royalBlue mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Programs Overview */}
      <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-royalBlue mb-8 text-center">
          Enterprise Programs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {programs.map((program, idx) => (
            <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 p-6">
                <div className="text-royalBlue mb-4">{program.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{program.title}</h3>
                <p className="text-gray-600 mb-4">{program.description}</p>
                <ul className="space-y-2">
                  {program.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-center text-sm text-gray-600">
                      <ArrowRightCircle className="w-4 h-4 mr-2 text-royalBlue" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Service Excellence */}
      <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-royalBlue mb-8 text-center">
          Service Excellence
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              icon: <MessageCircle className="w-8 h-8" />,
              title: "Responsive Support",
              description: "Expert assistance available when you need it"
            },
            {
              icon: <Users className="w-8 h-8" />,
              title: "Expert Guidance",
              description: "Professional insights to optimize your workflow"
            },
            {
              icon: <HeartHandshake className="w-8 h-8" />,
              title: "Customer Delight",
              description: "Going above and beyond to ensure your success"
            }
          ].map((service, index) => (
            <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 p-6">
                <div className="text-royalBlue mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Our Commitment */}
      <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-royalBlue mb-6 text-center">
            Our Commitment
          </h2>
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-50 p-6">
              <ul className="space-y-4">
                {[
                  "Drive customer success through every decision",
                  "Focus resources on business-critical priorities",
                  "Enhance human expertise with digital intelligence"
                ].map((commitment, index) => (
                  <li key={index} className="flex items-start">
                    <Compass className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{commitment}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-royalBlue mb-6">Need Assistance?</h2>
          <p className="text-gray-600 mb-8">Our experts are ready to help</p>
          <div className="flex justify-center gap-4">
            <button className="bg-royalBlue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Contact Support
            </button>
            <button className="border border-royalBlue text-royalBlue px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              Schedule Consultation
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="guide-footer">
        <p>© 2024 Tangible Intelligence, ai. Your partner in business excellence.</p>
      </footer>
    </div>
  );
};

export default ConciergeOverview;
