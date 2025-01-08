import React from 'react';
import { 
  Target, Rocket, Scale, Clock,
  Brain, Handshake, Gauge, Workflow,
  CheckCircle, BarChart, Zap, Shield
} from 'lucide-react';

const TangibleTeamsOverview = () => {
  return (
    <div className="guide-wrapper">
      {/* Header Section */}
      <header className="guide-header">
        <div className="guide-container">
          <h1>Tangible Strike Teams</h1>
          <p>Elite Domain Specialists Deployed with Purpose</p>
          <p>Specialized rapid-response teams delivering transformational outcomes</p>
        </div>
      </header>

      {/* Mission Overview */}
      <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
        <div className="max-w-4xl mx-auto bg-gray-50 p-8 rounded-xl border border-gray-200">
          <p className="text-lg leading-relaxed text-gray-700">
            We are specialized rapid-response teams of industry veterans who combine deep expertise 
            with tactical execution. Operating at the intersection of strategic insight and 
            operational excellence, we deliver rapid results that create lasting enterprise value.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {[
              "Deploy instantly-effective experts who understand your mission-critical needs",
              "Execute with unmatched precision and unwavering focus on results",
              "Bring proven experience to navigate complex challenges",
              "Deliver transformational outcomes with remarkable efficiency"
            ].map((point, index) => (
              <div key={index} className="flex items-start">
                <Shield className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-700">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategic Approach */}
      <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-royalBlue mb-8 text-center">
          Strategic Approach
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              icon: <Target className="w-8 h-8" />,
              title: "Strategic Enterprise Focus",
              description: "Driving deal execution that transforms enterprise value",
              points: [
                "Deliver measurable business impact",
                "Balance risk with commercial opportunity",
                "Enable digital-first value drivers"
              ]
            },
            {
              icon: <Zap className="w-8 h-8" />,
              title: "Accelerated Value Creation",
              description: "Optimizing speed through smart execution",
              points: [
                "Deploy proven, tech-enabled methodologies",
                "Streamline digital workflows",
                "Focus on value-driving terms"
              ]
            },
            {
              icon: <Target className="w-8 h-8" />,
              title: "Precision Execution",
              description: "Applying expertise with purpose",
              points: [
                "Balance human insight with digital efficiency",
                "Design scalable, automated solutions",
                "Drive data-informed outcomes"
              ]
            }
          ].map((approach, index) => (
            <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 p-6">
                <div className="text-royalBlue mb-4">{approach.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{approach.title}</h3>
                <p className="text-gray-600 mb-4">{approach.description}</p>
                <ul className="space-y-2">
                  {approach.points.map((point, pIndex) => (
                    <li key={pIndex} className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-royalBlue mr-2" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-royalBlue mb-8 text-center">
          Core Capabilities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {[
            {
              icon: <Brain className="w-8 h-8" />,
              title: "Enterprise Intelligence",
              description: "Mastering corporate complexities with precision",
              points: [
                "Navigate enterprise priorities with insight",
                "Drive cross-functional alignment",
                "Orchestrate stakeholder outcomes"
              ]
            },
            {
              icon: <Workflow className="w-8 h-8" />,
              title: "Digital Excellence",
              description: "Maximizing value through intelligent automation",
              points: [
                "Optimize AI-powered contract analysis",
                "Design custom digital workflows",
                "Deploy predictive analytics solutions"
              ]
            },
            {
              icon: <Handshake className="w-8 h-8" />,
              title: "Transaction Expertise",
              description: "Delivering results at enterprise scale",
              points: [
                "Execute complex multi-party negotiations",
                "Assess and mitigate risk strategically",
                "Scale through automated processes"
              ]
            },
            {
              icon: <Rocket className="w-8 h-8" />,
              title: "Speed to Impact",
              description: "Accelerating value creation",
              points: [
                "Drive rapid deal completion",
                "Enable efficient decision-making",
                "Resolve bottlenecks proactively"
              ]
            }
          ].map((capability, index) => (
            <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 p-6">
                <div className="text-royalBlue mb-4">{capability.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{capability.title}</h3>
                <p className="text-gray-600 mb-4">{capability.description}</p>
                <ul className="space-y-2">
                  {capability.points.map((point, pIndex) => (
                    <li key={pIndex} className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-royalBlue mr-2" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-royalBlue mb-8 text-center">
          Delivering Impact
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            {
              icon: <Clock className="w-8 h-8" />,
              title: "Velocity",
              description: "Accelerated completion through intelligent execution"
            },
            {
              icon: <BarChart className="w-8 h-8" />,
              title: "Scale",
              description: "Enterprise-level portfolio management powered by technology"
            },
            {
              icon: <Gauge className="w-8 h-8" />,
              title: "Quality",
              description: "Precision delivery with risk-calibrated oversight"
            }
          ].map((impact, index) => (
            <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 p-6 text-center">
                <div className="text-royalBlue mb-4 flex justify-center">{impact.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{impact.title}</h3>
                <p className="text-gray-600">{impact.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Commitments */}
      <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-royalBlue mb-6 text-center">Our Commitments</h2>
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-gray-50 p-6">
              <ul className="space-y-4">
                {[
                  "Drive customer success through every decision",
                  "Focus resources on business-critical priorities",
                  "Enhance human expertise with digital intelligence"
                ].map((commitment, index) => (
                  <li key={index} className="flex items-start">
                    <Shield className="w-5 h-5 text-royalBlue mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{commitment}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="guide-footer">
        <p>© 2024 Tangible Intelligence, ai. Elite teams delivering transformational outcomes.</p>
      </footer>
    </div>
  );
};

export default TangibleTeamsOverview;
