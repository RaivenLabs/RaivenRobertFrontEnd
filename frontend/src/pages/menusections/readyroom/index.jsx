import React from 'react';
import {
  BookOpen,
  Target,
  Lightbulb,
  BarChart2,
  CheckSquare,
  Compass,
  Trophy,
  RefreshCw,
  GraduationCap,
  ClipboardList,
  Workflow,
  ShieldCheck,
} from 'lucide-react';

const ReadyRoomOverview = () => {
  return (
    <div className="max-h-[80vh] overflow-y-auto bg-ivory text-gray-dark p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="bg-royalBlue text-ivory py-12 px-4 text-center rounded-lg mb-8">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="w-12 h-12 mr-4" />
            <h1 className="text-4xl font-semibold">Ready Room</h1>
          </div>
          <p className="text-xl max-w-3xl mx-auto mb-2">
            Master the art and science of enterprise deal management
          </p>
          <p className="text-lg max-w-3xl mx-auto">
            Industry-leading insights and practical knowledge for operational
            excellence
          </p>
        </header>

        {/* Main Learning Areas */}
        <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-royalBlue mb-8 text-center">
            Learning Pathways
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: <Target className="w-8 h-8" />,
                title: 'Deal Management Excellence',
                description:
                  'Master sophisticated approaches to complex transactions',
                topics: [
                  'Strategic deal structuring',
                  'Risk-optimized workflows',
                  'Compliance integration',
                ],
              },
              {
                icon: <BarChart2 className="w-8 h-8" />,
                title: 'High-Volume Operations',
                description:
                  'Scale effectively while maintaining quality and control',
                topics: [
                  'Process optimization',
                  'Quality management',
                  'Efficiency frameworks',
                ],
              },
              {
                icon: <Workflow className="w-8 h-8" />,
                title: 'ETL Program Design',
                description: 'Build and manage sophisticated ETL operations',
                topics: [
                  'Program architecture',
                  'Data transformation',
                  'Quality assurance',
                ],
              },
              {
                icon: <ShieldCheck className="w-8 h-8" />,
                title: 'Compliance Programs',
                description:
                  'Implement effective compliance-driven initiatives',
                topics: [
                  'Risk management',
                  'Control frameworks',
                  'Audit readiness',
                ],
              },
              {
                icon: <RefreshCw className="w-8 h-8" />,
                title: 'Operational Innovation',
                description:
                  'Transform complex processes into streamlined solutions',
                topics: [
                  'Process simplification',
                  'Automation strategy',
                  'Change management',
                ],
              },
              {
                icon: <Compass className="w-8 h-8" />,
                title: 'Best Practices',
                description:
                  'Learn from industry-leading approaches and methodologies',
                topics: [
                  'Proven methodologies',
                  'Industry standards',
                  'Success patterns',
                ],
              },
            ].map((area, index) => (
              <div
                key={index}
                className="bg-lightGray rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="text-royalBlue mb-4">{area.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{area.title}</h3>
                <p className="text-gray-600 mb-4">{area.description}</p>
                <ul className="space-y-2">
                  {area.topics.map((topic, tIndex) => (
                    <li key={tIndex} className="flex items-center text-sm">
                      <CheckSquare className="w-4 h-4 text-royalBlue mr-2" />
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Learning Resources */}
        <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-royalBlue mb-8 text-center">
            Resource Library
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: <ClipboardList className="w-6 h-6" />,
                title: 'Process Guides & Checklists',
                description: 'Comprehensive guides for consistent execution',
              },
              {
                icon: <BookOpen className="w-6 h-6" />,
                title: 'Best Practice Playbooks',
                description: 'Detailed operational playbooks and frameworks',
              },
              {
                icon: <Lightbulb className="w-6 h-6" />,
                title: 'Knowledge Base',
                description: 'Searchable repository of insights and solutions',
              },
              {
                icon: <Trophy className="w-6 h-6" />,
                title: 'Success Stories',
                description: 'Real-world implementation case studies',
              },
            ].map((resource, index) => (
              <div
                key={index}
                className="flex items-start p-4 bg-lightGray rounded-lg"
              >
                <span className="text-royalBlue mr-3">{resource.icon}</span>
                <div>
                  <span className="font-medium block mb-1">
                    {resource.title}
                  </span>
                  <span className="text-sm text-gray-600">
                    {resource.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Learning Philosophy */}
        <section className="bg-white py-8 px-4 rounded-lg mb-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold text-royalBlue mb-4">
              Our Approach
            </h2>
            <div className="bg-lightGray p-6 rounded-lg">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-royalBlue mr-2">•</span>
                  We believe in sharing knowledge generously to elevate industry
                  practices
                </li>
                <li className="flex items-start">
                  <span className="text-royalBlue mr-2">•</span>
                  Our resources blend deep expertise with practical, actionable
                  guidance
                </li>
                <li className="flex items-start">
                  <span className="text-royalBlue mr-2">•</span>
                  We focus on right-sized solutions that balance complexity with
                  effectiveness
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-royalBlue text-ivory text-center py-8 px-4 mt-12 rounded-lg">
          <p>
            © 2025 Tangible Intelligence, ai. The Tangible Intelligence
            Platform. Elevating operational excellence through knowledge
            sharing.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ReadyRoomOverview;
