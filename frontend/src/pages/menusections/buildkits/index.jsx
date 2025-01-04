import React from 'react';
import { 
  Box, 
  Gauge,
  Shield,
  Sparkles,
  Settings,
  Target,
  Scale,
  Zap,
  Building2,
  RefreshCw,
  CheckCircle,
  BarChart
} from 'lucide-react';

const BuildKitsOverview = () => {
  return (
    <div className="max-h-[80vh] overflow-y-auto bg-ivory text-gray-dark p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="bg-royalBlue text-ivory py-12 px-4 text-center rounded-lg mb-8">
          <div className="flex items-center justify-center mb-4">
            <Box className="w-12 h-12 mr-4" />
            <h1 className="text-4xl font-semibold">Build Kits</h1>
          </div>
          <p className="text-xl max-w-3xl mx-auto mb-2">
            Intelligent deal creation with purpose-built transaction frameworks
          </p>
          <p className="text-lg max-w-3xl mx-auto">
            Accelerate deal velocity while maintaining enterprise-grade quality and compliance
          </p>
        </header>

        {/* Core Benefits Section */}
        <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-royalBlue mb-8 text-center">
            Intelligent Deal Creation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: <Gauge className="w-8 h-8" />,
                title: "Right-Sized Processing",
                description: "Scale effort and scrutiny based on deal significance",
                features: [
                  "Risk-based assessment",
                  "Mission-critical identification",
                  "Resource optimization"
                ]
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Built-in Compliance",
                description: "Automated adherence to corporate and regulatory requirements",
                features: [
                  "Policy enforcement",
                  "Regulatory alignment",
                  "Audit-ready documentation"
                ]
              },
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: "Quality Assurance",
                description: "Maintain high standards across all transaction volumes",
                features: [
                  "Standardized processes",
                  "Quality checkpoints",
                  "Best practice integration"
                ]
              }
            ].map((benefit, index) => (
              <div key={index} className="bg-lightGray rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="text-royalBlue mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600 mb-4">{benefit.description}</p>
                <ul className="space-y-2">
                  {benefit.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-royalBlue mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Transaction Categories */}
        <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-royalBlue mb-8 text-center">
            Specialized Build Kits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: <Settings className="w-8 h-8" />,
                title: "SaaS Transactions",
                description: "Streamlined software-as-a-service agreements",
                focus: ["Subscription terms", "Service levels", "Data protection"]
              },
              {
                icon: <Building2 className="w-8 h-8" />,
                title: "Hardware Procurement",
                description: "Equipment and infrastructure deals",
                focus: ["Specifications", "Warranties", "Delivery terms"]
              },
              {
                icon: <RefreshCw className="w-8 h-8" />,
                title: "Outsourcing Agreements",
                description: "Service provider relationships",
                focus: ["Performance metrics", "Governance", "Exit provisions"]
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: "Strategic Licensing",
                description: "IP and technology licensing",
                focus: ["Usage rights", "Restrictions", "Royalties"]
              },
              {
                icon: <Scale className="w-8 h-8" />,
                title: "Professional Services",
                description: "Consulting and service delivery",
                focus: ["Scope definition", "Deliverables", "Acceptance criteria"]
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Quick-Turn Agreements",
                description: "Accelerated standard transactions",
                focus: ["Standard terms", "Fast execution", "Risk controls"]
              }
            ].map((kit, index) => (
              <div key={index} className="bg-lightGray rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="text-royalBlue mb-4">{kit.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{kit.title}</h3>
                <p className="text-gray-600 mb-4">{kit.description}</p>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-gray-700">Key Focus Areas:</h4>
                  <ul className="space-y-1">
                    {kit.focus.map((item, fIndex) => (
                      <li key={fIndex} className="text-sm text-gray-600 flex items-center">
                        <div className="w-1.5 h-1.5 bg-royalBlue rounded-full mr-2"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Performance Metrics */}
        <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-royalBlue mb-8 text-center">
            Measurable Results
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              {
                icon: <Gauge className="w-6 h-6" />,
                metric: "Deal Velocity",
                description: "Accelerated transaction completion"
              },
              {
                icon: <BarChart className="w-6 h-6" />,
                metric: "Quality Scores",
                description: "Consistent compliance and risk management"
              },
              {
                icon: <Target className="w-6 h-6" />,
                metric: "Business Alignment",
                description: "Right-sized processing for business goals"
              }
            ].map((metric, index) => (
              <div key={index} 
                   className="flex items-start p-4 bg-lightGray rounded-lg">
                <span className="text-royalBlue mr-3">{metric.icon}</span>
                <div>
                  <span className="font-medium block mb-1">{metric.metric}</span>
                  <span className="text-sm text-gray-600">{metric.description}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Key Principles */}
        <section className="bg-white py-8 px-4 rounded-lg mb-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-royalBlue mb-4">Build Kit Principles</h2>
            <div className="bg-lightGray p-6 rounded-lg">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-royalBlue mr-2">•</span>
                  Every transaction deserves the right level of attention - not too much, not too little
                </li>
                <li className="flex items-start">
                  <span className="text-royalBlue mr-2">•</span>
                  Speed and quality are not mutually exclusive with the right framework
                </li>
                <li className="flex items-start">
                  <span className="text-royalBlue mr-2">•</span>
                  Consistent processes yield predictable, high-quality outcomes
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-royalBlue text-ivory text-center py-8 px-4 mt-12 rounded-lg">
          <p>© 2024 Tangible Intelligence, ai. The Tangible Intelligence Platform. 
             Intelligent deal creation at enterprise scale.</p>
        </footer>
      </div>
    </div>
  );
};

export default BuildKitsOverview;
