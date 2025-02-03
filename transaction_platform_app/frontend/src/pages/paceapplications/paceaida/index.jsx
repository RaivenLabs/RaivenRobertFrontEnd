import React from 'react';
import { BarChart3, FileText, Settings, PieChart, Upload } from 'lucide-react';

const PaceAidaContent = () => (
  <div className="guide-wrapper">
    {/* Header Section */}
    <header className="guide-header">
      <div className="guide-container">
        <h1>Tangible AIDA Application</h1>
        <p>Powered by Tangible Intelligence</p>
        <p>From siloed claims processes to intelligent automated workflows</p>
      </div>
    </header>

    {/* Platform Architecture Section */}
    <section className="bg-white py-16 px-4 rounded-lg mb-8">
      <h2 className="text-3xl font-semibold text-royalBlue text-center mb-12">
        Platform Architecture
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto px-4">
        {/* First Box */}
        <div className="bg-lightGray p-8 rounded-lg shadow-md">
          <h1 className="italic text-xl leading-relaxed">
            The Critical Unlock resides at the intersection of Claims Automation, 
            Data Intelligence and Claims Expertise. The pattern of high-volume 
            claims processing is the key.
          </h1>
        </div>
        
        {/* Arrow Section */}
        <div className="flex flex-col items-center justify-center py-8">
          <div className="tour-arrow-container">
            <div className="tour-arrow-right"></div>
            <span className="text-teal font-semibold text-lg mt-6">Driving</span>
          </div>
        </div>
        
        {/* Second Box */}
        <div className="bg-lightGray p-8 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-6">Claims Excellence</h3>
          <ul className="space-y-4">
            <li className="flex items-center text-lg">
              <span className="text-teal mr-3 text-xl">✓</span>
              Accelerated Processing Speed
            </li>
            <li className="flex items-center text-lg">
              <span className="text-teal mr-3 text-xl">✓</span>
              Quality of Claims Analysis
            </li>
            <li className="flex items-center text-lg">
              <span className="text-teal mr-3 text-xl">✓</span>
              Low Friction Workflows
            </li>
          </ul>
        </div>
      </div>
    </section>

    {/* Claims Lifecycle Section */}
    <section className="bg-white py-16 px-4 rounded-lg mb-8">
      <h2 className="text-3xl font-semibold text-royalBlue text-center mb-12">
        The Claims Lifecycle
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 overflow-x-auto pb-4">
        {[
          { title: "1. Intake", desc: "Converting raw claims data into structured information." },
          { title: "2. Analysis", desc: "Automated extraction and initial assessment." },
          { title: "3. Processing", desc: "Intelligent routing and preliminary analysis." },
          { title: "4. Review", desc: "Expert validation and compliance checks." },
          { title: "5. Resolution", desc: "Decision support and outcome tracking." },
          { title: "6. Reporting", desc: "Analytics and stakeholder insights." },
          { title: "7. Archive", desc: "Secure storage and pattern analysis." }
        ].map((phase, index) => (
          <div
            key={index}
            className="bg-white border border-lightBlue rounded-lg p-4 min-w-[150px] 
                      hover:-translate-y-1 transition-transform duration-300"
          >
            <h3 className="text-royalBlue text-lg mb-2">{phase.title}</h3>
            <p className="text-sm">{phase.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Feature Finder Section */}
    <section className="bg-gray-50 py-16 px-4 rounded-lg mt-12">
      <h2 className="text-3xl font-semibold text-royalBlue text-center mb-8">
        Where Do I Find It?
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full max-w-6xl mx-auto bg-white shadow-sm rounded-lg overflow-hidden">
          <thead className="bg-royalBlue text-ivory">
            <tr>
              <th className="p-4 text-left font-semibold">Mission</th>
              <th className="p-4 text-left font-semibold">Claims Stage</th>
              <th className="p-4 text-left font-semibold">Platform Functionality</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Process New Claims", "Intake and Analysis", "Claims Dashboard"],
              ["Track Claim Status", "Processing and Review", "Active Claims"],
              ["Manage Workflows", "System Management", "Configuration"],
              ["Generate Reports", "Analysis", "Report Designer"],
              ["Access Archives", "Archive", "Claims Repository"],
              ["Analyze Portfolio", "Portfolio Management", "Analytics Hub"],
              ["Monitor Performance", "System Management", "System Health"],
              ["Configure Platform", "Platform Management", "Settings"]
            ].map((row, index) => (
              <tr 
                key={index} 
                className="hover:bg-lightBlue border-b border-lightBlue last:border-b-0"
              >
                <td className="p-4">{row[0]}</td>
                <td className="p-4">{row[1]}</td>
                <td className="p-4">{row[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>

    {/* Footer */}
    <footer className="bg-royalBlue text-ivory text-center py-8 px-4 mt-12 rounded-lg">
      <p>© 2024 Tangible Intelligence, ai. The Tangible AIDA Platform. 
         Built for serious business with a smile. Radical generosity is our motto!</p>
    </footer>
  </div>
);

const PaceAida = () => {
  return <PaceAidaContent />;
};

export default PaceAida;
