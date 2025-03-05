import React from 'react';
import {
  Users,
  Building2,
  FileText,
  BookOpen,
  Map,
  Network,
  Workflow,
  ContactRound,
  Shield,
  GanttChart,
} from 'lucide-react';

const CompanyResources = () => {
  return (
    <div className="guide-wrapper">
      {/* Header Section */}
      <header className="guide-header">
        <div className="guide-container">
          <h1>At Your Fingertips</h1>
          <p className="text-xl max-w-3xl mx-auto mb-2">
            Your central hub for company information, policies, and
            organizational resources
          </p>
          <p className="text-lg max-w-3xl mx-auto">
            Access everything you need to know about your company structure,
            policies, and operations
          </p>
        </div>
      </header>

      {/* Resource Categories */}
      <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-royalBlue mb-8 text-center">
          Company Resource Directory
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              icon: <Users className="w-8 h-8" />,
              title: 'Organization Structure',
              description: 'Explore company hierarchy and team structures',
              features: ['Org Charts', 'Team Directories', 'Reporting Lines'],
            },
            {
              icon: <Shield className="w-8 h-8" />,
              title: 'Policies & Procedures',
              description: 'Access company policies and operational guidelines',
              features: [
                'Policy Library',
                'Compliance Documents',
                'Standard Procedures',
              ],
            },
            {
              icon: <Building2 className="w-8 h-8" />,
              title: 'Office Locations',
              description:
                'Find information about global offices and facilities',
              features: [
                'Office Directory',
                'Facility Maps',
                'Contact Information',
              ],
            },
            {
              icon: <Network className="w-8 h-8" />,
              title: 'Functional Leadership',
              description: 'Connect with functional leads and department heads',
              features: [
                'Leadership Profiles',
                'Department Contacts',
                'Expertise Areas',
              ],
            },
            {
              icon: <Workflow className="w-8 h-8" />,
              title: 'Operating Protocols',
              description: 'Learn about company processes and workflows',
              features: ['Process Maps', 'Work Instructions', 'Best Practices'],
            },
            {
              icon: <GanttChart className="w-8 h-8" />,
              title: 'Strategic Initiatives',
              description: 'Stay informed about company direction and projects',
              features: [
                'Strategic Goals',
                'Key Projects',
                'Innovation Programs',
              ],
            },
          ].map((category, index) => (
            <div
              key={index}
              className="bg-lightGray rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="text-royalBlue mb-4">{category.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
              <p className="text-gray-600 mb-4">{category.description}</p>
              <ul className="space-y-2">
                {category.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center text-sm">
                    <span className="w-1.5 h-1.5 bg-royalBlue rounded-full mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="bg-white py-10 px-4 rounded-lg mb-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-royalBlue mb-8 text-center">
          Quick Access Resources
        </h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              icon: <BookOpen className="w-6 h-6" />,
              label: 'Employee Handbook',
              action: 'View',
            },
            {
              icon: <Map className="w-6 h-6" />,
              label: 'Office Directory',
              action: 'Browse',
            },
            {
              icon: <ContactRound className="w-6 h-6" />,
              label: 'Department Contacts',
              action: 'Search',
            },
            {
              icon: <FileText className="w-6 h-6" />,
              label: 'Policy Updates',
              action: 'Review',
            },
          ].map((resource, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-lightGray rounded-lg hover:bg-lightBlue transition-colors cursor-pointer"
            >
              <div className="flex items-center">
                <span className="text-royalBlue mr-3">{resource.icon}</span>
                <span className="font-medium">{resource.label}</span>
              </div>
              <button className="px-4 py-2 bg-royalBlue text-white rounded-md hover:bg-royalBlue-hover transition-colors">
                {resource.action}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Resource Notes */}
      <section className="bg-white py-8 px-4 rounded-lg mb-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-royalBlue mb-4 text-center">
            Resource Notes
          </h2>
          <div className="bg-lightGray p-6 rounded-lg">
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-royalBlue mr-2">•</span>
                Resources are updated regularly to ensure accuracy and relevance
              </li>
              <li className="flex items-start">
                <span className="text-royalBlue mr-2">•</span>
                Contact your department administrator for access to restricted
                resources
              </li>
              <li className="flex items-start">
                <span className="text-royalBlue mr-2">•</span>
                Some resources may require additional authentication
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 px-4 mt-12">
        <p>
          © 2025 Tangible Intelligence, ai. The Tangible Intelligence Platform.
          Company resources at your fingertips.
        </p>
      </footer>
    </div>
  );
};

export default CompanyResources;
