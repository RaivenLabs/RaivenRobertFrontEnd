import React from 'react';
import { 
  Users,
  Target,
  Rocket,
  Scale,
  Clock,
  Building,
  Brain,
  Handshake,
  Gauge,
  Workflow,
  CheckCircle,
  BarChart
} from 'lucide-react';

const TangibleTeamsOverview = () => {
  return (
    <div className="max-h-[80vh] overflow-y-auto bg-ivory text-gray-dark p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="bg-royalBlue text-ivory py-12 px-4 text-center rounded-lg mb-8">
          <div className="flex items-center justify-center mb-4">
            <Users className="w-12 h-12 mr-4" />
            <h1 className="text-4xl font-semibold">Tangible Teams</h1>
          </div>
          <p className="text-xl max-w-3xl mx-auto mb-2">
            Transaction professionals who understand what truly matters
          </p>
          <p className="text-lg max-w-3xl mx-auto">
            Enterprise-minded experts delivering speed, quality, and practical solutions
          </p>
        </header>

        {/* Core Team Values */}
        <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-royalBlue mb-8 text-center">
            Our Approach
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: <Target className="w-8 h-8" />,
                title: "Enterprise Perspective",
                description: "Business-focused deal execution that aligns with enterprise goals",
                principles: [
                  "Focus on business impact",
                  "Practical risk assessment",
                  "Strategic prioritization"
                ]
              },
              {
                icon: <Rocket className="w-8 h-8" />,
                title: "Speed to Value",
                description: "Accelerated deal closure without compromising quality",
                principles: [
                  "Efficient processing",
                  "Right-sized review",
                  "Focus on key terms"
                ]
              },
              {
                icon: <Scale className="w-8 h-8" />,
                title: "Balanced Execution",
                description: "Right-touch approach to transaction management",
                principles: [
                  "Risk-appropriate scrutiny",
                  "Pragmatic solutions",
                  "Value-driven decisions"
                ]
              }
            ].map((value, index) => (
              <div key={index} className="bg-lightGray rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="text-royalBlue mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600 mb-4">{value.description}</p>
                <ul className="space-y-2">
                  {value.principles.map((principle, pIndex) => (
                    <li key={pIndex} className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-royalBlue mr-2" />
                      {principle}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Team Expertise */}
        <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-royalBlue mb-8 text-center">
            Professional Excellence
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: <Building className="w-8 h-8" />,
                title: "Enterprise Knowledge",
                description: "Deep understanding of corporate needs and constraints",
                expertise: [
                  "Corporate priorities",
                  "Business unit alignment",
                  "Stakeholder management"
                ]
              },
              {
                icon: <Brain className="w-8 h-8" />,
                title: "Digital Proficiency",
                description: "Masters of Tangible's intelligent platform",
                expertise: [
                  "Platform optimization",
                  "Digital workflows",
                  "Automated solutions"
                ]
              },
              {
                icon: <Workflow className="w-8 h-8" />,
                title: "Process Excellence",
                description: "Efficient, repeatable transaction management",
                expertise: [
                  "Workflow optimization",
                  "Quality control",
                  "Process automation"
                ]
              },
              {
                icon: <Handshake className="w-8 h-8" />,
                title: "Deal Expertise",
                description: "Focus on what moves transactions forward",
                expertise: [
                  "Key term negotiation",
                  "Risk assessment",
                  "Practical solutions"
                ]
              },
              {
                icon: <Gauge className="w-8 h-8" />,
                title: "Volume Management",
                description: "High-throughput transaction handling",
                expertise: [
                  "Portfolio management",
                  "Resource optimization",
                  "Scalable processes"
                ]
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: "Speed Focus",
                description: "Accelerated deal completion",
                expertise: [
                  "Fast execution",
                  "Efficient review",
                  "Quick resolution"
                ]
              }
            ].map((expertise, index) => (
              <div key={index} className="bg-lightGray rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="text-royalBlue mb-4">{expertise.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{expertise.title}</h3>
                <p className="text-gray-600 mb-4">{expertise.description}</p>
                <ul className="space-y-2">
                  {expertise.expertise.map((item, eIndex) => (
                    <li key={eIndex} className="flex items-center text-sm">
                      <div className="w-1.5 h-1.5 bg-royalBlue rounded-full mr-2"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Measurable Impact */}
        <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-royalBlue mb-8 text-center">
            Delivering Results
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              {
                icon: <Clock className="w-6 h-6" />,
                metric: "Speed to Close",
                description: "Accelerated deal completion timelines"
              },
              {
                icon: <BarChart className="w-6 h-6" />,
                metric: "Portfolio Scale",
                description: "High-volume transaction management"
              },
              {
                icon: <CheckCircle className="w-6 h-6" />,
                metric: "Quality Assurance",
                description: "Risk-appropriate deal execution"
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

        {/* Team Principles */}
        <section className="bg-white py-8 px-4 rounded-lg mb-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-royalBlue mb-4">Team Principles</h2>
            <div className="bg-lightGray p-6 rounded-lg">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-royalBlue mr-2">•</span>
                  Customer success drives every decision and action
                </li>
                <li className="flex items-start">
                  <span className="text-royalBlue mr-2">•</span>
                  Focus on what truly matters to business objectives
                </li>
                <li className="flex items-start">
                  <span className="text-royalBlue mr-2">•</span>
                  Leverage technology to enhance human expertise
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-royalBlue text-ivory text-center py-8 px-4 mt-12 rounded-lg">
          <p>© 2024 Tangible Intelligence, ai. The Tangible Intelligence Platform. 
             Excellence in transaction management.</p>
        </footer>
      </div>
    </div>
  );
};

export default TangibleTeamsOverview;
