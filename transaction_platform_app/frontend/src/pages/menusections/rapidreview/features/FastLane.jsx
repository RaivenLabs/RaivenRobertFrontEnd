import React from 'react';
import { Building2, ArrowRight } from 'lucide-react';
import ApplicationGroup from '../../../../components/shared/ApplicationGroup';

const FastLaneApps = () => {
  const handleSidebarChange = (id) => {
    console.log('Sidebar changed to:', id);
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto bg-ivory text-gray-dark p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="bg-royalBlue text-ivory py-12 px-4 text-center rounded-lg mb-8">
          <div className="flex items-center justify-center mb-4">
            <Building2 className="w-12 h-12 mr-4" />
            <h1 className="text-4xl font-semibold">FastLane Access</h1>
          </div>
          <p className="text-xl max-w-3xl mx-auto mb-2">
            Quick access to your most-used enterprise applications
          </p>
          <p className="text-lg max-w-3xl mx-auto">
            Press and hold to launch available applications
          </p>
        </header>

        {/* Features Overview */}
        <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-royalBlue mb-6 text-center">Quick Launch Guide</h2>
          <div className="max-w-4xl mx-auto grid grid-cols-2 gap-6">
            {[
              "Press and hold any highlighted application to launch",
              "Blue icons indicate available applications",
              "Gray icons show upcoming features",
              "Release to cancel launch",
              "Navigation updates automatically",
              "Access your full application suite anytime"
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
            Enterprise Applications
          </h2>
          <ApplicationGroup 
            apiEndpoint="/api/programs/buildkits"
            onSidebarChange={handleSidebarChange}
          />
        </section>

        {/* Footer */}
        <footer className="bg-royalBlue text-ivory text-center py-8 px-4 rounded-lg">
          <p>© 2024 Tangible Intelligence, ai. The Tangible Intelligence Platform. 
            Transforming operations through intelligent automation.</p>
        </footer>
      </div>
    </div>
  );
};

export default FastLaneApps;
