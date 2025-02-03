import React from 'react';

const EUCSDDContent = () => (
  <div className="guide-wrapper">
    <header className="guide-header bg-blue-50">
      <div className="guide-container max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">EU CSDD Navigator</h1>
        <p className="text-xl mb-2">Strategic Assessment Tool for Corporate Sustainability Due Diligence</p>
        <p className="text-gray-600">Navigate the complexities of EU CSDD compliance with precision and clarity.</p>
      </div>
    </header>

    <section className="guide-principle-section py-12">
      <h2 className="text-2xl font-bold text-center mb-8">Key Compliance Areas</h2>
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Scope Assessment</h3>
          <ul className="space-y-2">
            <li>Company Size Evaluation</li>
            <li>Financial Thresholds Analysis</li>
            <li>Sector-Specific Requirements</li>
            <li>EU Market Operations Review</li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Due Diligence</h3>
          <ul className="space-y-2">
            <li>Value Chain Mapping</li>
            <li>Risk Assessment Framework</li>
            <li>Impact Evaluation Tools</li>
            <li>Mitigation Strategy Planning</li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Compliance Support</h3>
          <ul className="space-y-2">
            <li>Implementation Timeline</li>
            <li>Documentation Guidelines</li>
            <li>Reporting Requirements</li>
            <li>Stakeholder Engagement</li>
          </ul>
        </div>
      </div>
    </section>

    <section className="guide-lifecycle-section bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Applicability Assessment",
              desc: "Determine if and how the CSDD directive applies to your organization through our intuitive questionnaire."
            },
            {
              title: "Threshold Calculator",
              desc: "Evaluate your company against key financial and employee thresholds for both standard and sector-specific requirements."
            },
            {
              title: "Sector Analysis",
              desc: "Identify sector-specific obligations and requirements based on your company's operations."
            },
            {
              title: "Implementation Roadmap",
              desc: "Generate a customized timeline for implementing required due diligence measures and controls."
            },
            {
              title: "Risk Assessment",
              desc: "Evaluate potential human rights and environmental impacts across your value chain."
            },
            {
              title: "Compliance Dashboard",
              desc: "Track your organization's progress towards CSDD compliance with our comprehensive monitoring tools."
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-12 bg-blue-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8">Compliance Timeline</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Standard Scope Companies</h3>
            <p className="text-gray-600">For companies with over 500 employees and €150M+ turnover</p>
            <ul className="mt-4 space-y-2">
              <li>• Initial Assessment Phase</li>
              <li>• Due Diligence Implementation</li>
              <li>• Reporting Requirements</li>
              <li>• Ongoing Monitoring</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">High-Impact Sectors</h3>
            <p className="text-gray-600">For companies with over 250 employees and €40M+ turnover in specified sectors</p>
            <ul className="mt-4 space-y-2">
              <li>• Sector-Specific Requirements</li>
              <li>• Enhanced Due Diligence</li>
              <li>• Special Reporting Obligations</li>
              <li>• Continuous Review</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <footer className="guide-footer bg-gray-800 text-white py-8">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="mb-2">Ensure your organization's readiness for EU CSDD compliance.</p>
        <p className="text-sm text-gray-400">
          Developed in partnership with Eversheds Sutherland to support organizations in meeting their CSDD obligations.
        </p>
      </div>
    </footer>
  </div>
);

const EvershedsEUCSDD = () => {
  return <EUCSDDContent />;
};

export default EvershedsEUCSDD;
