import React from 'react';
import { 
  Search,
  Database,
  LineChart,
  AlertTriangle,
  Zap,
  Brain,
  Eye,
  FileSearch,
  Target,
  Clock,
  Shield,
  BarChart2,
  Network,
  Lightbulb
} from 'lucide-react';

const InsightsOverview = () => {
  return (
    <div className="max-h-[80vh] overflow-y-auto bg-ivory text-gray-dark p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="bg-royalBlue text-ivory py-12 px-4 text-center rounded-lg mb-8">
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-12 h-12 mr-4" />
            <h1 className="text-4xl font-semibold">Insights</h1>
          </div>
          <p className="text-xl max-w-3xl mx-auto mb-2">
            Transform legacy data into actionable intelligence
          </p>
          <p className="text-lg max-w-3xl mx-auto">
            Unlock hidden value in your corporate data through sophisticated extraction and analysis
          </p>
        </header>

        {/* Core Capabilities */}
        <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-royalBlue mb-8 text-center">
            Advanced Data Intelligence
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: <FileSearch className="w-8 h-8" />,
                title: "Intelligent Extraction",
                description: "Sophisticated ETL technology for complex document analysis",
                features: [
                  "Pattern recognition",
                  "Context-aware processing",
                  "Multi-format handling"
                ]
              },
              {
                icon: <Eye className="w-8 h-8" />,
                title: "Pattern Recognition",
                description: "Identify critical business signals and risk indicators",
                features: [
                  "Supply chain insights",
                  "Risk pattern detection",
                  "Relationship mapping"
                ]
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Rapid Processing",
                description: "Accelerated analysis of high-volume data sets",
                features: [
                  "Parallel processing",
                  "Automated classification",
                  "Real-time insights"
                ]
              }
            ].map((capability, index) => (
              <div key={index} className="bg-lightGray rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="text-royalBlue mb-4">{capability.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{capability.title}</h3>
                <p className="text-gray-600 mb-4">{capability.description}</p>
                <ul className="space-y-2">
                  {capability.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center text-sm">
                      <div className="w-1.5 h-1.5 bg-royalBlue rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Use Cases */}
        <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-royalBlue mb-8 text-center">
            Intelligence Applications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: <AlertTriangle className="w-8 h-8" />,
                title: "Risk Management",
                description: "Proactive risk identification and assessment",
                applications: [
                  "Compliance violations",
                  "GDPR exposure",
                  "Regulatory risks"
                ]
              },
              {
                icon: <Network className="w-8 h-8" />,
                title: "Supply Chain Intelligence",
                description: "Deep supply relationship insights",
                applications: [
                  "Vendor concentration",
                  "Geopolitical exposure",
                  "Relationship dependencies"
                ]
              },
              {
                icon: <Database className="w-8 h-8" />,
                title: "Legacy Data Mining",
                description: "Extract value from historical records",
                applications: [
                  "Contract analysis",
                  "Litigation support",
                  "Corporate memory"
                ]
              },
              {
                icon: <LineChart className="w-8 h-8" />,
                title: "Deal Intelligence",
                description: "Transaction and investment insights",
                applications: [
                  "M&A due diligence",
                  "Investment patterns",
                  "Deal structure analysis"
                ]
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Compliance Monitoring",
                description: "Automated compliance surveillance",
                applications: [
                  "Policy adherence",
                  "Behavioral patterns",
                  "Violation detection"
                ]
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: "Strategic Analysis",
                description: "Business relationship intelligence",
                applications: [
                  "Partnership evaluation",
                  "Market positioning",
                  "Opportunity identification"
                ]
              }
            ].map((useCase, index) => (
              <div key={index} className="bg-lightGray rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="text-royalBlue mb-4">{useCase.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{useCase.title}</h3>
                <p className="text-gray-600 mb-4">{useCase.description}</p>
                <ul className="space-y-2">
                  {useCase.applications.map((app, aIndex) => (
                    <li key={aIndex} className="flex items-center text-sm">
                      <Lightbulb className="w-4 h-4 text-royalBlue mr-2" />
                      {app}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Business Impact */}
        <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-royalBlue mb-8 text-center">
            Measurable Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              {
                icon: <Clock className="w-6 h-6" />,
                metric: "Processing Efficiency",
                description: "Reduce analysis time by up to 90%"
              },
              {
                icon: <BarChart2 className="w-6 h-6" />,
                metric: "Insight Quality",
                description: "Enhanced pattern recognition and signal detection"
              },
              {
                icon: <Shield className="w-6 h-6" />,
                metric: "Risk Reduction",
                description: "Proactive risk identification and mitigation"
              }
            ].map((impact, index) => (
              <div key={index} 
                   className="flex items-start p-4 bg-lightGray rounded-lg">
                <span className="text-royalBlue mr-3">{impact.icon}</span>
                <div>
                  <span className="font-medium block mb-1">{impact.metric}</span>
                  <span className="text-sm text-gray-600">{impact.description}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Key Advantages */}
        <section className="bg-white py-8 px-4 rounded-lg mb-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-royalBlue mb-4">Unique Value Proposition</h2>
            <div className="bg-lightGray p-6 rounded-lg">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-royalBlue mr-2">•</span>
                  Deep understanding of corporate data patterns and business implications
                </li>
                <li className="flex items-start">
                  <span className="text-royalBlue mr-2">•</span>
                  Sophisticated signal detection in complex business relationships
                </li>
                <li className="flex items-start">
                  <span className="text-royalBlue mr-2">•</span>
                  Immediate, actionable insights from previously inaccessible data
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-royalBlue text-ivory text-center py-8 px-4 mt-12 rounded-lg">
          <p>© 2024 Tangible Intelligence, ai. The Tangible Intelligence Platform. 
             Transform legacy data into strategic advantage.</p>
        </footer>
      </div>
    </div>
  );
};

export default InsightsOverview;
