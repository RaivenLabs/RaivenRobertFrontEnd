import React from 'react';
import { 
  Zap,
  FileText, 
  ScrollText,
  Search,
  Clock,
  FileCheck,
  ArrowRight,
  Gauge,
  FileSpreadsheet,
  FileSearch
} from 'lucide-react';

const RapidResponse = () => {
  return (
    <div className="max-h-[80vh] overflow-y-auto bg-ivory text-gray-dark p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="bg-royalBlue text-ivory py-12 px-4 text-center rounded-lg mb-8">
          <div className="flex items-center justify-center mb-4">
            <Zap className="w-12 h-12 mr-4" />
            <h1 className="text-4xl font-semibold">Rapid Response</h1>
          </div>
          <p className="text-xl max-w-3xl mx-auto mb-2">
            Fast-track your routine agreements and reviews with our streamlined tools
          </p>
          <p className="text-lg max-w-3xl mx-auto">
            When time is of the essence, but the agreement is straightforward
          </p>
        </header>

        {/* Main Features Section */}
        <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-royalBlue mb-8 text-center">
            Quick Action Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: <FileText className="w-8 h-8" />,
                title: "FastLane",
                description: "Generate simple agreements quickly using our streamlined templates",
                features: [
                  "Pre-built templates for common scenarios",
                  "Guided form-based creation",
                  "Standard term options"
                ]
              },
              {
                icon: <Search className="w-8 h-8" />,
                title: "QuickRead",
                description: "Rapidly extract key information from existing agreements",
                features: [
                  "Key term identification",
                  "Price and date extraction",
                  "Critical clause highlighting"
                ]
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: "ExpressReview",
                description: "Streamlined review process for straightforward agreements",
                features: [
                  "Automated initial checks",
                  "Risk level assessment",
                  "Quick approval routing"
                ]
              }
            ].map((feature, index) => (
              <div key={index} className="bg-lightGray rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="text-royalBlue mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.features.map((item, fIndex) => (
                    <li key={fIndex} className="flex items-center text-sm">
                      <ArrowRight className="w-4 h-4 text-royalBlue mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-royalBlue mb-8 text-center">
            Perfect For
          </h2>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                icon: <FileCheck className="w-6 h-6" />,
                label: "Simple Service Agreements",
                description: "Landscaping, cleaning, basic maintenance"
              },
              {
                icon: <Gauge className="w-6 h-6" />,
                label: "Quick Turnaround Needs",
                description: "Same-day or next-day requirements"
              },
              {
                icon: <FileSpreadsheet className="w-6 h-6" />,
                label: "Standard Terms Reviews",
                description: "Common agreement patterns"
              },
              {
                icon: <FileSearch className="w-6 h-6" />,
                label: "Key Term Extraction",
                description: "Price, dates, and basic obligations"
              }
            ].map((useCase, index) => (
              <div key={index} 
                   className="flex items-start p-4 bg-lightGray rounded-lg">
                <span className="text-royalBlue mr-3 mt-1">{useCase.icon}</span>
                <div>
                  <span className="font-medium block mb-1">{useCase.label}</span>
                  <span className="text-sm text-gray-600">{useCase.description}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Important Notes */}
        <section className="bg-white py-8 px-4 rounded-lg mb-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-royalBlue mb-4">Important Notes</h2>
            <div className="bg-lightGray p-6 rounded-lg">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-royalBlue mr-2">•</span>
                  Best suited for routine, straightforward agreements with standard terms
                </li>
                <li className="flex items-start">
                  <span className="text-royalBlue mr-2">•</span>
                  Complex or high-risk agreements should use comprehensive review processes
                </li>
                <li className="flex items-start">
                  <span className="text-royalBlue mr-2">•</span>
                  Always verify extracted information for accuracy
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-royalBlue text-ivory text-center py-8 px-4 mt-12 rounded-lg">
          <p>© 2024 Tangible Intelligence, ai. The Tangible Intelligence Platform. 
             Accelerating routine agreement processes.</p>
        </footer>
      </div>
    </div>
  );
};

export default RapidResponse;
