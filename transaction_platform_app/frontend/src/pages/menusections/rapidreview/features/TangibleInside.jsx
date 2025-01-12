import React from 'react';
import { ArrowRight } from 'lucide-react';
import ApplicationGroup from '../../../../components/shared/ApplicationGroup';

const TangibleInside = () => {
  const handleSidebarChange = (id) => {
    console.log('Sidebar changed to:', id);
  };

  return (
    <div className="guide-wrapper">
      {/* Header Section */}
      <header className="guide-header">
        <div className="guide-container">
        <h1>Tangible's CoreIntel<sup style={{ fontSize: '0.5em', verticalAlign: 'super' }}>™</sup> Technology</h1>
          <p>Transform unstructured data into actionable intelligence</p>
          <p>Advanced data extraction and analytics powered by proprietary vector technology</p>
        </div>
      </header>

      {/* Core Capabilities */}
      <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-royalBlue mb-6 text-center">Core Capabilities</h2>
        <div className="max-w-4xl mx-auto grid grid-cols-2 gap-8">
          {/* Data Transformation */}
          <div className="p-8 bg-gray-50 rounded-xl">
            <h3 className="text-xl font-semibold text-royalBlue mb-4">Data Transformation</h3>
            <p className="text-gray-600 mb-6">Convert complex data stores into structured insights</p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">Advanced Data Extraction</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">Vector Database Integration</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">Legacy System Integration</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">Pattern Recognition</span>
              </li>
            </ul>
          </div>

          {/* Intelligence Layer */}
          <div className="p-8 bg-gray-50 rounded-xl">
            <h3 className="text-xl font-semibold text-royalBlue mb-4">Intelligence Layer</h3>
            <p className="text-gray-600 mb-6">Advanced analytics and pattern recognition</p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">Signal Detection</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">Correlation Analysis</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">Predictive Analytics</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">Insight Generation</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-royalBlue mb-6 text-center">Industry Applications</h2>
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6">
          {/* Claims Processing */}
          <div className="p-6 border border-gray-100 rounded-xl">
            <h3 className="text-lg font-semibold text-royalBlue mb-4">Claims Processing</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">Asbestos Claims</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">Mass Tort Analysis</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">Pattern Detection</span>
              </li>
            </ul>
          </div>

          {/* M&A Data Rooms */}
          <div className="p-6 border border-gray-100 rounded-xl">
            <h3 className="text-lg font-semibold text-royalBlue mb-4">Due Diligence</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">Deal Room Analysis</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">Contract Review</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">Risk Assessment</span>
              </li>
            </ul>
          </div>

          {/* Enterprise Data */}
          <div className="p-6 border border-gray-100 rounded-xl">
            <h3 className="text-lg font-semibold text-royalBlue mb-4">Enterprise Data</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">Legacy Integration</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">Data Migration</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-600">Process Automation</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-royalBlue mb-6 text-center">Key Benefits</h2>
        <div className="max-w-4xl mx-auto grid grid-cols-2 gap-6">
          {[
            "Weeks to Days: Dramatic timeline reduction",
            "Security First: Proprietary data protection",
            "Human Partnership: Quality assured review",
            "Advanced Analytics: Beyond simple extraction",
            "Insight Generation: Pattern recognition",
            "Full Integration: Legacy system support"
          ].map((benefit, index) => (
            <div key={index} className="flex items-start">
              <ArrowRight className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
              <span className="text-gray-600">{benefit}</span>
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

      {/* Footer */}
      <footer className="guide-footer">
        <p>© 2024 Tangible Intelligence, ai. Transform your complex data into actionable intelligence.</p>
      </footer>
    </div>
  );
};

export default TangibleInside;
