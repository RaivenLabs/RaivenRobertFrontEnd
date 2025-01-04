
import React from 'react';
import { ClipboardCheck, BarChart3, Database } from 'lucide-react';

const WelcomePage = () => {
  return (
    <div className="p-16 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-semibold text-royalBlue mb-4">
          Welcome, Enterprise Sourcing Teams, to the
        </h1>
        <h1 className="text-4xl font-semibold text-royalBlue mb-4">
          Tangible Intelligence Platform
        </h1>
        <p className="text-xl font-bold text-gray-dark tracking-wide">
          Built with commitment to leading edge sourcing practice
        </p>
        <p className="text-xl font-bold text-gray-dark tracking-wide">
          Innovate or Hibernate!
        </p>
      </div>

      <div className="grid grid-cols-3 gap-8 mt-12">
        <FeatureCard
          icon={<ClipboardCheck className="w-6 h-6" />}
          title="Automated Transaction Engineering"
          description="Streamline workflows and eliminate repetitive tasks"
        />
        <FeatureCard
          icon={<BarChart3 className="w-6 h-6" />}
          title="Powered Portfolio Analytics"
          description="Advanced analytics for data-driven decisions"
        />
        <FeatureCard
          icon={<Database className="w-6 h-6" />}
          title="Fluid Data Architecture"
          description="Seamless organization of complex legal documents"
        />
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md border border-opacity-10 border-royalBlue 
                    hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
      <div className="bg-lightBlue w-12 h-12 rounded-xl flex items-center justify-center mb-6">
        <div className="text-royalBlue">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-semibold text-royalBlue mb-3">{title}</h3>
      <p className="text-gray-dark leading-relaxed">{description}</p>
    </div>
  );
};

export default WelcomePage;
