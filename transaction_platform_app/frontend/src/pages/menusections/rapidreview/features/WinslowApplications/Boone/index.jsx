import React from 'react';
import { 
  Key, Database, Brain, BarChart, 
  Timer, Search, Shield, Gauge, CheckCircle,
  Layers, ArrowRight, LineChart
} from 'lucide-react';

const BooneLanding = () => {
  return (
    <div className="guide-wrapper">
      {/* Header Section */}
      <header className="guide-header">
        <div className="guide-container">
          <div className="flex items-center justify-center mb-4">
            <Key className="w-12 h-12 mr-4" />
            <h1>Enterprise Data Hub</h1>
          </div>
          <p>Transform locked, unstructured, random data stores into actionable business intelligence</p>
          <p>Unlock. Structure. Analyze. Access. Act.</p>
        </div>
      </header>

      {/* Data Journey Section */}
      <section className="bg-white py-16 px-4 rounded-lg mb-8">
        <h2 className="text-3xl font-semibold text-royalBlue text-center mb-12">
          Your Data's Journey to Intelligence
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: <Key className="w-8 h-8" />,
              title: "Unlock",
              items: [
                "Access locked data sources",
                "Extract from any format",
                "Parse complex documents",
                "Preserve relationships"
              ]
            },
            {
              icon: <Database className="w-8 h-8" />,
              title: "Structure",
              items: [
                "Organize raw content",
                "Create meaningful schemas",
                "Build data hierarchies",
                "Enable efficient queries"
              ]
            },
            {
              icon: <Brain className="w-8 h-8" />,
              title: "Analyze",
              items: [
                "Discover patterns",
                "Extract key insights",
                "Connect related data",
                "Generate intelligence"
              ]
            },
            {
              icon: <BarChart className="w-8 h-8" />,
              title: "Act",
              items: [
                "Deliver structured payloads",
                "Enable informed decisions",
                "Drive business outcomes",
                "Create actionable dashboards"
              ]
            }
          ].map((stage, index) => (
            <div key={index} className="bg-lightGray p-8 rounded-lg shadow-md">
              <div className="text-royalBlue mb-4">{stage.icon}</div>
              <h3 className="text-xl font-semibold mb-4">{stage.title}</h3>
              <ul className="space-y-3">
                {stage.items.map((item, itemIndex) => (
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

      {/* Transformation Capabilities */}
      <section className="bg-white py-16 px-4 rounded-lg mb-8">
        <h2 className="text-3xl font-semibold text-royalBlue text-center mb-12">
          Data Transformation Capabilities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: <Layers className="w-8 h-8" />,
              title: "Universal Data Access",
              desc: "Transform any unstructured data source into accessible, queryable information"
            },
            {
              icon: <Search className="w-8 h-8" />,
              title: "Intelligent Extraction",
              desc: "Smart identification and organization of key data points and relationships"
            },
            {
              icon: <Database className="w-8 h-8" />,
              title: "Dynamic Structuring",
              desc: "Convert raw content into meaningful, organized data schemas"
            },
            {
              icon: <LineChart className="w-8 h-8" />,
              title: "Pattern Recognition",
              desc: "Identify trends, anomalies, and insights across your data landscape"
            },
            {
              icon: <Shield className="w-8 h-8" />,
              title: "Data Validation",
              desc: "Ensure accuracy and completeness of extracted information"
            },
            {
              icon: <Brain className="w-8 h-8" />,
              title: "Insight Generation",
              desc: "Transform structured data into actionable business intelligence"
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

      {/* Value Metrics Section */}
      <section className="bg-gray-50 py-16 px-4 rounded-lg mb-8">
        <h2 className="text-3xl font-semibold text-royalBlue text-center mb-12">
          Transform Your Data Landscape
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            {
              icon: <Timer className="w-8 h-8" />,
              metric: "Access Speed",
              description: "From months of manual work to minutes of automated processing"
            },
            {
              icon: <Gauge className="w-8 h-8" />,
              metric: "Data Coverage",
              description: "100% of your unstructured data becomes accessible"
            },
            {
              icon: <Brain className="w-8 h-8" />,
              metric: "Intelligence Gain",
              description: "Transform raw data into structured business insights"
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

      {/* Vision Section */}
      <section className="bg-white py-16 px-4 rounded-lg mb-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold text-royalBlue text-center mb-12">
            Our Vision
          </h2>
          <div className="bg-lightGray p-8 rounded-lg shadow-md">
            <ul className="space-y-6">
              <li className="flex items-start">
                <span className="text-royalBlue mr-3 text-xl">•</span>
                <span className="text-lg">
                  Every filing cabinet, every folder, every data room, every document contains valuable data waiting to be unlocked
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-royalBlue mr-3 text-xl">•</span>
                <span className="text-lg">
                  Transform unstructured information into organized, available, productive knowledge
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-royalBlue mr-3 text-xl">•</span>
                <span className="text-lg">
                  Enable data-driven decision making by making all your information accessible and actionable
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-royalBlue text-ivory text-center py-8 px-4 mt-12 rounded-lg">
        <p>© 2024 Tangible Intelligence, ai. The Tangible Intelligence Platform.</p>
        <p className="text-sm mt-2">Unleashing the power of your unstructured data.</p>
      </footer>
    </div>
  );
};

export default BooneLanding;
