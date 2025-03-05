import React from 'react';
import { 
  UserCheck, Shield, Scale, FileText, 
  Clock, CheckCircle, Database, Gauge,
  Users, AlertTriangle, RefreshCw, Building2
} from 'lucide-react';

const EvershedsRecruiting = () => {
  return (
    <div className="guide-wrapper">
      {/* Header Section */}
      <header className="guide-header">
        <div className="guide-container">
          <div className="flex items-center justify-center mb-4">
            <UserCheck className="w-12 h-12 mr-4" />
            <h1>Right to Work Navigator</h1>
          </div>
          <p>Comprehensive right to work compliance management with intelligent verification workflows</p>
          <p>Streamline verification processes, ensure compliance, and maintain comprehensive audit trails</p>
        </div>
      </header>

      {/* Intelligent Compliance Management Section */}
      <section className="bg-white py-16 px-4 rounded-lg mb-8">
        <h2 className="text-3xl font-semibold text-royalBlue text-center mb-12">
          Intelligent Compliance Assurance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: <Shield className="w-8 h-8" />,
              title: "Compliance Assurance",
              items: [
                "Automated eligibility verification",
                "Document authenticity checks",
                "Comprehensive audit trails",
                "Real-time status monitoring"
              ]
            },
            {
              icon: <AlertTriangle className="w-8 h-8" />,
              title: "Risk Management",
              items: [
                "Early warning system",
                "Expiry date tracking",
                "Non-compliance alerts",
                "Follow-up scheduling"
              ]
            },
            {
              icon: <Database className="w-8 h-8" />,
              title: "Record Management",
              items: [
                "Secure document storage",
                "Automated record retention",
                "Digital certification",
                "Evidence preservation"
              ]
            }
          ].map((principle, index) => (
            <div key={index} className="bg-lightGray p-8 rounded-lg shadow-md">
              <div className="text-royalBlue mb-4">{principle.icon}</div>
              <h3 className="text-xl font-semibold mb-4">{principle.title}</h3>
              <ul className="space-y-3">
                {principle.items.map((item, itemIndex) => (
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

      {/* Workflow Modules Section */}
      <section className="bg-white py-16 px-4 rounded-lg mb-8">
        <h2 className="text-3xl font-semibold text-royalBlue text-center mb-12">
          Comprehensive Verification Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: <Building2 className="w-8 h-8" />,
              title: "Initial Assessment",
              desc: "Streamlined nationality and documentation pathway determination"
            },
            {
              icon: <UserCheck className="w-8 h-8" />,
              title: "Document Verification",
              desc: "Comprehensive document authenticity and validity checks"
            },
            {
              icon: <Scale className="w-8 h-8" />,
              title: "Compliance Certification",
              desc: "Automated compliance validation and certification"
            },
            {
              icon: <Clock className="w-8 h-8" />,
              title: "Timeline Management",
              desc: "Proactive follow-up and renewal tracking"
            },
            {
              icon: <FileText className="w-8 h-8" />,
              title: "Documentation Manager",
              desc: "Secure document storage and audit trail maintenance"
            },
            {
              icon: <Users className="w-8 h-8" />,
              title: "HR Integration",
              desc: "Seamless integration with HR onboarding processes"
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

      {/* KPI Section */}
      <section className="bg-gray-50 py-16 px-4 rounded-lg mb-8">
        <h2 className="text-3xl font-semibold text-royalBlue text-center mb-12">
          Compliance Metrics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            {
              icon: <Gauge className="w-8 h-8" />,
              metric: "Process Efficiency",
              description: "70% reduction in verification time"
            },
            {
              icon: <Shield className="w-8 h-8" />,
              metric: "Compliance Accuracy",
              description: "100% statutory requirement adherence"
            },
            {
              icon: <RefreshCw className="w-8 h-8" />,
              metric: "Risk Mitigation",
              description: "Zero compliance gaps through proactive monitoring"
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

      {/* Core Principles Section */}
      <section className="bg-white py-16 px-4 rounded-lg mb-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold text-royalBlue text-center mb-12">
            Compliance Principles
          </h2>
          <div className="bg-lightGray p-8 rounded-lg shadow-md">
            <ul className="space-y-6">
              <li className="flex items-start">
                <span className="text-royalBlue mr-3 text-xl">•</span>
                <span className="text-lg">
                  Comprehensive compliance requires systematic verification and thorough documentation
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-royalBlue mr-3 text-xl">•</span>
                <span className="text-lg">
                  Proactive monitoring ensures continuous compliance and minimizes risks
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-royalBlue mr-3 text-xl">•</span>
                <span className="text-lg">
                  Digital transformation enhances accuracy while maintaining statutory compliance
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-royalBlue text-ivory text-center py-8 px-4 mt-12 rounded-lg">
        <p>© 2024 Tangible Intelligence, ai. The Tangible Intelligence Platform.</p>
        <p className="text-sm mt-2">Intelligent right to work compliance at enterprise scale.</p>
      </footer>
    </div>
  );
};

export default EvershedsRecruiting;
