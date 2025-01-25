import React, { useState } from 'react';
import { 
  FileText, Globe, Scale, ClipboardCheck, AlertCircle,
  BookOpen, Database, Users, Building2, PieChart,
  Folder, Download, Upload, CheckCircle, Flag,
  Info, ArrowRight
} from 'lucide-react';

const FilingPackageBuilder = () => {
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('hsr');
  const [selectedSection, setSelectedSection] = useState('main');

  const jurisdictions = {
    hsr: {
      name: 'HSR (United States)',
      icon: <Scale />,
      deadline: '30 calendar days',
      authority: 'FTC/DOJ'
    },
    eu: {
      name: 'EU Merger Control',
      icon: <Globe />,
      deadline: '25 working days',
      authority: 'European Commission'
    },
    uk: {
      name: 'UK Merger Control',
      icon: <Flag />,
      deadline: '40 working days',
      authority: 'CMA'
    }
  };

  const packageSections = {
    main: {
      title: 'Main Filing Form',
      icon: <FileText />,
      items: [
        {
          name: 'Basic Information',
          status: 'Complete',
          source: 'Auto-populated',
          description: 'Party details, transaction structure, and key dates'
        },
        {
          name: 'Transaction Details',
          status: 'In Progress',
          source: 'Manual Input Required',
          description: 'Deal terms, consideration, and voting rights'
        },
        {
          name: 'Financial Information',
          status: 'Pending',
          source: 'Finance Team',
          description: 'Revenue data and financial statements'
        }
      ]
    },
    exhibits: {
      title: 'Required Exhibits',
      icon: <Folder />,
      items: [
        {
          name: '4(c) Documents',
          status: 'In Progress',
          source: 'Deal Team',
          description: 'Board presentations, investment committee materials'
        },
        {
          name: '4(d) Documents',
          status: 'Not Started',
          source: 'Legal Team',
          description: 'Competition analyses and market studies'
        }
      ]
    },
    addenda: {
      title: 'Supplemental Information',
      icon: <ClipboardCheck />,
      items: [
        {
          name: 'Market Share Data',
          status: 'Not Started',
          source: 'Strategy Team',
          description: 'Detailed overlap analysis and market shares'
        },
        {
          name: 'Customer Information',
          status: 'Pending',
          source: 'Sales Team',
          description: 'Top customer lists and contact details'
        }
      ]
    }
  };

  const resourceCenter = [
    {
      title: 'Filing Guidelines',
      icon: <BookOpen />,
      items: ['Authority Guidance', 'Previous Filing Templates', 'Best Practices']
    },
    {
      title: 'Data Resources',
      icon: <Database />,
      items: ['Market Data', 'Financial Reports', 'Industry Analysis']
    },
    {
      title: 'Key Contacts',
      icon: <Users />,
      items: ['Internal Team', 'External Counsel', 'Authority Contacts']
    }
  ];

  return (
    <div className="p-6 bg-ivory min-h-screen">
      {/* Jurisdiction Selector */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-royal-blue mb-4">Select Filing Jurisdiction</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(jurisdictions).map(([key, jurisdiction]) => (
            <button
              key={key}
              onClick={() => setSelectedJurisdiction(key)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedJurisdiction === key
                  ? 'border-royal-blue bg-blue-50'
                  : 'border-gray-200 hover:border-royal-blue'
              }`}
            >
              <div className="flex items-center mb-2">
                {jurisdiction.icon}
                <span className="ml-2 font-semibold">{jurisdiction.name}</span>
              </div>
              <div className="text-sm text-teal">
                Review Period: {jurisdiction.deadline}
              </div>
              <div className="text-sm text-teal">
                Authority: {jurisdiction.authority}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filing Package Navigation */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex space-x-4 mb-6">
              {Object.entries(packageSections).map(([key, section]) => (
                <button
                  key={key}
                  onClick={() => setSelectedSection(key)}
                  className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                    selectedSection === key
                      ? 'bg-royal-blue text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {section.icon}
                  <span className="ml-2">{section.title}</span>
                </button>
              ))}
            </div>

            {/* Section Content */}
            <div className="space-y-4">
              {packageSections[selectedSection].items.map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-royal-blue">{item.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      item.status === 'Complete' ? 'bg-green-100 text-green-800' :
                      item.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-sm text-teal mb-2">{item.description}</p>
                  <div className="text-sm text-gray-500">Source: {item.source}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resource Center */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-royal-blue mb-4">Resource Center</h3>
          <div className="space-y-6">
            {resourceCenter.map((category, index) => (
              <div key={index}>
                <div className="flex items-center mb-2">
                  {category.icon}
                  <h4 className="ml-2 font-semibold">{category.title}</h4>
                </div>
                <ul className="space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center text-sm text-teal hover:text-royal-blue cursor-pointer">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilingPackageBuilder;
